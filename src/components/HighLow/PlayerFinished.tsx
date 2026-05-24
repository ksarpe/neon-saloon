'use client'

import { motion } from 'framer-motion'
import { Trophy, Users } from 'lucide-react'

import { PlaceIcon } from '@/components/GameSummary/PlaceIcon'
import { PlayerAvatar } from '@/components/PlayerAvatar'
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
  const teamScores = Array.from(
    scores.reduce((map, score) => {
      const id = score.playerTeamId ?? score.playerTeamName ?? score.playerId
      const name = score.playerTeamName ?? score.playerName
      const existing = map.get(id)
      map.set(id, {
        id,
        name,
        score: Math.max(existing?.score ?? 0, score.score),
      })
      return map
    }, new Map<string, { id: string; name: string; score: number }>())
  )
    .map(([, value]) => value)
    .sort((a, b) => b.score - a.score)

  const myTeamScore =
    teamScores.find((score) => score.name === teamName)?.score ??
    scores.find((score) => score.playerId === playerId)?.score ??
    myScore

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
        className="flex h-20 w-20 items-center justify-center rounded-full border-2"
        style={{ borderColor: 'rgba(255,215,0,0.4)', backgroundColor: 'rgba(255,215,0,0.06)' }}
      >
        <PlayerAvatar avatar={avatar} size={48} />
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
        <Users size={16} style={{ color: 'var(--sheriff-pink)' }} />
        <span
          className="text-2xl font-black"
          style={{
            color: 'var(--sheriff-pink)',
            fontFamily: 'var(--font-app)',
            letterSpacing: '0.1em',
          }}
        >
          {myTeamScore} PKT
        </span>
      </div>

      {teamScores.length > 0 && (
        <div className="flex w-full flex-col gap-2">
          <p className="text-text-muted text-xs tracking-normal uppercase">Wyniki zespołów</p>
          {teamScores.map((score, index) => {
            const isMyTeam = score.name === teamName
            return (
              <div
                key={score.id}
                className="flex items-center gap-3 rounded-xl border p-3"
                style={{
                  borderColor: isMyTeam ? 'rgba(255,215,0,0.35)' : 'rgba(255,220,180,0.1)',
                  backgroundColor: isMyTeam ? 'rgba(255,215,0,0.06)' : 'transparent',
                }}
              >
                <span className="flex w-7 shrink-0 justify-center">
                  <PlaceIcon rank={index + 1} size={24} />
                </span>
                <span
                  className="flex-1 text-left text-sm font-semibold"
                  style={{
                    color: isMyTeam ? 'var(--sheriff-pink)' : 'var(--text-primary)',
                  }}
                >
                  {score.name}
                  {isMyTeam && (
                    <span className="ml-1 whitespace-nowrap text-xs font-black">(TY)</span>
                  )}
                </span>
                <span
                  className="text-sm font-bold"
                  style={{
                    color: isMyTeam ? 'var(--sheriff-pink)' : 'var(--text-primary)',
                  }}
                >
                  {score.score}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
