import { NextResponse } from 'next/server'

import { PLAYER_AVATARS } from '@/config/player-avatars'
import { withSessionTransaction } from '@/lib/appwrite/sessions'
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

const GLOBAL_SESSION_JOIN_LIMITS = [
  { suffix: 'burst', limit: 600, windowMs: 60_000 },
  { suffix: 'sustained', limit: 3_000, windowMs: 15 * 60_000 },
]

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params
  const clientIp = getClientIp(request)
  for (const rateLimit of GLOBAL_SESSION_JOIN_LIMITS) {
    const result = await consumeRateLimit(`session-join:global:${rateLimit.suffix}`, rateLimit)
    if (!result.allowed) {
      return NextResponse.json(
        {
          error: 'Chwilowo zbyt dużo osób dołącza do salonów. Spróbuj ponownie później.',
          retryAfter: result.retryAfter,
        },
        { status: 429, headers: rateLimitHeaders(result) }
      )
    }
  }

  const ipLimit = await consumeRateLimit(`session-join:${clientIp}`, {
    limit: 20,
    windowMs: 60_000,
  })

  if (!ipLimit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: ipLimit.retryAfter },
      { status: 429, headers: rateLimitHeaders(ipLimit) }
    )
  }

  const pinLimit = await consumeRateLimit(`session-join:${clientIp}:${pin}`, {
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

    const playerId = `player_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    const playerSecret = createPlayerSecret()

    const joined = await withSessionTransaction(pin, async (store) => {
      const session = await store.getSession(pin)
      if (!session) {
        return { response: NextResponse.json({ error: 'Session not found' }, { status: 404 }) }
      }
      if (session.status === 'active') {
        return { response: NextResponse.json({ error: 'Game already started' }, { status: 409 }) }
      }
      if (session.status === 'finished') {
        return { response: NextResponse.json({ error: 'Game already finished' }, { status: 409 }) }
      }

      const resolvedPlayerName = allocatePlayerName(playerName, session.players)
      const resolvedAvatar = resolveAvatar(chosenAvatar, session.players)
      if (session.gameMode !== 'highlow' && (teamId || newTeamName)) {
        return {
          response: NextResponse.json(
            { error: 'Teams are only available in Mniej więcej' },
            { status: 400 }
          ),
        }
      }

      if (session.gameMode === 'highlow' && newTeamName) {
        return {
          response: NextResponse.json({ error: 'Team creation is host-controlled' }, { status: 400 }),
        }
      }

      if (session.gameMode === 'highlow' && !teamId) {
        return { response: NextResponse.json({ error: 'Team is required' }, { status: 400 }) }
      }

      const selectedTeam =
        session.gameMode === 'highlow'
          ? session.teams.find((team) => team.teamId === teamId)
          : null
      if (session.gameMode === 'highlow' && !selectedTeam) {
        return { response: NextResponse.json({ error: 'Team not found' }, { status: 400 }) }
      }

      const resolvedTeamId = session.gameMode === 'highlow' ? teamId : null
      const resolvedTeamName = session.gameMode === 'highlow' ? selectedTeam?.teamName ?? null : null

      const player = {
        playerId,
        playerSecretHash: hashPlayerSecret(playerSecret),
        playerName: resolvedPlayerName,
        avatar: resolvedAvatar,
        teamId: resolvedTeamId,
        teamName: resolvedTeamName,
      }

      session.players = [...session.players, player]
      await store.saveSession(session)

      const teamMemberCount = resolvedTeamId
        ? session.players.filter((p) => p.teamId === resolvedTeamId).length
        : 0

      // Broadcast atomically with the state write (see withSessionTransaction).
      store.appendEvent(pin, {
        event: 'player-joined',
        data: {
          playerId: player.playerId,
          playerName: player.playerName,
          avatar: player.avatar,
          teamId: player.teamId,
          teamName: player.teamName,
        },
      })

      if (player.teamId) {
        store.appendEvent(pin, {
          event: 'team-updated',
          data: {
            teamId: player.teamId,
            teamName: player.teamName ?? '',
            memberCount: teamMemberCount,
          },
        })
      }

      return { player, playerSecret, teamMemberCount }
    })

    if ('response' in joined) return joined.response

    return NextResponse.json(
      {
        playerId: joined.player.playerId,
        playerSecret: joined.playerSecret,
        playerName: joined.player.playerName,
        teamId: joined.player.teamId,
        teamName: joined.player.teamName,
        avatar: joined.player.avatar,
      },
      { status: 200 }
    )
  } catch (err) {
    const validationResponse = validationErrorResponse(err)
    if (validationResponse) return validationResponse

    console.error(`[POST /api/sessions/${pin}/join]`, err)
    return NextResponse.json({ error: 'Failed to join session' }, { status: 500 })
  }
}

function allocatePlayerName(requestedName: string, players: { playerName: string }[]) {
  const usedNames = new Set(players.map((player) => normalizeName(player.playerName)))
  if (!usedNames.has(normalizeName(requestedName))) return requestedName

  for (let suffix = 2; suffix < 1000; suffix++) {
    const candidate = `${requestedName} (${suffix})`
    if (!usedNames.has(normalizeName(candidate))) return candidate
  }

  return `${requestedName} (${Date.now().toString(36)})`
}

function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase('pl-PL')
}

function resolveAvatar(chosenAvatar: string | null, players: { avatar: string }[]) {
  if (chosenAvatar && (PLAYER_AVATARS.length === 0 || PLAYER_AVATARS.includes(chosenAvatar))) {
    return chosenAvatar
  }
  if (PLAYER_AVATARS.length === 0) return 'default.png'

  const usage = new Map(PLAYER_AVATARS.map((avatar) => [avatar, 0]))
  for (const player of players) {
    usage.set(player.avatar, (usage.get(player.avatar) ?? 0) + 1)
  }

  return PLAYER_AVATARS.reduce((best, avatar) =>
    (usage.get(avatar) ?? 0) < (usage.get(best) ?? 0) ? avatar : best
  )
}
