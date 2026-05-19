import { NextResponse } from 'next/server'
import { getSession, saveSession } from '@/lib/appwrite/sessions'
import { QUESTION_CATEGORIES } from '@/lib/games/categories'
import { getLimitedQuestionTotal } from '@/lib/games/question-limit'
import { isHostAuthorized } from '@/lib/session-host-auth'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params

  try {
    const session = await getSession(pin)
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    if (!isHostAuthorized(request, session)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const br = session.battleRoyaleData
    if (!br) return NextResponse.json({ error: 'Not a battle-royale session' }, { status: 400 })

    const category = QUESTION_CATEGORIES.find((c) => c.id === br.categoryId)
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
