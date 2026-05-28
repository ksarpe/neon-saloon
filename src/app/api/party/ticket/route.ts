// Issues signed party credentials. WebSocket handshakes exchange these for
// short-lived connect tokens before reaching the PartyKit room.
//
// Two flows:
//   create-host → caller becomes the host of a new room (premium-gated for
//                 highlow/battle-royale; bot-protected)
//   join        → caller becomes a player in an existing PIN
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { readBotProtectionToken, verifyBotProtection } from '@/lib/bot-protection'
import { signPartyToken } from '@/lib/party-token'
import { getPartyKitServerUrl } from '@/lib/partykit-server-url'
import { getFreshPremiumAccess } from '@/lib/premium-access'
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
const TOKEN_TTL_MINUTES = 90

// Per-IP and global limits are applied per action so issuing a host ticket is throttled.
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

// Cryptographically uniform 6-digit PIN. Rejection sampling against the largest
// 10^N-multiple below 2^32 keeps the distribution flat (the naive `random % 10`
// biases the lowest digits). 2^32 is divisible by 10^6 65 times so the reject
// rate is ~0.4 %.
const PIN_MAX = 10 ** SESSION_PIN_LENGTH
const PIN_REJECT_THRESHOLD = Math.floor(0x1_0000_0000 / PIN_MAX) * PIN_MAX

function generatePin(): string {
  const buf = new Uint32Array(1)
  // crypto.getRandomValues is available on Node 22+ and Edge runtime alike.
  let n: number
  do {
    crypto.getRandomValues(buf)
    n = buf[0]
  } while (n >= PIN_REJECT_THRESHOLD)
  return String(n % PIN_MAX).padStart(SESSION_PIN_LENGTH, '0')
}

function generatePlayerId(): string {
  return `player_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`
}

function generateHostId(): string {
  return `host_${crypto.randomUUID()}`
}

// Probe PartyKit to see whether the PIN is already claimed by an initialised
// room. We reuse the room's GET endpoint (returns 404 when `state` is null).
// This DOES spawn an idle DO at the probed PIN, but PartyKit garbage-collects
// uninitialised durable objects cheaply, and the probe runs at most a handful
// of times per ticket issuance.
const PIN_ALLOCATION_ATTEMPTS = 6

async function allocateAvailablePin(): Promise<string | null> {
  const baseUrl = getPartyKitServerUrl()
  for (let i = 0; i < PIN_ALLOCATION_ATTEMPTS; i++) {
    const candidate = generatePin()
    try {
      const probe = await fetch(`${baseUrl}/parties/main/${candidate}`, {
        cache: 'no-store',
      })
      if (probe.status === 404) return candidate
      // 2xx means the room is already initialised — collision, try again.
      // Any other status (5xx, network) we treat as transient and fall through
      // to the next attempt rather than handing out a potentially-taken PIN.
    } catch (err) {
      console.warn('[party/ticket] PIN probe failed, retrying', err)
    }
  }
  return null
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
    const exp = now + TOKEN_TTL_MINUTES * 60 * 1000

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
        // Dev-only escape hatch so E2E tests can drive HL + BR without seeding a
        // premium user. Gated by NODE_ENV so it can NEVER be set in production.
        const devBypass =
          process.env.NODE_ENV !== 'production' && process.env.DISABLE_PREMIUM_GATE === 'true'
        if (!devBypass) {
          const session = await getServerSession(authOptions)
          if (!session?.user?.id || !(await getFreshPremiumAccess(session.user.id))) {
            return NextResponse.json({ error: 'Premium access required' }, { status: 403 })
          }
        }
      }

      // Probe PartyKit until we get a PIN that isn't already claimed. The room
      // itself still enforces hostId ownership on connect (so a stale ghost DO
      // can't be hijacked), but probing avoids handing a host a PIN that will
      // immediately bounce them.
      const pin = await allocateAvailablePin()
      if (!pin) {
        return NextResponse.json(
          { error: 'Nie udało się zarezerwować PIN-u salonu. Spróbuj ponownie za chwilę.' },
          { status: 503 }
        )
      }
      const hostId = generateHostId()
      const partyToken = await signPartyToken(
        { pin, role: 'host', tokenKind: 'party', hostId, hostName, gameMode, iat: now, exp },
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
      if (!/^\d{6}$/.test(pin)) {
        return NextResponse.json({ error: 'Invalid PIN' }, { status: 400 })
      }

      const pinLimit = await consumeRateLimit(`party-ticket-join:pin:${pin}`, {
        limit: 80,
        windowMs: 60_000,
      })
      if (!pinLimit.allowed) {
        return NextResponse.json(
          { error: 'Za dużo prób dołączenia do tego salonu. Spróbuj ponownie później.' },
          { status: 429, headers: rateLimitHeaders(pinLimit) }
        )
      }

      const playerName = requiredString(body.playerName, 'playerName', INPUT_LIMITS.playerName)
      const avatar = optionalString(body.avatar, 'avatar', INPUT_LIMITS.avatar) ?? undefined
      const teamId = optionalString(body.teamId, 'teamId', 80) ?? undefined

      const playerId = generatePlayerId()
      const partyToken = await signPartyToken(
        {
          pin,
          role: 'player',
          tokenKind: 'party',
          playerId,
          playerName,
          avatar,
          teamId,
          iat: now,
          exp,
        },
        secret
      )

      return NextResponse.json({ playerId, role: 'player' as const, partyToken }, { status: 200 })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error('[POST /api/party/ticket]', err)
    return NextResponse.json({ error: 'Failed to issue ticket' }, { status: 500 })
  }
}
