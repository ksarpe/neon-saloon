import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  INPUT_LIMITS,
  readLimitedJson,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'

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
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await readLimitedJson<{ name?: unknown }>(request)
    const name = requiredString(body.name, 'name', INPUT_LIMITS.accountName)

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
  } catch (error) {
    return validationErrorResponse(error) ?? NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
