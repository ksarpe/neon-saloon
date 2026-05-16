'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import { GameCardStack } from '@/components/Card'
import type { GameCard } from '@/lib/store'
import type { VoteCastPayload } from '@/lib/game-types'
import type { LivePlayer, VoteRecord, ScoreEntry } from './types'
import { HostVoteButtons } from './HostVoteButtons'
import { RevealedResults } from './RevealedResults'

interface Props {
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
}

export function ActiveCardView({
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
}: Props) {
  const isHostPlayer = hostPlayerId !== null && players.some((p) => p.playerId === hostPlayerId)

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
                  backgroundColor: hasVoted
                    ? 'rgba(255,16,240,0.12)'
                    : 'rgba(255,220,180,0.07)',
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
      <HostVoteButtons
        card={card}
        isHostPlayer={isHostPlayer}
        isRevealed={isRevealed}
        hostHasVoted={hostHasVoted}
        hostLoading={hostLoading}
        onHostVote={onHostVote}
      />

      {/* Revealed results + ranking + countdown */}
      {isRevealed && (
        <RevealedResults
          card={card}
          revealedVotes={revealedVotes}
          scores={scores}
          hostPlayerId={hostPlayerId}
          countdown={countdown}
        />
      )}

      {/* Waiting for votes status */}
      {!isRevealed && votes.length < players.length && players.length > 0 && (
        <div className="flex h-8 items-center justify-center">
          <p className="text-text-muted text-xs">
            Czeka na{' '}
            <span className="text-text-primary font-bold">{players.length - votes.length}</span>{' '}
            {players.length - votes.length === 1 ? 'głos' : 'głosy'}
          </p>
        </div>
      )}
    </div>
  )
}
