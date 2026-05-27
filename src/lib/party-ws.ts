'use client'

// Browser-side WebSocket client for the PartyKit room. Wraps `partysocket`
// (which auto-reconnects on flaky networks), exposes a small typed API:
//   • subscribe to status / snapshot / event streams
//   • send(action) → Promise<AckResult> with timeout
//
// One PartyConnection per logical "tab as a host" or "tab as a player".
// The room re-broadcasts a fresh state-snapshot on every (re)connect, so
// listeners can naively overwrite local state from the snapshot whenever it
// fires — that's the recovery story after a reconnect.

import PartySocket from 'partysocket'

import type {
  ClientMessage,
  GameStateSnapshot,
  ServerMessage,
  SessionEvent,
} from '../../party/protocol'
import { getPartyKitHost } from './party-host'
import { fetchPartyConnectToken } from './party-ticket-client'

export type ConnectionStatus = 'connecting' | 'connected' | 'closed' | 'error'

export type AckResult =
  | { ok: true; requestId: string }
  | { ok: false; requestId: string; error: string }

type ClientAction = Exclude<ClientMessage, { type: 'ping' }>
type SendBody = DistributiveOmit<ClientAction, 'requestId'>

// Preserve narrowing across the discriminated ClientMessage union.
type DistributiveOmit<T, K extends keyof T | string> = T extends unknown
  ? Omit<T, Extract<K, keyof T>>
  : never

export type PartyConnectionOptions = {
  pin: string
  partyToken: string
  role: 'host' | 'player'
  host?: string
}

export class PartyConnection {
  private socket: PartySocket
  private pending = new Map<string, (result: AckResult) => void>()
  private statusListeners = new Set<(s: ConnectionStatus) => void>()
  private snapshotListeners = new Set<(s: GameStateSnapshot) => void>()
  private eventListeners = new Set<(e: SessionEvent) => void>()
  private requestCounter = 0

  status: ConnectionStatus = 'connecting'
  snapshot: GameStateSnapshot | null = null

  constructor(options: PartyConnectionOptions) {
    this.socket = new PartySocket({
      host: options.host ?? getPartyKitHost(),
      room: options.pin,
      party: 'main',
      query: async () => ({
        token: (await fetchPartyConnectToken(options.partyToken)).connectToken,
      }),
    })

    this.socket.addEventListener('open', () => this.setStatus('connected'))
    this.socket.addEventListener('close', () => {
      this.rejectAllPending('connection closed')
      this.setStatus('closed')
    })
    this.socket.addEventListener('error', () => this.setStatus('error'))
    this.socket.addEventListener('message', (event) => this.handleRaw(String(event.data)))
  }

  // ─── Subscriptions ──────────────────────────────────────────────────────────

  onStatus(listener: (status: ConnectionStatus) => void): () => void {
    this.statusListeners.add(listener)
    listener(this.status)
    return () => {
      this.statusListeners.delete(listener)
    }
  }

  onSnapshot(listener: (snapshot: GameStateSnapshot) => void): () => void {
    this.snapshotListeners.add(listener)
    if (this.snapshot) listener(this.snapshot)
    return () => {
      this.snapshotListeners.delete(listener)
    }
  }

  onEvent(listener: (event: SessionEvent) => void): () => void {
    this.eventListeners.add(listener)
    return () => {
      this.eventListeners.delete(listener)
    }
  }

  // ─── Sending ────────────────────────────────────────────────────────────────

  send(body: SendBody, timeoutMs = 8000): Promise<AckResult> {
    this.requestCounter += 1
    const requestId = `r-${Date.now()}-${this.requestCounter}-${Math.random().toString(36).slice(2, 6)}`
    const message = { ...body, requestId } as ClientMessage
    return new Promise((resolve, reject) => {
      this.pending.set(requestId, resolve)
      try {
        this.socket.send(JSON.stringify(message))
      } catch (err) {
        this.pending.delete(requestId)
        reject(err)
        return
      }
      setTimeout(() => {
        if (this.pending.has(requestId)) {
          this.pending.delete(requestId)
          reject(new Error(`ack timeout for ${body.type}`))
        }
      }, timeoutMs)
    })
  }

  ping(timeoutMs = 4000): Promise<AckResult> {
    this.requestCounter += 1
    const requestId = `ping-${this.requestCounter}`
    return new Promise((resolve, reject) => {
      this.pending.set(requestId, resolve)
      this.socket.send(JSON.stringify({ type: 'ping', requestId }))
      setTimeout(() => {
        if (this.pending.has(requestId)) {
          this.pending.delete(requestId)
          reject(new Error('ping timeout'))
        }
      }, timeoutMs)
    })
  }

  close() {
    this.socket.close()
  }

  // ─── Internals ──────────────────────────────────────────────────────────────

  private handleRaw(raw: string) {
    let msg: ServerMessage
    try {
      msg = JSON.parse(raw) as ServerMessage
    } catch {
      return
    }

    switch (msg.type) {
      case 'state-snapshot': {
        this.snapshot = msg.state
        this.snapshotListeners.forEach((listener) => listener(msg.state))
        return
      }
      case 'event': {
        this.eventListeners.forEach((listener) => listener(msg.event))
        return
      }
      case 'ack': {
        const resolver = this.pending.get(msg.requestId)
        if (!resolver) return
        this.pending.delete(msg.requestId)
        resolver(
          msg.ok
            ? { ok: true, requestId: msg.requestId }
            : { ok: false, requestId: msg.requestId, error: msg.error },
        )
        return
      }
      case 'pong': {
        const resolver = this.pending.get(msg.requestId)
        if (!resolver) return
        this.pending.delete(msg.requestId)
        resolver({ ok: true, requestId: msg.requestId })
        return
      }
      case 'error': {
        // Spontaneous server-side error (rare); surface via pending if matchable.
        if (msg.requestId && this.pending.has(msg.requestId)) {
          const resolver = this.pending.get(msg.requestId)!
          this.pending.delete(msg.requestId)
          resolver({ ok: false, requestId: msg.requestId, error: msg.message })
        }
        return
      }
    }
  }

  private rejectAllPending(reason: string) {
    for (const [requestId, resolver] of this.pending) {
      resolver({ ok: false, requestId, error: reason })
    }
    this.pending.clear()
  }

  private setStatus(status: ConnectionStatus) {
    if (this.status === status) return
    this.status = status
    this.statusListeners.forEach((listener) => listener(status))
  }
}
