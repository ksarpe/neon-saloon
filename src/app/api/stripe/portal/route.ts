import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { getAppUrl } from '@/lib/app-url'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import { createStripeBillingPortalSession, getStripeSecretKey } from '@/lib/stripe'

const GLOBAL_STRIPE_PORTAL_LIMITS = [
  { suffix: 'burst', limit: 120, windowMs: 60_000 },
  { suffix: 'sustained', limit: 600, windowMs: 15 * 60_000 },
]

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Musisz się zalogować.' }, { status: 401 })
    }
    const rateLimitResponse = await enforceStripePortalLimit(request, session.user.id)
    if (rateLimitResponse) return rateLimitResponse

    if (!getStripeSecretKey()) {
      return NextResponse.json({ error: 'Brakuje STRIPE_SECRET_KEY.' }, { status: 500 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    })

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Nie znaleziono profilu płatności Stripe dla tego konta.' },
        { status: 400 }
      )
    }

    const appUrl = getAppUrl()
    const portalSession = await createStripeBillingPortalSession({
      customerId: user.stripeCustomerId,
      returnUrl: `${appUrl}/panel?billing=return`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error('[POST /api/stripe/portal]', error)
    return NextResponse.json(
      {
        error:
          'Nie udało się otworzyć panelu Stripe. Sprawdź, czy Customer Portal jest skonfigurowany w Stripe Dashboard.',
      },
      { status: 500 }
    )
  }
}

async function enforceStripePortalLimit(request: Request, userId: string) {
  for (const rateLimit of GLOBAL_STRIPE_PORTAL_LIMITS) {
    const result = await consumeRateLimit(`stripe:portal:global:${rateLimit.suffix}`, rateLimit)
    if (!result.allowed) {
      return NextResponse.json(
        {
          error: 'Chwilowo zbyt dużo prób otwarcia panelu płatności. Spróbuj ponownie później.',
          retryAfter: result.retryAfter,
        },
        { status: 429, headers: rateLimitHeaders(result) }
      )
    }
  }

  const ipLimit = await consumeRateLimit(`stripe:portal:ip:${getClientIp(request)}`, {
    limit: 20,
    windowMs: 60_000,
  })
  if (!ipLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Za dużo prób otwarcia panelu płatności. Spróbuj ponownie później.',
        retryAfter: ipLimit.retryAfter,
      },
      { status: 429, headers: rateLimitHeaders(ipLimit) }
    )
  }

  const userLimit = await consumeRateLimit(`stripe:portal:user:${userId}`, {
    limit: 5,
    windowMs: 60_000,
  })
  if (!userLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Za dużo prób otwarcia panelu płatności. Spróbuj ponownie później.',
        retryAfter: userLimit.retryAfter,
      },
      { status: 429, headers: rateLimitHeaders(userLimit) }
    )
  }

  return null
}
