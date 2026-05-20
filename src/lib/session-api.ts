import { NextResponse } from 'next/server'

import { getSession, type SessionData, type SessionPlayer } from '@/lib/appwrite/sessions'
import { isHostAuthorized } from '@/lib/session-host-auth'
import { getAuthorizedPlayer } from '@/lib/session-player-auth'

type ApiGuard<T> = { ok: true; value: T } | { ok: false; response: NextResponse }

export type AuthorizedPlayerSession = {
  session: SessionData
  player: SessionPlayer
}

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

export function sessionNotFoundResponse() {
  return apiError('Session not found', 404)
}

export function forbiddenResponse() {
  return apiError('Forbidden', 403)
}

export async function requireSession(pin: string): Promise<ApiGuard<SessionData>> {
  const session = await getSession(pin)
  if (!session) return { ok: false, response: sessionNotFoundResponse() }

  return { ok: true, value: session }
}

export async function requireHostSession(
  request: Request,
  pin: string
): Promise<ApiGuard<SessionData>> {
  const sessionResult = await requireSession(pin)
  if (!sessionResult.ok) return sessionResult

  if (!isHostAuthorized(request, sessionResult.value)) {
    return { ok: false, response: forbiddenResponse() }
  }

  return sessionResult
}

export async function requirePlayerSession(
  request: Request,
  pin: string,
  playerId: string,
  bodySecret?: string | null
): Promise<ApiGuard<AuthorizedPlayerSession>> {
  const sessionResult = await requireSession(pin)
  if (!sessionResult.ok) return sessionResult

  const player = getAuthorizedPlayer(request, sessionResult.value, playerId, bodySecret)
  if (!player) return { ok: false, response: forbiddenResponse() }

  return { ok: true, value: { session: sessionResult.value, player } }
}
