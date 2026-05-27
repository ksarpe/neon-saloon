// PartyClient — WebSocket-based test harness mirroring the old GameDriver API
// so specs read the same. Each method sends a typed message to the PartyKit
// room and awaits the ack with the same requestId, returning { ok } / { ok:
// false, error } so tests can assert on success and rejection paths alike.

import type { SessionEvent } from '../../../party/protocol'
import type {
  ClientMessage,
  GameStateSnapshot,
  ServerMessage,
} from '../../../party/protocol'

const DEFAULT_BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:3000'
const DEFAULT_PARTYKIT_HOST = process.env.E2E_PARTYKIT_HOST ?? '127.0.0.1:1999'
const BOT_TOKEN = process.env.E2E_BOT_PROTECTION_TOKEN ?? 'XXXX.DUMMY.TOKEN.XXXX'

export type GameMode = 'classic' | 'highlow' | 'battle-royale'

export type DriverCard = {
  id: string
  type: 'QUIZ' | 'TEST' | 'NEVER'
  description: string
  title?: string
  emoji?: string
  options?: string[]
  answer?: string
}

export type AckResult =
  | { ok: true; requestId: string }
  | { ok: false; requestId: string; error: string }

// Distribute Omit over the discriminated ClientMessage union so each branch
// keeps its own narrowed shape (Omit<Union, K> collapses the union otherwise).
type DistributiveOmit<T, K extends keyof T | string> = T extends unknown
  ? Omit<T, Extract<K, keyof T>>
  : never

export type DriverVote = {
  playerId: string
  playerName: string
  teamId?: string | null
  teamName?: string | null
  cardIndex: number
  answerIndex: number
  answerText: string
}

function randomClientIp(): string {
  const octet = () => 1 + Math.floor(Math.random() * 254)
  return `10.${octet()}.${octet()}.${octet()}`
}

async function createConnectToken(baseUrl: string, partyToken: string): Promise<string> {
  const res = await fetch(`${baseUrl}/api/party/connect-token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': randomClientIp() },
    body: JSON.stringify({ partyToken }),
  })
  if (res.status !== 200) {
    throw new Error(`connect token failed (${res.status}): ${await res.text()}`)
  }
  const data = (await res.json()) as { connectToken: string }
  return data.connectToken
}

function openWebSocket(
  baseUrl: string,
  partyKitHost: string,
  pin: string,
  partyToken: string,
  _role: 'host' | 'player',
): Promise<WebSocket> {
  return createConnectToken(baseUrl, partyToken).then(
    (connectToken) =>
      new Promise((resolve, reject) => {
        const url = `ws://${partyKitHost}/parties/main/${pin}?token=${encodeURIComponent(connectToken)}`
        const ws = new WebSocket(url)
        const timer = setTimeout(() => {
          reject(new Error(`WS connect timeout (${pin}, ${_role})`))
          try {
            ws.close()
          } catch {
            // ignore
          }
        }, 5000)
        ws.onopen = () => {
          clearTimeout(timer)
          resolve(ws)
        }
        ws.onerror = () => {
          clearTimeout(timer)
          reject(new Error(`WS error before open (${pin}, ${_role})`))
        }
      }),
  )
}

abstract class BaseHandle {
  protected ws: WebSocket
  protected snapshot: GameStateSnapshot | null = null
  protected eventLog: SessionEvent[] = []
  private pending = new Map<string, (result: AckResult) => void>()
  private requestCounter = 0

  protected constructor(ws: WebSocket) {
    this.ws = ws
    ws.onmessage = (event) => this.handleRaw(String(event.data))
  }

  private handleRaw(raw: string) {
    let msg: ServerMessage
    try {
      msg = JSON.parse(raw) as ServerMessage
    } catch {
      return
    }

    switch (msg.type) {
      case 'state-snapshot':
        this.snapshot = msg.state
        return
      case 'event':
        this.eventLog.push(msg.event)
        return
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
      case 'error':
        // Connection-level error from the room (very rare with the ack flow).
        // Surface via the pending resolver if we can match it; otherwise log.
        if (msg.requestId && this.pending.has(msg.requestId)) {
          const resolver = this.pending.get(msg.requestId)!
          this.pending.delete(msg.requestId)
          resolver({ ok: false, requestId: msg.requestId, error: msg.message })
        }
        return
    }
  }

  protected nextRequestId(): string {
    this.requestCounter += 1
    return `r-${Date.now()}-${this.requestCounter}-${Math.random().toString(36).slice(2, 6)}`
  }

  protected sendAndAwait(
    body: DistributiveOmit<ClientMessage, 'requestId'>,
    timeoutMs = 5000,
  ): Promise<AckResult> {
    const requestId = this.nextRequestId()
    const message = { ...body, requestId } as ClientMessage
    return new Promise((resolve, reject) => {
      this.pending.set(requestId, resolve)
      try {
        this.ws.send(JSON.stringify(message))
      } catch (err) {
        this.pending.delete(requestId)
        reject(err)
        return
      }
      setTimeout(() => {
        if (this.pending.has(requestId)) {
          this.pending.delete(requestId)
          reject(new Error(`ack timeout for ${body.type} (${requestId})`))
        }
      }, timeoutMs)
    })
  }

  /** Async-wait until an event matching the predicate is received. */
  async waitForEvent(
    predicate: (event: SessionEvent) => boolean,
    timeoutMs = 3000,
  ): Promise<SessionEvent> {
    const deadline = Date.now() + timeoutMs
    while (Date.now() < deadline) {
      const found = this.eventLog.find(predicate)
      if (found) return found
      await new Promise((r) => setTimeout(r, 25))
    }
    throw new Error(
      `waitForEvent timed out; events so far: ${this.eventLog.map((e) => e.event).join(', ')}`,
    )
  }

  /** Wait for N events of a given type (counts only events received so far + new). */
  async waitForEventCount(type: SessionEvent['event'], count: number, timeoutMs = 5000) {
    const deadline = Date.now() + timeoutMs
    while (Date.now() < deadline) {
      if (this.eventLog.filter((e) => e.event === type).length >= count) {
        return this.eventLog.filter((e) => e.event === type).slice(0, count)
      }
      await new Promise((r) => setTimeout(r, 25))
    }
    throw new Error(
      `waitForEventCount(${type}, ${count}) timeout; have ${this.eventLog.filter((e) => e.event === type).length}`,
    )
  }

  get events(): ReadonlyArray<SessionEvent> {
    return this.eventLog
  }

  get state(): GameStateSnapshot | null {
    return this.snapshot
  }

  protected async waitForFirstSnapshot(timeoutMs = 3000): Promise<void> {
    const deadline = Date.now() + timeoutMs
    while (Date.now() < deadline) {
      if (this.snapshot) return
      await new Promise((r) => setTimeout(r, 20))
    }
    throw new Error('Did not receive initial state-snapshot')
  }

  close() {
    try {
      this.ws.close()
    } catch {
      // ignore
    }
  }
}

export class HostHandle extends BaseHandle {
  readonly pin: string
  readonly partyToken: string

  static async connect(
    baseUrl: string,
    partyKitHost: string,
    pin: string,
    partyToken: string,
  ): Promise<HostHandle> {
    const ws = await openWebSocket(baseUrl, partyKitHost, pin, partyToken, 'host')
    const handle = new HostHandle(pin, partyToken, ws)
    await handle.waitForFirstSnapshot()
    return handle
  }

  private constructor(pin: string, partyToken: string, ws: WebSocket) {
    super(ws)
    this.pin = pin
    this.partyToken = partyToken
  }

  ping() {
    return this.sendAndAwait({ type: 'ping' })
  }

  start(opts?: {
    card?: DriverCard
    deck?: DriverCard[]
    settings?: { revealCountdownSeconds: number; answerTimeLimitSeconds: number }
  }) {
    const deck = opts?.deck ?? (opts?.card ? [opts.card] : makeDeck(1))
    const card = opts?.card ?? deck[0]
    return this.sendAndAwait({ type: 'host:start', card, deck, settings: opts?.settings })
  }

  reveal(opts: {
    cardIndex: number
    correctAnswer?: string
    votes: DriverVote[]
    scores?: Array<{ playerId: string; playerName: string; score: number }>
    teamScores?: Array<{ teamId: string; teamName: string; score: number }>
  }) {
    return this.sendAndAwait({
      type: 'host:reveal',
      cardIndex: opts.cardIndex,
      correctAnswer: opts.correctAnswer,
      votes: opts.votes,
      scores: opts.scores ?? [],
      teamScores: opts.teamScores ?? [],
    })
  }

  nextCard(cardIndex: number, opts?: { card?: DriverCard }) {
    return this.sendAndAwait({ type: 'host:next', cardIndex, card: opts?.card })
  }

  finish(opts?: {
    scores?: Array<{ playerId: string; playerName: string; score: number }>
    teamScores?: Array<{ teamId: string; teamName: string; score: number }>
    showPlayerPoints?: boolean
  }) {
    return this.sendAndAwait({
      type: 'host:finish',
      scores: opts?.scores ?? [],
      teamScores: opts?.teamScores ?? [],
      showPlayerPoints: opts?.showPlayerPoints,
    })
  }

  // ─── HighLow ───────────────────────────────────────────────────────────────

  highLowSetup(opts: { team1Name: string; team2Name: string }) {
    return this.sendAndAwait({
      type: 'host:highlow-setup',
      team1Name: opts.team1Name,
      team2Name: opts.team2Name,
    })
  }

  highLowRound(opts: {
    roundIndex: number
    questionText: string
    questionUnit: string
    guessingTeamId: string
    guessingTeamName: string
    votingTeamId: string
    votingTeamName: string
    guessingCaptainId: string
    votingCaptainId: string
  }) {
    return this.sendAndAwait({ type: 'host:highlow-round', ...opts })
  }

  // ─── Battle Royale ─────────────────────────────────────────────────────────

  brSetup(opts: { categoryId: string; timerDuration?: number }) {
    return this.sendAndAwait({
      type: 'host:br-setup',
      categoryId: opts.categoryId,
      timerDuration: opts.timerDuration,
    })
  }

  brRound() {
    return this.sendAndAwait({ type: 'host:br-round' })
  }

  brReveal() {
    return this.sendAndAwait({ type: 'host:br-reveal' })
  }

  brNext() {
    return this.sendAndAwait({ type: 'host:br-next' })
  }
}

export class PlayerHandle extends BaseHandle {
  readonly pin: string
  readonly playerId: string
  readonly partyToken: string

  static async connect(
    baseUrl: string,
    partyKitHost: string,
    pin: string,
    partyToken: string,
    playerId: string,
  ): Promise<PlayerHandle> {
    const ws = await openWebSocket(baseUrl, partyKitHost, pin, partyToken, 'player')
    const handle = new PlayerHandle(pin, playerId, partyToken, ws)
    await handle.waitForFirstSnapshot()
    return handle
  }

  private constructor(pin: string, playerId: string, partyToken: string, ws: WebSocket) {
    super(ws)
    this.pin = pin
    this.playerId = playerId
    this.partyToken = partyToken
  }

  vote(opts: { cardIndex: number; answerIndex: number; answerText?: string }) {
    return this.sendAndAwait({
      type: 'player:vote',
      cardIndex: opts.cardIndex,
      answerIndex: opts.answerIndex,
      answerText: opts.answerText ?? '',
    })
  }

  leave() {
    return this.sendAndAwait({ type: 'player:leave' })
  }

  highLowNumber(number: string) {
    return this.sendAndAwait({ type: 'player:highlow-number', number })
  }

  highLowVote(vote: 'mniej' | 'wiecej') {
    return this.sendAndAwait({ type: 'player:highlow-vote', vote })
  }

  brAnswer(opts: { answerIndex: number; answerText?: string }) {
    return this.sendAndAwait({
      type: 'player:br-answer',
      answerIndex: opts.answerIndex,
      answerText: opts.answerText ?? '',
    })
  }

  /** Build a vote payload the way the host would echo it in reveal. */
  asVote(answerIndex: number, answerText: string): DriverVote {
    const player = this.snapshot?.players.find((p) => p.playerId === this.playerId)
    return {
      playerId: this.playerId,
      playerName: player?.playerName ?? '?',
      teamId: player?.teamId ?? null,
      teamName: player?.teamName ?? null,
      cardIndex: this.snapshot?.cardIndex ?? 0,
      answerIndex,
      answerText,
    }
  }

  get playerName(): string {
    return this.snapshot?.players.find((p) => p.playerId === this.playerId)?.playerName ?? '?'
  }
}

export class PartyClient {
  readonly baseUrl: string
  readonly partyKitHost: string
  readonly clientIp: string

  constructor(opts?: { baseUrl?: string; partyKitHost?: string; clientIp?: string }) {
    this.baseUrl = (opts?.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '')
    this.partyKitHost = opts?.partyKitHost ?? DEFAULT_PARTYKIT_HOST
    this.clientIp = opts?.clientIp ?? randomClientIp()
  }

  async createHost(opts?: { hostName?: string; gameMode?: GameMode }): Promise<HostHandle> {
    const res = await fetch(`${this.baseUrl}/api/party/ticket`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': this.clientIp },
      body: JSON.stringify({
        action: 'create-host',
        hostName: opts?.hostName ?? 'Szeryf Testowy',
        gameMode: opts?.gameMode ?? 'classic',
        botProtectionToken: BOT_TOKEN,
      }),
    })
    if (res.status !== 201) {
      throw new Error(`createHost ticket failed (${res.status}): ${await res.text()}`)
    }
    const data = (await res.json()) as { pin: string; partyToken: string }
    return HostHandle.connect(this.baseUrl, this.partyKitHost, data.pin, data.partyToken)
  }

  async joinPlayer(
    pin: string,
    opts: { playerName: string; avatar?: string; teamId?: string },
  ): Promise<PlayerHandle> {
    const res = await fetch(`${this.baseUrl}/api/party/ticket`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': this.clientIp },
      body: JSON.stringify({
        action: 'join',
        pin,
        playerName: opts.playerName,
        avatar: opts.avatar,
        teamId: opts.teamId,
      }),
    })
    if (res.status !== 200) {
      throw new Error(`joinPlayer ticket failed (${res.status}): ${await res.text()}`)
    }
    const data = (await res.json()) as { playerId: string; partyToken: string }
    return PlayerHandle.connect(this.baseUrl, this.partyKitHost, pin, data.partyToken, data.playerId)
  }
}

// ─── Card helpers (same shape as the old GameDriver's makeCard/makeDeck) ─────

const DEFAULT_OPTIONS = ['A', 'B', 'C', 'D']

export function makeCard(index: number, overrides?: Partial<DriverCard>): DriverCard {
  return {
    id: `card-${index}`,
    type: 'QUIZ',
    title: `Pytanie ${index}`,
    description: `Treść pytania numer ${index}`,
    options: DEFAULT_OPTIONS,
    answer: DEFAULT_OPTIONS[0],
    ...overrides,
  }
}

export function makeDeck(count: number): DriverCard[] {
  return Array.from({ length: count }, (_, i) => makeCard(i))
}

export function makeNeverCard(index: number, overrides?: Partial<DriverCard>): DriverCard {
  return {
    id: `never-${index}`,
    type: 'NEVER',
    description: `Nigdy przenigdy nie testowałem eventów numer ${index}.`,
    ...overrides,
  }
}

export function makeNeverDeck(count: number): DriverCard[] {
  return Array.from({ length: count }, (_, i) => makeNeverCard(i))
}
