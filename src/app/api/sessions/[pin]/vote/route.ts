import { NextResponse } from 'next/server'
import { getSession, saveSession } from '@/lib/appwrite/sessions'
import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { getAuthorizedPlayer } from '@/lib/session-player-auth'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params

  try {
    const body = await request.json()
    const { playerId, cardIndex, answerIndex, answerText } = body as {
      playerId: string
      cardIndex: number
      answerIndex: number
      answerText: string
    }

    if (!playerId || cardIndex === undefined) {
      return NextResponse.json({ error: 'playerId and cardIndex required' }, { status: 400 })
    }

    const session = await getSession(pin)
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

    const player = getAuthorizedPlayer(request, session, playerId)
    if (!player) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const vote = {
      playerId,
      playerName: player.playerName,
      teamId: player.teamId,
      teamName: player.teamName,
      cardIndex,
      answerIndex,
      answerText,
    }

    // Persist vote (upsert by playerId+cardIndex)
    const existing = session.votes ?? []
    const others = existing.filter((v) => !(v.playerId === playerId && v.cardIndex === cardIndex))
    session.votes = [...others, vote]
    await saveSession(session)

    // Broadcast via Appwrite Realtime
    await triggerSessionEvent(pin, { event: 'vote-cast', data: vote })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/vote]`, err)
    return NextResponse.json({ error: 'Failed to cast vote' }, { status: 500 })
  }
}
