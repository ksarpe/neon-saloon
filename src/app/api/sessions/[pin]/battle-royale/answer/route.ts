import { NextResponse } from 'next/server'

import { getQuestionCategorySelection } from '@/config/games/category-selection'
import { triggerGameEvent } from '@/lib/appwrite/realtime'
import type { BRAnswer } from '@/lib/appwrite/sessions'
import { withSessionTransaction } from '@/lib/appwrite/sessions'
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
import { forbiddenResponse, sessionNotFoundResponse } from '@/lib/session-api'
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

    const result = await withSessionTransaction(pin, async (store) => {
      const session = await store.getSession(pin)
      if (!session) return { response: sessionNotFoundResponse() }

      const player = getAuthorizedPlayer(request, session, playerId)
      if (!player) return { response: forbiddenResponse() }

      const rateLimitResponse = await enforceSessionActionRateLimit(
        'battleRoyaleAnswer',
        pin,
        player.playerId
      )
      if (rateLimitResponse) return { response: rateLimitResponse }

      const br = session.battleRoyaleData
      if (!br) {
        return {
          response: NextResponse.json({ error: 'Not a battle-royale session' }, { status: 400 }),
        }
      }
      if (!br.roundStartTime) {
        return { response: NextResponse.json({ error: 'No active round' }, { status: 400 }) }
      }

      // Ignore answers from already-eliminated players.
      if (br.eliminatedPlayers.includes(playerId)) {
        return { response: NextResponse.json({ ok: true, ignored: true }) }
      }

      const category = getQuestionCategorySelection(br.categoryId)
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
      await store.saveSession(session)
      return { playerName: player.playerName }
    })

    if ('response' in result) return result.response

    await triggerGameEvent(pin, {
      event: 'br-answer-submitted',
      data: { playerId, playerName: result.playerName },
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
