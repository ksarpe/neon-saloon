export function getAppUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXTAUTH_URL

  if (configuredUrl) return normalizeAppUrl(configuredUrl)
  if (process.env.NODE_ENV !== 'production') return 'http://localhost:3000'

  throw new Error('Missing NEXT_PUBLIC_APP_URL or NEXTAUTH_URL')
}

function normalizeAppUrl(value: string) {
  const url = new URL(value)

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('App URL must use http or https')
  }

  return url.origin
}
