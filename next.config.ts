import type { NextConfig } from 'next'

// Build a CSP-safe host source pair for PartyKit from the env var.
// The var can be bare hostname (foo.bar.partykit.dev) or include a protocol.
// We output both https:// and wss:// so the CSP covers both fetch and WebSocket.
function partykitCspSources(): string {
  const raw = process.env.NEXT_PUBLIC_PARTYKIT_HOST ?? ''
  if (!raw) {
    // Fallback: wildcard covers the common single-account pattern. The two-level
    // wildcard (*.*.partykit.dev) is not universally supported in old browsers,
    // but it is the safest broad fallback. In practice this path runs only when
    // the env var is missing (misconfigured), which should not happen in prod.
    return 'https://*.partykit.dev wss://*.partykit.dev https://*.*.partykit.dev wss://*.*.partykit.dev'
  }
  // Strip any protocol prefix the user might have included.
  const bare = raw.replace(/^https?:\/\//, '').replace(/^wss?:\/\//, '').replace(/\/$/, '')
  return `https://${bare} wss://${bare}`
}

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
  "frame-src 'self' https://challenges.cloudflare.com",
  `connect-src 'self' https://api.stripe.com https://*.stripe.com https://challenges.cloudflare.com ${partykitCspSources()}`,
  'upgrade-insecure-requests',
].join('; ')

const productionSecurityHeaders =
  process.env.NODE_ENV === 'production'
    ? [
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        { key: 'Content-Security-Policy', value: contentSecurityPolicy },
      ]
    : []

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ['192.168.100.27'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ...productionSecurityHeaders,
        ],
      },
    ]
  },
}

export default nextConfig
