import { prisma } from './prisma'
import {
  getStripeObjectId,
  getSubscriptionPeriodEnd,
  type StripeCheckoutSession,
  type StripeSubscription,
  stripeTimestampToDate,
} from './stripe'
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
    stripeCurrentPeriodEnd: stripeTimestampToDate(getSubscriptionPeriodEnd(subscription)),
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

// Odbiera dostęp lifetime po zwrocie / chargebacku. Status 'lifetime' jest permanentną
// podłogą (blokuje syncStripeSubscription/markLifetimeCheckoutFailed), więc to JEDYNA
// ścieżka, która potrafi go zdjąć. Scope = tylko grant lifetime danego klienta —
// dostęp z subskrypcji miesięcznej jest sterowany osobno przez status subskrypcji.
export async function revokeLifetimeAccess(customerId: string | null, status: 'refunded' | 'disputed') {
  if (!customerId) return

  await prisma.user.updateMany({
    where: {
      stripeCustomerId: customerId,
      stripeSubscriptionStatus: 'lifetime',
    },
    data: {
      isPremium: false,
      stripeSubscriptionId: null,
      stripeCurrentPeriodEnd: null,
      stripeSubscriptionStatus: status,
    },
  })
}
