// Persists the host's identity for a session in localStorage so they can refresh
// the host screen without losing accumulated state. One entry per PIN.

const STORAGE_PREFIX = 'last-rodeo-host:'
const LEGACY_PREFIX = 'last-rodeo-host-secret:'
const CURRENT_HOST_PIN_KEY = 'last-rodeo-host-current'

export type StoredHostSession = {
  hostSecret: string
  hostName?: string
  hostAvatar?: string
  hostPlayerId?: string
  gameMode?: string
  savedAt?: number
  updatedAt?: number
}

function storageKey(pin: string) {
  return `${STORAGE_PREFIX}${pin}`
}

export function saveHostSession(pin: string, session: StoredHostSession) {
  if (typeof window === 'undefined') return
  try {
    const now = Date.now()
    const existing = getHostSession(pin)
    window.localStorage.setItem(
      storageKey(pin),
      JSON.stringify({
        ...session,
        savedAt: session.savedAt ?? existing?.savedAt ?? now,
        updatedAt: now,
      })
    )
    window.localStorage.setItem(CURRENT_HOST_PIN_KEY, pin)
    window.localStorage.removeItem(`${LEGACY_PREFIX}${pin}`)
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

export function getStoredHostSessions(): Array<{ pin: string; session: StoredHostSession }> {
  if (typeof window === 'undefined') return []
  const sessions: Array<{ pin: string; session: StoredHostSession; order: number }> = []
  const seenPins = new Set<string>()
  const currentPin = getCurrentHostPin()

  try {
    for (let index = 0; index < window.localStorage.length; index++) {
      const key = window.localStorage.key(index)
      if (!key?.startsWith(STORAGE_PREFIX) && !key?.startsWith(LEGACY_PREFIX)) continue

      const pin = key.startsWith(STORAGE_PREFIX)
        ? key.slice(STORAGE_PREFIX.length)
        : key.slice(LEGACY_PREFIX.length)
      if (seenPins.has(pin)) continue
      const session = getHostSession(pin)
      if (session) {
        seenPins.add(pin)
        sessions.push({ pin, session, order: index })
      }
    }
  } catch {
    // ignore
  }

  return sessions
    .sort((a, b) => {
      if (a.pin === currentPin) return -1
      if (b.pin === currentPin) return 1

      const aTime = a.session.updatedAt ?? a.session.savedAt ?? a.order
      const bTime = b.session.updatedAt ?? b.session.savedAt ?? b.order
      return bTime - aTime
    })
    .map(({ pin, session }) => ({ pin, session }))
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
    if (getCurrentHostPin() === pin) window.localStorage.removeItem(CURRENT_HOST_PIN_KEY)
  } catch {
    // ignore
  }
}

export function clearOtherHostSessions(pinToKeep: string) {
  if (typeof window === 'undefined') return
  for (const stored of getStoredHostSessions()) {
    if (stored.pin !== pinToKeep) clearHostSession(stored.pin)
  }
}

function getCurrentHostPin() {
  if (typeof window === 'undefined') return null
  try {
    return window.localStorage.getItem(CURRENT_HOST_PIN_KEY)
  } catch {
    return null
  }
}

// ─── Backward-compat helpers (used by existing callers) ──────────────────────

export function saveHostSecret(pin: string, hostSecret: string) {
  if (typeof window === 'undefined') return
  clearOtherHostSessions(pin)
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
