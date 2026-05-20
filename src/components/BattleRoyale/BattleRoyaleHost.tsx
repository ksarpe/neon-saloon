'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Clock, Play, Skull, Trophy } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import type { GameSettingsPayload } from '@/app/api/settings/route'
import { LobbyView } from '@/components/Host/LobbyView'
import { SetupView } from '@/components/Host/SetupView'
import { Button } from '@/components/ui/button'
import { useRealtimeGame as useGameSocket } from '@/hooks/useRealtimeGame'
import type { SessionPlayer } from '@/lib/appwrite/sessions'
import { useBackButton } from '@/lib/back-button-context'
import { BR_AUTO_NEXT_SECONDS, BR_TIMER_SECONDS } from '@/lib/game-config'
import type {
  BRAnswerSubmittedPayload,
  BRRoundRevealPayload,
  PlayerJoinedPayload,
  PlayerLeftPayload,
} from '@/lib/game-types'
import { QUESTION_CATEGORIES } from '@/lib/games/categories'
import { getLimitedQuestionTotal, getOrderedQuestion } from '@/lib/games/question-limit'
import { getHostSession, hostAuthHeaders, updateHostSession } from '@/lib/session-host-secret'
import { playerJsonHeaders, savePlayerSecret } from '@/lib/session-player-secret'

type BRPhase = 'setup' | 'lobby' | 'question' | 'reveal' | 'gameover'

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
  categoryId: string
  questionOrder?: number[] | null
}

export default function BattleRoyaleHost({ pin, categoryId, questionOrder }: Props) {
  const { setHidden: setBackHidden } = useBackButton()
  useEffect(() => {
    setBackHidden(true)
    return () => setBackHidden(false)
  }, [setBackHidden])

  // Game settings (fetched once; falls back to global defaults)
  const [gameSettings, setGameSettings] = useState<GameSettingsPayload>({
    revealCountdownSeconds: 4,
    brTimerSeconds: BR_TIMER_SECONDS,
    brAutoNextSeconds: BR_AUTO_NEXT_SECONDS,
  })
  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setGameSettings(d)
      })
      .catch(() => {})
  }, [])

  // Host identity
  const [hostName, setHostName] = useState('')
  const [hostAvatar, setHostAvatar] = useState<string | null>(null)
  const [hostPlayerId, setHostPlayerId] = useState<string | null>(null)
  const [hostHasAnswered, setHostHasAnswered] = useState(false)
  const [hostAnswerLoading, setHostAnswerLoading] = useState(false)
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null)

  // Game state
  const [phase, setPhase] = useState<BRPhase>('setup')
  const [players, setPlayers] = useState<SessionPlayer[]>([])
  const [eliminatedIds, setEliminatedIds] = useState<Set<string>>(new Set())
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set())
  const [questionIndex, setQuestionIndex] = useState(0)
  const [timerLeft, setTimerLeft] = useState(BR_TIMER_SECONDS)
  const [timerDone, setTimerDone] = useState(false)
  const [revealData, setRevealData] = useState<BRRevealResult | null>(null)
  const [winner, setWinner] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  const [nextCountdown, setNextCountdown] = useState<number | null>(null)

  const category = QUESTION_CATEGORIES.find((c) => c.id === categoryId)
  const question = category
    ? getOrderedQuestion(category.questions, questionIndex, questionOrder ?? undefined)
    : undefined
  const totalQuestions = category
    ? getLimitedQuestionTotal(category.questions.length, questionOrder ?? undefined)
    : 0

  // Question timer
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    setTimerLeft(gameSettings.brTimerSeconds)
    setTimerDone(false)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimerLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          setTimerDone(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }, [gameSettings.brTimerSeconds])

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current)
    },
    []
  )

  // Hydrate on mount — restore identity + game state so a refresh during BR
  // doesn't bounce the host back to setup or lose track of eliminations.
  useEffect(() => {
    const stored = getHostSession(pin)
    if (stored?.hostName) setHostName(stored.hostName)
    if (stored?.hostAvatar) setHostAvatar(stored.hostAvatar)
    if (stored?.hostPlayerId) setHostPlayerId(stored.hostPlayerId)

    fetch(`/api/sessions/${pin}/host-resume`, { headers: hostAuthHeaders(pin) })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.ok) return
        if (Array.isArray(data.players) && data.players.length) setPlayers(data.players)
        if (data.battleRoyaleData) {
          const br = data.battleRoyaleData
          if (Array.isArray(br.eliminatedPlayers)) {
            setEliminatedIds(new Set<string>(br.eliminatedPlayers))
          }
          if (typeof br.questionIndex === 'number') setQuestionIndex(br.questionIndex)
          if (Array.isArray(br.roundAnswers)) {
            setAnsweredIds(
              new Set<string>(br.roundAnswers.map((a: { playerId: string }) => a.playerId))
            )
          }
          // Reconstruct timer from roundStartTime so the reveal button becomes
          // available correctly after a refresh during a round.
          if (typeof br.roundStartTime === 'number' && typeof br.timerDuration === 'number') {
            const elapsed = Math.floor((Date.now() - br.roundStartTime) / 1000)
            const remaining = Math.max(0, br.timerDuration - elapsed)
            setTimerLeft(remaining)
            if (remaining === 0) setTimerDone(true)
          }
        }
        const hasIdentity = Boolean(stored?.hostName && stored?.hostAvatar)
        if (data.status === 'finished') setPhase('gameover')
        else if (data.status === 'active') setPhase('question')
        else if (hasIdentity) setPhase('lobby')
      })
      .catch(() => {})
  }, [pin])

  // Poll for players in lobby
  useEffect(() => {
    if (phase !== 'lobby') return
    const id = setInterval(() => {
      fetch(`/api/sessions/${pin}`, { headers: hostAuthHeaders(pin) })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => {
          if (d?.players) setPlayers(d.players)
        })
        .catch(() => {})
    }, 5000)
    return () => clearInterval(id)
  }, [phase, pin])

  // Realtime
  useGameSocket(pin, {
    onPlayerJoined: useCallback((d: PlayerJoinedPayload) => {
      setPlayers((p) => (p.some((x) => x.playerId === d.playerId) ? p : [...p, d]))
    }, []),
    onPlayerLeft: useCallback((d: PlayerLeftPayload) => {
      setPlayers((p) => p.filter((x) => x.playerId !== d.playerId))
    }, []),
    onBRAnswerSubmitted: useCallback((d: BRAnswerSubmittedPayload) => {
      setAnsweredIds((prev) => new Set([...prev, d.playerId]))
    }, []),
    onBRRoundReveal: useCallback((d: BRRoundRevealPayload) => {
      if (timerRef.current) clearInterval(timerRef.current)
      setRevealData(d)
      setEliminatedIds((prev) => new Set([...prev, ...d.eliminatedThisRound]))
      if (d.gameOver) {
        setWinner(d.winner)
        setPhase('gameover')
      } else {
        setPhase('reveal')
      }
    }, []),
  })

  // Auto-reveal when all alive players (incl. host) have answered
  const handleRevealRef = useRef<(() => Promise<void>) | null>(null)
  const handleReveal = useCallback(async () => {
    if (loading) return
    setLoading(true)
    if (timerRef.current) clearInterval(timerRef.current)
    try {
      await fetch(`/api/sessions/${pin}/battle-royale/reveal`, {
        method: 'POST',
        headers: hostAuthHeaders(pin),
      })
    } finally {
      setLoading(false)
    }
  }, [loading, pin])
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

  // Auto-next round countdown after reveal
  const handleNextRoundRef = useRef<(() => Promise<void>) | null>(null)
  const handleNextRound = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      const res = await fetch(`/api/sessions/${pin}/battle-royale/next`, {
        method: 'POST',
        headers: hostAuthHeaders(pin),
      })
      const data = await res.json()
      if (data.finished) {
        setPhase('gameover')
        return
      }
      setQuestionIndex((i) => i + 1)
      await fetch(`/api/sessions/${pin}/battle-royale/round`, {
        method: 'POST',
        headers: hostAuthHeaders(pin),
      })
      setAnsweredIds(new Set())
      setRevealData(null)
      setHostHasAnswered(false)
      setSelectedOptionIndex(null)
      setPhase('question')
      startTimer()
    } finally {
      setLoading(false)
    }
  }, [loading, pin, startTimer])
  useEffect(() => {
    handleNextRoundRef.current = handleNextRound
  }, [handleNextRound])

  useEffect(() => {
    if (phase !== 'reveal') {
      setNextCountdown(null)
      return
    }
    let n = gameSettings.brAutoNextSeconds
    setNextCountdown(n)
    const tick = setInterval(() => {
      n -= 1
      if (n <= 0) {
        clearInterval(tick)
        setNextCountdown(null)
        handleNextRoundRef.current?.()
      } else {
        setNextCountdown(n)
      }
    }, 1000)
    return () => clearInterval(tick)
  }, [phase, questionIndex, gameSettings.brAutoNextSeconds])

  // Actions
  const handleSetupComplete = useCallback(() => {
    if (!hostName.trim() || !hostAvatar) return
    updateHostSession(pin, { hostName: hostName.trim(), hostAvatar })
    setPhase('lobby')
  }, [pin, hostName, hostAvatar])

  const handleStart = useCallback(async () => {
    if (!hostName.trim() || !hostAvatar) return
    setLoading(true)
    try {
      // Host joins as a player (same pattern as HostScreen)
      const joinRes = await fetch(`/api/sessions/${pin}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: hostName.trim(), avatar: hostAvatar }),
      })
      if (joinRes.ok) {
        const joinData = await joinRes.json()
        if (typeof joinData.playerSecret === 'string') {
          savePlayerSecret(pin, joinData.playerId, joinData.playerSecret)
        }
        updateHostSession(pin, { hostPlayerId: joinData.playerId })
        setHostPlayerId(joinData.playerId)
        setPlayers((p) => {
          if (p.some((x) => x.playerId === joinData.playerId)) return p
          return [
            ...p,
            {
              playerId: joinData.playerId,
              playerName: hostName.trim(),
              avatar: hostAvatar,
              teamId: null,
              teamName: null,
            },
          ]
        })
      }

      // /round sets session.status = 'active' and fires br-round-start
      await fetch(`/api/sessions/${pin}/battle-royale/round`, {
        method: 'POST',
        headers: hostAuthHeaders(pin),
      })
      setHostHasAnswered(false)
      setSelectedOptionIndex(null)
      setAnsweredIds(new Set())
      setPhase('question')
      startTimer()
    } finally {
      setLoading(false)
    }
  }, [pin, hostName, hostAvatar, startTimer])

  const handleHostAnswer = useCallback(
    async (idx: number, text: string) => {
      if (!hostPlayerId || hostHasAnswered || hostAnswerLoading) return
      setSelectedOptionIndex(idx)
      setHostAnswerLoading(true)
      try {
        await fetch(`/api/sessions/${pin}/battle-royale/answer`, {
          method: 'POST',
          headers: playerJsonHeaders(pin, hostPlayerId),
          body: JSON.stringify({
            playerId: hostPlayerId,
            playerName: hostName,
            avatar: hostAvatar,
            answerIndex: idx,
            answerText: text,
          }),
        })
        setHostHasAnswered(true)
      } finally {
        setHostAnswerLoading(false)
      }
    },
    [hostPlayerId, hostHasAnswered, hostAnswerLoading, pin, hostName, hostAvatar]
  )

  const timerPct = (timerLeft / gameSettings.brTimerSeconds) * 100
  const hostIsEliminated = hostPlayerId ? eliminatedIds.has(hostPlayerId) : false

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <div className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto p-6 sm:p-10">
        <div className="mx-auto w-full max-w-4xl">
          <AnimatePresence mode="wait">
            {/* Setup */}
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
                />
              </motion.div>
            )}

            {/* Lobby */}
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
                />
              </motion.div>
            )}

            {/* Active question */}
            {phase === 'question' && question && (
              <motion.div
                key={`q-${questionIndex}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col gap-6">
                  {/* Header */}
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

                  {/* Timer bar */}
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

                  {/* Question */}
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
                      {question.text}
                    </p>
                  </div>

                  {/* Options — host can click to answer */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {question.options.map((opt, i) => {
                      const isSelected = selectedOptionIndex === i
                      const canAnswer = !hostHasAnswered && !hostIsEliminated && !hostAnswerLoading
                      return (
                        <motion.button
                          key={i}
                          whileTap={canAnswer ? { scale: 0.97 } : undefined}
                          disabled={!canAnswer}
                          onClick={() => handleHostAnswer(i, opt)}
                          className="rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition-all duration-150"
                          style={{
                            borderColor: isSelected
                              ? 'rgba(34,197,94,0.7)'
                              : canAnswer
                                ? 'var(--saloon-border)'
                                : 'var(--saloon-border)',
                            backgroundColor: isSelected
                              ? 'rgba(34,197,94,0.12)'
                              : 'var(--saloon-surface)',
                            color: canAnswer ? 'var(--text-primary)' : 'var(--text-muted)',
                            cursor: canAnswer ? 'pointer' : 'default',
                          }}
                          onMouseEnter={(e) => {
                            if (!canAnswer) return
                            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.6)'
                          }}
                          onMouseLeave={(e) => {
                            if (!canAnswer || isSelected) return
                            e.currentTarget.style.borderColor = 'var(--saloon-border)'
                          }}
                        >
                          <span style={{ color: 'var(--sheriff-pink)' }}>
                            {String.fromCharCode(65 + i)}.{' '}
                          </span>
                          {opt}
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Host answered status */}
                  {hostHasAnswered && (
                    <p className="text-center text-xs font-semibold" style={{ color: '#22c55e' }}>
                      <CheckCircle2 size={12} className="mr-1 inline" />
                      Twoja odpowiedź zapisana
                    </p>
                  )}
                  {hostIsEliminated && (
                    <p className="text-center text-xs font-semibold" style={{ color: '#ef4444' }}>
                      <Skull size={12} className="mr-1 inline" />
                      Jesteś duchem — obserwujesz
                    </p>
                  )}

                  {/* Player avatars */}
                  <div>
                    <p className="text-text-muted mb-3 text-xs font-semibold tracking-normal uppercase">
                      Gracze ({answeredIds.size}/{alivePlayers.length} odpowiedziało)
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {players.map((p) => {
                        const isEliminated = eliminatedIds.has(p.playerId)
                        const hasAnswered = answeredIds.has(p.playerId)
                        const isHost = p.playerId === hostPlayerId
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
                            <span className="text-base">{p.avatar}</span>
                            <span
                              className="text-xs font-bold"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {p.playerName}
                              {isHost ? ' 🎙' : ''}
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

                  {/* Reveal button (only after timer ends or all answered) */}
                  <Button
                    type="primary"
                    disabled={(!timerDone && !allAnswered) || loading}
                    onClick={() => handleRevealRef.current?.()}
                    size="lg"
                  >
                    Odsłoń wyniki
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Reveal */}
            {phase === 'reveal' && revealData && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex flex-col gap-6">
                  <div className="text-center">
                    <h2
                      className="text-sheriff-pink text-4xl tracking-normal"
                      style={{ fontFamily: 'var(--font-app)' }}
                    >
                      Wyniki rundy
                    </h2>
                    <p className="text-text-muted mt-1 text-sm">{revealData.questionText}</p>
                    <p className="mt-2 text-sm font-bold" style={{ color: '#22c55e' }}>
                      Poprawna odpowiedź: {revealData.correctAnswer}
                    </p>
                  </div>

                  {/* Eliminated banner */}
                  {revealData.eliminatedThisRound.length > 0 && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="rounded-2xl border-2 p-4 text-center"
                      style={{
                        borderColor: 'rgba(239,68,68,0.6)',
                        backgroundColor: 'rgba(239,68,68,0.1)',
                      }}
                    >
                      <p
                        className="text-sm font-bold tracking-normal uppercase"
                        style={{ color: '#ef4444' }}
                      >
                        <Skull size={14} className="mr-1 inline" />
                        Odpada{revealData.eliminatedThisRound.length > 1 ? 'ją' : ''}:{' '}
                        {revealData.eliminatedThisRound
                          .map((id) => players.find((p) => p.playerId === id)?.playerName ?? id)
                          .join(', ')}
                      </p>
                    </motion.div>
                  )}

                  {/* Results table */}
                  <div
                    className="overflow-hidden rounded-2xl border"
                    style={{ borderColor: 'var(--saloon-border)' }}
                  >
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ backgroundColor: 'var(--saloon-surface)' }}>
                          <th
                            className="px-4 py-3 text-left text-xs font-semibold tracking-normal uppercase"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            Gracz
                          </th>
                          <th
                            className="px-4 py-3 text-left text-xs font-semibold tracking-normal uppercase"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            Odpowiedź
                          </th>
                          <th
                            className="px-4 py-3 text-right text-xs font-semibold tracking-normal uppercase"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            Czas
                          </th>
                          <th
                            className="px-4 py-3 text-right text-xs font-semibold tracking-normal uppercase"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {revealData.answers
                          .sort((a, b) => {
                            if (a.answeredAt === -1 && b.answeredAt === -1) return 0
                            if (a.answeredAt === -1) return 1
                            if (b.answeredAt === -1) return -1
                            return a.answeredAt - b.answeredAt
                          })
                          .map((a, i) => (
                            <motion.tr
                              key={a.playerId}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.06 }}
                              style={{
                                backgroundColor: a.isEliminated
                                  ? 'rgba(239,68,68,0.06)'
                                  : 'transparent',
                                borderTop: '1px solid var(--saloon-border)',
                                opacity: a.isEliminated ? 0.7 : 1,
                              }}
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <span>{a.avatar}</span>
                                  <span
                                    className="font-bold"
                                    style={{ color: 'var(--text-primary)' }}
                                  >
                                    {a.playerName}
                                    {a.playerId === hostPlayerId ? ' 🎙' : ''}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span style={{ color: a.isCorrect ? '#22c55e' : '#ef4444' }}>
                                  {a.isCorrect ? '✓' : '✗'} {a.answerText}
                                </span>
                              </td>
                              <td
                                className="px-4 py-3 text-right font-mono text-xs"
                                style={{ color: 'var(--text-muted)' }}
                              >
                                {a.answeredAt === -1
                                  ? '—'
                                  : `${((a.answeredAt - (revealData.answers[0]?.answeredAt ?? a.answeredAt)) / 1000 + 0.1).toFixed(1)}s`}
                              </td>
                              <td className="px-4 py-3 text-right">
                                {a.isEliminated ? (
                                  <span
                                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                                    style={{
                                      backgroundColor: 'rgba(239,68,68,0.2)',
                                      color: '#ef4444',
                                    }}
                                  >
                                    <Skull size={10} /> Odpada
                                  </span>
                                ) : (
                                  <span
                                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                                    style={{
                                      backgroundColor: 'rgba(34,197,94,0.15)',
                                      color: '#22c55e',
                                    }}
                                  >
                                    <CheckCircle2 size={10} /> Żyje
                                  </span>
                                )}
                              </td>
                            </motion.tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Auto-next countdown */}
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

            {/* Game over */}
            {phase === 'gameover' && (
              <motion.div
                key="gameover"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="flex flex-col items-center gap-6">
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 10, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.8 }}
                  >
                    <Trophy size={72} style={{ color: 'var(--sheriff-pink)' }} />
                  </motion.div>
                  <div>
                    <h1
                      className="text-sheriff-pink text-6xl tracking-normal"
                      style={{ fontFamily: 'var(--font-app)' }}
                    >
                      Koniec gry!
                    </h1>
                    {winner ? (
                      <p
                        className="mt-3 text-xl font-bold"
                        style={{ color: 'var(--sheriff-pink)' }}
                      >
                        Zwycięzca: {winner}
                      </p>
                    ) : (
                      <p className="text-text-muted mt-3">Brak zwycięzcy — wszyscy odpadli</p>
                    )}
                  </div>
                  {revealData && (
                    <div className="flex flex-wrap justify-center gap-3">
                      {players.map((p) => {
                        const survived = revealData.survivingPlayers.includes(p.playerId)
                        const isHost = p.playerId === hostPlayerId
                        return (
                          <div
                            key={p.playerId}
                            className="flex items-center gap-2 rounded-full border px-4 py-2"
                            style={{
                              borderColor: survived ? 'rgba(255,215,0,0.5)' : 'rgba(239,68,68,0.3)',
                              opacity: survived ? 1 : 0.4,
                            }}
                          >
                            <span>{p.avatar}</span>
                            <span
                              className="text-sm font-bold"
                              style={{
                                color: survived ? 'var(--sheriff-pink)' : 'var(--text-muted)',
                              }}
                            >
                              {p.playerName}
                              {isHost ? ' 🎙' : ''}
                            </span>
                            {survived ? (
                              <Trophy size={12} style={{ color: 'var(--sheriff-pink)' }} />
                            ) : (
                              <Skull size={12} style={{ color: '#ef4444' }} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                  <Button
                    type="primary"
                    onClick={() => (window.location.href = '/graj/host')}
                    size="lg"
                  >
                    <Play size={18} /> Nowa gra
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
