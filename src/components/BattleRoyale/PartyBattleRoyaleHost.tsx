'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Clock, Flag, Loader2, Menu, Skull, X, Zap } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { BattleRoyaleGameOverPanel } from '@/components/BattleRoyale/BattleRoyaleGameOverPanel'
import { LobbyView } from '@/components/Host/LobbyView'
import { SetupView } from '@/components/Host/SetupView'
import { PlayerAvatar } from '@/components/PlayerAvatar'
import { Button } from '@/components/ui/button'
import { BR_AUTO_NEXT_SECONDS } from '@/config/game'
import { ALL_CATEGORIES_ID, PREMIUM_CATEGORY_IDS } from '@/config/games/category-selection'
import { CategoryPicker } from '@/components/HostSetup/HostPickers'
import { useAutoCountdown } from '@/hooks/useAutoCountdown'
import { usePartyConnection } from '@/hooks/usePartyConnection'
import { useBackButton } from '@/lib/back-button-context'
import type {
  BRAnswerSubmittedPayload,
  BRRoundRevealPayload,
  BRRoundStartPayload,
  PlayerJoinedPayload,
  PlayerLeftPayload,
} from '@/lib/game-types'
import { readHostProfile, updateHostProfile } from '@/lib/party-ticket-client'
import type { SessionPlayer } from '@/lib/session-types'

type BRPhase = 'setup' | 'category-setup' | 'lobby' | 'question' | 'reveal' | 'gameover'

interface BRRevealResult {
  questionText: string
  correctAnswer: string
  answers: Array<{
    playerId: string
    playerName: string
    avatar: string
    answerIndex: number
    answerText: string
    answeredAt: number
    isCorrect: boolean
    isEliminated: boolean
  }>
  eliminatedThisRound: string[]
  survivingPlayers: string[]
  gameOver: boolean
  winner?: string
}

interface Props {
  pin: string
  partyToken: string
}

export function PartyBattleRoyaleHost({ pin, partyToken }: Props) {
  const { setHidden: setBackHidden } = useBackButton()
  useEffect(() => {
    setBackHidden(true)
    return () => setBackHidden(false)
  }, [setBackHidden])

  // Host identity
  const [hostName, setHostName] = useState('')
  const [hostAvatar, setHostAvatar] = useState<string | null>(null)

  useEffect(() => {
    const stored = readHostProfile(pin)
    if (stored?.hostName) setHostName(stored.hostName)
    if (stored?.hostAvatar) setHostAvatar(stored.hostAvatar)
  }, [pin])

  // Game state
  const [phase, setPhase] = useState<BRPhase>('setup')
  const [players, setPlayers] = useState<SessionPlayer[]>([])
  const [eliminatedIds, setEliminatedIds] = useState<Set<string>>(new Set())
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set())
  const [questionIndex, setQuestionIndex] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [timerDuration, setTimerDuration] = useState(20)
  const [timerLeft, setTimerLeft] = useState(20)
  const [timerDone, setTimerDone] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState<{
    text: string
    options: string[]
  } | null>(null)
  const [revealData, setRevealData] = useState<BRRevealResult | null>(null)
  const [winner, setWinner] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [finishLoading, setFinishLoading] = useState(false)
  const [brSetupLoading, setBrSetupLoading] = useState(false)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const startTimer = useCallback((duration: number, startTime?: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    const elapsed = startTime ? Math.floor((Date.now() - startTime) / 1000) : 0
    let remaining = Math.max(0, duration - elapsed)
    setTimerLeft(remaining)
    setTimerDone(remaining === 0)
    if (remaining <= 0) return

    timerRef.current = setInterval(() => {
      remaining -= 1
      setTimerLeft(remaining)
      if (remaining <= 0) {
        clearInterval(timerRef.current!)
        setTimerDone(true)
      }
    }, 1000)
  }, [])

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current)
    },
    [],
  )

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const handlers = useMemo(
    () => ({
      onPlayerJoined: (d: PlayerJoinedPayload) => {
        setPlayers((p) => (p.some((x) => x.playerId === d.playerId) ? p : [...p, d]))
      },
      onPlayerLeft: (d: PlayerLeftPayload) => {
        setPlayers((p) => p.filter((x) => x.playerId !== d.playerId))
      },
      onBRAnswerSubmitted: (d: BRAnswerSubmittedPayload) => {
        setAnsweredIds((prev) => new Set([...prev, d.playerId]))
      },
      onBRRoundStart: (d: BRRoundStartPayload) => {
        setCurrentQuestion({ text: d.questionText, options: d.options })
        setQuestionIndex(d.questionIndex)
        setTotalQuestions(d.totalQuestions ?? 0)
        setTimerDuration(d.timerDuration)
        setAnsweredIds(new Set())
        setRevealData(null)
        setTimerDone(false)
        setPhase('question')
        startTimer(d.timerDuration, d.roundStartTime)
      },
      onBRRoundReveal: (d: BRRoundRevealPayload) => {
        if (timerRef.current) clearInterval(timerRef.current)
        setRevealData(d)
        setEliminatedIds((prev) => new Set([...prev, ...d.eliminatedThisRound]))
        if (d.gameOver) {
          setWinner(d.winner)
          setPhase('gameover')
        } else {
          setPhase('reveal')
        }
      },
      onGameFinished: () => {
        if (timerRef.current) clearInterval(timerRef.current)
        setWinner(undefined)
        setPhase('gameover')
      },
    }),
    [startTimer],
  )

  const { send, snapshot } = usePartyConnection({ pin, partyToken, role: 'host', handlers })

  // Snapshot hydration on (re)connect
  useEffect(() => {
    if (!snapshot) return

    setPlayers(snapshot.players as SessionPlayer[])

    if (snapshot.status === 'finished') {
      setPhase('gameover')
      return
    }

    const br = snapshot.battleRoyale
    if (br) {
      setEliminatedIds(new Set(br.eliminatedPlayers))
      setQuestionIndex(br.questionIndex)
      setTotalQuestions(br.totalQuestions)
      setTimerDuration(br.timerDuration)
      setAnsweredIds(new Set(br.answeredPlayerIds ?? []))
      if (br.questionText && br.options) {
        setCurrentQuestion({ text: br.questionText, options: br.options })
      }
      if (br.roundStartTime) {
        startTimer(br.timerDuration, br.roundStartTime)
      }
      if (snapshot.status === 'active') {
        setPhase('question')
      } else {
        // BR was set up but game hasn't started
        setPhase((p) => (p === 'setup' || p === 'category-setup' ? 'lobby' : p))
      }
      return
    }

    if (snapshot.status === 'waiting' && snapshot.players.length > 0) {
      setPhase((p) => (p === 'setup' ? 'lobby' : p))
    }
  }, [snapshot, startTimer])

  // ── Actions ─────────────────────────────────────────────────────────────────

  const handleSetupComplete = useCallback(() => {
    if (!hostName.trim() || !hostAvatar) return
    updateHostProfile(pin, { hostName: hostName.trim(), hostAvatar })
    setPhase('category-setup')
  }, [pin, hostName, hostAvatar])

  const handleCategorySelect = useCallback(
    async (categoryId: string) => {
      if (!send || brSetupLoading) return
      setBrSetupLoading(true)
      try {
        const result = await send({
          type: 'host:br-setup',
          categoryId,
          timerDuration,
        })
        if (!result.ok) {
          console.error('[host:br-setup] rejected:', result.error)
          return
        }
        setPhase('lobby')
      } finally {
        setBrSetupLoading(false)
      }
    },
    [send, brSetupLoading, timerDuration],
  )

  const handleRevealRef = useRef<(() => Promise<void>) | null>(null)
  const handleReveal = useCallback(async () => {
    if (loading || !send) return
    setLoading(true)
    if (timerRef.current) clearInterval(timerRef.current)
    try {
      const result = await send({ type: 'host:br-reveal' })
      if (!result.ok) console.error('[host:br-reveal] rejected:', result.error)
    } finally {
      setLoading(false)
    }
  }, [loading, send])
  useEffect(() => {
    handleRevealRef.current = handleReveal
  }, [handleReveal])

  const alivePlayers = players.filter((p) => !eliminatedIds.has(p.playerId))
  const allAnswered =
    phase === 'question' && answeredIds.size >= alivePlayers.length && alivePlayers.length > 0

  useEffect(() => {
    if (!allAnswered) return
    const t = setTimeout(() => handleRevealRef.current?.(), 600)
    return () => clearTimeout(t)
  }, [allAnswered])

  const handleNextRoundRef = useRef<(() => Promise<void>) | null>(null)
  const handleNextRound = useCallback(async () => {
    if (loading || !send) return
    setLoading(true)
    try {
      const nextResult = await send({ type: 'host:br-next' })
      if (!nextResult.ok) {
        console.error('[host:br-next] rejected:', nextResult.error)
        return
      }

      // br-next may signal the game is over via gameover event; if not, start next round
      setQuestionIndex((i) => i + 1)
      const roundResult = await send({ type: 'host:br-round' })
      if (!roundResult.ok) {
        console.error('[host:br-round] rejected:', roundResult.error)
        return
      }
    } finally {
      setLoading(false)
    }
  }, [loading, send, timerDuration, startTimer])
  useEffect(() => {
    handleNextRoundRef.current = handleNextRound
  }, [handleNextRound])

  const nextCountdown = useAutoCountdown({
    active: phase === 'reveal',
    seconds: BR_AUTO_NEXT_SECONDS,
    resetKey: questionIndex,
    onComplete: () => handleNextRoundRef.current?.(),
  })

  const handleStart = useCallback(async () => {
    if (loading || !send) return
    setLoading(true)
    try {
      const result = await send({ type: 'host:br-round' })
      if (!result.ok) {
        console.error('[host:br-round] rejected:', result.error)
        return
      }
    } finally {
      setLoading(false)
    }
  }, [loading, send, timerDuration, startTimer])

  const handleFinish = useCallback(async () => {
    if (finishLoading || !send) return
    setFinishLoading(true)
    setMenuOpen(false)
    if (timerRef.current) clearInterval(timerRef.current)
    try {
      await send({ type: 'host:finish', scores: [], teamScores: [], showPlayerPoints: false })
      setWinner(undefined)
      setPhase('gameover')
    } finally {
      setFinishLoading(false)
    }
  }, [finishLoading, send])

  const handleNewGame = useCallback(() => {
    window.location.href = '/graj/host'
  }, [])

  const timerPct = (timerLeft / timerDuration) * 100
  const sortedRevealAnswers = revealData
    ? [...revealData.answers].sort((a, b) => {
        if (a.answeredAt === -1 && b.answeredAt === -1) return 0
        if (a.answeredAt === -1) return 1
        if (b.answeredAt === -1) return -1
        return a.answeredAt - b.answeredAt
      })
    : []
  const firstRevealAnswerAt = sortedRevealAnswers.find((a) => a.answeredAt !== -1)?.answeredAt
  const finalPlayers = [...players]
    .sort((a, b) => {
      const aWinner = winner === a.playerName
      const bWinner = winner === b.playerName
      if (aWinner !== bWinner) return aWinner ? -1 : 1
      const aAlive =
        revealData?.survivingPlayers.includes(a.playerId) ?? !eliminatedIds.has(a.playerId)
      const bAlive =
        revealData?.survivingPlayers.includes(b.playerId) ?? !eliminatedIds.has(b.playerId)
      if (aAlive !== bAlive) return aAlive ? -1 : 1
      return a.playerName.localeCompare(b.playerName)
    })
    .map((player) => ({
      id: player.playerId,
      name: player.playerName,
      avatar: player.avatar,
      isHost: false,
      isWinner: winner === player.playerName,
      survived:
        revealData?.survivingPlayers.includes(player.playerId) ??
        !eliminatedIds.has(player.playerId),
    }))

  // ── Category setup: render full-screen picker ────────────────────────────────
  if (phase === 'category-setup') {
    return (
      <CategoryPicker
        onSelect={handleCategorySelect}
        onBack={() => setPhase('setup')}
        loading={brSetupLoading}
        includeAllOption
        premiumCategoryIds={PREMIUM_CATEGORY_IDS}
      />
    )
  }

  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-dvh w-full flex-col">
      {phase !== 'setup' && (
        <div
          className="relative z-20 shrink-0 border-b"
          style={{ borderColor: 'rgba(255,220,180,0.1)' }}
        >
          <div className="mx-auto grid max-w-5xl grid-cols-3 items-center px-6 py-4">
            <div className="flex min-w-0 items-center gap-2">
              <Zap size={14} style={{ color: '#ef4444' }} />
              <span className="text-text-muted truncate text-xs font-semibold tracking-normal uppercase">
                PIN: <span className="text-text-primary">{pin}</span>
              </span>
            </div>

            <div className="flex justify-center">
              {phase !== 'lobby' && phase !== 'gameover' && (
                <span
                  className="rounded-full border px-3 py-1 text-[10px] font-bold tracking-normal uppercase"
                  style={{
                    color: '#ef4444',
                    borderColor: 'rgba(239,68,68,0.35)',
                    backgroundColor: 'rgba(239,68,68,0.08)',
                  }}
                >
                  Runda {questionIndex + 1} / {totalQuestions}
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#ef4444]" />
                <span className="text-text-muted text-xs font-bold">LIVE</span>
              </div>

              {phase !== 'gameover' && (
                <div ref={menuRef} className="relative">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMenuOpen((open) => !open)}
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
                        <button
                          onClick={handleFinish}
                          disabled={finishLoading}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold"
                          style={{ color: '#ef4444' }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = 'transparent')
                          }
                        >
                          {finishLoading ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Flag size={14} />
                          )}
                          Zakończ grę
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto p-6 sm:p-10">
        <div className="mx-auto w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {phase === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <SetupView
                  name={hostName}
                  onNameChange={setHostName}
                  avatar={hostAvatar}
                  onAvatarChange={setHostAvatar}
                  onContinue={handleSetupComplete}
                  onBack={() => {
                    window.location.href = '/graj/host'
                  }}
                />
              </motion.div>
            )}

            {phase === 'lobby' && (
              <motion.div
                key="lobby"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <LobbyView
                  pin={pin}
                  players={players}
                  hostAvatar={hostAvatar!}
                  hostName={hostName}
                  onStart={handleStart}
                  starting={loading}
                />
              </motion.div>
            )}

            {phase === 'question' && currentQuestion && (
              <motion.div
                key={`q-${questionIndex}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-semibold tracking-normal uppercase"
                        style={{ color: '#ef4444' }}
                      >
                        BATTLE ROYALE
                      </span>
                      <span className="text-text-muted text-xs">•</span>
                      <span className="text-text-muted text-xs">
                        Pytanie {questionIndex + 1} / {totalQuestions}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock
                        size={14}
                        style={{ color: timerLeft <= 5 ? '#ef4444' : 'var(--sheriff-pink)' }}
                      />
                      <span
                        className="font-mono text-2xl font-bold"
                        style={{
                          color: timerLeft <= 5 ? '#ef4444' : 'var(--sheriff-pink)',
                          fontFamily: 'var(--font-app)',
                        }}
                      >
                        {timerLeft}s
                      </span>
                    </div>
                  </div>

                  <div
                    className="h-2 w-full overflow-hidden rounded-full"
                    style={{ backgroundColor: 'var(--saloon-surface)' }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: timerLeft <= 5 ? '#ef4444' : '#22c55e' }}
                      animate={{ width: `${timerPct}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  <div
                    className="rounded-2xl border-2 p-6 text-center"
                    style={{
                      borderColor: 'rgba(239,68,68,0.4)',
                      backgroundColor: 'rgba(239,68,68,0.06)',
                    }}
                  >
                    <p
                      className="text-xl font-bold sm:text-2xl"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {currentQuestion.text}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {currentQuestion.options.map((opt, i) => (
                      <div
                        key={i}
                        className="rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold"
                        style={{
                          borderColor: 'var(--saloon-border)',
                          backgroundColor: 'var(--saloon-surface)',
                          color: 'var(--text-muted)',
                        }}
                      >
                        <span style={{ color: 'var(--sheriff-pink)' }}>
                          {String.fromCharCode(65 + i)}.{' '}
                        </span>
                        {opt}
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-text-muted mb-3 text-xs font-semibold tracking-normal uppercase">
                      Gracze ({answeredIds.size}/{alivePlayers.length} odpowiedziało)
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {players.map((p) => {
                        const isEliminated = eliminatedIds.has(p.playerId)
                        const hasAnswered = answeredIds.has(p.playerId)
                        return (
                          <motion.div
                            key={p.playerId}
                            layout
                            className="flex items-center gap-2 rounded-full border px-3 py-2"
                            style={{
                              borderColor: isEliminated
                                ? 'rgba(239,68,68,0.4)'
                                : hasAnswered
                                  ? 'rgba(34,197,94,0.5)'
                                  : 'var(--saloon-border)',
                              backgroundColor: isEliminated
                                ? 'rgba(239,68,68,0.07)'
                                : hasAnswered
                                  ? 'rgba(34,197,94,0.08)'
                                  : 'var(--saloon-surface)',
                              opacity: isEliminated ? 0.5 : 1,
                            }}
                          >
                            <PlayerAvatar avatar={p.avatar} size={20} />
                            <span
                              className="text-xs font-bold"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {p.playerName}
                            </span>
                            {isEliminated ? (
                              <Skull size={12} style={{ color: '#ef4444' }} />
                            ) : hasAnswered ? (
                              <CheckCircle2 size={12} style={{ color: '#22c55e' }} />
                            ) : null}
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>

                  <Button
                    type="primary"
                    disabled={(!timerDone && !allAnswered) || loading}
                    onClick={() => handleRevealRef.current?.()}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Odsłaniam...
                      </>
                    ) : (
                      'Odsłoń wyniki'
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {phase === 'reveal' && revealData && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col gap-6">
                  <div
                    className="relative overflow-hidden rounded-2xl border p-5 sm:p-6"
                    style={{
                      borderColor: 'rgba(239,68,68,0.28)',
                      background:
                        'radial-gradient(circle at top, rgba(239,68,68,0.16), transparent 36%), rgba(13,8,24,0.74)',
                      boxShadow: '0 24px 70px rgba(0,0,0,0.28)',
                    }}
                  >
                    <div
                      className="pointer-events-none absolute inset-x-8 top-0 h-px"
                      style={{
                        background:
                          'linear-gradient(90deg, transparent, rgba(239,68,68,0.9), transparent)',
                      }}
                    />

                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p
                            className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] uppercase"
                            style={{ color: '#ef4444' }}
                          >
                            <Zap size={14} />
                            Battle Royale
                          </p>
                          <h2
                            className="mt-2 text-4xl tracking-normal text-[#ffe6c7] sm:text-5xl"
                            style={{ fontFamily: 'var(--font-app)' }}
                          >
                            Wyniki rundy
                          </h2>
                          <p className="text-text-muted mt-2 max-w-2xl text-sm leading-relaxed">
                            {revealData.questionText}
                          </p>
                        </div>

                        <div
                          className="rounded-xl border px-4 py-3 text-left sm:min-w-[220px]"
                          style={{
                            borderColor: 'rgba(34,197,94,0.35)',
                            backgroundColor: 'rgba(34,197,94,0.08)',
                          }}
                        >
                          <p className="text-[10px] font-bold tracking-[0.16em] text-[#22c55e] uppercase">
                            Poprawna odpowiedź
                          </p>
                          <p className="mt-1 text-sm font-black text-[#dfffe9]">
                            {revealData.correctAnswer}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        {[
                          {
                            label: 'Ocalali',
                            value: revealData.survivingPlayers.length,
                            color: '#22c55e',
                          },
                          {
                            label: 'Odpadają',
                            value: revealData.eliminatedThisRound.length,
                            color: '#ef4444',
                          },
                          {
                            label: 'Odpowiedzi',
                            value: sortedRevealAnswers.length,
                            color: 'var(--sheriff-pink)',
                          },
                        ].map((stat) => (
                          <div
                            key={stat.label}
                            className="rounded-xl border px-3 py-3 text-center"
                            style={{
                              borderColor: 'rgba(255,220,180,0.12)',
                              backgroundColor: 'rgba(255,220,180,0.05)',
                            }}
                          >
                            <p
                              className="text-2xl leading-none"
                              style={{ color: stat.color, fontFamily: 'var(--font-app)' }}
                            >
                              {stat.value}
                            </p>
                            <p className="mt-1 text-[10px] font-semibold text-[#f0dfc0]/45 uppercase">
                              {stat.label}
                            </p>
                          </div>
                        ))}
                      </div>

                      {revealData.eliminatedThisRound.length > 0 && (
                        <motion.div
                          initial={{ scale: 0.96, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="rounded-xl border px-4 py-3"
                          style={{
                            borderColor: 'rgba(239,68,68,0.45)',
                            backgroundColor: 'rgba(239,68,68,0.1)',
                          }}
                        >
                          <p
                            className="flex flex-wrap items-center justify-center gap-2 text-sm font-bold"
                            style={{ color: '#f87171' }}
                          >
                            <Skull size={15} />
                            <span>
                              Odpada{revealData.eliminatedThisRound.length > 1 ? 'ją' : ''}:
                            </span>
                            <span className="text-[#ffe6c7]">
                              {revealData.eliminatedThisRound
                                .map(
                                  (id) => players.find((p) => p.playerId === id)?.playerName ?? id,
                                )
                                .join(', ')}
                            </span>
                          </p>
                        </motion.div>
                      )}

                      <div className="flex flex-col gap-2">
                        {sortedRevealAnswers.map((answer, i) => {
                          const timeLabel =
                            answer.answeredAt === -1 || firstRevealAnswerAt === undefined
                              ? 'brak'
                              : `+${((answer.answeredAt - firstRevealAnswerAt) / 1000).toFixed(1)}s`

                          return (
                            <motion.div
                              key={answer.playerId}
                              initial={{ opacity: 0, x: -16 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.045 }}
                              className="grid gap-3 rounded-xl border p-3 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1.35fr)_auto] sm:items-center"
                              style={{
                                borderColor: answer.isEliminated
                                  ? 'rgba(239,68,68,0.36)'
                                  : answer.isCorrect
                                    ? 'rgba(34,197,94,0.34)'
                                    : 'rgba(255,220,180,0.12)',
                                backgroundColor: answer.isEliminated
                                  ? 'rgba(239,68,68,0.09)'
                                  : answer.isCorrect
                                    ? 'rgba(34,197,94,0.07)'
                                    : 'rgba(255,220,180,0.045)',
                              }}
                            >
                              <div className="flex min-w-0 items-center gap-3">
                                <div
                                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-black"
                                  style={{
                                    backgroundColor: answer.isEliminated
                                      ? 'rgba(239,68,68,0.18)'
                                      : 'rgba(255,220,180,0.08)',
                                    color: answer.isEliminated
                                      ? '#f87171'
                                      : 'var(--sheriff-pink)',
                                    fontFamily: 'var(--font-app)',
                                  }}
                                >
                                  {i + 1}
                                </div>
                                <PlayerAvatar avatar={answer.avatar} size={28} />
                                <p className="truncate text-sm font-black text-[#ffe6c7]">
                                  {answer.playerName}
                                </p>
                              </div>

                              <div className="min-w-0">
                                <p className="text-[10px] font-bold text-[#f0dfc0]/35 uppercase">
                                  Odpowiedź
                                </p>
                                <p
                                  className="truncate text-sm font-bold"
                                  style={{ color: answer.isCorrect ? '#86efac' : '#fca5a5' }}
                                >
                                  {answer.isCorrect ? 'Poprawnie' : 'Pudło'} - {answer.answerText}
                                </p>
                              </div>

                              <div className="flex items-center justify-between gap-3 sm:justify-end">
                                <span
                                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase"
                                  style={{
                                    backgroundColor: 'rgba(13,8,24,0.55)',
                                    color: answer.answeredAt === -1 ? '#fca5a5' : '#ffdc8f',
                                  }}
                                >
                                  <Clock size={11} />
                                  {timeLabel}
                                </span>
                                <span
                                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-black uppercase"
                                  style={{
                                    backgroundColor: answer.isEliminated
                                      ? 'rgba(239,68,68,0.18)'
                                      : 'rgba(34,197,94,0.14)',
                                    color: answer.isEliminated ? '#f87171' : '#86efac',
                                  }}
                                >
                                  {answer.isEliminated ? (
                                    <>
                                      <Skull size={11} /> Odpada
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 size={11} /> Żyje
                                    </>
                                  )}
                                </span>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base font-bold"
                      style={{
                        backgroundColor: 'var(--saloon-surface)',
                        color: 'var(--sheriff-pink)',
                        fontFamily: 'var(--font-app)',
                        fontSize: '1.2rem',
                      }}
                    >
                      {nextCountdown}
                    </div>
                    <p className="text-text-muted text-sm">Następna runda za chwilę…</p>
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'gameover' && (
              <motion.div
                key="gameover"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto w-full max-w-3xl"
              >
                <BattleRoyaleGameOverPanel
                  winnerName={winner}
                  players={finalPlayers}
                  onNewGame={handleNewGame}
                  newGameLoading={finishLoading}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
