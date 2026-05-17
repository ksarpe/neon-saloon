import { NextResponse } from 'next/server'
import { getSession, updateSession } from '@/lib/appwrite/sessions'
import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { getAuthorizedPlayer } from '@/lib/session-player-auth'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params
  try {
    const { playerId, number } = (await request.json()) as {
      playerId: string
      number: string
    }

    const session = await getSession(pin)
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    const player = getAuthorizedPlayer(request, session, playerId)
    if (!player) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    if (!session.highlowData)
      return NextResponse.json({ error: 'No active round' }, { status: 400 })
    if (session.highlowData.guessingCaptainId !== player.playerId) {
      return NextResponse.json({ error: 'Not the guessing captain' }, { status: 403 })
    }

    await updateSession(pin, {
      highlowData: { ...session.highlowData, currentNumber: number },
    })

    await triggerSessionEvent(pin, {
      event: 'highlow-number-submitted',
      data: { number },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/highlow/number]`, err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
