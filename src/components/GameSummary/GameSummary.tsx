'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Home, Users, User } from 'lucide-react'
import { RankingList } from './RankingList'
import type { SummaryScore, Tab } from './types'

interface Props {
  scores: SummaryScore[]
  teamScores?: SummaryScore[]
  drinksScores?: SummaryScore[]
  egzekwoScores?: SummaryScore[]
  homeHref?: string
}

export function GameSummary({
  scores,
  teamScores,
  drinksScores,
  egzekwoScores,
  homeHref = '/graj',
}: Props) {
  const hasTeams = !!teamScores && teamScores.length > 0
  const hasDrinks = !!drinksScores && drinksScores.length > 0
  const hasEgzekwo = !!egzekwoScores && egzekwoScores.length > 0
  const showTabs = hasTeams || hasDrinks || hasEgzekwo
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

          {hasEgzekwo && (
            <button
              onClick={() => setTab('egzekwo')}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold tracking-widest uppercase transition-all duration-200"
              style={{
                backgroundColor: tab === 'egzekwo' ? 'rgba(239,68,68,0.12)' : 'transparent',
                color: tab === 'egzekwo' ? '#f87171' : 'rgba(255,220,180,0.45)',
                boxShadow: tab === 'egzekwo' ? 'inset 0 0 0 1px rgba(239,68,68,0.2)' : 'none',
              }}
            >
              ⚡ Egzekwo
            </button>
          )}
        </motion.div>
      )}

      {/* Ranking */}
      {tab === 'players' && <RankingList scores={scores} unit="pkt" />}
      {tab === 'teams' && hasTeams && <RankingList scores={teamScores!} unit="pkt" />}
      {tab === 'drinks' && hasDrinks && <RankingList scores={drinksScores!} unit="łyków" icon="🍺" />}
      {tab === 'egzekwo' && hasEgzekwo && <RankingList scores={egzekwoScores!} unit="egzekucji" icon="⚡" />}

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
