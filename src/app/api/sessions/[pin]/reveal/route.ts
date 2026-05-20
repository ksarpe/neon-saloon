import { NextResponse } from 'next/server'

import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { updateSession } from '@/lib/appwrite/sessions'
import {
  INPUT_LIMITS,
  optionalString,
  readLimitedJson,
  RequestValidationError,
  requiredInteger,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import { requireHostSession } from '@/lib/session-api'
import { sanitizeScoreEntries, sanitizeTeamScoreEntries } from '@/lib/session-payloads'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params

  try {
    const hostSession = await requireHostSession(request, pin)
    if (!hostSession.ok) return hostSession.response

    const body = await readLimitedJson<{
      cardIndex?: unknown
      correctAnswer?: unknown
      votes?: unknown
      scores?: unknown
      teamScores?: unknown
    }>(request)
    const cardIndex = requiredInteger(body.cardIndex, 'cardIndex', 0, 10_000)
    const correctAnswer =
      optionalString(body.correctAnswer, 'correctAnswer', INPUT_LIMITS.quizAnswer) ?? undefined
    const votes = sanitizeVotes(body.votes)
    const scores = sanitizeScoreEntries(body.scores)
    const teamScores = sanitizeTeamScoreEntries(body.teamScores)

    // Persist scores + reveal snapshot so the host can refresh mid-game without
    // losing accumulated points or the reveal view.
    await updateSession(pin, {
      scores,
      teamScores,
      currentReveal: {
        cardIndex,
        correctAnswer,
        votes: votes.map((v) => ({
          playerId: v.playerId,
          playerName: v.playerName,
          teamId: v.teamId ?? null,
          teamName: v.teamName ?? null,
          answerIndex: v.answerIndex,
          answerText: v.answerText,
        })),
      },
    })

    await triggerSessionEvent(pin, {
      event: 'votes-revealed',
      data: { cardIndex, correctAnswer, votes, scores, teamScores },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error(`[POST /api/sessions/${pin}/reveal]`, err)
    return NextResponse.json({ error: 'Failed to reveal votes' }, { status: 500 })
  }
}

function sanitizeVotes(value: unknown) {
  if (!Array.isArray(value)) throw new RequestValidationError('votes must be an array')
  if (value.length > INPUT_LIMITS.scoreEntries) {
    throw new RequestValidationError(
      `votes must contain at most ${INPUT_LIMITS.scoreEntries} items`
    )
  }

  return value.map((vote, index) => {
    if (!vote || typeof vote !== 'object') {
      throw new RequestValidationError(`votes[${index}] must be an object`)
    }

    const row = vote as Record<string, unknown>
    return {
      playerId: requiredString(row.playerId, `votes[${index}].playerId`, 80),
      playerName: requiredString(
        row.playerName,
        `votes[${index}].playerName`,
        INPUT_LIMITS.playerName
      ),
      teamId: optionalString(row.teamId, `votes[${index}].teamId`, 80),
      teamName: optionalString(row.teamName, `votes[${index}].teamName`, INPUT_LIMITS.teamName),
      answerIndex: requiredInteger(row.answerIndex, `votes[${index}].answerIndex`, -2, 20),
      answerText:
        optionalString(row.answerText, `votes[${index}].answerText`, INPUT_LIMITS.answerText) ?? '',
    }
  })
}
