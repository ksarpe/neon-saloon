import { NextResponse } from 'next/server'
import { getSession, saveSession } from '@/lib/appwrite/sessions'
import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params

  try {
    const body = await request.json()
    const { playerId, playerName, teamId, teamName, cardIndex, answerIndex, answerText } = body as {
      playerId: string
      playerName: string
      teamId?: string
      teamName?: string
      cardIndex: number
      answerIndex: number
      answerText: string
    }

    if (!playerId || cardIndex === undefined) {
      return NextResponse.json({ error: 'playerId and cardIndex required' }, { status: 400 })
    }

    const vote = {
      playerId,
      playerName,
      teamId: teamId ?? null,
      teamName: teamName ?? null,
      cardIndex,
      answerIndex,
      answerText,
    }

    // Persist vote (upsert by playerId+cardIndex)
    const session = await getSession(pin)
    if (session) {
      const existing = session.votes ?? []
      const others = existing.filter((v) => !(v.playerId === playerId && v.cardIndex === cardIndex))
      session.votes = [...others, vote]
      await saveSession(session)
    }

    // Broadcast via Appwrite Realtime
    await triggerSessionEvent(pin, { event: 'vote-cast', data: vote })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/vote]`, err)
    return NextResponse.json({ error: 'Failed to cast vote' }, { status: 500 })
  }
}
