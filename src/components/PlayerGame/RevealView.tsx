'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import type { VotesRevealedPayload } from '@/lib/game-types'

interface Props {
  data: VotesRevealedPayload
  countdown: number | null
}

export function RevealView({ data, countdown }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex w-full max-w-sm flex-col gap-3"
    >
      <p className="text-text-muted text-center text-xs font-semibold tracking-normal uppercase">
        OTO WYNIKI
      </p>

      {/* Per-player vote rows */}
      {data.votes.map((v, i) => {
        const hasCorrectAnswer = !!data.correctAnswer
        const rawAnswerText = v.answerText.replace(/^[A-Z]: /, '')
        const isCorrect = hasCorrectAnswer && rawAnswerText === data.correctAnswer
        const isWrong = hasCorrectAnswer && !isCorrect
        const isDrinking = !hasCorrectAnswer && v.answerIndex === -1
        const isNotDrinking = !hasCorrectAnswer && v.answerIndex === -2
        return (
          <motion.div
            key={v.playerId}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="border-saloon-border bg-saloon-surface flex items-center gap-3 rounded-xl border p-3"
          >
            <span className="text-text-primary flex-1 text-sm font-semibold">
              {v.teamName ?? v.playerName}
            </span>
            <span
              className="rounded-full px-2 py-0.5 text-xs font-bold"
              style={{
                backgroundColor:
                  isCorrect || isDrinking
                    ? 'rgba(16,185,129,0.15)'
                    : isWrong || isNotDrinking
                      ? 'rgba(239,68,68,0.15)'
                      : 'rgba(255,220,180,0.1)',
                color:
                  isCorrect || isDrinking
                    ? '#10b981'
                    : isWrong || isNotDrinking
                      ? '#ef4444'
                      : 'rgba(255,220,180,0.7)',
              }}
            >
              {v.answerText}
            </span>
          </motion.div>
        )
      })}

      {/* Rankings */}
      {data.scores.length > 0 && (
        <div className="border-saloon-border mt-4 flex flex-col gap-3 border-t-2 pt-4">
          <p className="text-text-muted flex items-center justify-center gap-2 text-xs font-bold tracking-[0.2em] uppercase">
            <Star size={12} fill="var(--sheriff-pink)" style={{ color: 'var(--sheriff-pink)' }} />
            RANKING OGÓLNY
            <Star size={12} fill="var(--sheriff-pink)" style={{ color: 'var(--sheriff-pink)' }} />
          </p>
          <div className="flex flex-col gap-2">
            {[...data.scores]
              .sort((a, b) => b.score - a.score)
              .map((s, i) => (
                <div
                  key={s.playerId}
                  className="bg-saloon-card border-saloon-border flex items-center gap-3 rounded-xl border p-3 shadow-lg"
                >
                  <span className="text-neon-pink w-6 text-center font-black">{i + 1}.</span>
                  <span className="text-text-primary flex-1 text-sm font-bold">{s.playerName}</span>
                  <div className="flex items-center gap-1 rounded-lg bg-black/30 px-2 py-1">
                    <Star
                      size={12}
                      fill="var(--sheriff-pink)"
                      style={{ color: 'var(--sheriff-pink)' }}
                    />
                    <span className="text-sm font-black" style={{ color: 'var(--sheriff-pink)' }}>
                      {s.score}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Countdown */}
      {countdown !== null && (
        <p className="text-text-muted mt-1 animate-pulse text-center text-xs">
          Następna karta za {countdown}…
        </p>
      )}
    </motion.div>
  )
}
