'use client'

import { motion } from 'framer-motion'
import { User, Users, ChevronRight } from 'lucide-react'

interface Props {
  onSolo: () => void
  onTeam: () => void
  onBack: () => void
  loading: boolean
}

export function ModeSelector({ onSolo, onTeam, onBack, loading }: Props) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex w-full max-w-lg flex-col gap-3">
        {/* Solo */}
        <motion.button
          id="solo-mode-btn"
          disabled={loading}
          whileTap={{ scale: 0.97 }}
          onClick={onSolo}
          className="flex items-center gap-4 rounded-2xl border-2 p-5 text-left disabled:opacity-40"
          style={{
            borderColor: 'var(--sheriff-pink)',
            backgroundColor: 'rgba(255,215,0,0.08)',
          }}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(255,215,0,0.15)' }}
          >
            <User size={22} style={{ color: 'var(--sheriff-pink)' }} />
          </div>
          <div>
            <p className="text-base font-bold" style={{ color: 'var(--sheriff-pink)' }}>
              Samotna Kowbojka
            </p>
            <p className="text-text-muted text-xs">Każda kowbojka orze jak może!</p>
          </div>
          <ChevronRight size={16} className="text-text-muted ml-auto" />
        </motion.button>

        {/* Team */}
        <motion.button
          id="team-mode-btn"
          whileTap={{ scale: 0.97 }}
          onClick={onTeam}
          className="flex items-center gap-4 rounded-2xl border-2 p-5 text-left"
          style={{
            borderColor: 'var(--neon-pink)',
            backgroundColor: 'var(--neon-pink-dim)',
          }}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: 'rgba(255,16,240,0.15)' }}
          >
            <Users size={22} style={{ color: 'var(--neon-pink)' }} />
          </div>
          <div>
            <p className="text-base font-bold" style={{ color: 'var(--neon-pink)' }}>
              Skrzyknij Gang / Dołącz do Bandy
            </p>
            <p className="text-text-muted text-xs">Jedna za wszystkie, wszystkie na rodeo!</p>
          </div>
          <ChevronRight size={16} className="text-text-muted ml-auto" />
        </motion.button>
      </div>
    </div>
  )
}
