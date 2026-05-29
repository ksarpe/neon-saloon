import { sendPurchaseConfirmationEmail } from './email'
import { prisma } from './prisma'
import {
  getStripeObjectId,
  getSubscriptionPeriodEnd,
  type StripeCheckoutSession,
  type StripePlanId,
  type StripeSubscription,
  stripeTimestampToDate,
} from './stripe'
import { isActiveSubscriptionStatus } from './subscription-status'

// Potwierdzenie zawarcia umowy na trwałym nośniku (art. 21 u.p.k.) wysyłane raz na
// opłaconą sesję checkout. Best-effort: błąd wysyłki logujemy, ale NIE wywracamy webhooka
// (inaczej Stripe ponawiałby zdarzenie i ponownie realizował dostęp). Treść zgody bierzemy
// z utrwalonego rejestru PurchaseConsent, żeby potwierdzenie odpowiadało dokładnie temu,
// na co zgodził się użytkownik.
export async function sendPurchaseConfirmation(userId: string, plan: StripePlanId) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    })
    if (!user?.email) return

    const consent = await prisma.purchaseConsent.findFirst({
      where: { userId, plan },
      orderBy: { createdAt: 'desc' },
      select: { text: true, version: true, createdAt: true },
    })
    if (!consent) return

    await sendPurchaseConfirmationEmail({
      to: user.email,
      plan,
      consentText: consent.text,
      consentVersion: consent.version,
      purchasedAt: consent.createdAt,
    })
  } catch (error) {
    console.error('[sendPurchaseConfirmation]', error)
  }
}

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
