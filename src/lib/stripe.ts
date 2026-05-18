import { createHmac, timingSafeEqual } from 'node:crypto'

export type StripePlanId = 'monthly' | 'lifetime'
export type StripeCheckoutMode = 'payment' | 'subscription'

export interface StripeCheckoutSession {
  id: string
  url: string | null
  mode?: StripeCheckoutMode
  customer?: string | { id: string } | null
  subscription?: string | { id: string } | null
  metadata?: Record<string, string> | null
  payment_status?: string
}

export interface StripeSubscription {
  id: string
  customer?: string | { id: string } | null
  status?: string
  current_period_end?: number
  metadata?: Record<string, string> | null
}

export interface StripeBillingPortalSession {
  id: string
  url: string
}

export const STRIPE_PLAN_CONFIG = {
  monthly: {
    mode: 'subscription',
    priceEnv: 'STRIPE_MONTHLY_PRICE_ID',
  },
  lifetime: {
    mode: 'payment',
    priceEnv: 'STRIPE_LIFETIME_PRICE_ID',
  },
} as const satisfies Record<StripePlanId, { mode: StripeCheckoutMode; priceEnv: string }>

export function isStripePlanId(plan: unknown): plan is StripePlanId {
  return plan === 'monthly' || plan === 'lifetime'
}

export function getStripePriceId(plan: StripePlanId) {
  return process.env[STRIPE_PLAN_CONFIG[plan].priceEnv]
}

export function getStripeSecretKey() {
  return process.env.STRIPE_SECRET_KEY
}

export function getStripeWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET
}

export function getStripeObjectId(value: string | { id: string } | null | undefined) {
  if (!value) return null
  return typeof value === 'string' ? value : value.id
}

export function stripeTimestampToDate(timestamp: number | null | undefined) {
  return timestamp ? new Date(timestamp * 1000) : null
}

export async function stripeApiRequest<T>(
  path: string,
  init: RequestInit = {},
  secretKey = getStripeSecretKey()
): Promise<T> {
  if (!secretKey) {
    throw new Error('Missing STRIPE_SECRET_KEY')
  }

  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${secretKey}`)

  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    ...init,
    headers,
  })
  const text = await response.text()
  const payload = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = payload?.error?.message ?? `Stripe request failed with ${response.status}`
    throw new Error(message)
  }

  return payload as T
}

export async function createStripeCustomer(input: {
  email: string
  name?: string | null
  userId: string
}) {
  const body = new URLSearchParams()
  body.set('email', input.email)
  if (input.name) body.set('name', input.name)
  body.set('metadata[userId]', input.userId)

  return stripeApiRequest<{ id: string }>('/customers', {
    method: 'POST',
    headers: {
      'Idempotency-Key': `customer:${input.userId}`,
    },
    body,
  })
}

export async function createStripeCheckoutSession(input: {
  customerId: string
  appUrl: string
  plan: StripePlanId
  priceId: string
  userId: string
}) {
  const config = STRIPE_PLAN_CONFIG[input.plan]
  const body = new URLSearchParams()

  body.set('mode', config.mode)
  body.set('customer', input.customerId)
  body.set('client_reference_id', input.userId)
  body.set('line_items[0][price]', input.priceId)
  body.set('line_items[0][quantity]', '1')
  body.set('allow_promotion_codes', 'true')
  body.set('success_url', `${input.appUrl}/panel?checkout=success`)
  body.set('cancel_url', `${input.appUrl}/panel?checkout=cancelled`)
  body.set('metadata[userId]', input.userId)
  body.set('metadata[plan]', input.plan)

  if (config.mode === 'subscription') {
    body.set('subscription_data[metadata][userId]', input.userId)
    body.set('subscription_data[metadata][plan]', input.plan)
  } else {
    body.set('payment_intent_data[metadata][userId]', input.userId)
    body.set('payment_intent_data[metadata][plan]', input.plan)
  }

  return stripeApiRequest<StripeCheckoutSession>('/checkout/sessions', {
    method: 'POST',
    body,
  })
}

export async function retrieveStripeSubscription(subscriptionId: string) {
  return stripeApiRequest<StripeSubscription>(`/subscriptions/${subscriptionId}`)
}

export async function createStripeBillingPortalSession(input: {
  customerId: string
  returnUrl: string
}) {
  const body = new URLSearchParams()
  body.set('customer', input.customerId)
  body.set('return_url', input.returnUrl)

  return stripeApiRequest<StripeBillingPortalSession>('/billing_portal/sessions', {
    method: 'POST',
    body,
  })
}

export function verifyStripeWebhookSignature(input: {
  payload: string
  signatureHeader: string
  webhookSecret: string
  toleranceSeconds?: number
}) {
  const timestamp = getStripeSignaturePart(input.signatureHeader, 't')
  const signatures = getStripeSignatureParts(input.signatureHeader, 'v1')
  if (!timestamp || signatures.length === 0) return false

  const timestampSeconds = Number(timestamp)
  if (!Number.isFinite(timestampSeconds)) return false

  const tolerance = input.toleranceSeconds ?? 300
  const ageSeconds = Math.abs(Date.now() / 1000 - timestampSeconds)
  if (ageSeconds > tolerance) return false

  const expected = createHmac('sha256', input.webhookSecret)
    .update(`${timestamp}.${input.payload}`, 'utf8')
    .digest('hex')

  return signatures.some((signature) => timingSafeHexEqual(signature, expected))
}

function getStripeSignaturePart(header: string, key: string) {
  return header
    .split(',')
    .map((part) => part.trim().split('='))
    .find(([name]) => name === key)?.[1]
}

function getStripeSignatureParts(header: string, key: string) {
  return header
    .split(',')
    .map((part) => part.trim().split('='))
    .filter(([name, value]) => name === key && value)
    .map(([, value]) => value)
}

function timingSafeHexEqual(value: string, expected: string) {
  const valueBuffer = Buffer.from(value, 'hex')
  const expectedBuffer = Buffer.from(expected, 'hex')
  if (valueBuffer.length !== expectedBuffer.length) return false
  return timingSafeEqual(valueBuffer, expectedBuffer)
}
