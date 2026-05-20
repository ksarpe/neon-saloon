// Central game configuration — single source of truth for tunable values.
// Future: these defaults can be overridden per-session via SessionData.settings.

/** Seconds the host waits after a reveal before auto-advancing to the next card (standard mode). */
export const REVEAL_COUNTDOWN_SECONDS = 4

/** Seconds players have to answer each question in Battle Royale mode. */
export const BR_TIMER_SECONDS = 20

/** Seconds after a Battle Royale reveal before auto-advancing to the next round. */
export const BR_AUTO_NEXT_SECONDS = 10
