import { NextResponse } from 'next/server'

import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { getSession, saveSession } from '@/lib/appwrite/sessions'
import {
  INPUT_LIMITS,
  optionalString,
  readLimitedJson,
  requiredInteger,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import { getAuthorizedPlayer } from '@/lib/session-player-auth'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params

  try {
    const body = await readLimitedJson<{
      playerId?: unknown
      cardIndex?: unknown
      answerIndex?: unknown
      answerText?: unknown
    }>(request)
    const playerId = requiredString(body.playerId, 'playerId', 80)
    const cardIndex = requiredInteger(body.cardIndex, 'cardIndex', 0, 10_000)
    const answerIndex = requiredInteger(body.answerIndex, 'answerIndex', -1, 20)
    const answerText = optionalString(body.answerText, 'answerText', INPUT_LIMITS.answerText) ?? ''

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
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error(`[POST /api/sessions/${pin}/vote]`, err)
    return NextResponse.json({ error: 'Failed to cast vote' }, { status: 500 })
  }
}
