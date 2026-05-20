import { NextResponse } from 'next/server'

import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { updateSession } from '@/lib/appwrite/sessions'
import { readLimitedJson, requiredInteger, validationErrorResponse } from '@/lib/request-validation'
import { requireHostSession } from '@/lib/session-api'
import { sanitizeWireCard } from '@/lib/session-payloads'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params
  try {
    const hostSession = await requireHostSession(request, pin)
    if (!hostSession.ok) return hostSession.response

    const body = await readLimitedJson<{ cardIndex?: unknown; card?: unknown }>(request)
    const cardIndex = requiredInteger(body.cardIndex, 'cardIndex', 0, 10_000)
    const card = sanitizeWireCard(body.card)

    await updateSession(pin, { cardIndex, currentCard: card, votes: [], currentReveal: undefined })

    await triggerSessionEvent(pin, {
      event: 'next-card',
      data: { cardIndex, card },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error(`[POST /api/sessions/${pin}/next-card]`, err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
