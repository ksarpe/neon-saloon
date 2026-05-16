'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Check } from 'lucide-react'
import type { GameCard } from '@/lib/store'

interface Props {
  card: GameCard
  isHostPlayer: boolean
  isRevealed: boolean
  hostHasVoted: boolean
  hostLoading: boolean
  onHostVote: (answerIndex: number, answerText: string) => void
}

export function HostVoteButtons({
  card,
  isHostPlayer,
  isRevealed,
  hostHasVoted,
  hostLoading,
  onHostVote,
}: Props) {
  return (
    <AnimatePresence>
      {isHostPlayer && !isRevealed && (
        <motion.div
          key="host-vote"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="w-full max-w-sm"
        >
          {/* Already voted */}
          {hostHasVoted ? (
            <div
              className="flex items-center justify-center gap-2 rounded-2xl border py-3"
              style={{ borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)' }}
            >
              <Check size={14} color="#10b981" />
              <span className="text-sm font-semibold" style={{ color: '#10b981' }}>
                Twój głos zapisany
              </span>
            </div>

          ) : card.type === 'NEVER' ? (
            /* NEVER: Nie piję / Piję */
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={hostLoading}
                onClick={() => onHostVote(-2, '🚫 Nie piję')}
                className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl border-2 py-4 disabled:opacity-40"
                style={{
                  borderColor: 'rgba(255,220,180,0.25)',
                  backgroundColor: 'rgba(255,220,180,0.06)',
                  color: 'rgba(255,220,180,0.8)',
                  fontFamily: "'Bebas Neue',cursive",
                  letterSpacing: '0.08em',
                  fontSize: '0.95rem',
                }}
              >
                <span className="text-xl">🚫</span>
                NIE PIJĘ
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={hostLoading}
                onClick={() => onHostVote(-1, '🍺 Piję')}
                className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl border-2 py-4 disabled:opacity-40"
                style={{
                  borderColor: 'var(--neon-pink)',
                  backgroundColor: 'rgba(255,16,240,0.1)',
                  color: 'var(--neon-pink)',
                  boxShadow: '0 0 20px rgba(255,16,240,0.2)',
                  fontFamily: "'Bebas Neue',cursive",
                  letterSpacing: '0.08em',
                  fontSize: '0.95rem',
                }}
              >
                <span className="text-xl">🍺</span>
                PIJĘ
              </motion.button>
            </div>

          ) : card.options && card.options.length > 0 ? (
            /* Multiple choice options */
            <div className="flex flex-col gap-2">
              {card.options.map((opt, idx) => {
                const letter = String.fromCharCode(65 + idx)
                return (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.98 }}
                    disabled={hostLoading}
                    onClick={() => onHostVote(idx, `${letter}: ${opt}`)}
                    className="flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left disabled:opacity-40"
                    style={{
                      borderColor: 'rgba(255,220,180,0.15)',
                      backgroundColor: 'rgba(255,220,180,0.05)',
                    }}
                    whileHover={{
                      borderColor: 'var(--neon-pink)',
                      backgroundColor: 'rgba(255,16,240,0.08)',
                      transition: { duration: 0.15 },
                    }}
                  >
                    <span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-black"
                      style={{
                        backgroundColor: 'rgba(255,16,240,0.15)',
                        color: 'var(--neon-pink)',
                        fontFamily: "'Bebas Neue',cursive",
                      }}
                    >
                      {letter}
                    </span>
                    <span className="text-text-primary text-sm leading-snug font-semibold">
                      {opt}
                    </span>
                  </motion.button>
                )
              })}
            </div>

          ) : (
            /* Boolean yes / no */
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={hostLoading}
                onClick={() => onHostVote(-2, '❌ Nie')}
                className="flex flex-1 items-center justify-center rounded-2xl border-2 border-red-500/40 bg-red-500/10 py-4 text-sm font-bold text-red-400 disabled:opacity-40"
              >
                Nie
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={hostLoading}
                onClick={() => onHostVote(-1, '✅ Tak')}
                className="flex flex-1 items-center justify-center rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 py-4 text-sm font-bold text-emerald-400 disabled:opacity-40"
              >
                Tak!
              </motion.button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
