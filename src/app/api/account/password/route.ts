import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { getPasswordPolicyError } from '@/lib/password-policy'
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
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const ipLimit = await consumeRateLimit(`auth:change-password:ip:${getClientIp(request)}`, {
      limit: 10,
      windowMs: 15 * 60_000,
    })

    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: 'Za dużo prób. Spróbuj ponownie za chwilę.', retryAfter: ipLimit.retryAfter },
        { status: 429, headers: rateLimitHeaders(ipLimit) }
      )
    }

    const userLimit = await consumeRateLimit(`auth:change-password:user:${session.user.id}`, {
      limit: 5,
      windowMs: 15 * 60_000,
    })

    if (!userLimit.allowed) {
      return NextResponse.json(
        { error: 'Za dużo prób. Spróbuj ponownie za chwilę.', retryAfter: userLimit.retryAfter },
        { status: 429, headers: rateLimitHeaders(userLimit) }
      )
    }

    const body = await readLimitedJson<{
      currentPassword?: unknown
      newPassword?: unknown
    }>(request)
    const currentPassword = requiredString(
      body.currentPassword,
      'currentPassword',
      INPUT_LIMITS.password
    )
    const newPassword = requiredString(body.newPassword, 'newPassword', INPUT_LIMITS.password)
    const passwordError = getPasswordPolicyError(newPassword)
    if (passwordError) throw new RequestValidationError(passwordError)

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user?.password) {
      return NextResponse.json(
        { error: 'Nie można zmienić hasła dla tego konta.' },
        { status: 400 }
      )
    }

    const passwordValid = await bcrypt.compare(currentPassword, user.password)
    if (!passwordValid) {
      return NextResponse.json({ error: 'Obecne hasło jest nieprawidłowe.' }, { status: 400 })
    }

    const nextPasswordHash = await bcrypt.hash(newPassword, 12)
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: nextPasswordHash,
        sessionVersion: { increment: 1 },
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return validationErrorResponse(error) ?? NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
