'use client'

import { motion } from 'framer-motion'
import { Clock3 } from 'lucide-react'

import { PlayerAvatar } from '@/components/PlayerAvatar'

interface Props {
  avatar: string
  answerCountdown: number | null
}

export function VotedWaiting({ avatar, answerCountdown }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 py-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="flex h-20 w-20 items-center justify-center rounded-full border-2 text-4xl"
        style={{
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.12)',
          boxShadow: '0 0 24px rgba(16,185,129,0.3)',
        }}
      >
        <PlayerAvatar avatar={avatar} size={48} />
      </motion.div>

      <div className="flex flex-col gap-1">
        <h2
          className="text-3xl tracking-normal"
          style={{ fontFamily: 'var(--font-app)', color: '#10b981' }}
        >
          Odpowiedź zapisana!
        </h2>
        <p className="text-text-muted text-sm">Czekaj na wyniki…</p>
      </div>

      {answerCountdown !== null && (
        <div
          className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold tabular-nums"
          style={{
            borderColor: answerCountdown <= 10 ? 'rgba(239,68,68,0.45)' : 'rgba(255,215,0,0.35)',
            backgroundColor: answerCountdown <= 10 ? 'rgba(239,68,68,0.1)' : 'rgba(255,215,0,0.08)',
            color: answerCountdown <= 10 ? '#f87171' : 'var(--sheriff-pink)',
          }}
        >
          <Clock3 size={15} />
          {formatCountdown(answerCountdown)}
        </div>
      )}

      <div className="mt-1 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: 'var(--neon-pink)' }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.35, 1, 0.35] }}
            transition={{ duration: 1.4, delay: i * 0.25, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  )
}

function formatCountdown(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}:${rest.toString().padStart(2, '0')}`
}
