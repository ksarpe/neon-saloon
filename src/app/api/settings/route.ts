import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { REVEAL_COUNTDOWN_SECONDS, BR_TIMER_SECONDS, BR_AUTO_NEXT_SECONDS } from '@/lib/game-config'
import { readLimitedJson, validationErrorResponse } from '@/lib/request-validation'

export type GameSettingsPayload = {
  revealCountdownSeconds: number
  brTimerSeconds: number
  brAutoNextSeconds: number
}

const LIMITS = {
  revealCountdownSeconds: { min: 2, max: 15 },
  brTimerSeconds: { min: 5, max: 60 },
  brAutoNextSeconds: { min: 3, max: 30 },
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value)))
}

function defaultSettings(): GameSettingsPayload {
  return {
    revealCountdownSeconds: REVEAL_COUNTDOWN_SECONDS,
    brTimerSeconds: BR_TIMER_SECONDS,
    brAutoNextSeconds: BR_AUTO_NEXT_SECONDS,
  }
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json(defaultSettings())
  }

  const settings = await prisma.gameSettings.findUnique({
    where: { userId: session.user.id },
  })

  return NextResponse.json(
    settings
      ? {
          revealCountdownSeconds: settings.revealCountdownSeconds,
          brTimerSeconds: settings.brTimerSeconds,
          brAutoNextSeconds: settings.brAutoNextSeconds,
        }
      : defaultSettings()
  )
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await readLimitedJson<Partial<GameSettingsPayload>>(request)

    const data: Partial<GameSettingsPayload> = {}
    if (typeof body.revealCountdownSeconds === 'number') {
      data.revealCountdownSeconds = clamp(
        body.revealCountdownSeconds,
        LIMITS.revealCountdownSeconds.min,
        LIMITS.revealCountdownSeconds.max
      )
    }
    if (typeof body.brTimerSeconds === 'number') {
      data.brTimerSeconds = clamp(
        body.brTimerSeconds,
        LIMITS.brTimerSeconds.min,
        LIMITS.brTimerSeconds.max
      )
    }
    if (typeof body.brAutoNextSeconds === 'number') {
      data.brAutoNextSeconds = clamp(
        body.brAutoNextSeconds,
        LIMITS.brAutoNextSeconds.min,
        LIMITS.brAutoNextSeconds.max
      )
    }

    const updated = await prisma.gameSettings.upsert({
      where: { userId: session.user.id },
      update: data,
      create: { userId: session.user.id, ...defaultSettings(), ...data },
    })

    return NextResponse.json({
      revealCountdownSeconds: updated.revealCountdownSeconds,
      brTimerSeconds: updated.brTimerSeconds,
      brAutoNextSeconds: updated.brAutoNextSeconds,
    })
  } catch (err) {
    return validationErrorResponse(err) ?? NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
