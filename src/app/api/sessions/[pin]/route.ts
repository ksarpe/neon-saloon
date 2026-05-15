import { NextResponse } from 'next/server'
import { getSession, updateSession } from '@/lib/appwrite/sessions'
import {
  triggerGameEvent as triggerSessionEvent,
  cleanupSessionEvents,
} from '@/lib/appwrite/realtime'
import type { WireCard } from '@/lib/game-types'

type RouteContext = { params: Promise<{ pin: string }> }

export async function GET(_req: Request, { params }: RouteContext) {
  const { pin } = await params

  const session = await getSession(pin)
  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  return NextResponse.json({
    pin: session.pin,
    status: session.status,
    players: session.players,
    teams: session.teams,
    cardIndex: session.cardIndex,
    votes: session.votes ?? [],
    gameMode: session.gameMode ?? 'classic',
    highlowData: session.highlowData ?? null,
  })
}

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params
  try {
    const body = await request.json()
    const { action, card } = body as { action: string; card?: WireCard }

    const session = await getSession(pin)
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    if (action === 'start' && card) {
      await updateSession(pin, { status: 'active', cardIndex: 0 })
      await triggerSessionEvent(pin, {
        event: 'game-started',
        data: { cardIndex: 0, card },
      })
    } else if (action === 'finish') {
      await updateSession(pin, { status: 'finished' })
      await triggerSessionEvent(pin, {
        event: 'game-finished',
        data: { scores: body.scores ?? [], teamScores: body.teamScores ?? [] },
      })
      // Fire-and-forget: purge ephemeral game-events rows for this session.
      // Errors are swallowed inside cleanupSessionEvents.
      void cleanupSessionEvents(pin)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}]`, err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
