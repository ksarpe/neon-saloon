import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { getAppUrl } from '@/lib/app-url'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createStripeBillingPortalSession, getStripeSecretKey } from '@/lib/stripe'

export async function POST() {
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
