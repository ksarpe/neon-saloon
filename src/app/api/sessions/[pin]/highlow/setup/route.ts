import { NextResponse } from 'next/server'

import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { saveSession } from '@/lib/appwrite/sessions'
import {
  INPUT_LIMITS,
  readLimitedJson,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import { requireHostSession } from '@/lib/session-api'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params
  try {
    const hostSession = await requireHostSession(request, pin)
    if (!hostSession.ok) return hostSession.response
    const session = hostSession.value

    const body = await readLimitedJson<{ team1Name?: unknown; team2Name?: unknown }>(request)
    const team1Name = requiredString(body.team1Name, 'team1Name', INPUT_LIMITS.teamName)
    const team2Name = requiredString(body.team2Name, 'team2Name', INPUT_LIMITS.teamName)

    const team1 = {
      teamId: `team_${Date.now()}_1`,
      teamName: team1Name,
      color: '#FF10F0',
      emoji: '🤠',
    }
    const team2 = {
      teamId: `team_${Date.now()}_2`,
      teamName: team2Name,
      color: '#FFD700',
      emoji: '🎯',
    }

    session.teams = [team1, team2]
    await saveSession(session)

    await triggerSessionEvent(pin, { event: 'team-created', data: team1 })
    await triggerSessionEvent(pin, { event: 'team-created', data: team2 })

    return NextResponse.json({ team1, team2 })
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error(`[POST /api/sessions/${pin}/highlow/setup]`, err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
