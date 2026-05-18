import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

import { getPasswordPolicyError } from '@/lib/password-policy'
import { hashPasswordResetToken } from '@/lib/password-reset'
import { prisma } from '@/lib/prisma'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import {
  INPUT_LIMITS,
  readLimitedJson,
  RequestValidationError,
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
    const passwordError = getPasswordPolicyError(password)
    if (passwordError) throw new RequestValidationError(passwordError)

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

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.$transaction(async (tx) => {
      const now = new Date()
      const resetToken = await tx.passwordResetToken.findUnique({
        where: { tokenHash },
        select: {
          id: true,
          userId: true,
          expiresAt: true,
          usedAt: true,
        },
      })

      if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= now) {
        throw new RequestValidationError('Link resetujący wygasł albo został już wykorzystany.')
      }

      const claimedToken = await tx.passwordResetToken.updateMany({
        where: {
          id: resetToken.id,
          usedAt: null,
          expiresAt: { gt: now },
        },
        data: { usedAt: now },
      })

      if (claimedToken.count !== 1) {
        throw new RequestValidationError('Link resetujący wygasł albo został już wykorzystany.')
      }

      await tx.user.update({
        where: { id: resetToken.userId },
        data: {
          password: passwordHash,
          sessionVersion: { increment: 1 },
        },
      })
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return validationErrorResponse(error) ?? NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
