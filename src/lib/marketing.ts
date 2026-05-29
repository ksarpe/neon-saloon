import { createHmac, timingSafeEqual } from 'node:crypto'

import { getAppUrl } from './app-url'

// Bezstanowe tokeny wypisania z marketingu: podpisujemy userId kluczem HMAC, więc link
// rezygnacji działa bez logowania i bez osobnej tabeli tokenów. Token = `${userId}.${sig}`,
// gdzie sig to HMAC-SHA256(userId). userId (cuid) nie zawiera kropki, więc rozdzielamy po
// ostatniej kropce. Sekret bierzemy z dedykowanej zmiennej, z fallbackiem do NEXTAUTH_SECRET.
function getUnsubscribeSecret() {
  const secret = process.env.MARKETING_UNSUBSCRIBE_SECRET ?? process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error('Missing MARKETING_UNSUBSCRIBE_SECRET or NEXTAUTH_SECRET')
  }
  return secret
}

function signUserId(userId: string) {
  return createHmac('sha256', getUnsubscribeSecret()).update(userId).digest('base64url')
}

export function createUnsubscribeToken(userId: string) {
  return `${userId}.${signUserId(userId)}`
}

/** Zwraca userId, jeśli token jest poprawnie podpisany; w przeciwnym razie null. */
export function verifyUnsubscribeToken(token: string): string | null {
  const separatorIndex = token.lastIndexOf('.')
  if (separatorIndex <= 0) return null

  const userId = token.slice(0, separatorIndex)
  const signature = token.slice(separatorIndex + 1)
  const expected = signUserId(userId)

  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)
  if (signatureBuffer.length !== expectedBuffer.length) return null
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return null

  return userId
}

export function buildUnsubscribeUrl(userId: string) {
  const token = createUnsubscribeToken(userId)
  return `${getAppUrl()}/api/marketing/unsubscribe?token=${encodeURIComponent(token)}`
}
