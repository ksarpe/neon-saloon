import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { getNeverDeck, type NeverDeckId } from '@/config/games/never-cards'
import { authOptions } from '@/lib/auth'
import { getFreshPremiumAccess } from '@/lib/premium-access'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'

const NEVER_DECK_IDS = new Set<NeverDeckId>(['classic', 'spicy', 'uncensored', 'all'])
const PREMIUM_NEVER_DECK_IDS = new Set<NeverDeckId>(['spicy', 'uncensored', 'all'])

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Even though the deck payload is static, the endpoint sits behind the
  // premium gate and we don't want unauthenticated callers using it as a
  // bandwidth amplifier.
  const ipLimit = await consumeRateLimit(`decks:never:ip:${getClientIp(request)}`, {
    limit: 60,
    windowMs: 60_000,
  })
  if (!ipLimit.allowed) {
    return NextResponse.json(
      { error: 'Za dużo prób pobrania talii. Spróbuj ponownie później.', retryAfter: ipLimit.retryAfter },
      { status: 429, headers: rateLimitHeaders(ipLimit) }
    )
  }

  const { searchParams } = new URL(request.url)
  const requestedDeck = searchParams.get('deck') ?? 'classic'
  const deckId: NeverDeckId = NEVER_DECK_IDS.has(requestedDeck as NeverDeckId)
    ? (requestedDeck as NeverDeckId)
    : 'classic'

  const isPremiumDeck = PREMIUM_NEVER_DECK_IDS.has(deckId)
  if (isPremiumDeck) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || !(await getFreshPremiumAccess(session.user.id))) {
      return NextResponse.json({ error: 'Premium access required' }, { status: 403 })
    }
  }

  const cards = getNeverDeck(deckId).map((card, index) => ({
    ...card,
    id: `never-${deckId}-${index}`,
  }))

  return NextResponse.json(cards, {
    headers: {
      // Free deck content is static and identical across users — let the edge
      // cache it for 5 minutes (with a longer stale-while-revalidate window so
      // a single user's request can warm the cache for everyone). Premium decks
      // are gated by session and must never enter a shared cache.
      'Cache-Control': isPremiumDeck
        ? 'private, no-store'
        : 'public, max-age=300, stale-while-revalidate=3600',
    },
  })
}
