import { NextResponse } from 'next/server'

import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { getSession } from '@/lib/appwrite/sessions'
import type { ScoreEntry } from '@/lib/game-types'
import { HIGHLOW_QUESTIONS } from '@/lib/games/highlow'
import {
  INPUT_LIMITS,
  optionalString,
  readLimitedJson,
  RequestValidationError,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import { enforceSessionActionRateLimit } from '@/lib/session-action-rate-limit'
import { getAuthorizedPlayer } from '@/lib/session-player-auth'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params
  try {
    const body = await readLimitedJson<{
      playerId?: unknown
      vote?: unknown
      currentScores?: unknown
    }>(request)
    const playerId = requiredString(body.playerId, 'playerId', 80)
    const vote = requiredString(body.vote, 'vote', 8) as 'mniej' | 'wiecej'
    if (vote !== 'mniej' && vote !== 'wiecej') {
      return NextResponse.json({ error: 'Invalid vote' }, { status: 400 })
    }
    const currentScores = sanitizeScoreEntries(body.currentScores)

    const session = await getSession(pin)
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    const player = getAuthorizedPlayer(request, session, playerId)
    if (!player) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const rateLimitResponse = enforceSessionActionRateLimit('highlowVote', pin, player.playerId)
    if (rateLimitResponse) return rateLimitResponse

    const hl = session.highlowData
    if (!hl) return NextResponse.json({ error: 'No active round' }, { status: 400 })
    if (hl.votingCaptainId !== player.playerId) {
      return NextResponse.json({ error: 'Not the voting captain' }, { status: 403 })
    }
    if (!hl.currentNumber) {
      return NextResponse.json({ error: 'No number submitted yet' }, { status: 400 })
    }

    const question = HIGHLOW_QUESTIONS[hl.questionIndex % HIGHLOW_QUESTIONS.length]
    const guess = parseFloat(hl.currentNumber)
    const correctVote: 'mniej' | 'wiecej' = guess < question.answer ? 'wiecej' : 'mniej'
    // edge case: exact guess → guessing team wins
    const guessedExactly = guess === question.answer
    const captainWon = guessedExactly ? false : vote === correctVote

    const winningTeamId = captainWon ? hl.votingTeamId : hl.guessingTeamId
    const winningTeam = session.teams.find((t) => t.teamId === winningTeamId)
    const winningTeamName = winningTeam?.teamName ?? 'Nieznana drużyna'

    // Award +1 to every player on the winning team
    const winningPlayers = session.players.filter((p) => p.teamId === winningTeamId)
    const updatedScores = [...currentScores]
    winningPlayers.forEach((p) => {
      const idx = updatedScores.findIndex((s) => s.playerId === p.playerId)
      if (idx > -1) {
        updatedScores[idx] = { ...updatedScores[idx], score: updatedScores[idx].score + 1 }
      } else {
        updatedScores.push({
          playerId: p.playerId,
          playerName: p.playerName,
          score: 1,
          playerTeamId: p.teamId ?? undefined,
          playerTeamName: p.teamName ?? undefined,
        })
      }
    })

    await triggerSessionEvent(pin, {
      event: 'highlow-round-result',
      data: {
        correctAnswer: question.answer,
        unit: question.unit,
        guessingTeamGuess: guess,
        correctVote: guessedExactly ? vote : correctVote,
        captainVote: vote,
        winningTeamId,
        winningTeamName,
        scores: updatedScores,
      },
    })

    return NextResponse.json({ ok: true, winningTeamId, scores: updatedScores })
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error(`[POST /api/sessions/${pin}/highlow/vote]`, err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

function sanitizeScoreEntries(value: unknown): ScoreEntry[] {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value)) throw new RequestValidationError('currentScores must be an array')
  if (value.length > INPUT_LIMITS.scoreEntries) {
    throw new RequestValidationError(
      `currentScores must contain at most ${INPUT_LIMITS.scoreEntries} items`
    )
  }

  return value.map((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      throw new RequestValidationError(`currentScores[${index}] must be an object`)
    }

    const row = entry as Record<string, unknown>
    const score = finiteNumber(row.score, `currentScores[${index}].score`)
    const drinks =
      row.drinks === undefined
        ? undefined
        : finiteNumber(row.drinks, `currentScores[${index}].drinks`)

    return {
      playerId: requiredString(row.playerId, `currentScores[${index}].playerId`, 80),
      playerName: requiredString(
        row.playerName,
        `currentScores[${index}].playerName`,
        INPUT_LIMITS.playerName
      ),
      score,
      drinks,
      playerTeamId:
        optionalString(row.playerTeamId, `currentScores[${index}].playerTeamId`, 80) ?? undefined,
      playerTeamName:
        optionalString(
          row.playerTeamName,
          `currentScores[${index}].playerTeamName`,
          INPUT_LIMITS.teamName
        ) ?? undefined,
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
