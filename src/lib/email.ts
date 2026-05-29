import { COMPANY, COMPANY_ADDRESS_LINE } from '@/config/company'
import { PRICING } from '@/config/pricing'
import { getAppUrl } from '@/lib/app-url'
import type { StripePlanId } from '@/lib/stripe'

type SendPasswordResetEmailInput = {
  to: string
  resetUrl: string
}

type SendPurchaseConfirmationEmailInput = {
  to: string
  plan: StripePlanId
  /** Dokładna treść zgody, na jaką zgodził się użytkownik (z rejestru PurchaseConsent). */
  consentText: string
  /** Wersja zgody — pozwala powiązać potwierdzenie z konkretnym brzmieniem. */
  consentVersion: string
  /** Data zawarcia umowy (zgody). */
  purchasedAt: Date
}

const PLAN_LABEL: Record<StripePlanId, string> = {
  monthly: 'Last Rodeo PRO — subskrypcja miesięczna',
  lifetime: 'Last Rodeo PRO — dostęp dożywotni',
}

export type MarketingCampaign = {
  /** Temat wiadomości. */
  subject: string
  /** Nagłówek w treści. */
  heading: string
  /** Akapity treści (czysty tekst, zostaną zescapowane). */
  paragraphs: string[]
  /** Opcjonalny przycisk akcji. */
  cta?: { label: string; url: string }
}

export type MarketingRecipient = {
  email: string
  /** Spersonalizowany, podpisany link wypisania (jeden na odbiorcę). */
  unsubscribeUrl: string
}

// Resend pozwala wysłać do 100 wiadomości w jednym żądaniu /emails/batch.
const MARKETING_BATCH_SIZE = 100

type ResendEmailResponse = {
  id?: string
  message?: string
  error?: { message?: string }
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM)
}

export async function sendPasswordResetEmail(input: SendPasswordResetEmailInput) {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[password-reset] ${input.to}: ${input.resetUrl}`)
      return { delivered: false, devUrl: input.resetUrl }
    }

    throw new Error('Email provider is not configured')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: input.to,
      subject: 'Reset hasła w Last Rodeo',
      html: buildPasswordResetEmail(input.resetUrl),
      text: buildPasswordResetText(input.resetUrl),
    }),
  })

  const payload = (await response.json().catch(() => ({}))) as ResendEmailResponse
  if (!response.ok) {
    throw new Error(payload.error?.message ?? payload.message ?? 'Failed to send email')
  }

  return { delivered: true, id: payload.id }
}

/**
 * Potwierdzenie zawarcia umowy na trwałym nośniku (art. 21 ustawy o prawach konsumenta).
 * Zawiera przedmiot umowy, cenę oraz utrwaloną treść zgody na rozpoczęcie świadczenia
 * wraz z informacją o utracie prawa odstąpienia (warunek skuteczności z art. 38 u.p.k.).
 */
export async function sendPurchaseConfirmationEmail(input: SendPurchaseConfirmationEmailInput) {
  const pricing = PRICING[input.plan]
  const planLabel = PLAN_LABEL[input.plan]
  const priceLine = `${pricing.amount} ${pricing.period}`.trim()
  const purchasedAtLabel = formatDateTime(input.purchasedAt)

  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[purchase-confirmation] ${input.to}: ${planLabel} (${priceLine})`)
      return { delivered: false }
    }

    throw new Error('Email provider is not configured')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: input.to,
      subject: `Potwierdzenie zakupu — ${planLabel}`,
      html: buildPurchaseConfirmationEmail({ planLabel, priceLine, purchasedAtLabel, ...input }),
      text: buildPurchaseConfirmationText({ planLabel, priceLine, purchasedAtLabel, ...input }),
    }),
  })

  const payload = (await response.json().catch(() => ({}))) as ResendEmailResponse
  if (!response.ok) {
    throw new Error(payload.error?.message ?? payload.message ?? 'Failed to send email')
  }

  return { delivered: true, id: payload.id }
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat('pl-PL', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Warsaw',
  }).format(date)
}

type PurchaseConfirmationView = SendPurchaseConfirmationEmailInput & {
  planLabel: string
  priceLine: string
  purchasedAtLabel: string
}

function buildPurchaseConfirmationEmail(view: PurchaseConfirmationView) {
  const appUrl = getAppUrl()
  const sellerLine = [COMPANY.legalName, COMPANY_ADDRESS_LINE, `NIP: ${COMPANY.nip}`]
    .filter(Boolean)
    .join(' • ')

  return `
    <div style="font-family:Arial,sans-serif;background:#0d0818;color:#fff;padding:32px">
      <div style="max-width:560px;margin:0 auto;border:1px solid rgba(255,220,180,.18);border-radius:16px;padding:28px;background:#160d25">
        <h1 style="margin:0 0 12px;color:#f94aff">Dziękujemy za zakup!</h1>
        <p style="line-height:1.6;color:#d8c9e8">
          Potwierdzamy zawarcie umowy o dostarczanie treści cyfrowych w serwisie Last Rodeo.
        </p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;color:#d8c9e8;font-size:14px">
          <tr>
            <td style="padding:6px 0;color:#9d8faf">Plan</td>
            <td style="padding:6px 0;text-align:right;font-weight:700">${view.planLabel}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#9d8faf">Cena (brutto)</td>
            <td style="padding:6px 0;text-align:right;font-weight:700">${view.priceLine}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;color:#9d8faf">Data zawarcia umowy</td>
            <td style="padding:6px 0;text-align:right">${view.purchasedAtLabel}</td>
          </tr>
        </table>
        <div style="border:1px solid rgba(255,220,180,.18);border-radius:12px;padding:16px;margin:16px 0;background:#1d1230">
          <p style="margin:0 0 8px;color:#9d8faf;font-size:12px;text-transform:uppercase;letter-spacing:.04em">
            Udzielona zgoda (wersja ${view.consentVersion})
          </p>
          <p style="margin:0;line-height:1.6;color:#d8c9e8;font-size:13px">${view.consentText}</p>
        </div>
        <p style="line-height:1.6;color:#d8c9e8;font-size:13px">
          Świadczenie rozpoczęło się za Twoją wyraźną zgodą, dlatego — zgodnie z art. 38 ustawy o
          prawach konsumenta — z chwilą jego rozpoczęcia utraciłeś/-aś prawo odstąpienia od umowy.
        </p>
        <p style="margin:20px 0 0;font-size:13px;line-height:1.6">
          <a href="${appUrl}/regulamin" style="color:#f94aff">Regulamin</a> &nbsp;•&nbsp;
          <a href="${appUrl}/polityka-prywatnosci" style="color:#f94aff">Polityka prywatności</a>
        </p>
        <p style="margin:20px 0 0;font-size:12px;line-height:1.5;color:#9d8faf">
          Sprzedawca: ${sellerLine}<br />
          Kontakt: ${COMPANY.email}
        </p>
      </div>
    </div>
  `
}

function buildPurchaseConfirmationText(view: PurchaseConfirmationView) {
  const appUrl = getAppUrl()
  return [
    'Potwierdzenie zakupu — Last Rodeo',
    '',
    'Potwierdzamy zawarcie umowy o dostarczanie treści cyfrowych w serwisie Last Rodeo.',
    '',
    `Plan: ${view.planLabel}`,
    `Cena (brutto): ${view.priceLine}`,
    `Data zawarcia umowy: ${view.purchasedAtLabel}`,
    '',
    `Udzielona zgoda (wersja ${view.consentVersion}):`,
    view.consentText,
    '',
    'Świadczenie rozpoczęło się za Twoją wyraźną zgodą, dlatego — zgodnie z art. 38 ustawy',
    'o prawach konsumenta — z chwilą jego rozpoczęcia utraciłeś/-aś prawo odstąpienia od umowy.',
    '',
    `Regulamin: ${appUrl}/regulamin`,
    `Polityka prywatności: ${appUrl}/polityka-prywatnosci`,
    '',
    `Sprzedawca: ${COMPANY.legalName}`,
    COMPANY_ADDRESS_LINE,
    `NIP: ${COMPANY.nip}`,
    `Kontakt: ${COMPANY.email}`,
  ]
    .filter(Boolean)
    .join('\n')
}

function buildPasswordResetEmail(resetUrl: string) {
  return `
    <div style="font-family:Arial,sans-serif;background:#0d0818;color:#fff;padding:32px">
      <div style="max-width:520px;margin:0 auto;border:1px solid rgba(255,220,180,.18);border-radius:16px;padding:28px;background:#160d25">
        <h1 style="margin:0 0 12px;color:#f94aff">Reset hasła</h1>
        <p style="line-height:1.6;color:#d8c9e8">
          Dostaliśmy prośbę o zmianę hasła do Twojego konta Last Rodeo.
          Link jest ważny przez 30 minut.
        </p>
        <p style="margin:28px 0">
          <a href="${resetUrl}" style="display:inline-block;background:#f94aff;color:#fff;text-decoration:none;font-weight:700;border-radius:12px;padding:14px 18px">
            Ustaw nowe hasło
          </a>
        </p>
        <p style="font-size:13px;line-height:1.5;color:#9d8faf">
          Jeśli to nie Ty, zignoruj tę wiadomość. Twoje hasło nie zostanie zmienione.
        </p>
      </div>
    </div>
  `
}

function buildPasswordResetText(resetUrl: string) {
  return [
    'Reset hasła w Last Rodeo',
    '',
    'Dostaliśmy prośbę o zmianę hasła do Twojego konta.',
    'Link jest ważny przez 30 minut:',
    resetUrl,
    '',
    'Jeśli to nie Ty, zignoruj tę wiadomość.',
  ].join('\n')
}

// ── Marketing (mailing) ───────────────────────────────────────────────────────

export type MarketingSendResult = {
  total: number
  sent: number
  failed: number
}

/**
 * Wysyłka kampanii marketingowej do listy odbiorców (każdy z własnym linkiem wypisania).
 * Dzieli odbiorców na paczki po 100 i korzysta z Resend /emails/batch. Każda wiadomość
 * niesie nagłówki List-Unsubscribe oraz List-Unsubscribe-Post (jednoklikowe wypisanie —
 * wymóg dostarczalności dla masowych nadawców, m.in. Gmail/Yahoo). Błąd paczki jest
 * logowany i liczony jako nieudany, ale nie przerywa wysyłki pozostałych paczek.
 */
export async function sendMarketingBatch(
  campaign: MarketingCampaign,
  recipients: MarketingRecipient[]
): Promise<MarketingSendResult> {
  const result: MarketingSendResult = { total: recipients.length, sent: 0, failed: 0 }

  if (recipients.length === 0) return result

  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(
        `[marketing] (dev) pominięto wysyłkę „${campaign.subject}" do ${recipients.length} odb.`
      )
      return result
    }
    throw new Error('Email provider is not configured')
  }

  for (let offset = 0; offset < recipients.length; offset += MARKETING_BATCH_SIZE) {
    const chunk = recipients.slice(offset, offset + MARKETING_BATCH_SIZE)
    const payload = chunk.map((recipient) => ({
      from: process.env.EMAIL_FROM,
      to: recipient.email,
      subject: campaign.subject,
      html: buildMarketingEmail(campaign, recipient.unsubscribeUrl),
      text: buildMarketingText(campaign, recipient.unsubscribeUrl),
      headers: {
        'List-Unsubscribe': `<${recipient.unsubscribeUrl}>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    }))

    try {
      const response = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as ResendEmailResponse
        throw new Error(body.error?.message ?? body.message ?? `Resend batch failed (${response.status})`)
      }

      result.sent += chunk.length
    } catch (error) {
      result.failed += chunk.length
      console.error('[sendMarketingBatch] chunk failed', error)
    }
  }

  return result
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function buildMarketingEmail(campaign: MarketingCampaign, unsubscribeUrl: string) {
  const appUrl = getAppUrl()
  const paragraphs = campaign.paragraphs
    .map(
      (paragraph) =>
        `<p style="line-height:1.6;color:#d8c9e8;font-size:14px;margin:0 0 14px">${escapeHtml(paragraph)}</p>`
    )
    .join('')

  const cta = campaign.cta
    ? `<p style="margin:24px 0"><a href="${escapeHtml(campaign.cta.url)}" style="display:inline-block;background:#f94aff;color:#fff;text-decoration:none;font-weight:700;border-radius:12px;padding:14px 22px">${escapeHtml(campaign.cta.label)}</a></p>`
    : ''

  return `
    <div style="font-family:Arial,sans-serif;background:#0d0818;color:#fff;padding:32px">
      <div style="max-width:560px;margin:0 auto;border:1px solid rgba(255,220,180,.18);border-radius:16px;padding:28px;background:#160d25">
        <h1 style="margin:0 0 16px;color:#f94aff">${escapeHtml(campaign.heading)}</h1>
        ${paragraphs}
        ${cta}
        <hr style="border:none;border-top:1px solid rgba(255,220,180,.14);margin:24px 0" />
        <p style="font-size:11px;line-height:1.6;color:#9d8faf;margin:0">
          Otrzymujesz tę wiadomość, ponieważ wyraziłeś/-aś zgodę na marketing w serwisie
          <a href="${appUrl}" style="color:#9d8faf">Last Rodeo</a>.
          Nie chcesz ich więcej dostawać?
          <a href="${escapeHtml(unsubscribeUrl)}" style="color:#f94aff">Wypisz się jednym kliknięciem</a>.
        </p>
        <p style="font-size:11px;line-height:1.5;color:#6f6480;margin:12px 0 0">
          ${escapeHtml(COMPANY.legalName)}${COMPANY_ADDRESS_LINE ? ` • ${escapeHtml(COMPANY_ADDRESS_LINE)}` : ''} • NIP: ${escapeHtml(COMPANY.nip)}
        </p>
      </div>
    </div>
  `
}

function buildMarketingText(campaign: MarketingCampaign, unsubscribeUrl: string) {
  return [
    campaign.heading,
    '',
    ...campaign.paragraphs,
    ...(campaign.cta ? ['', `${campaign.cta.label}: ${campaign.cta.url}`] : []),
    '',
    '—',
    'Otrzymujesz tę wiadomość, ponieważ wyraziłeś/-aś zgodę na marketing w Last Rodeo.',
    `Wypisz się: ${unsubscribeUrl}`,
    '',
    [COMPANY.legalName, COMPANY_ADDRESS_LINE, `NIP: ${COMPANY.nip}`].filter(Boolean).join(' • '),
  ]
    .filter((line) => line !== undefined)
    .join('\n')
}

// ── Powiadomienia serwisowe (nie-marketingowe) ─────────────────────────────────

// Treść powiadomienia serwisowego ma identyczny kształt jak kampania marketingowa,
// ale wysyłka rządzi się innymi regułami (patrz sendServiceBatch).
export type ServiceCampaign = MarketingCampaign

/**
 * Wysyłka powiadomienia serwisowego (np. zmiana regulaminu, polityki prywatności,
 * istotna zmiana usługi) do listy odbiorców.
 *
 * W odróżnieniu od marketingu: NIE wymaga zgody marketingowej i NIE zawiera linku ani
 * nagłówków wypisania — to komunikacja związana z wykonaniem umowy / obowiązkiem
 * informacyjnym (art. 6 ust. 1 lit. b oraz f RODO), z której użytkownik nie może się
 * „wypisać", dopóki ma konto. Dlatego treść MUSI być czysto serwisowa — nie wolno
 * przemycać tu przekazu promocyjnego.
 *
 * Dzieli odbiorców na paczki po 100 i korzysta z Resend /emails/batch. Błąd paczki jest
 * logowany i liczony jako nieudany, ale nie przerywa wysyłki pozostałych paczek.
 */
export async function sendServiceBatch(
  campaign: ServiceCampaign,
  emails: string[]
): Promise<MarketingSendResult> {
  const result: MarketingSendResult = { total: emails.length, sent: 0, failed: 0 }

  if (emails.length === 0) return result

  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(
        `[service-email] (dev) pominięto wysyłkę „${campaign.subject}" do ${emails.length} odb.`
      )
      return result
    }
    throw new Error('Email provider is not configured')
  }

  const html = buildServiceEmail(campaign)
  const text = buildServiceText(campaign)

  for (let offset = 0; offset < emails.length; offset += MARKETING_BATCH_SIZE) {
    const chunk = emails.slice(offset, offset + MARKETING_BATCH_SIZE)
    const payload = chunk.map((email) => ({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: campaign.subject,
      html,
      text,
    }))

    try {
      const response = await fetch('https://api.resend.com/emails/batch', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as ResendEmailResponse
        throw new Error(body.error?.message ?? body.message ?? `Resend batch failed (${response.status})`)
      }

      result.sent += chunk.length
    } catch (error) {
      result.failed += chunk.length
      console.error('[sendServiceBatch] chunk failed', error)
    }
  }

  return result
}

function buildServiceEmail(campaign: ServiceCampaign) {
  const appUrl = getAppUrl()
  const paragraphs = campaign.paragraphs
    .map(
      (paragraph) =>
        `<p style="line-height:1.6;color:#d8c9e8;font-size:14px;margin:0 0 14px">${escapeHtml(paragraph)}</p>`
    )
    .join('')

  const cta = campaign.cta
    ? `<p style="margin:24px 0"><a href="${escapeHtml(campaign.cta.url)}" style="display:inline-block;background:#f94aff;color:#fff;text-decoration:none;font-weight:700;border-radius:12px;padding:14px 22px">${escapeHtml(campaign.cta.label)}</a></p>`
    : ''

  return `
    <div style="font-family:Arial,sans-serif;background:#0d0818;color:#fff;padding:32px">
      <div style="max-width:560px;margin:0 auto;border:1px solid rgba(255,220,180,.18);border-radius:16px;padding:28px;background:#160d25">
        <h1 style="margin:0 0 16px;color:#f94aff">${escapeHtml(campaign.heading)}</h1>
        ${paragraphs}
        ${cta}
        <hr style="border:none;border-top:1px solid rgba(255,220,180,.14);margin:24px 0" />
        <p style="font-size:11px;line-height:1.6;color:#9d8faf;margin:0">
          Otrzymujesz tę wiadomość, ponieważ dotyczy ona Twojego konta lub umowy w serwisie
          <a href="${appUrl}" style="color:#9d8faf">Last Rodeo</a>.
          To wiadomość serwisowa (nie marketingowa) — wysyłamy ją niezależnie od zgód marketingowych.
        </p>
        <p style="font-size:11px;line-height:1.5;color:#6f6480;margin:12px 0 0">
          ${escapeHtml(COMPANY.legalName)}${COMPANY_ADDRESS_LINE ? ` • ${escapeHtml(COMPANY_ADDRESS_LINE)}` : ''} • NIP: ${escapeHtml(COMPANY.nip)}
        </p>
      </div>
    </div>
  `
}

function buildServiceText(campaign: ServiceCampaign) {
  return [
    campaign.heading,
    '',
    ...campaign.paragraphs,
    ...(campaign.cta ? ['', `${campaign.cta.label}: ${campaign.cta.url}`] : []),
    '',
    '—',
    'To wiadomość serwisowa (nie marketingowa) dotycząca Twojego konta lub umowy w Last Rodeo.',
    'Otrzymujesz ją niezależnie od zgód marketingowych.',
    '',
    [COMPANY.legalName, COMPANY_ADDRESS_LINE, `NIP: ${COMPANY.nip}`].filter(Boolean).join(' • '),
  ]
    .filter((line) => line !== undefined)
    .join('\n')
}
