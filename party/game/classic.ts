// Pure reducers for the classic ("trivia") game mode. Each function takes the
// current RoomState + a validated input, returns the next state plus any
// events to broadcast — or an error with an HTTP-ish status code so the server
// can ack the originating message accordingly. No I/O, no framework imports, no
// PartyKit internals — easy to unit-test in isolation.

import type {
  ScoreEntry,
  StandardGameSettings,
  TeamScoreEntry,
  WireCard,
} from "../../src/lib/game-types"
import type { SessionEvent } from "../protocol"
import type { RoomPlayer, RoomState, StoredVote } from "../state"
import type { StoredCard } from "../wire-card"

export type ReducerError = { ok: false; error: string; code: number }
export type ReducerOk<TExtra = undefined> = {
  ok: true
  state: RoomState
  events: SessionEvent[]
  extra?: TExtra
}
export type ReducerResult<TExtra = undefined> = ReducerOk<TExtra> | ReducerError
export const MAX_PLAYERS_PER_ROOM = 40

// ─── Lobby actions ───────────────────────────────────────────────────────────

export function applyJoin(
  state: RoomState,
  input: { playerId: string; playerName: string; avatar?: string; teamId?: string },
): ReducerResult<{ player: RoomPlayer }> {
  // Idempotency FIRST: a player that already exists is always accepted, even
  // mid-game. This lets the host register-as-player idempotently on reconnect,
  // and lets regular players reconnect without a new join event.
  const existing = state.players.find((p) => p.playerId === input.playerId)
  if (existing) {
    return { ok: true, state, events: [], extra: { player: existing } }
  }

  if (state.status === "active") return { ok: false, error: "Game already started", code: 409 }
  if (state.status === "finished") return { ok: false, error: "Game already finished", code: 409 }
  if (state.players.length >= MAX_PLAYERS_PER_ROOM) {
    return { ok: false, error: "Room is full", code: 409 }
  }
  // Classic + battle-royale don't use teams.
  if (state.gameMode !== "highlow" && input.teamId) {
    return { ok: false, error: "Teams are only available in Mniej więcej", code: 400 }
  }

  // HighLow players belong to a team; resolve the name from the teams array
  // (which the host populated via applyHighLowSetup before players join).
  let teamId: string | null = null
  let teamName: string | null = null
  if (state.gameMode === 'highlow' && input.teamId) {
    const team = state.teams.find((t) => t.teamId === input.teamId)
    if (!team) return { ok: false, error: 'Team not found', code: 400 }
    teamId = team.teamId
    teamName = team.teamName
  }

  const allocatedName = allocatePlayerName(input.playerName, state.players)
  const player: RoomPlayer = {
    playerId: input.playerId,
    playerName: allocatedName,
    avatar: input.avatar ?? "default.png",
    teamId,
    teamName,
    joinedAt: Date.now(),
  }

  return {
    ok: true,
    state: { ...state, players: [...state.players, player] },
    events: [
      {
        event: "player-joined",
        data: {
          playerId: player.playerId,
          playerName: player.playerName,
          avatar: player.avatar,
          teamId: player.teamId,
          teamName: player.teamName,
        },
      },
    ],
    extra: { player },
  }
}

export function applyLeave(state: RoomState, input: { playerId: string }): ReducerResult {
  const exists = state.players.some((p) => p.playerId === input.playerId)
  if (!exists) return { ok: true, state, events: [] }
  return {
    ok: true,
    state: { ...state, players: state.players.filter((p) => p.playerId !== input.playerId) },
    events: [{ event: "player-left", data: { playerId: input.playerId } }],
  }
}

// ─── Host actions ────────────────────────────────────────────────────────────

export function applyStart(
  state: RoomState,
  input: { card: WireCard; deck?: StoredCard[]; settings?: StandardGameSettings },
): ReducerResult {
  if (state.status === "active") return { ok: false, error: "Game already started", code: 409 }
  if (state.status === "finished") return { ok: false, error: "Game already finished", code: 409 }

  const cardStartedAt = Date.now()
  const deck = input.deck ?? [input.card as StoredCard]

  return {
    ok: true,
    state: {
      ...state,
      status: "active",
      cardIndex: 0,
      currentCard: input.card,
      currentCardStartedAt: cardStartedAt,
      deck,
      votes: [],
      currentReveal: undefined,
      settings: input.settings,
    },
    events: [
      {
        event: "game-started",
        data: {
          cardIndex: 0,
          cardStartedAt,
          card: input.card,
          settings: input.settings,
        },
      },
    ],
  }
}

export function applyReveal(
  state: RoomState,
  input: {
    cardIndex: number
    correctAnswer?: string
    votes: StoredVote[]
    scores: ScoreEntry[]
    teamScores: TeamScoreEntry[]
  },
): ReducerResult {
  const revealStartedAt = Date.now()
  return {
    ok: true,
    state: {
      ...state,
      scores: input.scores,
      teamScores: input.teamScores,
      currentReveal: {
        cardIndex: input.cardIndex,
        revealStartedAt,
        correctAnswer: input.correctAnswer,
        votes: input.votes,
      },
    },
    events: [
      {
        event: "votes-revealed",
        data: {
          cardIndex: input.cardIndex,
          revealStartedAt,
          correctAnswer: input.correctAnswer,
          votes: input.votes,
          scores: input.scores,
          teamScores: input.teamScores,
        },
      },
    ],
  }
}

export function applyNextCard(
  state: RoomState,
  input: { cardIndex: number; card?: WireCard },
): ReducerResult {
  const card = state.deck?.[input.cardIndex] ?? input.card
  if (!card) return { ok: false, error: "No card available for this index", code: 400 }
  const cardStartedAt = Date.now()
  return {
    ok: true,
    state: {
      ...state,
      cardIndex: input.cardIndex,
      currentCard: card,
      currentCardStartedAt: cardStartedAt,
      votes: [],
      currentReveal: undefined,
    },
    events: [
      {
        event: "next-card",
        data: {
          cardIndex: input.cardIndex,
          cardStartedAt,
          card,
          settings: state.settings,
        },
      },
    ],
  }
}

export function applyFinish(
  state: RoomState,
  input: { scores: ScoreEntry[]; teamScores: TeamScoreEntry[]; showPlayerPoints?: boolean },
): ReducerResult {
  return {
    ok: true,
    state: {
      ...state,
      status: "finished",
      votes: [],
      scores: input.scores,
      teamScores: input.teamScores,
    },
    events: [
      {
        event: "game-finished",
        data: {
          scores: input.scores,
          teamScores: input.teamScores,
          showPlayerPoints: input.showPlayerPoints !== false,
        },
      },
    ],
  }
}

// ─── Player actions ──────────────────────────────────────────────────────────

export function applyVote(
  state: RoomState,
  input: { playerId: string; cardIndex: number; answerIndex: number; answerText: string },
): ReducerResult {
  const player = state.players.find((p) => p.playerId === input.playerId)
  if (!player) return { ok: false, error: "Not a player in this session", code: 403 }
  if (state.status !== "active") {
    return { ok: false, error: "Game is not active", code: 409 }
  }
  if (input.cardIndex !== state.cardIndex) {
    return { ok: false, error: "Stale card vote", code: 409 }
  }
  if (state.currentReveal?.cardIndex === input.cardIndex) {
    return { ok: false, error: "Card already revealed", code: 409 }
  }

  const vote: StoredVote = {
    playerId: player.playerId,
    playerName: player.playerName,
    teamId: player.teamId,
    teamName: player.teamName,
    cardIndex: input.cardIndex,
    answerIndex: input.answerIndex,
    answerText: input.answerText,
  }

  // Upsert vote for the current card by this player; drop any vote from a
  // player no longer in the session (e.g. left mid-card).
  const activeIds = new Set(state.players.map((p) => p.playerId))
  const newVotes = [
    ...state.votes.filter(
      (v) =>
        v.cardIndex === input.cardIndex &&
        v.playerId !== input.playerId &&
        activeIds.has(v.playerId),
    ),
    vote,
  ]

  return {
    ok: true,
    state: { ...state, votes: newVotes },
    events: [{ event: "vote-cast", data: vote }],
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function allocatePlayerName(requested: string, players: RoomPlayer[]): string {
  const normalize = (name: string) => name.trim().replace(/\s+/g, " ").toLocaleLowerCase("pl-PL")
  const used = new Set(players.map((p) => normalize(p.playerName)))
  if (!used.has(normalize(requested))) return requested
  for (let i = 2; i < 1000; i++) {
    const candidate = `${requested} (${i})`
    if (!used.has(normalize(candidate))) return candidate
  }
  return `${requested} (${Date.now().toString(36)})`
}
