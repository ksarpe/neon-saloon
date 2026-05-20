// Server-only module: imports node-appwrite (Node-only) and reads APPWRITE_API_KEY.
// Importing this from a client component will surface as a build/runtime error.
import { Client, ID, TablesDB } from 'node-appwrite'

// ─── Singleton ──────────────────────────────────────────────────────────────
// One Client per process; the API key bypasses row-level permissions, so
// anything routed through here has full read/write to the project's tables.

let clientInstance: Client | null = null

function getServerClient(): Client {
  if (!clientInstance) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
    const apiKey = process.env.APPWRITE_API_KEY

    if (!endpoint || !projectId || !apiKey) {
      throw new Error(
        'Appwrite server env missing: NEXT_PUBLIC_APPWRITE_ENDPOINT, NEXT_PUBLIC_APPWRITE_PROJECT_ID, APPWRITE_API_KEY'
      )
    }

    clientInstance = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey)
  }
  return clientInstance
}

let tablesDbInstance: TablesDB | null = null

export function getTablesDB(): TablesDB {
  if (!tablesDbInstance) tablesDbInstance = new TablesDB(getServerClient())
  return tablesDbInstance
}

// ─── Resource IDs ───────────────────────────────────────────────────────────
// Read once at module load — these come from .env.local and must match the
// values used by scripts/appwrite-setup.ts.

export const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? 'lastrodeo'
export const APPWRITE_TABLE_GAME_SESSIONS =
  process.env.NEXT_PUBLIC_APPWRITE_TABLE_GAME_SESSIONS ?? 'game-sessions'
export const APPWRITE_TABLE_GAME_EVENTS =
  process.env.NEXT_PUBLIC_APPWRITE_TABLE_GAME_EVENTS ?? 'game-events'

// Re-export ID so callers don't need a separate node-appwrite import
export { ID }
