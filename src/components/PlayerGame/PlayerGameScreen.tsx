'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'

import { useAutoCountdown } from '@/hooks/useAutoCountdown'
import { DEFAULT_GAME_SETTINGS } from '@/hooks/useGameSettings'
import { useRealtimeGame as useGameSocket } from '@/hooks/useRealtimeGame'
import type {
  GameFinishedPayload,
  NextCardPayload,
  StandardGameSettings,
  VotesRevealedPayload,
  WireCard,
} from '@/lib/game-types'
import {
  clearPlayerSession,
  playerAuthHeaders,
  playerJsonHeaders,
} from '@/lib/session-player-secret'

import { GameOverView } from './GameOverView'
import { PlayerHeader } from './PlayerHeader'
import { PlayingView } from './PlayingView'
import { RevealView } from './RevealView'
import type { Phase, PlayerGameScreenProps } from './types'
import { VotedWaiting } from './VotedWaiting'

type ClassicResumeState = {
  cardIndex: number
  card: WireCard
  cardStartedAt: number | null
  hasVoted: boolean
  settings: StandardGameSettings | null
  currentReveal: (VotesRevealedPayload & { revealStartedAt?: number }) | null
}

export default function PlayerGameScreen({
  pin,
  playerId,
  playerName,
  teamId,
  teamName,
  avatar,
  initialCard,
  initialCardIndex,
  initialCardStartedAt,
  initialHasVoted,
  initialSettings,
}: PlayerGameScreenProps) {
  const [phase, setPhase] = useState<Phase>(initialHasVoted ? 'voted' : 'playing')
  const [isFlipped, setIsFlipped] = useState(Boolean(initialHasVoted))
  const [currentCard, setCurrentCard] = useState<WireCard>(initialCard)
  const [currentCardIndex, setCurrentCardIndex] = useState(initialCardIndex)
  const [cardStartedAt, setCardStartedAt] = useState<number | null>(initialCardStartedAt ?? null)
  const [revealStartedAt, setRevealStartedAt] = useState<number | null>(null)
  const [revealData, setRevealData] = useState<VotesRevealedPayload | null>(null)
  const [finishData, setFinishData] = useState<GameFinishedPayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [voteError, setVoteError] = useState<string | null>(null)
  const [gameSettings, setGameSettings] = useState(() => ({
    ...DEFAULT_GAME_SETTINGS,
    ...initialSettings,
  }))
  const alignServerTimestamp = useCallback((timestamp?: number | null, serverNow?: number) => {
    if (typeof timestamp !== 'number') return null
    if (typeof serverNow !== 'number') return timestamp
    return Date.now() - Math.max(0, serverNow - timestamp)
  }, [])

  const applyClassicState = useCallback(
    (classic: ClassicResumeState, serverNow?: number) => {
      if (!classic.card) return

      if (classic.cardIndex !== currentCardIndex || classic.card.id !== currentCard.id) {
        setCurrentCard(classic.card)
        setCurrentCardIndex(classic.cardIndex)
        setIsFlipped(Boolean(classic.hasVoted))
        setVoteError(null)
      }

      setCardStartedAt(alignServerTimestamp(classic.cardStartedAt, serverNow))
      if (classic.settings) setGameSettings((prev) => ({ ...prev, ...classic.settings }))

      if (classic.currentReveal) {
        setRevealData(classic.currentReveal)
        setRevealStartedAt(
          alignServerTimestamp(classic.currentReveal.revealStartedAt, serverNow) ?? Date.now()
        )
        setVoteError(null)
        setPhase('reveal')
        return
      }

      setRevealData(null)
      setRevealStartedAt(null)
      setPhase(classic.hasVoted ? 'voted' : 'playing')
    },
    [alignServerTimestamp, currentCard.id, currentCardIndex]
  )
  const countdown = useAutoCountdown({
    active: phase === 'reveal',
    seconds: gameSettings.revealCountdownSeconds,
    resetKey: currentCardIndex,
    startedAtMs: revealStartedAt,
  })
  const answerCountdown = useAutoCountdown({
    active: phase === 'playing' || phase === 'voted',
    seconds: gameSettings.answerTimeLimitSeconds,
    resetKey: currentCardIndex,
    startedAtMs: cardStartedAt,
  })

  useGameSocket(pin, {
    onVotesRevealed: useCallback((d: VotesRevealedPayload) => {
      setRevealData(d)
      setRevealStartedAt(d.revealStartedAt ?? Date.now())
      setVoteError(null)
      setPhase('reveal')
    }, []),
    onNextCard: useCallback((d: NextCardPayload) => {
      setCurrentCard(d.card)
      setCurrentCardIndex(d.cardIndex)
      setCardStartedAt(d.cardStartedAt ?? Date.now())
      setRevealStartedAt(null)
      if (d.settings) setGameSettings((prev) => ({ ...prev, ...d.settings }))
      setRevealData(null)
      setVoteError(null)
      setIsFlipped(false)
      setPhase('playing')
    }, []),
    onGameFinished: useCallback((d: GameFinishedPayload) => {
      clearPlayerSession(pin)
      setFinishData(d)
      setPhase('finished')
    }, [pin]),
  })

  useEffect(() => {
    if (phase === 'finished') return

    const refreshState = async () => {
      if (window.location.pathname !== '/graj/join') return
      if (document.visibilityState !== 'visible') return

      try {
        const response = await fetch(`/api/sessions/${pin}/resume`, {
          headers: playerAuthHeaders(pin, playerId),
        })
        if (!response.ok) return
        const data = await response.json()

        if (data.session?.status === 'finished' && data.finished) {
          clearPlayerSession(pin)
          setFinishData(data.finished)
          setPhase('finished')
          return
        }

        if (data.session?.status === 'active' && data.classic) {
          applyClassicState(data.classic, data.serverNow)
        }
      } catch {
        // Realtime remains the primary path; polling is only a recovery path.
      }
    }

    void refreshState()
    const intervalMs = phase === 'voted' || phase === 'reveal' ? 5000 : 8000
    const id = window.setInterval(refreshState, intervalMs)
    return () => window.clearInterval(id)
  }, [applyClassicState, phase, pin, playerId])

  const castVote = useCallback(
    async (answerIndex: number, answerText: string) => {
      if (loading) return
      setLoading(true)
      setVoteError(null)
      try {
        const response = await fetch(`/api/sessions/${pin}/vote`, {
          method: 'POST',
          headers: playerJsonHeaders(pin, playerId),
          body: JSON.stringify({
            playerId,
            playerName,
            teamId,
            teamName,
            cardIndex: currentCardIndex,
            answerIndex,
            answerText,
          }),
        })
        if (!response.ok) {
          setVoteError(
            response.status === 409
              ? 'Ta runda już się zmieniła. Poczekaj na następną kartę.'
              : 'Nie udało się zapisać głosu. Spróbuj jeszcze raz.'
          )
          return
        }
        setPhase('voted')
      } finally {
        setLoading(false)
      }
    },
    [loading, pin, playerId, playerName, teamId, teamName, currentCardIndex]
  )

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <PlayerHeader pin={pin} avatar={avatar} playerName={playerName} teamName={teamName} />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
          <AnimatePresence mode="wait">
            {/* Playing */}
            {phase === 'playing' && (
              <motion.div
                key={`card-${currentCard.id}`}
                className="flex w-full flex-col items-center gap-6"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <PlayingView
                  card={currentCard}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(true)}
                  loading={loading}
                  answerCountdown={answerCountdown}
                  castVote={castVote}
                />
                {voteError && (
                  <p className="max-w-md text-center text-xs font-semibold text-red-300">
                    {voteError}
                  </p>
                )}
              </motion.div>
            )}

            {/* Voted — waiting for results */}
            {phase === 'voted' && (
              <motion.div
                key="voted"
                className="flex w-full flex-col items-center gap-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <VotedWaiting avatar={avatar} answerCountdown={answerCountdown} />
              </motion.div>
            )}

            {/* Reveal */}
            {phase === 'reveal' && revealData && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RevealView data={revealData} card={currentCard} countdown={countdown} />
              </motion.div>
            )}

            {/* Finished */}
            {phase === 'finished' && finishData && (
              <motion.div
                key="finished"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <GameOverView data={finishData} currentPlayerId={playerId} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
