'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Play, Users } from 'lucide-react'

import { JoinQrCode } from '@/components/JoinQrCode'
import { PlayerAvatar } from '@/components/PlayerAvatar'
import { Button } from '@/components/ui/button'

import type { LivePlayer } from './types'

interface Props {
  pin: string
  players: LivePlayer[]
  hostAvatar: string
  hostName: string
  onStart: () => void
}

export function LobbyView({ pin, players, onStart }: Props) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8">
      {/* PIN */}
      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1.5 sm:gap-2 lg:gap-3">
              {pin.split('').map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                  className="pulse-pink flex h-16 w-11 items-center justify-center rounded-xl border-2 text-3xl font-bold sm:h-24 sm:w-20 sm:rounded-2xl sm:text-5xl lg:h-32 lg:w-28 lg:text-6xl"
                  style={{
                    fontFamily: 'var(--font-app)',
                    color: 'var(--neon-pink)',
                    borderColor: 'var(--neon-pink)',
                    backgroundColor: 'rgba(255,16,240,0.07)',
                  }}
                >
                  {d}
                </motion.div>
              ))}
            </div>
          </div>
          <JoinQrCode pin={pin} />
        </div>
        <p className="text-text-muted text-center text-xs">
          Gracze skanują QR albo wchodzą na{' '}
          <span className="text-text-primary font-bold">lastrodeoandzeliki.pl/graj/join</span>
        </p>
      </div>

      {/* Players */}
      <div className="w-full">
        <div className="mb-3 flex items-center justify-center gap-2">
          <Users size={14} style={{ color: 'var(--sheriff-pink)' }} />
          <span
            className="text-xs font-semibold tracking-normal uppercase"
            style={{ color: 'var(--sheriff-pink)' }}
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
                  borderColor: 'var(--saloon-border)',
                  backgroundColor: 'var(--saloon-surface)',
                }}
              >
                <PlayerAvatar avatar={p.avatar} size={22} />
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
