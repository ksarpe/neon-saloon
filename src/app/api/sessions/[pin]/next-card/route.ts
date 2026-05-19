import { NextResponse } from 'next/server'

import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { getSession, updateSession } from '@/lib/appwrite/sessions'
import type { WireCard } from '@/lib/game-types'
import {
  boundedStringArray,
  INPUT_LIMITS,
  optionalString,
  readLimitedJson,
  RequestValidationError,
  requiredInteger,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import { isHostAuthorized } from '@/lib/session-host-auth'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params
  try {
    const session = await getSession(pin)
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    if (!isHostAuthorized(request, session)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

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

function sanitizeWireCard(value: unknown): WireCard {
  if (!value || typeof value !== 'object') {
    throw new RequestValidationError('card is required')
  }

  const card = value as Record<string, unknown>
  const type = requiredString(card.type, 'card.type', 12)
  if (type !== 'QUIZ' && type !== 'TEST' && type !== 'NEVER') {
    throw new RequestValidationError('Invalid card type')
  }

  const options =
    card.options === undefined
      ? undefined
      : boundedStringArray(
          card.options,
          'card.options',
          INPUT_LIMITS.cardOptions,
          INPUT_LIMITS.quizOption
        )

  return {
    id: requiredString(card.id, 'card.id', INPUT_LIMITS.cardId),
    type,
    title: optionalString(card.title, 'card.title', INPUT_LIMITS.cardTitle) ?? undefined,
    description: requiredString(card.description, 'card.description', INPUT_LIMITS.cardDescription),
    emoji: optionalString(card.emoji, 'card.emoji', INPUT_LIMITS.avatar) ?? undefined,
    options,
  }
}
