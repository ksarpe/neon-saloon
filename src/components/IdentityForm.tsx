'use client'

import { motion } from 'framer-motion'
import { Dices } from 'lucide-react'
import { useEffect, useState } from 'react'

import { PLAYER_AVATARS } from '@/config/player-avatars'
import { FUNNY_NAMES } from '@/config/player-names'

import { PlayerAvatar } from './PlayerAvatar'

interface Props {
  name: string
  onNameChange: (v: string) => void
  avatar: string | null
  onAvatarChange: (v: string) => void
  onEnter?: () => void
}

export function IdentityForm({ name, onNameChange, avatar, onAvatarChange, onEnter }: Props) {
  const [placeholder, setPlaceholder] = useState('np. Duchess Rosa…')

  useEffect(() => {
    setPlaceholder(`np. ${FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)]}`)
  }, [])

  const canSubmit = Boolean(name.trim() && avatar)

  return (
    <div className="flex w-full max-w-2xl flex-col items-center gap-6">
      <h2
        className="text-center text-3xl"
        style={{ fontFamily: 'var(--font-app)', color: 'var(--sheriff-pink)' }}
      >
        Wybierz awatar i nazwę
      </h2>

      {PLAYER_AVATARS.length > 0 ? (
        <div className="grid w-full grid-cols-5 gap-3 sm:grid-cols-7">
          {PLAYER_AVATARS.map((filename) => (
            <motion.button
              key={filename}
              type="button"
              whileHover={{ y: -2, scale: 1.04 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => onAvatarChange(filename)}
              className="group flex aspect-square min-h-16 items-center justify-center rounded-2xl border-2 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(255,16,240,0.28)]"
              style={{
                borderColor: avatar === filename ? 'var(--neon-pink)' : 'var(--saloon-border)',
                backgroundColor:
                  avatar === filename ? 'rgba(255,16,240,0.15)' : 'var(--saloon-surface)',
                boxShadow: avatar === filename ? '0 0 12px rgba(255,16,240,0.3)' : 'none',
              }}
            >
              <PlayerAvatar
                avatar={filename}
                size={72}
                className="transition-transform duration-150 ease-out group-hover:scale-115"
              />
            </motion.button>
          ))}
        </div>
      ) : (
        <p className="text-text-muted text-center text-xs opacity-60">Brak awatarów</p>
      )}

      <div className="grid w-full grid-cols-[1fr_3.5rem] gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && canSubmit && onEnter) onEnter()
          }}
          maxLength={24}
          autoFocus
          placeholder={placeholder}
          className="bg-saloon-surface text-text-primary placeholder:text-text-muted h-14 min-w-0 rounded-xl border-2 px-4 py-0 text-center text-lg font-bold transition-colors focus:outline-none"
          style={{ borderColor: name.trim() ? 'var(--neon-pink)' : 'var(--saloon-border)' }}
        />
        <motion.button
          type="button"
          whileHover={{ y: -2, scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onNameChange(FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)])}
          className="bg-saloon-surface group flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-2 p-0 transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-[0_0_18px_rgba(255,16,240,0.28)]"
          style={{ borderColor: 'var(--saloon-border)' }}
          title="Losuj imię"
        >
          <Dices
            size={22}
            className="text-text-muted transition-transform duration-150 ease-out group-hover:scale-110"
          />
        </motion.button>
      </div>
    </div>
  )
}
