'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import BattleRoyaleHost from '@/components/BattleRoyale/BattleRoyaleHost'
import HostHighLowScreen from '@/components/HighLow/HostHighLowScreen'
import HostScreen from '@/components/Host'
import {
  ALL_CATEGORIES_ID,
  CategoryPicker,
  HighLowTeamSetup,
  type NeverSource,
  NeverSourcePicker,
  TriviaDeckState,
} from '@/components/HostSetup/HostPickers'
import type { SessionTeam } from '@/lib/appwrite/sessions'
import { QUESTION_CATEGORIES } from '@/config/games/categories'
import { QUESTIONS_PER_GAME, shuffleAndLimitQuestions } from '@/lib/games/question-limit'
import { hostAuthHeaders, hostJsonHeaders } from '@/lib/session-host-secret'
import type { GameCard } from '@/lib/store'
import { buildDeck } from '@/lib/store'

type QuizApiQuestion = {
  id: string
  text: string
  answer: string
  options: string[]
}

export default function HostPage() {
  const { pin } = useParams<{ pin: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get('mode') ?? 'classic'

  const fullDeck = useMemo(() => buildDeck(), [])

  const [customCards, setCustomCards] = useState<GameCard[]>([])
  const [quizCards, setQuizCards] = useState<GameCard[]>([])
  const [quizLoading, setQuizLoading] = useState(mode === 'trivia')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [neverSource, setNeverSource] = useState<NeverSource | null>(null)
  const [brCategoryId, setBrCategoryId] = useState<string | null>(null)
  const [brQuestionOrder, setBrQuestionOrder] = useState<number[] | null>(null)
  const [brRoundTimerDuration, setBrRoundTimerDuration] = useState(20)
  const [brSetupLoading, setBrSetupLoading] = useState(false)
  const [brTimerSeconds, setBrTimerSeconds] = useState(20)
  useEffect(() => {
    if (mode !== 'battle-royale') return
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.brTimerSeconds) setBrTimerSeconds(d.brTimerSeconds)
      })
      .catch(() => {})
  }, [mode])

  // HighLow teams (null = not yet set up)
  const [hlTeam1, setHlTeam1] = useState<SessionTeam | null>(null)
  const [hlTeam2, setHlTeam2] = useState<SessionTeam | null>(null)

  // If navigating back to this page after teams were already set up, restore them
  useEffect(() => {
    if (mode !== 'highlow') return
    fetch(`/api/sessions/${pin}`, { headers: hostAuthHeaders(pin) })
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

  // "trivia" mode: Quiz o Pannie Młodej uses only the user's panel questions.
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
            title: 'Quiz o Pannie Młodej',
            description: q.text,
            answer: q.answer,
            options: q.options,
          }))
        )
      })
      .catch(() => setQuizCards([]))
      .finally(() => setQuizLoading(false))
  }, [mode])

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
            description: q.text,
          }))
        )
      })
      .catch(() => {})
  }, [mode, neverSource])

  // Assemble final deck
  const deck = useMemo(() => {
    if (mode === 'trivia') return shuffleAndLimitQuestions(quizCards)
    if (mode === 'categories') return shuffleAndLimitQuestions(categoryCards)
    if (mode === 'never') {
      if (neverSource === 'app') return shuffleAndLimitQuestions(appNeverCards)
      if (neverSource === 'own') return shuffleAndLimitQuestions(customCards)
      if (neverSource === 'all') return shuffleAndLimitQuestions([...appNeverCards, ...customCards])
      return []
    }
    return []
  }, [mode, neverSource, appNeverCards, quizCards, categoryCards, customCards])

  // ── Pickers shown before the lobby ──────────────────────────────────────────

  if (mode === 'categories' && !selectedCategory) {
    return (
      <CategoryPicker
        onSelect={setSelectedCategory}
        onBack={() => router.push('/graj/host')}
        includeAllOption
        premiumCategoryIds={[ALL_CATEGORIES_ID, 'stats', 'alcohol']}
      />
    )
  }

  if (mode === 'never' && !neverSource) {
    return <NeverSourcePicker onSelect={setNeverSource} onBack={() => router.push('/graj/host')} />
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

  // ── Battle Royale: category selection then host screen ───────────────────────

  if (mode === 'battle-royale') {
    if (!brCategoryId) {
      return (
        <CategoryPicker
          onSelect={async (catId) => {
            setBrSetupLoading(true)
            try {
              const res = await fetch(`/api/sessions/${pin}/battle-royale/setup`, {
                method: 'POST',
                headers: hostJsonHeaders(pin),
                body: JSON.stringify({ categoryId: catId, timerDuration: brTimerSeconds }),
              })
              const data = await res.json()
              setBrQuestionOrder(Array.isArray(data.questionOrder) ? data.questionOrder : null)
              setBrRoundTimerDuration(
                typeof data.timerDuration === 'number' ? data.timerDuration : brTimerSeconds
              )
              setBrCategoryId(catId)
            } finally {
              setBrSetupLoading(false)
            }
          }}
          onBack={() => router.push('/graj/host')}
          loading={brSetupLoading}
        />
      )
    }
    return (
      <BattleRoyaleHost
        pin={pin}
        categoryId={brCategoryId}
        questionOrder={brQuestionOrder}
        timerDuration={brRoundTimerDuration}
      />
    )
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
    return (
      <HostHighLowScreen
        pin={pin}
        team1={hlTeam1}
        team2={hlTeam2}
        initialPlayers={[]}
        questionLimit={QUESTIONS_PER_GAME}
      />
    )
  }

  return <HostScreen pin={pin} initialCards={deck} gameMode={mode} />
}
