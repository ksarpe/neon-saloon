'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import BattleRoyaleHost from '@/components/BattleRoyale/BattleRoyaleHost'
import HostHighLowScreen from '@/components/HighLow/HostHighLowScreen'
import HostScreen from '@/components/Host'
import {
  CategoryPicker,
  NeverDeckState,
  type NeverSource,
  NeverSourcePicker,
  TriviaDeckState,
} from '@/components/HostSetup/HostPickers'
import { Button } from '@/components/ui/button'
import { QUESTION_CATEGORIES } from '@/config/games/categories'
import { ALL_CATEGORIES_ID, PREMIUM_CATEGORY_IDS } from '@/config/games/category-selection'
import { QUESTIONS_PER_GAME, shuffleAndLimitQuestions } from '@/lib/games/question-limit'
import { readHostCredentials } from '@/lib/party-ticket-client'
import type { GameCard } from '@/lib/store'

type QuizApiQuestion = {
  id: string
  text: string
  answer: string
  options: string[]
}

const APP_NEVER_SOURCES = new Set<NeverSource>(['classic', 'spicy', 'uncensored', 'all'])

export default function HostPage() {
  const { pin } = useParams<{ pin: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get('mode') ?? 'trivia'
  const storedHost = readHostCredentials()
  const partyToken = storedHost?.pin === pin ? storedHost.partyToken : null

  const [appNeverCards, setAppNeverCards] = useState<GameCard[]>([])
  const [appNeverLoading, setAppNeverLoading] = useState(false)
  const [appNeverError, setAppNeverError] = useState<string | null>(null)
  const [customCards, setCustomCards] = useState<GameCard[]>([])
  const [quizCards, setQuizCards] = useState<GameCard[]>([])
  const [quizLoading, setQuizLoading] = useState(mode === 'trivia')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [neverSource, setNeverSource] = useState<NeverSource | null>(null)

  const categoryCards = useMemo<GameCard[]>(() => {
    if (mode !== 'categories' || !selectedCategory) return []
    const selectedCategories =
      selectedCategory === ALL_CATEGORIES_ID
        ? QUESTION_CATEGORIES
        : QUESTION_CATEGORIES.filter((cat) => cat.id === selectedCategory)

    return selectedCategories.flatMap((cat) =>
      cat.questions.map((q, i) => ({
        id: `cat-${cat.id}-${i}`,
        type: 'QUIZ' as const,
        title: cat.name,
        description: q.text,
        answer: q.answer,
        options: q.options,
      }))
    )
  }, [mode, selectedCategory])

  useEffect(() => {
    if (mode !== 'trivia') return
    fetch('/api/questions/quiz')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: QuizApiQuestion[]) => {
        if (!Array.isArray(data)) {
          setQuizCards([])
          return
        }
        setQuizCards(
          data.map((q) => ({
            id: `quiz-${q.id}`,
            type: 'QUIZ' as const,
            title: 'Quiz o Pannie Mlodej',
            description: q.text,
            answer: q.answer,
            options: q.options,
          }))
        )
      })
      .catch(() => setQuizCards([]))
      .finally(() => setQuizLoading(false))
  }, [mode])

  useEffect(() => {
    if (mode !== 'never' || !neverSource || !APP_NEVER_SOURCES.has(neverSource)) return

    const controller = new AbortController()
    setAppNeverCards([])
    setAppNeverError(null)
    setAppNeverLoading(true)

    fetch(`/api/decks/never?deck=${neverSource}`, { signal: controller.signal })
      .then(async (r) => {
        if (r.status === 403) throw new Error('premium_required')
        if (!r.ok) throw new Error('failed')
        return r.json()
      })
      .then((data: GameCard[]) => {
        setAppNeverCards(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === 'AbortError') return
        setAppNeverCards([])
        setAppNeverError(
          err instanceof Error && err.message === 'premium_required'
            ? 'Ta talia wymaga dostepu PRO.'
            : 'Nie udalo sie pobrac talii Nigdy przenigdy.'
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setAppNeverLoading(false)
      })

    return () => controller.abort()
  }, [mode, neverSource])

  useEffect(() => {
    if (mode !== 'never' || !neverSource) return
    if (neverSource !== 'own' && neverSource !== 'all') return
    setCustomCards([])
    fetch('/api/questions/never')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Array<{ id: string; text: string }>) => {
        if (!Array.isArray(data) || data.length === 0) return
        setCustomCards(
          data.map((q) => ({
            id: `custom-${q.id}`,
            type: 'NEVER' as const,
            description: q.text,
          }))
        )
      })
      .catch(() => {})
  }, [mode, neverSource])

  const deck = useMemo(() => {
    if (mode === 'trivia') return shuffleAndLimitQuestions(quizCards)
    if (mode === 'categories') return shuffleAndLimitQuestions(categoryCards)
    if (mode === 'never') {
      if (neverSource === 'classic' || neverSource === 'spicy' || neverSource === 'uncensored') {
        return shuffleAndLimitQuestions(appNeverCards)
      }
      if (neverSource === 'own') return shuffleAndLimitQuestions(customCards)
      if (neverSource === 'all') return shuffleAndLimitQuestions([...appNeverCards, ...customCards])
      return []
    }
    return []
  }, [mode, neverSource, appNeverCards, quizCards, categoryCards, customCards])

  if (!partyToken) {
    return (
      <div className="flex min-h-dvh w-full flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-text-primary text-2xl font-black">Brak tokenu hosta</h1>
        <p className="text-text-muted max-w-md text-sm">
          Ten salon dziala na PartyKit. Utworz go ponownie z tego urzadzenia albo wroc do aktywnej
          sesji z ekranu tworzenia salonu.
        </p>
        <Button type="primary" onClick={() => router.push('/graj/host')}>
          Wroc do tworzenia salonu
        </Button>
      </div>
    )
  }

  if (mode === 'battle-royale') {
    return <BattleRoyaleHost pin={pin} partyToken={partyToken} />
  }

  if (mode === 'highlow') {
    return (
      <HostHighLowScreen
        pin={pin}
        partyToken={partyToken}
        questionLimit={QUESTIONS_PER_GAME}
      />
    )
  }

  if (mode === 'categories' && !selectedCategory) {
    return (
      <CategoryPicker
        onSelect={setSelectedCategory}
        onBack={() => router.push('/graj/host')}
        includeAllOption
        premiumCategoryIds={PREMIUM_CATEGORY_IDS}
      />
    )
  }

  if (mode === 'never' && !neverSource) {
    return <NeverSourcePicker onSelect={setNeverSource} onBack={() => router.push('/graj/host')} />
  }

  if (
    mode === 'never' &&
    neverSource &&
    APP_NEVER_SOURCES.has(neverSource) &&
    (appNeverLoading || appNeverError || deck.length === 0)
  ) {
    return (
      <NeverDeckState
        loading={appNeverLoading || (!appNeverError && deck.length === 0)}
        error={appNeverError}
        onBack={() => setNeverSource(null)}
      />
    )
  }

  if (mode === 'trivia' && (quizLoading || deck.length === 0)) {
    return (
      <TriviaDeckState
        loading={quizLoading}
        onPanel={() => router.push('/panel')}
        onBack={() => router.push('/graj/host')}
      />
    )
  }

  return <HostScreen pin={pin} initialCards={deck} gameMode={mode} partyToken={partyToken} />
}
