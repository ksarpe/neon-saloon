// Central re-export of all game event types.
// Canonical definitions live in appwrite/realtime.ts — import type is safe
// for client components (TypeScript strips type-only imports at build time).

export type {
  WireCard,
  ScoreEntry,
  TeamScoreEntry,
  PlayerJoinedPayload,
  PlayerLeftPayload,
  TeamCreatedPayload,
  TeamUpdatedPayload,
  VoteCastPayload,
  VotesRevealedPayload,
  NextCardPayload,
  GameStartedPayload,
  GameFinishedPayload,
  HighLowRoundStartPayload,
  HighLowNumberSubmittedPayload,
  HighLowRoundResultPayload,
  BRRoundStartPayload,
  BRAnswerSubmittedPayload,
  BRRoundRevealPayload,
  BRGameOverPayload,
  SessionEvent,
} from '@/lib/appwrite/realtime'

import type {
  PlayerJoinedPayload,
  PlayerLeftPayload,
  TeamCreatedPayload,
  TeamUpdatedPayload,
  VoteCastPayload,
  VotesRevealedPayload,
  NextCardPayload,
  GameStartedPayload,
  GameFinishedPayload,
  HighLowRoundStartPayload,
  HighLowNumberSubmittedPayload,
  HighLowRoundResultPayload,
  BRRoundStartPayload,
  BRAnswerSubmittedPayload,
  BRRoundRevealPayload,
  BRGameOverPayload,
} from '@/lib/appwrite/realtime'

// ─── Handler interface ────────────────────────────────────────────────────────
// Passed to useRealtimeGame — each handler is optional.

export interface GameSocketHandlers {
  onPlayerJoined?: (data: PlayerJoinedPayload) => void
  onPlayerLeft?: (data: PlayerLeftPayload) => void
  onTeamCreated?: (data: TeamCreatedPayload) => void
  onTeamUpdated?: (data: TeamUpdatedPayload) => void
  onVoteCast?: (data: VoteCastPayload) => void
  onVotesRevealed?: (data: VotesRevealedPayload) => void
  onNextCard?: (data: NextCardPayload) => void
  onGameStarted?: (data: GameStartedPayload) => void
  onGameFinished?: (data: GameFinishedPayload) => void
  onHighLowRoundStart?: (data: HighLowRoundStartPayload) => void
  onHighLowNumberSubmitted?: (data: HighLowNumberSubmittedPayload) => void
  onHighLowRoundResult?: (data: HighLowRoundResultPayload) => void
  onBRRoundStart?: (data: BRRoundStartPayload) => void
  onBRAnswerSubmitted?: (data: BRAnswerSubmittedPayload) => void
  onBRRoundReveal?: (data: BRRoundRevealPayload) => void
  onBRGameOver?: (data: BRGameOverPayload) => void
}
