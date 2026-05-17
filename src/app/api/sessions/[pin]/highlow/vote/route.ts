import { NextResponse } from 'next/server'
import { getSession } from '@/lib/appwrite/sessions'
import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { HIGHLOW_QUESTIONS } from '@/lib/games/highlow'
import { getAuthorizedPlayer } from '@/lib/session-player-auth'
import type { ScoreEntry } from '@/lib/game-types'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params
  try {
    const { playerId, vote, currentScores } = (await request.json()) as {
      playerId: string
      vote: 'mniej' | 'wiecej'
      currentScores: ScoreEntry[]
    }

    const session = await getSession(pin)
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    const player = getAuthorizedPlayer(request, session, playerId)
    if (!player) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

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
    console.error(`[POST /api/sessions/${pin}/highlow/vote]`, err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
