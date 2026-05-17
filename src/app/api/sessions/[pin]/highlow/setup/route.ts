import { NextResponse } from 'next/server'
import { getSession, saveSession } from '@/lib/appwrite/sessions'
import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { isHostAuthorized } from '@/lib/session-host-auth'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params
  try {
    const session = await getSession(pin)
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    if (!isHostAuthorized(request, session)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { team1Name, team2Name } = (await request.json()) as {
      team1Name: string
      team2Name: string
    }

    const team1 = {
      teamId: `team_${Date.now()}_1`,
      teamName: team1Name.trim(),
      color: '#FF10F0',
      emoji: '🤠',
    }
    const team2 = {
      teamId: `team_${Date.now()}_2`,
      teamName: team2Name.trim(),
      color: '#FFD700',
      emoji: '🎯',
    }

    session.teams = [team1, team2]
    await saveSession(session)

    await triggerSessionEvent(pin, { event: 'team-created', data: team1 })
    await triggerSessionEvent(pin, { event: 'team-created', data: team2 })

    return NextResponse.json({ team1, team2 })
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/highlow/setup]`, err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
