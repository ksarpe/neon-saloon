// Server-only: re-exports server.ts which uses APPWRITE_API_KEY.
import { AppwriteException } from 'node-appwrite'

import { isRetryableAppwriteError } from './retry'
import { APPWRITE_DATABASE_ID, APPWRITE_TABLE_GAME_SESSIONS, getTablesDB } from './server'
import type { SessionRow } from './sessions'

// ─── Per-row Realtime broadcast design ──────────────────────────────────────
//
// Fan-out problem with the old design (one row per event in `game-events`):
// every client of every game subscribed to the whole-table channel and
// filtered by sessionPin client-side. At N concurrent games × M players,
// that's N×M×events broadcast deliveries, even though each delivery is only
// relevant to ~M clients.
//
// New design: append events into the `events` column on the session's row in
// `game-sessions`. Clients subscribe to the row-specific channel
// (`databases.X.tables.Y.rows.{pin}`), so only subscribers of THIS pin
// receive THIS pin's events. Linear in players, not players × games.
//
// Trade-offs:
//   • Event append uses an Appwrite transaction with short retries. Realtime is
//     still treated as the fast signal; REST snapshots are the recovery path
//     for reconnects or dropped websocket messages.
//   • Bounded array (kept to last EVENTS_KEEP entries) so the column doesn't
//     grow unbounded for long-running sessions.

const EVENTS_KEEP = 50
const EVENT_APPEND_ATTEMPTS = 12

type StoredEvent = {
  id: string
  seq: number
  type: string
  payload: unknown
  ts: string
}

function parseStoredEvents(value: string | undefined): StoredEvent[] {
  return JSON.parse(value ?? '[]') as StoredEvent[]
}

function nextStoredEvent(existing: StoredEvent[], event: SessionEvent): StoredEvent {
  return {
    // Unique tag so we can verify our append actually survived (see below).
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`,
    seq: existing.length > 0 ? Math.max(...existing.map((e) => e.seq)) + 1 : 0,
    type: event.event,
    payload: event.data,
    ts: new Date().toISOString(),
  }
}

function isMissingRowError(err: unknown) {
  return err instanceof AppwriteException && err.code === 404
}

function appendBackoff(attempt: number) {
  const cap = Math.min(500, 25 * 2 ** attempt)
  return new Promise((resolve) => setTimeout(resolve, Math.random() * cap)) // full jitter
}

/**
 * Append an event to the session's `events` array on the `game-sessions` row.
 * Subscribers to the per-row Realtime channel receive the row update and
 * dispatch the new event(s) to their handlers.
 *
 * Concurrency note: this is a read-modify-write on a single hot row. Appwrite's
 * transaction does NOT reliably reject a *concurrent* read-modify-write — two
 * writers can each read the same baseline, append their event, and both commit,
 * silently clobbering one of the events (no error thrown, so a plain retry never
 * fires). We therefore tag each event with a unique id and, after committing,
 * re-read the row to confirm our event survived; if it was clobbered we re-read
 * fresh state and try again with jittered backoff. This converges a burst of
 * simultaneous players (e.g. 10 voting at once) without dropping events.
 */
export async function triggerGameEvent(pin: string, event: SessionEvent): Promise<void> {
  const db = getTablesDB()

  for (let attempt = 0; attempt < EVENT_APPEND_ATTEMPTS; attempt++) {
    const transaction = await db.createTransaction()
    const transactionId = transaction.$id
    let appended: StoredEvent

    try {
      const row = await db.getRow<SessionRow>(
        APPWRITE_DATABASE_ID,
        APPWRITE_TABLE_GAME_SESSIONS,
        pin,
        undefined,
        transactionId
      )
      const existing = parseStoredEvents(row.events)
      appended = nextStoredEvent(existing, event)
      const updated = [...existing, appended].slice(-EVENTS_KEEP)

      await db.updateRow<SessionRow>(
        APPWRITE_DATABASE_ID,
        APPWRITE_TABLE_GAME_SESSIONS,
        pin,
        { events: JSON.stringify(updated), updatedAt: appended.ts },
        undefined,
        transactionId
      )

      await db.updateTransaction(transactionId, true)
    } catch (err) {
      try {
        await db.updateTransaction(transactionId, false, true)
      } catch {
        // Ignore rollback errors so callers receive the original failure.
      }

      if (isMissingRowError(err)) {
        // Row does not exist yet, or it was deleted. Nothing to broadcast to.
        console.warn(`[Appwrite RT] triggerGameEvent: row ${pin} not found, skipping`)
        return
      }
      if (!isRetryableAppwriteError(err) || attempt === EVENT_APPEND_ATTEMPTS - 1) throw err
      await appendBackoff(attempt)
      continue
    }

    // Verify our event actually survived a possible concurrent clobber.
    try {
      const check = await db.getRow<SessionRow>(
        APPWRITE_DATABASE_ID,
        APPWRITE_TABLE_GAME_SESSIONS,
        pin
      )
      if (parseStoredEvents(check.events).some((e) => e.id === appended.id)) return
    } catch (err) {
      if (isMissingRowError(err)) return
      // Verify read failed transiently — fall through and retry to be safe.
    }

    if (attempt === EVENT_APPEND_ATTEMPTS - 1) {
      console.warn(
        `[Appwrite RT] event "${event.event}" for ${pin} was clobbered after ${EVENT_APPEND_ATTEMPTS} attempts`
      )
      return
    }
    await appendBackoff(attempt)
  }
}

/**
 * Append events to the session row's `events` column INSIDE an existing
 * transaction (identified by `transactionId`). Used by withSessionTransaction so
 * a player's state change and its broadcast event commit atomically as one unit.
 *
 * This is the concurrency-safe path: because the event rides on the same
 * transaction as the state write, Appwrite conflict-detects them together, and
 * the caller's retry re-runs the whole read-modify-write on fresh state — so a
 * burst of simultaneous players can't clobber each other's events.
 */
export async function appendEventsInTransaction(
  transactionId: string,
  pin: string,
  events: SessionEvent[]
): Promise<void> {
  if (events.length === 0) return

  const db = getTablesDB()
  const row = await db.getRow<SessionRow>(
    APPWRITE_DATABASE_ID,
    APPWRITE_TABLE_GAME_SESSIONS,
    pin,
    undefined,
    transactionId
  )

  let stored = parseStoredEvents(row.events)
  for (const event of events) {
    stored = [...stored, nextStoredEvent(stored, event)]
  }

  await db.updateRow<SessionRow>(
    APPWRITE_DATABASE_ID,
    APPWRITE_TABLE_GAME_SESSIONS,
    pin,
    { events: JSON.stringify(stored.slice(-EVENTS_KEEP)), updatedAt: new Date().toISOString() },
    undefined,
    transactionId
  )
}

/**
 * Clear the events array for a session (called when the game finishes).
 * Stops late-subscribing clients from replaying historical events of a
 * finished game. State (other columns) is preserved.
 */
export async function cleanupSessionEvents(pin: string): Promise<void> {
  try {
    await getTablesDB().updateRow<SessionRow>(
      APPWRITE_DATABASE_ID,
      APPWRITE_TABLE_GAME_SESSIONS,
      pin,
      { events: '[]' }
    )
  } catch (err) {
    if (err instanceof AppwriteException && err.code === 404) return
    console.warn(`[Appwrite] cleanupSessionEvents(${pin}) failed:`, err)
  }
}

// ─── Shared card shape ────────────────────────────────────────────────────────
export type WireCard = {
  id: string
  type: 'QUIZ' | 'TEST' | 'NEVER'
  title?: string
  description: string
  emoji?: string
  options?: string[] // Added for A, B, C, D support
}

// ─── Event payloads ──────────────────────────────────────────────────────────

export type PlayerJoinedPayload = {
  playerId: string
  playerName: string
  avatar: string
  teamId: string | null
  teamName: string | null
}

export type TeamCreatedPayload = {
  teamId: string
  teamName: string
  color: string
  emoji: string
}

export type TeamUpdatedPayload = {
  teamId: string
  teamName: string
  memberCount: number
}

export type VoteCastPayload = {
  playerId: string
  playerName: string
  teamId: string | null
  teamName: string | null
  cardIndex: number
  answerIndex: number
  answerText: string
}

export type ScoreEntry = {
  playerId: string
  playerName: string
  score: number
  drinks?: number
  playerTeamId?: string
  playerTeamName?: string
}

export type TeamScoreEntry = {
  teamId: string
  teamName: string
  score: number
}

export type StandardGameSettings = {
  revealCountdownSeconds: number
  answerTimeLimitSeconds: number
}

export type VotesRevealedPayload = {
  cardIndex: number
  revealStartedAt?: number
  correctAnswer?: string // undefined for NEVER cards (no scoring)
  votes: Array<{
    playerId: string
    playerName: string
    teamId: string | null
    teamName: string | null
    answerIndex: number
    answerText: string
  }>
  scores: ScoreEntry[]
  teamScores: TeamScoreEntry[]
}

export type NextCardPayload = {
  cardIndex: number
  cardStartedAt?: number
  card: WireCard
  settings?: StandardGameSettings
}

export type GameStartedPayload = {
  cardIndex: number
  cardStartedAt?: number
  card: WireCard
  settings?: StandardGameSettings
}

export type GameFinishedPayload = {
  scores: ScoreEntry[]
  teamScores: TeamScoreEntry[]
  showPlayerPoints?: boolean
}

export type PlayerLeftPayload = {
  playerId: string
}

// ─── High-Low event payloads ─────────────────────────────────────────────────

export type HighLowRoundStartPayload = {
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

export type HighLowNumberSubmittedPayload = {
  number: string
}

export type HighLowRoundResultPayload = {
  correctAnswer: number
  unit: string
  guessingTeamGuess: number
  correctVote: 'mniej' | 'wiecej'
  captainVote: 'mniej' | 'wiecej'
  winningTeamId: string
  winningTeamName: string
  scores: ScoreEntry[]
}

// ─── Battle Royale event payloads ────────────────────────────────────────────

export type BRRoundStartPayload = {
  questionIndex: number
  totalQuestions?: number
  questionText: string
  options: string[]
  timerDuration: number
  roundStartTime: number
  alivePlayers: string[] // playerIds still in game
}

export type BRAnswerSubmittedPayload = {
  playerId: string
  playerName: string
}

export type BRAnswerResult = {
  playerId: string
  playerName: string
  avatar: string
  answerIndex: number
  answerText: string
  answeredAt: number
  isCorrect: boolean
  isEliminated: boolean
}

export type BRRoundRevealPayload = {
  questionText: string
  correctAnswer: string
  answers: BRAnswerResult[]
  eliminatedThisRound: string[] // playerIds
  survivingPlayers: string[] // playerIds still alive after this round
  gameOver: boolean
  winner?: string // playerName if only 1 remains
}

export type BRGameOverPayload = {
  winner?: string
  survivingPlayers: string[]
}

export type SessionEvent =
  | { event: 'player-joined'; data: PlayerJoinedPayload }
  | { event: 'player-left'; data: PlayerLeftPayload }
  | { event: 'team-created'; data: TeamCreatedPayload }
  | { event: 'team-updated'; data: TeamUpdatedPayload }
  | { event: 'vote-cast'; data: VoteCastPayload }
  | { event: 'votes-revealed'; data: VotesRevealedPayload }
  | { event: 'next-card'; data: NextCardPayload }
  | { event: 'game-started'; data: GameStartedPayload }
  | { event: 'game-finished'; data: GameFinishedPayload }
  | { event: 'highlow-round-start'; data: HighLowRoundStartPayload }
  | { event: 'highlow-number-submitted'; data: HighLowNumberSubmittedPayload }
  | { event: 'highlow-round-result'; data: HighLowRoundResultPayload }
  | { event: 'br-round-start'; data: BRRoundStartPayload }
  | { event: 'br-answer-submitted'; data: BRAnswerSubmittedPayload }
  | { event: 'br-round-reveal'; data: BRRoundRevealPayload }
  | { event: 'br-game-over'; data: BRGameOverPayload }

export const sessionChannel = (pin: string) => `session-${pin}`
