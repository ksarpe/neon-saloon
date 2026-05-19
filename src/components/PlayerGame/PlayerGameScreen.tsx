'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRealtimeGame as useGameSocket } from '@/hooks/useRealtimeGame'
import { playerJsonHeaders } from '@/lib/session-player-secret'
import type {
  WireCard,
  VotesRevealedPayload,
  NextCardPayload,
  GameFinishedPayload,
} from '@/lib/game-types'
import type { Phase, PlayerGameScreenProps } from './types'
import { REVEAL_COUNTDOWN_SECONDS } from '@/lib/game-config'
import { PlayerHeader } from './PlayerHeader'
import { PlayingView } from './PlayingView'
import { VotedWaiting } from './VotedWaiting'
import { RevealView } from './RevealView'
import { GameOverView } from './GameOverView'

export default function PlayerGameScreen({
  pin,
  playerId,
  playerName,
  teamId,
  teamName,
  avatar,
  initialCard,
  initialCardIndex,
  initialHasVoted,
}: PlayerGameScreenProps) {
  const [phase, setPhase] = useState<Phase>(initialHasVoted ? 'voted' : 'playing')
  const [isFlipped, setIsFlipped] = useState(Boolean(initialHasVoted))
  const [currentCard, setCurrentCard] = useState<WireCard>(initialCard)
  const [currentCardIndex, setCurrentCardIndex] = useState(initialCardIndex)
  const [revealData, setRevealData] = useState<VotesRevealedPayload | null>(null)
  const [finishData, setFinishData] = useState<GameFinishedPayload | null>(null)
  const [loading, setLoading] = useState(false)
  const [voteError, setVoteError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)

  // Visual countdown after reveal — host sends the actual next-card event
  useEffect(() => {
    if (phase !== 'reveal') {
      setCountdown(null)
      return
    }
    setCountdown(REVEAL_COUNTDOWN_SECONDS)
    let n = REVEAL_COUNTDOWN_SECONDS
    const tick = setInterval(() => {
      n -= 1
      if (n <= 0) {
        clearInterval(tick)
        setCountdown(null)
      } else setCountdown(n)
    }, 1000)
    return () => clearInterval(tick)
  }, [phase, currentCardIndex])

  useGameSocket(pin, {
    onVotesRevealed: useCallback((d: VotesRevealedPayload) => {
      setRevealData(d)
      setVoteError(null)
      setPhase('reveal')
    }, []),
    onNextCard: useCallback((d: NextCardPayload) => {
      setCurrentCard(d.card)
      setCurrentCardIndex(d.cardIndex)
      setRevealData(null)
      setVoteError(null)
      setIsFlipped(false)
      setPhase('playing')
    }, []),
    onGameFinished: useCallback((d: GameFinishedPayload) => {
      setFinishData(d)
      setPhase('finished')
    }, []),
  })

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
                <VotedWaiting avatar={avatar} />
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
                <RevealView data={revealData} countdown={countdown} />
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
                <GameOverView data={finishData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
