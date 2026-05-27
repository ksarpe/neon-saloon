const DEFAULT_PARTYKIT_HOST = '127.0.0.1:1999'
const DEFAULT_PARTYKIT_PORT = '1999'

function normalizePartyKitHost(host: string | undefined): string | null {
  const normalized = host
    ?.trim()
    .replace(/^https?:\/\//i, '')
    .replace(/^wss?:\/\//i, '')
    .replace(/\/+$/g, '')

  return normalized || null
}

function hostnameFromHost(host: string): string {
  const withoutPath = host.split('/')[0]
  if (withoutPath.startsWith('[')) {
    const end = withoutPath.indexOf(']')
    return end === -1 ? withoutPath : withoutPath.slice(1, end)
  }
  return withoutPath.split(':')[0]
}

function isLocalOnlyHost(host: string): boolean {
  const hostname = hostnameFromHost(host).toLowerCase()
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '::1' ||
    hostname === '0.0.0.0'
  )
}

function pageHostForPartyKit(): string | null {
  if (typeof window === 'undefined') return null

  const hostname = window.location.hostname
  if (!hostname) return null

  const formattedHost =
    hostname.includes(':') && !hostname.startsWith('[') ? `[${hostname}]` : hostname
  return `${formattedHost}:${DEFAULT_PARTYKIT_PORT}`
}

function isPageLocalOnly(): boolean {
  if (typeof window === 'undefined') return true

  const hostname = window.location.hostname.toLowerCase()
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1'
}

export function getPartyKitHost(configuredHost = process.env.NEXT_PUBLIC_PARTYKIT_HOST): string {
  const configured = normalizePartyKitHost(configuredHost)
  if (typeof window === 'undefined') return configured ?? DEFAULT_PARTYKIT_HOST

  if (configured && (!isLocalOnlyHost(configured) || isPageLocalOnly())) {
    return configured
  }

  return pageHostForPartyKit() ?? configured ?? DEFAULT_PARTYKIT_HOST
}
