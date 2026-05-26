// Wire protocol between the browser (partysocket) and the PartyKit room.
//
// Phase 0+1 implements ping/pong + token-gated connect + state-snapshot stub.
// Phase 2 fills in the game-action handlers (host:start, player:vote, etc.).
//
// Event payload types are re-used from src/lib/game-types via TYPE-ONLY imports,
// so the PartyKit bundle gets the shapes but never drags any Appwrite runtime.

import type {
  ScoreEntry,
  SessionEvent,
  StandardGameSettings,
  TeamScoreEntry,
  WireCard,
} from '../src/lib/game-types'

export type { SessionEvent } from '../src/lib/game-types'

// ─── Client → Server ─────────────────────────────────────────────────────────
// Every command carries a `requestId` so the server can ack the exact request
// and the client can resolve a promise / surface errors.

export type ClientHostStart = {
  type: 'host:start'
  requestId: string
  card: WireCard
  deck?: WireCard[]
  settings?: StandardGameSettings
}

export type ClientHostReveal = {
  type: 'host:reveal'
  requestId: string
  cardIndex: number
  correctAnswer?: string
  votes: Array<{
    playerId: string
    playerName: string
    teamId?: string | null
    teamName?: string | null
    answerIndex: number
    answerText: string
  }>
  scores: ScoreEntry[]
  teamScores: TeamScoreEntry[]
}

export type ClientHostNext = {
  type: 'host:next'
  requestId: string
  cardIndex: number
  card?: WireCard
}

export type ClientHostFinish = {
  type: 'host:finish'
  requestId: string
  scores: ScoreEntry[]
  teamScores: TeamScoreEntry[]
  showPlayerPoints?: boolean
}

export type ClientPlayerVote = {
  type: 'player:vote'
  requestId: string
  cardIndex: number
  answerIndex: number
  answerText?: string
}

export type ClientPlayerLeave = {
  type: 'player:leave'
  requestId: string
}

export type ClientPing = {
  type: 'ping'
  requestId: string
}

export type ClientMessage =
  | ClientPing
  | ClientHostStart
  | ClientHostReveal
  | ClientHostNext
  | ClientHostFinish
  | ClientPlayerVote
  | ClientPlayerLeave

// ─── Server → Client ─────────────────────────────────────────────────────────

export type GameMode = 'classic' | 'highlow' | 'battle-royale'
export type SessionStatus = 'waiting' | 'active' | 'finished'

export type GameStateSnapshot = {
  pin: string
  gameMode: GameMode
  status: SessionStatus
  cardIndex: number
  players: Array<{
    playerId: string
    playerName: string
    avatar: string
    teamId: string | null
    teamName: string | null
  }>
  teams: Array<{
    teamId: string
    teamName: string
    color: string
    emoji: string
  }>
  currentCard?: WireCard
  // Mode-specific snapshots (highlow / battle-royale) appear here in their phases.
}

export type ServerPong = { type: 'pong'; requestId: string }
export type ServerAckOk = { type: 'ack'; requestId: string; ok: true }
export type ServerAckFail = { type: 'ack'; requestId: string; ok: false; error: string }
export type ServerError = { type: 'error'; requestId?: string; message: string }
export type ServerStateSnapshot = { type: 'state-snapshot'; state: GameStateSnapshot }
export type ServerEvent = { type: 'event'; event: SessionEvent }

export type ServerMessage =
  | ServerPong
  | ServerAckOk
  | ServerAckFail
  | ServerError
  | ServerStateSnapshot
  | ServerEvent
