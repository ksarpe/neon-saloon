import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { getQuestionQuota } from '@/config/usage-limits'
import { authOptions } from '@/lib/auth'
import { getFreshPremiumAccess } from '@/lib/premium-access'
import { prisma } from '@/lib/prisma'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import {
  INPUT_LIMITS,
  readLimitedJson,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const pagination = getQuestionPagination(request)
  const hasPremium = await getFreshPremiumAccess(userId)
  const [questions, total] = await prisma.$transaction([
    prisma.neverQuestion.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.neverQuestion.count({ where: { userId } }),
  ])

  return NextResponse.json(questions, {
    headers: {
      ...pagination.headers,
      ...questionQuotaHeaders(total, getQuestionQuota('never', hasPremium)),
    },
  })
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session.user as { id: string }).id
    const quota = getQuestionQuota('never', await getFreshPremiumAccess(userId))
    if (quota <= 0) {
      return NextResponse.json(
        {
          error: 'Premium access required',
          limit: quota,
          count: 0,
        },
        { status: 403, headers: questionQuotaHeaders(0, quota) }
      )
    }

    const rateLimitResponse = await enforceQuestionCreateLimit(request, 'never', userId)
    if (rateLimitResponse) return rateLimitResponse

    const total = await prisma.neverQuestion.count({ where: { userId } })
    if (total >= quota) {
      return NextResponse.json(
        {
          error: `Osiągnięto limit ${quota} własnych wyznań Nigdy przenigdy.`,
          limit: quota,
          count: total,
        },
        { status: 403, headers: questionQuotaHeaders(total, quota) }
      )
    }

    const body = await readLimitedJson<{ text?: unknown }>(request)
    const text = requiredString(body.text, 'text', INPUT_LIMITS.questionText)

    const question = await prisma.neverQuestion.create({
      data: { text, userId },
    })

    return NextResponse.json(question, {
      status: 201,
      headers: questionQuotaHeaders(total + 1, quota),
    })
  } catch (error) {
    return validationErrorResponse(error) ?? NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

function questionQuotaHeaders(count: number, limit: number) {
  return {
    'X-Question-Count': String(count),
    'X-Question-Limit': String(limit),
    'X-Question-Remaining': String(Math.max(0, limit - count)),
  }
}

function getQuestionPagination(request: Request) {
  const { searchParams } = new URL(request.url)
  const take = parseBoundedInteger(searchParams.get('take'), 1, INPUT_LIMITS.questionPageSize, 50)
  const skip = parseBoundedInteger(searchParams.get('skip'), 0, 100_000, 0)

  return {
    take,
    skip,
    headers: {
      'X-Pagination-Take': String(take),
      'X-Pagination-Skip': String(skip),
    },
  }
}

function parseBoundedInteger(value: string | null, min: number, max: number, fallback: number) {
  if (!value) return fallback
  const parsed = Number(value)
  if (!Number.isInteger(parsed)) return fallback
  return Math.min(max, Math.max(min, parsed))
}

async function enforceQuestionCreateLimit(request: Request, type: string, userId: string) {
  const ipLimit = await consumeRateLimit(`questions:${type}:create:ip:${getClientIp(request)}`, {
    limit: 60,
    windowMs: 60_000,
  })
  if (!ipLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Za dużo prób dodania pytania. Spróbuj ponownie później.',
        retryAfter: ipLimit.retryAfter,
      },
      { status: 429, headers: rateLimitHeaders(ipLimit) }
    )
  }

  const userLimit = await consumeRateLimit(`questions:${type}:create:user:${userId}`, {
    limit: 30,
    windowMs: 60_000,
  })
  if (!userLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Za dużo prób dodania pytania. Spróbuj ponownie później.',
        retryAfter: userLimit.retryAfter,
      },
      { status: 429, headers: rateLimitHeaders(userLimit) }
    )
  }

  return null
}
