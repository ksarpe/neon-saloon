'use client'

import { useParams, useSearchParams, useRouter } from 'next/navigation'
import HostScreen from '@/components/Host'
import HostHighLowScreen from '@/components/HighLow/HostHighLowScreen'
import { buildDeck } from '@/lib/store'
import { useMemo, useEffect, useState } from 'react'
import type { GameCard } from '@/lib/store'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { QUESTION_CATEGORIES } from '@/lib/games/categories'
import type { SessionTeam } from '@/lib/appwrite/sessions'
import { useBackButton } from '@/lib/back-button-context'

type NeverSource = 'app' | 'own' | 'all'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

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
  children: React.ReactNode
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
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-[-20%] left-[-15%] h-[60vw] w-[60vw] rounded-full opacity-[0.07]"
          style={{
            background: `radial-gradient(circle,${glowColor} 0%,transparent 70%)`,
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute right-[-15%] bottom-[-20%] h-[60vw] w-[60vw] rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-col gap-8">
        {/* Header — back button is handled globally by PageTransition */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="shimmer-text text-5xl tracking-widest"
            style={{ fontFamily: "'Bebas Neue', cursive" }}
          >
            {title}
          </h1>
          <p className="text-text-muted mt-1 text-xs tracking-widest uppercase">{subtitle}</p>
        </motion.div>

        {children}
      </div>
    </div>
  )
}

// ─── Category picker ───────────────────────────────────────────────────────────

function CategoryPicker({
  onSelect,
  onBack,
}: {
  onSelect: (id: string) => void
  onBack: () => void
}) {
  return (
    <PickerShell
      title="Wybierz kategorię"
      subtitle="Uczestnicy będą odpowiadać na pytania z wybranej kategorii"
      glowColor="#a78bfa"
      onBack={onBack}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {QUESTION_CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(cat.id)}
            className="flex flex-col gap-2 rounded-2xl border-2 p-5 text-left transition-all duration-200"
            style={{ borderColor: cat.border, backgroundColor: cat.bg }}
            onMouseEnter={(e) => {
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
              {cat.questions.length} pytań
            </p>
          </motion.button>
        ))}
      </div>
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
    color: 'var(--sheriff-gold)',
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

function NeverSourcePicker({
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

// ─── HighLow team setup ────────────────────────────────────────────────────────

function HighLowTeamSetup({
  pin,
  onSetup,
  onBack,
}: {
  pin: string
  onSetup: (t1: SessionTeam, t2: SessionTeam) => void
  onBack: () => void
}) {
  const [name1, setName1] = useState('Drużyna Alfa')
  const [name2, setName2] = useState('Drużyna Beta')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSetup = async () => {
    if (!name1.trim() || !name2.trim() || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/sessions/${pin}/highlow/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      title="Utwórz drużyny"
      subtitle="Gracze dołączą do jednej z dwóch drużyn przed rozpoczęciem gry"
      glowColor="#10b981"
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
          <label className="text-text-muted text-xs font-semibold tracking-widest uppercase">
            Drużyna 1
          </label>
          <input
            type="text"
            value={name1}
            onChange={(e) => setName1(e.target.value)}
            maxLength={20}
            placeholder="np. Drużyna Alfa"
            className="bg-saloon-surface text-text-primary placeholder:text-text-muted w-full rounded-xl border-2 px-4 py-3 text-base font-bold transition-colors focus:outline-none"
            style={{
              borderColor: name1.trim() ? 'var(--neon-pink)' : 'var(--saloon-border)',
            }}
          />
        </div>

        {/* Team 2 */}
        <div className="flex flex-col gap-2">
          <label className="text-text-muted text-xs font-semibold tracking-widest uppercase">
            Drużyna 2
          </label>
          <input
            type="text"
            value={name2}
            onChange={(e) => setName2(e.target.value)}
            maxLength={20}
            placeholder="np. Drużyna Beta"
            className="bg-saloon-surface text-text-primary placeholder:text-text-muted w-full rounded-xl border-2 px-4 py-3 text-base font-bold transition-colors focus:outline-none"
            style={{
              borderColor: name2.trim() ? 'var(--sheriff-gold)' : 'var(--saloon-border)',
            }}
          />
        </div>

        {error && <p className="text-center text-xs text-red-400">{error}</p>}

        <motion.button
          disabled={!name1.trim() || !name2.trim() || loading}
          whileTap={{ scale: 0.97 }}
          onClick={handleSetup}
          className="flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-white disabled:opacity-30"
          style={{
            background: 'linear-gradient(135deg,#10b981,#059669)',
            boxShadow: '0 4px 30px rgba(16,185,129,0.4)',
            fontFamily: "'Bebas Neue',cursive",
            fontSize: '1.1rem',
            letterSpacing: '0.15em',
          }}
        >
          {loading ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            'Utwórz drużyny i otwórz lobby'
          )}
        </motion.button>
      </motion.div>
    </PickerShell>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HostPage() {
  const { pin } = useParams<{ pin: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get('mode') ?? 'classic'

  const fullDeck = useMemo(() => buildDeck(), [])

  const [customCards, setCustomCards] = useState<GameCard[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [neverSource, setNeverSource] = useState<NeverSource | null>(null)

  // HighLow teams (null = not yet set up)
  const [hlTeam1, setHlTeam1] = useState<SessionTeam | null>(null)
  const [hlTeam2, setHlTeam2] = useState<SessionTeam | null>(null)

  // If navigating back to this page after teams were already set up, restore them
  useEffect(() => {
    if (mode !== 'highlow') return
    fetch(`/api/sessions/${pin}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.teams) && data.teams.length >= 2) {
          setHlTeam1(data.teams[0])
          setHlTeam2(data.teams[1])
        }
      })
      .catch(() => {})
  }, [mode, pin])

  // Predefined cards from the store (filtered by mode)
  const appNeverCards = useMemo(() => fullDeck.filter((c) => c.type === 'NEVER'), [fullDeck])
  const appQuizCards = useMemo(() => fullDeck.filter((c) => c.type === 'QUIZ'), [fullDeck])

  // "never" mode: fetch user's custom questions when needed
  useEffect(() => {
    if (mode !== 'never' || !neverSource) return
    if (neverSource === 'app') return // no DB fetch needed
    fetch('/api/questions/never')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Array<{ id: string; text: string }>) => {
        if (!Array.isArray(data) || data.length === 0) return
        setCustomCards(
          data.map((q) => ({
            id: `custom-${q.id}`,
            type: 'NEVER' as const,
            title: 'Nigdy przenigdy',
            description: q.text,
          }))
        )
      })
      .catch(() => {})
  }, [mode, neverSource])

  // "categories" mode: build deck from selected category
  useEffect(() => {
    if (mode !== 'categories' || !selectedCategory) return
    const cat = QUESTION_CATEGORIES.find((c) => c.id === selectedCategory)
    if (!cat) return
    setCustomCards(
      cat.questions.map((q, i) => ({
        id: `cat-${selectedCategory}-${i}`,
        type: 'QUIZ' as const,
        title: cat.name,
        description: q.text,
        answer: q.answer,
        options: q.options,
      }))
    )
  }, [mode, selectedCategory])

  // Assemble final deck
  const deck = useMemo(() => {
    if (mode === 'trivia') return appQuizCards
    if (mode === 'categories') return customCards // shuffled below
    if (mode === 'never') {
      if (neverSource === 'app') return shuffle(appNeverCards)
      if (neverSource === 'own') return shuffle(customCards)
      if (neverSource === 'all') return shuffle([...appNeverCards, ...customCards])
      return []
    }
    return []
  }, [mode, neverSource, appNeverCards, appQuizCards, customCards])

  // ── Pickers shown before the lobby ──────────────────────────────────────────

  if (mode === 'categories' && !selectedCategory) {
    return (
      <CategoryPicker onSelect={setSelectedCategory} onBack={() => router.push('/graj/host')} />
    )
  }

  if (mode === 'never' && !neverSource) {
    return <NeverSourcePicker onSelect={setNeverSource} onBack={() => router.push('/graj/host')} />
  }

  // ── HighLow: team setup step then lobby ──────────────────────────────────

  if (mode === 'highlow') {
    if (!hlTeam1 || !hlTeam2) {
      return (
        <HighLowTeamSetup
          pin={pin}
          onSetup={(t1, t2) => {
            setHlTeam1(t1)
            setHlTeam2(t2)
          }}
          onBack={() => router.push('/graj/host')}
        />
      )
    }
    return <HostHighLowScreen pin={pin} team1={hlTeam1} team2={hlTeam2} initialPlayers={[]} />
  }

  return <HostScreen pin={pin} initialCards={deck} gameMode={mode} />
}
