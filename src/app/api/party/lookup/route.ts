import { NextResponse } from 'next/server'

import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import { SESSION_PIN_LENGTH } from '@/lib/session-pin'

function getPartyKitBaseUrl(): string {
  const configured =
    process.env.PARTYKIT_HOST ??
    process.env.NEXT_PUBLIC_PARTYKIT_HOST ??
    '127.0.0.1:1999'
  if (configured.startsWith('http://') || configured.startsWith('https://')) {
    return configured.replace(/\/$/, '')
  }
  return `http://${configured.replace(/\/$/, '')}`
}

function cleanPin(value: string | null): string | null {
  const pin = value?.replace(/\D/g, '').slice(0, SESSION_PIN_LENGTH)
  return pin && pin.length === SESSION_PIN_LENGTH ? pin : null
}

export async function GET(request: Request) {
  const limit = await consumeRateLimit(`party-lookup:${getClientIp(request)}`, {
    limit: 60,
    windowMs: 60_000,
  })
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: limit.retryAfter },
      { status: 429, headers: rateLimitHeaders(limit) },
    )
  }

  const url = new URL(request.url)
  const pin = cleanPin(url.searchParams.get('pin'))
  if (!pin) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 400 })
  }

  try {
    const response = await fetch(`${getPartyKitBaseUrl()}/parties/main/${pin}`, {
      cache: 'no-store',
    })
    if (response.status === 404) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }
    if (!response.ok) {
      return NextResponse.json({ error: 'PartyKit lookup failed' }, { status: 502 })
    }

    return NextResponse.json(await response.json())
  } catch (err) {
    console.error('[GET /api/party/lookup]', err)
    return NextResponse.json({ error: 'PartyKit lookup failed' }, { status: 502 })
  }
}
