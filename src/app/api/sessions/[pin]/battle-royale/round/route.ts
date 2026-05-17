import { NextResponse } from 'next/server'
import { getSession, saveSession } from '@/lib/appwrite/sessions'
import { triggerGameEvent } from '@/lib/appwrite/realtime'
import { QUESTION_CATEGORIES } from '@/lib/games/categories'
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
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 400 })

    const question = category.questions[br.questionIndex]
    if (!question) return NextResponse.json({ error: 'No more questions' }, { status: 400 })

    const roundStartTime = Date.now()

    session.battleRoyaleData = {
      ...br,
      roundAnswers: [],
      roundStartTime,
    }
    session.status = 'active'
    await saveSession(session)

    const alivePlayers = session.players
      .filter((p) => !br.eliminatedPlayers.includes(p.playerId))
      .map((p) => p.playerId)

    await triggerGameEvent(pin, {
      event: 'br-round-start',
      data: {
        questionIndex: br.questionIndex,
        questionText: question.text,
        options: question.options,
        timerDuration: br.timerDuration,
        roundStartTime,
        alivePlayers,
      },
    })

    return NextResponse.json({ ok: true, questionIndex: br.questionIndex })
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/battle-royale/round]`, err)
    return NextResponse.json({ error: 'Failed to start round' }, { status: 500 })
  }
}
