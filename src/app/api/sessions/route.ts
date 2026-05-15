import { NextResponse } from 'next/server'
import { saveSession, checkPinExists } from '@/lib/sessions'

function generatePin(): string {
  const chars = '0123456789'
  let pin = ''
  for (let i = 0; i < 4; i++) {
    pin += chars[Math.floor(Math.random() * chars.length)]
  }
  return pin
}

async function generateUniquePin(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const pin = generatePin()
    const exists = await checkPinExists(pin)
    if (!exists) return pin
  }
  throw new Error('Could not generate a unique PIN')
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const hostName: string = body.hostName ?? 'Host'
    const gameMode: string = body.gameMode ?? 'classic'

    const pin = await generateUniquePin()

    await saveSession({
      pin,
      hostName,
      status: 'waiting',
      createdAt: Date.now(),
      players: [],
      teams: [],
      cardIndex: 0,
      votes: [],
      gameMode,
    })

    return NextResponse.json({ pin }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/sessions]', err)
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }
}
