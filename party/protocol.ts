// Wire protocol between the browser (partysocket) and the PartyKit room.
//
// Phase 0+1 implements ping/pong + token-gated connect + state-snapshot stub.
// Phase 2 fills in the game-action handlers (host:start, player:vote, etc.).
//
// Event payload types are re-used from src/lib/game-types via TYPE-ONLY imports,
// so the PartyKit bundle gets the shapes without dragging browser/server runtime.

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

export type ClientHostRegisterAsPlayer = {
  type: 'host:register-player'
  requestId: string
  /** The host's chosen display name (entered in SetupView, not the token default). */
  playerName: string
  /** The host's chosen avatar identifier. */
  avatar: string
}

export type ClientPing = {
  type: 'ping'
  requestId: string
}

// ─── HighLow ────────────────────────────────────────────────────────────────

export type ClientHostHighLowSetup = {
  type: 'host:highlow-setup'
  requestId: string
  team1Name: string
  team2Name: string
}

export type ClientHostHighLowRound = {
  type: 'host:highlow-round'
  requestId: string
  roundIndex: number
  questionText: string
  questionUnit: string
  guessingTeamId: string
  guessingTeamName: string
  votingTeamId: string
  votingTeamName: string
  guessingCaptainId: string
  votingCaptainId: string
}

export type ClientPlayerHighLowNumber = {
  type: 'player:highlow-number'
  requestId: string
  number: string
}

export type ClientPlayerHighLowVote = {
  type: 'player:highlow-vote'
  requestId: string
  vote: 'mniej' | 'wiecej'
}

// ─── Battle Royale ──────────────────────────────────────────────────────────

export type ClientHostBattleRoyaleSetup = {
  type: 'host:br-setup'
  requestId: string
  categoryId: string
  timerDuration?: number
}

export type ClientHostBattleRoyaleRound = {
  type: 'host:br-round'
  requestId: string
}

export type ClientHostBattleRoyaleReveal = {
  type: 'host:br-reveal'
  requestId: string
}

export type ClientHostBattleRoyaleNext = {
  type: 'host:br-next'
  requestId: string
}

export type ClientPlayerBattleRoyaleAnswer = {
  type: 'player:br-answer'
  requestId: string
  answerIndex: number
  answerText?: string
}

export type ClientMessage =
  | ClientPing
  | ClientHostStart
  | ClientHostReveal
  | ClientHostNext
  | ClientHostFinish
  | ClientPlayerVote
  | ClientPlayerLeave
  | ClientHostRegisterAsPlayer
  | ClientHostHighLowSetup
  | ClientHostHighLowRound
  | ClientPlayerHighLowNumber
  | ClientPlayerHighLowVote
  | ClientHostBattleRoyaleSetup
  | ClientHostBattleRoyaleRound
  | ClientHostBattleRoyaleReveal
  | ClientHostBattleRoyaleNext
  | ClientPlayerBattleRoyaleAnswer

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
  // ─── Mode-specific slices ────────────────────────────────────────────────
  highlow?: {
    questionIndex: number
    guessingTeamId: string
    guessingTeamName: string
    votingTeamId: string
    votingTeamName: string
    guessingCaptainId: string
    votingCaptainId: string
    questionText?: string
    questionUnit?: string
    currentNumber?: string
    currentResult?: {
      correctAnswer: number
      unit: string
      guessingTeamGuess: number
      correctVote: 'mniej' | 'wiecej'
      captainVote: 'mniej' | 'wiecej'
      winningTeamId: string
      winningTeamName: string
      scores: ScoreEntry[]
    }
  }
  battleRoyale?: {
    categoryId: string
    questionText?: string
    options?: string[]
    questionIndex: number
    totalQuestions: number
    timerDuration: number
    eliminatedPlayers: string[]
    alivePlayers?: string[]
    answeredPlayerIds?: string[]
    roundStartTime?: number
  }
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
