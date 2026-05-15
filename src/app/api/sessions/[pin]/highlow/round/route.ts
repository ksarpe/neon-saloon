import { NextResponse } from 'next/server'
import { getSession, updateSession } from '@/lib/appwrite/sessions'
import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import type { HighLowRoundStartPayload } from '@/lib/game-types'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params
  try {
    const body = (await request.json()) as HighLowRoundStartPayload & {
      votingTeamId: string
    }

    const session = await getSession(pin)
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

    // Persist round state so players who reconnect can catch up
    await updateSession(pin, {
      status: 'active',
      highlowData: {
        questionIndex: body.roundIndex,
        guessingTeamId: body.guessingTeamId,
        votingTeamId: body.votingTeamId,
        guessingCaptainId: body.guessingCaptainId,
        votingCaptainId: body.votingCaptainId,
        currentNumber: undefined,
      },
    })

    await triggerSessionEvent(pin, {
      event: 'highlow-round-start',
      data: {
        roundIndex: body.roundIndex,
        questionText: body.questionText,
        questionUnit: body.questionUnit,
        guessingTeamId: body.guessingTeamId,
        guessingTeamName: body.guessingTeamName,
        votingTeamId: body.votingTeamId,
        votingTeamName: body.votingTeamName,
        guessingCaptainId: body.guessingCaptainId,
        votingCaptainId: body.votingCaptainId,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/highlow/round]`, err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
