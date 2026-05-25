import { NextResponse } from 'next/server'

import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { withSessionTransaction } from '@/lib/appwrite/sessions'
import {
  optionalString,
  readLimitedJson,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import { enforceSessionActionRateLimit } from '@/lib/session-action-rate-limit'
import { getAuthorizedPlayer } from '@/lib/session-player-auth'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params

  try {
    const body = await readLimitedJson<{ playerId?: unknown; playerSecret?: unknown }>(request)
    const playerId = requiredString(body.playerId, 'playerId', 80)
    const playerSecret = optionalString(body.playerSecret, 'playerSecret', 256) ?? undefined

    const result = await withSessionTransaction(async (store) => {
      const session = await store.getSession(pin)
      if (!session) return { alreadyGone: true }

      const player = getAuthorizedPlayer(request, session, playerId, playerSecret)
      if (!player) {
        return { response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
      }

      const rateLimitResponse = await enforceSessionActionRateLimit(
        'playerLeave',
        pin,
        player.playerId
      )
      if (rateLimitResponse) return { response: rateLimitResponse }

      const teamId = player.teamId
      const teamName = player.teamName
      session.players = session.players.filter((p) => p.playerId !== playerId)
      await store.saveSession(session)

      return {
        teamId,
        teamName,
        memberCount: teamId ? session.players.filter((p) => p.teamId === teamId).length : 0,
      }
    })

    if ('response' in result) return result.response
    if ('alreadyGone' in result) return NextResponse.json({ ok: true })

    await triggerSessionEvent(pin, {
      event: 'player-left',
      data: { playerId },
    })

    if (result.teamId) {
      await triggerSessionEvent(pin, {
        event: 'team-updated',
        data: {
          teamId: result.teamId,
          teamName: result.teamName ?? '',
          memberCount: result.memberCount,
        },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error(`[POST /api/sessions/${pin}/leave]`, err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
