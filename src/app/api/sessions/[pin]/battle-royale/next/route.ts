import { NextResponse } from 'next/server'

import { getQuestionCategorySelection } from '@/config/games/category-selection'
import { saveSession } from '@/lib/appwrite/sessions'
import { getLimitedQuestionTotal } from '@/lib/games/question-limit'
import { enforceSessionActionRateLimit } from '@/lib/session-action-rate-limit'
import { requireHostSession } from '@/lib/session-api'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params

  try {
    const hostSession = await requireHostSession(request, pin)
    if (!hostSession.ok) return hostSession.response
    const rateLimitResponse = await enforceSessionActionRateLimit('hostAction', pin, 'host')
    if (rateLimitResponse) return rateLimitResponse
    const session = hostSession.value

    const br = session.battleRoyaleData
    if (!br) return NextResponse.json({ error: 'Not a battle-royale session' }, { status: 400 })

    const category = getQuestionCategorySelection(br.categoryId)
    const nextIndex = br.questionIndex + 1
    const hasMore = category
      ? nextIndex < getLimitedQuestionTotal(category.questions.length, br.questionOrder)
      : false

    if (!hasMore) {
      session.status = 'finished'
      await saveSession(session)
      return NextResponse.json({ ok: true, finished: true })
    }

    session.battleRoyaleData = {
      ...br,
      questionIndex: nextIndex,
      roundAnswers: [],
      roundStartTime: undefined,
    }
    await saveSession(session)

    return NextResponse.json({ ok: true, questionIndex: nextIndex })
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/battle-royale/next]`, err)
    return NextResponse.json({ error: 'Failed to advance round' }, { status: 500 })
  }
}
