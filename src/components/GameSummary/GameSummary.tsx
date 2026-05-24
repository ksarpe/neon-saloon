'use client'

import { motion } from 'framer-motion'
import { User, Users } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { RankingList } from './RankingList'
import type { SummaryScore, Tab } from './types'

interface Props {
  scores: SummaryScore[]
  teamScores?: SummaryScore[]
  drinksScores?: SummaryScore[]
  egzekwoScores?: SummaryScore[]
  homeHref?: string
  currentPlayerId?: string
  showPlayerPoints?: boolean
}

export function GameSummary({
  scores,
  teamScores,
  drinksScores,
  egzekwoScores,
  homeHref = '/graj',
  currentPlayerId,
  showPlayerPoints = true,
}: Props) {
  const hasPlayerPoints = showPlayerPoints && scores.length > 0
  const hasTeams = !!teamScores && teamScores.length > 0
  const hasDrinks = !showPlayerPoints || (!!drinksScores && drinksScores.length > 0)
  const hasEgzekwo = !!egzekwoScores && egzekwoScores.length > 0
  const tabCount =
    Number(hasPlayerPoints) + Number(hasTeams) + Number(hasDrinks) + Number(hasEgzekwo)
  const showTabs = tabCount > 1
  const defaultTab: Tab = hasPlayerPoints
    ? 'players'
    : hasTeams
      ? 'teams'
      : hasDrinks
        ? 'drinks'
        : hasEgzekwo
          ? 'egzekwo'
          : 'players'
  const [tab, setTab] = useState<Tab>(defaultTab)
  const activeTab =
    (tab === 'players' && hasPlayerPoints) ||
    (tab === 'teams' && hasTeams) ||
    (tab === 'drinks' && hasDrinks) ||
    (tab === 'egzekwo' && hasEgzekwo)
      ? tab
      : defaultTab

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 text-center">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-sheriff-pink text-[clamp(2rem,12vw,6rem)] leading-[1.1] tracking-wide whitespace-nowrap uppercase"
          style={{ fontFamily: 'var(--font-logo)' }}
        >
          It&apos;s over!
        </motion.h1>
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
          {hasPlayerPoints && (
            <button
              onClick={() => setTab('players')}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold tracking-normal uppercase transition-all duration-200"
              style={{
                backgroundColor:
                  activeTab === 'players' ? 'rgba(255,16,240,0.12)' : 'transparent',
                color: activeTab === 'players' ? 'var(--neon-pink)' : 'rgba(255,220,180,0.45)',
                boxShadow:
                  activeTab === 'players' ? 'inset 0 0 0 1px rgba(255,16,240,0.2)' : 'none',
              }}
            >
              <User size={13} />
              Gracze
            </button>
          )}

          {hasTeams && (
            <button
              onClick={() => setTab('teams')}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold tracking-normal uppercase transition-all duration-200"
              style={{
                backgroundColor: activeTab === 'teams' ? 'rgba(249,74,255,0.12)' : 'transparent',
                color: activeTab === 'teams' ? 'var(--sheriff-pink)' : 'rgba(255,220,180,0.45)',
                boxShadow:
                  activeTab === 'teams' ? 'inset 0 0 0 1px rgba(249,74,255,0.2)' : 'none',
              }}
            >
              <Users size={13} />
              Zespoły
            </button>
          )}

          {hasDrinks && (
            <button
              onClick={() => setTab('drinks')}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold tracking-normal uppercase transition-all duration-200"
              style={{
                backgroundColor: activeTab === 'drinks' ? 'rgba(255,215,0,0.12)' : 'transparent',
                color: activeTab === 'drinks' ? '#ffd700' : 'rgba(255,220,180,0.45)',
                boxShadow:
                  activeTab === 'drinks' ? 'inset 0 0 0 1px rgba(255,215,0,0.2)' : 'none',
              }}
            >
              Pijacy
            </button>
          )}

          {hasEgzekwo && (
            <button
              onClick={() => setTab('egzekwo')}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold tracking-normal uppercase transition-all duration-200"
              style={{
                backgroundColor: activeTab === 'egzekwo' ? 'rgba(239,68,68,0.12)' : 'transparent',
                color: activeTab === 'egzekwo' ? '#f87171' : 'rgba(255,220,180,0.45)',
                boxShadow:
                  activeTab === 'egzekwo' ? 'inset 0 0 0 1px rgba(239,68,68,0.2)' : 'none',
              }}
            >
              Egzekwo
            </button>
          )}
        </motion.div>
      )}

      {/* Ranking */}
      {activeTab === 'players' && hasPlayerPoints && (
        <RankingList scores={scores} unit="pkt" currentId={currentPlayerId} />
      )}
      {activeTab === 'teams' && hasTeams && <RankingList scores={teamScores!} unit="pkt" />}
      {activeTab === 'drinks' && hasDrinks && (
        <RankingList
          scores={drinksScores ?? []}
          unit="łyków"
          currentId={currentPlayerId}
          emptyLabel="Nikt nie pił w tej rozgrywce."
        />
      )}
      {activeTab === 'egzekwo' && hasEgzekwo && (
        <RankingList
          scores={egzekwoScores!}
          unit="egzekucji"
          currentId={currentPlayerId}
        />
      )}

      {/* Home button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-2 w-full"
      >
        <Button type="primary" href={homeHref} className="w-full">
          Wróć do menu głównego
        </Button>
      </motion.div>
    </div>
  )
}
