import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import {
  ANSWER_TIME_LIMIT_SECONDS,
  BR_AUTO_NEXT_SECONDS,
  BR_TIMER_SECONDS,
  REVEAL_COUNTDOWN_SECONDS,
} from '@/config/game'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import { readLimitedJson, validationErrorResponse } from '@/lib/request-validation'

export type GameSettingsPayload = {
  revealCountdownSeconds: number
  answerTimeLimitSeconds: number
  brTimerSeconds: number
  brAutoNextSeconds: number
}

const LIMITS = {
  revealCountdownSeconds: { min: 2, max: 15 },
  answerTimeLimitSeconds: { min: 15, max: 300 },
  brTimerSeconds: { min: 5, max: 60 },
  brAutoNextSeconds: { min: 3, max: 30 },
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value)))
}

function defaultSettings(): GameSettingsPayload {
  return {
    revealCountdownSeconds: REVEAL_COUNTDOWN_SECONDS,
    answerTimeLimitSeconds: ANSWER_TIME_LIMIT_SECONDS,
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
          answerTimeLimitSeconds: settings.answerTimeLimitSeconds,
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
    const rateLimitResponse = await enforceSettingsPatchLimit(request, session.user.id)
    if (rateLimitResponse) return rateLimitResponse

    const body = await readLimitedJson<Partial<GameSettingsPayload>>(request)

    const data: Partial<GameSettingsPayload> = {}
    if (typeof body.revealCountdownSeconds === 'number') {
      data.revealCountdownSeconds = clamp(
        body.revealCountdownSeconds,
        LIMITS.revealCountdownSeconds.min,
        LIMITS.revealCountdownSeconds.max
      )
    }
    if (typeof body.answerTimeLimitSeconds === 'number') {
      data.answerTimeLimitSeconds = clamp(
        body.answerTimeLimitSeconds,
        LIMITS.answerTimeLimitSeconds.min,
        LIMITS.answerTimeLimitSeconds.max
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
      answerTimeLimitSeconds: updated.answerTimeLimitSeconds,
      brTimerSeconds: updated.brTimerSeconds,
      brAutoNextSeconds: updated.brAutoNextSeconds,
    })
  } catch (err) {
    return validationErrorResponse(err) ?? NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

async function enforceSettingsPatchLimit(request: Request, userId: string) {
  const ipLimit = await consumeRateLimit(`settings:update:ip:${getClientIp(request)}`, {
    limit: 60,
    windowMs: 60_000,
  })
  if (!ipLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Za dużo prób aktualizacji ustawień. Spróbuj ponownie później.',
        retryAfter: ipLimit.retryAfter,
      },
      { status: 429, headers: rateLimitHeaders(ipLimit) }
    )
  }

  const userLimit = await consumeRateLimit(`settings:update:user:${userId}`, {
    limit: 30,
    windowMs: 60_000,
  })
  if (!userLimit.allowed) {
    return NextResponse.json(
      {
        error: 'Za dużo prób aktualizacji ustawień. Spróbuj ponownie później.',
        retryAfter: userLimit.retryAfter,
      },
      { status: 429, headers: rateLimitHeaders(userLimit) }
    )
  }

  return null
}
