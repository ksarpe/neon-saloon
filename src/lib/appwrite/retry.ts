// Server-only: retry helper for Appwrite operations that contend on a hot row.
//
// Game state and the realtime event stream both live on a single `game-sessions`
// row per PIN. When many players act at once (e.g. 10 people voting the instant a
// question appears) their read-modify-write transactions collide on that row and
// Appwrite rejects the losers. A single attempt therefore drops events/votes.
//
// Exponential backoff with *full jitter* spreads simultaneous writers out so they
// stop colliding on every attempt and converge instead. Full jitter (delay =
// random[0, cap]) is deliberately chosen over fixed/equal backoff because equal
// delays would just re-synchronise the same colliding writers.
import { AppwriteException } from 'node-appwrite'

// Permanent failures — retrying these can never succeed, so fail fast.
// Everything else (notably 409 conflict and transient 5xx) is worth a retry.
const NON_RETRYABLE_CODES = new Set([400, 401, 403, 404])

export function isRetryableAppwriteError(err: unknown): boolean {
  if (!(err instanceof AppwriteException)) return false
  return !NON_RETRYABLE_CODES.has(err.code)
}

export type RetryOptions = {
  maxAttempts?: number
  baseDelayMs?: number
  maxDelayMs?: number
}

export async function retryOnConflict<T>(
  operation: (attempt: number) => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 6
  const baseDelayMs = options.baseDelayMs ?? 25
  const maxDelayMs = options.maxDelayMs ?? 400

  for (let attempt = 0; ; attempt++) {
    try {
      return await operation(attempt)
    } catch (err) {
      const isLastAttempt = attempt >= maxAttempts - 1
      if (isLastAttempt || !isRetryableAppwriteError(err)) throw err

      const cap = Math.min(maxDelayMs, baseDelayMs * 2 ** attempt)
      const delay = Math.random() * cap // full jitter
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}
