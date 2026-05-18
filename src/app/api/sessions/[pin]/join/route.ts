import { NextResponse } from 'next/server'

import { triggerGameEvent as triggerSessionEvent } from '@/lib/appwrite/realtime'
import { getSession, saveSession } from '@/lib/appwrite/sessions'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'
import {
  INPUT_LIMITS,
  optionalString,
  readLimitedJson,
  requiredString,
  validationErrorResponse,
} from '@/lib/request-validation'
import { createPlayerSecret, hashPlayerSecret } from '@/lib/session-player-auth'

type RouteContext = { params: Promise<{ pin: string }> }

const PLAYER_AVATARS = ['🤠', '💃', '🌸', '✨', '🍾', '🎀', '👑', '🦋', '🌺', '🎉']

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params
  const clientIp = getClientIp(request)
  const globalLimit = consumeRateLimit(`session-join:${clientIp}`, {
    limit: 20,
    windowMs: 60_000,
  })

  if (!globalLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: globalLimit.retryAfter },
      { status: 429, headers: rateLimitHeaders(globalLimit) }
    )
  }

  const pinLimit = consumeRateLimit(`session-join:${clientIp}:${pin}`, {
    limit: 8,
    windowMs: 60_000,
  })

  if (!pinLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: pinLimit.retryAfter },
      { status: 429, headers: rateLimitHeaders(pinLimit) }
    )
  }

  try {
    const body = await readLimitedJson<{
      playerName?: unknown
      avatar?: unknown
      teamId?: unknown
      newTeamName?: unknown
    }>(request)
    const playerName = requiredString(body.playerName, 'playerName', INPUT_LIMITS.playerName)
    const chosenAvatar = optionalString(body.avatar, 'avatar', INPUT_LIMITS.avatar)
    const teamId = optionalString(body.teamId, 'teamId', 80)
    const newTeamName = optionalString(body.newTeamName, 'newTeamName', INPUT_LIMITS.teamName)

    const session = await getSession(pin)
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
    if (session.status === 'active') {
      return NextResponse.json({ error: 'Game already started' }, { status: 409 })
    }
    if (session.status === 'finished') {
      return NextResponse.json({ error: 'Game already finished' }, { status: 409 })
    }

    const playerId = `player_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    const playerSecret = createPlayerSecret()
    const avatar = chosenAvatar ?? PLAYER_AVATARS[Math.floor(Math.random() * PLAYER_AVATARS.length)]

    // Resolve team
    let resolvedTeamId = teamId
    const resolvedTeamName = newTeamName

    if (newTeamName && !teamId) {
      resolvedTeamId = `team_${Date.now()}`
      const newTeam = {
        teamId: resolvedTeamId,
        teamName: newTeamName,
        color: '#FF10F0',
        emoji: '🤠',
      }
      session.teams = [...session.teams, newTeam]

      await triggerSessionEvent(pin, {
        event: 'team-created',
        data: newTeam,
      })
    }

    // Add player
    session.players = [
      ...session.players,
      {
        playerId,
        playerSecretHash: hashPlayerSecret(playerSecret),
        playerName,
        avatar,
        teamId: resolvedTeamId,
        teamName: resolvedTeamName,
      },
    ]

    await saveSession(session)

    await triggerSessionEvent(pin, {
      event: 'player-joined',
      data: {
        playerId,
        playerName,
        avatar,
        teamId: resolvedTeamId,
        teamName: resolvedTeamName,
      },
    })

    if (resolvedTeamId) {
      const memberCount = session.players.filter(
        (p: { teamId: string | null }) => p.teamId === resolvedTeamId
      ).length
      await triggerSessionEvent(pin, {
        event: 'team-updated',
        data: { teamId: resolvedTeamId, teamName: resolvedTeamName ?? '', memberCount },
      })
    }

    return NextResponse.json(
      { playerId, playerSecret, teamId: resolvedTeamId, avatar },
      { status: 200 }
    )
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error(`[POST /api/sessions/${pin}/join]`, err)
    return NextResponse.json({ error: 'Failed to join session' }, { status: 500 })
  }
}
