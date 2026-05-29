// Per-room state held in memory by the Durable Object and snapshotted to
// `room.storage` after every change. On wake (hibernation, eviction, new
// deploy) the server loads this back via `room.storage.get("state")`.

import type {
  ScoreEntry,
  StandardGameSettings,
  TeamScoreEntry,
  WireCard,
} from '../src/lib/game-types'
import type { StoredCard } from './wire-card'

export type GameMode = "classic" | "highlow" | "battle-royale"
export type SessionStatus = "waiting" | "active" | "finished"

export type RoomPlayer = {
  playerId: string
  playerName: string
  avatar: string
  teamId: string | null
  teamName: string | null
  joinedAt: number
}

export type RoomTeam = {
  teamId: string
  teamName: string
  color: string
  emoji: string
}

export type StoredVote = {
  playerId: string
  playerName: string
  teamId: string | null
  teamName: string | null
  cardIndex: number
  answerIndex: number
  answerText: string
}

export type CurrentReveal = {
  cardIndex: number
  revealStartedAt: number
  correctAnswer?: string
  votes: StoredVote[]
}

// ─── HighLow ─────────────────────────────────────────────────────────────────

export type HighLowResult = {
  correctAnswer: number
  unit: string
  guessingTeamGuess: number
  correctVote: 'mniej' | 'wiecej'
  captainVote: 'mniej' | 'wiecej'
  winningTeamId: string
  winningTeamName: string
  scores: ScoreEntry[]
}

export type HighLowData = {
  questionIndex: number
  guessingTeamId: string
  guessingTeamName: string
  votingTeamId: string
  votingTeamName: string
  guessingCaptainId: string
  votingCaptainId: string
  // The host echoes display text + unit so reconnects don't need to re-derive.
  questionText?: string
  questionUnit?: string
  currentNumber?: string
  currentResult?: HighLowResult
}

// ─── Battle Royale ───────────────────────────────────────────────────────────

export type BRStoredAnswer = {
  playerId: string
  playerName: string
  avatar: string
  answerIndex: number // -1 = no answer (timed out)
  answerText: string
  answeredAt: number // ms since epoch; -1 = timed out
  isCorrect: boolean
}

export type BattleRoyaleData = {
  categoryId: string
  questionOrder?: number[]
  questionIndex: number
  totalQuestions: number
  eliminatedPlayers: string[]
  roundAnswers: BRStoredAnswer[]
  timerDuration: number
  roundStartTime?: number
}

// ─── Room state ──────────────────────────────────────────────────────────────

export type RoomState = {
  pin: string
  hostId: string
  hostName: string
  gameMode: GameMode
  /** Participant cap resolved from the host's premium tier (free vs premium).
   * Optional for backward-compat with rooms persisted before this field existed. */
  maxPlayers?: number
  status: SessionStatus
  createdAt: number
  players: RoomPlayer[]
  teams: RoomTeam[]
  cardIndex: number
  currentCard?: WireCard
  currentCardStartedAt?: number
  deck?: StoredCard[]
  votes: StoredVote[]
  scores?: ScoreEntry[]
  teamScores?: TeamScoreEntry[]
  currentReveal?: CurrentReveal
  settings?: StandardGameSettings
  highlow?: HighLowData
  battleRoyale?: BattleRoyaleData
}

export function initialRoomState(args: {
  pin: string
  hostId: string
  hostName: string
  gameMode: GameMode
  maxPlayers: number
}): RoomState {
  return {
    pin: args.pin,
    hostId: args.hostId,
    hostName: args.hostName,
    gameMode: args.gameMode,
    maxPlayers: args.maxPlayers,
    status: "waiting",
    createdAt: Date.now(),
    players: [],
    teams: [],
    cardIndex: 0,
    votes: [],
  }
}
