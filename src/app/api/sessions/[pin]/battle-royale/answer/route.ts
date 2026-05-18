import { NextResponse } from 'next/server'

import { triggerGameEvent } from '@/lib/appwrite/realtime'
import { getSession, saveSession } from '@/lib/appwrite/sessions'
import { QUESTION_CATEGORIES } from '@/lib/games/categories'
import {
  INPUT_LIMITS,
  optionalString,
  readLimitedJson,
  requiredInteger,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import { getAuthorizedPlayer } from '@/lib/session-player-auth'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params

  try {
    const body = await readLimitedJson<{
      playerId?: unknown
      answerIndex?: unknown
      answerText?: unknown
    }>(request)
    const playerId = requiredString(body.playerId, 'playerId', 80)
    const answerIndex = requiredInteger(body.answerIndex, 'answerIndex', -1, 20)
    const answerText = optionalString(body.answerText, 'answerText', INPUT_LIMITS.answerText) ?? ''

    const session = await getSession(pin)
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    const player = getAuthorizedPlayer(request, session, playerId)
    if (!player) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

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
    const newAnswer = {
      playerId,
      playerName: player.playerName,
      avatar: player.avatar,
      answerIndex,
      answerText,
      answeredAt,
      isCorrect,
    }

    // Upsert answer (player can only answer once per round)
    const others = br.roundAnswers.filter((a) => a.playerId !== playerId)
    session.battleRoyaleData = { ...br, roundAnswers: [...others, newAnswer] }
    await saveSession(session)

    await triggerGameEvent(pin, {
      event: 'br-answer-submitted',
      data: { playerId, playerName: player.playerName },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error(`[POST /api/sessions/${pin}/battle-royale/answer]`, err)
    return NextResponse.json({ error: 'Failed to submit answer' }, { status: 500 })
  }
}
