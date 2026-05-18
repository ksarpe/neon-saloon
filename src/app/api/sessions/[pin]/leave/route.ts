import { NextResponse } from 'next/server'

import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { getSession, saveSession } from '@/lib/appwrite/sessions'
import {
  optionalString,
  readLimitedJson,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import { getAuthorizedPlayer } from '@/lib/session-player-auth'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params

  try {
    const body = await readLimitedJson<{ playerId?: unknown; playerSecret?: unknown }>(request)
    const playerId = requiredString(body.playerId, 'playerId', 80)
    const playerSecret = optionalString(body.playerSecret, 'playerSecret', 256) ?? undefined

    const session = await getSession(pin)
    if (!session) return NextResponse.json({ ok: true })
    const player = getAuthorizedPlayer(request, session, playerId, playerSecret)
    if (!player) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    session.players = session.players.filter((p) => p.playerId !== playerId)
    await saveSession(session)

    await triggerSessionEvent(pin, {
      event: 'player-left',
      data: { playerId },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error(`[POST /api/sessions/${pin}/leave]`, err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
