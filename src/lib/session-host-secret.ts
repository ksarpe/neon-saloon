// Persists the host's identity for a session in localStorage so they can refresh
// the host screen without losing accumulated state. One entry per PIN.

const STORAGE_PREFIX = 'last-rodeo-host:'
const LEGACY_PREFIX = 'last-rodeo-host-secret:'

export type StoredHostSession = {
  hostSecret: string
  hostName?: string
  hostAvatar?: string
  hostPlayerId?: string
  gameMode?: string
}

function storageKey(pin: string) {
  return `${STORAGE_PREFIX}${pin}`
}

export function saveHostSession(pin: string, session: StoredHostSession) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(storageKey(pin), JSON.stringify(session))
  } catch {
    // Storage full / private mode — silently fail
  }
}

export function getHostSession(pin: string): StoredHostSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(storageKey(pin))
    if (raw) {
      const parsed = JSON.parse(raw) as StoredHostSession
      if (parsed.hostSecret) return parsed
    }
  } catch {
    // fall through to legacy
  }
  // Backward-compat: read legacy plain-text key
  try {
    const legacy = window.localStorage.getItem(`${LEGACY_PREFIX}${pin}`)
    if (legacy) return { hostSecret: legacy }
  } catch {
    // ignore
  }
  return null
}

export function updateHostSession(pin: string, patch: Partial<StoredHostSession>) {
  const existing = getHostSession(pin)
  if (!existing) return
  saveHostSession(pin, { ...existing, ...patch })
}

export function clearHostSession(pin: string) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(storageKey(pin))
    window.localStorage.removeItem(`${LEGACY_PREFIX}${pin}`)
  } catch {
    // ignore
  }
}

// ─── Backward-compat helpers (used by existing callers) ──────────────────────

export function saveHostSecret(pin: string, hostSecret: string) {
  if (typeof window === 'undefined') return
  const existing = getHostSession(pin)
  saveHostSession(pin, { ...(existing ?? {}), hostSecret })
}

export function getHostSecret(pin: string) {
  return getHostSession(pin)?.hostSecret ?? null
}

export function hostJsonHeaders(pin: string): HeadersInit {
  const secret = getHostSecret(pin)
  return {
    'Content-Type': 'application/json',
    ...(secret ? { 'x-host-secret': secret } : {}),
  }
}

export function hostAuthHeaders(pin: string): HeadersInit {
  const secret = getHostSecret(pin)
  return secret ? { 'x-host-secret': secret } : {}
}
