'use client'

import { motion } from 'framer-motion'
import { Star, Trophy } from 'lucide-react'
import type { ScoreEntry } from '@/lib/game-types'

interface Props {
  avatar: string
  playerName: string
  teamName: string | null
  playerId: string
  myScore: number
  scores: ScoreEntry[]
}

export function PlayerFinished({ avatar, playerName, teamName, playerId, myScore, scores }: Props) {
  return (
    <motion.div
      key="finished"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex w-full flex-col items-center gap-5 text-center"
    >
      <Trophy size={48} style={{ color: 'var(--sheriff-pink)' }} />
      <h2
        className="text-sheriff-pink text-4xl tracking-normal"
        style={{ fontFamily: 'var(--font-app)' }}
      >
        KONIEC GRY
      </h2>

      <div
        className="flex h-20 w-20 items-center justify-center rounded-full border-2 text-4xl"
        style={{ borderColor: 'rgba(255,215,0,0.4)', backgroundColor: 'rgba(255,215,0,0.06)' }}
      >
        {avatar}
      </div>
      <div>
        <p className="text-text-muted text-sm">{playerName}</p>
        {teamName && (
          <p className="mt-0.5 text-xs" style={{ color: 'var(--neon-pink)' }}>
            {teamName}
          </p>
        )}
      </div>

      <div
        className="flex items-center gap-2 rounded-xl border px-6 py-3"
        style={{ borderColor: 'rgba(255,215,0,0.4)', backgroundColor: 'rgba(255,215,0,0.08)' }}
      >
        <Star size={16} fill="var(--sheriff-pink)" style={{ color: 'var(--sheriff-pink)' }} />
        <span
          className="text-2xl font-black"
          style={{
            color: 'var(--sheriff-pink)',
            fontFamily: 'var(--font-app)',
            letterSpacing: '0.1em',
          }}
        >
          {myScore} PUNKTÓW
        </span>
      </div>

      {scores.length > 0 && (
        <div className="flex w-full flex-col gap-2">
          <p className="text-text-muted text-xs tracking-normal uppercase">Wyniki końcowe</p>
          {[...scores]
            .sort((a, b) => b.score - a.score)
            .map((s, i) => (
              <div
                key={s.playerId}
                className="flex items-center gap-3 rounded-xl border p-3"
                style={{
                  borderColor:
                    s.playerId === playerId ? 'rgba(255,215,0,0.35)' : 'rgba(255,220,180,0.1)',
                  backgroundColor: s.playerId === playerId ? 'rgba(255,215,0,0.06)' : 'transparent',
                }}
              >
                <span className="text-text-muted w-5 text-xs">#{i + 1}</span>
                <span
                  className="flex-1 text-left text-sm font-semibold"
                  style={{
                    color: s.playerId === playerId ? 'var(--sheriff-pink)' : 'var(--text-primary)',
                  }}
                >
                  {s.playerName}
                  {s.playerTeamName && (
                    <span className="text-text-muted ml-1 text-xs">({s.playerTeamName})</span>
                  )}
                </span>
                <span
                  className="text-sm font-bold"
                  style={{
                    color: s.playerId === playerId ? 'var(--sheriff-pink)' : 'var(--text-primary)',
                  }}
                >
                  {s.score}
                </span>
              </div>
            ))}
        </div>
      )}
    </motion.div>
  )
}
