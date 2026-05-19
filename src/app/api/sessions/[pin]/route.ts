import { NextResponse } from 'next/server'

import {
  cleanupSessionEvents,
  triggerGameEvent as triggerSessionEvent,
} from '@/lib/appwrite/realtime'
import { getSession, updateSession } from '@/lib/appwrite/sessions'
import type { ScoreEntry, TeamScoreEntry, WireCard } from '@/lib/game-types'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import {
  boundedStringArray,
  INPUT_LIMITS,
  optionalString,
  readLimitedJson,
  RequestValidationError,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import { isHostAuthorized } from '@/lib/session-host-auth'
import { publicPlayer } from '@/lib/session-player-auth'

type RouteContext = { params: Promise<{ pin: string }> }

export async function GET(request: Request, { params }: RouteContext) {
  const { pin } = await params
  const lookupLimit = consumeRateLimit(`session-lookup:${getClientIp(request)}`, {
    limit: 60,
    windowMs: 60_000,
  })

  if (!lookupLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: lookupLimit.retryAfter },
      { status: 429, headers: rateLimitHeaders(lookupLimit) }
    )
  }

  const session = await getSession(pin)
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  if (!isHostAuthorized(request, session)) {
    return NextResponse.json({
      pin: session.pin,
      status: session.status,
      gameMode: session.gameMode ?? 'classic',
      teams: session.teams.map((team) => ({
        ...team,
        memberCount: session.players.filter((player) => player.teamId === team.teamId).length,
      })),
    })
  }

  return NextResponse.json({
    pin: session.pin,
    status: session.status,
    players: session.players.map(publicPlayer),
    teams: session.teams,
    cardIndex: session.cardIndex,
    votes: (session.votes ?? []).filter((vote) => vote.cardIndex === session.cardIndex),
    gameMode: session.gameMode ?? 'classic',
    highlowData: session.highlowData ?? null,
  })
}

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params
  try {
    const session = await getSession(pin)
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    if (!isHostAuthorized(request, session)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await readLimitedJson<{
      action?: unknown
      card?: unknown
      scores?: unknown
      teamScores?: unknown
    }>(request)
    const action = requiredString(body.action, 'action', INPUT_LIMITS.action)

    if (action === 'start') {
      const card = sanitizeWireCard(body.card)
      await updateSession(pin, { status: 'active', cardIndex: 0, currentCard: card, votes: [] })
      await triggerSessionEvent(pin, {
        event: 'game-started',
        data: { cardIndex: 0, card },
      })
    } else if (action === 'finish') {
      const scores = assertSmallArray<ScoreEntry>(body.scores, 'scores')
      const teamScores = assertSmallArray<TeamScoreEntry>(body.teamScores, 'teamScores')
      await updateSession(pin, { status: 'finished', votes: [] })
      await triggerSessionEvent(pin, {
        event: 'game-finished',
        data: { scores, teamScores },
      })
      // Fire-and-forget: purge ephemeral game-events rows for this session.
      // Errors are swallowed inside cleanupSessionEvents.
      void cleanupSessionEvents(pin)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error(`[POST /api/sessions/${pin}]`, err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

function sanitizeWireCard(value: unknown): WireCard {
  if (!value || typeof value !== 'object') {
    throw new RequestValidationError('card is required')
  }

  const card = value as Record<string, unknown>
  const type = requiredString(card.type, 'card.type', 12)
  if (type !== 'QUIZ' && type !== 'TEST' && type !== 'NEVER') {
    throw new RequestValidationError('Invalid card type')
  }

  const options =
    card.options === undefined
      ? undefined
      : boundedStringArray(
          card.options,
          'card.options',
          INPUT_LIMITS.cardOptions,
          INPUT_LIMITS.quizOption
        )

  return {
    id: requiredString(card.id, 'card.id', INPUT_LIMITS.cardId),
    type,
    title: optionalString(card.title, 'card.title', INPUT_LIMITS.cardTitle) ?? undefined,
    description: requiredString(card.description, 'card.description', INPUT_LIMITS.cardDescription),
    emoji: optionalString(card.emoji, 'card.emoji', INPUT_LIMITS.avatar) ?? undefined,
    options,
  }
}

function assertSmallArray<T>(value: unknown, field: string): T[] {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value) || value.length > INPUT_LIMITS.scoreEntries) {
    throw new RequestValidationError(`${field} is invalid`)
  }

  return value as T[]
}
