'use client'

import { AnimatePresence,motion } from 'framer-motion'
import { Play } from 'lucide-react'

import { JoinQrCode } from '@/components/JoinQrCode'
import { Button } from '@/components/ui/button'
import type { SessionPlayer,SessionTeam } from '@/lib/appwrite/sessions'

interface Props {
  pin: string
  players: SessionPlayer[]
  team1: SessionTeam
  team2: SessionTeam
  onStart: () => void
}

export function HostLobby({ pin, players, team1, team2, onStart }: Props) {
  const team1Players = players.filter((p) => p.teamId === team1.teamId)
  const team2Players = players.filter((p) => p.teamId === team2.teamId)
  const canStart = team1Players.length > 0 && team2Players.length > 0

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

      {/* Teams */}
      <div className="grid w-full grid-cols-2 gap-4">
        {[
          { team: team1, players: team1Players, accent: 'var(--neon-pink)' },
          { team: team2, players: team2Players, accent: 'var(--sheriff-pink)' },
        ].map(({ team, players: tp, accent }) => (
          <div
            key={team.teamId}
            className="flex flex-col gap-3 rounded-2xl border p-4"
            style={{ borderColor: `${accent}44`, backgroundColor: `${accent}0d` }}
          >
            <p className="text-sm font-bold tracking-widest uppercase" style={{ color: accent }}>
              {team.teamName}
            </p>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {tp.map((p) => (
                  <motion.div
                    key={p.playerId}
                    layout
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    className="flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-semibold"
                    style={{
                      borderColor: `${accent}55`,
                      backgroundColor: `${accent}15`,
                      color: accent,
                    }}
                  >
                    <span>{p.avatar}</span>
                    <span>{p.playerName}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {tp.length === 0 && (
                <p className="text-text-muted text-xs opacity-50">Oczekuję na graczy…</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button type="primary" disabled={!canStart} onClick={onStart} size="lg">
        <Play size={22} /> Rozpocznij grę
      </Button>
    </div>
  )
}
