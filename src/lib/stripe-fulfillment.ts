import { prisma } from './prisma'
import { getStripeObjectId, type StripeCheckoutSession, type StripeSubscription } from './stripe'
import { isActiveSubscriptionStatus } from './subscription-status'

export async function fulfillLifetimeCheckout(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      isPremium: true,
      stripeSubscriptionId: null,
      stripeCurrentPeriodEnd: null,
      stripeSubscriptionStatus: 'lifetime',
    },
  })
}

export async function markLifetimeCheckoutFailed(session: StripeCheckoutSession) {
  if (session.metadata?.plan !== 'lifetime' || !session.metadata.userId) return

  await prisma.user.updateMany({
    where: {
      id: session.metadata.userId,
      OR: [{ stripeSubscriptionStatus: null }, { stripeSubscriptionStatus: { not: 'lifetime' } }],
    },
    data: {
      isPremium: false,
      stripeSubscriptionId: null,
      stripeCurrentPeriodEnd: null,
      stripeSubscriptionStatus: 'payment_failed',
    },
  })
}

export async function syncStripeSubscription(subscription: StripeSubscription) {
  const subscriptionId = subscription.id
  const customerId = getStripeObjectId(subscription.customer)
  const userId = subscription.metadata?.userId
  const isPremium = isActiveSubscriptionStatus(subscription.status)

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
        OR: [{ stripeSubscriptionStatus: null }, { stripeSubscriptionStatus: { not: 'lifetime' } }],
      },
      data,
    })
    return
  }

  if (customerId) {
    await prisma.user.updateMany({
      where: {
        stripeCustomerId: customerId,
        OR: [{ stripeSubscriptionStatus: null }, { stripeSubscriptionStatus: { not: 'lifetime' } }],
      },
      data,
    })
  }
}

function stripeTimestampToDate(timestamp: number | null | undefined) {
  return timestamp ? new Date(timestamp * 1000) : null
}
