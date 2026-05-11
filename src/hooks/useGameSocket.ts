"use client";

import { useEffect, useRef, useCallback } from "react";
import { getPusherClient } from "@/lib/pusher-client";
import { sessionChannel } from "@/lib/pusher-server";
import type {
  PlayerJoinedPayload,
  TeamCreatedPayload,
  TeamUpdatedPayload,
  VoteCastPayload,
  VotesRevealedPayload,
  NextCardPayload,
  GameStartedPayload,
  GameFinishedPayload,
} from "@/lib/pusher-server";

// ─── Event handler map ──────────────────────────────────────────────────────

export interface GameSocketHandlers {
  onPlayerJoined?: (data: PlayerJoinedPayload) => void;
  onTeamCreated?: (data: TeamCreatedPayload) => void;
  onTeamUpdated?: (data: TeamUpdatedPayload) => void;
  onVoteCast?: (data: VoteCastPayload) => void;
  onVotesRevealed?: (data: VotesRevealedPayload) => void;
  onNextCard?: (data: NextCardPayload) => void;
  onGameStarted?: (data: GameStartedPayload) => void;
  onGameFinished?: (data: GameFinishedPayload) => void;
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
    const channel = pusher.subscribe(sessionChannel(pin));

    channel.bind("player-joined", (data: PlayerJoinedPayload) =>
      handlersRef.current.onPlayerJoined?.(data)
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

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(sessionChannel(pin));
    };
  }, [pin]);
}
