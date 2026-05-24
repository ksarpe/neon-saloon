'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { LiveTeam } from './types'

interface Props {
  teams: LiveTeam[]
  onJoinTeam: (id: string, name: string) => void
  onBack: () => void
  loading: boolean
}

export function TeamPicker({
  teams,
  onJoinTeam,
  onBack,
  loading,
}: Props) {
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="text-center">
        <span className="text-4xl">🏇</span>
        <h2
          className="mt-2 text-3xl tracking-normal"
          style={{ fontFamily: 'var(--font-app)', color: 'var(--neon-pink)' }}
        >
          Wybierz drużynę
        </h2>
      </div>

      {/* Existing teams */}
      <div className="flex w-full max-w-xs flex-col gap-2">
        <p className="text-text-muted text-[10px] font-semibold tracking-normal uppercase">
          Drużyny
        </p>
        <AnimatePresence>
          {teams.length === 0 && (
            <p className="text-text-muted py-3 text-center text-xs opacity-60">
              Host nie utworzył jeszcze drużyn
            </p>
          )}
          {teams.map((t) => (
            <motion.button
              key={t.teamId}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              onClick={() => onJoinTeam(t.teamId, t.teamName)}
              className="flex items-center gap-3 rounded-xl border p-4 text-left disabled:opacity-40"
              style={{
                borderColor: `${t.color}60`,
                backgroundColor: `${t.color}0f`,
              }}
            >
              <span className="text-xl">{t.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: t.color }}>
                  {t.teamName}
                </p>
                <p className="text-text-muted text-[10px]">
                  {t.memberCount} kowbojka{t.memberCount !== 1 ? 's' : ''}
                </p>
              </div>
              <span className="text-text-muted text-xs">Dołącz →</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <Button type="outline" onClick={onBack}>
        <ArrowLeft size={14} /> Wróć
      </Button>
    </div>
  )
}
