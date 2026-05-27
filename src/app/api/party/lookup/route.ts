import { NextResponse } from 'next/server'

import { verifyPartyToken } from '@/lib/party-token'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import { SESSION_PIN_LENGTH } from '@/lib/session-pin'

type PartyRoomLookup = {
  pin: string
  gameMode: 'classic' | 'highlow' | 'battle-royale'
  status: 'waiting' | 'active' | 'finished'
  playersCount: number
  teams: Array<{
    teamId: string
    teamName: string
    color: string
    emoji: string
    memberCount: number
  }>
}

function getPartyKitBaseUrl(): string {
  const configured =
    process.env.PARTYKIT_HOST ?? process.env.NEXT_PUBLIC_PARTYKIT_HOST ?? '127.0.0.1:1999'

  if (configured.startsWith('http://') || configured.startsWith('https://')) {
    return configured.replace(/\/$/, '')
  }

  // Jeśli to localhost lub 127.0.0.1, użyj http. W przeciwnym razie wymuś https.
  const isLocal = configured.includes('localhost') || configured.includes('127.0.0.1')
  const protocol = isLocal ? 'http://' : 'https://'

  return `${protocol}${configured.replace(/\/$/, '')}`
}

function cleanPin(value: string | null): string | null {
  const pin = value?.replace(/\D/g, '').slice(0, SESSION_PIN_LENGTH)
  return pin && pin.length === SESSION_PIN_LENGTH ? pin : null
}

function getAuthSecret(): string | null {
  const secret = process.env.PARTY_AUTH_SECRET
  if (!secret || secret.length < 16) return null
  return secret
}

async function isAuthorizedLookup(request: Request, pin: string): Promise<boolean> {
  const token = request.headers.get('x-party-token') ?? request.headers.get('x-party-host-token')
  if (!token) return false

  const secret = getAuthSecret()
  if (!secret) return false

  const result = await verifyPartyToken(token, secret)
  return result.ok && result.payload.tokenKind === 'party' && result.payload.pin === pin
}

export async function GET(request: Request) {
  const clientIp = getClientIp(request)
  const limit = await consumeRateLimit(`party-lookup:${clientIp}`, {
    limit: 60,
    windowMs: 60_000,
  })
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: limit.retryAfter },
      { status: 429, headers: rateLimitHeaders(limit) }
    )
  }

  const url = new URL(request.url)
  const pin = cleanPin(url.searchParams.get('pin'))
  if (!pin) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 400 })
  }

  const pinLimit = await consumeRateLimit(`party-lookup:pin:${pin}`, {
    limit: 300,
    windowMs: 60_000,
  })
  if (!pinLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: pinLimit.retryAfter },
      { status: 429, headers: rateLimitHeaders(pinLimit) }
    )
  }

  try {
    const authorizedLookup = await isAuthorizedLookup(request, pin)
    const response = await fetch(`${getPartyKitBaseUrl()}/parties/main/${pin}`, {
      cache: 'no-store',
    })
    if (response.status === 404) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }
    if (!response.ok) {
      return NextResponse.json({ error: 'PartyKit lookup failed' }, { status: 502 })
    }

    const room = (await response.json()) as PartyRoomLookup
    if (!authorizedLookup && room.status !== 'waiting') {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    return NextResponse.json(room)
  } catch (err) {
    console.error('[GET /api/party/lookup]', err)
    return NextResponse.json({ error: 'PartyKit lookup failed' }, { status: 502 })
  }
}
