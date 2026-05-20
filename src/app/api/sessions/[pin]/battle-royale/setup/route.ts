import { NextResponse } from 'next/server'

import { saveSession } from '@/lib/appwrite/sessions'
import { BR_TIMER_SECONDS } from '@/config/game'
import { QUESTION_CATEGORIES } from '@/config/games/categories'
import { createQuestionOrder } from '@/lib/games/question-limit'
import { readLimitedJson, requiredString, validationErrorResponse } from '@/lib/request-validation'
import { requireHostSession } from '@/lib/session-api'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params

  try {
    const hostSession = await requireHostSession(request, pin)
    if (!hostSession.ok) return hostSession.response
    const session = hostSession.value

    const body = await readLimitedJson<{ categoryId?: unknown; timerDuration?: unknown }>(request)
    const categoryId = requiredString(body.categoryId, 'categoryId', 80)
    const timerDuration =
      typeof body.timerDuration === 'number' &&
      Number.isInteger(body.timerDuration) &&
      body.timerDuration >= 5 &&
      body.timerDuration <= 60
        ? body.timerDuration
        : BR_TIMER_SECONDS
    const category = QUESTION_CATEGORIES.find((c) => c.id === categoryId)
    if (!category) return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    const questionOrder = createQuestionOrder(category.questions.length)

    session.battleRoyaleData = {
      categoryId,
      questionOrder,
      questionIndex: 0,
      eliminatedPlayers: [],
      roundAnswers: [],
      timerDuration,
    }
    await saveSession(session)

    return NextResponse.json({
      ok: true,
      categoryId,
      questionOrder,
      totalQuestions: questionOrder.length,
    })
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error(`[POST /api/sessions/${pin}/battle-royale/setup]`, err)
    return NextResponse.json({ error: 'Failed to setup battle royale' }, { status: 500 })
  }
}
