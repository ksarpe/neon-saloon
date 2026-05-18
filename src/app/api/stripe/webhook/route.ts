import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { INPUT_LIMITS, readLimitedText, validationErrorResponse } from '@/lib/request-validation'
import {
  getStripeObjectId,
  getStripeWebhookSecret,
  retrieveStripeSubscription,
  type StripeCheckoutSession,
  type StripeSubscription,
  stripeTimestampToDate,
  verifyStripeWebhookSignature,
} from '@/lib/stripe'

export const runtime = 'nodejs'

type StripeWebhookEvent = {
  type: string
  data: { object: unknown }
}

const ACTIVE_SUBSCRIPTION_STATUSES = new Set(['active', 'trialing'])

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
    return NextResponse.json({ error: 'Nieprawidłowy podpis Stripe.' }, { status: 400 })
  }

  try {
    const event = JSON.parse(payload) as StripeWebhookEvent

    if (event.type === 'checkout.session.completed') {
      await handleCheckoutCompleted(event.data.object as StripeCheckoutSession)
    }

    if (
      event.type === 'customer.subscription.updated' ||
      event.type === 'customer.subscription.deleted'
    ) {
      await syncSubscription(event.data.object as StripeSubscription)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[POST /api/stripe/webhook]', error)
    return NextResponse.json({ error: 'Nie udało się obsłużyć webhooka Stripe.' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: StripeCheckoutSession) {
  const plan = session.metadata?.plan
  const userId = session.metadata?.userId

  if (plan === 'lifetime' && userId) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isPremium: true,
        stripeSubscriptionId: null,
        stripeCurrentPeriodEnd: null,
        stripeSubscriptionStatus: 'lifetime',
      },
    })
    return
  }

  const subscriptionId = getStripeObjectId(session.subscription)
  if (!subscriptionId) return

  const subscription = await retrieveStripeSubscription(subscriptionId)
  await syncSubscription(subscription)
}

async function syncSubscription(subscription: StripeSubscription) {
  const subscriptionId = subscription.id
  const customerId = getStripeObjectId(subscription.customer)
  const userId = subscription.metadata?.userId
  const isPremium = ACTIVE_SUBSCRIPTION_STATUSES.has(subscription.status ?? '')

  const data = {
    isPremium,
    stripeSubscriptionId: subscriptionId,
    stripeSubscriptionStatus: subscription.status ?? null,
    stripeCurrentPeriodEnd: stripeTimestampToDate(subscription.current_period_end),
  }

  if (userId) {
    await prisma.user.updateMany({
      where: {
        id: userId,
        NOT: { stripeSubscriptionStatus: 'lifetime' },
      },
      data,
    })
    return
  }

  if (customerId) {
    await prisma.user.updateMany({
      where: {
        stripeCustomerId: customerId,
        NOT: { stripeSubscriptionStatus: 'lifetime' },
      },
      data,
    })
  }
}
