type RateLimitOptions = {
  limit: number
  windowMs: number
}

type RateLimitBucket = {
  count: number
  resetAt: number
}

export type RateLimitResult = {
  allowed: boolean
  limit: number
  remaining: number
  resetAt: number
  retryAfter: number
}

const buckets = new Map<string, RateLimitBucket>()

export function getClientIp(request: Request) {
  return getClientIpFromHeaders(request.headers)
}

export function getClientIpFromHeaders(
  headers: Headers | Record<string, string | string[] | undefined>
) {
  const readHeader = (name: string) => {
    if (headers instanceof Headers) return headers.get(name)
    const value = headers[name] ?? headers[name.toLowerCase()]
    return Array.isArray(value) ? value[0] : value
  }

  const forwardedFor = readHeader('x-forwarded-for')?.split(',')[0]?.trim()
  const realIp = readHeader('x-real-ip')?.trim()

  return forwardedFor || realIp || 'unknown'
}

export function consumeRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const existing = buckets.get(key)
  const bucket =
    existing && existing.resetAt > now
      ? existing
      : {
          count: 0,
          resetAt: now + options.windowMs,
        }

  if (bucket.count >= options.limit) {
    buckets.set(key, bucket)
    return {
      allowed: false,
      limit: options.limit,
      remaining: 0,
      resetAt: bucket.resetAt,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    }
  }

  bucket.count += 1
  buckets.set(key, bucket)

  return {
    allowed: true,
    limit: options.limit,
    remaining: Math.max(0, options.limit - bucket.count),
    resetAt: bucket.resetAt,
    retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  }
}

export function rateLimitHeaders(result: RateLimitResult) {
  return {
    'Retry-After': String(result.retryAfter),
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  }
}
