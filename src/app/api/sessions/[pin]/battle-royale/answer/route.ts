import { NextResponse } from 'next/server'

import { triggerGameEvent } from '@/lib/appwrite/realtime'
import type { BRAnswer } from '@/lib/appwrite/sessions'
import { saveSession } from '@/lib/appwrite/sessions'
import { QUESTION_CATEGORIES } from '@/config/games/categories'
import { getOrderedQuestion } from '@/lib/games/question-limit'
import {
  INPUT_LIMITS,
  optionalString,
  readLimitedJson,
  requiredInteger,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import { enforceSessionActionRateLimit } from '@/lib/session-action-rate-limit'
import { requirePlayerSession } from '@/lib/session-api'

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

    const playerSession = await requirePlayerSession(request, pin, playerId)
    if (!playerSession.ok) return playerSession.response
    const { player, session } = playerSession.value

    const rateLimitResponse = enforceSessionActionRateLimit(
      'battleRoyaleAnswer',
      pin,
      player.playerId
    )
    if (rateLimitResponse) return rateLimitResponse

    const br = session.battleRoyaleData
    if (!br) return NextResponse.json({ error: 'Not a battle-royale session' }, { status: 400 })
    if (!br.roundStartTime) return NextResponse.json({ error: 'No active round' }, { status: 400 })

    // Ignore answers from already-eliminated players
    if (br.eliminatedPlayers.includes(playerId)) {
      return NextResponse.json({ ok: true, ignored: true })
    }

    const category = QUESTION_CATEGORIES.find((c) => c.id === br.categoryId)
    const question = category
      ? getOrderedQuestion(category.questions, br.questionIndex, br.questionOrder)
      : undefined
    const isCorrect = question ? question.options[answerIndex] === question.answer : false

    const answeredAt = Date.now()
    const newAnswer: BRAnswer = {
      playerId,
      playerName: player.playerName,
      avatar: player.avatar,
      answerIndex,
      answerText,
      answeredAt,
      isCorrect,
    }

    const alivePlayerIds = session.players
      .filter((p) => !br.eliminatedPlayers.includes(p.playerId))
      .map((p) => p.playerId)

    // Upsert answer and keep at most one answer per alive player for the current round.
    session.battleRoyaleData = {
      ...br,
      roundAnswers: upsertRoundAnswer(br.roundAnswers, newAnswer, alivePlayerIds),
    }
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

function upsertRoundAnswer(
  existing: BRAnswer[] | undefined,
  answer: BRAnswer,
  alivePlayerIds: string[]
) {
  const alive = new Set(alivePlayerIds)
  const currentAnswers = (existing ?? []).filter(
    (entry) => entry.playerId !== answer.playerId && alive.has(entry.playerId)
  )

  return [...currentAnswers, answer]
}
