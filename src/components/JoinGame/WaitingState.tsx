'use client'

import { motion } from 'framer-motion'

interface Props {
  playerName: string
  teamName: string | null
  avatar: string
}

export function WaitingState({ playerName, teamName, avatar }: Props) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="flex h-20 w-20 items-center justify-center rounded-full text-4xl"
        style={{
          backgroundColor: 'rgba(16,185,129,0.15)',
          border: '2px solid #10b981',
        }}
      >
        {avatar}
      </motion.div>

      <div>
        <h2
          className="text-4xl tracking-normal"
          style={{ fontFamily: 'var(--font-app)', color: 'var(--sheriff-pink)' }}
        >
          Siodła w dłoń i otwieramy rodeo!
        </h2>
        <p className="text-text-muted mt-1 text-sm">
          Witaj, <span className="text-text-primary font-bold">{playerName}</span>!
        </p>
        {teamName && (
          <p className="mt-1 text-xs" style={{ color: 'var(--neon-pink)' }}>
            Gang: {teamName}
          </p>
        )}
      </div>

      <div className="bg-saloon-surface border-saloon-border flex w-full max-w-xs flex-col items-center gap-3 rounded-2xl border px-6 py-5">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: 'var(--neon-pink)' }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.4, delay: i * 0.25, repeat: Infinity }}
            />
          ))}
        </div>
        <p className="text-text-muted text-sm font-medium">Czekaj aż szeryf zacznie grę.</p>
        <p className="text-text-muted text-[10px] opacity-50">
          Ekran zaktualizuje się automatycznie
        </p>
      </div>
    </div>
  )
}
