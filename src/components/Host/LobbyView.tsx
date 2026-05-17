'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Play, Users } from 'lucide-react'
import type { LivePlayer } from './types'
import { Button } from '@/components/ui/button'

interface Props {
  pin: string
  players: LivePlayer[]
  hostAvatar: string
  hostName: string
  onStart: () => void
}

export function LobbyView({ pin, players, hostAvatar, hostName, onStart }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8">
      <div className="text-center">
        <h1
          className="shimmer-text mt-2 text-6xl tracking-widest sm:text-8xl"
          style={{ fontFamily: "var(--font-app)" }}
        >
          last rodeo andżeliki
        </h1>
      </div>

      {/* Host identity */}
      <div
        className="flex items-center gap-3 rounded-2xl border px-5 py-3"
        style={{ borderColor: 'var(--sheriff-gold)', backgroundColor: 'rgba(255,215,0,0.07)' }}
      >
        <span className="text-2xl">{hostAvatar}</span>
        <div>
          <p className="text-text-muted text-xs font-semibold tracking-widest uppercase">
            Ty (organizator)
          </p>
          <p className="text-text-primary font-bold">{hostName}</p>
        </div>
      </div>

      {/* PIN */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-text-muted text-xs font-semibold tracking-widest uppercase">KOD GRY</p>
        <div className="flex gap-3">
          {pin.split('').map((d, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
              className="pulse-pink flex h-24 w-20 items-center justify-center rounded-2xl border-2 text-5xl font-bold sm:h-32 sm:w-28 sm:text-6xl"
              style={{
                fontFamily: "var(--font-app)",
                color: 'var(--neon-pink)',
                borderColor: 'var(--neon-pink)',
                backgroundColor: 'rgba(255,16,240,0.07)',
              }}
            >
              {d}
            </motion.div>
          ))}
        </div>
        <p className="text-text-muted text-xs">
          Gracze wchodzą na{' '}
          <span className="text-text-primary font-bold">lastrodeoandzeliki.pl/join</span>
        </p>
      </div>

      {/* Players */}
      <div className="w-full">
        <div className="mb-3 flex items-center justify-center gap-2">
          <Users size={14} style={{ color: 'var(--sheriff-gold)' }} />
          <span
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: 'var(--sheriff-gold)' }}
          >
            {players.length} {players.length === 1 ? 'cowgirl' : 'cowgirls'} w salonie
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <AnimatePresence>
            {players.map((p) => (
              <motion.div
                key={p.playerId}
                layout
                initial={{ opacity: 0, scale: 0.6, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="flex items-center gap-2 rounded-full border px-4 py-2.5"
                style={{
                  borderColor: p.teamId ? 'var(--neon-pink)' : 'var(--saloon-border)',
                  backgroundColor: p.teamId ? 'rgba(255,16,240,0.08)' : 'var(--saloon-surface)',
                }}
              >
                <span className="text-lg">{p.avatar}</span>
                <p className="text-text-primary text-sm leading-snug font-bold">{p.playerName}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {players.length === 0 && (
            <p className="text-text-muted text-sm opacity-50">Oczekuję na kowbojki …</p>
          )}
        </div>
      </div>

      <Button
        id="host-start-btn"
        type="primary"
        disabled={players.length < 1}
        onClick={onStart}
        size="lg"
      >
        <Play size={22} /> Rozpocznij grę
      </Button>
    </div>
  )
}
