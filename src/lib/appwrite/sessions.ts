// Server-only: uses APPWRITE_API_KEY. Do not import in client components.
import { Query } from 'node-appwrite'

import { APPWRITE_DATABASE_ID, APPWRITE_TABLE_GAME_SESSIONS, getTablesDB, ID } from './server'

// ─── Session types ────────────────────────────────────────────────────────────

export type SessionPlayer = {
  playerId: string
  playerSecretHash?: string
  playerName: string
  avatar: string
  teamId: string | null
  teamName: string | null
}

export type SessionTeam = {
  teamId: string
  teamName: string
  color: string
  emoji: string
}

export type SessionStatus = 'waiting' | 'active' | 'finished'

export type SessionVote = {
  playerId: string
  playerName: string
  teamId: string | null
  teamName: string | null
  cardIndex: number
  answerIndex: number
  answerText: string
}

export type HighLowSessionData = {
  questionIndex: number
  guessingTeamId: string
  votingTeamId: string
  guessingCaptainId: string
  votingCaptainId: string
  currentNumber?: string
}

export type BRAnswer = {
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
  questionIndex: number
  eliminatedPlayers: string[] // playerIds eliminated so far
  roundAnswers: BRAnswer[] // answers for the current round (cleared each round)
  timerDuration: number // seconds (default 20)
  roundStartTime?: number // ms epoch when round started
}

export type SessionData = {
  pin: string
  hostSecretHash?: string
  hostName: string
  status: SessionStatus
  createdAt: number
  players: SessionPlayer[]
  teams: SessionTeam[]
  cardIndex: number
  votes: SessionVote[]
  gameMode?: string
  highlowData?: HighLowSessionData
  battleRoyaleData?: BattleRoyaleData
}
import { AppwriteException, Models } from 'node-appwrite'

const DEFAULT_SESSION_TTL_HOURS = 24

// ─── Status mapping ──────────────────────────────────────────────────────────
// SessionData uses "active"; the Appwrite enum column uses "playing".
// Map transparently so callers always see SessionStatus values.

type AppwriteStatus = 'waiting' | 'playing' | 'finished'

function toAppwriteStatus(s: SessionData['status']): AppwriteStatus {
  return s === 'active' ? 'playing' : s
}

function fromAppwriteStatus(s: AppwriteStatus): SessionData['status'] {
  return s === 'playing' ? 'active' : s
}

// ─── Row shape ───────────────────────────────────────────────────────────────
// Matches the columns created by scripts/appwrite-setup.ts.
// `state` is the canonical JSON blob; other columns are denormalised
// for querying and Realtime filtering.

export type SessionRow = Models.Row & {
  pin: string
  hostId: string // stores hostName for now (until NextAuth↔Appwrite phase)
  players: string // JSON array of SessionPlayer
  state: string // full SessionData JSON (source of truth)
  status: AppwriteStatus
  updatedAt: string
  // Optional in TS because saveSession deliberately omits it (preserved by
  // Appwrite's PATCH semantics on update; column default "[]" on create).
  events?: string // JSON array of {seq,type,payload,ts} — Realtime broadcast channel
}

// ─── Deserialise ─────────────────────────────────────────────────────────────

function rowToSession(row: SessionRow): SessionData {
  // Parse the canonical JSON blob — it has every field, including ones not
  // stored in dedicated columns (votes, teams, cardIndex, etc.)
  const data = JSON.parse(row.state) as SessionData
  // The `status` column is the authoritative value (written correctly on every
  // save); always override what's in the blob to handle legacy data.
  data.status = fromAppwriteStatus(row.status)
  return data
}

function buildSessionRowData(data: SessionData) {
  const status = toAppwriteStatus(data.status)

  return {
    pin: data.pin,
    // hostName stored in hostId until NextAuth-Appwrite integration
    hostId: data.hostName ?? 'host',
    players: JSON.stringify(data.players ?? []),
    state: JSON.stringify(data),
    status,
    updatedAt: new Date().toISOString(),
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch a session by PIN.
 * Uses the PIN directly as the Appwrite row `$id` — O(1) primary key lookup.
 */
export async function getSession(pin: string): Promise<SessionData | null> {
  try {
    const db = getTablesDB()
    const row = await db.getRow<SessionRow>(APPWRITE_DATABASE_ID, APPWRITE_TABLE_GAME_SESSIONS, pin)
    return rowToSession(row)
  } catch (err) {
    if (err instanceof AppwriteException && err.code === 404) return null
    throw err
  }
}

/**
 * Create a new session row. Returns false when the PIN already exists.
 */
export async function createSession(data: SessionData): Promise<boolean> {
  const db = getTablesDB()

  try {
    await db.createRow<SessionRow>(
      APPWRITE_DATABASE_ID,
      APPWRITE_TABLE_GAME_SESSIONS,
      ID.custom(data.pin),
      buildSessionRowData(data)
    )
    return true
  } catch (err) {
    if (err instanceof AppwriteException && err.code === 409) return false
    throw err
  }
}

/**
 * Delete stale session rows so abandoned lobbies and finished games do not
 * accumulate forever in Appwrite. Uses updatedAt, so active sessions are kept
 * alive by normal game writes.
 */
export async function cleanupOldSessions(options?: {
  ttlHours?: number
  maxRows?: number
}): Promise<number> {
  const ttlHours = options?.ttlHours ?? getSessionTtlHours()
  const maxRows = options?.maxRows ?? 25
  const cutoff = new Date(Date.now() - ttlHours * 60 * 60 * 1000).toISOString()
  const db = getTablesDB()

  const rows = await db.listRows<SessionRow>(APPWRITE_DATABASE_ID, APPWRITE_TABLE_GAME_SESSIONS, [
    Query.lessThan('updatedAt', cutoff),
    Query.orderAsc('updatedAt'),
    Query.limit(maxRows),
  ])

  let deleted = 0
  for (const row of rows.rows) {
    try {
      await db.deleteRow(APPWRITE_DATABASE_ID, APPWRITE_TABLE_GAME_SESSIONS, row.$id)
      deleted += 1
    } catch (err) {
      if (!(err instanceof AppwriteException && err.code === 404)) throw err
    }
  }

  return deleted
}

/**
 * Persist a session. Uses the PIN as the row ID so the call is idempotent:
 * create on first call, update-or-create on subsequent calls.
 */
export async function saveSession(data: SessionData): Promise<void> {
  const db = getTablesDB()
  const rowData = buildSessionRowData(data)
  // We deliberately omit `events` here — it's owned by triggerGameEvent
  // (per-row Realtime broadcast). Appwrite updateRow does PATCH semantics,
  // so omitted columns are preserved. On createRow, `events` falls back to
  // its column default ("[]" set in scripts/appwrite-setup.ts).
  try {
    // Attempt update first (row already exists for this PIN)
    await db.updateRow<SessionRow>(
      APPWRITE_DATABASE_ID,
      APPWRITE_TABLE_GAME_SESSIONS,
      data.pin,
      rowData
    )
  } catch (err) {
    if (err instanceof AppwriteException && err.code === 404) {
      // First save for this PIN — create the row, using pin as the stable ID
      await db.createRow<SessionRow>(
        APPWRITE_DATABASE_ID,
        APPWRITE_TABLE_GAME_SESSIONS,
        ID.custom(data.pin),
        rowData
      )
    } else {
      throw err
    }
  }
}

/**
 * Patch a session (read-merge-write).
 */
export async function updateSession(
  pin: string,
  patch: Partial<Omit<SessionData, 'pin'>>
): Promise<SessionData | null> {
  const existing = await getSession(pin)
  if (!existing) return null
  const updated = { ...existing, ...patch }
  await saveSession(updated)
  return updated
}

/**
 * Check if a session row already exists for `pin`.
 */
export async function checkPinExists(pin: string): Promise<boolean> {
  return (await getSession(pin)) !== null
}

function getSessionTtlHours() {
  const value = Number(process.env.APPWRITE_SESSION_TTL_HOURS)
  if (Number.isFinite(value) && value >= 1 && value <= 168) return value
  return DEFAULT_SESSION_TTL_HOURS
}
