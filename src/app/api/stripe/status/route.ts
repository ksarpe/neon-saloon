import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const INACTIVE_SUBSCRIPTION_STATUSES = new Set(['canceled', 'incomplete_expired', 'unpaid'])

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      isPremium: true,
      stripeCustomerId: true,
      stripeSubscriptionStatus: true,
      stripeCurrentPeriodEnd: true,
      updatedAt: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const subscriptionStatus = user.stripeSubscriptionStatus
  const status = user.isPremium
    ? 'active'
    : subscriptionStatus && INACTIVE_SUBSCRIPTION_STATUSES.has(subscriptionStatus)
      ? 'failed'
      : 'pending'

  return NextResponse.json({
    status,
    isPremium: user.isPremium,
    hasStripeCustomer: Boolean(user.stripeCustomerId),
    subscriptionStatus,
    currentPeriodEnd: user.stripeCurrentPeriodEnd?.toISOString() ?? null,
    updatedAt: user.updatedAt.toISOString(),
  })
}
