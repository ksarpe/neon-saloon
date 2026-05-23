'use client'

import { AppwriteException, Models } from 'appwrite'
import { useEffect, useRef } from 'react'

import { ensureAnonymousSession, getAppwriteClient, getTablesDB } from '@/lib/appwrite/client'
import type { GameSocketHandlers } from '@/lib/game-types'

// ─── Per-row Realtime channel ───────────────────────────────────────────────
// Subscribes to ONLY the current game's `game-sessions` row. Server appends
// events to the row's `events` column; subscribers read updated array and
// dispatch entries they haven't seen.
//
// Why per-row instead of whole-table? Whole-table fans out: every client of
// every game receives every event and filters client-side. At scale that's
// O(games × players × events). Per-row is O(events_for_this_pin × players).

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID ?? 'lastrodeo'
const SESSIONS_TABLE = process.env.NEXT_PUBLIC_APPWRITE_TABLE_GAME_SESSIONS ?? 'game-sessions'

// Row payload — we only care about the events column for dispatch.
// Extends Models.Row so it satisfies the SDK's `getRow<Row>` and
// `subscribe<Row>` constraints.
type SessionRowPayload = Models.Row & {
  events?: string // JSON array of StoredEvent
}

type StoredEvent = {
  seq: number
  type: string
  payload: unknown
  ts: string
}

// ─── Dispatch table ─────────────────────────────────────────────────────────
// Maps event-type strings (matching SessionEvent["event"]) to handler keys.

function dispatch(handlers: GameSocketHandlers, type: string, data: unknown) {
  switch (type) {
    case 'player-joined':
      handlers.onPlayerJoined?.(
        data as Parameters<NonNullable<GameSocketHandlers['onPlayerJoined']>>[0]
      )
      break
    case 'player-left':
      handlers.onPlayerLeft?.(
        data as Parameters<NonNullable<GameSocketHandlers['onPlayerLeft']>>[0]
      )
      break
    case 'team-created':
      handlers.onTeamCreated?.(
        data as Parameters<NonNullable<GameSocketHandlers['onTeamCreated']>>[0]
      )
      break
    case 'team-updated':
      handlers.onTeamUpdated?.(
        data as Parameters<NonNullable<GameSocketHandlers['onTeamUpdated']>>[0]
      )
      break
    case 'vote-cast':
      handlers.onVoteCast?.(data as Parameters<NonNullable<GameSocketHandlers['onVoteCast']>>[0])
      break
    case 'votes-revealed':
      handlers.onVotesRevealed?.(
        data as Parameters<NonNullable<GameSocketHandlers['onVotesRevealed']>>[0]
      )
      break
    case 'next-card':
      handlers.onNextCard?.(data as Parameters<NonNullable<GameSocketHandlers['onNextCard']>>[0])
      break
    case 'game-started':
      handlers.onGameStarted?.(
        data as Parameters<NonNullable<GameSocketHandlers['onGameStarted']>>[0]
      )
      break
    case 'game-finished':
      handlers.onGameFinished?.(
        data as Parameters<NonNullable<GameSocketHandlers['onGameFinished']>>[0]
      )
      break
    case 'highlow-round-start':
      handlers.onHighLowRoundStart?.(
        data as Parameters<NonNullable<GameSocketHandlers['onHighLowRoundStart']>>[0]
      )
      break
    case 'highlow-number-submitted':
      handlers.onHighLowNumberSubmitted?.(
        data as Parameters<NonNullable<GameSocketHandlers['onHighLowNumberSubmitted']>>[0]
      )
      break
    case 'highlow-round-result':
      handlers.onHighLowRoundResult?.(
        data as Parameters<NonNullable<GameSocketHandlers['onHighLowRoundResult']>>[0]
      )
      break
    case 'br-round-start':
      handlers.onBRRoundStart?.(
        data as Parameters<NonNullable<GameSocketHandlers['onBRRoundStart']>>[0]
      )
      break
    case 'br-answer-submitted':
      handlers.onBRAnswerSubmitted?.(
        data as Parameters<NonNullable<GameSocketHandlers['onBRAnswerSubmitted']>>[0]
      )
      break
    case 'br-round-reveal':
      handlers.onBRRoundReveal?.(
        data as Parameters<NonNullable<GameSocketHandlers['onBRRoundReveal']>>[0]
      )
      break
    case 'br-game-over':
      handlers.onBRGameOver?.(
        data as Parameters<NonNullable<GameSocketHandlers['onBRGameOver']>>[0]
      )
      break
    default:
      console.warn(`[Appwrite RT] unknown event type: ${type}`)
  }
}

function maxSeq(events: StoredEvent[]): number {
  return events.length === 0 ? -1 : events.reduce((m, e) => (e.seq > m ? e.seq : m), -1)
}

function parseStoredEvents(value: string | undefined): StoredEvent[] {
  return JSON.parse(value ?? '[]') as StoredEvent[]
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useGameEvents(pin: string | null, handlers: GameSocketHandlers) {
  const handlersRef = useRef<GameSocketHandlers>(handlers)
  useEffect(() => {
    handlersRef.current = handlers
  })

  useEffect(() => {
    if (!pin) return

    let unsubscribe: (() => void) | null = null
    let cancelled = false
    // Tracks the highest seq already dispatched. Initialized from a baseline
    // fetch so we don't replay history on a fresh subscription.
    let lastSeenSeq = -1
    const channel = `databases.${DATABASE_ID}.tables.${SESSIONS_TABLE}.rows.${pin}`

    ;(async () => {
      try {
        await ensureAnonymousSession()
      } catch (err) {
        console.error('[Appwrite RT] anon session bootstrap failed', err)
        return
      }
      if (cancelled) return

      // Baseline: fetch the current events array so we know what's "already
      // happened" at subscription time. Without this, the first row update
      // would deliver a fresh-feeling array and we'd dispatch every historical
      // event in it as if it just fired (e.g., a player joining a game in
      // progress would re-trigger every past `vote-cast`).
      try {
        const row = await getTablesDB().getRow<SessionRowPayload>({
          databaseId: DATABASE_ID,
          tableId: SESSIONS_TABLE,
          rowId: pin,
        })
        const events = parseStoredEvents(row.events)
        lastSeenSeq = maxSeq(events)
      } catch (err) {
        // 404 = session doesn't exist yet (host hasn't created the row).
        // That's fine — start from -1 and we'll dispatch everything we see.
        if (!(err instanceof AppwriteException) || err.code !== 404) {
          console.warn('[Appwrite RT] baseline fetch failed', err)
        }
      }
      if (cancelled) return

      const dispatchUnseen = (events: StoredEvent[]) => {
        const sorted = [...events].sort((a, b) => a.seq - b.seq)
        for (const ev of sorted) {
          if (ev.seq > lastSeenSeq) {
            dispatch(handlersRef.current, ev.type, ev.payload)
            lastSeenSeq = ev.seq
          }
        }
      }

      const client = getAppwriteClient()
      unsubscribe = client.subscribe<SessionRowPayload>(channel, (response) => {
        // Realtime fires on row create/update/delete — we care about both
        // create (first-ever update) and update events.
        const isRelevant = response.events.some(
          (e) => e.endsWith('.create') || e.endsWith('.update')
        )
        if (!isRelevant) return

        let events: StoredEvent[]
        try {
          events = parseStoredEvents(response.payload.events)
        } catch (err) {
          console.error('[Appwrite RT] malformed events array', err)
          return
        }

        // Dispatch in seq order so handlers see the same order events fired.
        dispatchUnseen(events)
      })

      // Close the baseline->subscribe race: an event can be written after the
      // baseline fetch but before the websocket subscription is attached.
      try {
        const row = await getTablesDB().getRow<SessionRowPayload>({
          databaseId: DATABASE_ID,
          tableId: SESSIONS_TABLE,
          rowId: pin,
        })
        if (!cancelled) dispatchUnseen(parseStoredEvents(row.events))
      } catch (err) {
        if (!(err instanceof AppwriteException) || err.code !== 404) {
          console.warn('[Appwrite RT] catch-up fetch failed', err)
        }
      }
    })()

    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [pin])
}
