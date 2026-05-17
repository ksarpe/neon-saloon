'use client'

import { motion } from 'framer-motion'
import { BookOpen, Brain, Dices, Heart, Loader2, Lock, Swords, TrendingUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { ProModal } from '@/components/ui/ContentGate'
import { useContentAccess } from '@/hooks/useContentAccess'
import { checkAccess } from '@/lib/content-access'
import { FUNNY_NAMES } from '@/lib/games/data'
import { saveHostSecret } from '@/lib/session-host-secret'

const GAME_MODES = [
  {
    id: 'trivia',
    icon: Brain,
    label: 'Quiz o Pannie Młodej',
    description: 'Kto zna Pannę Młodą najlepiej? Uczestniczki odpowiadają i głosują jednocześnie.',
    color: 'var(--neon-pink)',
    border: 'rgba(255,16,240,0.5)',
    bg: 'rgba(255,16,240,0.07)',
  },
  {
    id: 'categories',
    icon: BookOpen,
    label: 'Skategoryzowane pytania',
    description:
      'Wybierz kategorię — anatomia, historia, kultura popularna i więcej. Pytania punktowane dla całej ekipy.',
    color: '#a78bfa',
    border: 'rgba(167,139,250,0.5)',
    bg: 'rgba(167,139,250,0.07)',
  },
  {
    id: 'never',
    icon: Heart,
    label: 'Nigdy przenigdy',
    description:
      'Karty z wyznaniami — brak odpowiedzi, brak punktów. Host przechodzi dalej kiedy uzna że już.',
    color: 'rgba(255,215,0,0.5)',
    border: 'rgba(255,215,0,0.5)',
    bg: 'rgba(255,215,0,0.07)',
  },
  {
    id: 'highlow',
    icon: TrendingUp,
    label: 'Mniej czy więcej',
    description:
      'Dwie drużyny, kapitan i głosowanie. Drużyna A podaje liczbę, drużyna B zgaduje — mniej czy więcej?',
    color: '#10b981',
    border: 'rgba(16,185,129,0.5)',
    bg: 'rgba(16,185,129,0.07)',
    isPremium: true,
  },
  {
    id: 'battle-royale',
    icon: Swords,
    label: 'Battle Royale',
    description:
      'Wszyscy odpowiadają naraz. Kto się pomyli — odpada. Jeśli wszyscy dobrze — odpada najwolniejszy. Ostatni ocalały wygrywa.',
    color: '#ef4444',
    border: 'rgba(239,68,68,0.5)',
    bg: 'rgba(239,68,68,0.07)',
  },
]

export default function HostSetupPage() {
  const router = useRouter()
  const [hostName, setHostName] = useState('')
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [proModalOpen, setProModalOpen] = useState(false)
  const [placeholder] = useState(() => {
    const randomName = FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)]
    return `np. ${randomName}`
  })
  const access = useContentAccess()

  const handleCreate = async () => {
    if (!hostName.trim() || !selectedMode) return
    setCreating(true)
    setError(null)
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hostName: hostName.trim(),
          gameMode: selectedMode,
        }),
      })
      if (!res.ok) throw new Error()
      const { pin, hostSecret } = await res.json()
      if (typeof hostSecret === 'string') {
        saveHostSecret(pin, hostSecret)
      }
      router.push(`/graj/host/${pin}?mode=${selectedMode}`)
    } catch {
      setError('Could not create a game. Try again!')
      setCreating(false)
    }
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center overflow-y-auto p-6">
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-8 sm:gap-10">
        {/* Host name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-xl self-center"
        >
          <label className="text-text-muted mb-2 block text-xs font-semibold tracking-widest uppercase">
            Jak się chcesz nazywać kowboju?
          </label>
          <div className="flex gap-2">
            <input
              id="host-name-input"
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && hostName.trim() && handleCreate()}
              maxLength={20}
              autoFocus
              placeholder={placeholder}
              className="bg-saloon-surface text-text-primary placeholder:text-text-muted flex-1 rounded-xl border-2 p-4 text-lg font-bold transition-colors focus:outline-none"
              style={{
                borderColor: hostName.trim() ? 'var(--sheriff-gold)' : 'var(--saloon-border)',
              }}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const randomName = FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)]
                setHostName(randomName)
              }}
              className="bg-saloon-surface flex items-center justify-center rounded-xl border-2 px-4 transition-colors"
              style={{ borderColor: 'var(--saloon-border)' }}
              title="Losuj imię"
            >
              <Dices size={24} className="text-text-muted" />
            </motion.button>
          </div>
        </motion.div>

        {/* Game mode selector */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <label className="text-text-muted mb-3 block text-xs font-semibold tracking-widest uppercase">
            Wybierz tryb gry
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {GAME_MODES.map((mode) => {
              const active = selectedMode === mode.id
              return (
                <motion.button
                  key={mode.id}
                  id={`mode-${mode.id}`}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (mode.isPremium && !checkAccess({ type: 'premium' }, access).granted) {
                      setProModalOpen(true)
                      return
                    }
                    setSelectedMode(mode.id)
                  }}
                  className="group relative flex h-full min-h-[128px] items-start gap-4 overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-200"
                  style={{
                    borderColor: active ? mode.border : 'var(--saloon-border)',
                    backgroundColor: active ? mode.bg : 'transparent',
                    boxShadow: active ? `0 0 20px ${mode.border}` : 'none',
                  }}
                >
                  <div className="pointer-events-none absolute inset-y-0 -left-full z-0 w-full skew-x-[-20deg] bg-linear-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />

                  {mode.isPremium && (
                    <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1 rounded-full border border-yellow-500/50 bg-black/60 px-2 py-0.5 text-[9px] font-bold tracking-widest text-yellow-400 uppercase">
                      {!checkAccess({ type: 'premium' }, access).granted && <Lock size={10} aria-hidden />}
                      PRO
                    </div>
                  )}

                  <div
                    className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: active ? mode.bg : 'var(--saloon-surface)',
                      border: `1px solid ${mode.border}`,
                    }}
                  >
                    <mode.icon size={20} style={{ color: mode.color }} />
                  </div>

                  <div className="relative z-10 flex-1">
                    <p
                      className="text-sm font-bold transition-colors duration-200"
                      style={{
                        color: active ? mode.color : 'var(--text-primary)',
                      }}
                    >
                      {mode.label}
                    </p>
                    <p className="text-text-muted mt-0.5 text-[11px] leading-snug">
                      {mode.description}
                    </p>
                  </div>

                  {active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: mode.color }}
                    >
                      <span className="text-[10px] text-white">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Create button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full max-w-xl self-center"
        >
          <Button
            id="create-lobby-btn"
            type="primary"
            disabled={!hostName.trim() || !selectedMode || creating}
            onClick={handleCreate}
            className="w-full"
            size="lg"
          >
            {creating ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Tworze salon...
              </>
            ) : (
              <>Otwórz salon na dzikim zachodzie</>
            )}
          </Button>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-center text-xs text-red-400"
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </div>

      {proModalOpen && <ProModal onClose={() => setProModalOpen(false)} />}
    </div>
  )
}
