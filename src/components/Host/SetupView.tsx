'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dices, ChevronRight } from 'lucide-react'
import { FUNNY_NAMES } from '@/lib/games/data'
import { AVATAR_LIST } from './types'
import { Button } from '@/components/ui/button'

interface Props {
  name: string
  onNameChange: (v: string) => void
  avatar: string | null
  onAvatarChange: (v: string) => void
  onContinue: () => void
}

export function SetupView({ name, onNameChange, avatar, onAvatarChange, onContinue }: Props) {
  const [placeholder] = useState(
    () => `np. ${FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)]}`
  )

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-8">
      <div className="text-center">
        <h1
          className="shimmer-text text-5xl tracking-widest"
          style={{ fontFamily: "'Bebas Neue',cursive" }}
        >
          last rodeo andżeliki
        </h1>
        <p className="text-text-muted mt-1 text-xs tracking-widest uppercase">
          Najpierw wybierz swój awatar
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

      {/* Name input */}
      <div className="flex w-full gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && name.trim() && avatar && onContinue()}
          maxLength={20}
          autoFocus
          placeholder={placeholder}
          className="bg-saloon-surface text-text-primary placeholder:text-text-muted flex-1 rounded-xl border-2 px-4 py-4 text-center text-lg font-bold transition-colors focus:outline-none"
          style={{ borderColor: name.trim() ? 'var(--neon-pink)' : 'var(--saloon-border)' }}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onNameChange(FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)])}
          className="bg-saloon-surface flex items-center justify-center rounded-xl border-2 px-4"
          style={{ borderColor: 'var(--saloon-border)' }}
          title="Losuj imię"
        >
          <Dices size={22} className="text-text-muted" />
        </motion.button>
      </div>

      <Button
        type="primary"
        disabled={!name.trim() || !avatar}
        onClick={onContinue}
        className="w-full"
      >
        Dalej <ChevronRight size={18} />
      </Button>
    </div>
  )
}
