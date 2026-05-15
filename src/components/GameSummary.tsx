'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Home, Users, User } from 'lucide-react'

export interface SummaryScore {
  id: string
  name: string
  score: number
}

const MEDALS = ['🥇', '🥈', '🥉']

const RANK_STYLES = [
  { border: 'rgba(192,192,192,0.5)', bg: 'rgba(192,192,192,0.06)' },
  { border: 'rgba(205,127,50,0.5)', bg: 'rgba(205,127,50,0.06)' },
]

function RankingList({
  scores,
  unit = 'pkt',
  icon,
}: {
  scores: SummaryScore[]
  unit?: string
  icon?: React.ReactNode
}) {
  const sorted = [...scores].sort((a, b) => b.score - a.score)
  const winner = sorted[0] ?? null
  const rest = sorted.slice(1)

  return (
    <>
      {winner ? (
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 18 }}
          className="flex w-full flex-col items-center gap-3 rounded-2xl border-2 p-6"
          style={{
            borderColor: 'var(--sheriff-gold)',
            backgroundColor: 'rgba(255,215,0,0.07)',
            boxShadow: '0 0 48px rgba(255,215,0,0.22)',
          }}
        >
          <motion.span
            className="text-5xl"
            animate={{ rotate: [0, -8, 8, -8, 0] }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {icon ?? '👑'}
          </motion.span>
          <p
            className="text-3xl leading-tight font-black tracking-wide"
            style={{
              fontFamily: "'Bebas Neue',cursive",
              color: 'var(--sheriff-gold)',
              letterSpacing: '0.08em',
              textShadow: '0 0 24px rgba(255,215,0,0.6)',
            }}
          >
            {winner.name}
          </p>
          <div className="flex items-center gap-1.5">
            <Star size={16} fill="var(--sheriff-gold)" style={{ color: 'var(--sheriff-gold)' }} />
            <span className="text-2xl font-black" style={{ color: 'var(--sheriff-gold)' }}>
              {winner.score}
            </span>
            <span className="text-text-muted text-sm">{unit}</span>
          </div>
        </motion.div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-muted text-sm"
        >
          Tym razem nikt nie zdobył punktów
        </motion.p>
      )}

      {rest.length > 0 && (
        <div className="flex w-full flex-col gap-2">
          {rest.map((s, i) => {
            const rank = i + 2
            const style = RANK_STYLES[i] ?? {
              border: 'var(--saloon-border)',
              bg: 'var(--saloon-surface)',
            }
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="flex items-center gap-3 rounded-xl border px-4 py-3.5"
                style={{ borderColor: style.border, backgroundColor: style.bg }}
              >
                <span className="w-8 shrink-0 text-center text-xl">
                  {MEDALS[rank - 1] ?? (
                    <span className="text-text-muted text-xs font-bold">{rank}.</span>
                  )}
                </span>
                <span className="text-text-primary flex-1 text-left text-sm font-bold">
                  {s.name}
                </span>
                <div className="flex shrink-0 items-center gap-1">
                  <Star
                    size={11}
                    fill="var(--sheriff-gold)"
                    style={{ color: 'var(--sheriff-gold)' }}
                  />
                  <span
                    className="text-sm font-bold tabular-nums"
                    style={{ color: 'var(--sheriff-gold)' }}
                  >
                    {s.score}
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </>
  )
}

type Tab = 'players' | 'teams' | 'drinks'

export function GameSummary({
  scores,
  teamScores,
  drinksScores,
  homeHref = '/graj',
}: {
  scores: SummaryScore[]
  teamScores?: SummaryScore[]
  drinksScores?: SummaryScore[]
  homeHref?: string
}) {
  const hasTeams = !!teamScores && teamScores.length > 0
  const hasDrinks = !!drinksScores && drinksScores.length > 0
  const showTabs = hasTeams || hasDrinks
  const [tab, setTab] = useState<Tab>('players')

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 text-center">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="shimmer-text text-6xl tracking-widest sm:text-7xl"
          style={{ fontFamily: "'Bebas Neue',cursive" }}
        >
          Game Over, Cowgirls!
        </h1>
        <p className="text-text-muted mt-2 text-xs tracking-widest uppercase">
          Końcowy ranking kowbojek
        </p>
      </motion.div>

      {/* Tab switcher */}
      {showTabs && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-1 self-stretch rounded-xl p-1"
          style={{ backgroundColor: 'rgba(255,220,180,0.05)' }}
        >
          <button
            onClick={() => setTab('players')}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-200"
            style={{
              backgroundColor: tab === 'players' ? 'rgba(255,16,240,0.12)' : 'transparent',
              color: tab === 'players' ? 'var(--neon-pink)' : 'rgba(255,220,180,0.45)',
              boxShadow: tab === 'players' ? 'inset 0 0 0 1px rgba(255,16,240,0.2)' : 'none',
            }}
          >
            <User size={13} />
            Gracze
          </button>

          {hasTeams && (
            <button
              onClick={() => setTab('teams')}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-200"
              style={{
                backgroundColor: tab === 'teams' ? 'rgba(249,74,255,0.12)' : 'transparent',
                color: tab === 'teams' ? 'var(--sheriff-gold)' : 'rgba(255,220,180,0.45)',
                boxShadow: tab === 'teams' ? 'inset 0 0 0 1px rgba(249,74,255,0.2)' : 'none',
              }}
            >
              <Users size={13} />
              Zespoły
            </button>
          )}

          {hasDrinks && (
            <button
              onClick={() => setTab('drinks')}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-200"
              style={{
                backgroundColor: tab === 'drinks' ? 'rgba(255,215,0,0.12)' : 'transparent',
                color: tab === 'drinks' ? '#ffd700' : 'rgba(255,220,180,0.45)',
                boxShadow: tab === 'drinks' ? 'inset 0 0 0 1px rgba(255,215,0,0.2)' : 'none',
              }}
            >
              🍺 Pijacy
            </button>
          )}
        </motion.div>
      )}

      {/* Ranking */}
      {tab === 'players' && <RankingList scores={scores} unit="pkt" />}
      {tab === 'teams' && hasTeams && <RankingList scores={teamScores!} unit="pkt" />}
      {tab === 'drinks' && hasDrinks && (
        <RankingList scores={drinksScores!} unit="łyków" icon="🍺" />
      )}

      {/* Home button */}
      <motion.a
        href={homeHref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl px-8 py-4 text-white"
        style={{
          background: 'linear-gradient(135deg,var(--neon-pink),#c800c8)',
          fontFamily: "'Bebas Neue',cursive",
          letterSpacing: '0.12em',
          fontSize: '1.1rem',
          boxShadow: '0 4px 32px rgba(255,16,240,0.4)',
        }}
      >
        <Home size={18} />
        Wróć do menu głównego
      </motion.a>
    </div>
  )
}
