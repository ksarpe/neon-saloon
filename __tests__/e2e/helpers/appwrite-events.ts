// Reads the *broadcast event stream* of a game session straight from Appwrite.
//
// The server appends every realtime event to the `events` column of the
// session's row in `game-sessions` (see src/lib/appwrite/realtime.ts). The
// browser client subscribes to that column and dispatches the entries. So the
// events column IS the broadcast channel — reading it lets a test verify that
// every player action produced a correct, non-lost event, which is exactly what
// matters when many players act at once.
//
// Creds are read from .env.local / .env (the same file the dev server uses), so
// the test needs no extra setup. If they are missing the spec skips itself.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type StoredEvent = {
  seq: number;
  type: string;
  payload: unknown;
  ts: string;
};

type AppwriteEnv = {
  endpoint: string;
  projectId: string;
  apiKey: string;
  databaseId: string;
  tableId: string;
};

function parseEnvFile(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  if (!existsSync(path)) return out;

  for (const rawLine of readFileSync(path, "utf8").split("\n")) {
    const line = rawLine.replace(/\r$/, "").trim();
    if (!line || line.startsWith("#")) continue;

    const eq = line.indexOf("=");
    if (eq === -1) continue;

    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && !(key in out)) out[key] = value;
  }

  return out;
}

let cachedEnv: AppwriteEnv | null | undefined;

function loadAppwriteEnv(): AppwriteEnv | null {
  if (cachedEnv !== undefined) return cachedEnv;

  const root = process.cwd();
  // .env.local wins over .env, matching Next.js precedence; process.env wins overall.
  const merged = {
    ...parseEnvFile(join(root, ".env")),
    ...parseEnvFile(join(root, ".env.local")),
    ...process.env,
  } as Record<string, string>;

  const endpoint = merged.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = merged.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = merged.APPWRITE_API_KEY;
  const databaseId = merged.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? "lastrodeo";
  const tableId = merged.NEXT_PUBLIC_APPWRITE_TABLE_GAME_SESSIONS ?? "game-sessions";

  if (!endpoint || !projectId || !apiKey) {
    cachedEnv = null;
    return null;
  }

  cachedEnv = { endpoint: endpoint.replace(/\/$/, ""), projectId, apiKey, databaseId, tableId };
  return cachedEnv;
}

/** True when Appwrite creds are available, i.e. the realtime spec can run. */
export function appwriteEventsConfigured(): boolean {
  return loadAppwriteEnv() !== null;
}

/**
 * Read the broadcast event stream for a session, ordered by seq.
 * Returns [] if the row no longer exists (e.g. finished + cleaned up).
 */
export async function fetchSessionEvents(pin: string): Promise<StoredEvent[]> {
  const env = loadAppwriteEnv();
  if (!env) throw new Error("Appwrite env not configured (NEXT_PUBLIC_APPWRITE_* / APPWRITE_API_KEY)");

  const url = `${env.endpoint}/tablesdb/${env.databaseId}/tables/${env.tableId}/rows/${pin}`;
  const res = await fetch(url, {
    headers: {
      "content-type": "application/json",
      "X-Appwrite-Project": env.projectId,
      "X-Appwrite-Key": env.apiKey,
    },
  });

  if (res.status === 404) return [];
  if (!res.ok) {
    throw new Error(`fetchSessionEvents(${pin}) failed: ${res.status} ${await res.text()}`);
  }

  const row = (await res.json()) as { events?: string };
  const events = JSON.parse(row.events ?? "[]") as StoredEvent[];
  return [...events].sort((a, b) => a.seq - b.seq);
}

export function eventsOfType(events: StoredEvent[], type: string): StoredEvent[] {
  return events.filter((event) => event.type === type);
}

/**
 * Poll until the session's event stream contains at least `count` events of
 * `type`, or the timeout elapses. Returns the final event list either way so
 * the caller can assert on it (and get a useful diff on failure).
 */
export async function waitForEvents(
  pin: string,
  type: string,
  count: number,
  opts?: { timeoutMs?: number; intervalMs?: number },
): Promise<StoredEvent[]> {
  const timeoutMs = opts?.timeoutMs ?? 8000;
  const intervalMs = opts?.intervalMs ?? 200;
  const deadline = Date.now() + timeoutMs;

  let events = await fetchSessionEvents(pin);
  while (eventsOfType(events, type).length < count && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    events = await fetchSessionEvents(pin);
  }

  return events;
}
