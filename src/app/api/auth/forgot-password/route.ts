import { after, NextResponse } from 'next/server'

import { getAppUrl } from '@/lib/app-url'
import { sendPasswordResetEmail } from '@/lib/email'
import {
  createPasswordResetToken,
  getPasswordResetExpiry,
  hashPasswordResetToken,
} from '@/lib/password-reset'
import { prisma } from '@/lib/prisma'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import { normalizeEmail, readLimitedJson, validationErrorResponse } from '@/lib/request-validation'

const GENERIC_FORGOT_PASSWORD_RESPONSE = {
  ok: true as const,
  message: 'Jeśli konto istnieje, wysłaliśmy link do resetu hasła.',
}

const GLOBAL_FORGOT_PASSWORD_LIMITS = [
  { suffix: 'burst', limit: 30, windowMs: 60_000 },
  { suffix: 'sustained', limit: 200, windowMs: 60 * 60_000 },
]

export async function POST(request: Request) {
  try {
    for (const rateLimit of GLOBAL_FORGOT_PASSWORD_LIMITS) {
      const result = await consumeRateLimit(
        `auth:forgot-password:global:${rateLimit.suffix}`,
        rateLimit
      )
      if (!result.allowed) {
        return NextResponse.json(
          {
            error: 'Chwilowo zbyt dużo próśb o reset hasła. Spróbuj ponownie później.',
            retryAfter: result.retryAfter,
          },
          { status: 429, headers: rateLimitHeaders(result) }
        )
      }
    }

    const body = await readLimitedJson<{ email?: unknown }>(request)
    const email = normalizeEmail(body.email)

    const ipLimit = await consumeRateLimit(`auth:forgot-password:ip:${getClientIp(request)}`, {
      limit: 5,
      windowMs: 15 * 60_000,
    })

    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: 'Za dużo prób. Spróbuj ponownie za chwilę.', retryAfter: ipLimit.retryAfter },
        { status: 429, headers: rateLimitHeaders(ipLimit) }
      )
    }

    const emailLimit = await consumeRateLimit(`auth:forgot-password:email:${email}`, {
      limit: 3,
      windowMs: 60 * 60_000,
    })

    if (!emailLimit.allowed) {
      return NextResponse.json(
        { error: 'Za dużo prób. Spróbuj ponownie za chwilę.', retryAfter: emailLimit.retryAfter },
        { status: 429, headers: rateLimitHeaders(emailLimit) }
      )
    }

    // Defer the user lookup + token write + email delivery to `after()` so the
    // response timing is identical whether or not the email is registered.
    // Otherwise an attacker can enumerate accounts by measuring how long the
    // request takes (registered = 3 DB queries + Resend round-trip; unknown =
    // single SELECT). The generic 200 below is also the only thing the client
    // ever sees — no `devResetUrl` field, no error specifics — so misconfigured
    // production deployments cannot accidentally leak the reset link in JSON.
    after(() => processForgotPasswordRequest(email))

    return NextResponse.json(GENERIC_FORGOT_PASSWORD_RESPONSE)
  } catch (error) {
    const validationResponse = validationErrorResponse(error)
    if (validationResponse) return validationResponse

    console.error('[POST /api/auth/forgot-password]', error)
    // Even on a hard failure we keep the response generic so we don't reveal
    // anything to a probe. The error has already been logged for us.
    return NextResponse.json(GENERIC_FORGOT_PASSWORD_RESPONSE)
  }
}

async function processForgotPasswordRequest(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    })
    if (!user) return

    const token = createPasswordResetToken()
    const tokenHash = hashPasswordResetToken(token)
    const expiresAt = getPasswordResetExpiry()
    const resetUrl = `${getAppUrl()}/login?resetToken=${encodeURIComponent(token)}`
    const now = new Date()

    await prisma.$transaction([
      prisma.passwordResetToken.deleteMany({
        where: {
          userId: user.id,
          OR: [{ expiresAt: { lte: now } }, { usedAt: { not: null } }],
        },
      }),
      prisma.passwordResetToken.updateMany({
        where: {
          userId: user.id,
          usedAt: null,
          expiresAt: { gt: now },
        },
        data: { usedAt: now },
      }),
      prisma.passwordResetToken.create({
        data: {
          tokenHash,
          expiresAt,
          userId: user.id,
        },
      }),
    ])

    await sendPasswordResetEmail({
      to: user.email,
      resetUrl,
    })
  } catch (error) {
    // Background task — we cannot surface this to the caller. Log loudly so a
    // broken email pipeline shows up in dashboards instead of silently dropping
    // password resets.
    console.error('[forgot-password background]', error)
  }
}
