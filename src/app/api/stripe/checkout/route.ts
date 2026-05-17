import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  createStripeCheckoutSession,
  createStripeCustomer,
  getStripePriceId,
  getStripeSecretKey,
  isStripePlanId,
  STRIPE_PLAN_CONFIG,
} from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Musisz się zalogować, żeby kupić plan PRO.' },
        { status: 401 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const plan: unknown = body.plan
    if (!isStripePlanId(plan)) {
      return NextResponse.json({ error: 'Nieprawidłowy plan.' }, { status: 400 })
    }

    if (!getStripeSecretKey()) {
      return NextResponse.json({ error: 'Brakuje STRIPE_SECRET_KEY.' }, { status: 500 })
    }

    const priceId = getStripePriceId(plan)
    if (!priceId) {
      return NextResponse.json(
        { error: `Brakuje ${STRIPE_PLAN_CONFIG[plan].priceEnv}.` },
        { status: 500 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        stripeCustomerId: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Nie znaleziono użytkownika.' }, { status: 404 })
    }

    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await createStripeCustomer({
        email: user.email,
        name: user.name,
        userId: user.id,
      })
      customerId = customer.id

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    const origin = getOrigin(request)
    const checkoutSession = await createStripeCheckoutSession({
      customerId,
      origin,
      plan,
      priceId,
      userId: user.id,
    })

    if (!checkoutSession.url) {
      return NextResponse.json({ error: 'Stripe nie zwrócił adresu checkoutu.' }, { status: 502 })
    }

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('[POST /api/stripe/checkout]', error)
    return NextResponse.json({ error: 'Nie udało się rozpocząć płatności.' }, { status: 500 })
  }
}

function getOrigin(request: Request) {
  const requestOrigin = request.headers.get('origin')
  if (requestOrigin) return requestOrigin
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL
  return new URL(request.url).origin
}
