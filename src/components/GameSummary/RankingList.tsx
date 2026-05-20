'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import React from 'react'

import type { SummaryScore } from './types'

const MEDALS = ['🥇', '🥈', '🥉']

const RANK_STYLES = [
  { border: 'rgba(192,192,192,0.5)', bg: 'rgba(192,192,192,0.06)' },
  { border: 'rgba(205,127,50,0.5)', bg: 'rgba(205,127,50,0.06)' },
]

interface Props {
  scores: SummaryScore[]
  unit?: string
  icon?: React.ReactNode
}

export function RankingList({ scores, unit = 'pkt', icon }: Props) {
  const sorted = [...scores].sort((a, b) => b.score - a.score)
  const winner = sorted[0] ?? null
  const rest = sorted.slice(1)

  return (
    <>
      {winner ? (
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 18 }}
          className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 p-6"
          style={{
            borderColor: 'var(--sheriff-pink)',
            backgroundColor: 'rgba(255,215,0,0.07)',
            boxShadow: '0 0 48px rgba(255,215,0,0.22)',
          }}
        >
          <motion.span
            className="text-5xl"
            animate={{ rotate: [0, -8, 8, -8, 0] }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {icon ?? '👑'}
          </motion.span>
          <p
            className="text-3xl leading-tight font-black tracking-wide"
            style={{
              fontFamily: 'var(--font-app)',
              color: 'var(--sheriff-pink)',
              letterSpacing: '0.08em',
              textShadow: '0 0 24px rgba(255,215,0,0.6)',
            }}
          >
            {winner.name}
          </p>
          <div className="flex items-center gap-1.5">
            <Star size={16} fill="var(--sheriff-pink)" style={{ color: 'var(--sheriff-pink)' }} />
            <span className="text-2xl font-black" style={{ color: 'var(--sheriff-pink)' }}>
              {winner.score}
            </span>
            <span className="text-text-muted text-sm">{unit}</span>
          </div>
        </motion.div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-muted text-sm"
        >
          Tym razem nikt nie zdobył punktów
        </motion.p>
      )}

      {rest.length > 0 && (
        <div className="flex w-full flex-col gap-2">
          {rest.map((s, i) => {
            const rank = i + 2
            const style = RANK_STYLES[i] ?? {
              border: 'var(--saloon-border)',
              bg: 'var(--saloon-surface)',
            }
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="flex items-center gap-3 rounded-xl border px-4 py-3.5"
                style={{ borderColor: style.border, backgroundColor: style.bg }}
              >
                <span className="w-8 shrink-0 text-center text-xl">
                  {MEDALS[rank - 1] ?? (
                    <span className="text-text-muted text-xs font-bold">{rank}.</span>
                  )}
                </span>
                <span className="text-text-primary flex-1 text-left text-sm font-bold">
                  {s.name}
                </span>
                <div className="flex shrink-0 items-center gap-1">
                  <Star
                    size={11}
                    fill="var(--sheriff-pink)"
                    style={{ color: 'var(--sheriff-pink)' }}
                  />
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color: 'var(--sheriff-pink)' }}
                  >
                    {s.score}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </>
  )
}
