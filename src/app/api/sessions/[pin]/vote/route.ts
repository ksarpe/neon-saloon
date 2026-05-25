import { NextResponse } from 'next/server'

import type { SessionVote } from '@/lib/appwrite/sessions'
import { withSessionTransaction } from '@/lib/appwrite/sessions'
import {
  INPUT_LIMITS,
  optionalString,
  readLimitedJson,
  requiredInteger,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import { enforceSessionActionRateLimit } from '@/lib/session-action-rate-limit'
import { forbiddenResponse, sessionNotFoundResponse } from '@/lib/session-api'
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
    const answerIndex = requiredInteger(body.answerIndex, 'answerIndex', -2, 20)
    const answerText = optionalString(body.answerText, 'answerText', INPUT_LIMITS.answerText) ?? ''

    const result = await withSessionTransaction(async (store) => {
      const session = await store.getSession(pin)
      if (!session) return { response: sessionNotFoundResponse() }

      const player = getAuthorizedPlayer(request, session, playerId)
      if (!player) return { response: forbiddenResponse() }

      const rateLimitResponse = await enforceSessionActionRateLimit('vote', pin, player.playerId)
      if (rateLimitResponse) return { response: rateLimitResponse }

      if (cardIndex !== session.cardIndex) {
        return { response: NextResponse.json({ error: 'Stale card vote' }, { status: 409 }) }
      }
      if (session.currentReveal?.cardIndex === cardIndex) {
        return { response: NextResponse.json({ error: 'Card already revealed' }, { status: 409 }) }
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
      await store.saveSession(session)

      // Broadcast atomically with the vote write (see withSessionTransaction):
      // the vote-cast event commits in the same transaction, so a burst of
      // simultaneous voters can't clobber each other's events.
      store.appendEvent(pin, { event: 'vote-cast', data: vote })
      return { ok: true as const }
    })

    if ('response' in result) return result.response

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
