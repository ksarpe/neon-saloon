"use client";

import { useEffect, useRef, useCallback } from "react";
import { getPusherClient } from "@/lib/pusher-client";
import { sessionChannel } from "@/lib/pusher-shared";
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
} from "@/lib/pusher-server";

// ─── Event handler map ──────────────────────────────────────────────────────

export interface GameSocketHandlers {
  onPlayerJoined?: (data: PlayerJoinedPayload) => void;
  onPlayerLeft?: (data: PlayerLeftPayload) => void;
  onTeamCreated?: (data: TeamCreatedPayload) => void;
  onTeamUpdated?: (data: TeamUpdatedPayload) => void;
  onVoteCast?: (data: VoteCastPayload) => void;
  onVotesRevealed?: (data: VotesRevealedPayload) => void;
  onNextCard?: (data: NextCardPayload) => void;
  onGameStarted?: (data: GameStartedPayload) => void;
  onGameFinished?: (data: GameFinishedPayload) => void;
  onHighLowRoundStart?: (data: HighLowRoundStartPayload) => void;
  onHighLowNumberSubmitted?: (data: HighLowNumberSubmittedPayload) => void;
  onHighLowRoundResult?: (data: HighLowRoundResultPayload) => void;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

/**
 * Subscribe to all real-time events on `session-{pin}`.
 * Handlers are stable refs — safe to define inline without useMemo.
 */
export function useGameSocket(pin: string | null, handlers: GameSocketHandlers) {
  // Keep handlers in a ref so we can update them without re-subscribing
  const handlersRef = useRef<GameSocketHandlers>(handlers);
  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    if (!pin) return;

    const pusher = getPusherClient();

    pusher.connection.bind("connected", () =>
      console.log("[Pusher] connected")
    );
    pusher.connection.bind("error", (err: unknown) =>
      console.error("[Pusher] connection error", err)
    );

    const channel = pusher.subscribe(sessionChannel(pin));

    channel.bind("pusher:subscription_succeeded", () =>
      console.log(`[Pusher] subscribed to ${sessionChannel(pin)}`)
    );
    channel.bind("pusher:subscription_error", (err: unknown) =>
      console.error(`[Pusher] subscription error`, err)
    );

    channel.bind("player-joined", (data: PlayerJoinedPayload) => {
      console.log("[Pusher] player-joined", data);
      handlersRef.current.onPlayerJoined?.(data);
    });
    channel.bind("player-left", (data: PlayerLeftPayload) =>
      handlersRef.current.onPlayerLeft?.(data)
    );
    channel.bind("team-created", (data: TeamCreatedPayload) =>
      handlersRef.current.onTeamCreated?.(data)
    );
    channel.bind("team-updated", (data: TeamUpdatedPayload) =>
      handlersRef.current.onTeamUpdated?.(data)
    );
    channel.bind("vote-cast", (data: VoteCastPayload) =>
      handlersRef.current.onVoteCast?.(data)
    );
    channel.bind("votes-revealed", (data: VotesRevealedPayload) =>
      handlersRef.current.onVotesRevealed?.(data)
    );
    channel.bind("next-card", (data: NextCardPayload) =>
      handlersRef.current.onNextCard?.(data)
    );
    channel.bind("game-started", (data: GameStartedPayload) =>
      handlersRef.current.onGameStarted?.(data)
    );
    channel.bind("game-finished", (data: GameFinishedPayload) =>
      handlersRef.current.onGameFinished?.(data)
    );
    channel.bind("highlow-round-start", (data: HighLowRoundStartPayload) =>
      handlersRef.current.onHighLowRoundStart?.(data)
    );
    channel.bind("highlow-number-submitted", (data: HighLowNumberSubmittedPayload) =>
      handlersRef.current.onHighLowNumberSubmitted?.(data)
    );
    channel.bind("highlow-round-result", (data: HighLowRoundResultPayload) =>
      handlersRef.current.onHighLowRoundResult?.(data)
    );

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(sessionChannel(pin));
    };
  }, [pin]);
}
