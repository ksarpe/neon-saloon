import { NextResponse } from 'next/server'

import { optionalString, RequestValidationError } from '@/lib/request-validation'

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
const BOT_PROTECTION_REQUIRED =
  process.env.NODE_ENV === 'production' || process.env.BOT_PROTECTION_REQUIRED === 'true'

export function isBotProtectionRequired() {
  return BOT_PROTECTION_REQUIRED
}

export function readBotProtectionToken(value: unknown) {
  return optionalString(value, 'botProtectionToken', 4096)
}

export async function verifyBotProtection(input: {
  token: string | null
  request: Request
  action: string
}) {
  if (!BOT_PROTECTION_REQUIRED && !process.env.TURNSTILE_SECRET_KEY) {
    return { ok: true as const }
  }

  if (!process.env.TURNSTILE_SECRET_KEY) {
    console.error(`[bot-protection] Missing TURNSTILE_SECRET_KEY for ${input.action}`)
    return { ok: false as const, response: botProtectionFailedResponse() }
  }

  if (!input.token) {
    return { ok: false as const, response: botProtectionFailedResponse() }
  }

  const formData = new FormData()
  formData.set('secret', process.env.TURNSTILE_SECRET_KEY)
  formData.set('response', input.token)
  const ip = input.request.headers.get('cf-connecting-ip')
  if (ip) formData.set('remoteip', ip)

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      body: formData,
      cache: 'no-store',
    })
    const payload = (await response.json().catch(() => null)) as { success?: boolean } | null

    if (response.ok && payload?.success) return { ok: true as const }
  } catch (error) {
    console.error(`[bot-protection] Turnstile verification failed for ${input.action}`, error)
  }

  return { ok: false as const, response: botProtectionFailedResponse() }
}

function botProtectionFailedResponse() {
  return NextResponse.json(
    { error: 'Nie udało się potwierdzić, że nie jesteś botem. Spróbuj ponownie.' },
    { status: 403 }
  )
}

export function botProtectionValidationError(error: unknown) {
  if (error instanceof RequestValidationError) return botProtectionFailedResponse()
  return null
}
