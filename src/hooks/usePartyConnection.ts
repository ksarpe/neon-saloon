'use client'

// React hook wrapping PartyConnection. Returns:
//   • status — current WS lifecycle state
//   • snapshot — last GameStateSnapshot from the room (null until first frame)
//   • send — typed action sender, returns the room's ack
//
// Designed to slot into the existing component architecture: pass a `handlers`
// object that mirrors the old `GameSocketHandlers` shape and the hook will
// dispatch events to it (keeps components stable across the migration).

import { useEffect, useMemo, useRef, useState } from 'react'

import type { GameSocketHandlers } from '@/lib/game-types'
import { type AckResult, type ConnectionStatus, PartyConnection } from '@/lib/party-ws'

import type { GameStateSnapshot, SessionEvent } from '../../party/protocol'

export type UsePartyConnectionOptions = {
  pin: string | null
  partyToken: string | null
  role: 'host' | 'player' | null
  /** Event handler interface for room broadcasts. */
  handlers?: GameSocketHandlers
  /** Called every time the room re-broadcasts a snapshot (incl. on reconnect). */
  onSnapshot?: (snapshot: GameStateSnapshot) => void
}

export type UsePartyConnectionResult = {
  status: ConnectionStatus
  snapshot: GameStateSnapshot | null
  send: ((body: Parameters<PartyConnection['send']>[0]) => Promise<AckResult>) | null
}

export function usePartyConnection(options: UsePartyConnectionOptions): UsePartyConnectionResult {
  const { pin, partyToken, role, handlers, onSnapshot } = options
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const [snapshot, setSnapshot] = useState<GameStateSnapshot | null>(null)
  const connectionRef = useRef<PartyConnection | null>(null)
  const handlersRef = useRef(handlers)
  const snapshotCbRef = useRef(onSnapshot)
  useEffect(() => {
    handlersRef.current = handlers
    snapshotCbRef.current = onSnapshot
  }, [handlers, onSnapshot])

  useEffect(() => {
    if (!pin || !partyToken || !role) {
      connectionRef.current = null
      setStatus('closed')
      return
    }

    const connection = new PartyConnection({ pin, partyToken, role })
    connectionRef.current = connection

    const unsubStatus = connection.onStatus(setStatus)
    const unsubSnapshot = connection.onSnapshot((next) => {
      setSnapshot(next)
      snapshotCbRef.current?.(next)
    })
    const unsubEvent = connection.onEvent((event) => dispatchEvent(handlersRef.current, event))

    return () => {
      unsubStatus()
      unsubSnapshot()
      unsubEvent()
      connection.close()
      connectionRef.current = null
    }
  }, [pin, partyToken, role])

  const send = useMemo(() => {
    if (!pin || !partyToken || !role) return null
    return (body: Parameters<PartyConnection['send']>[0]) => {
      const conn = connectionRef.current
      if (!conn) return Promise.reject(new Error('not connected'))
      return conn.send(body)
    }
  }, [pin, partyToken, role])

  return { status, snapshot, send }
}

// Dispatch PartyKit room events into optional component handlers.
function dispatchEvent(handlers: GameSocketHandlers | undefined, event: SessionEvent): void {
  if (!handlers) return
  switch (event.event) {
    case 'player-joined':
      handlers.onPlayerJoined?.(event.data)
      return
    case 'player-left':
      handlers.onPlayerLeft?.(event.data)
      return
    case 'team-created':
      handlers.onTeamCreated?.(event.data)
      return
    case 'team-updated':
      handlers.onTeamUpdated?.(event.data)
      return
    case 'vote-cast':
      handlers.onVoteCast?.(event.data)
      return
    case 'votes-revealed':
      handlers.onVotesRevealed?.(event.data)
      return
    case 'next-card':
      handlers.onNextCard?.(event.data)
      return
    case 'game-started':
      handlers.onGameStarted?.(event.data)
      return
    case 'game-finished':
      handlers.onGameFinished?.(event.data)
      return
    case 'highlow-round-start':
      handlers.onHighLowRoundStart?.(event.data)
      return
    case 'highlow-number-submitted':
      handlers.onHighLowNumberSubmitted?.(event.data)
      return
    case 'highlow-round-result':
      handlers.onHighLowRoundResult?.(event.data)
      return
    case 'br-round-start':
      handlers.onBRRoundStart?.(event.data)
      return
    case 'br-answer-submitted':
      handlers.onBRAnswerSubmitted?.(event.data)
      return
    case 'br-round-reveal':
      handlers.onBRRoundReveal?.(event.data)
      return
    case 'br-game-over':
      handlers.onBRGameOver?.(event.data)
      return
  }
}
