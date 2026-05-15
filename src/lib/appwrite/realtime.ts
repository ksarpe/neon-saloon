// Server-only: re-exports server.ts which uses APPWRITE_API_KEY.
import {
  getTablesDB,
  APPWRITE_DATABASE_ID,
  APPWRITE_TABLE_GAME_SESSIONS,
} from "./server";
import { AppwriteException } from "node-appwrite";
import type { SessionEvent } from "@/lib/pusher-server";
import type { SessionRow } from "./sessions";

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
//   • Race on concurrent triggerGameEvent for same pin: read-append-write is
//     not atomic, last writer wins, one event broadcast may be lost. State
//     mutations via saveSession are unaffected (different field). Acceptable
//     for a party game; if it becomes a problem, move to PartyKit.
//   • Bounded array (kept to last EVENTS_KEEP entries) so the column doesn't
//     grow unbounded for long-running sessions.

const EVENTS_KEEP = 50;

type StoredEvent = {
  seq: number;
  type: string;
  payload: unknown;
  ts: string;
};

/**
 * Append an event to the session's `events` array on the `game-sessions` row.
 * Subscribers to the per-row Realtime channel receive the row update and
 * dispatch the new event(s) to their handlers.
 */
export async function triggerGameEvent(
  pin: string,
  event: SessionEvent
): Promise<void> {
  const db = getTablesDB();

  // Read current events to compute the next seq number and preserve history
  let existing: StoredEvent[] = [];
  try {
    const row = await db.getRow<SessionRow>(
      APPWRITE_DATABASE_ID,
      APPWRITE_TABLE_GAME_SESSIONS,
      pin
    );
    existing = JSON.parse(row.events ?? "[]") as StoredEvent[];
  } catch (err) {
    if (err instanceof AppwriteException && err.code === 404) {
      // Row doesn't exist yet — host hasn't created the session, or it was
      // deleted. Nothing to broadcast to; silently no-op.
      console.warn(`[Appwrite RT] triggerGameEvent: row ${pin} not found, skipping`);
      return;
    }
    throw err;
  }

  const nextSeq =
    existing.length > 0 ? Math.max(...existing.map((e) => e.seq)) + 1 : 0;

  const next: StoredEvent = {
    seq: nextSeq,
    type: event.event,
    payload: event.data,
    ts: new Date().toISOString(),
  };

  const updated = [...existing, next].slice(-EVENTS_KEEP);

  await db.updateRow<SessionRow>(
    APPWRITE_DATABASE_ID,
    APPWRITE_TABLE_GAME_SESSIONS,
    pin,
    {
      events: JSON.stringify(updated),
      updatedAt: next.ts,
    }
  );
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
      { events: "[]" }
    );
  } catch (err) {
    if (err instanceof AppwriteException && err.code === 404) return;
    console.warn(`[Appwrite] cleanupSessionEvents(${pin}) failed:`, err);
  }
}

// Re-export for symmetry with pusher-server.ts
export { sessionChannel } from "@/lib/pusher-shared";
export type { SessionEvent } from "@/lib/pusher-server";
