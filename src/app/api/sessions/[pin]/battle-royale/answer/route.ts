import { NextResponse } from 'next/server'
import { getSession, saveSession } from '@/lib/appwrite/sessions'
import { triggerGameEvent } from '@/lib/appwrite/realtime'
import { QUESTION_CATEGORIES } from '@/lib/games/categories'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params

  try {
    const body = await request.json()
    const { playerId, playerName, avatar, answerIndex, answerText } = body as {
      playerId: string
      playerName: string
      avatar: string
      answerIndex: number
      answerText: string
    }

    if (!playerId) return NextResponse.json({ error: 'playerId required' }, { status: 400 })

    const session = await getSession(pin)
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

    const br = session.battleRoyaleData
    if (!br) return NextResponse.json({ error: 'Not a battle-royale session' }, { status: 400 })

    // Ignore answers from already-eliminated players
    if (br.eliminatedPlayers.includes(playerId)) {
      return NextResponse.json({ ok: true, ignored: true })
    }

    const category = QUESTION_CATEGORIES.find((c) => c.id === br.categoryId)
    const question = category?.questions[br.questionIndex]
    const isCorrect = question ? question.options[answerIndex] === question.answer : false

    const answeredAt = Date.now()
    const newAnswer = { playerId, playerName, avatar, answerIndex, answerText, answeredAt, isCorrect }

    // Upsert answer (player can only answer once per round)
    const others = br.roundAnswers.filter((a) => a.playerId !== playerId)
    session.battleRoyaleData = { ...br, roundAnswers: [...others, newAnswer] }
    await saveSession(session)

    await triggerGameEvent(pin, {
      event: 'br-answer-submitted',
      data: { playerId, playerName },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/battle-royale/answer]`, err)
    return NextResponse.json({ error: 'Failed to submit answer' }, { status: 500 })
  }
}
