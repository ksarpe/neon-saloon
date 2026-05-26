// Issues short-lived signed tokens used to authenticate WebSocket connections
// to the PartyKit room. The token IS the auth — the PartyKit room verifies it
// in onBeforeConnect. The same PARTY_AUTH_SECRET must be configured on both
// sides (.env.local for Next.js, .dev.vars / partykit secret for the room).
//
// Two flows:
//   create-host → caller becomes the host of a new room (premium-gated for
//                 highlow/battle-royale; bot-protected like /api/sessions)
//   join        → caller becomes a player in an existing PIN
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { readBotProtectionToken, verifyBotProtection } from '@/lib/bot-protection'
import { signPartyToken } from '@/lib/party-token'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import {
  INPUT_LIMITS,
  optionalString,
  readLimitedJson,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import { SESSION_PIN_LENGTH } from '@/lib/session-pin'

const PREMIUM_GAME_MODES = new Set(['highlow', 'battle-royale'])
const TOKEN_TTL_HOURS = 24

// Same per-IP and global limits as the old /api/sessions endpoint, applied per
// action so issuing a host ticket is throttled like creating a session was.
const GLOBAL_CREATE_LIMITS = [
  { suffix: 'burst', limit: 120, windowMs: 60_000 },
  { suffix: 'sustained', limit: 600, windowMs: 15 * 60_000 },
]
const PER_IP_CREATE_LIMITS = [
  { suffix: 'burst', limit: 6, windowMs: 60_000 },
  { suffix: 'sustained', limit: 30, windowMs: 15 * 60_000 },
]
const GLOBAL_JOIN_LIMITS = [
  { suffix: 'burst', limit: 600, windowMs: 60_000 },
  { suffix: 'sustained', limit: 3_000, windowMs: 15 * 60_000 },
]

function generatePin(): string {
  const chars = '0123456789'
  let pin = ''
  for (let i = 0; i < SESSION_PIN_LENGTH; i++) {
    pin += chars[Math.floor(Math.random() * chars.length)]
  }
  return pin
}

function generatePlayerId(): string {
  return `player_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

function getAuthSecret(): string | null {
  const secret = process.env.PARTY_AUTH_SECRET
  if (!secret || secret.length < 16) return null
  return secret
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request)

  try {
    const body = await readLimitedJson<{
      action?: unknown
      hostName?: unknown
      gameMode?: unknown
      pin?: unknown
      playerName?: unknown
      avatar?: unknown
      teamId?: unknown
      botProtectionToken?: unknown
    }>(request)

    const action = requiredString(body.action, 'action', 32)

    const secret = getAuthSecret()
    if (!secret) {
      console.error('[party/ticket] PARTY_AUTH_SECRET is missing or too short')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const now = Date.now()
    const exp = now + TOKEN_TTL_HOURS * 60 * 60 * 1000

    if (action === 'create-host') {
      for (const rl of GLOBAL_CREATE_LIMITS) {
        const result = await consumeRateLimit(`party-ticket-create:global:${rl.suffix}`, rl)
        if (!result.allowed) {
          return NextResponse.json(
            { error: 'Chwilowo zbyt dużo osób tworzy salony. Spróbuj ponownie później.' },
            { status: 429, headers: rateLimitHeaders(result) }
          )
        }
      }
      for (const rl of PER_IP_CREATE_LIMITS) {
        const result = await consumeRateLimit(`party-ticket-create:${rl.suffix}:${clientIp}`, rl)
        if (!result.allowed) {
          return NextResponse.json(
            { error: 'Za dużo prób utworzenia salonu. Spróbuj ponownie później.' },
            { status: 429, headers: rateLimitHeaders(result) }
          )
        }
      }

      const botProtectionToken = readBotProtectionToken(body.botProtectionToken)
      const protection = await verifyBotProtection({
        token: botProtectionToken,
        request,
        action: 'party-ticket-create',
      })
      if (!protection.ok) return protection.response

      const hostName = optionalString(body.hostName, 'hostName', 24) ?? 'Host'
      const gameMode = optionalString(body.gameMode, 'gameMode', 32) ?? 'classic'

      if (PREMIUM_GAME_MODES.has(gameMode)) {
        const session = await getServerSession(authOptions)
        if (!session?.user?.isPremium) {
          return NextResponse.json({ error: 'Premium access required' }, { status: 403 })
        }
      }

      // PIN collision avoidance moves into the PartyKit room (Phase 2): the
      // room rejects a host token if its DO already has an initialised session.
      const pin = generatePin()
      const partyToken = await signPartyToken(
        { pin, role: 'host', hostName, gameMode, iat: now, exp },
        secret
      )

      return NextResponse.json({ pin, role: 'host' as const, partyToken }, { status: 201 })
    }

    if (action === 'join') {
      for (const rl of GLOBAL_JOIN_LIMITS) {
        const result = await consumeRateLimit(`party-ticket-join:global:${rl.suffix}`, rl)
        if (!result.allowed) {
          return NextResponse.json(
            { error: 'Chwilowo zbyt dużo osób dołącza do salonów. Spróbuj ponownie później.' },
            { status: 429, headers: rateLimitHeaders(result) }
          )
        }
      }
      const ipLimit = await consumeRateLimit(`party-ticket-join:${clientIp}`, {
        limit: 20,
        windowMs: 60_000,
      })
      if (!ipLimit.allowed) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429, headers: rateLimitHeaders(ipLimit) }
        )
      }

      const pin = requiredString(body.pin, 'pin', SESSION_PIN_LENGTH + 4)
      const playerName = requiredString(body.playerName, 'playerName', INPUT_LIMITS.playerName)
      const avatar = optionalString(body.avatar, 'avatar', INPUT_LIMITS.avatar) ?? undefined
      const teamId = optionalString(body.teamId, 'teamId', 80) ?? undefined

      const playerId = generatePlayerId()
      const partyToken = await signPartyToken(
        { pin, role: 'player', playerId, playerName, avatar, teamId, iat: now, exp },
        secret
      )

      return NextResponse.json(
        { playerId, role: 'player' as const, partyToken },
        { status: 200 }
      )
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error('[POST /api/party/ticket]', err)
    return NextResponse.json({ error: 'Failed to issue ticket' }, { status: 500 })
  }
}
