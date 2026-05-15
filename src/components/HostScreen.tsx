'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useBackButton } from '@/lib/back-button-context'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Star, Users, Zap, Check, Menu, X, Flag, Dices, ChevronRight } from 'lucide-react'
import { useRealtimeGame as useGameSocket } from '@/hooks/useRealtimeGame'
import { GameCardStack } from '@/components/Card'
import { GameSummary } from '@/components/GameSummary'
import type {
  PlayerJoinedPayload,
  PlayerLeftPayload,
  VoteCastPayload,
  VotesRevealedPayload,
  NextCardPayload,
} from '@/lib/game-types'
import type { GameCard } from '@/lib/store'
import { FUNNY_NAMES } from '@/lib/games/data'

// ─── Constants ─────────────────────────────────────────────────────────────────

const AVATAR_LIST = ['🤠', '💃', '🌸', '✨', '🍾', '🎀', '👑', '🦋', '🌺', '🎉']

// ─── Types ─────────────────────────────────────────────────────────────────────

interface LivePlayer {
  playerId: string
  playerName: string
  avatar: string
  teamId: string | null
  teamName: string | null
}
interface VoteRecord {
  playerId: string
  playerName: string
  teamId: string | null
  teamName: string | null
  answerIndex: number
  answerText: string
}
interface ScoreEntry {
  playerId: string
  playerName: string
  score: number
  drinks?: number
  egzekwo?: number
  playerTeamId?: string
  playerTeamName?: string
}
interface TeamScoreEntry {
  teamId: string
  teamName: string
  score: number
}

function computeTeamScores(scores: ScoreEntry[]): TeamScoreEntry[] {
  const map = new Map<string, TeamScoreEntry>()
  scores.forEach((s) => {
    if (!s.playerTeamId || !s.playerTeamName) return
    const existing = map.get(s.playerTeamId)
    if (existing) existing.score += s.score
    else
      map.set(s.playerTeamId, {
        teamId: s.playerTeamId,
        teamName: s.playerTeamName,
        score: s.score,
      })
  })
  return Array.from(map.values())
}

type HostPhase = 'setup' | 'lobby' | 'active' | 'finished'

interface HostScreenProps {
  pin: string
  initialCards: GameCard[]
  gameMode?: string
}

const ACCENT: Record<string, string> = {
  trivia: '#8b2be2',
  QUIZ: '#8b2be2',
  NEVER: '#FFD700',
  charades: '#1e90ff',
  action: '#f59e0b',
  dare: '#ff10f0',
}

// ─── Setup view (host picks name + avatar before joining) ──────────────────────

function SetupView({
  name,
  onNameChange,
  avatar,
  onAvatarChange,
  onContinue,
}: {
  name: string
  onNameChange: (v: string) => void
  avatar: string | null
  onAvatarChange: (v: string) => void
  onContinue: () => void
}) {
  const [placeholder] = useState(
    () => `np. ${FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)]}`
  )

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-8">
      <div className="text-center">
        <h1
          className="shimmer-text text-5xl tracking-widest"
          style={{ fontFamily: "'Bebas Neue',cursive" }}
        >
          last rodeo andżeliki
        </h1>
        <p className="text-text-muted mt-1 text-xs tracking-widest uppercase">
          Najpierw wybierz swój awatar
        </p>
      </div>

      {/* Avatar picker */}
      <div className="w-full">
        <p className="text-text-muted mb-3 text-center text-[10px] font-semibold tracking-widest uppercase">
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

      {/* Name input */}
      <div className="flex w-full gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && avatar && onContinue()}
          maxLength={20}
          autoFocus
          placeholder={placeholder}
          className="bg-saloon-surface text-text-primary placeholder:text-text-muted flex-1 rounded-xl border-2 px-4 py-4 text-center text-lg font-bold transition-colors focus:outline-none"
          style={{ borderColor: name.trim() ? 'var(--neon-pink)' : 'var(--saloon-border)' }}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onNameChange(FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)])}
          className="bg-saloon-surface flex items-center justify-center rounded-xl border-2 px-4"
          style={{ borderColor: 'var(--saloon-border)' }}
          title="Losuj imię"
        >
          <Dices size={22} className="text-text-muted" />
        </motion.button>
      </div>

      <motion.button
        disabled={!name.trim() || !avatar}
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-white disabled:opacity-30"
        style={{
          background: 'linear-gradient(135deg,var(--neon-pink),#c800c8)',
          fontFamily: "'Bebas Neue',cursive",
          fontSize: '1.1rem',
          letterSpacing: '0.1em',
          boxShadow: '0 4px 30px rgba(255,16,240,0.4)',
        }}
      >
        Dalej <ChevronRight size={18} />
      </motion.button>
    </div>
  )
}

// ─── Lobby ─────────────────────────────────────────────────────────────────────

function LobbyView({
  pin,
  players,
  hostAvatar,
  hostName,
  onStart,
}: {
  pin: string
  players: LivePlayer[]
  hostAvatar: string
  hostName: string
  onStart: () => void
}) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8">
      <div className="text-center">
        <h1
          className="shimmer-text mt-2 text-6xl tracking-widest sm:text-8xl"
          style={{ fontFamily: "'Bebas Neue',cursive" }}
        >
          last rodeo andżeliki
        </h1>
      </div>

      {/* Host identity */}
      <div
        className="flex items-center gap-3 rounded-2xl border px-5 py-3"
        style={{ borderColor: 'var(--sheriff-gold)', backgroundColor: 'rgba(255,215,0,0.07)' }}
      >
        <span className="text-2xl">{hostAvatar}</span>
        <div>
          <p className="text-text-muted text-xs font-semibold tracking-widest uppercase">
            Ty (organizator)
          </p>
          <p className="text-text-primary font-bold">{hostName}</p>
        </div>
      </div>

      {/* PIN */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-text-muted text-xs font-semibold tracking-widest uppercase">KOD GRY</p>
        <div className="flex gap-3">
          {pin.split('').map((d, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
              className="pulse-pink flex h-24 w-20 items-center justify-center rounded-2xl border-2 text-5xl font-bold sm:h-32 sm:w-28 sm:text-6xl"
              style={{
                fontFamily: "'Bebas Neue',cursive",
                color: 'var(--neon-pink)',
                borderColor: 'var(--neon-pink)',
                backgroundColor: 'rgba(255,16,240,0.07)',
              }}
            >
              {d}
            </motion.div>
          ))}
        </div>
        <p className="text-text-muted text-xs">
          Gracze wchodzą na{' '}
          <span className="text-text-primary font-bold">lastrodeoandzeliki.pl/join</span>
        </p>
      </div>

      {/* Players */}
      <div className="w-full">
        <div className="mb-3 flex items-center justify-center gap-2">
          <Users size={14} style={{ color: 'var(--sheriff-gold)' }} />
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: 'var(--sheriff-gold)' }}
          >
            {players.length} {players.length === 1 ? 'cowgirl' : 'cowgirls'} w salonie
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <AnimatePresence>
            {players.map((p) => (
              <motion.div
                key={p.playerId}
                layout
                initial={{ opacity: 0, scale: 0.6, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="flex items-center gap-2 rounded-full border px-4 py-2.5"
                style={{
                  borderColor: p.teamId ? 'var(--neon-pink)' : 'var(--saloon-border)',
                  backgroundColor: p.teamId ? 'rgba(255,16,240,0.08)' : 'var(--saloon-surface)',
                }}
              >
                <span className="text-lg">{p.avatar}</span>
                <p className="text-text-primary text-sm leading-snug font-bold">{p.playerName}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {players.length === 0 && (
            <p className="text-text-muted text-sm opacity-50">Oczekuję na kowbojki …</p>
          )}
        </div>
      </div>

      <motion.button
        id="host-start-btn"
        disabled={players.length < 1}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="flex items-center gap-3 rounded-2xl px-10 py-5 text-white disabled:opacity-30"
        style={{
          background: 'linear-gradient(135deg,var(--neon-pink),#c800c8)',
          boxShadow: '0 4px 40px rgba(255,16,240,0.5)',
          fontFamily: "'Bebas Neue',cursive",
          fontSize: '1.15rem',
          letterSpacing: '0.15em',
        }}
      >
        <Play size={22} /> Rozpocznij grę
      </motion.button>
    </div>
  )
}

// ─── Active game view ──────────────────────────────────────────────────────────

function ActiveCardView({
  card,
  cardIndex,
  totalCards,
  players,
  votes,
  isRevealed,
  revealedVotes,
  scores,
  countdown,
  hostPlayerId,
  hostHasVoted,
  onHostVote,
  hostLoading,
}: {
  card: GameCard
  cardIndex: number
  totalCards: number
  players: LivePlayer[]
  votes: VoteCastPayload[]
  isRevealed: boolean
  revealedVotes: VoteRecord[]
  scores: ScoreEntry[]
  countdown: number | null
  hostPlayerId: string | null
  hostHasVoted: boolean
  onHostVote: (answerIndex: number, answerText: string) => void
  hostLoading: boolean
}) {
  const hostPlayer = hostPlayerId
    ? (players.find((p) => p.playerId === hostPlayerId) ?? null)
    : null

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center gap-6">
      {/* Card — always face-up on host screen */}
      <GameCardStack
        card={card}
        cardsLeft={totalCards - cardIndex}
        isFlipped={true}
        isRevealed={isRevealed}
        onFlip={() => {}}
      />

      {/* Avatar vote grid */}
      <div className="flex max-w-sm flex-wrap justify-center gap-3">
        {players.map((p) => {
          const hasVoted = votes.some((v) => v.playerId === p.playerId)
          const isHost = p.playerId === hostPlayerId
          return (
            <div key={p.playerId} className="relative flex flex-col items-center gap-1">
              <motion.div
                animate={{
                  borderColor: hasVoted ? 'var(--neon-pink)' : 'var(--saloon-border)',
                  backgroundColor: hasVoted ? 'rgba(255,16,240,0.12)' : 'rgba(255,220,180,0.07)',
                }}
                transition={{ duration: 0.3 }}
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 text-2xl"
              >
                {p.avatar}
              </motion.div>
              {isHost && (
                <span className="text-text-muted text-[8px] font-bold tracking-wider uppercase">
                  ty
                </span>
              )}
              <AnimatePresence>
                {hasVoted && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full"
                    style={{
                      backgroundColor: 'var(--neon-pink)',
                      boxShadow: '0 0 8px rgba(255,16,240,0.7)',
                    }}
                  >
                    <Check size={11} color="white" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      {/* Host voting buttons */}
      <AnimatePresence>
        {hostPlayer && !isRevealed && (
          <motion.div
            key="host-vote"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full max-w-sm"
          >
            {hostHasVoted ? (
              <div
                className="flex items-center justify-center gap-2 rounded-2xl border py-3"
                style={{ borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)' }}
              >
                <Check size={14} color="#10b981" />
                <span className="text-sm font-semibold" style={{ color: '#10b981' }}>
                  Twój głos zapisany
                </span>
              </div>
            ) : card.type === 'NEVER' ? (
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={hostLoading}
                  onClick={() => onHostVote(-2, '🚫 Nie piję')}
                  className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl border-2 py-4 font-black disabled:opacity-40"
                  style={{
                    borderColor: 'rgba(255,220,180,0.25)',
                    backgroundColor: 'rgba(255,220,180,0.06)',
                    color: 'rgba(255,220,180,0.8)',
                    fontFamily: "'Bebas Neue',cursive",
                    letterSpacing: '0.08em',
                    fontSize: '0.95rem',
                  }}
                >
                  <span className="text-xl">🚫</span>
                  NIE PIJĘ
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={hostLoading}
                  onClick={() => onHostVote(-1, '🍺 Piję')}
                  className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl border-2 py-4 font-black disabled:opacity-40"
                  style={{
                    borderColor: 'var(--neon-pink)',
                    backgroundColor: 'rgba(255,16,240,0.1)',
                    color: 'var(--neon-pink)',
                    boxShadow: '0 0 20px rgba(255,16,240,0.2)',
                    fontFamily: "'Bebas Neue',cursive",
                    letterSpacing: '0.08em',
                    fontSize: '0.95rem',
                  }}
                >
                  <span className="text-xl">🍺</span>
                  PIJĘ
                </motion.button>
              </div>
            ) : card.options && card.options.length > 0 ? (
              <div className="flex flex-col gap-2">
                {card.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx)
                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      disabled={hostLoading}
                      onClick={() => onHostVote(idx, `${letter}: ${opt}`)}
                      className="flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left disabled:opacity-40"
                      style={{
                        borderColor: 'rgba(255,220,180,0.15)',
                        backgroundColor: 'rgba(255,220,180,0.05)',
                      }}
                      whileHover={{
                        borderColor: 'var(--neon-pink)',
                        backgroundColor: 'rgba(255,16,240,0.08)',
                        transition: { duration: 0.15 },
                      }}
                    >
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-black"
                        style={{
                          backgroundColor: 'rgba(255,16,240,0.15)',
                          color: 'var(--neon-pink)',
                          fontFamily: "'Bebas Neue',cursive",
                        }}
                      >
                        {letter}
                      </span>
                      <span className="text-text-primary text-sm leading-snug font-semibold">
                        {opt}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            ) : (
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={hostLoading}
                  onClick={() => onHostVote(-2, '❌ Nie')}
                  className="flex flex-1 items-center justify-center rounded-2xl border-2 border-red-500/40 bg-red-500/10 py-4 text-sm font-bold text-red-400 disabled:opacity-40"
                >
                  Nie
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={hostLoading}
                  onClick={() => onHostVote(-1, '✅ Tak')}
                  className="flex flex-1 items-center justify-center rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 py-4 text-sm font-bold text-emerald-400 disabled:opacity-40"
                >
                  Tak!
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revealed results */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex w-full max-w-sm flex-col gap-2"
        >
          <p className="text-text-muted text-center text-xs font-semibold tracking-widest uppercase">
            Wyniki
          </p>
          {revealedVotes.map((v, i) => {
            const isDrinking = card.type === 'NEVER' && v.answerIndex === -1
            const isNotDrinking = card.type === 'NEVER' && v.answerIndex === -2
            const isCorrect =
              card.type !== 'NEVER' &&
              v.answerIndex >= 0 &&
              card.options?.[v.answerIndex] === card.answer
            return (
              <motion.div
                key={v.playerId}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 rounded-xl border p-3"
                style={{
                  borderColor: 'var(--saloon-border)',
                  backgroundColor: 'var(--saloon-surface)',
                }}
              >
                <span className="text-text-primary flex-1 text-sm font-semibold">
                  {v.teamName ?? v.playerName}
                  {v.playerId === hostPlayerId && (
                    <span className="text-text-muted ml-1 text-[10px]">(ty)</span>
                  )}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-bold"
                  style={{
                    backgroundColor:
                      isCorrect || isDrinking
                        ? 'rgba(16,185,129,0.15)'
                        : isNotDrinking ||
                            (card.type !== 'NEVER' && !isCorrect && v.answerIndex >= 0)
                          ? 'rgba(239,68,68,0.15)'
                          : 'rgba(255,220,180,0.1)',
                    color:
                      isCorrect || isDrinking
                        ? '#10b981'
                        : isNotDrinking ||
                            (card.type !== 'NEVER' && !isCorrect && v.answerIndex >= 0)
                          ? '#ef4444'
                          : 'rgba(255,220,180,0.7)',
                  }}
                >
                  {v.answerText}
                </span>
              </motion.div>
            )
          })}
          {scores.filter((s) => s.score > 0).length > 0 && (
            <div className="border-saloon-border mt-1 flex flex-col gap-1.5 border-t pt-3">
              <p className="text-text-muted mb-1 flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase">
                <Star
                  size={10}
                  fill="var(--sheriff-gold)"
                  style={{ color: 'var(--sheriff-gold)' }}
                />
                Ranking
              </p>
              {[...scores]
                .filter((s) => s.score > 0)
                .sort((a, b) => b.score - a.score)
                .map((s, i) => (
                  <div key={s.playerId} className="flex items-center gap-2 text-sm">
                    <span className="text-text-muted w-4 text-center text-[10px] font-bold">
                      {i + 1}
                    </span>
                    <span className="text-text-primary flex-1 truncate text-xs font-semibold">
                      {s.playerName}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star
                        size={10}
                        fill="var(--sheriff-gold)"
                        style={{ color: 'var(--sheriff-gold)' }}
                      />
                      <span className="text-xs font-bold" style={{ color: 'var(--sheriff-gold)' }}>
                        {s.score}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Status / countdown */}
      <div className="flex h-8 items-center justify-center">
        {isRevealed && countdown !== null ? (
          <motion.p
            key={countdown}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-bold tabular-nums"
            style={{ color: 'var(--neon-pink)' }}
          >
            Następna karta za {countdown}…
          </motion.p>
        ) : !isRevealed && votes.length < players.length && players.length > 0 ? (
          <p className="text-text-muted text-xs">
            Czeka na{' '}
            <span className="text-text-primary font-bold">{players.length - votes.length}</span>{' '}
            {players.length - votes.length === 1 ? 'głos' : 'głosy'}
          </p>
        ) : null}
      </div>
    </div>
  )
}

// ─── Main HostScreen ──────────────────────────────────────────────────────────

export default function HostScreen({ pin, initialCards }: HostScreenProps) {
  const { setHidden: setBackHidden } = useBackButton()
  useEffect(() => {
    setBackHidden(true)
    return () => setBackHidden(false)
  }, [setBackHidden])

  // ── Host identity ────────────────────────────────────────────────────────────
  const [hostName, setHostName] = useState('')
  const [hostAvatar, setHostAvatar] = useState<string | null>(null)
  const [hostPlayerId, setHostPlayerId] = useState<string | null>(null)
  const [hostHasVoted, setHostHasVoted] = useState(false)
  const [hostLoading, setHostLoading] = useState(false)

  // ── Game state ───────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<HostPhase>('setup')
  const [players, setPlayers] = useState<LivePlayer[]>([])
  const [cardIndex, setCardIndex] = useState(0)
  const [currentVotes, setCurrentVotes] = useState<VoteCastPayload[]>([])
  const [isRevealed, setIsRevealed] = useState(false)
  const [revealedVotes, setRevealedVotes] = useState<VoteRecord[]>([])
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [teamScores, setTeamScores] = useState<TeamScoreEntry[]>([])
  const [countdown, setCountdown] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const currentCard = initialCards[cardIndex]

  // Hydrate on mount
  useEffect(() => {
    fetch(`/api/sessions/${pin}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return
        if (data.players?.length) setPlayers(data.players)
        if (data.status === 'active') setPhase('active')
        if (data.status === 'finished') setPhase('finished')
        if (typeof data.cardIndex === 'number') setCardIndex(data.cardIndex)
      })
      .catch(() => {})
  }, [pin])

  // Poll in lobby
  useEffect(() => {
    if (phase !== 'lobby') return
    const id = setInterval(() => {
      fetch(`/api/sessions/${pin}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.players) setPlayers(data.players)
        })
        .catch(() => {})
    }, 3000)
    return () => clearInterval(id)
  }, [phase, pin])

  // Poll during active — fallback for missed Realtime events
  useEffect(() => {
    if (phase !== 'active') return
    const id = setInterval(() => {
      fetch(`/api/sessions/${pin}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!data?.votes) return
          setCardIndex((ci) => {
            const votesForCard = (
              data.votes as Array<{ playerId: string; cardIndex: number }>
            ).filter((v) => v.cardIndex === ci)
            setCurrentVotes((prev) => {
              const existing = new Set(prev.map((v) => v.playerId))
              const incoming = votesForCard.filter((v) => !existing.has(v.playerId))
              return incoming.length ? ([...prev, ...incoming] as typeof prev) : prev
            })
            return ci
          })
        })
        .catch(() => {})
    }, 3000)
    return () => clearInterval(id)
  }, [phase, pin])

  useGameSocket(pin, {
    onPlayerJoined: useCallback((d: PlayerJoinedPayload) => {
      setPlayers((p) => (p.some((x) => x.playerId === d.playerId) ? p : [...p, d]))
    }, []),
    onPlayerLeft: useCallback((d: PlayerLeftPayload) => {
      setPlayers((p) => p.filter((x) => x.playerId !== d.playerId))
    }, []),
    onVoteCast: useCallback((d: VoteCastPayload) => {
      setCurrentVotes((p) => (p.some((x) => x.playerId === d.playerId) ? p : [...p, d]))
    }, []),
    onVotesRevealed: useCallback((d: VotesRevealedPayload) => {
      setRevealedVotes(d.votes)
      setScores(d.scores)
      setTeamScores(d.teamScores ?? [])
      setIsRevealed(true)
    }, []),
    onNextCard: useCallback((d: NextCardPayload) => {
      setCardIndex(d.cardIndex)
      setCurrentVotes([])
      setIsRevealed(false)
      setRevealedVotes([])
      setCountdown(null)
      setHostHasVoted(false)
    }, []),
    onGameStarted: useCallback(() => setPhase('active'), []),
    onGameFinished: useCallback(() => setPhase('finished'), []),
  })

  // ── Actions ──────────────────────────────────────────────────────────────────

  const handleSetupComplete = useCallback(() => {
    if (!hostName.trim() || !hostAvatar) return
    setPhase('lobby')
  }, [hostName, hostAvatar])

  const handleStart = useCallback(async () => {
    const firstCard = initialCards[0]
    if (!firstCard || !hostName.trim() || !hostAvatar) return

    // Join host as a player first
    try {
      const res = await fetch(`/api/sessions/${pin}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: hostName.trim(), avatar: hostAvatar }),
      })
      if (res.ok) {
        const data = await res.json()
        setHostPlayerId(data.playerId)
        // Optimistically add host to local player list
        setPlayers((p) => {
          if (p.some((x) => x.playerId === data.playerId)) return p
          return [
            ...p,
            {
              playerId: data.playerId,
              playerName: hostName.trim(),
              avatar: hostAvatar,
              teamId: null,
              teamName: null,
            },
          ]
        })
      }
    } catch {
      // Continue even if join fails — game still works for others
    }

    // Start the game
    await fetch(`/api/sessions/${pin}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start', card: firstCard }),
    })
    setPhase('active')
  }, [pin, initialCards, hostName, hostAvatar])

  const handleReveal = useCallback(async () => {
    const card = initialCards[cardIndex]
    const votes: VoteRecord[] = currentVotes.map((v) => ({ ...v }))
    let updatedScores = [...scores]

    if (card.type === 'QUIZ' && card.answer) {
      votes.forEach((v) => {
        const isCorrect = card.options?.[v.answerIndex] === card.answer
        if (!isCorrect) return
        const idx = updatedScores.findIndex((s) => s.playerId === v.playerId)
        if (idx > -1) {
          updatedScores[idx] = { ...updatedScores[idx], score: updatedScores[idx].score + 1 }
        } else {
          updatedScores.push({
            playerId: v.playerId,
            playerName: v.playerName,
            score: 1,
            drinks: 0,
            playerTeamId: v.teamId ?? undefined,
            playerTeamName: v.teamName ?? undefined,
          })
        }
      })
    }

    if (card.type === 'NEVER') {
      votes.forEach((v) => {
        if (v.answerIndex !== -1) return
        const idx = updatedScores.findIndex((s) => s.playerId === v.playerId)
        if (idx > -1) {
          updatedScores[idx] = {
            ...updatedScores[idx],
            drinks: (updatedScores[idx].drinks ?? 0) + 1,
          }
        } else {
          updatedScores.push({
            playerId: v.playerId,
            playerName: v.playerName,
            score: 0,
            drinks: 1,
            playerTeamId: v.teamId ?? undefined,
            playerTeamName: v.teamName ?? undefined,
          })
        }
      })
    }

    const updatedTeamScores = computeTeamScores(updatedScores)
    await fetch(`/api/sessions/${pin}/reveal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardIndex,
        correctAnswer: card.answer,
        votes,
        scores: updatedScores,
        teamScores: updatedTeamScores,
      }),
    })
    setIsRevealed(true)
    setRevealedVotes(votes)
    setScores(updatedScores)
    setTeamScores(updatedTeamScores)
  }, [pin, cardIndex, currentVotes, scores, initialCards])

  const handleNextCard = useCallback(async () => {
    const next = cardIndex + 1
    if (next >= initialCards.length) {
      await fetch(`/api/sessions/${pin}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'finish', scores, teamScores }),
      })
      setPhase('finished')
      return
    }
    await fetch(`/api/sessions/${pin}/next-card`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardIndex: next, card: initialCards[next] }),
    })
    setCardIndex(next)
    setCurrentVotes([])
    setIsRevealed(false)
    setRevealedVotes([])
    setCountdown(null)
    setHostHasVoted(false)
  }, [pin, cardIndex, initialCards, scores, teamScores])

  const handleForceFinish = useCallback(async () => {
    setMenuOpen(false)
    setPhase('finished')
    try {
      await fetch(`/api/sessions/${pin}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'finish', scores, teamScores }),
      })
    } catch (err) {
      console.error('[handleForceFinish]', err)
    }
  }, [pin, scores, teamScores])

  const handleHostVote = useCallback(
    async (answerIndex: number, answerText: string) => {
      if (!hostPlayerId || hostHasVoted || hostLoading) return
      setHostLoading(true)
      try {
        await fetch(`/api/sessions/${pin}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerId: hostPlayerId,
            playerName: hostName,
            teamId: null,
            teamName: null,
            cardIndex,
            answerIndex,
            answerText,
          }),
        })
        setHostHasVoted(true)
      } finally {
        setHostLoading(false)
      }
    },
    [hostPlayerId, hostHasVoted, hostLoading, pin, hostName, cardIndex]
  )

  // ── Auto-reveal when all players voted ───────────────────────────────────────

  const handleRevealRef = useRef(handleReveal)
  useEffect(() => {
    handleRevealRef.current = handleReveal
  })

  useEffect(() => {
    if (phase !== 'active' || isRevealed || players.length === 0) return
    if (currentVotes.length < players.length) return
    const timer = setTimeout(() => handleRevealRef.current(), 600)
    return () => clearTimeout(timer)
  }, [currentVotes.length, players.length, phase, isRevealed])

  // ── Auto-next with countdown ──────────────────────────────────────────────────

  const handleNextCardRef = useRef(handleNextCard)
  useEffect(() => {
    handleNextCardRef.current = handleNextCard
  })

  useEffect(() => {
    if (!isRevealed) {
      setCountdown(null)
      return
    }
    setCountdown(4)
    let n = 4
    const tick = setInterval(() => {
      n -= 1
      if (n <= 0) {
        clearInterval(tick)
        setCountdown(null)
        handleNextCardRef.current()
      } else {
        setCountdown(n)
      }
    }, 1000)
    return () => clearInterval(tick)
  }, [isRevealed, cardIndex])

  // ── Derived ───────────────────────────────────────────────────────────────────

  const drinksScores = scores
    .filter((s) => (s.drinks ?? 0) > 0)
    .map((s) => ({ id: s.playerId, name: s.playerName, score: s.drinks! }))

  const egzekwoScores = scores
    .filter((s) => (s.egzekwo ?? 0) > 0)
    .map((s) => ({ id: s.playerId, name: s.playerName, score: s.egzekwo! }))

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-dvh w-full flex-col">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-[-20%] left-[-15%] h-[60vw] w-[60vw] rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute right-[-15%] bottom-[-20%] h-[60vw] w-[60vw] rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Header — hidden in setup */}
      {phase !== 'setup' && (
        <div
          className="relative z-20 shrink-0 border-b"
          style={{ borderColor: 'rgba(255,220,180,0.1)' }}
        >
          <div className="mx-auto grid max-w-5xl grid-cols-3 items-center px-6 py-4">
            <div className="flex items-center gap-2">
              <Zap size={14} style={{ color: 'var(--neon-pink)' }} />
              <span className="text-text-muted text-xs font-semibold tracking-widest uppercase">
                PIN: <span className="text-text-primary">{pin}</span>
              </span>
            </div>

            <div className="flex items-center justify-center gap-2">
              {phase === 'active' && currentCard && (
                <>
                  <span
                    className="rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase"
                    style={{
                      color: ACCENT[currentCard.type] ?? 'var(--neon-pink)',
                      borderColor: `${ACCENT[currentCard.type] ?? 'var(--neon-pink)'}55`,
                      backgroundColor: `${ACCENT[currentCard.type] ?? 'var(--neon-pink)'}15`,
                    }}
                  >
                    {currentCard.type}
                  </span>
                  <span className="text-text-muted text-xs font-semibold tabular-nums">
                    {cardIndex + 1} / {initialCards.length}
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              {phase === 'active' && (
                <span className="text-text-muted text-xs font-semibold tabular-nums">
                  <span className="text-text-primary">{currentVotes.length}</span>
                  {' / '}
                  <span className="text-text-primary">{players.length}</span>
                  {' głosów'}
                </span>
              )}
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 animate-pulse rounded-full"
                  style={{ backgroundColor: 'var(--neon-pink)' }}
                />
                <span className="text-text-muted text-xs font-bold tracking-tighter">LIVE</span>
              </div>

              <div ref={menuRef} className="relative">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border"
                  style={{
                    borderColor: 'rgba(255,220,180,0.18)',
                    backgroundColor: 'rgba(255,220,180,0.05)',
                    color: 'rgba(255,220,180,0.65)',
                  }}
                >
                  {menuOpen ? <X size={15} /> : <Menu size={15} />}
                </motion.button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-10 right-0 z-[100] min-w-[180px] rounded-2xl border p-1.5 shadow-xl"
                      style={{
                        borderColor: 'rgba(255,220,180,0.15)',
                        backgroundColor: 'rgba(13,8,24,0.95)',
                        backdropFilter: 'blur(16px)',
                      }}
                    >
                      {phase !== 'finished' ? (
                        <button
                          onClick={handleForceFinish}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold"
                          style={{ color: '#ef4444' }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = 'transparent')
                          }
                        >
                          <Flag size={14} />
                          Zakończ grę
                        </button>
                      ) : (
                        <p className="text-text-muted px-4 py-3 text-xs">Gra zakończona</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto p-6 sm:p-12">
        <div className="mx-auto w-full max-w-5xl">
          <AnimatePresence mode="wait">
            {phase === 'setup' && (
              <motion.div
                key="setup"
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <SetupView
                  name={hostName}
                  onNameChange={setHostName}
                  avatar={hostAvatar}
                  onAvatarChange={setHostAvatar}
                  onContinue={handleSetupComplete}
                />
              </motion.div>
            )}

            {phase === 'lobby' && (
              <motion.div
                key="lobby"
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <LobbyView
                  pin={pin}
                  players={players}
                  hostAvatar={hostAvatar!}
                  hostName={hostName}
                  onStart={handleStart}
                />
              </motion.div>
            )}

            {phase === 'active' && currentCard && (
              <motion.div
                key={`card-${cardIndex}`}
                className="w-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
              >
                <ActiveCardView
                  card={currentCard}
                  cardIndex={cardIndex}
                  totalCards={initialCards.length}
                  players={players}
                  votes={currentVotes}
                  isRevealed={isRevealed}
                  revealedVotes={revealedVotes}
                  scores={scores}
                  countdown={countdown}
                  hostPlayerId={hostPlayerId}
                  hostHasVoted={hostHasVoted}
                  onHostVote={handleHostVote}
                  hostLoading={hostLoading}
                />
              </motion.div>
            )}

            {phase === 'finished' && (
              <motion.div
                key="finished"
                className="w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <GameSummary
                  scores={scores.map((s) => ({
                    id: s.playerId,
                    name: s.playerName,
                    score: s.score,
                  }))}
                  teamScores={
                    teamScores.length > 0
                      ? teamScores.map((t) => ({ id: t.teamId, name: t.teamName, score: t.score }))
                      : undefined
                  }
                  drinksScores={drinksScores.length > 0 ? drinksScores : undefined}
                  egzekwoScores={egzekwoScores.length > 0 ? egzekwoScores : undefined}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
