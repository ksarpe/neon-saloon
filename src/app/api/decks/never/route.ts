import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { getNeverDeck, type NeverDeckId } from '@/config/games/never-cards'
import { authOptions } from '@/lib/auth'

const NEVER_DECK_IDS = new Set<NeverDeckId>(['classic', 'spicy', 'uncensored', 'all'])
const PREMIUM_NEVER_DECK_IDS = new Set<NeverDeckId>(['spicy', 'uncensored', 'all'])

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const requestedDeck = searchParams.get('deck') ?? 'classic'
  const deckId: NeverDeckId = NEVER_DECK_IDS.has(requestedDeck as NeverDeckId)
    ? (requestedDeck as NeverDeckId)
    : 'classic'

  if (PREMIUM_NEVER_DECK_IDS.has(deckId)) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.isPremium) {
      return NextResponse.json({ error: 'Premium access required' }, { status: 403 })
    }
  }

  const cards = getNeverDeck(deckId).map((card, index) => ({
    ...card,
    id: `never-${deckId}-${index}`,
  }))

  return NextResponse.json(cards)
}
