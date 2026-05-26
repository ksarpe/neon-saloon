// Per-room state held in memory by the Durable Object and snapshotted to
// `room.storage` after every change. On wake (hibernation, eviction, new
// deploy) the server loads this back via `room.storage.get("state")`.

import type {
  ScoreEntry,
  StandardGameSettings,
  TeamScoreEntry,
  WireCard,
} from "../src/lib/game-types"
import type { StoredCard } from "./wire-card"

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

export type RoomState = {
  pin: string
  hostName: string
  gameMode: GameMode
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
}

export function initialRoomState(args: {
  pin: string
  hostName: string
  gameMode: GameMode
}): RoomState {
  return {
    pin: args.pin,
    hostName: args.hostName,
    gameMode: args.gameMode,
    status: "waiting",
    createdAt: Date.now(),
    players: [],
    teams: [],
    cardIndex: 0,
    votes: [],
  }
}
