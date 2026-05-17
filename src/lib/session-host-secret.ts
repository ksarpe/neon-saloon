const STORAGE_PREFIX = 'last-rodeo-host-secret:'

export function saveHostSecret(pin: string, hostSecret: string) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(`${STORAGE_PREFIX}${pin}`, hostSecret)
}

export function getHostSecret(pin: string) {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(`${STORAGE_PREFIX}${pin}`)
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
