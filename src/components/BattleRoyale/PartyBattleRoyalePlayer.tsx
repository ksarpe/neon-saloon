'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Clock, Skull } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { BattleRoyaleGameOverPanel } from '@/components/BattleRoyale/BattleRoyaleGameOverPanel'
import { PlayerAvatar } from '@/components/PlayerAvatar'
import { usePartyConnection } from '@/hooks/usePartyConnection'
import type { BRGameOverPayload, BRRoundRevealPayload, BRRoundStartPayload } from '@/lib/game-types'

type BRPlayerPhase =
  | 'waiting'
  | 'answering'
  | 'answered'
  | 'reveal'
  | 'eliminated-reveal'
  | 'gameover'

interface Props {
  pin: string
  partyToken: string
  playerId: string
  playerName: string
  avatar: string
}

export function PartyBattleRoyalePlayer({ pin, partyToken, playerId, playerName, avatar }: Props) {
  const [phase, setPhase] = useState<BRPlayerPhase>('waiting')
  const [roundData, setRoundData] = useState<BRRoundStartPayload | null>(null)
  const [revealData, setRevealData] = useState<BRRoundRevealPayload | null>(null)
  const [gameOver, setGameOver] = useState<BRGameOverPayload | null>(null)
  const [timerLeft, setTimerLeft] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [isEliminated, setIsEliminated] = useState(false)
  const [answeredCount, setAnsweredCount] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback((duration: number, startTime: number) => {
    if (timerRef.current) clearInterval(timerRef.current)
    const elapsed = Math.floor((Date.now() - startTime) / 1000)
    let remaining = Math.max(0, duration - elapsed)
    setTimerLeft(remaining)
    if (remaining <= 0) return

    timerRef.current = setInterval(() => {
      remaining -= 1
      setTimerLeft(remaining)
      if (remaining <= 0) clearInterval(timerRef.current!)
    }, 1000)
  }, [])

  useEffect(
    () => () => {
      if (timerRef.current) clearInterval(timerRef.current)
    },
    [],
  )

  const handlers = useMemo(
    () => ({
      onBRRoundStart: (d: BRRoundStartPayload) => {
        setRoundData(d)
        setSelectedIndex(null)
        setAnsweredCount(0)
        setPhase('answering')
        startTimer(d.timerDuration, d.roundStartTime)
      },
      onBRAnswerSubmitted: () => {
        setAnsweredCount((c) => c + 1)
      },
      onBRRoundReveal: (d: BRRoundRevealPayload) => {
        if (timerRef.current) clearInterval(timerRef.current)
        setRevealData(d)
        const iEliminated = d.eliminatedThisRound.includes(playerId)
        if (iEliminated) setIsEliminated(true)
        setPhase(d.gameOver ? 'gameover' : iEliminated ? 'eliminated-reveal' : 'reveal')
      },
      onBRGameOver: (d: BRGameOverPayload) => {
        setGameOver(d)
        setPhase('gameover')
      },
      onGameFinished: () => {
        setGameOver({ survivingPlayers: [] })
        setPhase('gameover')
      },
    }),
    [playerId, startTimer],
  )

  const { send, snapshot } = usePartyConnection({ pin, partyToken, role: 'player', handlers })

  // Snapshot hydration on (re)connect
  useEffect(() => {
    if (!snapshot) return

    if (snapshot.status === 'finished') {
      setPhase('gameover')
      return
    }

    const br = snapshot.battleRoyale
    if (!br) return

    const eliminated = br.eliminatedPlayers.includes(playerId)
    if (eliminated) setIsEliminated(true)

    if (br.roundStartTime && br.questionText && br.options) {
      const nextRound: BRRoundStartPayload = {
        questionIndex: br.questionIndex,
        totalQuestions: br.totalQuestions,
        questionText: br.questionText,
        options: br.options,
        timerDuration: br.timerDuration,
        roundStartTime: br.roundStartTime,
        alivePlayers: br.alivePlayers ?? [],
      }
      const hasAnswered = br.answeredPlayerIds?.includes(playerId) ?? false
      setRoundData(nextRound)
      setAnsweredCount(br.answeredPlayerIds?.length ?? 0)
      setPhase(hasAnswered ? 'answered' : 'answering')
      startTimer(br.timerDuration, br.roundStartTime)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot])

  const submitAnswer = useCallback(
    async (idx: number, text: string) => {
      if (loading || selectedIndex !== null || isEliminated || !send) return
      setSelectedIndex(idx)
      setLoading(true)
      try {
        await send({ type: 'player:br-answer', answerIndex: idx, answerText: text })
        setPhase('answered')
      } finally {
        setLoading(false)
      }
    },
    [loading, selectedIndex, isEliminated, send],
  )

  const timerPct = roundData ? (timerLeft / roundData.timerDuration) * 100 : 100
  const myRevealEntry = revealData?.answers.find((a) => a.playerId === playerId)
  const winnerName = gameOver?.winner ?? revealData?.winner
  const isWinner = winnerName === playerName
  const finalPlayer = {
    id: playerId,
    name: playerName,
    avatar,
    isWinner,
    survived: isWinner || (!winnerName && !isEliminated),
  }

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Top bar */}
      <div
        className="relative z-10 flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: 'var(--saloon-border)', backgroundColor: 'var(--saloon-bg)' }}
      >
        <div className="flex items-center gap-2">
          <PlayerAvatar avatar={avatar} size={24} />
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
            {playerName}
          </span>
          {isEliminated && (
            <span
              className="ml-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
              style={{ backgroundColor: 'rgba(239,68,68,0.2)', color: '#ef4444' }}
            >
              <Skull size={10} /> DUCH
            </span>
          )}
        </div>
        <span
          className="text-xs font-semibold tracking-normal uppercase"
          style={{ color: '#ef4444' }}
        >
          BATTLE ROYALE
        </span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="mx-auto w-full max-w-sm">
          <AnimatePresence mode="wait">
            {/* Waiting for game to start */}
            {phase === 'waiting' && (
              <motion.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <div className="mb-4 animate-pulse text-4xl">⏳</div>
                <p className="text-text-muted text-sm">Oczekuję na start gry…</p>
              </motion.div>
            )}

            {/* Answering (or spectating as ghost) */}
            {phase === 'answering' && roundData && (
              <motion.div
                key={`answering-${roundData.questionIndex}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-5"
              >
                {isEliminated && (
                  <div
                    className="rounded-xl border px-4 py-2 text-center text-xs font-bold"
                    style={{
                      borderColor: 'rgba(239,68,68,0.4)',
                      color: '#ef4444',
                      backgroundColor: 'rgba(239,68,68,0.07)',
                    }}
                  >
                    <Skull size={12} className="mr-1 inline" /> Obserwujesz jako duch
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-text-muted text-xs font-semibold tracking-normal uppercase">
                    {isEliminated
                      ? 'Obserwujesz'
                      : `Odpowiedź (${answeredCount} z ${roundData.alivePlayers.length})`}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Clock
                      size={13}
                      style={{ color: timerLeft <= 5 ? '#ef4444' : 'var(--sheriff-pink)' }}
                    />
                    <span
                      className="font-mono text-lg font-bold"
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
                  className="h-1.5 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: 'var(--saloon-surface)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${timerPct}%`,
                      backgroundColor: timerLeft <= 5 ? '#ef4444' : '#22c55e',
                    }}
                  />
                </div>

                <div
                  className="rounded-2xl border-2 p-5 text-center"
                  style={{
                    borderColor: 'rgba(239,68,68,0.4)',
                    backgroundColor: 'rgba(239,68,68,0.06)',
                  }}
                >
                  <p
                    className="text-base leading-snug font-bold"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {roundData.questionText}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {roundData.options.map((opt, i) => (
                    <motion.button
                      key={i}
                      whileTap={!isEliminated ? { scale: 0.97 } : undefined}
                      disabled={isEliminated || loading || selectedIndex !== null}
                      onClick={() => submitAnswer(i, opt)}
                      className="w-full rounded-2xl border-2 px-4 py-4 text-left text-sm font-bold transition-all duration-200"
                      style={{
                        borderColor: 'var(--saloon-border)',
                        backgroundColor: 'var(--saloon-surface)',
                        color: isEliminated ? 'var(--text-muted)' : 'var(--text-primary)',
                        cursor: isEliminated ? 'not-allowed' : 'pointer',
                        opacity: isEliminated ? 0.6 : 1,
                      }}
                    >
                      <span style={{ color: 'var(--sheriff-pink)' }}>
                        {String.fromCharCode(65 + i)}.{' '}
                      </span>
                      {opt}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Answered — waiting for reveal */}
            {phase === 'answered' && roundData && (
              <motion.div
                key="answered"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6 text-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <CheckCircle2 size={64} style={{ color: '#22c55e' }} />
                </motion.div>
                <div>
                  <p className="text-xl font-bold" style={{ color: '#22c55e' }}>
                    Odpowiedziałeś!
                  </p>
                  <p className="text-text-muted mt-1 text-sm">Czekam na pozostałych…</p>
                </div>
                <div
                  className="flex items-center gap-2 rounded-2xl border px-5 py-3"
                  style={{
                    borderColor: 'var(--saloon-border)',
                    backgroundColor: 'var(--saloon-surface)',
                  }}
                >
                  <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
                    Twoja odpowiedź:
                  </span>
                  <span className="font-bold" style={{ color: 'var(--sheriff-pink)' }}>
                    {selectedIndex !== null ? roundData.options[selectedIndex] : '—'}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Reveal — survived */}
            {phase === 'reveal' && revealData && myRevealEntry && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-5"
              >
                <div className="text-center">
                  <div className="mb-3 text-5xl">🎉</div>
                  <p className="text-xl font-bold" style={{ color: '#22c55e' }}>
                    Przeżyłeś tę rundę!
                  </p>
                  <p className="text-text-muted mt-1 text-sm">{revealData.questionText}</p>
                </div>

                <div
                  className="rounded-2xl border-2 p-4 text-center"
                  style={{
                    borderColor: myRevealEntry.isCorrect
                      ? 'rgba(34,197,94,0.5)'
                      : 'rgba(239,68,68,0.4)',
                    backgroundColor: myRevealEntry.isCorrect
                      ? 'rgba(34,197,94,0.08)'
                      : 'rgba(239,68,68,0.07)',
                  }}
                >
                  <p
                    className="text-xs font-semibold tracking-normal uppercase"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Twoja odpowiedź
                  </p>
                  <p
                    className="mt-1 text-base font-bold"
                    style={{ color: myRevealEntry.isCorrect ? '#22c55e' : '#ef4444' }}
                  >
                    {myRevealEntry.isCorrect ? '✓' : '✗'} {myRevealEntry.answerText}
                  </p>
                </div>

                <div
                  className="rounded-xl border p-3 text-center"
                  style={{
                    borderColor: 'rgba(34,197,94,0.4)',
                    backgroundColor: 'rgba(34,197,94,0.07)',
                  }}
                >
                  <p className="text-xs text-green-400">
                    Poprawna odpowiedź: <strong>{revealData.correctAnswer}</strong>
                  </p>
                </div>

                {revealData.eliminatedThisRound.length > 0 && (
                  <p className="text-center text-xs font-semibold" style={{ color: '#ef4444' }}>
                    <Skull size={12} className="mr-1 inline" />
                    Odpada: {revealData.eliminatedThisRound.length} gracz(y)
                  </p>
                )}

                <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                  Pozostałych: {revealData.survivingPlayers.length}
                </p>
              </motion.div>
            )}

            {/* Eliminated this round */}
            {phase === 'eliminated-reveal' && revealData && (
              <motion.div
                key="eliminated"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-6 text-center"
              >
                <motion.div
                  animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Skull size={72} style={{ color: '#ef4444' }} />
                </motion.div>
                <div>
                  <p
                    className="text-3xl font-bold"
                    style={{
                      color: '#ef4444',
                      fontFamily: 'var(--font-app)',
                      letterSpacing: '0.1em',
                    }}
                  >
                    Odpadłeś!
                  </p>
                  <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
                    Stajesz się duchem i obserwujesz resztę gry
                  </p>
                </div>
                <div
                  className="rounded-2xl border-2 p-4 text-center"
                  style={{
                    borderColor: 'rgba(239,68,68,0.4)',
                    backgroundColor: 'rgba(239,68,68,0.07)',
                  }}
                >
                  <p
                    className="text-xs font-semibold tracking-normal uppercase"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Poprawna odpowiedź
                  </p>
                  <p className="mt-1 font-bold" style={{ color: '#22c55e' }}>
                    {revealData.correctAnswer}
                  </p>
                </div>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Pozostałych: {revealData.survivingPlayers.length}
                </p>
              </motion.div>
            )}

            {/* Game over */}
            {phase === 'gameover' && (
              <motion.div
                key="gameover"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full"
              >
                <BattleRoyaleGameOverPanel
                  winnerName={winnerName}
                  players={[finalPlayer]}
                  currentPlayerId={playerId}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
