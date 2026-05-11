import Pusher from "pusher";

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

// ─── Channel naming ──────────────────────────────────────────────────────────

export const sessionChannel = (pin: string) => `session-${pin}`;

// ─── Shared card shape sent over the wire ─────────────────────────────────────

/** Minimal card data forwarded to players via Pusher so they don't need the full deck */
export type WireCard = {
  id: string;
  type: "trivia" | "charades" | "action" | "dare";
  title: string;
  description: string;
  points: number;
  emoji: string;
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
  scores: Array<{ teamId: string; teamName: string; score: number }>;
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
