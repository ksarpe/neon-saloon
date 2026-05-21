import { NextResponse } from 'next/server'

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

export async function POST(request: Request) {
  try {
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

    const genericResponse = {
      ok: true,
      message: 'Jeśli konto istnieje, wysłaliśmy link do resetu hasła.',
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    })

    if (!user) {
      return NextResponse.json(genericResponse)
    }

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

    const result = await sendPasswordResetEmail({
      to: user.email,
      resetUrl,
    })

    return NextResponse.json({
      ...genericResponse,
      devResetUrl: result.devUrl,
    })
  } catch (error) {
    const validationResponse = validationErrorResponse(error)
    if (validationResponse) return validationResponse

    console.error('[POST /api/auth/forgot-password]', error)
    return NextResponse.json(
      { error: 'Nie udało się wysłać maila resetującego hasło.' },
      { status: 500 }
    )
  }
}
