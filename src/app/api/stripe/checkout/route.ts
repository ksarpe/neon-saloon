import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { getAppUrl } from '@/lib/app-url'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  INPUT_LIMITS,
  readLimitedJson,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import {
  createStripeCheckoutSession,
  createStripeCustomer,
  getStripePriceId,
  getStripeSecretKey,
  isStripePlanId,
  STRIPE_PLAN_CONFIG,
} from '@/lib/stripe'

type CheckoutUser = {
  id: string
  email: string
  name: string | null
  stripeCustomerId: string | null
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Musisz się zalogować, żeby kupić plan PRO.' },
        { status: 401 }
      )
    }

    const body = await readLimitedJson<{ plan?: unknown }>(request)
    const plan = requiredString(body.plan, 'plan', INPUT_LIMITS.stripePlan)
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

    const customerId = await getOrCreateStripeCustomerId(user)

    const appUrl = getAppUrl()
    const checkoutSession = await createStripeCheckoutSession({
      customerId,
      appUrl,
      plan,
      priceId,
      userId: user.id,
    })

    if (!checkoutSession.url) {
      return NextResponse.json({ error: 'Stripe nie zwrócił adresu checkoutu.' }, { status: 502 })
    }

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    const validationResponse = validationErrorResponse(error)
    if (validationResponse) return validationResponse

    console.error('[POST /api/stripe/checkout]', error)
    return NextResponse.json({ error: 'Nie udało się rozpocząć płatności.' }, { status: 500 })
  }
}

async function getOrCreateStripeCustomerId(user: CheckoutUser) {
  if (user.stripeCustomerId) return user.stripeCustomerId

  const customer = await createStripeCustomer({
    email: user.email,
    name: user.name,
    userId: user.id,
  })

  const update = await prisma.user.updateMany({
    where: {
      id: user.id,
      stripeCustomerId: null,
    },
    data: { stripeCustomerId: customer.id },
  })

  if (update.count === 1) return customer.id

  const freshUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { stripeCustomerId: true },
  })

  if (freshUser?.stripeCustomerId) return freshUser.stripeCustomerId

  throw new Error('Failed to persist Stripe customer id')
}
