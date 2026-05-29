import { timingSafeEqual } from 'node:crypto'

import { NextResponse } from 'next/server'

import {
  type MarketingCampaign,
  type MarketingRecipient,
  sendMarketingBatch,
} from '@/lib/email'
import { buildUnsubscribeUrl } from '@/lib/marketing'
import { prisma } from '@/lib/prisma'
import {
  boundedStringArray,
  normalizeEmail,
  readLimitedJson,
  RequestValidationError,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'

export const runtime = 'nodejs'

// Limity treści kampanii.
const SUBJECT_MAX = 200
const HEADING_MAX = 200
const PARAGRAPHS_MAX = 30
const PARAGRAPH_MAX = 4000
const CTA_LABEL_MAX = 80
const URL_MAX = 2048

type SendBody = {
  subject?: unknown
  heading?: unknown
  paragraphs?: unknown
  cta?: unknown
  test?: unknown
  testEmail?: unknown
}

export async function POST(request: Request) {
  try {
    const authError = authorize(request)
    if (authError) return authError

    const body = await readLimitedJson<SendBody>(request)

    const campaign: MarketingCampaign = {
      subject: requiredString(body.subject, 'subject', SUBJECT_MAX),
      heading: requiredString(body.heading, 'heading', HEADING_MAX),
      paragraphs: boundedStringArray(body.paragraphs, 'paragraphs', PARAGRAPHS_MAX, PARAGRAPH_MAX),
      cta: parseCta(body.cta),
    }

    if (campaign.paragraphs.length === 0) {
      throw new RequestValidationError('Kampania musi zawierać co najmniej jeden akapit.')
    }

    // Tryb testowy: wysyłka tylko na wskazany adres (podgląd przed kampanią).
    if (body.test === true) {
      const testEmail = normalizeEmail(body.testEmail, 'testEmail')
      const recipient = await buildTestRecipient(testEmail)
      const result = await sendMarketingBatch(campaign, [recipient])
      return NextResponse.json({ test: true, ...result })
    }

    const users = await prisma.user.findMany({
      where: { marketingConsent: true },
      select: { id: true, email: true },
    })

    const recipients: MarketingRecipient[] = users.map((user) => ({
      email: user.email,
      unsubscribeUrl: buildUnsubscribeUrl(user.id),
    }))

    const result = await sendMarketingBatch(campaign, recipients)
    return NextResponse.json({ test: false, ...result })
  } catch (error) {
    const validationResponse = validationErrorResponse(error)
    if (validationResponse) return validationResponse

    console.error('[POST /api/marketing/send]', error)
    return NextResponse.json({ error: 'Nie udało się wysłać kampanii.' }, { status: 500 })
  }
}

// Bearer secret z MARKETING_ADMIN_SECRET. Bez ustawionego sekretu endpoint jest wyłączony.
function authorize(request: Request) {
  const secret = process.env.MARKETING_ADMIN_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Mailing nie jest skonfigurowany.' }, { status: 503 })
  }

  const header = request.headers.get('authorization') ?? ''
  const provided = header.startsWith('Bearer ') ? header.slice(7) : ''

  if (!safeEqual(provided, secret)) {
    return NextResponse.json({ error: 'Brak autoryzacji.' }, { status: 401 })
  }

  return null
}

function safeEqual(a: string, b: string) {
  const bufferA = Buffer.from(a)
  const bufferB = Buffer.from(b)
  if (bufferA.length !== bufferB.length) return false
  return timingSafeEqual(bufferA, bufferB)
}

function parseCta(value: unknown): MarketingCampaign['cta'] {
  if (value === undefined || value === null) return undefined
  if (typeof value !== 'object') {
    throw new RequestValidationError('cta must be an object')
  }

  const cta = value as { label?: unknown; url?: unknown }
  const label = requiredString(cta.label, 'cta.label', CTA_LABEL_MAX)
  const url = requiredString(cta.url, 'cta.url', URL_MAX)

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new RequestValidationError('cta.url must be a valid URL')
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new RequestValidationError('cta.url must use http or https')
  }

  return { label, url }
}

async function buildTestRecipient(email: string): Promise<MarketingRecipient> {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  // Gdy adres nie należy do konta, generujemy poglądowy token — wypisanie nikogo nie dotknie.
  return {
    email,
    unsubscribeUrl: buildUnsubscribeUrl(user?.id ?? 'preview'),
  }
}
