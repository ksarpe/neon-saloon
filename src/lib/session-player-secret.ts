// Persists a player's identity for a session in localStorage so they can resume
// after refresh / browser crash / closed tab. One entry per PIN.

const STORAGE_PREFIX = 'last-rodeo-player:'
const LEGACY_PREFIX = 'last-rodeo-player-secret:'

export type StoredPlayerSession = {
  playerId: string
  playerSecret: string
  playerName: string
  avatar: string
  teamId: string | null
  teamName: string | null
  gameMode: string
}

function storageKey(pin: string) {
  return `${STORAGE_PREFIX}${pin}`
}

export function savePlayerSession(pin: string, session: StoredPlayerSession) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(storageKey(pin), JSON.stringify(session))
  } catch {
    // Storage full / private mode — silently fail; user will be asked to rejoin
  }
}

export function getPlayerSession(pin: string): StoredPlayerSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(storageKey(pin))
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredPlayerSession
    if (!parsed.playerId || !parsed.playerSecret) return null
    return parsed
  } catch {
    return null
  }
}

export function clearPlayerSession(pin: string) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(storageKey(pin))
  } catch {
    // ignore
  }
}

// ─── Backward-compat helpers (used by existing callers) ──────────────────────

export function savePlayerSecret(pin: string, playerId: string, playerSecret: string) {
  // Legacy callers that only have the secret — merge into the per-pin record if
  // it already exists, otherwise write a minimal record (will be hydrated on next save).
  if (typeof window === 'undefined') return
  const existing = getPlayerSession(pin)
  if (existing && existing.playerId === playerId) {
    savePlayerSession(pin, { ...existing, playerSecret })
  } else {
    try {
      window.localStorage.setItem(`${LEGACY_PREFIX}${pin}:${playerId}`, playerSecret)
    } catch {
      // ignore
    }
  }
}

export function getPlayerSecret(pin: string, playerId: string | null | undefined): string | null {
  if (typeof window === 'undefined' || !playerId) return null
  const session = getPlayerSession(pin)
  if (session && session.playerId === playerId) return session.playerSecret
  // Fallback to legacy key for users on the old scheme
  try {
    return window.localStorage.getItem(`${LEGACY_PREFIX}${pin}:${playerId}`)
  } catch {
    return null
  }
}

export function playerJsonHeaders(pin: string, playerId: string | null | undefined): HeadersInit {
  const secret = getPlayerSecret(pin, playerId)
  return {
    'Content-Type': 'application/json',
    ...(secret ? { 'x-player-secret': secret } : {}),
  }
}

export function playerAuthHeaders(pin: string, playerId: string | null | undefined): HeadersInit {
  const secret = getPlayerSecret(pin, playerId)
  return secret ? { 'x-player-secret': secret } : {}
}
