'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import type { SessionTeam } from '@/lib/appwrite/sessions'
import { useBackButton } from '@/lib/back-button-context'
import { QUESTION_CATEGORIES } from '@/lib/games/categories'
import { QUESTIONS_PER_GAME } from '@/lib/games/question-limit'
import { hostJsonHeaders } from '@/lib/session-host-secret'

export type NeverSource = 'app' | 'own' | 'all'

export const ALL_CATEGORIES_ID = 'all-categories'

const ALL_CATEGORIES_OPTION = {
  id: ALL_CATEGORIES_ID,
  name: 'Wszystko na raz',
  description: 'Losuje pytania ze wszystkich kategorii w jednej grze',
  color: '#22c55e',
  border: 'rgba(34,197,94,0.5)',
  bg: 'rgba(34,197,94,0.07)',
  questions: QUESTION_CATEGORIES.flatMap((cat) => cat.questions),
} satisfies (typeof QUESTION_CATEGORIES)[number]

// ─── Shared picker shell ───────────────────────────────────────────────────────

function PickerShell({
  title,
  subtitle,
  glowColor = '#a78bfa',
  onBack,
  children,
}: {
  title: string
  subtitle: string
  glowColor?: string
  onBack: () => void
  children: ReactNode
}) {
  const { setOnBack, setHidden } = useBackButton()

  useEffect(() => {
    setHidden(false)
    setOnBack(() => onBack)
    return () => {
      setOnBack(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center p-6">
      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col gap-8">
        {/* Header — back button is handled globally by PageTransition */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="text-sheriff-pink text-5xl"
            style={{
              fontFamily: 'var(--font-app)',
              textShadow: `0 0 28px ${glowColor}`,
            }}
          >
            {title}
          </h1>
          <p className="text-text-muted mt-1 text-xs tracking-normal uppercase">{subtitle}</p>
        </motion.div>

        {children}
      </div>
    </div>
  )
}

// ─── Category picker ───────────────────────────────────────────────────────────

export function CategoryPicker({
  onSelect,
  onBack,
  loading = false,
  includeAllOption = false,
}: {
  onSelect: (id: string) => void
  onBack: () => void
  loading?: boolean
  includeAllOption?: boolean
}) {
  const categories = includeAllOption
    ? [...QUESTION_CATEGORIES, ALL_CATEGORIES_OPTION]
    : QUESTION_CATEGORIES

  return (
    <PickerShell
      title="Wybierz kategorię"
      subtitle="Uczestnicy będą odpowiadać na pytania z wybranej kategorii"
      glowColor="#a78bfa"
      onBack={onBack}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            onClick={() => onSelect(cat.id)}
            className="flex flex-col gap-2 rounded-2xl border-2 p-5 text-left transition-all duration-200 disabled:opacity-50"
            style={{ borderColor: cat.border, backgroundColor: cat.bg }}
            onMouseEnter={(e) => {
              if (loading) return
              e.currentTarget.style.boxShadow = `0 0 24px ${cat.border}`
              e.currentTarget.style.borderColor = cat.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.borderColor = cat.border
            }}
          >
            <p className="text-base font-bold" style={{ color: cat.color }}>
              {cat.name}
            </p>
            <p className="text-text-muted text-xs leading-snug">{cat.description}</p>
            <p className="mt-1 text-xs font-semibold" style={{ color: cat.color, opacity: 0.6 }}>
              {Math.min(cat.questions.length, QUESTIONS_PER_GAME)} pytań w grze
            </p>
          </motion.button>
        ))}
      </div>
      {loading && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Loader2 size={14} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Konfiguruję grę…
          </span>
        </div>
      )}
    </PickerShell>
  )
}

// ─── Never source picker ───────────────────────────────────────────────────────

const NEVER_SOURCES: Array<{
  id: NeverSource
  label: string
  desc: string
  color: string
  border: string
  bg: string
}> = [
  {
    id: 'app',
    label: 'Pytania aplikacji',
    desc: 'Gotowe wyznania dołączone do gry — działają zawsze, bez konfiguracji.',
    color: 'var(--sheriff-pink)',
    border: 'rgba(255,215,0,0.5)',
    bg: 'rgba(255,215,0,0.07)',
  },
  {
    id: 'own',
    label: 'Własne wyznania',
    desc: 'Tylko pytania dodane przez Ciebie w Panelu szeryfa. Upewnij się, że masz tam przynajmniej kilka.',
    color: 'var(--neon-pink)',
    border: 'rgba(255,16,240,0.5)',
    bg: 'rgba(255,16,240,0.07)',
  },
  {
    id: 'all',
    label: 'Wszystkie razem',
    desc: 'Łączy gotowe wyznania aplikacji z Twoimi własnymi — największa talia.',
    color: '#a78bfa',
    border: 'rgba(167,139,250,0.5)',
    bg: 'rgba(167,139,250,0.07)',
  },
]

export function NeverSourcePicker({
  onSelect,
  onBack,
}: {
  onSelect: (src: NeverSource) => void
  onBack: () => void
}) {
  return (
    <PickerShell
      title="Wybierz źródło pytań"
      subtitle="Skąd mają pochodzić wyznania w tej rundzie?"
      glowColor="var(--neon-pink)"
      onBack={onBack}
    >
      <div className="flex flex-col gap-4">
        {NEVER_SOURCES.map((src, i) => (
          <motion.button
            key={src.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.09 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(src.id)}
            className="flex flex-col gap-1.5 rounded-2xl border-2 p-5 text-left transition-all duration-200"
            style={{ borderColor: src.border, backgroundColor: src.bg }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = `0 0 24px ${src.border}`
              e.currentTarget.style.borderColor = src.color
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.borderColor = src.border
            }}
          >
            <p className="text-base font-bold" style={{ color: src.color }}>
              {src.label}
            </p>
            <p className="text-text-muted text-xs leading-snug">{src.desc}</p>
          </motion.button>
        ))}
      </div>
    </PickerShell>
  )
}

export function TriviaDeckState({
  loading,
  onPanel,
  onBack,
}: {
  loading: boolean
  onPanel: () => void
  onBack: () => void
}) {
  return (
    <PickerShell
      title="Quiz o Pannie Młodej"
      subtitle={
        loading
          ? 'Pobieram Twoje pytania z panelu szeryfa'
          : 'Dodaj własne pytania, żeby uruchomić ten tryb'
      }
      glowColor="var(--neon-pink)"
      onBack={onBack}
    >
      <div
        className="flex flex-col items-center gap-4 rounded-2xl border p-6 text-center"
        style={{
          borderColor: 'rgba(255,16,240,0.25)',
          backgroundColor: 'rgba(13,8,24,0.55)',
        }}
      >
        {loading ? (
          <>
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--neon-pink)' }} />
            <p className="text-text-muted text-sm">Sprawdzam pytania quizowe...</p>
          </>
        ) : (
          <>
            <p className="text-text-primary text-base font-bold">
              Nie masz jeszcze pytań do tego quizu.
            </p>
            <p className="text-text-muted max-w-md text-sm leading-snug">
              Quiz o Pannie Młodej korzysta tylko z pytań dodanych przez Ciebie w panelu.
            </p>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={onPanel}
                className="rounded-xl border-2 px-5 py-3 text-xs font-bold tracking-normal uppercase"
                style={{
                  borderColor: 'var(--neon-pink)',
                  backgroundColor: 'rgba(255,16,240,0.12)',
                  color: 'var(--neon-pink)',
                }}
              >
                Otwórz panel
              </button>
              <button
                type="button"
                onClick={onBack}
                className="rounded-xl border px-5 py-3 text-xs font-bold tracking-normal uppercase"
                style={{
                  borderColor: 'rgba(255,220,180,0.15)',
                  color: 'rgba(255,220,180,0.7)',
                }}
              >
                Wróć do trybów
              </button>
            </div>
          </>
        )}
      </div>
    </PickerShell>
  )
}

// ─── HighLow team setup ────────────────────────────────────────────────────────

export function HighLowTeamSetup({
  pin,
  onSetup,
  onBack,
}: {
  pin: string
  onSetup: (t1: SessionTeam, t2: SessionTeam) => void
  onBack: () => void
}) {
  const [name1, setName1] = useState('Dziewice')
  const [name2, setName2] = useState('Zdziry')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSetup = async () => {
    if (!name1.trim() || !name2.trim() || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/sessions/${pin}/highlow/setup`, {
        method: 'POST',
        headers: hostJsonHeaders(pin),
        body: JSON.stringify({ team1Name: name1.trim(), team2Name: name2.trim() }),
      })
      if (!res.ok) throw new Error()
      const { team1, team2 } = await res.json()
      onSetup(team1, team2)
    } catch {
      setError('Nie udało się utworzyć drużyn. Spróbuj ponownie.')
      setLoading(false)
    }
  }

  return (
    <PickerShell
      title="Utwórz bandy"
      subtitle="Gracze dołączą do jednej z dwóch band przed rozpoczęciem gry"
      onBack={onBack}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-5"
      >
        {/* Team 1 */}
        <div className="flex flex-col gap-2">
          <label className="text-text-muted text-xs font-semibold tracking-normal uppercase">
            Banda 1
          </label>
          <input
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            maxLength={20}
            placeholder="np. Dziewice"
            className="bg-saloon-surface text-text-primary placeholder:text-text-muted w-full rounded-xl border-2 px-4 py-3 text-base font-bold transition-colors focus:outline-none"
            style={{
              borderColor: name1.trim() ? 'var(--neon-pink)' : 'var(--saloon-border)',
            }}
          />
        </div>

        {/* Team 2 */}
        <div className="flex flex-col gap-2">
          <label className="text-text-muted text-xs font-semibold tracking-normal uppercase">
            Banda 2
          </label>
          <input
            type="text"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            maxLength={20}
            placeholder="np. Zdziry"
            className="bg-saloon-surface text-text-primary placeholder:text-text-muted w-full rounded-xl border-2 px-4 py-3 text-base font-bold transition-colors focus:outline-none"
            style={{
              borderColor: name2.trim() ? 'var(--sheriff-pink)' : 'var(--saloon-border)',
            }}
          />
        </div>

        {error && <p className="text-center text-xs text-red-400">{error}</p>}

        <Button
          type="primary"
          size="lg"
          disabled={!name1.trim() || !name2.trim() || loading}
          onClick={handleSetup}
          className="w-full"
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            'Utwórz bandy i otwórz poczekalnie'
          )}
        </Button>
      </motion.div>
    </PickerShell>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
