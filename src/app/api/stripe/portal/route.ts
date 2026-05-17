import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createStripeBillingPortalSession, getStripeSecretKey } from '@/lib/stripe'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Musisz się zalogować.' }, { status: 401 })
    }

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

    const origin = getOrigin(request)
    const portalSession = await createStripeBillingPortalSession({
      customerId: user.stripeCustomerId,
      returnUrl: `${origin}/panel?billing=return`,
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

function getOrigin(request: Request) {
  const requestOrigin = request.headers.get('origin')
  if (requestOrigin) return requestOrigin
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL
  return new URL(request.url).origin
}
