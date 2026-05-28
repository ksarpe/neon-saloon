import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { INPUT_LIMITS, readLimitedText, validationErrorResponse } from '@/lib/request-validation'
import {
  getStripeWebhookSecret,
  type StripeCheckoutSession,
  type StripeSubscription,
  verifyStripeWebhookSignature,
} from '@/lib/stripe'
import {
  fulfillLifetimeCheckout,
  markLifetimeCheckoutFailed,
  syncStripeSubscription,
} from '@/lib/stripe-fulfillment'

export const runtime = 'nodejs'

type StripeWebhookEvent = {
  id?: string
  type?: string
  data?: { object?: unknown }
}

const STRIPE_EVENT_PROCESSING_STALE_MS = 5 * 60 * 1000

export async function POST(request: Request) {
  const webhookSecret = getStripeWebhookSecret()
  if (!webhookSecret) {
    return NextResponse.json({ error: 'Brakuje STRIPE_WEBHOOK_SECRET.' }, { status: 500 })
  }

  let payload: string
  try {
    payload = await readLimitedText(request, INPUT_LIMITS.stripeWebhookBytes)
  } catch (error) {
    return (
      validationErrorResponse(error) ??
      NextResponse.json({ error: 'Invalid payload.' }, { status: 400 })
    )
  }

  const signatureHeader = request.headers.get('stripe-signature')
  if (!signatureHeader) {
    return NextResponse.json({ error: 'Brakuje podpisu Stripe.' }, { status: 400 })
  }

  const signatureValid = verifyStripeWebhookSignature({
    payload,
    signatureHeader,
    webhookSecret,
  })

  if (!signatureValid) {
    return NextResponse.json({ error: 'Nieprawidlowy podpis Stripe.' }, { status: 400 })
  }

  let event: StripeWebhookEvent
  try {
    event = JSON.parse(payload) as StripeWebhookEvent
  } catch {
    return NextResponse.json({ error: 'Invalid Stripe event JSON.' }, { status: 400 })
  }

  if (!event.id || !event.type || !event.data) {
    return NextResponse.json({ error: 'Invalid Stripe event.' }, { status: 400 })
  }

  try {
    const reservation = await reserveStripeWebhookEvent(event.id, event.type)
    if (reservation === 'processed') {
      return NextResponse.json({ received: true, duplicate: true })
    }
    if (reservation === 'processing') {
      return NextResponse.json({ error: 'Webhook Stripe jest juz przetwarzany.' }, { status: 409 })
    }

    try {
      await dispatchStripeWebhookEvent(event as Required<StripeWebhookEvent>)
      await markStripeWebhookEventProcessed(event.id)

      return NextResponse.json({ received: true })
    } catch (error) {
      await markStripeWebhookEventFailed(event.id, error)
      throw error
    }
  } catch (error) {
    console.error('[POST /api/stripe/webhook]', error)
    return NextResponse.json({ error: 'Nie udalo sie obsluzyc webhooka Stripe.' }, { status: 500 })
  }
}

async function dispatchStripeWebhookEvent(event: Required<StripeWebhookEvent>) {
  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded' ||
    event.type === 'checkout.session.async_payment_failed'
  ) {
    await handleCheckoutSessionEvent(event.type, event.data.object as StripeCheckoutSession)
  }

  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated' ||
    event.type === 'customer.subscription.deleted'
  ) {
    await syncStripeSubscription(event.data.object as StripeSubscription)
  }
}

async function handleCheckoutSessionEvent(eventType: string, session: StripeCheckoutSession) {
  if (eventType === 'checkout.session.async_payment_failed') {
    await markLifetimeCheckoutFailed(session)
    return
  }

  const plan = session.metadata?.plan
  const userId = session.metadata?.userId

  if (plan === 'lifetime') {
    if (!userId || session.payment_status !== 'paid') return

    await fulfillLifetimeCheckout(userId)
    return
  }

  // Subscription checkout fulfillment is handled by customer.subscription.* events.
  // Keeping this path local avoids a Stripe API roundtrip before returning 2xx.
}

async function reserveStripeWebhookEvent(eventId: string, eventType: string) {
  try {
    await prisma.stripeWebhookEvent.create({
      data: {
        id: eventId,
        type: eventType,
        status: 'processing',
      },
    })
    return 'reserved' as const
  } catch (error) {
    if (!isPrismaUniqueConstraintError(error)) throw error
  }

  const existing = await prisma.stripeWebhookEvent.findUnique({
    where: { id: eventId },
    select: { status: true, updatedAt: true },
  })

  if (!existing) return 'processing' as const
  if (existing.status === 'processed') return 'processed' as const

  const staleBefore = new Date(Date.now() - STRIPE_EVENT_PROCESSING_STALE_MS)
  if (existing.status === 'failed' || existing.updatedAt < staleBefore) {
    const claimed = await prisma.stripeWebhookEvent.updateMany({
      where: {
        id: eventId,
        OR: [{ status: 'failed' }, { updatedAt: { lt: staleBefore } }],
      },
      data: {
        type: eventType,
        status: 'processing',
        attempts: { increment: 1 },
        error: null,
        processedAt: null,
      },
    })

    if (claimed.count === 1) return 'reserved' as const
  }

  return 'processing' as const
}

async function markStripeWebhookEventProcessed(eventId: string) {
  await prisma.stripeWebhookEvent.update({
    where: { id: eventId },
    data: {
      status: 'processed',
      error: null,
      processedAt: new Date(),
    },
  })
}

async function markStripeWebhookEventFailed(eventId: string, error: unknown) {
  await prisma.stripeWebhookEvent.update({
    where: { id: eventId },
    data: {
      status: 'failed',
      error: getErrorMessage(error).slice(0, 2000),
    },
  })
}

function isPrismaUniqueConstraintError(error: unknown) {
  return Boolean(
    error &&
    typeof error === 'object' &&
    'code' in error &&
    (error as { code?: unknown }).code === 'P2002'
  )
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Unknown Stripe webhook error'
}
