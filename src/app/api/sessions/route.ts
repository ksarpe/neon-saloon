import { NextResponse } from 'next/server'

import { cleanupOldSessions, createSession, type SessionData } from '@/lib/appwrite/sessions'
import { optionalString, readLimitedJson, validationErrorResponse } from '@/lib/request-validation'
import { createHostSecret, hashHostSecret } from '@/lib/session-host-auth'
import { SESSION_PIN_LENGTH } from '@/lib/session-pin'

function generatePin(): string {
  const chars = '0123456789'
  let pin = ''
  for (let i = 0; i < SESSION_PIN_LENGTH; i++) {
    pin += chars[Math.floor(Math.random() * chars.length)]
  }
  return pin
}

async function createSessionWithUniquePin(
  hostName: string,
  gameMode: string
): Promise<{ pin: string; hostSecret: string }> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const pin = generatePin()
    const hostSecret = createHostSecret()
    const session: SessionData = {
      pin,
      hostSecretHash: hashHostSecret(hostSecret),
      hostName,
      status: 'waiting',
      createdAt: Date.now(),
      players: [],
      teams: [],
      cardIndex: 0,
      votes: [],
      gameMode,
    }

    const created = await createSession(session)
    if (created) return { pin, hostSecret }
  }
  throw new Error('Could not generate a unique PIN')
}

export async function POST(request: Request) {
  try {
    const body = await readLimitedJson<{ hostName?: unknown; gameMode?: unknown }>(request)
    const hostName = optionalString(body.hostName, 'hostName', 24) ?? 'Host'
    const gameMode = optionalString(body.gameMode, 'gameMode', 32) ?? 'classic'

    try {
      await cleanupOldSessions()
    } catch (cleanupError) {
      console.error('[POST /api/sessions] Failed to cleanup old sessions', cleanupError)
    }

    const { pin, hostSecret } = await createSessionWithUniquePin(hostName, gameMode)

    return NextResponse.json({ pin, hostSecret }, { status: 201 })
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error('[POST /api/sessions]', err)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}
