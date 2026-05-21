import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { getQuestionQuota } from '@/config/usage-limits'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import {
  boundedStringArray,
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
  const [questions, total] = await prisma.$transaction([
    prisma.quizQuestion.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: pagination.skip,
      take: pagination.take,
    }),
    prisma.quizQuestion.count({ where: { userId } }),
  ])

  return NextResponse.json(questions, {
    headers: {
      ...pagination.headers,
      ...questionQuotaHeaders(total, getQuestionQuota('quiz', Boolean(session.user.isPremium))),
    },
  })
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session.user as { id: string }).id
    const rateLimitResponse = await enforceQuestionCreateLimit(request, 'quiz', userId)
    if (rateLimitResponse) return rateLimitResponse

    const quota = getQuestionQuota('quiz', Boolean(session.user.isPremium))
    const total = await prisma.quizQuestion.count({ where: { userId } })
    if (total >= quota) {
      return NextResponse.json(
        {
          error: session.user.isPremium
            ? `Osiągnięto limit ${quota} pytań quizowych.`
            : `Na darmowym koncie możesz dodać maksymalnie ${quota} pytań quizowych. Odblokuj PRO, żeby dodać więcej.`,
          limit: quota,
          count: total,
        },
        { status: 403, headers: questionQuotaHeaders(total, quota) }
      )
    }

    const body = await readLimitedJson<{ text?: unknown; answer?: unknown; options?: unknown }>(
      request
    )
    const text = requiredString(body.text, 'text', INPUT_LIMITS.questionText)
    const cleanAnswer = requiredString(body.answer, 'answer', INPUT_LIMITS.quizAnswer)
    const cleanOptions = boundedStringArray(
      body.options,
      'options',
      INPUT_LIMITS.quizOptions,
      INPUT_LIMITS.quizOption
    )

    if (cleanOptions.length < 2) {
      return NextResponse.json({ error: 'at least 2 options required' }, { status: 400 })
    }
    if (!cleanOptions.includes(cleanAnswer)) {
      return NextResponse.json({ error: 'answer must be one of the options' }, { status: 400 })
    }

    const question = await prisma.quizQuestion.create({
      data: {
        text,
        answer: cleanAnswer,
        options: cleanOptions,
        userId,
      },
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
