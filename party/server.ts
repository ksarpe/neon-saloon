// PartyKit room — one Durable Object per game session (addressed by PIN).
//
// Each player action becomes a WebSocket message; the room applies a pure
// reducer, persists the new state to room.storage, and broadcasts the resulting
// realtime events. Because the DO is a single in-memory actor, all writes are
// naturally serialised — no transaction conflicts, no per-pin lock, no retry
// dance. This replaces the Appwrite hot-row contention the project used to fight.

import type * as Party from 'partykit/server'

import {
  applyFinish,
  applyJoin,
  applyLeave,
  applyNextCard,
  applyReveal,
  applyStart,
  applyVote,
  type ReducerResult,
} from './game/classic'
import type {
  ClientMessage,
  GameStateSnapshot,
  ServerMessage,
  SessionEvent,
} from './protocol'
import type { RoomState } from './state'
import { initialRoomState } from './state'
import { type PartyTokenPayload, verifyPartyToken } from '../src/lib/party-token'
import { ValidationError } from './validators'
import {
  sanitizeScoreEntries,
  sanitizeStoredDeck,
  sanitizeStoredVotes,
  sanitizeTeamScoreEntries,
  sanitizeWireCard,
} from './wire-card'

type HostMeta = {
  role: 'host'
  pin: string
  hostName: string
}
type PlayerMeta = {
  role: 'player'
  pin: string
  playerId: string
  playerName: string
  avatar?: string
  teamId?: string
}
type ConnectionMeta = HostMeta | PlayerMeta

const STORAGE_KEY = 'state'

function getAuthSecret(env: unknown): string | null {
  if (!env || typeof env !== 'object') return null
  const value = (env as Record<string, unknown>).PARTY_AUTH_SECRET
  return typeof value === 'string' && value.length >= 16 ? value : null
}

export default class GameServer implements Party.Server {
  readonly room: Party.Room

  // Loaded from storage in onStart, or initialised by the first host's connect.
  private state: RoomState | null = null
  private connectionMeta = new Map<string, ConnectionMeta>()

  constructor(room: Party.Room) {
    this.room = room
  }

  // ─── Lifecycle ──────────────────────────────────────────────────────────────

  async onStart() {
    const persisted = await this.room.storage.get<RoomState>(STORAGE_KEY)
    if (persisted) this.state = persisted
  }

  static async onBeforeConnect(request: Party.Request, lobby: Party.Lobby) {
    const url = new URL(request.url)
    const token = url.searchParams.get('token')
    if (!token) return new Response('Missing token', { status: 401 })

    const secret = getAuthSecret(lobby.env)
    if (!secret) {
      return new Response('Server misconfigured: PARTY_AUTH_SECRET missing', { status: 500 })
    }

    const result = await verifyPartyToken(token, secret)
    if (!result.ok) return new Response(`Invalid token: ${result.reason}`, { status: 401 })
    if (result.payload.pin !== lobby.id) {
      return new Response(
        `Token PIN ${result.payload.pin} does not match room ${lobby.id}`,
        { status: 403 },
      )
    }
    return request
  }

  async onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {
    const payload = await this.verifyConnection(connection, ctx)
    if (!payload) return

    if (payload.role === 'host') {
      // First host through the door initialises the room with their chosen mode.
      if (!this.state) {
        this.state = initialRoomState({
          pin: this.room.id,
          hostName: payload.hostName,
          gameMode: payload.gameMode as RoomState['gameMode'],
        })
        await this.persist()
      }
      this.connectionMeta.set(connection.id, {
        role: 'host',
        pin: payload.pin,
        hostName: payload.hostName,
      })
    } else {
      if (!this.state) {
        connection.close(1008, 'Room not initialised (host has not arrived yet)')
        return
      }
      // Auto-join: the player token already carries the join intent (name,
      // avatar, optional team), so the connect IS the join — no separate
      // message needed.
      const joinResult = applyJoin(this.state, {
        playerId: payload.playerId,
        playerName: payload.playerName,
        avatar: payload.avatar,
        teamId: payload.teamId,
      })
      if (!joinResult.ok) {
        connection.close(1008, joinResult.error)
        return
      }
      this.state = joinResult.state
      await this.persist()
      this.broadcastEvents(joinResult.events)

      const allocated = joinResult.extra?.player
      this.connectionMeta.set(connection.id, {
        role: 'player',
        pin: payload.pin,
        playerId: payload.playerId,
        // Use the room-allocated (deduped) name, not the raw token name.
        playerName: allocated?.playerName ?? payload.playerName,
        avatar: payload.avatar,
        teamId: payload.teamId,
      })
    }

    this.send(connection, { type: 'state-snapshot', state: this.snapshot() })
  }

  async onClose(connection: Party.Connection) {
    this.connectionMeta.delete(connection.id)
    // We intentionally do NOT remove the player from state on close: tab refresh
    // and flaky mobile networks would look like leaves. Explicit player:leave
    // (or session finish) is what removes a player from the lobby.
  }

  // ─── Message dispatch ───────────────────────────────────────────────────────

  async onMessage(rawMessage: string, sender: Party.Connection) {
    let msg: ClientMessage
    try {
      msg = JSON.parse(rawMessage) as ClientMessage
    } catch {
      this.send(sender, { type: 'error', message: 'Malformed JSON' })
      return
    }

    const requestId = (msg as { requestId?: string }).requestId
    const meta = this.connectionMeta.get(sender.id)
    if (!meta) {
      this.send(sender, {
        type: 'ack',
        requestId: requestId ?? '',
        ok: false,
        error: 'Connection has no metadata (token verification missing?)',
      })
      return
    }

    try {
      switch (msg.type) {
        case 'ping':
          this.send(sender, { type: 'pong', requestId: msg.requestId })
          return

        case 'host:start':
          this.requireHost(meta, msg.type)
          this.requireState()
          await this.runReducer(sender, msg.requestId, () =>
            applyStart(this.state!, {
              card: sanitizeWireCard(msg.card),
              deck: msg.deck === undefined ? undefined : sanitizeStoredDeck(msg.deck),
              settings: msg.settings,
            }),
          )
          return

        case 'host:reveal':
          this.requireHost(meta, msg.type)
          this.requireState()
          await this.runReducer(sender, msg.requestId, () =>
            applyReveal(this.state!, {
              cardIndex: msg.cardIndex,
              correctAnswer: msg.correctAnswer,
              votes: sanitizeStoredVotes(msg.votes),
              scores: sanitizeScoreEntries(msg.scores),
              teamScores: sanitizeTeamScoreEntries(msg.teamScores),
            }),
          )
          return

        case 'host:next':
          this.requireHost(meta, msg.type)
          this.requireState()
          await this.runReducer(sender, msg.requestId, () =>
            applyNextCard(this.state!, {
              cardIndex: msg.cardIndex,
              card: msg.card === undefined ? undefined : sanitizeWireCard(msg.card),
            }),
          )
          return

        case 'host:finish':
          this.requireHost(meta, msg.type)
          this.requireState()
          await this.runReducer(sender, msg.requestId, () =>
            applyFinish(this.state!, {
              scores: sanitizeScoreEntries(msg.scores),
              teamScores: sanitizeTeamScoreEntries(msg.teamScores),
              showPlayerPoints: msg.showPlayerPoints,
            }),
          )
          return

        case 'player:vote': {
          if (meta.role !== 'player') {
            throw new ValidationError(`Only players can send ${msg.type}`, 403)
          }
          this.requireState()
          await this.runReducer(sender, msg.requestId, () =>
            applyVote(this.state!, {
              playerId: meta.playerId,
              cardIndex: msg.cardIndex,
              answerIndex: msg.answerIndex,
              answerText: msg.answerText ?? '',
            }),
          )
          return
        }

        case 'player:leave': {
          if (meta.role !== 'player') {
            throw new ValidationError(`Only players can send ${msg.type}`, 403)
          }
          this.requireState()
          await this.runReducer(sender, msg.requestId, () =>
            applyLeave(this.state!, { playerId: meta.playerId }),
          )
          return
        }

        default: {
          const unknown = (msg as { type?: string }).type ?? 'unknown'
          this.send(sender, {
            type: 'ack',
            requestId: requestId ?? '',
            ok: false,
            error: `Unknown message type: ${unknown}`,
          })
          return
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof ValidationError
          ? err.message
          : err instanceof Error
            ? err.message
            : String(err)
      this.send(sender, {
        type: 'ack',
        requestId: requestId ?? '',
        ok: false,
        error: errorMessage,
      })
    }
  }

  // ─── Helpers ────────────────────────────────────────────────────────────────

  private async verifyConnection(
    connection: Party.Connection,
    ctx: Party.ConnectionContext,
  ): Promise<PartyTokenPayload | null> {
    const url = new URL(ctx.request.url)
    const token = url.searchParams.get('token') ?? ''
    const secret = getAuthSecret(this.room.env)
    if (!secret) {
      connection.close(1011, 'PARTY_AUTH_SECRET missing')
      return null
    }
    const result = await verifyPartyToken(token, secret)
    if (!result.ok) {
      connection.close(1008, `invalid token: ${result.reason}`)
      return null
    }
    return result.payload
  }

  private requireHost(meta: ConnectionMeta, action: string): asserts meta is HostMeta {
    if (meta.role !== 'host') {
      throw new ValidationError(`Only the host can send ${action}`, 403)
    }
  }

  private requireState(): void {
    if (!this.state) {
      throw new ValidationError('Room is not initialised', 409)
    }
  }

  private async runReducer(
    sender: Party.Connection,
    requestId: string,
    runner: () => ReducerResult<unknown>,
  ) {
    const result = runner()
    if (!result.ok) {
      this.send(sender, { type: 'ack', requestId, ok: false, error: result.error })
      return
    }
    this.state = result.state
    await this.persist()
    this.broadcastEvents(result.events)
    this.send(sender, { type: 'ack', requestId, ok: true })
  }

  private async persist() {
    if (!this.state) return
    await this.room.storage.put(STORAGE_KEY, this.state)
  }

  private broadcastEvents(events: ReadonlyArray<SessionEvent>) {
    for (const event of events) {
      const message: ServerMessage = { type: 'event', event }
      this.room.broadcast(JSON.stringify(message))
    }
  }

  private snapshot(): GameStateSnapshot {
    if (!this.state) {
      return {
        pin: this.room.id,
        gameMode: 'classic',
        status: 'waiting',
        cardIndex: 0,
        players: [],
        teams: [],
      }
    }
    return {
      pin: this.state.pin,
      gameMode: this.state.gameMode,
      status: this.state.status,
      cardIndex: this.state.cardIndex,
      players: this.state.players.map((p) => ({
        playerId: p.playerId,
        playerName: p.playerName,
        avatar: p.avatar,
        teamId: p.teamId,
        teamName: p.teamName,
      })),
      teams: this.state.teams,
      currentCard: this.state.currentCard,
    }
  }

  private send(connection: Party.Connection, message: ServerMessage) {
    connection.send(JSON.stringify(message))
  }
}
