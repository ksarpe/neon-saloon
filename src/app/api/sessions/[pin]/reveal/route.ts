import { NextResponse } from 'next/server'

import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { getSession } from '@/lib/appwrite/sessions'
import type { ScoreEntry, TeamScoreEntry } from '@/lib/game-types'
import {
  INPUT_LIMITS,
  optionalString,
  readLimitedJson,
  RequestValidationError,
  requiredInteger,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
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
      answerIndex: requiredInteger(row.answerIndex, `votes[${index}].answerIndex`, -1, 20),
      answerText:
        optionalString(row.answerText, `votes[${index}].answerText`, INPUT_LIMITS.answerText) ?? '',
    }
  })
}

function sanitizeScoreEntries(value: unknown): ScoreEntry[] {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value) || value.length > INPUT_LIMITS.scoreEntries) {
    throw new RequestValidationError('scores is invalid')
  }

  return value.map((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      throw new RequestValidationError(`scores[${index}] must be an object`)
    }

    const row = entry as Record<string, unknown>
    return {
      playerId: requiredString(row.playerId, `scores[${index}].playerId`, 80),
      playerName: requiredString(
        row.playerName,
        `scores[${index}].playerName`,
        INPUT_LIMITS.playerName
      ),
      score: finiteNumber(row.score, `scores[${index}].score`),
      drinks:
        row.drinks === undefined ? undefined : finiteNumber(row.drinks, `scores[${index}].drinks`),
      playerTeamId:
        optionalString(row.playerTeamId, `scores[${index}].playerTeamId`, 80) ?? undefined,
      playerTeamName:
        optionalString(
          row.playerTeamName,
          `scores[${index}].playerTeamName`,
          INPUT_LIMITS.teamName
        ) ?? undefined,
    }
  })
}

function sanitizeTeamScoreEntries(value: unknown): TeamScoreEntry[] {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value) || value.length > INPUT_LIMITS.scoreEntries) {
    throw new RequestValidationError('teamScores is invalid')
  }

  return value.map((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      throw new RequestValidationError(`teamScores[${index}] must be an object`)
    }

    const row = entry as Record<string, unknown>
    return {
      teamId: requiredString(row.teamId, `teamScores[${index}].teamId`, 80),
      teamName: requiredString(
        row.teamName,
        `teamScores[${index}].teamName`,
        INPUT_LIMITS.teamName
      ),
      score: finiteNumber(row.score, `teamScores[${index}].score`),
    }
  })
}

function finiteNumber(value: unknown, field: string) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new RequestValidationError(`${field} must be a finite number`)
  }

  if (value < -10_000 || value > 10_000) {
    throw new RequestValidationError(`${field} is out of range`)
  }

  return value
}
