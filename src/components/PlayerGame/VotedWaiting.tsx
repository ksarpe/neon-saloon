'use client'

import { motion } from 'framer-motion'

interface Props {
  avatar: string
}

export function VotedWaiting({ avatar }: Props) {
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
        {avatar}
      </motion.div>

      <div className="flex flex-col gap-1">
        <h2
          className="text-3xl tracking-widest"
          style={{ fontFamily: "'Bebas Neue',cursive", color: '#10b981' }}
        >
          Odpowiedź zapisana!
        </h2>
        <p className="text-text-muted text-sm">Czekaj na wyniki…</p>
      </div>

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
