'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import type { HighLowRoundResultPayload } from '@/lib/game-types'

interface Props {
  resultData: HighLowRoundResultPayload
  teamId: string | null
  myScore: number
}

export function PlayerResult({ resultData, teamId, myScore }: Props) {
  const won = resultData.winningTeamId === teamId

  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex w-full flex-col items-center gap-5 text-center"
    >
      {won ? (
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="text-5xl">🎉</div>
          <p
            className="text-3xl font-black tracking-widest"
            style={{ color: '#10b981', fontFamily: "'Bebas Neue',cursive" }}
          >
            Wasza drużyna wygrywa!
          </p>
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
            style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: '#10b981' }}
          >
            <Star size={12} fill="#10b981" />
            <span className="text-xs font-bold">+1 punkt dla każdego!</span>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="text-5xl">😬</div>
          <p
            className="text-3xl font-black tracking-widest"
            style={{ color: '#ef4444', fontFamily: "'Bebas Neue',cursive" }}
          >
            Nie tym razem
          </p>
        </div>
      )}

      <div
        className="w-full rounded-2xl border-2 p-5"
        style={{ borderColor: 'rgba(16,185,129,0.35)', backgroundColor: 'rgba(16,185,129,0.05)' }}
      >
        <p className="text-text-muted mb-1 text-xs tracking-widest uppercase">
          Prawidłowa odpowiedź
        </p>
        <p
          className="text-5xl font-black"
          style={{ color: '#10b981', fontFamily: "'Bebas Neue',cursive" }}
        >
          {resultData.correctAnswer.toLocaleString('pl-PL')}{' '}
          <span className="text-2xl">{resultData.unit}</span>
        </p>
      </div>

      <div
        className="flex items-center gap-2 rounded-xl border px-4 py-2"
        style={{
          borderColor: 'rgba(255,215,0,0.3)',
          backgroundColor: 'rgba(255,215,0,0.06)',
          color: 'var(--sheriff-gold)',
        }}
      >
        <Star size={14} fill="var(--sheriff-gold)" />
        <span className="text-sm font-bold">Twój wynik: {myScore} pkt</span>
      </div>

      <p className="text-text-muted text-xs">Czekaj na kolejną rundę…</p>
    </motion.div>
  )
}
