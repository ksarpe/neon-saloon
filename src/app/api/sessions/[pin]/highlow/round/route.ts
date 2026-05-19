import { NextResponse } from 'next/server'

import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { getSession, updateSession } from '@/lib/appwrite/sessions'
import {
  INPUT_LIMITS,
  readLimitedJson,
  requiredInteger,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
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

    const body = await readLimitedJson<Record<string, unknown>>(request)
    const roundIndex = requiredInteger(body.roundIndex, 'roundIndex', 0, 10_000)
    const questionText = requiredString(
      body.questionText,
      'questionText',
      INPUT_LIMITS.cardDescription
    )
    const questionUnit = requiredString(body.questionUnit, 'questionUnit', INPUT_LIMITS.quizOption)
    const guessingTeamId = requiredString(body.guessingTeamId, 'guessingTeamId', 80)
    const guessingTeamName = requiredString(
      body.guessingTeamName,
      'guessingTeamName',
      INPUT_LIMITS.teamName
    )
    const votingTeamId = requiredString(body.votingTeamId, 'votingTeamId', 80)
    const votingTeamName = requiredString(
      body.votingTeamName,
      'votingTeamName',
      INPUT_LIMITS.teamName
    )
    const guessingCaptainId = requiredString(body.guessingCaptainId, 'guessingCaptainId', 80)
    const votingCaptainId = requiredString(body.votingCaptainId, 'votingCaptainId', 80)

    // Persist round state so players who reconnect can catch up
    await updateSession(pin, {
      status: 'active',
      highlowData: {
        questionIndex: roundIndex,
        guessingTeamId,
        votingTeamId,
        guessingCaptainId,
        votingCaptainId,
        currentNumber: undefined,
        questionText,
        questionUnit,
        guessingTeamName,
        votingTeamName,
      },
    })

    await triggerSessionEvent(pin, {
      event: 'highlow-round-start',
      data: {
        roundIndex,
        questionText,
        questionUnit,
        guessingTeamId,
        guessingTeamName,
        votingTeamId,
        votingTeamName,
        guessingCaptainId,
        votingCaptainId,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error(`[POST /api/sessions/${pin}/highlow/round]`, err)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
