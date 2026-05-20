import { NextResponse } from 'next/server'

import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import type { SessionVote } from '@/lib/appwrite/sessions'
import { saveSession } from '@/lib/appwrite/sessions'
import {
  INPUT_LIMITS,
  optionalString,
  readLimitedJson,
  requiredInteger,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import { enforceSessionActionRateLimit } from '@/lib/session-action-rate-limit'
import { requirePlayerSession } from '@/lib/session-api'

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
    const answerIndex = requiredInteger(body.answerIndex, 'answerIndex', -2, 20)
    const answerText = optionalString(body.answerText, 'answerText', INPUT_LIMITS.answerText) ?? ''

    const playerSession = await requirePlayerSession(request, pin, playerId)
    if (!playerSession.ok) return playerSession.response
    const { player, session } = playerSession.value

    const rateLimitResponse = enforceSessionActionRateLimit('vote', pin, player.playerId)
    if (rateLimitResponse) return rateLimitResponse

    if (cardIndex !== session.cardIndex) {
      return NextResponse.json({ error: 'Stale card vote' }, { status: 409 })
    }
    if (session.currentReveal?.cardIndex === cardIndex) {
      return NextResponse.json({ error: 'Card already revealed' }, { status: 409 })
    }

    const vote: SessionVote = {
      playerId,
      playerName: player.playerName,
      teamId: player.teamId,
      teamName: player.teamName,
      cardIndex,
      answerIndex,
      answerText,
    }

    // Keep only the current card's votes in the session document. Historical
    // results are emitted through realtime events and stored in host state.
    session.votes = upsertCurrentCardVote(
      session.votes,
      vote,
      session.players.map((p) => p.playerId)
    )
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

function upsertCurrentCardVote(
  existing: SessionVote[] | undefined,
  vote: SessionVote,
  playerIds: string[]
) {
  const activePlayerIds = new Set(playerIds)
  const currentVotes = (existing ?? []).filter(
    (entry) =>
      entry.cardIndex === vote.cardIndex &&
      entry.playerId !== vote.playerId &&
      activePlayerIds.has(entry.playerId)
  )

  return [...currentVotes, vote]
}
