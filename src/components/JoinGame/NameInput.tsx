'use client'

import { useState } from 'react'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Dices, ArrowLeft, ChevronRight } from 'lucide-react'
import { FUNNY_NAMES } from '@/lib/games/data'
import { Button } from '@/components/ui/button'

const AVATAR_LIST = ['🤠', '💃', '🌸', '✨', '🍾', '🎀', '👑', '🦋', '🌺', '🎉']

interface Props {
  value: string
  onChange: (v: string) => void
  avatar: string | null
  onAvatarChange: (v: string) => void
  onSubmit: () => void
  onBack: () => void
}

export function NameInput({ value, onChange, avatar, onAvatarChange, onSubmit, onBack }: Props) {
  const [placeholder, setPlaceholder] = useState('np. Duchess Rosa…')

  useEffect(() => {
    const randomName = FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)]
    setPlaceholder(`np. ${randomName}`)
  }, [])

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2
          className="mt-2 text-3xl tracking-widest"
          style={{ fontFamily: "'Bebas Neue',cursive", color: 'var(--sheriff-gold)' }}
        >
          Jak masz na imię kowboju?
        </h2>
      </div>

      {/* Avatar picker */}
      <div className="w-full max-w-xs">
        <p
          className="mb-2 text-center text-[10px] font-semibold tracking-widest uppercase"
          style={{ color: 'var(--text-muted)' }}
        >
          Wybierz awatar
        </p>
        <div className="grid grid-cols-5 gap-2">
          {AVATAR_LIST.map((emoji) => (
            <motion.button
              key={emoji}
              whileTap={{ scale: 0.88 }}
              onClick={() => onAvatarChange(emoji)}
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

      {/* Name + dice */}
      <div className="flex w-full max-w-xs gap-2">
        <input
          id="player-name-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && value.trim() && avatar && onSubmit()}
          maxLength={20}
          autoFocus
          placeholder={placeholder}
          className="bg-saloon-surface text-text-primary placeholder:text-text-muted flex-1 rounded-xl border-2 px-4 py-4 text-center text-lg font-bold transition-colors focus:outline-none"
          style={{ borderColor: value.trim() ? 'var(--neon-pink)' : 'var(--saloon-border)' }}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)])}
          className="bg-saloon-surface flex items-center justify-center rounded-xl border-2 px-4 transition-colors"
          style={{ borderColor: 'var(--saloon-border)' }}
          title="Losuj imię"
        >
          <Dices size={24} className="text-text-muted" />
        </motion.button>
      </div>

      {/* Back / Continue */}
      <div className="flex w-full max-w-xs gap-3">
        <Button type="outline" onClick={onBack} className="flex-1">
          <ArrowLeft size={14} /> Wróć
        </Button>
        <Button
          id="name-continue-btn"
          type="primary"
          disabled={!value.trim() || !avatar}
          onClick={onSubmit}
          className="flex-1"
        >
          Dalej <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}
