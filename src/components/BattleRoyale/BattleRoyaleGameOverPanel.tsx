'use client'

import { motion } from 'framer-motion'
import { Crown, Loader2, Medal, Play, Skull, Trophy } from 'lucide-react'

import { PlayerAvatar } from '@/components/PlayerAvatar'
import { Button } from '@/components/ui/button'

export interface BattleRoyaleFinalPlayer {
  id: string
  name: string
  avatar: string
  isHost?: boolean
  isWinner?: boolean
  survived?: boolean
}

interface BattleRoyaleGameOverPanelProps {
  winnerName?: string
  players?: BattleRoyaleFinalPlayer[]
  currentPlayerId?: string
  onNewGame?: () => void
  newGameLoading?: boolean
}

export function BattleRoyaleGameOverPanel({
  winnerName,
  players = [],
  currentPlayerId,
  onNewGame,
  newGameLoading = false,
}: BattleRoyaleGameOverPanelProps) {
  const currentPlayer = currentPlayerId
    ? players.find((player) => player.id === currentPlayerId)
    : undefined
  const winnerPlayer = players.find((player) => player.isWinner || player.name === winnerName)
  const highlightedPlayer = winnerPlayer ?? (winnerName ? undefined : currentPlayer)
  const isCurrentWinner = Boolean(currentPlayer && winnerName && currentPlayer.name === winnerName)
  const aliveCount = players.filter((player) => player.survived || player.isWinner).length
  const eliminatedCount = players.length > 0 ? Math.max(0, players.length - aliveCount) : 0
  const hasRoster = players.length > 1

  return (
    <div
      className="relative overflow-hidden rounded-2xl border p-4 text-center sm:p-6"
      style={{
        borderColor: 'rgba(255,220,180,0.14)',
        backgroundColor: 'rgba(13,8,24,0.78)',
        boxShadow: '0 24px 70px rgba(0,0,0,0.28)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-6 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(239,68,68,0.7), rgba(255,220,143,0.55), transparent)',
        }}
      />

      <div className="flex flex-col items-center gap-5">
        <motion.div
          animate={{ y: [0, -5, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 0.55 }}
          className="flex h-20 w-20 items-center justify-center rounded-2xl border sm:h-24 sm:w-24"
          style={{
            borderColor: winnerName ? 'rgba(255,220,143,0.34)' : 'rgba(239,68,68,0.32)',
            backgroundColor: winnerName ? 'rgba(255,220,143,0.08)' : 'rgba(239,68,68,0.08)',
            color: winnerName ? '#ffdc8f' : '#f87171',
          }}
        >
          {winnerName ? <Trophy size={48} /> : <Skull size={48} />}
        </motion.div>

        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: '#ef4444' }}>
            Battle Royale
          </p>
          <h1
            className="mt-1 text-5xl tracking-normal text-[#ffe6c7] sm:text-6xl"
            style={{ fontFamily: 'var(--font-app)' }}
          >
            {isCurrentWinner ? 'Wygrałeś!' : 'Koniec gry'}
          </h1>
        </div>

        <div
          className="flex w-full items-center gap-3 rounded-xl border p-3 text-left"
          style={{
            borderColor: winnerName ? 'rgba(255,220,143,0.36)' : 'rgba(239,68,68,0.22)',
            backgroundColor: winnerName ? 'rgba(255,220,143,0.08)' : 'rgba(239,68,68,0.07)',
          }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{
              backgroundColor: winnerName ? 'rgba(255,220,143,0.14)' : 'rgba(239,68,68,0.12)',
              color: winnerName ? '#ffdc8f' : '#f87171',
            }}
          >
            {winnerName ? <Crown size={20} /> : <Skull size={20} />}
          </div>

          {highlightedPlayer ? <PlayerAvatar avatar={highlightedPlayer.avatar} size={34} /> : null}

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-black text-[#ffe6c7]">
              {winnerName ? winnerName : 'Brak zwycięzcy'}
            </p>
            <p className="text-[10px] font-bold text-[#f0dfc0]/45 uppercase">
              {winnerName ? 'ostatni ocalały' : 'wszyscy odpadli'}
            </p>
          </div>
        </div>

        {players.length > 0 && (
          <div className="grid w-full grid-cols-3 gap-2">
            {[
              { label: 'Gracze', value: players.length, color: 'var(--sheriff-pink)' },
              { label: 'Ocalali', value: aliveCount, color: '#22c55e' },
              { label: 'Duchy', value: eliminatedCount, color: '#ef4444' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border px-2 py-3"
                style={{
                  borderColor: 'rgba(255,220,180,0.1)',
                  backgroundColor: 'rgba(255,220,180,0.045)',
                }}
              >
                <p
                  className="text-2xl leading-none sm:text-3xl"
                  style={{ color: stat.color, fontFamily: 'var(--font-app)' }}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] font-bold text-[#f0dfc0]/45 uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {hasRoster && (
          <div className="grid w-full gap-2 sm:grid-cols-2">
            {players.map((player, index) => {
              const survived = Boolean(player.survived || player.isWinner)
              const isWinner = Boolean(player.isWinner || player.name === winnerName)

              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.035 }}
                  className="flex items-center gap-3 rounded-xl border p-3 text-left"
                  style={{
                    borderColor: isWinner
                      ? 'rgba(255,220,143,0.48)'
                      : survived
                        ? 'rgba(34,197,94,0.24)'
                        : 'rgba(239,68,68,0.2)',
                    backgroundColor: isWinner
                      ? 'rgba(255,220,143,0.1)'
                      : survived
                        ? 'rgba(34,197,94,0.06)'
                        : 'rgba(239,68,68,0.055)',
                    opacity: survived || isWinner ? 1 : 0.68,
                  }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: 'rgba(13,8,24,0.48)',
                      color: isWinner ? '#ffdc8f' : survived ? '#86efac' : '#f87171',
                    }}
                  >
                    {isWinner ? (
                      <Crown size={18} />
                    ) : survived ? (
                      <Medal size={18} />
                    ) : (
                      <Skull size={18} />
                    )}
                  </div>
                  <PlayerAvatar avatar={player.avatar} size={30} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-black text-[#ffe6c7]">{player.name}</p>
                    <p className="text-[10px] font-bold text-[#f0dfc0]/40 uppercase">
                      {isWinner ? 'zwycięzca' : survived ? 'ocalały' : 'duch'}
                      {player.isHost ? ' · host' : ''}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {onNewGame && (
          <Button type="primary" onClick={onNewGame} disabled={newGameLoading} size="lg">
            {newGameLoading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
            Nowa gra
          </Button>
        )}
      </div>
    </div>
  )
}
