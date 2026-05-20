import { NextResponse } from 'next/server'

import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import { requireHostSession } from '@/lib/session-api'
import { publicPlayer } from '@/lib/session-player-auth'

type RouteContext = { params: Promise<{ pin: string }> }

// Returns the full host-side game state so /graj/host/[pin] can render exactly
// where the host left off after a refresh / crash / network drop. Auth via the
// existing host-secret header — same as every other host endpoint.

export async function GET(request: Request, { params }: RouteContext) {
  const { pin } = await params
  const limit = consumeRateLimit(`session-host-resume:${getClientIp(request)}`, {
    limit: 60,
    windowMs: 60_000,
  })
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: limit.retryAfter },
      { status: 429, headers: rateLimitHeaders(limit) }
    )
  }

  const hostSession = await requireHostSession(request, pin)
  if (!hostSession.ok) return hostSession.response
  const session = hostSession.value

  return NextResponse.json({
    ok: true,
    pin: session.pin,
    status: session.status,
    gameMode: session.gameMode ?? 'classic',
    players: session.players.map(publicPlayer),
    teams: session.teams,
    cardIndex: session.cardIndex,
    currentCard: session.currentCard ?? null,
    votes: (session.votes ?? []).filter((v) => v.cardIndex === session.cardIndex),
    scores: session.scores ?? [],
    teamScores: session.teamScores ?? [],
    currentReveal: session.currentReveal ?? null,
    highlowData: session.highlowData ?? null,
    battleRoyaleData: session.battleRoyaleData ?? null,
  })
}
