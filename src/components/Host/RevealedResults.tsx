'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import type { GameCard } from '@/lib/store'
import type { VoteRecord, ScoreEntry } from './types'

interface Props {
  card: GameCard
  revealedVotes: VoteRecord[]
  scores: ScoreEntry[]
  hostPlayerId: string | null
  countdown: number | null
}

export function RevealedResults({ card, revealedVotes, scores, hostPlayerId, countdown }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full max-w-sm flex-col gap-2"
    >
      <p className="text-text-muted text-center text-xs font-semibold tracking-normal uppercase">
        Wyniki
      </p>

      {/* Per-player vote results */}
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
                    : isNotDrinking || (card.type !== 'NEVER' && !isCorrect && v.answerIndex >= 0)
                      ? 'rgba(239,68,68,0.15)'
                      : 'rgba(255,220,180,0.1)',
                color:
                  isCorrect || isDrinking
                    ? '#10b981'
                    : isNotDrinking || (card.type !== 'NEVER' && !isCorrect && v.answerIndex >= 0)
                      ? '#ef4444'
                      : 'rgba(255,220,180,0.7)',
              }}
            >
              {v.answerText}
            </span>
          </motion.div>
        )
      })}

      {/* Mini ranking */}
      {scores.filter((s) => s.score > 0).length > 0 && (
        <div className="border-saloon-border mt-1 flex flex-col gap-1.5 border-t pt-3">
          <p className="text-text-muted mb-1 flex items-center gap-1.5 text-[10px] font-bold tracking-normal uppercase">
            <Star size={10} fill="var(--sheriff-pink)" style={{ color: 'var(--sheriff-pink)' }} />
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
                    fill="var(--sheriff-pink)"
                    style={{ color: 'var(--sheriff-pink)' }}
                  />
                  <span className="text-xs font-bold" style={{ color: 'var(--sheriff-pink)' }}>
                    {s.score}
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Countdown to next card */}
      {countdown !== null && (
        <div className="flex h-8 items-center justify-center">
          <motion.p
            key={countdown}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-bold tabular-nums"
            style={{ color: 'var(--neon-pink)' }}
          >
            Następna karta za {countdown}…
          </motion.p>
        </div>
      )}
    </motion.div>
  )
}
