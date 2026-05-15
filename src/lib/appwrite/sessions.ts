// Server-only: uses APPWRITE_API_KEY. Do not import in client components.
import {
  getTablesDB,
  ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_TABLE_GAME_SESSIONS,
} from "./server";
import type { SessionData } from "@/lib/redis";
import { AppwriteException, Models } from "node-appwrite";

// ─── Status mapping ──────────────────────────────────────────────────────────
// Redis uses "active"; the Appwrite enum column uses "playing" (created in
// setup script). Map transparently so callers see the Redis shape.

type AppwriteStatus = "waiting" | "playing" | "finished";

function toAppwriteStatus(s: SessionData["status"]): AppwriteStatus {
  return s === "active" ? "playing" : s;
}

function fromAppwriteStatus(s: AppwriteStatus): SessionData["status"] {
  return s === "playing" ? "active" : s;
}

// ─── Row shape ───────────────────────────────────────────────────────────────
// Matches the columns created by scripts/appwrite-setup.ts.
// `state` is the canonical JSON blob; other columns are denormalised
// for querying and Realtime filtering.

export type SessionRow = Models.Row & {
  pin: string;
  hostId: string; // stores hostName for now (until NextAuth↔Appwrite phase)
  players: string; // JSON array of SessionPlayer
  state: string; // full SessionData JSON (source of truth)
  status: AppwriteStatus;
  updatedAt: string;
  // Optional in TS because saveSession deliberately omits it (preserved by
  // Appwrite's PATCH semantics on update; column default "[]" on create).
  events?: string; // JSON array of {seq,type,payload,ts} — Realtime broadcast channel
};

// ─── Deserialise ─────────────────────────────────────────────────────────────

function rowToSession(row: SessionRow): SessionData {
  // Parse the canonical JSON blob — it has every field, including ones not
  // stored in dedicated columns (votes, teams, cardIndex, etc.)
  const data = JSON.parse(row.state) as SessionData;
  // The `status` column is the authoritative value (written correctly on every
  // save); always override what's in the blob to handle legacy data.
  data.status = fromAppwriteStatus(row.status);
  return data;
}

// ─── Public API (mirrors lib/redis.ts) ───────────────────────────────────────

/**
 * Fetch a session by PIN.
 * Uses the PIN directly as the Appwrite row `$id` — O(1) primary key lookup,
 * no Query.equal needed.
 */
export async function getSession(pin: string): Promise<SessionData | null> {
  try {
    const db = getTablesDB();
    const row = await db.getRow<SessionRow>(
      APPWRITE_DATABASE_ID,
      APPWRITE_TABLE_GAME_SESSIONS,
      pin,
    );
    return rowToSession(row);
  } catch (err) {
    if (err instanceof AppwriteException && err.code === 404) return null;
    throw err;
  }
}

/**
 * Persist a session. Uses the PIN as the row ID so the call is idempotent:
 * create on first call, update-or-create on subsequent calls.
 */
export async function saveSession(data: SessionData): Promise<void> {
  const db = getTablesDB();
  const status = toAppwriteStatus(data.status);
  // We deliberately omit `events` here — it's owned by triggerGameEvent
  // (per-row Realtime broadcast). Appwrite updateRow does PATCH semantics,
  // so omitted columns are preserved. On createRow, `events` falls back to
  // its column default ("[]" set in scripts/appwrite-setup.ts).
  const rowData = {
    pin: data.pin,
    // hostName stored in hostId until NextAuth↔Appwrite integration
    hostId: data.hostName ?? "host",
    players: JSON.stringify(data.players ?? []),
    state: JSON.stringify(data),
    status,
    updatedAt: new Date().toISOString(),
  };

  try {
    // Attempt update first (row already exists for this PIN)
    await db.updateRow<SessionRow>(
      APPWRITE_DATABASE_ID,
      APPWRITE_TABLE_GAME_SESSIONS,
      data.pin,
      rowData,
    );
  } catch (err) {
    if (err instanceof AppwriteException && err.code === 404) {
      // First save for this PIN — create the row, using pin as the stable ID
      await db.createRow<SessionRow>(
        APPWRITE_DATABASE_ID,
        APPWRITE_TABLE_GAME_SESSIONS,
        ID.custom(data.pin),
        rowData,
      );
    } else {
      throw err;
    }
  }
}

/**
 * Patch a session. Equivalent to Redis `updateSession`.
 */
export async function updateSession(
  pin: string,
  patch: Partial<Omit<SessionData, "pin">>,
): Promise<SessionData | null> {
  const existing = await getSession(pin);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  await saveSession(updated);
  return updated;
}

/**
 * Check if a session row already exists for `pin`.
 * Replaces the `redis.exists(sessionKey(pin))` check in sessions/route.ts.
 */
export async function checkPinExists(pin: string): Promise<boolean> {
  return (await getSession(pin)) !== null;
}
