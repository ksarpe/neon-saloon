// Server-only wrapper: re-exports a Pusher or Appwrite trigger based on env flag.
import { triggerSessionEvent as pusherTrigger } from "@/lib/pusher-server";
import {
  triggerGameEvent as appwriteTrigger,
  cleanupSessionEvents as appwriteCleanup,
} from "@/lib/appwrite/realtime";
import type { SessionEvent } from "@/lib/pusher-server";

/**
 * Flag-aware server-side event trigger.
 *
 * Both impls are imported but only one is wired in at module load. Each impl
 * lazily initializes its own SDK on first call (singletons inside), so the
 * unused backend never connects.
 *
 * Flip `NEXT_PUBLIC_USE_APPWRITE_REALTIME=true` in `.env.local` to switch.
 * The env value is captured once at server start; restart `next dev` after a
 * change.
 */
const USE_APPWRITE =
  process.env.NEXT_PUBLIC_USE_APPWRITE_REALTIME === "true";

export const triggerGameEvent: (
  pin: string,
  event: SessionEvent
) => Promise<void> = USE_APPWRITE ? appwriteTrigger : pusherTrigger;

/**
 * Delete all game-events rows for a session when the game finishes.
 * No-op in Pusher mode. Fire-and-forget safe — errors are swallowed inside.
 */
export async function cleanupSessionEvents(pin: string): Promise<void> {
  if (USE_APPWRITE) return appwriteCleanup(pin);
}

export type { SessionEvent };
export { sessionChannel } from "@/lib/pusher-shared";
