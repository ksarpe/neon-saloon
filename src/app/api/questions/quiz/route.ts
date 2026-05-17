import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const { text, answer, options } = (await request.json()) as {
    text: string
    answer: string
    options: string[]
  }

  if (!text?.trim()) return NextResponse.json({ error: 'text is required' }, { status: 400 })
  if (!answer?.trim()) return NextResponse.json({ error: 'answer is required' }, { status: 400 })
  const cleanOptions = Array.isArray(options) ? options.map((o) => o.trim()).filter(Boolean) : []
  const cleanAnswer = answer.trim()

  if (cleanOptions.length < 2) {
    return NextResponse.json({ error: 'at least 2 options required' }, { status: 400 })
  }
  if (!cleanOptions.includes(cleanAnswer)) {
    return NextResponse.json({ error: 'answer must be one of the options' }, { status: 400 })
  }

  const question = await prisma.quizQuestion.create({
    data: {
      text: text.trim(),
      answer: cleanAnswer,
      options: cleanOptions,
      userId,
    },
  })

  return NextResponse.json(question, { status: 201 })
}
