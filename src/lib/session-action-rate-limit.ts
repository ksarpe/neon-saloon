import { NextResponse } from 'next/server'

import { consumeRateLimit, rateLimitHeaders } from '@/lib/rate-limit'

const ACTION_LIMITS = {
  vote: { limit: 20, windowMs: 10_000 },
  battleRoyaleAnswer: { limit: 10, windowMs: 10_000 },
  highlowVote: { limit: 5, windowMs: 30_000 },
  highlowNumber: { limit: 5, windowMs: 30_000 },
  playerLeave: { limit: 5, windowMs: 60_000 },
  hostAction: { limit: 60, windowMs: 60_000 },
} as const

type SessionAction = keyof typeof ACTION_LIMITS

export async function enforceSessionActionRateLimit(
  action: SessionAction,
  pin: string,
  playerId: string
) {
  const result = await consumeRateLimit(
    `session-action:${action}:${pin}:${playerId}`,
    ACTION_LIMITS[action]
  )
  if (result.allowed) return null

  return NextResponse.json(
    { error: 'Too many requests', retryAfter: result.retryAfter },
    { status: 429, headers: rateLimitHeaders(result) }
  )
}
