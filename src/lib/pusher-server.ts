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
  type: "QUIZ" | "TEST" | "NEVER"
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

export type ScoreEntry = {
  playerId: string;
  playerName: string;
  score: number;
  playerTeamId?: string;
  playerTeamName?: string;
};

export type TeamScoreEntry = {
  teamId: string;
  teamName: string;
  score: number;
};

export type VotesRevealedPayload = {
  cardIndex: number;
  correctAnswer?: string; // undefined for NEVER cards (no scoring)
  votes: Array<{
    playerId: string;
    playerName: string;
    teamId: string | null;
    teamName: string | null;
    answerIndex: number;
    answerText: string;
  }>;
  scores: ScoreEntry[];
  teamScores: TeamScoreEntry[];
};

export type NextCardPayload = {
  cardIndex: number;
  card: WireCard;
};

export type GameStartedPayload = {
  cardIndex: number;
  card: WireCard;
};

export type GameFinishedPayload = {
  scores: ScoreEntry[];
  teamScores: TeamScoreEntry[];
};

export type PlayerLeftPayload = {
  playerId: string;
};

// ─── High-Low event payloads ─────────────────────────────────────────────────

export type HighLowRoundStartPayload = {
  roundIndex: number;
  questionText: string;
  questionUnit: string;
  guessingTeamId: string;
  guessingTeamName: string;
  votingTeamId: string;
  votingTeamName: string;
  guessingCaptainId: string;
  votingCaptainId: string;
};

export type HighLowNumberSubmittedPayload = {
  number: string;
};

export type HighLowRoundResultPayload = {
  correctAnswer: number;
  unit: string;
  guessingTeamGuess: number;
  correctVote: "mniej" | "wiecej";
  captainVote: "mniej" | "wiecej";
  winningTeamId: string;
  winningTeamName: string;
  scores: ScoreEntry[];
};

export type SessionEvent =
  | { event: "player-joined"; data: PlayerJoinedPayload }
  | { event: "player-left"; data: PlayerLeftPayload }
  | { event: "team-created"; data: TeamCreatedPayload }
  | { event: "team-updated"; data: TeamUpdatedPayload }
  | { event: "vote-cast"; data: VoteCastPayload }
  | { event: "votes-revealed"; data: VotesRevealedPayload }
  | { event: "next-card"; data: NextCardPayload }
  | { event: "game-started"; data: GameStartedPayload }
  | { event: "game-finished"; data: GameFinishedPayload }
  | { event: "highlow-round-start"; data: HighLowRoundStartPayload }
  | { event: "highlow-number-submitted"; data: HighLowNumberSubmittedPayload }
  | { event: "highlow-round-result"; data: HighLowRoundResultPayload };

// ─── Trigger helper ──────────────────────────────────────────────────────────

export async function triggerSessionEvent(
  pin: string,
  event: SessionEvent
): Promise<void> {
  await getPusher().trigger(sessionChannel(pin), event.event, event.data);
}
