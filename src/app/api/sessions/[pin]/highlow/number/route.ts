import { NextResponse } from 'next/server'

import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { updateSession } from '@/lib/appwrite/sessions'
import {
  INPUT_LIMITS,
  readLimitedJson,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import { requirePlayerSession } from '@/lib/session-api'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params
  try {
    const body = await readLimitedJson<{ playerId?: unknown; number?: unknown }>(request)
    const playerId = requiredString(body.playerId, 'playerId', 80)
    const number = requiredString(body.number, 'number', INPUT_LIMITS.highlowNumber)

    const playerSession = await requirePlayerSession(request, pin, playerId)
    if (!playerSession.ok) return playerSession.response
    const { player, session } = playerSession.value

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
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error(`[POST /api/sessions/${pin}/highlow/number]`, err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
