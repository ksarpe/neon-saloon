export const ACTIVE_SUBSCRIPTION_STATUSES = new Set(['active', 'trialing'])

export const INACTIVE_SUBSCRIPTION_STATUSES = new Set([
  'canceled',
  'incomplete',
  'incomplete_expired',
  'past_due',
  'paused',
  'payment_failed',
  'unpaid',
])

export function isActiveSubscriptionStatus(status: string | null | undefined) {
  return ACTIVE_SUBSCRIPTION_STATUSES.has(status ?? '')
}

export function isInactiveSubscriptionStatus(status: string | null | undefined) {
  return INACTIVE_SUBSCRIPTION_STATUSES.has(status ?? '')
}
