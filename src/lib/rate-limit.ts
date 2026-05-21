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
const RATE_LIMIT_KEY_PREFIX = process.env.RATE_LIMIT_KEY_PREFIX ?? 'neon-saloon'
const RATE_LIMIT_FAIL_CLOSED = process.env.NODE_ENV === 'production'
const RATE_LIMIT_UNAVAILABLE_RETRY_SECONDS = 60

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

export async function consumeRateLimit(
  key: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const upstashConfigured = Boolean(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  )

  if (upstashConfigured) {
    try {
      return await consumeUpstashRateLimit(key, options)
    } catch (error) {
      console.error('[rate-limit] Upstash limiter failed', error)
      if (RATE_LIMIT_FAIL_CLOSED) return rateLimitUnavailable(options)
    }
  }

  if (RATE_LIMIT_FAIL_CLOSED) {
    console.error('[rate-limit] Upstash is not configured in production')
    return rateLimitUnavailable(options)
  }

  return consumeMemoryRateLimit(key, options)
}

function rateLimitUnavailable(options: RateLimitOptions): RateLimitResult {
  const resetAt = Date.now() + RATE_LIMIT_UNAVAILABLE_RETRY_SECONDS * 1000

  return {
    allowed: false,
    limit: options.limit,
    remaining: 0,
    resetAt,
    retryAfter: RATE_LIMIT_UNAVAILABLE_RETRY_SECONDS,
  }
}

function consumeMemoryRateLimit(key: string, options: RateLimitOptions): RateLimitResult {
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

async function consumeUpstashRateLimit(
  key: string,
  options: RateLimitOptions
): Promise<RateLimitResult> {
  const redisKey = `${RATE_LIMIT_KEY_PREFIX}:rate-limit:${key}`
  const pipeline = await upstashPipeline([
    ['SET', redisKey, '0', 'NX', 'PX', String(options.windowMs)],
    ['INCR', redisKey],
    ['PTTL', redisKey],
  ])
  const count = Number(pipeline[1]?.result ?? 0)
  let ttlMs = Number(pipeline[2]?.result ?? options.windowMs)

  if (!Number.isFinite(ttlMs) || ttlMs < 0) {
    await upstashPipeline([['PEXPIRE', redisKey, String(options.windowMs)]])
    ttlMs = options.windowMs
  }

  const resetAt = Date.now() + ttlMs
  const retryAfter = Math.max(1, Math.ceil(ttlMs / 1000))

  return {
    allowed: count <= options.limit,
    limit: options.limit,
    remaining: Math.max(0, options.limit - count),
    resetAt,
    retryAfter,
  }
}

async function upstashPipeline(commands: string[][]) {
  const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Upstash request failed with ${response.status}`)
  }

  const payload = (await response.json()) as Array<{ result?: unknown; error?: string }>
  const error = payload.find((entry) => entry.error)?.error
  if (error) throw new Error(error)

  return payload
}

export function rateLimitHeaders(result: RateLimitResult) {
  return {
    'Retry-After': String(result.retryAfter),
    'X-RateLimit-Limit': String(result.limit),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  }
}
