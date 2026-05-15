// Flag-aware session store wrapper.
//
// Controlled by the same NEXT_PUBLIC_USE_APPWRITE_REALTIME flag as the
// realtime transport — when Appwrite Realtime is on, the game state should
// also live in Appwrite so Realtime subscriptions on `game-sessions` reflect
// live mutations. The flag is baked in at build time (NEXT_PUBLIC_* env).
//
// false → Redis (Upstash, existing behaviour)
// true  → Appwrite game-sessions table

import {
  getSession as redisGetSession,
  saveSession as redisSaveSession,
  updateSession as redisUpdateSession,
} from "@/lib/redis";

import {
  getSession as appwriteGetSession,
  saveSession as appwriteSaveSession,
  updateSession as appwriteUpdateSession,
  checkPinExists as appwriteCheckPinExists,
} from "@/lib/appwrite/sessions";

import type { SessionData } from "@/lib/redis";

const USE_APPWRITE =
  process.env.NEXT_PUBLIC_USE_APPWRITE_REALTIME === "true";

export const getSession: (pin: string) => Promise<SessionData | null> =
  USE_APPWRITE ? appwriteGetSession : redisGetSession;

export const saveSession: (data: SessionData) => Promise<void> =
  USE_APPWRITE ? appwriteSaveSession : redisSaveSession;

export const updateSession: (
  pin: string,
  patch: Partial<Omit<SessionData, "pin">>
) => Promise<SessionData | null> =
  USE_APPWRITE ? appwriteUpdateSession : redisUpdateSession;

/**
 * PIN uniqueness check — replaces `redis.exists(sessionKey(pin))`.
 * In Redis mode falls back to getSession (same cost as before).
 */
export async function checkPinExists(pin: string): Promise<boolean> {
  if (USE_APPWRITE) return appwriteCheckPinExists(pin);
  return (await redisGetSession(pin)) !== null;
}

// Re-export the SessionData type so route files can import from one place
export type { SessionData } from "@/lib/redis";
