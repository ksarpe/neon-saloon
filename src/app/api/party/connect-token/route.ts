// Exchanges a longer-lived party credential for a short-lived WebSocket
// connect token. The connect token is the only token accepted by PartyKit over
// the WebSocket URL, which limits exposure if URLs are logged by tooling.

import { NextResponse } from 'next/server'

import { signPartyToken, verifyPartyToken } from '@/lib/party-token'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import { readLimitedJson, requiredString, validationErrorResponse } from '@/lib/request-validation'

const CONNECT_TOKEN_TTL_SECONDS = 300

function getAuthSecret(): string | null {
  const secret = process.env.PARTY_AUTH_SECRET
  if (!secret || secret.length < 16) return null
  return secret
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request)

  try {
    const limit = await consumeRateLimit(`party-connect-token:${clientIp}`, {
      limit: 120,
      windowMs: 60_000,
    })
    if (!limit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: limit.retryAfter },
        { status: 429, headers: rateLimitHeaders(limit) }
      )
    }

    const secret = getAuthSecret()
    if (!secret) {
      console.error('[party/connect-token] PARTY_AUTH_SECRET is missing or too short')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }

    const body = await readLimitedJson<{ partyToken?: unknown }>(request)
    const partyToken = requiredString(body.partyToken, 'partyToken', 8192)
    const verified = await verifyPartyToken(partyToken, secret)
    if (!verified.ok || verified.payload.tokenKind !== 'party') {
      return NextResponse.json({ error: 'Invalid party token' }, { status: 401 })
    }

    const now = Date.now()
    const exp = Math.min(now + CONNECT_TOKEN_TTL_SECONDS * 1000, verified.payload.exp)
    const connectToken = await signPartyToken(
      { ...verified.payload, tokenKind: 'connect', iat: now, exp },
      secret
    )

    return NextResponse.json({ connectToken, expiresAt: exp })
  } catch (error) {
    return validationErrorResponse(error) ?? NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
