import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

import type { SessionData } from '@/lib/appwrite/sessions'

export const HOST_SECRET_HEADER = 'x-host-secret'

export function createHostSecret() {
  return randomBytes(32).toString('base64url')
}

export function hashHostSecret(hostSecret: string) {
  return createHash('sha256').update(hostSecret).digest('hex')
}

export function isHostAuthorized(request: Request, session: SessionData) {
  const provided = request.headers.get(HOST_SECRET_HEADER)
  if (!provided || !session.hostSecretHash) return false
  return timingSafeStringEqual(hashHostSecret(provided), session.hostSecretHash)
}

function timingSafeStringEqual(value: string, expected: string) {
  const valueBuffer = Buffer.from(value)
  const expectedBuffer = Buffer.from(expected)
  if (valueBuffer.length !== expectedBuffer.length) return false
  return timingSafeEqual(valueBuffer, expectedBuffer)
}
