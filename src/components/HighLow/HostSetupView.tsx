'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Check, Loader2 } from 'lucide-react'
import { useState } from 'react'

import { IdentityForm } from '@/components/IdentityForm'
import { Button } from '@/components/ui/button'
import type { SessionTeam } from '@/lib/appwrite/sessions'

interface Props {
  team1: SessionTeam
  team2: SessionTeam
  onContinue: (name: string, avatar: string, teamId: string) => void
  onBack?: () => void
  loading?: boolean
}

export function HostSetupView({ team1, team2, onContinue, onBack, loading = false }: Props) {
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [teamId, setTeamId] = useState<string | null>(null)

  const canContinue = Boolean(name.trim() && avatar && teamId)
  const submit = () => {
    if (canContinue && !loading) onContinue(name.trim(), avatar!, teamId!)
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
      {onBack && (
        <Button type="outline" onClick={onBack} className="self-start px-4 py-2 text-sm">
          <ArrowLeft size={14} /> Wróć
        </Button>
      )}

      <IdentityForm
        name={name}
        onNameChange={setName}
        avatar={avatar}
        onAvatarChange={setAvatar}
        onEnter={submit}
      />

      {/* Team picker */}
      <div className="flex w-full flex-col gap-3">
        <p className="text-text-muted text-center text-[10px] font-semibold tracking-normal uppercase">
          Wybierz bandę
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
              disabled={loading}
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

      <Button type="primary" disabled={!canContinue || loading} onClick={submit} className="w-full">
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Ładuję...
          </>
        ) : (
          'Dalej'
        )}
      </Button>
    </div>
  )
}
