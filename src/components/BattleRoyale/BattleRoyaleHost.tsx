'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Clock, Flag, Loader2, Menu, Skull, X, Zap } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { BattleRoyaleGameOverPanel } from '@/components/BattleRoyale/BattleRoyaleGameOverPanel'
import { LobbyView } from '@/components/Host/LobbyView'
import { SetupView } from '@/components/Host/SetupView'
import { PlayerAvatar } from '@/components/PlayerAvatar'
import { Button } from '@/components/ui/button'
import { ANSWER_TIME_LIMIT_SECONDS, BR_AUTO_NEXT_SECONDS, BR_TIMER_SECONDS } from '@/config/game'
import { getQuestionCategorySelection } from '@/config/games/category-selection'
import { useAutoCountdown } from '@/hooks/useAutoCountdown'
import { useGameSettings } from '@/hooks/useGameSettings'
import { useLobbyPlayersPolling } from '@/hooks/useLobbyPlayersPolling'
import { useRealtimeGame as useGameSocket } from '@/hooks/useRealtimeGame'
import type { SessionPlayer } from '@/lib/appwrite/sessions'
import { useBackButton } from '@/lib/back-button-context'
import type {
  BRAnswerSubmittedPayload,
  BRRoundRevealPayload,
  PlayerJoinedPayload,
  PlayerLeftPayload,
} from '@/lib/game-types'
import { getLimitedQuestionTotal, getOrderedQuestion } from '@/lib/games/question-limit'
import {
  getHostSession,
  hostAuthHeaders,
  hostJsonHeaders,
  updateHostSession,
} from '@/lib/session-host-secret'
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
  timerDuration: number
}

export default function BattleRoyaleHost({ pin, categoryId, questionOrder, timerDuration }: Props) {
  const { setHidden: setBackHidden } = useBackButton()
  useEffect(() => {
    setBackHidden(true)
    return () => setBackHidden(false)
  }, [setBackHidden])

  const gameSettings = useGameSettings({
    revealCountdownSeconds: 4,
    answerTimeLimitSeconds: ANSWER_TIME_LIMIT_SECONDS,
    brTimerSeconds: BR_TIMER_SECONDS,
    brAutoNextSeconds: BR_AUTO_NEXT_SECONDS,
  })

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
  const [roundTimerDuration, setRoundTimerDuration] = useState(timerDuration)
  const [timerLeft, setTimerLeft] = useState(timerDuration)
  const [timerDone, setTimerDone] = useState(false)
  const [revealData, setRevealData] = useState<BRRevealResult | null>(null)
  const [winner, setWinner] = useState<string | undefined>()
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [finishLoading, setFinishLoading] = useState(false)

  const category = getQuestionCategorySelection(categoryId)
  const question = category
    ? getOrderedQuestion(category.questions, questionIndex, questionOrder ?? undefined)
    : undefined
  const totalQuestions = category
    ? getLimitedQuestionTotal(category.questions.length, questionOrder ?? undefined)
    : 0

  // Question timer
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const startTimer = useCallback(() => {
    setTimerLeft(roundTimerDuration)
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
  }, [roundTimerDuration])

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current)
    },
    []
  )

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

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
          if (typeof br.timerDuration === 'number') {
            setRoundTimerDuration(br.timerDuration)
            setTimerLeft(br.timerDuration)
          }
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

  useLobbyPlayersPolling<SessionPlayer>({
    active: phase === 'lobby',
    pin,
    onPlayers: setPlayers,
  })

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
    onGameFinished: useCallback(() => {
      if (timerRef.current) clearInterval(timerRef.current)
      setWinner(undefined)
      setPhase('gameover')
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

  const nextCountdown = useAutoCountdown({
    active: phase === 'reveal',
    seconds: gameSettings.brAutoNextSeconds,
    resetKey: questionIndex,
    onComplete: () => handleNextRoundRef.current?.(),
  })

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
        const resolvedHostName =
          typeof joinData.playerName === 'string' ? joinData.playerName : hostName.trim()
        if (typeof joinData.playerSecret === 'string') {
          savePlayerSecret(pin, joinData.playerId, joinData.playerSecret)
        }
        updateHostSession(pin, { hostName: resolvedHostName, hostPlayerId: joinData.playerId })
        setHostName(resolvedHostName)
        setHostPlayerId(joinData.playerId)
        setPlayers((p) => {
          if (p.some((x) => x.playerId === joinData.playerId)) return p
          return [
            ...p,
            {
              playerId: joinData.playerId,
              playerName: resolvedHostName,
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

  const handleFinish = useCallback(async () => {
    if (finishLoading) return
    setFinishLoading(true)
    setMenuOpen(false)
    if (timerRef.current) clearInterval(timerRef.current)

    try {
      await fetch(`/api/sessions/${pin}`, {
        method: 'POST',
        headers: hostJsonHeaders(pin),
        body: JSON.stringify({
          action: 'finish',
          scores: [],
          teamScores: [],
          showPlayerPoints: false,
        }),
      })
      setWinner(undefined)
      setPhase('gameover')
    } finally {
      setFinishLoading(false)
    }
  }, [finishLoading, pin])

  const handleNewGame = useCallback(async () => {
    if (finishLoading) return
    setFinishLoading(true)
    try {
      await fetch(`/api/sessions/${pin}`, {
        method: 'POST',
        headers: hostJsonHeaders(pin),
        body: JSON.stringify({
          action: 'finish',
          scores: [],
          teamScores: [],
          showPlayerPoints: false,
        }),
      })
    } finally {
      window.location.href = '/graj/host'
    }
  }, [finishLoading, pin])

  const timerPct = (timerLeft / roundTimerDuration) * 100
  const hostIsEliminated = hostPlayerId ? eliminatedIds.has(hostPlayerId) : false
  const sortedRevealAnswers = revealData
    ? [...revealData.answers].sort((a, b) => {
        if (a.answeredAt === -1 && b.answeredAt === -1) return 0
        if (a.answeredAt === -1) return 1
        if (b.answeredAt === -1) return -1
        return a.answeredAt - b.answeredAt
      })
    : []
  const firstRevealAnswerAt = sortedRevealAnswers.find(
    (answer) => answer.answeredAt !== -1
  )?.answeredAt
  const finalStandings = [...players].sort((a, b) => {
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
  const finalPlayers = finalStandings.map((player) => {
    const survived =
      revealData?.survivingPlayers.includes(player.playerId) ?? !eliminatedIds.has(player.playerId)

    return {
      id: player.playerId,
      name: player.playerName,
      avatar: player.avatar,
      isHost: player.playerId === hostPlayerId,
      isWinner: winner === player.playerName,
      survived,
    }
  })

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
                  onBack={() => {
                    window.location.href = '/graj/host'
                  }}
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
                  starting={loading}
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
                            <PlayerAvatar avatar={p.avatar} size={20} />
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

            {/* Reveal */}
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
                                  (id) => players.find((p) => p.playerId === id)?.playerName ?? id
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
                                    color: answer.isEliminated ? '#f87171' : 'var(--sheriff-pink)',
                                    fontFamily: 'var(--font-app)',
                                  }}
                                >
                                  {i + 1}
                                </div>
                                <PlayerAvatar avatar={answer.avatar} size={28} />
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-black text-[#ffe6c7]">
                                    {answer.playerName}
                                  </p>
                                  {answer.playerId === hostPlayerId && (
                                    <p className="text-[10px] font-bold text-[#f0dfc0]/40 uppercase">
                                      host
                                    </p>
                                  )}
                                </div>
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
