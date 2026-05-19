'use client'

import { motion } from 'framer-motion'
import { PulsingDots } from './PulsingDots'

interface Props {
  avatar: string
  teamName: string | null
}

export function PlayerWaiting({ avatar, teamName }: Props) {
  return (
    <motion.div
      key="waiting"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center gap-6 text-center"
    >
      <div
        className="flex h-24 w-24 items-center justify-center rounded-full border-2 text-5xl"
        style={{ borderColor: 'rgba(255,215,0,0.4)', backgroundColor: 'rgba(255,215,0,0.06)' }}
      >
        {avatar}
      </div>
      <div>
        <h1
          className="text-sheriff-pink text-5xl tracking-widest"
          style={{ fontFamily: "var(--font-app)" }}
        >
          mniej czy więcej
        </h1>
        {teamName && (
          <p className="text-text-muted mt-1 text-xs">
            Drużyna: <span className="text-text-primary font-bold">{teamName}</span>
          </p>
        )}
      </div>
      <div
        className="bg-saloon-surface border-saloon-border flex w-full flex-col items-center gap-3 rounded-2xl border px-6 py-5"
      >
        <PulsingDots color="var(--neon-pink)" />
        <p className="text-text-muted text-sm font-medium">Czekaj na hosta…</p>
        <p className="text-text-muted text-[10px] opacity-50">
          Ekran zaktualizuje się automatycznie
        </p>
      </div>
    </motion.div>
  )
}
