import { NextResponse } from 'next/server'
import { getSession, updateSession } from '@/lib/appwrite/sessions'
import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { isHostAuthorized } from '@/lib/session-host-auth'
import type { WireCard } from '@/lib/game-types'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params
  try {
    const session = await getSession(pin)
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    if (!isHostAuthorized(request, session)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { cardIndex, card } = body as { cardIndex: number; card: WireCard }

    await updateSession(pin, { cardIndex })

    await triggerSessionEvent(pin, {
      event: 'next-card',
      data: { cardIndex, card },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/next-card]`, err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
