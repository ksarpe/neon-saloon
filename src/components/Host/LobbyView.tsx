'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, Play, Sparkles, Users } from 'lucide-react'
import Link from 'next/link'

import { JoinQrCode } from '@/components/JoinQrCode'
import { PlayerAvatar } from '@/components/PlayerAvatar'
import { Button } from '@/components/ui/button'
import { ROOM_PLAYER_LIMITS } from '@/config/usage-limits'

import type { LivePlayer } from './types'

interface Props {
  pin: string
  players: LivePlayer[]
  hostAvatar: string
  hostName: string
  onStart: () => void
  starting?: boolean
  /** Participant cap for this room (resolved from the host's premium tier). */
  maxPlayers?: number
}

export function LobbyView({ pin, players, onStart, starting = false, maxPlayers }: Props) {
  const cap = maxPlayers ?? ROOM_PLAYER_LIMITS.free
  const isFull = players.length >= cap
  // Show the upsell only to free-tier hosts (those below the premium cap).
  const showUpsell = cap < ROOM_PLAYER_LIMITS.premium
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8">
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

      <div className="w-full">
        <div className="mb-3 flex flex-col items-center justify-center gap-1.5">
          <div className="flex items-center justify-center gap-2">
            <Users size={14} style={{ color: 'var(--sheriff-pink)' }} />
            <span
              className="text-xs font-semibold tracking-normal uppercase"
              style={{ color: 'var(--sheriff-pink)' }}
            >
              {players.length} / {cap} {players.length === 1 ? 'cowgirl' : 'cowgirls'} w salonie
            </span>
          </div>
          {showUpsell && (
            <Link
              href="/panel"
              className="inline-flex items-center gap-1.5 text-[11px] font-medium transition-opacity hover:opacity-80"
              style={{ color: isFull ? 'var(--neon-pink)' : 'var(--text-muted)' }}
            >
              <Sparkles size={12} style={{ color: 'var(--neon-gold, #ffd700)' }} />
              {isFull
                ? `Salon pełny — przejdź na premium, aby zaprosić do ${ROOM_PLAYER_LIMITS.premium} osób`
                : `Darmowy limit ${cap} osób · premium do ${ROOM_PLAYER_LIMITS.premium}`}
            </Link>
          )}
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
            <p className="text-text-muted text-sm opacity-50">Oczekuję na graczy ...</p>
          )}
        </div>
      </div>

      <Button
        id="host-start-btn"
        type="primary"
        disabled={players.length < 1 || starting}
        onClick={onStart}
        size="lg"
      >
        {starting ? (
          <>
            <Loader2 size={22} className="animate-spin" /> Rozpoczynam...
          </>
        ) : (
          <>
            <Play size={22} /> Rozpocznij grę
          </>
        )}
      </Button>
    </div>
  )
}
