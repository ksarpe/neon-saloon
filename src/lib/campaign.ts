import {
  boundedStringArray,
  RequestValidationError,
  requiredString,
} from '@/lib/request-validation'

// Wspólne limity treści dla kampanii marketingowych i powiadomień serwisowych.
const SUBJECT_MAX = 200
const HEADING_MAX = 200
const PARAGRAPHS_MAX = 30
const PARAGRAPH_MAX = 4000
const CTA_LABEL_MAX = 80
const URL_MAX = 2048

export type Campaign = {
  subject: string
  heading: string
  paragraphs: string[]
  cta?: { label: string; url: string }
}

export type CampaignBody = {
  subject?: unknown
  heading?: unknown
  paragraphs?: unknown
  cta?: unknown
}

/** Waliduje i normalizuje treść kampanii (temat, nagłówek, akapity, opcjonalny przycisk). */
export function parseCampaign(body: CampaignBody): Campaign {
  const campaign: Campaign = {
    subject: requiredString(body.subject, 'subject', SUBJECT_MAX),
    heading: requiredString(body.heading, 'heading', HEADING_MAX),
    paragraphs: boundedStringArray(body.paragraphs, 'paragraphs', PARAGRAPHS_MAX, PARAGRAPH_MAX),
    cta: parseCta(body.cta),
  }

  if (campaign.paragraphs.length === 0) {
    throw new RequestValidationError('Kampania musi zawierać co najmniej jeden akapit.')
  }

  return campaign
}

function parseCta(value: unknown): Campaign['cta'] {
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
