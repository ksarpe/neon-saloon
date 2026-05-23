import { NextResponse } from 'next/server'

import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { updateSession } from '@/lib/appwrite/sessions'
import { readLimitedJson, requiredInteger, validationErrorResponse } from '@/lib/request-validation'
import { enforceSessionActionRateLimit } from '@/lib/session-action-rate-limit'
import { requireHostSession } from '@/lib/session-api'
import { sanitizeWireCard } from '@/lib/session-payloads'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params
  try {
    const hostSession = await requireHostSession(request, pin)
    if (!hostSession.ok) return hostSession.response
    const rateLimitResponse = await enforceSessionActionRateLimit('hostAction', pin, 'host')
    if (rateLimitResponse) return rateLimitResponse
    const session = hostSession.value

    const body = await readLimitedJson<{ cardIndex?: unknown; card?: unknown }>(request)
    const cardIndex = requiredInteger(body.cardIndex, 'cardIndex', 0, 10_000)
    const card = sanitizeWireCard(session.deck?.[cardIndex] ?? body.card)
    const cardStartedAt = Date.now()

    await updateSession(pin, {
      cardIndex,
      currentCardStartedAt: cardStartedAt,
      currentCard: card,
      votes: [],
      currentReveal: undefined,
    })

    await triggerSessionEvent(pin, {
      event: 'next-card',
      data: { cardIndex, cardStartedAt, card, settings: session.settings },
    })

    return NextResponse.json({ ok: true, cardStartedAt })
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error(`[POST /api/sessions/${pin}/next-card]`, err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
