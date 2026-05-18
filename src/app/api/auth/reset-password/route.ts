import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

import { hashPasswordResetToken } from '@/lib/password-reset'
import { prisma } from '@/lib/prisma'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import {
  INPUT_LIMITS,
  readLimitedJson,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'

export async function POST(request: Request) {
  try {
    const body = await readLimitedJson<{
      token?: unknown
      password?: unknown
    }>(request)
    const token = requiredString(body.token, 'token', INPUT_LIMITS.resetToken)
    const password = requiredString(body.password, 'password', INPUT_LIMITS.password)

    if (password.length < 6) {
      return NextResponse.json({ error: 'Hasło musi mieć minimum 6 znaków.' }, { status: 400 })
    }

    const ipLimit = consumeRateLimit(`auth:reset-password:ip:${getClientIp(request)}`, {
      limit: 10,
      windowMs: 15 * 60_000,
    })

    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: 'Za dużo prób. Spróbuj ponownie za chwilę.', retryAfter: ipLimit.retryAfter },
        { status: 429, headers: rateLimitHeaders(ipLimit) }
      )
    }

    const tokenHash = hashPasswordResetToken(token)
    const tokenLimit = consumeRateLimit(`auth:reset-password:token:${tokenHash}`, {
      limit: 5,
      windowMs: 15 * 60_000,
    })

    if (!tokenLimit.allowed) {
      return NextResponse.json(
        { error: 'Za dużo prób. Spróbuj ponownie za chwilę.', retryAfter: tokenLimit.retryAfter },
        { status: 429, headers: rateLimitHeaders(tokenLimit) }
      )
    }

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        userId: true,
        expiresAt: true,
        usedAt: true,
      },
    })

    if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date()) {
      return NextResponse.json(
        { error: 'Link resetujący wygasł albo został już wykorzystany.' },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: {
          password: passwordHash,
          sessionVersion: { increment: 1 },
        },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (error) {
    return validationErrorResponse(error) ?? NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
