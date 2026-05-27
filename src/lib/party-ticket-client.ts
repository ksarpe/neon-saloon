'use client'

// Browser-side helpers for hitting POST /api/party/ticket and stashing the
// returned credentials (pin / playerId / partyToken) in sessionStorage so the
// next-route component can pick them up and open a WebSocket.

const STORAGE_KEY_HOST = 'neon-saloon:party-host'
const STORAGE_KEY_PLAYER = 'neon-saloon:party-player'
const STORAGE_KEY_HOST_PROFILE_PREFIX = 'neon-saloon:party-host-profile:'

export type HostTicket = { pin: string; partyToken: string; role: 'host' }
export type JoinTicket = { playerId: string; partyToken: string; role: 'player' }
export type ConnectTicket = { connectToken: string; expiresAt: number }
export type PartyRoomLookup = {
  pin: string
  gameMode: 'classic' | 'highlow' | 'battle-royale'
  status: 'waiting' | 'active' | 'finished'
  playersCount: number
  teams: Array<{
    teamId: string
    teamName: string
    color: string
    emoji: string
    memberCount: number
  }>
}

export type StoredHostCredentials = { pin: string; partyToken: string; gameMode: string }
export type StoredHostProfile = {
  hostName?: string
  hostAvatar?: string | null
  savedAt?: number
  updatedAt?: number
}
export type StoredPlayerCredentials = {
  pin: string
  playerId: string
  partyToken: string
  playerName: string
  avatar?: string
  teamId?: string | null
  teamName?: string | null
  gameMode?: string
}

async function postTicket<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/party/ticket', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    let message = `Ticket request failed (${res.status})`
    try {
      const data = (await res.json()) as { error?: string }
      if (data.error) message = data.error
    } catch {
      // ignore
    }
    throw new Error(message)
  }
  return (await res.json()) as T
}

export function fetchHostTicket(args: {
  hostName: string
  gameMode: string
  botProtectionToken?: string | null
}): Promise<HostTicket> {
  return postTicket<HostTicket>({
    action: 'create-host',
    hostName: args.hostName,
    gameMode: args.gameMode,
    botProtectionToken: args.botProtectionToken ?? undefined,
  })
}

export function fetchJoinTicket(args: {
  pin: string
  playerName: string
  avatar?: string
  teamId?: string
}): Promise<JoinTicket> {
  return postTicket<JoinTicket>({
    action: 'join',
    pin: args.pin,
    playerName: args.playerName,
    avatar: args.avatar,
    teamId: args.teamId,
  })
}

export function fetchPartyConnectToken(partyToken: string): Promise<ConnectTicket> {
  return postPartyConnectToken<ConnectTicket>({ partyToken })
}

async function postPartyConnectToken<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/party/connect-token', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    let message = `Connect token request failed (${res.status})`
    try {
      const data = (await res.json()) as { error?: string }
      if (data.error) message = data.error
    } catch {
      // ignore
    }
    throw new Error(message)
  }
  return (await res.json()) as T
}

export async function fetchPartyRoomLookup(
  pin: string,
  options?: { authToken?: string | null; hostToken?: string | null }
): Promise<PartyRoomLookup | null> {
  const authToken = options?.authToken ?? options?.hostToken
  const res = await fetch(`/api/party/lookup?pin=${encodeURIComponent(pin)}`, {
    cache: 'no-store',
    headers: authToken ? { 'x-party-token': authToken } : undefined,
  })
  if (res.status === 404) return null
  if (!res.ok) {
    let message = `Party room lookup failed (${res.status})`
    try {
      const data = (await res.json()) as { error?: string }
      if (data.error) message = data.error
    } catch {
      // ignore
    }
    throw new Error(message)
  }
  return (await res.json()) as PartyRoomLookup
}

// ─── Per-tab credential storage (sessionStorage so each tab has its own player) ─

export function storeHostCredentials(creds: StoredHostCredentials): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(STORAGE_KEY_HOST, JSON.stringify(creds))
  } catch {
    // Storage may be unavailable (e.g. privacy mode); the host page can still
    // be navigated to but won't be able to reconnect without re-creating.
  }
}

export function readHostCredentials(): StoredHostCredentials | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY_HOST)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredHostCredentials>
    if (
      typeof parsed.pin !== 'string' ||
      typeof parsed.partyToken !== 'string' ||
      typeof parsed.gameMode !== 'string'
    ) {
      return null
    }
    return { pin: parsed.pin, partyToken: parsed.partyToken, gameMode: parsed.gameMode }
  } catch {
    return null
  }
}

export function clearHostCredentials(): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(STORAGE_KEY_HOST)
  } catch {
    // ignore
  }
}

function hostProfileKey(pin: string) {
  return `${STORAGE_KEY_HOST_PROFILE_PREFIX}${pin}`
}

export function readHostProfile(pin: string): StoredHostProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(hostProfileKey(pin))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredHostProfile>
    return {
      hostName: typeof parsed.hostName === 'string' ? parsed.hostName : undefined,
      hostAvatar:
        typeof parsed.hostAvatar === 'string' || parsed.hostAvatar === null
          ? parsed.hostAvatar
          : undefined,
      savedAt: typeof parsed.savedAt === 'number' ? parsed.savedAt : undefined,
      updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : undefined,
    }
  } catch {
    return null
  }
}

export function updateHostProfile(pin: string, patch: StoredHostProfile): void {
  if (typeof window === 'undefined') return
  try {
    const now = Date.now()
    const existing = readHostProfile(pin)
    window.localStorage.setItem(
      hostProfileKey(pin),
      JSON.stringify({
        ...existing,
        ...patch,
        savedAt: existing?.savedAt ?? patch.savedAt ?? now,
        updatedAt: now,
      })
    )
  } catch {
    // ignore
  }
}

export function storePlayerCredentials(creds: StoredPlayerCredentials): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(STORAGE_KEY_PLAYER, JSON.stringify(creds))
  } catch {
    // ignore
  }
}

export function readPlayerCredentials(): StoredPlayerCredentials | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY_PLAYER)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredPlayerCredentials>
    if (
      typeof parsed.pin !== 'string' ||
      typeof parsed.playerId !== 'string' ||
      typeof parsed.partyToken !== 'string' ||
      typeof parsed.playerName !== 'string'
    ) {
      return null
    }
    return {
      pin: parsed.pin,
      playerId: parsed.playerId,
      partyToken: parsed.partyToken,
      playerName: parsed.playerName,
      avatar: typeof parsed.avatar === 'string' ? parsed.avatar : undefined,
      teamId: typeof parsed.teamId === 'string' ? parsed.teamId : null,
      teamName: typeof parsed.teamName === 'string' ? parsed.teamName : null,
      gameMode: typeof parsed.gameMode === 'string' ? parsed.gameMode : undefined,
    }
  } catch {
    return null
  }
}

export function clearPlayerCredentials(): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(STORAGE_KEY_PLAYER)
  } catch {
    // ignore
  }
}
