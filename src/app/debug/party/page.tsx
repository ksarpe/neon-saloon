// Visual debug console for the PartyKit room. Open in one or more browser
// windows to drive a real session end-to-end with raw clicks: see snapshots,
// watch realtime events flow, send any host/player action by hand.
//
// Local-only — there is no auth gating here. The page assumes Next.js + PartyKit
// dev servers are running (3000 + 1999 by default). Safe to delete before prod.
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { getPartyKitHost } from '@/lib/party-host'

const BOT_TOKEN = 'XXXX.DUMMY.TOKEN.XXXX'
const SAMPLE_DECK = [
  {
    id: 'debug-card-0',
    type: 'QUIZ' as const,
    title: 'Pytanie 1',
    description: 'Która opcja jest poprawna?',
    options: ['A', 'B', 'C', 'D'],
    answer: 'A',
  },
  {
    id: 'debug-card-1',
    type: 'QUIZ' as const,
    title: 'Pytanie 2',
    description: 'A teraz druga karta',
    options: ['A', 'B', 'C', 'D'],
    answer: 'B',
  },
]

type Status = 'disconnected' | 'connecting' | 'connected' | 'closed' | 'error'

type LogEntry = {
  id: number
  ts: string
  direction: 'out' | 'in'
  kind: string
  payload: unknown
}

type AnyMessage = { type: string; [key: string]: unknown }

function nowStamp() {
  return new Date().toLocaleTimeString('pl-PL', { hour12: false, fractionalSecondDigits: 3 })
}

function StatusDot({ status }: { status: Status }) {
  const color =
    status === 'connected'
      ? 'bg-emerald-500'
      : status === 'connecting'
        ? 'bg-amber-500 animate-pulse'
        : status === 'error'
          ? 'bg-rose-500'
          : 'bg-zinc-600'
  return <span className={`inline-block size-2.5 rounded-full ${color}`} />
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-3">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">{title}</div>
      {children}
    </div>
  )
}

function JsonView({ value }: { value: unknown }) {
  if (value === null || value === undefined) {
    return <div className="text-xs text-zinc-500 italic">brak</div>
  }
  return (
    <pre className="max-h-48 overflow-auto rounded bg-black/50 p-2 text-[11px] leading-relaxed text-zinc-300">
      {JSON.stringify(value, null, 2)}
    </pre>
  )
}

function LogList({ entries }: { entries: LogEntry[] }) {
  if (entries.length === 0) {
    return <div className="text-xs text-zinc-500 italic">brak ruchu</div>
  }
  return (
    <div className="max-h-72 overflow-auto rounded bg-black/40">
      <ul className="divide-y divide-zinc-800/60 text-[11px]">
        {entries
          .slice()
          .reverse()
          .map((entry) => (
            <li key={entry.id} className="px-2 py-1.5">
              <div className="flex items-center gap-2">
                <span className="text-zinc-500">{entry.ts}</span>
                <span
                  className={`font-mono ${
                    entry.direction === 'out' ? 'text-cyan-400' : 'text-amber-400'
                  }`}
                  title={entry.direction === 'out' ? 'wysłane' : 'odebrane'}
                >
                  {entry.direction === 'out' ? '→' : '←'}
                </span>
                <span className="font-semibold text-zinc-200">{entry.kind}</span>
              </div>
              {entry.payload != null && (
                <details className="mt-0.5 pl-8">
                  <summary className="cursor-pointer text-zinc-500 hover:text-zinc-300">
                    payload
                  </summary>
                  <pre className="mt-1 overflow-auto whitespace-pre-wrap text-zinc-400">
                    {JSON.stringify(entry.payload, null, 2)}
                  </pre>
                </details>
              )}
            </li>
          ))}
      </ul>
    </div>
  )
}

// ─── Shared socket hook ──────────────────────────────────────────────────────

function useDebugSocket() {
  const [status, setStatus] = useState<Status>('disconnected')
  const [snapshot, setSnapshot] = useState<unknown>(null)
  const [log, setLog] = useState<LogEntry[]>([])
  const wsRef = useRef<WebSocket | null>(null)
  const logIdRef = useRef(0)
  const requestIdRef = useRef(0)

  const append = useCallback((direction: 'out' | 'in', kind: string, payload: unknown) => {
    logIdRef.current += 1
    setLog((prev) => [...prev, { id: logIdRef.current, ts: nowStamp(), direction, kind, payload }])
  }, [])

  const close = useCallback(() => {
    if (wsRef.current) {
      try {
        wsRef.current.close()
      } catch {
        // ignore
      }
      wsRef.current = null
    }
    setStatus('disconnected')
    setSnapshot(null)
    setLog([])
    logIdRef.current = 0
    requestIdRef.current = 0
  }, [])

  const open = useCallback(
    (pin: string, token: string, role: 'host' | 'player') => {
      close()
      setStatus('connecting')
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
      const url = `${protocol}://${getPartyKitHost()}/parties/main/${pin}?token=${encodeURIComponent(token)}&role=${role}`
      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.addEventListener('open', () => {
        setStatus('connected')
        append('in', '⚡ open', { url })
      })
      ws.addEventListener('close', (event) => {
        setStatus('closed')
        append('in', '⚡ close', { code: event.code, reason: event.reason })
      })
      ws.addEventListener('error', () => {
        setStatus('error')
        append('in', '⚡ error', null)
      })
      ws.addEventListener('message', (event) => {
        let msg: AnyMessage
        try {
          msg = JSON.parse(String(event.data)) as AnyMessage
        } catch {
          append('in', '<unparseable>', String(event.data))
          return
        }
        if (msg.type === 'state-snapshot') {
          setSnapshot((msg as unknown as { state: unknown }).state)
        }
        const kind =
          msg.type === 'event'
            ? `event:${(msg as unknown as { event: { event: string } }).event.event}`
            : msg.type
        append('in', kind, msg)
      })
    },
    [append, close],
  )

  const send = useCallback(
    (body: AnyMessage) => {
      const ws = wsRef.current
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        append('out', `(not connected) ${body.type}`, body)
        return
      }
      requestIdRef.current += 1
      const requestId = `req-${requestIdRef.current}`
      const message = { requestId, ...body }
      ws.send(JSON.stringify(message))
      append('out', body.type, message)
    },
    [append],
  )

  useEffect(() => () => close(), [close])

  return { status, snapshot, log, open, send, close }
}

// ─── Host panel ──────────────────────────────────────────────────────────────

function HostPanel({ onPinAssigned }: { onPinAssigned: (pin: string) => void }) {
  const socket = useDebugSocket()
  const [pin, setPin] = useState<string | null>(null)
  const [hostName, setHostName] = useState('DebugHost')

  const create = async () => {
    try {
      const res = await fetch('/api/party/ticket', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          action: 'create-host',
          hostName,
          gameMode: 'classic',
          botProtectionToken: BOT_TOKEN,
        }),
      })
      const data = (await res.json()) as { pin?: string; partyToken?: string; error?: string }
      if (!res.ok || !data.pin || !data.partyToken) {
        alert(`Ticket failed: ${data.error ?? res.statusText}`)
        return
      }
      setPin(data.pin)
      onPinAssigned(data.pin)
      socket.open(data.pin, data.partyToken, 'host')
    } catch (err) {
      alert(`Ticket fetch failed: ${String(err)}`)
    }
  }

  const players = useMemo(
    () => (socket.snapshot as { players?: Array<{ playerId: string; playerName: string }> } | null)?.players ?? [],
    [socket.snapshot],
  )

  // Track received vote-cast events so the reveal button has something to echo.
  const receivedVotes = useMemo(() => {
    const votes: Array<{
      playerId: string
      playerName: string
      teamId: string | null
      teamName: string | null
      cardIndex: number
      answerIndex: number
      answerText: string
    }> = []
    for (const entry of socket.log) {
      if (entry.direction !== 'in') continue
      const payload = entry.payload as { type?: string; event?: { event?: string; data?: unknown } }
      if (payload.type !== 'event' || payload.event?.event !== 'vote-cast') continue
      votes.push(payload.event.data as (typeof votes)[number])
    }
    // Most recent per player.
    const byPlayer = new Map<string, (typeof votes)[number]>()
    for (const vote of votes) byPlayer.set(vote.playerId, vote)
    return [...byPlayer.values()]
  }, [socket.log])

  const cardIndex = (socket.snapshot as { cardIndex?: number } | null)?.cardIndex ?? 0

  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
          <StatusDot status={socket.status} />
          Host
          {pin && (
            <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-base text-emerald-400">
              {pin}
            </span>
          )}
        </h2>
        <span className="text-xs text-zinc-500">{socket.status}</span>
      </header>

      <Section title="Sterowanie">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            className="rounded bg-zinc-800 px-2 py-1 text-sm text-zinc-100 outline-none ring-1 ring-zinc-700 focus:ring-emerald-500"
            placeholder="hostName"
          />
          <button
            onClick={create}
            className="rounded bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-500"
          >
            Utwórz salon
          </button>
          <button
            onClick={socket.close}
            className="rounded bg-zinc-700 px-3 py-1 text-sm hover:bg-zinc-600"
          >
            Rozłącz
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            disabled={socket.status !== 'connected'}
            onClick={() =>
              socket.send({
                type: 'host:start',
                card: SAMPLE_DECK[0],
                deck: SAMPLE_DECK,
                settings: { revealCountdownSeconds: 6, answerTimeLimitSeconds: 30 },
              })
            }
            className="rounded bg-cyan-600 px-3 py-1 text-sm text-white hover:bg-cyan-500 disabled:bg-zinc-700 disabled:text-zinc-500"
          >
            Start (2 karty)
          </button>
          <button
            disabled={socket.status !== 'connected'}
            onClick={() =>
              socket.send({
                type: 'host:reveal',
                cardIndex,
                correctAnswer: SAMPLE_DECK[cardIndex]?.answer,
                votes: receivedVotes,
                scores: players.map((p) => {
                  const vote = receivedVotes.find((v) => v.playerId === p.playerId)
                  const correct = vote?.answerText === SAMPLE_DECK[cardIndex]?.answer
                  return { playerId: p.playerId, playerName: p.playerName, score: correct ? 1 : 0 }
                }),
                teamScores: [],
              })
            }
            className="rounded bg-cyan-600 px-3 py-1 text-sm text-white hover:bg-cyan-500 disabled:bg-zinc-700 disabled:text-zinc-500"
          >
            Odsłoń ({receivedVotes.length} głosów)
          </button>
          <button
            disabled={socket.status !== 'connected'}
            onClick={() => socket.send({ type: 'host:next', cardIndex: cardIndex + 1 })}
            className="rounded bg-cyan-600 px-3 py-1 text-sm text-white hover:bg-cyan-500 disabled:bg-zinc-700 disabled:text-zinc-500"
          >
            Następna karta
          </button>
          <button
            disabled={socket.status !== 'connected'}
            onClick={() =>
              socket.send({
                type: 'host:finish',
                scores: players.map((p) => ({ playerId: p.playerId, playerName: p.playerName, score: 0 })),
                teamScores: [],
              })
            }
            className="rounded bg-rose-600 px-3 py-1 text-sm text-white hover:bg-rose-500 disabled:bg-zinc-700 disabled:text-zinc-500"
          >
            Zakończ grę
          </button>
          <button
            disabled={socket.status !== 'connected'}
            onClick={() => socket.send({ type: 'ping' })}
            className="rounded bg-zinc-700 px-3 py-1 text-sm hover:bg-zinc-600 disabled:text-zinc-500"
          >
            Ping
          </button>
        </div>
      </Section>

      <Section title="Snapshot (ostatni)">
        <JsonView value={socket.snapshot} />
      </Section>

      <Section title={`Log (${socket.log.length})`}>
        <LogList entries={socket.log} />
      </Section>
    </section>
  )
}

// ─── Player panel ────────────────────────────────────────────────────────────

function PlayerPanel({ defaultPin }: { defaultPin: string }) {
  const socket = useDebugSocket()
  const [pin, setPin] = useState(defaultPin)
  const [playerName, setPlayerName] = useState('Gracz')
  const [playerId, setPlayerId] = useState<string | null>(null)

  // Auto-update pin field when host creates a new room.
  useEffect(() => {
    if (defaultPin && pin !== defaultPin) setPin(defaultPin)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultPin])

  const join = async () => {
    if (!pin) return
    try {
      const res = await fetch('/api/party/ticket', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ action: 'join', pin, playerName }),
      })
      const data = (await res.json()) as { playerId?: string; partyToken?: string; error?: string }
      if (!res.ok || !data.playerId || !data.partyToken) {
        alert(`Ticket failed: ${data.error ?? res.statusText}`)
        return
      }
      setPlayerId(data.playerId)
      socket.open(pin, data.partyToken, 'player')
    } catch (err) {
      alert(`Ticket fetch failed: ${String(err)}`)
    }
  }

  const cardIndex = (socket.snapshot as { cardIndex?: number } | null)?.cardIndex ?? 0
  const options = ['A', 'B', 'C', 'D']

  return (
    <section className="space-y-3">
      <header className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-zinc-100">
          <StatusDot status={socket.status} />
          Gracz
          {playerId && (
            <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-xs text-amber-400">
              {playerId.slice(7, 18)}…
            </span>
          )}
        </h2>
        <span className="text-xs text-zinc-500">{socket.status}</span>
      </header>

      <Section title="Sterowanie">
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-24 rounded bg-zinc-800 px-2 py-1 text-center font-mono text-sm text-zinc-100 outline-none ring-1 ring-zinc-700 focus:ring-amber-500"
            placeholder="PIN"
          />
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="rounded bg-zinc-800 px-2 py-1 text-sm text-zinc-100 outline-none ring-1 ring-zinc-700 focus:ring-amber-500"
            placeholder="playerName"
          />
          <button
            onClick={join}
            className="rounded bg-amber-600 px-3 py-1 text-sm font-medium text-white hover:bg-amber-500"
          >
            Dołącz
          </button>
          <button
            onClick={socket.close}
            className="rounded bg-zinc-700 px-3 py-1 text-sm hover:bg-zinc-600"
          >
            Rozłącz
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {options.map((label, index) => (
            <button
              key={label}
              disabled={socket.status !== 'connected'}
              onClick={() =>
                socket.send({
                  type: 'player:vote',
                  cardIndex,
                  answerIndex: index,
                  answerText: label,
                })
              }
              className="rounded bg-amber-600 px-3 py-1 text-sm text-white hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500"
            >
              Głosuj {label}
            </button>
          ))}
          <button
            disabled={socket.status !== 'connected'}
            onClick={() => socket.send({ type: 'player:leave' })}
            className="rounded bg-rose-700 px-3 py-1 text-sm text-white hover:bg-rose-600 disabled:bg-zinc-700 disabled:text-zinc-500"
          >
            Wyjdź
          </button>
          <button
            disabled={socket.status !== 'connected'}
            onClick={() => socket.send({ type: 'ping' })}
            className="rounded bg-zinc-700 px-3 py-1 text-sm hover:bg-zinc-600 disabled:text-zinc-500"
          >
            Ping
          </button>
        </div>
      </Section>

      <Section title="Snapshot (ostatni)">
        <JsonView value={socket.snapshot} />
      </Section>

      <Section title={`Log (${socket.log.length})`}>
        <LogList entries={socket.log} />
      </Section>
    </section>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PartyDebugPage() {
  const [hostPin, setHostPin] = useState('')

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">PartyKit — konsola debugowa</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Klikaj po lewej (host), patrz na log po prawej (gracz) — albo otwórz tę stronę w dwóch
            kartach, żeby zobaczyć dwóch graczy.
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            PartyKit:{' '}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5">{getPartyKitHost()}</code>
            {' • '}Ticket endpoint: <code className="rounded bg-zinc-800 px-1.5 py-0.5">/api/party/ticket</code>
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <HostPanel onPinAssigned={setHostPin} />
          <PlayerPanel defaultPin={hostPin} />
        </div>

        <footer className="mt-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 text-xs text-zinc-400">
          <div className="font-semibold text-zinc-300">Sugerowana kolejność:</div>
          <ol className="mt-2 list-decimal pl-5 leading-relaxed">
            <li>Po lewej kliknij <strong>Utwórz salon</strong> — pojawi się PIN i status zielony.</li>
            <li>Po prawej (PIN auto-uzupełniony) ustaw nick i <strong>Dołącz</strong> — host zobaczy event <code className="text-amber-400">event:player-joined</code> w swoim logu.</li>
            <li>U hosta <strong>Start (2 karty)</strong> — gracz dostanie <code className="text-amber-400">event:game-started</code>.</li>
            <li>U gracza klikaj <strong>Głosuj A/B/C/D</strong> — host widzi <code className="text-amber-400">event:vote-cast</code>.</li>
            <li>U hosta <strong>Odsłoń</strong> i <strong>Następna karta</strong> — gracz widzi kolejne broadcasty.</li>
            <li>Otwórz tę stronę w drugiej karcie i dołącz drugim graczem (ten sam PIN) — zobaczysz że oba klienci dostają te same eventy w tej samej chwili.</li>
          </ol>
        </footer>
      </div>
    </main>
  )
}
