import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const ACTIVE_SUBSCRIPTION_STATUSES = new Set(['active', 'trialing'])
const INACTIVE_SUBSCRIPTION_STATUSES = new Set(['canceled', 'incomplete_expired', 'unpaid'])

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      isPremium: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      stripeSubscriptionStatus: true,
      stripeCurrentPeriodEnd: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const subscriptionStatus = user.stripeSubscriptionStatus
  const premiumStatus = user.isPremium
    ? 'active'
    : subscriptionStatus && INACTIVE_SUBSCRIPTION_STATUSES.has(subscriptionStatus)
      ? 'failed'
      : user.stripeCustomerId
        ? 'pending'
        : 'free'

  const plan =
    subscriptionStatus === 'lifetime'
      ? 'lifetime'
      : user.stripeSubscriptionId || ACTIVE_SUBSCRIPTION_STATUSES.has(subscriptionStatus ?? '')
        ? 'monthly'
        : 'free'

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    premium: {
      isPremium: user.isPremium,
      status: premiumStatus,
      plan,
      subscriptionStatus,
      currentPeriodEnd: user.stripeCurrentPeriodEnd?.toISOString() ?? null,
      canManageBilling: Boolean(user.stripeCustomerId),
    },
  })
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as { name?: string }
  const name = body.name?.trim()

  if (!name) {
    return NextResponse.json({ error: 'Nazwa jest wymagana.' }, { status: 400 })
  }
  if (name.length > 40) {
    return NextResponse.json({ error: 'Nazwa może mieć maksymalnie 40 znaków.' }, { status: 400 })
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
    select: {
      id: true,
      email: true,
      name: true,
      updatedAt: true,
    },
  })

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    updatedAt: user.updatedAt.toISOString(),
  })
}
