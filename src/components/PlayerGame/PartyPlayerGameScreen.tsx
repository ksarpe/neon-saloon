'use client'

// PartyKit-backed player screen for the classic family of game modes.
// Mirrors the classic player UI flow and speaks WebSocket to the Durable Object.

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useAutoCountdown } from '@/hooks/useAutoCountdown'
import { DEFAULT_GAME_SETTINGS } from '@/hooks/useGameSettings'
import { usePartyConnection } from '@/hooks/usePartyConnection'
import type {
  GameFinishedPayload,
  GameStartedPayload,
  NextCardPayload,
  StandardGameSettings,
  VotesRevealedPayload,
  WireCard,
} from '@/lib/game-types'
import { clearPlayerCredentials } from '@/lib/party-ticket-client'

import { GameOverView } from './GameOverView'
import { PlayerHeader } from './PlayerHeader'
import { PlayingView } from './PlayingView'
import { RevealView } from './RevealView'
import type { Phase } from './types'
import { VotedWaiting } from './VotedWaiting'

type Props = {
  pin: string
  partyToken: string
  playerId: string
  playerName: string
  teamId: string | null
  teamName: string | null
  avatar: string
  initialCard?: WireCard
  initialCardIndex?: number
  initialCardStartedAt?: number | null
  initialHasVoted?: boolean
  initialSettings?: StandardGameSettings
}

export default function PartyPlayerGameScreen({
  pin,
  partyToken,
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
}: Props) {
  const [phase, setPhase] = useState<Phase>(initialHasVoted ? 'voted' : 'playing')
  const [isFlipped, setIsFlipped] = useState(Boolean(initialHasVoted))
  const [currentCard, setCurrentCard] = useState<WireCard | null>(initialCard ?? null)
  const [currentCardIndex, setCurrentCardIndex] = useState(initialCardIndex ?? 0)
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

  const handlers = useMemo(
    () => ({
      onGameStarted: (data: GameStartedPayload) => {
        setCurrentCard(data.card)
        setCurrentCardIndex(data.cardIndex)
        setCardStartedAt(data.cardStartedAt ?? Date.now())
        if (data.settings) setGameSettings((prev) => ({ ...prev, ...data.settings }))
        setRevealData(null)
        setRevealStartedAt(null)
        setVoteError(null)
        setIsFlipped(false)
        setPhase('playing')
      },
      onVotesRevealed: (data: VotesRevealedPayload) => {
        setRevealData(data)
        setRevealStartedAt(data.revealStartedAt ?? Date.now())
        setVoteError(null)
        setPhase('reveal')
      },
      onNextCard: (data: NextCardPayload) => {
        setCurrentCard(data.card)
        setCurrentCardIndex(data.cardIndex)
        setCardStartedAt(data.cardStartedAt ?? Date.now())
        setRevealStartedAt(null)
        if (data.settings) setGameSettings((prev) => ({ ...prev, ...data.settings }))
        setRevealData(null)
        setVoteError(null)
        setIsFlipped(false)
        setPhase('playing')
      },
      onGameFinished: (data: GameFinishedPayload) => {
        clearPlayerCredentials()
        setFinishData(data)
        setPhase('finished')
      },
    }),
    [],
  )

  const { send, snapshot, status } = usePartyConnection({
    pin,
    partyToken,
    role: 'player',
    handlers,
  })

  // Snapshot is authoritative on (re)connect — keep card in sync.
  useEffect(() => {
    if (!snapshot) return
    if (snapshot.currentCard) setCurrentCard(snapshot.currentCard)
    setCurrentCardIndex(snapshot.cardIndex)
    if (snapshot.status === 'finished') setPhase('finished')
  }, [snapshot])

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

  const castVote = useCallback(
    async (answerIndex: number, answerText: string) => {
      if (loading || !send) return
      setLoading(true)
      setVoteError(null)
      try {
        const result = await send({
          type: 'player:vote',
          cardIndex: currentCardIndex,
          answerIndex,
          answerText,
        })
        if (!result.ok) {
          setVoteError(
            /stale/i.test(result.error)
              ? 'Ta runda już się zmieniła. Poczekaj na następną kartę.'
              : 'Nie udało się zapisać głosu. Spróbuj jeszcze raz.',
          )
          return
        }
        setPhase('voted')
      } finally {
        setLoading(false)
      }
    },
    [send, loading, currentCardIndex],
  )

  // Track team membership reference so it stays available even if it changes.
  // (Not currently used in the WS payload, but logged in header.)
  void teamId
  void teamName
  void playerId

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <PlayerHeader pin={pin} avatar={avatar} playerName={playerName} teamName={teamName} />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-6">
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
          {status !== 'connected' && phase !== 'finished' && (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-center text-xs text-amber-300">
              {status === 'connecting' && 'Łączenie...'}
              {status === 'closed' && 'Połączenie zerwane — próbuję wrócić...'}
              {status === 'error' && 'Błąd połączenia.'}
            </div>
          )}

          <AnimatePresence mode="wait">
            {phase === 'playing' && !currentCard && (
              <motion.div
                key="waiting-for-host"
                className="flex w-full flex-col items-center gap-4 py-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className="h-10 w-10 animate-spin rounded-full border-2"
                  style={{
                    borderColor: 'rgba(255,220,180,0.18)',
                    borderTopColor: 'var(--neon-pink)',
                  }}
                />
                <p
                  className="text-xs tracking-wider uppercase"
                  style={{ color: 'rgba(255,220,180,0.6)' }}
                >
                  Czekamy aż szeryf zacznie grę…
                </p>
              </motion.div>
            )}

            {phase === 'playing' && currentCard && currentCard.id !== 'placeholder' && (
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

            {phase === 'reveal' && revealData && currentCard && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RevealView data={revealData} card={currentCard} countdown={countdown} currentPlayerId={playerId} />
              </motion.div>
            )}

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
