'use client'

import { Account, AppwriteException, Client, TablesDB } from 'appwrite'

// ─── Singleton ──────────────────────────────────────────────────────────────
// One Client per browser tab. Session cookies are managed by the SDK in
// localStorage / browser cookies — survives reloads.

let clientInstance: Client | null = null

export function getAppwriteClient(): Client {
  if (typeof window === 'undefined') {
    throw new Error('getAppwriteClient() must only be called in the browser.')
  }
  if (!clientInstance) {
    clientInstance = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
  }
  return clientInstance
}

let accountInstance: Account | null = null

export function getAccount(): Account {
  if (!accountInstance) accountInstance = new Account(getAppwriteClient())
  return accountInstance
}

let tablesDbInstance: TablesDB | null = null

/**
 * Browser-side TablesDB. Operates as the current Appwrite session
 * (anonymous for guest players). Only methods exposed to that session's
 * permissions will succeed — for `game-sessions`, that's read access.
 */
export function getTablesDB(): TablesDB {
  if (!tablesDbInstance) tablesDbInstance = new TablesDB(getAppwriteClient())
  return tablesDbInstance
}

// ─── Session bootstrap ──────────────────────────────────────────────────────
// Appwrite Realtime requires the client to have *some* session (anonymous or
// user) before subscriptions stay open. Players are guests, so we always
// upgrade them to anonymous. Idempotent: probe `account.get()` first; only
// create a new session when there is none.

let bootstrapPromise: Promise<void> | null = null

export function ensureAnonymousSession(): Promise<void> {
  // De-dupe concurrent callers: many components may mount in the same tick
  // (host page, hooks, etc.) — they should all await the same promise.
  if (bootstrapPromise) return bootstrapPromise

  bootstrapPromise = (async () => {
    const account = getAccount()
    try {
      await account.get()
      // Session already exists (anonymous or user-bound) — nothing to do.
      return
    } catch (err) {
      // 401 = no session; anything else is a real error worth surfacing.
      if (!(err instanceof AppwriteException) || err.code !== 401) {
        bootstrapPromise = null // allow retry on real failures
        throw err
      }
    }
    try {
      await account.createAnonymousSession()
    } catch (err) {
      bootstrapPromise = null
      throw err
    }
  })()

  return bootstrapPromise
}
