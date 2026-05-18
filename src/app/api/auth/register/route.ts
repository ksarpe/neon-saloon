import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

import { getPasswordPolicyError } from '@/lib/password-policy'
import { prisma } from '@/lib/prisma'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import {
  INPUT_LIMITS,
  normalizeEmail,
  optionalString,
  readLimitedJson,
  RequestValidationError,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'

export async function POST(req: Request) {
  try {
    const body = await readLimitedJson<{
      email?: unknown
      password?: unknown
      name?: unknown
    }>(req)

    const normalizedEmail = normalizeEmail(body.email)
    const password = requiredString(body.password, 'password', INPUT_LIMITS.password)
    const name = optionalString(body.name, 'name', INPUT_LIMITS.accountName)
    const passwordError = getPasswordPolicyError(password)
    if (passwordError) throw new RequestValidationError(passwordError)

    const ipLimit = consumeRateLimit(`auth:register:ip:${getClientIp(req)}`, {
      limit: 5,
      windowMs: 15 * 60_000,
    })

    if (!ipLimit.allowed) {
      return NextResponse.json(
        { error: 'Za dużo prób. Spróbuj ponownie za chwilę.', retryAfter: ipLimit.retryAfter },
        { status: 429, headers: rateLimitHeaders(ipLimit) }
      )
    }

    const emailLimit = consumeRateLimit(`auth:register:email:${normalizedEmail}`, {
      limit: 3,
      windowMs: 60 * 60_000,
    })

    if (!emailLimit.allowed) {
      return NextResponse.json(
        { error: 'Za dużo prób. Spróbuj ponownie za chwilę.', retryAfter: emailLimit.retryAfter },
        { status: 429, headers: rateLimitHeaders(emailLimit) }
      )
    }

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    })
    if (existing) {
      return NextResponse.json({ error: 'Ten adres e-mail jest już zajęty' }, { status: 409 })
    }

    const hash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: hash,
        name: name ?? normalizedEmail.split('@')[0].slice(0, INPUT_LIMITS.accountName),
      },
    })

    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 })
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error('[POST /api/auth/register]', err)
    return NextResponse.json({ error: 'Coś poszło nie tak' }, { status: 500 })
  }
}
