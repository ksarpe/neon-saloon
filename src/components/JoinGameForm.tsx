'use client'

import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Users,
  UserPlus,
  ChevronRight,
  Loader2,
  CheckCircle,
  ArrowLeft,
  Dices,
} from 'lucide-react'
import { useRealtimeGame as useGameSocket } from '@/hooks/useRealtimeGame'
import { ensureAnonymousSession } from '@/lib/appwrite/client'
import PlayerGameScreen from '@/components/PlayerGameScreen'
import PlayerHighLowScreen from '@/components/PlayerHighLowScreen'
import { useBackButton } from '@/lib/back-button-context'
import type {
  PlayerJoinedPayload,
  TeamCreatedPayload,
  WireCard,
  GameStartedPayload,
  HighLowRoundStartPayload,
} from '@/lib/pusher-server'
import { useEffect } from 'react'

const FUNNY_NAMES = [
  'Dzika Landryna',
  'Szeryfowa Aneta',
  'Różowa Pantera',
  'Kowbojka Kasia',
  'Pijana Pszczółka',
  'Gwiazda Szeryfa',
  'Neonowa Klacz',
  'Złota Ostroga',
  'Buntowniczka',
  'Saloonowa Królowa',
  'Whiskey Lady',
  'Galopująca Gazela',
  'Szalona Ruda',
  'Ostra Tequila',
  'Złota Gwiazda',
  'Różowy Dynamit',
  'Galopująca Panna',
  'Królowa Parkietu',
  'Wieczorowa Dama',
  'Błyszcząca Ostroga',
  'Neonowa Amazonka',
  'Gorąca Czekolada',
  'Słodka Zemsta',
  'Karmazynowa Dama',
  'Diamentowa Przełęcz',
  'Srebrna Podkowa',
  'Błękitna Laguna',
  'Śpiewająca Syrena',
  'Tańcząca z Wilkami',
  'Wielka Błękitna',
  'Słońce Teksasu',
  'Dzika Orchidea',
  'Perłowa Dama',
  'Rubinowa Róża',
  'Szmaragdowa Dolina',
]

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = 'pin' | 'name' | 'mode' | 'team' | 'waiting' | 'playing'

interface LiveTeam {
  teamId: string
  teamName: string
  color: string
  emoji: string
  memberCount: number
}

interface PlayerInfo {
  playerId: string
  avatar: string
  teamId: string | null
  teamName: string | null
}

const slide = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

// ─── PIN pad ─────────────────────────────────────────────────────────────────

function PinInput({
  value,
  onChange,
  onSubmit,
  loading,
  error,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: (pin: string) => void
  loading: boolean
  error: string | null
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h1
          className="shimmer-text mt-1 text-6xl tracking-widest"
          style={{ fontFamily: "'Bebas Neue',cursive" }}
        >
          last rodeo andżeliki
        </h1>
        <p className="text-text-muted text-sm">Wpisz PIN aby dołączyć do gry</p>
      </div>
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              borderColor: value[i]
                ? 'var(--neon-pink)'
                : i === value.length
                  ? 'rgba(255,16,240,0.5)'
                  : 'var(--saloon-border)',
              scale: i === value.length ? 1.08 : 1,
            }}
            transition={{ duration: 0.15 }}
            className="flex h-20 w-16 items-center justify-center rounded-xl border-2 text-2xl font-bold"
            style={{ backgroundColor: 'var(--saloon-surface)' }}
          >
            {value[i] ? (
              <motion.span
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                style={{ color: 'var(--neon-pink)' }}
              >
                {value[i]}
              </motion.span>
            ) : (
              <span className="opacity-20">—</span>
            )}
          </motion.div>
        ))}
      </div>
      <div className="grid w-full max-w-[240px] grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, '⌫'].map((k, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.92 }}
            disabled={k === null}
            onClick={() => {
              if (k === null) return
              if (k === '⌫') {
                onChange(value.slice(0, -1))
                return
              }
              if (value.length < 4) {
                const n = value + String(k)
                onChange(n)
                if (n.length === 4) setTimeout(() => onSubmit(n), 100)
              }
            }}
            className={`bg-saloon-surface border-saloon-border text-text-primary flex h-12 items-center justify-center rounded-xl border text-base font-bold ${
              k === null ? 'invisible' : ''
            }`}
          >
            {k}
          </motion.button>
        ))}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <motion.button
        id="pin-continue-btn"
        disabled={value.length < 4 || loading}
        whileTap={{ scale: 0.97 }}
        onClick={() => onSubmit(value)}
        className="flex w-full max-w-[240px] items-center justify-center gap-2 rounded-2xl py-3 text-white disabled:opacity-30"
        style={{
          background: 'linear-gradient(135deg,var(--neon-pink),#c800c8)',
          boxShadow: '0 4px 30px rgba(255,16,240,0.4)',
          fontFamily: "'Bebas Neue',cursive",
          fontSize: '1.1rem',
          letterSpacing: '0.1em',
        }}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : ''}
        {loading ? 'Sprawdzanie…' : 'Wejdź do salonu'}
      </motion.button>
    </div>
  )
}

// ─── Name input ──────────────────────────────────────────────────────────────

const AVATAR_LIST = ['🤠', '💃', '🌸', '✨', '🍾', '🎀', '👑', '🦋', '🌺', '🎉']

function NameInput({
  value,
  onChange,
  avatar,
  onAvatarChange,
  onSubmit,
  onBack,
}: {
  value: string
  onChange: (v: string) => void
  avatar: string | null
  onAvatarChange: (v: string) => void
  onSubmit: () => void
  onBack: () => void
}) {
  const [placeholder, setPlaceholder] = useState('np. Duchess Rosa…')

  useEffect(() => {
    const randomName = FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)]
    setPlaceholder(`np. ${randomName}`)
  }, [])
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2
          className="mt-2 text-3xl tracking-widest"
          style={{
            fontFamily: "'Bebas Neue',cursive",
            color: 'var(--sheriff-gold)',
          }}
        >
          Jak masz na imię kowboju?
        </h2>
      </div>

      {/* Avatar picker */}
      <div className="w-full max-w-xs">
        <p
          className="mb-2 text-center text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Wybierz awatar
        </p>
        <div className="grid grid-cols-5 gap-2">
          {AVATAR_LIST.map((emoji) => (
            <motion.button
              key={emoji}
              whileTap={{ scale: 0.88 }}
              onClick={() => onAvatarChange(emoji)}
              className="flex h-12 items-center justify-center rounded-xl border-2 text-2xl transition-colors"
              style={{
                borderColor: avatar === emoji ? 'var(--neon-pink)' : 'var(--saloon-border)',
                backgroundColor:
                  avatar === emoji ? 'rgba(255,16,240,0.15)' : 'var(--saloon-surface)',
                boxShadow: avatar === emoji ? '0 0 12px rgba(255,16,240,0.3)' : 'none',
              }}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-xs gap-2">
        <input
          id="player-name-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && value.trim() && avatar && onSubmit()}
          maxLength={20}
          autoFocus
          placeholder={placeholder}
          className="bg-saloon-surface text-text-primary placeholder:text-text-muted flex-1 rounded-xl border-2 px-4 py-4 text-center text-lg font-bold transition-colors focus:outline-none"
          style={{
            borderColor: value.trim() ? 'var(--neon-pink)' : 'var(--saloon-border)',
          }}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const randomName = FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)]
            onChange(randomName)
          }}
          className="bg-saloon-surface flex items-center justify-center rounded-xl border-2 px-4 transition-colors"
          style={{ borderColor: 'var(--saloon-border)' }}
          title="Losuj imię"
        >
          <Dices size={24} className="text-text-muted" />
        </motion.button>
      </div>
      <div className="flex w-full max-w-xs gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="border-saloon-border bg-saloon-surface text-text-muted flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-3 text-sm font-semibold"
        >
          <ArrowLeft size={14} />
          Wróć
        </motion.button>
        <motion.button
          id="name-continue-btn"
          disabled={!value.trim() || !avatar}
          whileTap={{ scale: 0.97 }}
          onClick={onSubmit}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-bold text-white disabled:opacity-30"
          style={{
            background: 'linear-gradient(135deg,var(--neon-pink),#c800c8)',
          }}
        >
          Dalej <ChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  )
}

// ─── Mode selector ────────────────────────────────────────────────────────────

function ModeSelector({
  onSolo,
  onTeam,
  onBack,
  loading,
}: {
  onSolo: () => void
  onTeam: () => void
  onBack: () => void
  loading: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-lg flex-col gap-3">
        <motion.button
          id="solo-mode-btn"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          onClick={onSolo}
          className="flex items-center gap-4 rounded-2xl border-2 p-5 text-left disabled:opacity-40"
          style={{
            borderColor: 'var(--sheriff-gold)',
            backgroundColor: 'rgba(255,215,0,0.08)',
          }}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(255,215,0,0.15)' }}
          >
            <User size={22} style={{ color: 'var(--sheriff-gold)' }} />
          </div>
          <div>
            <p className="text-base font-bold" style={{ color: 'var(--sheriff-gold)' }}>
              Samotna Kowbojka
            </p>
            <p className="text-text-muted text-xs">Każda kowbojka orze jak może!</p>
          </div>
          <ChevronRight size={16} className="text-text-muted ml-auto" />
        </motion.button>

        <motion.button
          id="team-mode-btn"
          whileTap={{ scale: 0.97 }}
          onClick={onTeam}
          className="flex items-center gap-4 rounded-2xl border-2 p-5 text-left"
          style={{
            borderColor: 'var(--neon-pink)',
            backgroundColor: 'var(--neon-pink-dim)',
          }}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(255,16,240,0.15)' }}
          >
            <Users size={22} style={{ color: 'var(--neon-pink)' }} />
          </div>
          <div>
            <p className="text-base font-bold" style={{ color: 'var(--neon-pink)' }}>
              Skrzyknij Gang / Dołącz do Bandy
            </p>
            <p className="text-text-muted text-xs">Jedna za wszystkie, wszystkie na rodeo!</p>
          </div>
          <ChevronRight size={16} className="text-text-muted ml-auto" />
        </motion.button>
      </div>
    </div>
  )
}

// ─── Team picker ──────────────────────────────────────────────────────────────

function TeamPicker({
  teams,
  newTeamName,
  onNewTeamNameChange,
  onJoinTeam,
  onCreateTeam,
  onBack,
  loading,
  hideCreate,
}: {
  teams: LiveTeam[]
  newTeamName: string
  onNewTeamNameChange: (v: string) => void
  onJoinTeam: (id: string, name: string) => void
  onCreateTeam: () => void
  onBack: () => void
  loading: boolean
  hideCreate?: boolean
}) {
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="text-center">
        <span className="text-4xl">🏇</span>
        <h2
          className="mt-2 text-3xl tracking-widest"
          style={{
            fontFamily: "'Bebas Neue',cursive",
            color: 'var(--neon-pink)',
          }}
        >
          Wybierz swoją bandę
        </h2>
      </div>
      <div className="flex w-full max-w-xs flex-col gap-2">
        <p className="text-text-muted text-[10px] font-semibold tracking-widest uppercase">
          Obecne bandy
        </p>
        <AnimatePresence>
          {teams.length === 0 && (
            <p className="text-text-muted py-3 text-center text-xs opacity-60">
              Nie ma jeszcze żadnej bandy
            </p>
          )}
          {teams.map((t) => (
            <motion.button
              key={t.teamId}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              onClick={() => onJoinTeam(t.teamId, t.teamName)}
              className="flex items-center gap-3 rounded-xl border p-4 text-left disabled:opacity-40"
              style={{
                borderColor: `${t.color}60`,
                backgroundColor: `${t.color}0f`,
              }}
            >
              <span className="text-xl">{t.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: t.color }}>
                  {t.teamName}
                </p>
                <p className="text-text-muted text-[10px]">
                  {t.memberCount} kowbojka{t.memberCount !== 1 ? 's' : ''}
                </p>
              </div>
              <span className="text-text-muted text-xs">Dołącz →</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      {!hideCreate && (
        <div className="flex w-full max-w-xs flex-col gap-2">
          <p className="text-text-muted text-[10px] font-semibold tracking-widest uppercase">
            Stwórz nową bandę
          </p>
          <div className="flex gap-2">
            <input
              id="new-team-name-input"
              type="text"
              value={newTeamName}
              onChange={(e) => onNewTeamNameChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && newTeamName.trim() && onCreateTeam()}
              maxLength={20}
              placeholder="Nazwa bandy…"
              className="bg-saloon-surface border-saloon-border text-text-primary placeholder:text-text-muted flex-1 rounded-xl border px-3 py-3 text-sm focus:outline-none"
            />
            <motion.button
              id="create-team-btn"
              disabled={!newTeamName.trim() || loading}
              whileTap={{ scale: 0.93 }}
              onClick={onCreateTeam}
              className="border-neon-pink bg-neon-pink-dim flex h-12 w-12 items-center justify-center rounded-xl border disabled:opacity-30"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" style={{ color: 'var(--neon-pink)' }} />
              ) : (
                <UserPlus size={16} style={{ color: 'var(--neon-pink)' }} />
              )}
            </motion.button>
          </div>
        </div>
      )}
      <button onClick={onBack} className="text-text-muted flex items-center gap-1.5 text-sm">
        <ArrowLeft size={14} />
        Back
      </button>
    </div>
  )
}

// ─── Waiting for host ─────────────────────────────────────────────────────────

function WaitingState({
  playerName,
  teamName,
  avatar,
}: {
  playerName: string
  teamName: string | null
  avatar: string
}) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="flex h-20 w-20 items-center justify-center rounded-full text-4xl"
        style={{
          backgroundColor: 'rgba(16,185,129,0.15)',
          border: '2px solid #10b981',
        }}
      >
        {avatar}
      </motion.div>
      <div>
        <h2
          className="text-4xl tracking-widest"
          style={{
            fontFamily: "'Bebas Neue',cursive",
            color: 'var(--sheriff-gold)',
          }}
        >
          Siodła w dłoń i otwieramy rodeo!
        </h2>
        <p className="text-text-muted mt-1 text-sm">
          Witaj, <span className="text-text-primary font-bold">{playerName}</span>!
        </p>
        {teamName && (
          <p className="mt-1 text-xs" style={{ color: 'var(--neon-pink)' }}>
            Gang: {teamName}
          </p>
        )}
      </div>
      <div className="bg-saloon-surface border-saloon-border flex w-full max-w-xs flex-col items-center gap-3 rounded-2xl border px-6 py-5">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: 'var(--neon-pink)' }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.4, delay: i * 0.25, repeat: Infinity }}
            />
          ))}
        </div>
        <p className="text-text-muted text-sm font-medium">Czekaj aż szeryf zacznie grę.</p>
        <p className="text-text-muted text-[10px] opacity-50">
          Ekran zaktualizuje się automatycznie
        </p>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function JoinGameForm() {
  const [step, setStep] = useState<Step>('pin')
  const [pin, setPin] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [newTeamName, setNewTeamName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const joiningRef = useRef(false)
  const [liveTeams, setLiveTeams] = useState<LiveTeam[]>([])
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null)
  const [gameMode, setGameMode] = useState<string>('trivia')

  // Regular game start data (quiz/never/categories)
  const [gameStartData, setGameStartData] = useState<GameStartedPayload | null>(null)
  // HighLow first round data
  const [hlRoundData, setHlRoundData] = useState<HighLowRoundStartPayload | null>(null)

  const { setHidden: setBackHidden } = useBackButton()

  useEffect(() => {
    setBackHidden(step === 'waiting' || step === 'playing')
  }, [step, setBackHidden])

  // Track pin+playerId in refs so the unload handler can read current values
  const pinRef = useRef(pin)
  const playerIdRef = useRef<string | null>(null)
  useEffect(() => {
    pinRef.current = pin
  }, [pin])
  useEffect(() => {
    playerIdRef.current = playerInfo?.playerId ?? null
  }, [playerInfo])

  useEffect(() => {
    function leave() {
      const pid = playerIdRef.current
      const p = pinRef.current
      if (!pid || !p) return
      navigator.sendBeacon(
        `/api/sessions/${p}/leave`,
        new Blob([JSON.stringify({ playerId: pid })], {
          type: 'application/json',
        })
      )
    }
    window.addEventListener('beforeunload', leave)
    return () => {
      window.removeEventListener('beforeunload', leave)
      leave() // also fires when component unmounts (navigation away)
    }
  }, [])

  useEffect(() => {
    if (step !== 'team' || !pin) return
    fetch(`/api/sessions/${pin}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.teams)) {
          const players: Array<{ teamId: string | null }> = Array.isArray(data.players)
            ? data.players
            : []
          setLiveTeams(
            data.teams.map(
              (t: { teamId: string; teamName: string; color: string; emoji: string }) => ({
                teamId: t.teamId,
                teamName: t.teamName,
                color: t.color,
                emoji: t.emoji,
                memberCount: players.filter((p) => p.teamId === t.teamId).length,
              })
            )
          )
        }
      })
      .catch(() => {})
  }, [step, pin])

  // Subscribe to channel as soon as we have a PIN and are in team or waiting step
  const shouldSubscribe = step === 'team' || step === 'waiting' || step === 'playing'

  useGameSocket(shouldSubscribe ? pin : null, {
    onPlayerJoined: useCallback((_d: PlayerJoinedPayload) => {
      // memberCount is updated authoritatively via team-updated event
    }, []),
    onTeamCreated: useCallback(
      (d: TeamCreatedPayload) =>
        setLiveTeams((p) =>
          p.some((t) => t.teamId === d.teamId) ? p : [...p, { ...d, memberCount: 1 }]
        ),
      []
    ),
    onTeamUpdated: useCallback(
      (d: import('@/lib/pusher-server').TeamUpdatedPayload) =>
        setLiveTeams((p) =>
          p.map((t) => (t.teamId === d.teamId ? { ...t, memberCount: d.memberCount } : t))
        ),
      []
    ),
    // ⬇️  THIS is the key fix — transitions player to active game
    onGameStarted: useCallback((d: GameStartedPayload) => {
      setGameStartData(d)
      setStep('playing')
    }, []),

    // HighLow game start
    onHighLowRoundStart: useCallback((d: HighLowRoundStartPayload) => {
      setHlRoundData(d)
      setStep('playing')
    }, []),
  })

  // ── Step handlers ──────────────────────────────────────────────────────────

  const handlePinSubmit = useCallback(async (submittedPin: string) => {
    setPin(submittedPin)
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/sessions/${submittedPin}`)
      if (!res.ok) throw new Error('not_found')
      const data = await res.json()
      if (data.status === 'active' || data.status === 'finished') {
        setError('Ta gra już trwa. Nie możesz teraz dołączyć.')
        return
      }
      setGameMode(data.gameMode ?? 'trivia')
      setStep('name')
    } catch {
      setError('Nie znaleziono salonu. Sprawdź kod i spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }, [])

  const doJoin = useCallback(
    async (teamId: string | null, teamName: string | null) => {
      if (joiningRef.current) return
      joiningRef.current = true
      setLoading(true)
      setError(null)
      try {
        // Bootstrap Appwrite anonymous session before joining so the Realtime
        // subscription is ready as soon as we transition to the waiting step.
        // Runs in parallel with the join POST — both are fast, and the session
        // is idempotent (subsequent calls return immediately if already active).
        if (process.env.NEXT_PUBLIC_USE_APPWRITE_REALTIME === 'true') {
          await ensureAnonymousSession().catch((err) =>
            console.warn('[Appwrite] anon session bootstrap failed:', err)
          )
        }

        const res = await fetch(`/api/sessions/${pin}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerName,
            avatar,
            teamId,
            newTeamName: teamName,
          }),
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setPlayerInfo({
          playerId: data.playerId,
          avatar: data.avatar,
          teamId: data.teamId,
          teamName,
        })
        setStep('waiting')
      } catch {
        setError('Could not join. Please try again.')
      } finally {
        setLoading(false)
        joiningRef.current = false
      }
    },
    [pin, playerName, avatar]
  )

  // ── Playing: hand off to the appropriate game screen ─────────────────────

  if (step === 'playing' && playerInfo) {
    // HighLow mode
    if (gameMode === 'highlow') {
      return (
        <PlayerHighLowScreen
          pin={pin}
          playerId={playerInfo.playerId}
          playerName={playerName}
          teamId={playerInfo.teamId}
          teamName={playerInfo.teamName}
          avatar={playerInfo.avatar}
          initialRoundData={hlRoundData}
        />
      )
    }
    // Regular quiz/never/categories mode
    if (gameStartData) {
      return (
        <PlayerGameScreen
          pin={pin}
          playerId={playerInfo.playerId}
          playerName={playerName}
          teamId={playerInfo.teamId}
          teamName={playerInfo.teamName}
          avatar={playerInfo.avatar}
          initialCard={gameStartData.card}
          initialCardIndex={gameStartData.cardIndex}
        />
      )
    }
  }

  // ── Join / waiting flow ───────────────────────────────────────────────────

  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-6">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-[-20%] left-[-10%] h-[50vw] w-[50vw] rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute right-[-10%] bottom-[-15%] h-[40vw] w-[40vw] rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <AnimatePresence mode="popLayout" initial={false}>
          {step === 'pin' && (
            <motion.div
              key="pin"
              variants={slide}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}
            >
              <PinInput
                value={pin}
                onChange={setPin}
                onSubmit={handlePinSubmit}
                loading={loading}
                error={error}
              />
            </motion.div>
          )}
          {step === 'name' && (
            <motion.div
              key="name"
              variants={slide}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}
            >
              <NameInput
                value={playerName}
                onChange={setPlayerName}
                avatar={avatar}
                onAvatarChange={setAvatar}
                onSubmit={() => setStep(gameMode === 'highlow' ? 'team' : 'mode')}
                onBack={() => setStep('pin')}
              />
            </motion.div>
          )}
          {step === 'mode' && (
            <motion.div
              key="mode"
              variants={slide}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}
            >
              <ModeSelector
                onSolo={() => doJoin(null, null)}
                onTeam={() => setStep('team')}
                onBack={() => setStep('name')}
                loading={loading}
              />
            </motion.div>
          )}
          {step === 'team' && (
            <motion.div
              key="team"
              variants={slide}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}
            >
              <TeamPicker
                teams={liveTeams}
                newTeamName={newTeamName}
                onNewTeamNameChange={setNewTeamName}
                onJoinTeam={(id, name) => doJoin(id, name)}
                onCreateTeam={() => doJoin(null, newTeamName.trim())}
                onBack={() => setStep(gameMode === 'highlow' ? 'name' : 'mode')}
                loading={loading}
                hideCreate={gameMode === 'highlow'}
              />
            </motion.div>
          )}
          {step === 'waiting' && playerInfo && (
            <motion.div
              key="waiting"
              variants={slide}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}
            >
              <WaitingState
                playerName={playerName}
                teamName={playerInfo.teamName}
                avatar={playerInfo.avatar}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {error && step !== 'pin' && (
          <p className="mt-4 text-center text-xs text-red-400">{error}</p>
        )}
      </div>
    </div>
  )
}
