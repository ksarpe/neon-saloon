import Pusher from "pusher";
import { sessionChannel } from "./pusher-shared";

export { sessionChannel };

// ─── Singleton ───────────────────────────────────────────────────────────────

let pusherInstance: Pusher | null = null;

function getPusher(): Pusher {
  if (!pusherInstance) {
    pusherInstance = new Pusher({
      appId: process.env.PUSHER_APP_ID!,
      key: process.env.PUSHER_KEY!,
      secret: process.env.PUSHER_SECRET!,
      cluster: process.env.PUSHER_CLUSTER ?? "eu",
      useTLS: true,
    });
  }
  return pusherInstance;
}

// ─── Shared card shape sent over the wire ─────────────────────────────────────

/** Minimal card data forwarded to players via Pusher so they don't need the full deck */
export type WireCard = {
  id: string;
  type: "QUIZ" | "TEST"
  title: string;
  description: string;
  emoji: string;
  options?: string[]; // Added for A, B, C, D support
};

// ─── Event payloads ──────────────────────────────────────────────────────────

export type PlayerJoinedPayload = {
  playerId: string;
  playerName: string;
  avatar: string;
  teamId: string | null;
  teamName: string | null;
};

export type TeamCreatedPayload = {
  teamId: string;
  teamName: string;
  color: string;
  emoji: string;
};

export type TeamUpdatedPayload = {
  teamId: string;
  teamName: string;
  memberCount: number;
};

export type VoteCastPayload = {
  playerId: string;
  playerName: string;
  teamId: string | null;
  teamName: string | null;
  cardIndex: number;
  answerIndex: number;
  answerText: string;
};

export type VotesRevealedPayload = {
  cardIndex: number;
  votes: Array<{
    playerId: string;
    playerName: string;
    teamId: string | null;
    teamName: string | null;
    answerIndex: number;
    answerText: string;
  }>;
  scores: Array<{ teamId: string; teamName: string; score: number; playerName: string }>;
};

export type NextCardPayload = {
  cardIndex: number;
  card: WireCard; // ← card content piggybacked so players don't need the deck
};

export type GameStartedPayload = {
  cardIndex: number;
  card: WireCard; // ← first card sent with the start signal
};

export type GameFinishedPayload = {
  scores: Array<{ teamId: string; teamName: string; score: number }>;
};

export type SessionEvent =
  | { event: "player-joined"; data: PlayerJoinedPayload }
  | { event: "team-created"; data: TeamCreatedPayload }
  | { event: "team-updated"; data: TeamUpdatedPayload }
  | { event: "vote-cast"; data: VoteCastPayload }
  | { event: "votes-revealed"; data: VotesRevealedPayload }
  | { event: "next-card"; data: NextCardPayload }
  | { event: "game-started"; data: GameStartedPayload }
  | { event: "game-finished"; data: GameFinishedPayload };

// ─── Trigger helper ──────────────────────────────────────────────────────────

export async function triggerSessionEvent(
  pin: string,
  event: SessionEvent
): Promise<void> {
  await getPusher().trigger(sessionChannel(pin), event.event, event.data);
}
