import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import {
  INPUT_LIMITS,
  readLimitedJson,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import {
  getStripeObjectId,
  getStripeSecretKey,
  retrieveStripeCheckoutSession,
  retrieveStripeSubscription,
} from '@/lib/stripe'
import {
  fulfillLifetimeCheckout,
  markLifetimeCheckoutFailed,
  syncStripeSubscription,
} from '@/lib/stripe-fulfillment'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const rateLimitResponse = await enforceStripeConfirmLimit(request, session.user.id)
    if (rateLimitResponse) return rateLimitResponse

    if (!getStripeSecretKey()) {
      return NextResponse.json({ error: 'Brakuje STRIPE_SECRET_KEY.' }, { status: 500 })
    }

    const body = await readLimitedJson<{ sessionId?: unknown }>(request)
    const sessionId = requiredString(body.sessionId, 'sessionId', INPUT_LIMITS.stripeSessionId)
    if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
      return NextResponse.json(
        { error: 'Nieprawidlowy identyfikator sesji Stripe.' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isPremium: true, stripeCustomerId: true, stripeSubscriptionStatus: true },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const checkoutSession = await retrieveStripeCheckoutSession(sessionId)
    const customerId = getStripeObjectId(checkoutSession.customer)
    const sessionUserId = checkoutSession.metadata?.userId ?? checkoutSession.client_reference_id
    const belongsToUser =
      sessionUserId === session.user.id ||
      (Boolean(customerId) && customerId === user.stripeCustomerId)

    if (!belongsToUser) {
      return NextResponse.json(
        { error: 'Ta sesja Stripe nie nalezy do tego konta.' },
        { status: 403 }
      )
    }

    if (checkoutSession.status !== 'complete') {
      return buildStatusResponse(session.user.id, 'pending')
    }

    if (checkoutSession.mode === 'payment' || checkoutSession.metadata?.plan === 'lifetime') {
      if (checkoutSession.payment_status === 'paid') {
        await fulfillLifetimeCheckout(session.user.id)
        return buildStatusResponse(session.user.id, 'active')
      }

      if (checkoutSession.payment_status === 'unpaid') {
        await markLifetimeCheckoutFailed(checkoutSession)
        return buildStatusResponse(session.user.id, 'failed')
      }

      return buildStatusResponse(session.user.id, 'pending')
    }

    const subscriptionId = getStripeObjectId(checkoutSession.subscription)
    if (subscriptionId) {
      const subscription = await retrieveStripeSubscription(subscriptionId)
      await syncStripeSubscription(subscription)
    }

    return buildStatusResponse(session.user.id)
  } catch (error) {
    const validationResponse = validationErrorResponse(error)
    if (validationResponse) return validationResponse

    console.error('[POST /api/stripe/confirm]', error)
    return NextResponse.json({ error: 'Nie udalo sie potwierdzic sesji Stripe.' }, { status: 500 })
  }
}

const GLOBAL_STRIPE_CONFIRM_LIMITS = [
  { suffix: 'burst', limit: 120, windowMs: 60_000 },
  { suffix: 'sustained', limit: 600, windowMs: 15 * 60_000 },
]

// Każde /confirm to retrieve do Stripe API — limitujemy jak checkout/portal.
async function enforceStripeConfirmLimit(request: Request, userId: string) {
  for (const rateLimit of GLOBAL_STRIPE_CONFIRM_LIMITS) {
    const result = await consumeRateLimit(`stripe:confirm:global:${rateLimit.suffix}`, rateLimit)
    if (!result.allowed) {
      return NextResponse.json(
        {
          error: 'Chwilowo zbyt dużo prób potwierdzenia płatności. Spróbuj ponownie później.',
          retryAfter: result.retryAfter,
        },
        { status: 429, headers: rateLimitHeaders(result) }
      )
    }
  }

  const ipLimit = await consumeRateLimit(`stripe:confirm:ip:${getClientIp(request)}`, {
    limit: 30,
    windowMs: 60_000,
  })
  if (!ipLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Za dużo prób potwierdzenia płatności. Spróbuj ponownie później.',
        retryAfter: ipLimit.retryAfter,
      },
      { status: 429, headers: rateLimitHeaders(ipLimit) }
    )
  }

  const userLimit = await consumeRateLimit(`stripe:confirm:user:${userId}`, {
    limit: 15,
    windowMs: 60_000,
  })
  if (!userLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Za dużo prób potwierdzenia płatności. Spróbuj ponownie później.',
        retryAfter: userLimit.retryAfter,
      },
      { status: 429, headers: rateLimitHeaders(userLimit) }
    )
  }

  return null
}

async function buildStatusResponse(
  userId: string,
  fallbackStatus?: 'active' | 'failed' | 'pending'
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      isPremium: true,
      stripeSubscriptionStatus: true,
      stripeCurrentPeriodEnd: true,
      updatedAt: true,
    },
  })

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  return NextResponse.json({
    status: user.isPremium ? 'active' : (fallbackStatus ?? 'pending'),
    isPremium: user.isPremium,
    subscriptionStatus: user.stripeSubscriptionStatus,
    currentPeriodEnd: user.stripeCurrentPeriodEnd?.toISOString() ?? null,
    updatedAt: user.updatedAt.toISOString(),
  })
}
