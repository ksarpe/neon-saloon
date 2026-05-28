// Server-side helper for talking to the PartyKit HTTP endpoints from Next.js
// route handlers. The host comes from PARTYKIT_HOST (preferred, server-only)
// with a fallback to NEXT_PUBLIC_PARTYKIT_HOST and a local dev default.
//
// Lives in src/lib/ because both /api/party/lookup and /api/party/ticket need
// the same URL — duplicating the logic was producing subtle prod/dev drift.

export function getPartyKitServerUrl(): string {
  const configured =
    process.env.PARTYKIT_HOST ?? process.env.NEXT_PUBLIC_PARTYKIT_HOST ?? '127.0.0.1:1999'

  if (configured.startsWith('http://') || configured.startsWith('https://')) {
    return configured.replace(/\/$/, '')
  }

  // Localhost gets http; everything else gets https (PartyKit production hosts
  // always serve TLS).
  const isLocal = configured.includes('localhost') || configured.includes('127.0.0.1')
  const protocol = isLocal ? 'http://' : 'https://'
  return `${protocol}${configured.replace(/\/$/, '')}`
}
