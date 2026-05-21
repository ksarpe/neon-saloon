import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
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
  const questions = await prisma.neverQuestion.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    skip: pagination.skip,
    take: pagination.take,
  })

  return NextResponse.json(questions, { headers: pagination.headers })
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!session.user.isPremium) {
      return NextResponse.json({ error: 'Premium access required' }, { status: 403 })
    }

    const userId = (session.user as { id: string }).id
    const rateLimitResponse = await enforceQuestionCreateLimit(request, 'never', userId)
    if (rateLimitResponse) return rateLimitResponse

    const body = await readLimitedJson<{ text?: unknown }>(request)
    const text = requiredString(body.text, 'text', INPUT_LIMITS.questionText)

    const question = await prisma.neverQuestion.create({
      data: { text, userId },
    })

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    return validationErrorResponse(error) ?? NextResponse.json({ error: 'Failed' }, { status: 500 })
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
