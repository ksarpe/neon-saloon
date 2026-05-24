import { NextResponse } from 'next/server'

import { QUESTION_CATEGORIES } from '@/config/games/categories'
import { getSession } from '@/lib/appwrite/sessions'
import { getLimitedQuestionTotal, getOrderedQuestion } from '@/lib/games/question-limit'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import { hashPlayerSecret, PLAYER_SECRET_HEADER, publicPlayer } from '@/lib/session-player-auth'

type RouteContext = { params: Promise<{ pin: string }> }

// Resume an existing player session after a refresh / browser crash / network drop.
// The client sends the player's secret in the x-player-secret header; we identify the
// player by hash match, then return enough state for the player UI to rehydrate to
// the current game phase without missing any realtime events.

export async function GET(request: Request, { params }: RouteContext) {
  const { pin } = await params

  const secret = request.headers.get(PLAYER_SECRET_HEADER)
  if (!secret) {
    const limit = await consumeRateLimit(`session-resume-missing-secret:${getClientIp(request)}`, {
      limit: 30,
      windowMs: 60_000,
    })
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: limit.retryAfter },
        { status: 429, headers: rateLimitHeaders(limit) }
      )
    }
    return NextResponse.json({ error: 'Missing player secret' }, { status: 401 })
  }

  const ipLimit = await consumeRateLimit(`session-resume-ip:${getClientIp(request)}`, {
    limit: 600,
    windowMs: 60_000,
  })
  if (!ipLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: ipLimit.retryAfter },
      { status: 429, headers: rateLimitHeaders(ipLimit) }
    )
  }

  const providedHash = hashPlayerSecret(secret)
  const playerLimit = await consumeRateLimit(`session-resume:${pin}:${providedHash}`, {
    limit: 90,
    windowMs: 60_000,
  })
  if (!playerLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: playerLimit.retryAfter },
      { status: 429, headers: rateLimitHeaders(playerLimit) }
    )
  }

  const session = await getSession(pin)
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  // Find the player whose secret matches — we don't trust a client-supplied playerId.
  const matchedPlayer = session.players.find(
    (p) => p.playerSecretHash && p.playerSecretHash === providedHash
  )
  if (!matchedPlayer) {
    return NextResponse.json({ error: 'Unknown player or stale credentials' }, { status: 401 })
  }

  const player = publicPlayer(matchedPlayer)
  const gameMode = session.gameMode ?? 'classic'

  type ResumeResponse = {
    ok: true
    player: typeof player
    serverNow: number
    session: { pin: string; status: typeof session.status; gameMode: string }
    finished?: {
      scores: typeof session.scores
      teamScores: typeof session.teamScores
      showPlayerPoints?: boolean
    }
    classic?: {
      cardIndex: number
      card: NonNullable<typeof session.currentCard> | null
      cardStartedAt: number | null
      hasVoted: boolean
      settings: typeof session.settings | null
      currentReveal: (NonNullable<typeof session.currentReveal> & {
        scores: typeof session.scores
        teamScores: typeof session.teamScores
      }) | null
    }
    battleRoyale?: {
      questionIndex: number
      totalQuestions: number
      questionText: string
      options: string[]
      timerDuration: number
      roundStartTime: number
      alivePlayers: string[]
      isEliminated: boolean
      hasAnswered: boolean
    }
    highlow?: {
      roundIndex: number
      questionText: string
      questionUnit: string
      guessingTeamId: string
      guessingTeamName: string
      votingTeamId: string
      votingTeamName: string
      guessingCaptainId: string
      votingCaptainId: string
      submittedNumber: string | null
    }
  }

  const response: ResumeResponse = {
    ok: true,
    player,
    serverNow: Date.now(),
    session: { pin: session.pin, status: session.status, gameMode },
  }

  if (session.status === 'finished') {
    response.finished = {
      scores: session.scores ?? [],
      teamScores: session.teamScores ?? [],
      showPlayerPoints: !isNeverOnlyDeck(session.deck ?? []),
    }
    return NextResponse.json(response)
  }

  if (session.status !== 'active') {
    // Either still in lobby ('waiting') or already 'finished' — caller decides UX.
    return NextResponse.json(response)
  }

  if (gameMode === 'battle-royale' && session.battleRoyaleData) {
    const br = session.battleRoyaleData
    const category = QUESTION_CATEGORIES.find((c) => c.id === br.categoryId)
    const question = category
      ? getOrderedQuestion(category.questions, br.questionIndex, br.questionOrder)
      : null
    if (category && question) {
      const alivePlayers = session.players
        .filter((p) => !br.eliminatedPlayers.includes(p.playerId))
        .map((p) => p.playerId)
      response.battleRoyale = {
        questionIndex: br.questionIndex,
        totalQuestions: getLimitedQuestionTotal(category.questions.length, br.questionOrder),
        questionText: question.text,
        options: question.options,
        timerDuration: br.timerDuration,
        roundStartTime: br.roundStartTime ?? Date.now(),
        alivePlayers,
        isEliminated: br.eliminatedPlayers.includes(matchedPlayer.playerId),
        hasAnswered: br.roundAnswers.some((a) => a.playerId === matchedPlayer.playerId),
      }
    }
  } else if (gameMode === 'highlow' && session.highlowData) {
    const hl = session.highlowData
    if (hl.questionText && hl.questionUnit && hl.guessingTeamName && hl.votingTeamName) {
      response.highlow = {
        roundIndex: hl.questionIndex,
        questionText: hl.questionText,
        questionUnit: hl.questionUnit,
        guessingTeamId: hl.guessingTeamId,
        guessingTeamName: hl.guessingTeamName,
        votingTeamId: hl.votingTeamId,
        votingTeamName: hl.votingTeamName,
        guessingCaptainId: hl.guessingCaptainId,
        votingCaptainId: hl.votingCaptainId,
        submittedNumber: hl.currentNumber ?? null,
      }
    }
  } else if (session.currentCard) {
    const hasVoted = (session.votes ?? []).some(
      (v) => v.playerId === matchedPlayer.playerId && v.cardIndex === session.cardIndex
    )
    response.classic = {
      cardIndex: session.cardIndex,
      card: session.currentCard,
      cardStartedAt: session.currentCardStartedAt ?? null,
      hasVoted,
      settings: session.settings ?? null,
      currentReveal: session.currentReveal
        ? {
            ...session.currentReveal,
            scores: session.scores ?? [],
            teamScores: session.teamScores ?? [],
          }
        : null,
    }
  }

  return NextResponse.json(response)
}

function isNeverOnlyDeck(deck: Array<{ type?: string }>) {
  return deck.length > 0 && deck.every((card) => card.type === 'NEVER')
}
