import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { cleanupOldSessions, createSession, type SessionData } from '@/lib/appwrite/sessions'
import { authOptions } from '@/lib/auth'
import { readBotProtectionToken, verifyBotProtection } from '@/lib/bot-protection'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import { optionalString, readLimitedJson, validationErrorResponse } from '@/lib/request-validation'
import { createHostSecret, hashHostSecret } from '@/lib/session-host-auth'
import { SESSION_PIN_LENGTH } from '@/lib/session-pin'

const PREMIUM_GAME_MODES = new Set(['highlow', 'battle-royale'])
const GLOBAL_SESSION_CREATE_RATE_LIMITS = [
  { suffix: 'burst', limit: 120, windowMs: 60_000 },
  { suffix: 'sustained', limit: 600, windowMs: 15 * 60_000 },
]
const SESSION_CREATE_RATE_LIMITS = [
  { suffix: 'burst', limit: 6, windowMs: 60_000 },
  { suffix: 'sustained', limit: 30, windowMs: 15 * 60_000 },
]

function generatePin(): string {
  const chars = '0123456789'
  let pin = ''
  for (let i = 0; i < SESSION_PIN_LENGTH; i++) {
    pin += chars[Math.floor(Math.random() * chars.length)]
  }
  return pin
}

async function createSessionWithUniquePin(
  hostName: string,
  gameMode: string
): Promise<{ pin: string; hostSecret: string }> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const pin = generatePin()
    const hostSecret = createHostSecret()
    const session: SessionData = {
      pin,
      hostSecretHash: hashHostSecret(hostSecret),
      hostName,
      status: 'waiting',
      createdAt: Date.now(),
      players: [],
      teams: [],
      cardIndex: 0,
      votes: [],
      gameMode,
    }

    const created = await createSession(session)
    if (created) return { pin, hostSecret }
  }
  throw new Error('Could not generate a unique PIN')
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request)
  for (const rateLimit of GLOBAL_SESSION_CREATE_RATE_LIMITS) {
    const result = await consumeRateLimit(`session-create:global:${rateLimit.suffix}`, rateLimit)
    if (!result.allowed) {
      return NextResponse.json(
        {
          error: 'Chwilowo zbyt dużo osób tworzy salony. Spróbuj ponownie później.',
          retryAfter: result.retryAfter,
        },
        { status: 429, headers: rateLimitHeaders(result) }
      )
    }
  }

  for (const rateLimit of SESSION_CREATE_RATE_LIMITS) {
    const result = await consumeRateLimit(
      `session-create:${rateLimit.suffix}:${clientIp}`,
      rateLimit
    )
    if (!result.allowed) {
      return NextResponse.json(
        {
          error: 'Za dużo prób utworzenia salonu. Spróbuj ponownie później.',
          retryAfter: result.retryAfter,
        },
        { status: 429, headers: rateLimitHeaders(result) }
      )
    }
  }

  try {
    const body = await readLimitedJson<{
      hostName?: unknown
      gameMode?: unknown
      botProtectionToken?: unknown
    }>(request)
    const botProtectionToken = readBotProtectionToken(body.botProtectionToken)
    const botProtection = await verifyBotProtection({
      token: botProtectionToken,
      request,
      action: 'session-create',
    })
    if (!botProtection.ok) return botProtection.response

    const hostName = optionalString(body.hostName, 'hostName', 24) ?? 'Host'
    const gameMode = optionalString(body.gameMode, 'gameMode', 32) ?? 'classic'

    if (PREMIUM_GAME_MODES.has(gameMode)) {
      const session = await getServerSession(authOptions)
      if (!session?.user?.isPremium) {
        return NextResponse.json({ error: 'Premium access required' }, { status: 403 })
      }
    }

    try {
      await cleanupOldSessions()
    } catch (cleanupError) {
      console.error('[POST /api/sessions] Failed to cleanup old sessions', cleanupError)
    }

    const { pin, hostSecret } = await createSessionWithUniquePin(hostName, gameMode)

    return NextResponse.json({ pin, hostSecret }, { status: 201 })
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error('[POST /api/sessions]', err)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}
