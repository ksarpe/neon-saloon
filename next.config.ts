import type { NextConfig } from 'next'

// Build a CSP-safe host source pair for the PartyKit WebSocket.
// next.config is evaluated at build time, so we read the env var here.
// We check both the public var (baked into the browser bundle) and the
// server-only var (PARTYKIT_HOST) as a fallback, since some setups only
// expose the non-public form to the build process.
function partykitCspSources(): string {
  const raw =
    process.env.NEXT_PUBLIC_PARTYKIT_HOST ?? process.env.PARTYKIT_HOST ?? ''

  if (raw) {
    // Strip any protocol prefix the operator may have included.
    const bare = raw
      .replace(/^https?:\/\//, '')
      .replace(/^wss?:\/\//, '')
      .replace(/\/$/, '')
    // Emit both https:// (for HTTP fetch) and wss:// (for WebSocket upgrade).
    return `https://${bare} wss://${bare}`
  }

  // Last-resort wildcard — valid CSP syntax, covers one subdomain level of
  // partykit.dev.  Works when PartyKit deploys to {name}.partykit.dev.
  // If your URL is {name}.{account}.partykit.dev you MUST set
  // NEXT_PUBLIC_PARTYKIT_HOST in your Vercel environment variables.
  console.warn(
    '[next.config] NEXT_PUBLIC_PARTYKIT_HOST is not set — using wildcard CSP fallback. ' +
      'WebSocket connections to multi-level PartyKit subdomains will be blocked.',
  )
  return 'https://*.partykit.dev wss://*.partykit.dev'
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
