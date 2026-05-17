'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Dices, Check } from 'lucide-react'
import type { SessionTeam } from '@/lib/appwrite/sessions'
import { FUNNY_NAMES } from '@/lib/games/data'
import { Button } from '@/components/ui/button'

const AVATAR_LIST = ['🤠', '💃', '🌸', '✨', '🍾', '🎀', '👑', '🦋', '🌺', '🎉']

interface Props {
  team1: SessionTeam
  team2: SessionTeam
  onContinue: (name: string, avatar: string, teamId: string) => void
}

export function HostSetupView({ team1, team2, onContinue }: Props) {
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [teamId, setTeamId] = useState<string | null>(null)
  const [placeholder] = useState(
    () => `np. ${FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)]}`
  )

  const canContinue = name.trim() && avatar && teamId

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-8">
      <div className="text-center">
        <h1
          className="shimmer-text text-5xl tracking-widest"
          style={{ fontFamily: 'var(--font-app)' }}
        >
          mniej czy więcej
        </h1>
        <p className="text-text-muted mt-1 text-xs tracking-widest uppercase">
          Najpierw wybierz swój awatar i drużynę
        </p>
      </div>

      {/* Avatar picker */}
      <div className="w-full">
        <p className="text-text-muted mb-3 text-center text-[10px] font-semibold tracking-widest uppercase">
          Wybierz awatar
        </p>
        <div className="grid grid-cols-5 gap-2">
          {AVATAR_LIST.map((emoji) => (
            <motion.button
              key={emoji}
              whileTap={{ scale: 0.88 }}
              onClick={() => setAvatar(emoji)}
              className="flex h-12 items-center justify-center rounded-xl border-2 text-2xl transition-colors"
              style={{
                borderColor: avatar === emoji ? 'var(--neon-pink)' : 'var(--saloon-border)',
                backgroundColor:
                  avatar === emoji ? 'rgba(255,16,240,0.15)' : 'var(--saloon-surface)',
                boxShadow: avatar === emoji ? '0 0 12px rgba(255,16,240,0.3)' : 'none',
              }}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Name input */}
      <div className="flex w-full gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) =>
            e.key === 'Enter' && canContinue && onContinue(name.trim(), avatar!, teamId!)
          }
          maxLength={20}
          autoFocus
          placeholder={placeholder}
          className="bg-saloon-surface text-text-primary placeholder:text-text-muted flex-1 rounded-xl border-2 px-4 py-4 text-center text-lg font-bold transition-colors focus:outline-none"
          style={{ borderColor: name.trim() ? 'var(--neon-pink)' : 'var(--saloon-border)' }}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setName(FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)])}
          className="bg-saloon-surface flex items-center justify-center rounded-xl border-2 px-4"
          style={{ borderColor: 'var(--saloon-border)' }}
          title="Losuj imię"
        >
          <Dices size={22} className="text-text-muted" />
        </motion.button>
      </div>

      {/* Team picker */}
      <div className="flex w-full flex-col gap-3">
        <p className="text-text-muted text-center text-[10px] font-semibold tracking-widest uppercase">
          Wybierz drużynę
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              team: team1,
              accent: 'var(--neon-pink)',
              border: 'rgba(255,16,240,0.5)',
              bg: 'rgba(255,16,240,0.1)',
            },
            {
              team: team2,
              accent: 'var(--sheriff-pink)',
              border: 'rgba(255,215,0,0.5)',
              bg: 'rgba(255,215,0,0.1)',
            },
          ].map(({ team, accent, border, bg }) => (
            <motion.button
              key={team.teamId}
              whileTap={{ scale: 0.95 }}
              onClick={() => setTeamId(team.teamId)}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition-all"
              style={{
                borderColor: teamId === team.teamId ? accent : 'var(--saloon-border)',
                backgroundColor: teamId === team.teamId ? bg : 'var(--saloon-surface)',
                boxShadow: teamId === team.teamId ? `0 0 16px ${border}` : 'none',
              }}
            >
              {teamId === team.teamId && <Check size={14} style={{ color: accent }} />}
              <span className="text-sm font-black tracking-wide" style={{ color: accent }}>
                {team.teamName}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <Button
        type="primary"
        disabled={!canContinue}
        onClick={() => canContinue && onContinue(name.trim(), avatar!, teamId!)}
        className="w-full"
      >
        Dalej <ChevronRight size={18} />
      </Button>
    </div>
  )
}
