import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

import type { SessionData, SessionPlayer } from '@/lib/appwrite/sessions'

export const PLAYER_SECRET_HEADER = 'x-player-secret'

export function createPlayerSecret() {
  return randomBytes(32).toString('base64url')
}

export function hashPlayerSecret(playerSecret: string) {
  return createHash('sha256').update(playerSecret).digest('hex')
}

export function getAuthorizedPlayer(
  request: Request,
  session: SessionData,
  playerId: string | null | undefined,
  bodySecret?: string | null
) {
  if (!playerId) return null

  const player = session.players.find((candidate) => candidate.playerId === playerId)
  if (!player?.playerSecretHash) return null

  const provided = request.headers.get(PLAYER_SECRET_HEADER) ?? bodySecret
  if (!provided) return null

  return timingSafeStringEqual(hashPlayerSecret(provided), player.playerSecretHash) ? player : null
}

export function publicPlayer(player: SessionPlayer): Omit<SessionPlayer, 'playerSecretHash'> {
  const { playerSecretHash: _playerSecretHash, ...safePlayer } = player
  return safePlayer
}

function timingSafeStringEqual(value: string, expected: string) {
  const valueBuffer = Buffer.from(value)
  const expectedBuffer = Buffer.from(expected)
  if (valueBuffer.length !== expectedBuffer.length) return false
  return timingSafeEqual(valueBuffer, expectedBuffer)
}
