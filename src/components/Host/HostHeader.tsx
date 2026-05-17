'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Flag, Menu, X, Zap } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import type { VoteCastPayload } from '@/lib/game-types'
import { BRIDAL_QUIZ_TITLE, NEVER_TITLE } from '@/lib/games/default-deck'
import type { GameCard } from '@/lib/store'

import type { HostPhase, LivePlayer } from './types'
import { ACCENT } from './types'

interface Props {
  phase: HostPhase
  pin: string
  currentCard: GameCard | undefined
  cardIndex: number
  totalCards: number
  currentVotes: VoteCastPayload[]
  players: LivePlayer[]
  onForceFinish: () => void
}

export function HostHeader({
  phase,
  pin,
  currentCard,
  cardIndex,
  totalCards,
  currentVotes,
  players,
  onForceFinish,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const cardTypeLabel =
    currentCard?.title ??
    (currentCard?.type === 'QUIZ'
      ? BRIDAL_QUIZ_TITLE
      : currentCard?.type === 'NEVER'
        ? NEVER_TITLE
        : currentCard?.type)

  useEffect(() => {
    if (!menuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  if (phase === 'setup') return null

  return (
    <div
      className="relative z-20 shrink-0 border-b"
      style={{ borderColor: 'rgba(255,220,180,0.1)' }}
    >
      <div className="mx-auto grid max-w-5xl grid-cols-3 items-center px-6 py-4">
        {/* Left: PIN */}
        <div className="flex items-center gap-2">
          <Zap size={14} style={{ color: 'var(--neon-pink)' }} />
          <span className="text-text-muted text-xs font-semibold tracking-widest uppercase">
            PIN: <span className="text-text-primary">{pin}</span>
          </span>
        </div>

        {/* Center: card type + progress */}
        <div className="flex items-center justify-center gap-2">
          {phase === 'active' && currentCard && (
            <>
              <span
                className="max-w-[180px] truncate rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase"
                style={{
                  color: ACCENT[currentCard.type] ?? 'var(--neon-pink)',
                  borderColor: `${ACCENT[currentCard.type] ?? 'var(--neon-pink)'}55`,
                  backgroundColor: `${ACCENT[currentCard.type] ?? 'var(--neon-pink)'}15`,
                }}
              >
                {cardTypeLabel}
              </span>
              <span className="text-text-muted text-xs font-semibold tabular-nums">
                {cardIndex + 1} / {totalCards}
              </span>
            </>
          )}
        </div>

        {/* Right: vote count + LIVE + menu */}
        <div className="flex items-center justify-end gap-3">
          {phase === 'active' && (
            <span className="text-text-muted text-xs font-semibold tabular-nums">
              <span className="text-text-primary">{currentVotes.length}</span>
              {' / '}
              <span className="text-text-primary">{players.length}</span>
              {' głosów'}
            </span>
          )}

          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 animate-pulse rounded-full"
              style={{ backgroundColor: 'var(--neon-pink)' }}
            />
            <span className="text-text-muted text-xs font-bold tracking-tighter">LIVE</span>
          </div>

          {/* Hamburger menu */}
          <div ref={menuRef} className="relative">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border"
              style={{
                borderColor: 'rgba(255,220,180,0.18)',
                backgroundColor: 'rgba(255,220,180,0.05)',
                color: 'rgba(255,220,180,0.65)',
              }}
            >
              {menuOpen ? <X size={15} /> : <Menu size={15} />}
            </motion.button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-10 right-0 z-[100] min-w-[180px] rounded-2xl border p-1.5 shadow-xl"
                  style={{
                    borderColor: 'rgba(255,220,180,0.15)',
                    backgroundColor: 'rgba(13,8,24,0.95)',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  {phase !== 'finished' ? (
                    <button
                      onClick={() => { setMenuOpen(false); onForceFinish() }}
                      className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold"
                      style={{ color: '#ef4444' }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'transparent')
                      }
                    >
                      <Flag size={14} />
                      Zakończ grę
                    </button>
                  ) : (
                    <p className="text-text-muted px-4 py-3 text-xs">Gra zakończona</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
