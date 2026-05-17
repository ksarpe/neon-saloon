'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { GameCardStack } from '@/components/Card'
import type { WireCard } from '@/lib/game-types'

interface Props {
  card: WireCard
  isFlipped: boolean
  onFlip: () => void
  loading: boolean
  castVote: (answerIndex: number, answerText: string) => void
}

export function PlayingView({ card, isFlipped, onFlip, loading, castVote }: Props) {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <GameCardStack card={card} isFlipped={isFlipped} onFlip={onFlip} />

      <AnimatePresence>
        {/* Multiple-choice or yes/no options */}
        {isFlipped && card.type !== 'NEVER' && (
          <motion.div
            key="btns"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            {card.options && card.options.length > 0 ? (
              <div className="flex w-full flex-col gap-2.5">
                {card.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx)
                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      onClick={() => castVote(idx, `${letter}: ${opt}`)}
                      className="group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border-2 px-4 py-3.5 text-left"
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
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm font-black"
                        style={{
                          backgroundColor: 'rgba(255,16,240,0.15)',
                          color: 'var(--neon-pink)',
                          fontFamily: "var(--font-app)",
                          letterSpacing: '0.05em',
                          fontSize: '1rem',
                        }}
                      >
                        {letter}
                      </span>
                      <span className="text-text-primary text-sm font-semibold leading-snug">
                        {opt}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            ) : (
              <div className="flex w-full gap-3">
                <motion.button
                  id="player-fail-btn"
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                  onClick={() => castVote(-2, '❌ Nie')}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-red-500/40 bg-red-500/10 py-4 text-sm font-bold text-red-400"
                >
                  Nie
                </motion.button>
                <motion.button
                  id="player-done-btn"
                  whileTap={{ scale: 0.95 }}
                  disabled={loading}
                  onClick={() => castVote(-1, '✅ Tak')}
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 py-4 text-sm font-bold text-emerald-400"
                >
                  Tak!
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {/* NEVER cards — PIJĘ / NIE PIJĘ */}
        {isFlipped && card.type === 'NEVER' && (
          <motion.div
            key="never-btns"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex w-full gap-3"
          >
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              onClick={() => castVote(-2, '🚫 Nie piję')}
              className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl border-2 py-5 text-sm font-black"
              style={{
                borderColor: 'rgba(255,220,180,0.25)',
                backgroundColor: 'rgba(255,220,180,0.06)',
                color: 'rgba(255,220,180,0.8)',
                fontFamily: "var(--font-app)",
                letterSpacing: '0.08em',
                fontSize: '1rem',
              }}
            >
              <span className="text-2xl">🚫</span>
              NIE PIJĘ
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={loading}
              onClick={() => castVote(-1, '🍺 Piję')}
              className="flex flex-1 flex-col items-center justify-center gap-1 rounded-2xl border-2 py-5 text-sm font-black"
              style={{
                borderColor: 'var(--neon-pink)',
                backgroundColor: 'rgba(255,16,240,0.1)',
                color: 'var(--neon-pink)',
                boxShadow: '0 0 20px rgba(255,16,240,0.2)',
                fontFamily: "var(--font-app)",
                letterSpacing: '0.08em',
                fontSize: '1rem',
              }}
            >
              <span className="text-2xl">🍺</span>
              PIJĘ
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
