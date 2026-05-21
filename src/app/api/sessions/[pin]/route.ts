import { NextResponse } from 'next/server'

import { ANSWER_TIME_LIMIT_SECONDS, REVEAL_COUNTDOWN_SECONDS } from '@/config/game'
import {
  cleanupSessionEvents,
  triggerGameEvent as triggerSessionEvent,
} from '@/lib/appwrite/realtime'
import { updateSession } from '@/lib/appwrite/sessions'
import type { ScoreEntry, TeamScoreEntry } from '@/lib/game-types'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import {
  INPUT_LIMITS,
  readLimitedJson,
  RequestValidationError,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import { enforceSessionActionRateLimit } from '@/lib/session-action-rate-limit'
import { requireHostSession, requireSession } from '@/lib/session-api'
import { isHostAuthorized } from '@/lib/session-host-auth'
import { sanitizeWireCard } from '@/lib/session-payloads'
import { publicPlayer } from '@/lib/session-player-auth'

type RouteContext = { params: Promise<{ pin: string }> }

export async function GET(request: Request, { params }: RouteContext) {
  const { pin } = await params
  const lookupLimit = await consumeRateLimit(`session-lookup:${getClientIp(request)}`, {
    limit: 60,
    windowMs: 60_000,
  })

  if (!lookupLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: lookupLimit.retryAfter },
      { status: 429, headers: rateLimitHeaders(lookupLimit) }
    )
  }

  const sessionResult = await requireSession(pin)
  if (!sessionResult.ok) return sessionResult.response
  const session = sessionResult.value

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
    const hostSession = await requireHostSession(request, pin)
    if (!hostSession.ok) return hostSession.response
    const rateLimitResponse = await enforceSessionActionRateLimit('hostAction', pin, 'host')
    if (rateLimitResponse) return rateLimitResponse

    const body = await readLimitedJson<{
      action?: unknown
      card?: unknown
      settings?: unknown
      scores?: unknown
      teamScores?: unknown
    }>(request)
    const action = requiredString(body.action, 'action', INPUT_LIMITS.action)

    if (action === 'start') {
      const card = sanitizeWireCard(body.card)
      const settings = sanitizeStandardSettings(body.settings)
      await updateSession(pin, {
        status: 'active',
        cardIndex: 0,
        currentCard: card,
        votes: [],
        currentReveal: undefined,
        settings,
      })
      await triggerSessionEvent(pin, {
        event: 'game-started',
        data: { cardIndex: 0, card, settings },
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

function sanitizeStandardSettings(value: unknown) {
  if (!value || typeof value !== 'object') {
    return {
      revealCountdownSeconds: REVEAL_COUNTDOWN_SECONDS,
      answerTimeLimitSeconds: ANSWER_TIME_LIMIT_SECONDS,
    }
  }

  const row = value as Record<string, unknown>
  return {
    revealCountdownSeconds:
      typeof row.revealCountdownSeconds === 'number'
        ? clamp(row.revealCountdownSeconds, 2, 15)
        : REVEAL_COUNTDOWN_SECONDS,
    answerTimeLimitSeconds:
      typeof row.answerTimeLimitSeconds === 'number'
        ? clamp(row.answerTimeLimitSeconds, 15, 300)
        : ANSWER_TIME_LIMIT_SECONDS,
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value)))
}

function assertSmallArray<T>(value: unknown, field: string): T[] {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value) || value.length > INPUT_LIMITS.scoreEntries) {
    throw new RequestValidationError(`${field} is invalid`)
  }

  return value as T[]
}
