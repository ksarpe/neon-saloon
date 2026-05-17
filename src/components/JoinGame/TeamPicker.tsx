'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Loader2, UserPlus } from 'lucide-react'
import type { LiveTeam } from './types'
import { Button } from '@/components/ui/button'

interface Props {
  teams: LiveTeam[]
  newTeamName: string
  onNewTeamNameChange: (v: string) => void
  onJoinTeam: (id: string, name: string) => void
  onCreateTeam: () => void
  onBack: () => void
  loading: boolean
  hideCreate?: boolean
}

export function TeamPicker({
  teams,
  newTeamName,
  onNewTeamNameChange,
  onJoinTeam,
  onCreateTeam,
  onBack,
  loading,
  hideCreate,
}: Props) {
  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="text-center">
        <span className="text-4xl">🏇</span>
        <h2
          className="mt-2 text-3xl tracking-widest"
          style={{ fontFamily: "var(--font-app)", color: 'var(--neon-pink)' }}
        >
          Wybierz swoją bandę
        </h2>
      </div>

      {/* Existing teams */}
      <div className="flex w-full max-w-xs flex-col gap-2">
        <p className="text-text-muted text-[10px] font-semibold tracking-widest uppercase">
          Obecne bandy
        </p>
        <AnimatePresence>
          {teams.length === 0 && (
            <p className="text-text-muted py-3 text-center text-xs opacity-60">
              Nie ma jeszcze żadnej bandy
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

      {/* Create new team */}
      {!hideCreate && (
        <div className="flex w-full max-w-xs flex-col gap-2">
          <p className="text-text-muted text-[10px] font-semibold tracking-widest uppercase">
            Stwórz nową bandę
          </p>
          <div className="flex gap-2">
            <input
              id="new-team-name-input"
              type="text"
              value={newTeamName}
              onChange={(e) => onNewTeamNameChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && newTeamName.trim() && onCreateTeam()}
              maxLength={20}
              placeholder="Nazwa bandy…"
              className="bg-saloon-surface border-saloon-border text-text-primary placeholder:text-text-muted flex-1 rounded-xl border px-3 py-3 text-sm focus:outline-none"
            />
            <motion.button
              id="create-team-btn"
              disabled={!newTeamName.trim() || loading}
              whileTap={{ scale: 0.93 }}
              onClick={onCreateTeam}
              className="border-neon-pink bg-neon-pink-dim flex h-12 w-12 items-center justify-center rounded-xl border disabled:opacity-30"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" style={{ color: 'var(--neon-pink)' }} />
              ) : (
                <UserPlus size={16} style={{ color: 'var(--neon-pink)' }} />
              )}
            </motion.button>
          </div>
        </div>
      )}

      <Button type="outline" onClick={onBack}>
        <ArrowLeft size={14} /> Wróć
      </Button>
    </div>
  )
}
