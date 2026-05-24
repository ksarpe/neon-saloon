import { NextResponse } from 'next/server'

import { HIGHLOW_QUESTIONS } from '@/config/games/highlow'
import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { saveSession } from '@/lib/appwrite/sessions'
import { seededShuffleItems } from '@/lib/games/question-limit'
import { readLimitedJson, requiredString, validationErrorResponse } from '@/lib/request-validation'
import { enforceSessionActionRateLimit } from '@/lib/session-action-rate-limit'
import { requirePlayerSession } from '@/lib/session-api'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params
  try {
    const body = await readLimitedJson<{
      playerId?: unknown
      vote?: unknown
    }>(request)
    const playerId = requiredString(body.playerId, 'playerId', 80)
    const vote = requiredString(body.vote, 'vote', 8) as 'mniej' | 'wiecej'
    if (vote !== 'mniej' && vote !== 'wiecej') {
      return NextResponse.json({ error: 'Invalid vote' }, { status: 400 })
    }

    const playerSession = await requirePlayerSession(request, pin, playerId)
    if (!playerSession.ok) return playerSession.response
    const { player, session } = playerSession.value

    const rateLimitResponse = await enforceSessionActionRateLimit(
      'highlowVote',
      pin,
      player.playerId
    )
    if (rateLimitResponse) return rateLimitResponse

    const hl = session.highlowData
    if (!hl) return NextResponse.json({ error: 'No active round' }, { status: 400 })
    if (hl.votingCaptainId !== player.playerId) {
      return NextResponse.json({ error: 'Not the voting captain' }, { status: 403 })
    }
    if (!hl.currentNumber) {
      return NextResponse.json({ error: 'No number submitted yet' }, { status: 400 })
    }

    const question =
      seededShuffleItems(HIGHLOW_QUESTIONS, pin)[hl.questionIndex % HIGHLOW_QUESTIONS.length]
    const guess = parseFloat(hl.currentNumber)
    const correctVote: 'mniej' | 'wiecej' = guess < question.answer ? 'wiecej' : 'mniej'
    // Exact guess means the guessing team wins immediately.
    const guessedExactly = guess === question.answer
    const captainWon = guessedExactly ? false : vote === correctVote

    const winningTeamId = captainWon ? hl.votingTeamId : hl.guessingTeamId
    const winningTeam = session.teams.find((t) => t.teamId === winningTeamId)
    const winningTeamName = winningTeam?.teamName ?? 'Nieznana banda'

    const winningPlayers = session.players.filter((p) => p.teamId === winningTeamId)
    const updatedScores = [...(session.scores ?? [])]
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

    const result = {
      correctAnswer: question.answer,
      unit: question.unit,
      guessingTeamGuess: guess,
      correctVote: guessedExactly ? vote : correctVote,
      captainVote: vote,
      winningTeamId,
      winningTeamName,
      scores: updatedScores,
    }

    session.scores = updatedScores
    session.highlowData = { ...hl, currentResult: result }
    await saveSession(session)

    await triggerSessionEvent(pin, {
      event: 'highlow-round-result',
      data: result,
    })

    return NextResponse.json({ ok: true, result })
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error(`[POST /api/sessions/${pin}/highlow/vote]`, err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
