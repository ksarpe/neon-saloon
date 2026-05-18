import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  boundedStringArray,
  INPUT_LIMITS,
  readLimitedJson,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const questions = await prisma.quizQuestion.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(questions)
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session.user as { id: string }).id
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

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    return validationErrorResponse(error) ?? NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
