const STORAGE_PREFIX = 'last-rodeo-player-secret:'

export function savePlayerSecret(pin: string, playerId: string, playerSecret: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(`${STORAGE_PREFIX}${pin}:${playerId}`, playerSecret)
}

export function getPlayerSecret(pin: string, playerId: string | null | undefined) {
  if (typeof window === 'undefined' || !playerId) return null
  return window.localStorage.getItem(`${STORAGE_PREFIX}${pin}:${playerId}`)
}

export function playerJsonHeaders(pin: string, playerId: string | null | undefined): HeadersInit {
  const secret = getPlayerSecret(pin, playerId)
  return {
    'Content-Type': 'application/json',
    ...(secret ? { 'x-player-secret': secret } : {}),
  }
}
