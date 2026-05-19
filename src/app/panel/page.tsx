'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Crown,
  KeyRound,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Send,
  Settings,
  SlidersHorizontal,
  Trash2,
  X,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { Suspense } from 'react'
import { useEffect, useRef, useState } from 'react'

import { getPasswordPolicyError } from '@/lib/password-policy'
import { REVEAL_COUNTDOWN_SECONDS, BR_TIMER_SECONDS, BR_AUTO_NEXT_SECONDS } from '@/lib/game-config'

interface Question {
  id: string
  text: string
  createdAt: string
}

interface QuizQuestion extends Question {
  answer: string
  options: string[]
}

const QUESTION_PAGE_SIZE = 10

type PanelTab = 'quiz' | 'never' | 'account' | 'settings'
type CheckoutState = 'success' | 'cancelled' | null
type PaymentStatusKind = 'checking' | 'active' | 'pending' | 'failed' | 'cancelled'
type PlanId = 'monthly' | 'lifetime'

interface PaymentStatus {
  kind: PaymentStatusKind
  subscriptionStatus?: string | null
  currentPeriodEnd?: string | null
}

interface AccountPayload {
  id: string
  email: string
  name: string | null
  createdAt: string
  updatedAt: string
  premium: {
    isPremium: boolean
    status: 'active' | 'pending' | 'failed' | 'free'
    plan: 'monthly' | 'lifetime' | 'free'
    subscriptionStatus: string | null
    currentPeriodEnd: string | null
    canManageBilling: boolean
  }
}

function formatAccountDate(value: string) {
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

function panelButtonHover(base: CSSProperties, hover: CSSProperties) {
  return {
    style: base,
    onMouseEnter: (event: MouseEvent<HTMLButtonElement>) => {
      if (!event.currentTarget.disabled) Object.assign(event.currentTarget.style, hover)
    },
    onMouseLeave: (event: MouseEvent<HTMLButtonElement>) => {
      Object.assign(event.currentTarget.style, base)
    },
  }
}

function PanelModal({
  title,
  hint,
  onClose,
  children,
}: {
  title: string
  hint?: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.18 }}
        className="max-h-[calc(100dvh-48px)] w-full max-w-2xl overflow-y-auto rounded-2xl border p-5 shadow-2xl"
        style={{
          borderColor: 'rgba(255,220,180,0.16)',
          backgroundColor: 'rgba(13,8,24,0.96)',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-text-primary text-sm font-black tracking-widest uppercase">
              {title}
            </p>
            {hint && <p className="text-text-muted mt-1 text-xs">{hint}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
            {...panelButtonHover(
              {
                borderColor: 'rgba(255,220,180,0.14)',
                color: 'rgba(255,220,180,0.7)',
                backgroundColor: 'rgba(255,220,180,0.05)',
              },
              {
                borderColor: 'rgba(255,220,180,0.26)',
                color: 'rgba(255,220,180,0.92)',
                backgroundColor: 'rgba(255,220,180,0.1)',
              }
            )}
            aria-label="Zamknij"
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}

function NeverTab() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [text, setText] = useState('')
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/questions/never')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setQuestions(Array.isArray(data) ? data : [])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleAdd = async () => {
    if (!text.trim()) return
    setAdding(true)
    setError(null)
    try {
      const res = await fetch('/api/questions/never', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      })
      if (!res.ok) throw new Error()
      const created = await res.json()
      setQuestions((prev) => [created, ...prev])
      setText('')
      setAddOpen(false)
    } catch {
      setError('Nie udało się dodać pytania.')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await fetch(`/api/questions/never/${id}`, { method: 'DELETE' })
      setQuestions((prev) => prev.filter((q) => q.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setError(null)
            setAddOpen(true)
          }}
          className="flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-xs font-bold tracking-widest uppercase"
          {...panelButtonHover(
            {
              borderColor: 'var(--neon-pink)',
              backgroundColor: 'rgba(255,16,240,0.1)',
              color: 'var(--neon-pink)',
            },
            {
              borderColor: 'var(--neon-pink)',
              backgroundColor: 'rgba(255,16,240,0.16)',
              color: 'var(--text-primary)',
            }
          )}
        >
          <Plus size={14} />
          Dodaj wyznanie
        </button>
      </div>

      <AnimatePresence>
        {addOpen && (
          <PanelModal
            title="Nowe wyznanie"
            hint="Dodaj wpis do swojej talii Nigdy przenigdy."
            onClose={() => {
              if (!adding) setAddOpen(false)
            }}
          >
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !adding && handleAdd()}
                maxLength={200}
                placeholder="Nigdy przenigdy nie..."
                className="bg-saloon-surface text-text-primary placeholder:text-text-muted w-full rounded-xl border-2 px-4 py-3 text-sm transition-colors focus:outline-none"
                style={{
                  borderColor: text.trim() ? 'var(--neon-pink)' : 'var(--saloon-border)',
                }}
              />
              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={!text.trim() || adding}
                onClick={handleAdd}
                className="flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-xs font-bold tracking-widest uppercase disabled:opacity-30"
                {...panelButtonHover(
                  {
                    borderColor: 'var(--neon-pink)',
                    backgroundColor: 'rgba(255,16,240,0.1)',
                    color: 'var(--neon-pink)',
                  },
                  {
                    borderColor: 'var(--neon-pink)',
                    backgroundColor: 'rgba(255,16,240,0.16)',
                    color: 'var(--text-primary)',
                  }
                )}
              >
                {adding ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                Dodaj wyznanie
              </motion.button>
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
          </PanelModal>
        )}
      </AnimatePresence>

      <QuestionList
        emptyText="Nie masz jeszcze żadnych własnych wyznań."
        label={`Twoje wyznania (${questions.length})`}
        loading={loading}
        loadingColor="var(--neon-pink)"
        deletingId={deletingId}
        questions={questions}
        onDelete={handleDelete}
      />
    </div>
  )
}

function QuizTab() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [text, setText] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState(0)
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/questions/quiz')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setQuestions(Array.isArray(data) ? data : [])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const updateOption = (idx: number, value: string) => {
    setOptions((prev) => prev.map((option, i) => (i === idx ? value : option)))
  }

  const removeOption = (idx: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== idx))
    setCorrectIndex((prev) => {
      if (prev === idx) return 0
      if (prev > idx) return prev - 1
      return prev
    })
  }

  const handleAdd = async () => {
    const cleanText = text.trim()
    const answer = options[correctIndex]?.trim() ?? ''
    const cleanOptions = options.map((option) => option.trim()).filter(Boolean)

    if (!cleanText) {
      setError('Wpisz pytanie.')
      return
    }
    if (cleanOptions.length < 2) {
      setError('Dodaj przynajmniej dwie odpowiedzi.')
      return
    }
    if (!answer) {
      setError('Zaznacz prawidłową odpowiedź.')
      return
    }

    setAdding(true)
    setError(null)
    try {
      const res = await fetch('/api/questions/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, answer, options: cleanOptions }),
      })
      if (!res.ok) throw new Error()
      const created = await res.json()
      setQuestions((prev) => [created, ...prev])
      setText('')
      setOptions(['', '', '', ''])
      setCorrectIndex(0)
      setAddOpen(false)
    } catch {
      setError('Nie udało się dodać pytania quizowego.')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await fetch(`/api/questions/quiz/${id}`, { method: 'DELETE' })
      setQuestions((prev) => prev.filter((q) => q.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setError(null)
            setAddOpen(true)
          }}
          className="flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-xs font-bold tracking-widest uppercase"
          {...panelButtonHover(
            {
              borderColor: 'var(--neon-pink)',
              backgroundColor: 'rgba(255,16,240,0.1)',
              color: 'var(--neon-pink)',
            },
            {
              borderColor: 'var(--neon-pink)',
              backgroundColor: 'rgba(255,16,240,0.16)',
              color: 'var(--text-primary)',
            }
          )}
        >
          <Plus size={14} />
          Dodaj pytanie
        </button>
      </div>

      <AnimatePresence>
        {addOpen && (
          <PanelModal
            title="Nowe pytanie quizowe"
            hint="Zaznacz poprawną odpowiedź przed zapisaniem pytania."
            onClose={() => {
              if (!adding) setAddOpen(false)
            }}
          >
            <div className="flex flex-col gap-4">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={240}
                placeholder="Np. Gdzie Panna Młoda poznała przyszłego męża?"
                className="bg-saloon-surface text-text-primary placeholder:text-text-muted min-h-[96px] w-full resize-none rounded-xl border-2 px-4 py-3 text-sm leading-snug transition-colors focus:outline-none"
                style={{
                  borderColor: text.trim() ? 'var(--neon-pink)' : 'var(--saloon-border)',
                }}
              />

              <div className="flex flex-col gap-2">
                {options.map((option, idx) => {
                  const active = correctIndex === idx
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCorrectIndex(idx)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 transition-colors"
                        {...panelButtonHover(
                          {
                            borderColor: active ? 'var(--sheriff-pink)' : 'var(--saloon-border)',
                            backgroundColor: active ? 'rgba(255,215,0,0.1)' : 'rgba(13,8,24,0.4)',
                            color: active ? 'var(--sheriff-pink)' : 'var(--text-muted)',
                          },
                          {
                            borderColor: active ? 'var(--sheriff-pink)' : 'rgba(255,220,180,0.32)',
                            backgroundColor: active
                              ? 'rgba(255,215,0,0.16)'
                              : 'rgba(255,220,180,0.08)',
                            color: active ? 'var(--sheriff-pink)' : 'var(--text-primary)',
                          }
                        )}
                        title="Prawidłowa odpowiedź"
                      >
                        {active ? <CheckCircle2 size={17} /> : String.fromCharCode(65 + idx)}
                      </button>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(idx, e.target.value)}
                        maxLength={90}
                        placeholder={`Odpowiedź ${String.fromCharCode(65 + idx)}`}
                        className="bg-saloon-surface text-text-primary placeholder:text-text-muted min-w-0 flex-1 rounded-xl border-2 px-4 py-2.5 text-sm transition-colors focus:outline-none"
                        style={{
                          borderColor:
                            active && option.trim()
                              ? 'var(--sheriff-pink)'
                              : 'var(--saloon-border)',
                        }}
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(idx)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                          {...panelButtonHover(
                            {
                              borderColor: 'rgba(239,68,68,0.2)',
                              backgroundColor: 'rgba(239,68,68,0.08)',
                              color: '#f87171',
                            },
                            {
                              borderColor: 'rgba(239,68,68,0.38)',
                              backgroundColor: 'rgba(239,68,68,0.14)',
                              color: '#fecaca',
                            }
                          )}
                          title="Usuń odpowiedź"
                        >
                          <X size={15} />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  disabled={options.length >= 6}
                  onClick={() => setOptions((prev) => [...prev, ''])}
                  className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold tracking-widest uppercase disabled:opacity-30"
                  {...panelButtonHover(
                    {
                      borderColor: 'rgba(255,220,180,0.15)',
                      color: 'rgba(255,220,180,0.7)',
                      backgroundColor: 'transparent',
                    },
                    {
                      borderColor: 'rgba(255,220,180,0.28)',
                      color: 'rgba(255,220,180,0.92)',
                      backgroundColor: 'rgba(255,220,180,0.07)',
                    }
                  )}
                >
                  <Plus size={14} />
                  Odpowiedź
                </button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  disabled={adding}
                  onClick={handleAdd}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-xs font-bold tracking-widest uppercase disabled:opacity-30"
                  {...panelButtonHover(
                    {
                      borderColor: 'var(--neon-pink)',
                      backgroundColor: 'rgba(255,16,240,0.12)',
                      color: 'var(--neon-pink)',
                    },
                    {
                      borderColor: 'var(--neon-pink)',
                      backgroundColor: 'rgba(255,16,240,0.18)',
                      color: 'var(--text-primary)',
                    }
                  )}
                >
                  {adding ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  Dodaj pytanie
                </motion.button>
              </div>
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
          </PanelModal>
        )}
      </AnimatePresence>

      <QuestionList
        emptyText="Nie masz jeszcze pytań do quizu. Dodaj kilka przed uruchomieniem gry."
        label={`Twoje pytania quizowe (${questions.length})`}
        loading={loading}
        loadingColor="var(--neon-pink)"
        deletingId={deletingId}
        questions={questions}
        onDelete={handleDelete}
        renderDetails={(q) => (
          <div className="mt-2 flex flex-col gap-1.5">
            {q.options.map((option, idx) => (
              <span
                key={`${q.id}-${idx}`}
                className="rounded-lg border px-3 py-1.5 text-xs"
                style={{
                  borderColor:
                    option === q.answer ? 'rgba(255,215,0,0.35)' : 'rgba(255,220,180,0.08)',
                  color: option === q.answer ? 'var(--sheriff-pink)' : 'var(--text-muted)',
                  backgroundColor: option === q.answer ? 'rgba(255,215,0,0.08)' : 'transparent',
                }}
              >
                {String.fromCharCode(65 + idx)}. {option}
              </span>
            ))}
          </div>
        )}
      />
    </div>
  )
}

function QuestionList<T extends Question>({
  emptyText,
  label,
  loading,
  loadingColor,
  deletingId,
  questions,
  onDelete,
  renderDetails,
}: {
  emptyText: string
  label: string
  loading: boolean
  loadingColor: string
  deletingId: string | null
  questions: T[]
  onDelete: (id: string) => void
  renderDetails?: (question: T) => ReactNode
}) {
  const [page, setPage] = useState(1)
  const previousQuestionCountRef = useRef(questions.length)
  const pageCount = Math.max(1, Math.ceil(questions.length / QUESTION_PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const startIndex = (currentPage - 1) * QUESTION_PAGE_SIZE
  const pageQuestions = questions.slice(startIndex, startIndex + QUESTION_PAGE_SIZE)

  useEffect(() => {
    const previousQuestionCount = previousQuestionCountRef.current
    previousQuestionCountRef.current = questions.length

    if (questions.length > previousQuestionCount) {
      setPage(1)
      return
    }

    setPage((prev) => Math.min(prev, pageCount))
  }, [pageCount, questions.length])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin" style={{ color: loadingColor }} />
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-3 py-16 text-center"
      >
        <span className="text-5xl">?</span>
        <p className="text-text-muted text-sm">
          {emptyText}
          <br />
          Dodaj pierwsze powyżej.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-text-muted text-xs font-semibold tracking-widest uppercase">{label}</p>
        {pageCount > 1 && (
          <p className="text-text-muted text-xs tabular-nums">
            {startIndex + 1}-{startIndex + pageQuestions.length} z {questions.length}
          </p>
        )}
      </div>
      <AnimatePresence initial={false}>
        {pageQuestions.map((q) => (
          <motion.div
            key={q.id}
            layout
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="group rounded-xl border px-4 py-3.5"
            style={{
              borderColor: 'rgba(255,220,180,0.1)',
              backgroundColor: 'rgba(13,8,24,0.4)',
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-text-primary flex-1 text-sm leading-snug">{q.text}</span>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(q.id)}
                disabled={deletingId === q.id}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
                {...panelButtonHover(
                  {
                    backgroundColor: 'rgba(239,68,68,0.1)',
                    color: '#f87171',
                    border: '1px solid rgba(239,68,68,0.2)',
                  },
                  {
                    backgroundColor: 'rgba(239,68,68,0.16)',
                    color: '#fecaca',
                    border: '1px solid rgba(239,68,68,0.38)',
                  }
                )}
              >
                {deletingId === q.id ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Trash2 size={13} />
                )}
              </motion.button>
            </div>
            {renderDetails?.(q)}
          </motion.div>
        ))}
      </AnimatePresence>
      {pageCount > 1 && (
        <div className="mt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-30"
            {...panelButtonHover(
              {
                borderColor: 'rgba(255,220,180,0.14)',
                color: 'rgba(255,220,180,0.72)',
                backgroundColor: 'rgba(13,8,24,0.35)',
              },
              {
                borderColor: 'rgba(255,220,180,0.3)',
                color: 'rgba(255,220,180,0.95)',
                backgroundColor: 'rgba(255,220,180,0.08)',
              }
            )}
            aria-label="Poprzednia strona"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-text-muted text-xs font-semibold tracking-widest uppercase tabular-nums">
            Strona {currentPage} / {pageCount}
          </span>

          <button
            type="button"
            disabled={currentPage === pageCount}
            onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-lg border disabled:opacity-30"
            {...panelButtonHover(
              {
                borderColor: 'rgba(255,220,180,0.14)',
                color: 'rgba(255,220,180,0.72)',
                backgroundColor: 'rgba(13,8,24,0.35)',
              },
              {
                borderColor: 'rgba(255,220,180,0.3)',
                color: 'rgba(255,220,180,0.95)',
                backgroundColor: 'rgba(255,220,180,0.08)',
              }
            )}
            aria-label="Następna strona"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

function AccountTab() {
  const { update } = useSession()
  const [account, setAccount] = useState<AccountPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMessage, setProfileMessage] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [checkoutPlan, setCheckoutPlan] = useState<PlanId | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [billingError, setBillingError] = useState<string | null>(null)

  const loadAccount = async () => {
    setLoading(true)
    setBillingError(null)
    try {
      const response = await fetch('/api/account', { cache: 'no-store' })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(payload.error ?? 'Nie udało się pobrać konta.')
      setAccount(payload)
      setName(payload.name ?? '')
    } catch (error) {
      setBillingError(error instanceof Error ? error.message : 'Nie udało się pobrać konta.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    fetch('/api/account', { cache: 'no-store' })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error(payload.error ?? 'Nie udało się pobrać konta.')
        return payload as AccountPayload
      })
      .then((payload) => {
        if (cancelled) return
        setAccount(payload)
        setName(payload.name ?? '')
      })
      .catch((error) => {
        if (!cancelled) {
          setBillingError(error instanceof Error ? error.message : 'Nie udało się pobrać konta.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const saveProfile = async () => {
    if (!name.trim() || profileSaving) return
    setProfileSaving(true)
    setProfileMessage(null)
    setProfileError(null)
    try {
      const response = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(payload.error ?? 'Nie udało się zapisać danych.')
      setAccount((prev) =>
        prev ? { ...prev, name: payload.name, updatedAt: payload.updatedAt } : prev
      )
      setProfileMessage('Dane konta zapisane.')
      await update()
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Nie udało się zapisać danych.')
    } finally {
      setProfileSaving(false)
    }
  }

  const changePassword = async () => {
    if (!currentPassword || !newPassword || passwordSaving) return
    const passwordError = getPasswordPolicyError(newPassword)
    if (passwordError) {
      setPasswordMessage(null)
      setPasswordError(passwordError)
      return
    }

    setPasswordSaving(true)
    setPasswordMessage(null)
    setPasswordError(null)
    try {
      const response = await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(payload.error ?? 'Nie udało się zmienić hasła.')
      setCurrentPassword('')
      setNewPassword('')
      setPasswordMessage('Hasło zostało zmienione.')
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'Nie udało się zmienić hasła.')
    } finally {
      setPasswordSaving(false)
    }
  }

  const startCheckout = async (plan: PlanId) => {
    setCheckoutPlan(plan)
    setBillingError(null)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? 'Nie udało się rozpocząć płatności.')
      }
      window.location.assign(payload.url)
    } catch (error) {
      setBillingError(error instanceof Error ? error.message : 'Nie udało się rozpocząć płatności.')
      setCheckoutPlan(null)
    }
  }

  const openBillingPortal = async () => {
    setPortalLoading(true)
    setBillingError(null)
    try {
      const response = await fetch('/api/stripe/portal', { method: 'POST' })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok || !payload.url) {
        throw new Error(payload.error ?? 'Nie udało się otworzyć panelu Stripe.')
      }
      window.location.assign(payload.url)
    } catch (error) {
      setBillingError(
        error instanceof Error ? error.message : 'Nie udało się otworzyć panelu Stripe.'
      )
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--neon-pink)' }} />
      </div>
    )
  }

  const premium = account?.premium
  const isPremium = premium?.isPremium ?? false
  const isLifetime = premium?.plan === 'lifetime'
  const isMonthly = premium?.plan === 'monthly'
  const statusLabel = isPremium
    ? isLifetime
      ? 'PRO dożywotnio'
      : 'PRO aktywne'
    : premium?.status === 'pending'
      ? 'Oczekuje na Stripe'
      : premium?.status === 'failed'
        ? 'Wymaga uwagi'
        : 'Plan darmowy'

  return (
    <div className="flex flex-col gap-6">
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: isPremium ? 'rgba(255,215,0,0.35)' : 'rgba(255,16,240,0.18)',
          backgroundColor: 'rgba(13,8,24,0.5)',
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border"
              style={{
                borderColor: isPremium ? 'rgba(255,215,0,0.4)' : 'rgba(255,16,240,0.35)',
                color: isPremium ? 'var(--sheriff-pink)' : 'var(--neon-pink)',
                backgroundColor: 'rgba(13,8,24,0.35)',
              }}
            >
              <Crown size={24} />
            </div>
            <div>
              <p className="text-text-primary text-base font-black">{statusLabel}</p>
              <p className="text-text-muted mt-1 text-sm leading-snug">
                {isPremium
                  ? 'Dostęp premium jest przypisany do tego konta.'
                  : 'Możesz kupić dostęp PRO albo wrócić do płatności później.'}
              </p>
              {premium?.subscriptionStatus && (
                <p className="mt-2 text-xs font-semibold tracking-widest text-white/45 uppercase">
                  Status subskrypcji: {premium.subscriptionStatus}
                </p>
              )}
              {premium?.currentPeriodEnd && isMonthly && (
                <p className="text-text-muted mt-1 text-xs">
                  Okres rozliczeniowy do {formatAccountDate(premium.currentPeriodEnd)}.
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={loadAccount}
            className="flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold tracking-widest uppercase"
            {...panelButtonHover(
              {
                borderColor: 'rgba(255,220,180,0.15)',
                color: 'rgba(255,220,180,0.7)',
                backgroundColor: 'transparent',
              },
              {
                borderColor: 'rgba(255,220,180,0.28)',
                color: 'rgba(255,220,180,0.92)',
                backgroundColor: 'rgba(255,220,180,0.07)',
              }
            )}
          >
            <RefreshCw size={13} />
            Odśwież
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            disabled={checkoutPlan !== null || isLifetime}
            onClick={() => startCheckout('monthly')}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-black tracking-widest uppercase disabled:opacity-35"
            {...panelButtonHover(
              {
                borderColor: 'rgba(255,215,0,0.38)',
                backgroundColor: 'rgba(255,215,0,0.08)',
                color: 'var(--sheriff-pink)',
              },
              {
                borderColor: 'rgba(255,215,0,0.52)',
                backgroundColor: 'rgba(255,215,0,0.14)',
                color: '#fde68a',
              }
            )}
          >
            {checkoutPlan === 'monthly' ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <CreditCard size={15} />
            )}
            Kup miesięczny
          </button>
          <button
            type="button"
            disabled={checkoutPlan !== null || isLifetime}
            onClick={() => startCheckout('lifetime')}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-black tracking-widest uppercase disabled:opacity-35"
            {...panelButtonHover(
              {
                borderColor: 'rgba(255,16,240,0.35)',
                backgroundColor: 'rgba(255,16,240,0.08)',
                color: 'var(--neon-pink)',
              },
              {
                borderColor: 'rgba(255,16,240,0.5)',
                backgroundColor: 'rgba(255,16,240,0.14)',
                color: 'var(--text-primary)',
              }
            )}
          >
            {checkoutPlan === 'lifetime' ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Crown size={15} />
            )}
            Kup dożywotni
          </button>
          <button
            type="button"
            disabled={portalLoading || !premium?.canManageBilling}
            onClick={openBillingPortal}
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-black tracking-widest uppercase disabled:opacity-35"
            {...panelButtonHover(
              {
                borderColor: 'rgba(255,220,180,0.18)',
                color: 'rgba(255,220,180,0.82)',
                backgroundColor: 'transparent',
              },
              {
                borderColor: 'rgba(255,220,180,0.3)',
                color: 'rgba(255,220,180,0.96)',
                backgroundColor: 'rgba(255,220,180,0.07)',
              }
            )}
          >
            {portalLoading ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Settings size={15} />
            )}
            Zarządzaj Subskrypcją
          </button>
        </div>

        {billingError && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {billingError}
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div
          className="rounded-2xl border p-5"
          style={{
            borderColor: 'rgba(255,220,180,0.12)',
            backgroundColor: 'rgba(13,8,24,0.45)',
          }}
        >
          <div className="mb-4 flex items-center gap-2">
            <Settings size={16} style={{ color: 'var(--neon-pink)' }} />
            <p className="text-text-primary text-sm font-black">Dane konta</p>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-text-muted text-xs font-semibold tracking-widest uppercase">
              Email
            </label>
            <input
              value={account?.email ?? ''}
              disabled
              className="bg-saloon-surface text-text-muted rounded-xl border px-4 py-3 text-sm"
              style={{ borderColor: 'rgba(255,220,180,0.12)' }}
            />
            <label className="text-text-muted text-xs font-semibold tracking-widest uppercase">
              Nazwa
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={40}
              className="bg-saloon-surface text-text-primary placeholder:text-text-muted rounded-xl border-2 px-4 py-3 text-sm transition-colors focus:outline-none"
              style={{ borderColor: name.trim() ? 'var(--neon-pink)' : 'var(--saloon-border)' }}
            />
            <button
              type="button"
              disabled={!name.trim() || profileSaving}
              onClick={saveProfile}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-xs font-black tracking-widest uppercase disabled:opacity-35"
              {...panelButtonHover(
                {
                  borderColor: 'var(--neon-pink)',
                  backgroundColor: 'rgba(255,16,240,0.1)',
                  color: 'var(--neon-pink)',
                },
                {
                  borderColor: 'var(--neon-pink)',
                  backgroundColor: 'rgba(255,16,240,0.16)',
                  color: 'var(--text-primary)',
                }
              )}
            >
              {profileSaving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              Zapisz dane
            </button>
            {profileMessage && <p className="text-xs text-emerald-300">{profileMessage}</p>}
            {profileError && <p className="text-xs text-red-300">{profileError}</p>}
          </div>
        </div>

        <div
          className="rounded-2xl border p-5"
          style={{
            borderColor: 'rgba(255,220,180,0.12)',
            backgroundColor: 'rgba(13,8,24,0.45)',
          }}
        >
          <div className="mb-4 flex items-center gap-2">
            <KeyRound size={16} style={{ color: 'var(--sheriff-pink)' }} />
            <p className="text-text-primary text-sm font-black">Zmiana hasła</p>
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Obecne hasło"
              className="bg-saloon-surface text-text-primary placeholder:text-text-muted rounded-xl border-2 px-4 py-3 text-sm transition-colors focus:outline-none"
              style={{
                borderColor: currentPassword ? 'var(--sheriff-pink)' : 'var(--saloon-border)',
              }}
            />
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Nowe haslo: min. 10, Aa1!"
              className="bg-saloon-surface text-text-primary placeholder:text-text-muted rounded-xl border-2 px-4 py-3 text-sm transition-colors focus:outline-none"
              style={{ borderColor: newPassword ? 'var(--sheriff-pink)' : 'var(--saloon-border)' }}
            />
            <button
              type="button"
              disabled={!currentPassword || !newPassword || passwordSaving}
              onClick={changePassword}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-xs font-black tracking-widest uppercase disabled:opacity-35"
              {...panelButtonHover(
                {
                  borderColor: 'var(--sheriff-pink)',
                  backgroundColor: 'rgba(255,215,0,0.08)',
                  color: 'var(--sheriff-pink)',
                },
                {
                  borderColor: 'var(--sheriff-pink)',
                  backgroundColor: 'rgba(255,215,0,0.14)',
                  color: '#fde68a',
                }
              )}
            >
              {passwordSaving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <KeyRound size={15} />
              )}
              Zmień hasło
            </button>
            {passwordMessage && <p className="text-xs text-emerald-300">{passwordMessage}</p>}
            {passwordError && <p className="text-xs text-red-300">{passwordError}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

function PaymentStatusBanner({ checkoutState }: { checkoutState: CheckoutState }) {
  const router = useRouter()
  const { update } = useSession()
  const sessionUpdatedRef = useRef(false)
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(() => ({
    kind: checkoutState === 'cancelled' ? 'cancelled' : 'checking',
  }))

  useEffect(() => {
    if (checkoutState !== 'success') return

    let cancelled = false
    let attempts = 0
    let timer: ReturnType<typeof setInterval> | null = null

    const checkStatus = async () => {
      attempts += 1

      try {
        const response = await fetch('/api/stripe/status', { cache: 'no-store' })
        const payload = await response.json().catch(() => ({}))

        if (cancelled) return

        if (!response.ok) {
          setPaymentStatus({ kind: attempts >= 10 ? 'failed' : 'pending' })
          return
        }

        if (payload.status === 'active') {
          setPaymentStatus({
            kind: 'active',
            subscriptionStatus: payload.subscriptionStatus,
            currentPeriodEnd: payload.currentPeriodEnd,
          })
          if (timer) clearInterval(timer)
          return
        }

        if (payload.status === 'failed') {
          setPaymentStatus({
            kind: 'failed',
            subscriptionStatus: payload.subscriptionStatus,
          })
          if (timer) clearInterval(timer)
          return
        }

        setPaymentStatus({
          kind: attempts >= 15 ? 'pending' : 'checking',
          subscriptionStatus: payload.subscriptionStatus,
        })

        if (attempts >= 15 && timer) clearInterval(timer)
      } catch {
        if (!cancelled) setPaymentStatus({ kind: attempts >= 10 ? 'failed' : 'pending' })
      }
    }

    void checkStatus()
    timer = setInterval(checkStatus, 2000)

    return () => {
      cancelled = true
      if (timer) clearInterval(timer)
    }
  }, [checkoutState])

  useEffect(() => {
    if (paymentStatus.kind !== 'active' || sessionUpdatedRef.current) return
    sessionUpdatedRef.current = true
    void update()
  }, [paymentStatus.kind, update])

  if (!checkoutState) return null

  const clearCheckoutState = () => router.replace('/panel', { scroll: false })
  const isActive = paymentStatus.kind === 'active'
  const isCancelled = paymentStatus.kind === 'cancelled'
  const isFailed = paymentStatus.kind === 'failed'
  const isWaiting = paymentStatus.kind === 'checking' || paymentStatus.kind === 'pending'

  const icon = isActive ? (
    <Crown size={24} />
  ) : isCancelled || isFailed ? (
    <AlertCircle size={24} />
  ) : (
    <Loader2 size={24} className="animate-spin" />
  )

  const title = isActive
    ? 'PRO jest aktywne'
    : isCancelled
      ? 'Płatność anulowana'
      : isFailed
        ? 'Nie udało się potwierdzić płatności'
        : 'Czekamy na potwierdzenie Stripe'

  const description = isActive
    ? 'Webhook Stripe został obsłużony, a dostęp premium jest już przypisany do Twojego konta.'
    : isCancelled
      ? 'Checkout został przerwany. Możesz wrócić do wyboru planu, kiedy będziesz gotowa.'
      : isFailed
        ? 'Nie widzimy aktywnego dostępu PRO. Jeśli płatność została pobrana, sprawdź log webhooka Stripe.'
        : 'Płatność wróciła ze Stripe. Dostęp pojawi się automatycznie, gdy webhook zapisze status w bazie.'

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-5"
      style={{
        borderColor: isActive
          ? 'rgba(255,215,0,0.45)'
          : isFailed || isCancelled
            ? 'rgba(239,68,68,0.35)'
            : 'rgba(255,16,240,0.28)',
        backgroundColor: isActive
          ? 'rgba(255,215,0,0.08)'
          : isFailed || isCancelled
            ? 'rgba(239,68,68,0.08)'
            : 'rgba(255,16,240,0.08)',
      }}
      aria-live="polite"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border"
            style={{
              borderColor: isActive
                ? 'rgba(255,215,0,0.4)'
                : isFailed || isCancelled
                  ? 'rgba(239,68,68,0.3)'
                  : 'rgba(255,16,240,0.35)',
              color: isActive
                ? 'var(--sheriff-pink)'
                : isFailed || isCancelled
                  ? '#f87171'
                  : 'var(--neon-pink)',
              backgroundColor: 'rgba(13,8,24,0.35)',
            }}
          >
            {icon}
          </div>
          <div>
            <p className="text-text-primary text-base font-black">{title}</p>
            <p className="text-text-muted mt-1 max-w-xl text-sm leading-snug">{description}</p>
            {paymentStatus.subscriptionStatus && (
              <p className="mt-2 text-xs font-semibold tracking-widest text-white/45 uppercase">
                Stripe: {paymentStatus.subscriptionStatus}
              </p>
            )}
            {isWaiting && paymentStatus.kind === 'pending' && (
              <p className="mt-2 text-xs text-yellow-200/80">
                To może potrwać kilka sekund. Nie musisz ponownie płacić.
              </p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={clearCheckoutState}
          className="rounded-xl border px-4 py-2 text-xs font-bold tracking-widest uppercase"
          {...panelButtonHover(
            {
              borderColor: 'rgba(255,220,180,0.15)',
              color: 'rgba(255,220,180,0.7)',
              backgroundColor: 'transparent',
            },
            {
              borderColor: 'rgba(255,220,180,0.28)',
              color: 'rgba(255,220,180,0.92)',
              backgroundColor: 'rgba(255,220,180,0.07)',
            }
          )}
        >
          Zamknij
        </button>
      </div>
    </motion.div>
  )
}

const SETTING_LIMITS = {
  revealCountdownSeconds: { min: 2, max: 15, step: 1 },
  brTimerSeconds: { min: 5, max: 60, step: 5 },
  brAutoNextSeconds: { min: 3, max: 30, step: 1 },
}

type GameSettingsValues = {
  revealCountdownSeconds: number
  brTimerSeconds: number
  brAutoNextSeconds: number
}

const DEFAULT_GAME_SETTINGS: GameSettingsValues = {
  revealCountdownSeconds: REVEAL_COUNTDOWN_SECONDS,
  brTimerSeconds: BR_TIMER_SECONDS,
  brAutoNextSeconds: BR_AUTO_NEXT_SECONDS,
}

let gameSettingsCache: GameSettingsValues | null = null

function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-6 py-1" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-1 flex-col gap-2">
              <div className="h-3 w-36 rounded-full bg-white/10" />
              <div className="h-3 w-full max-w-md rounded-full bg-white/5" />
            </div>
            <div className="h-7 w-14 rounded-lg bg-white/10" />
          </div>
          <div className="h-1 w-full rounded-full bg-white/10" />
          <div className="flex justify-between">
            <div className="h-3 w-7 rounded-full bg-white/5" />
            <div className="h-3 w-7 rounded-full bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

function GameSettingsTab() {
  const [values, setValues] = useState<GameSettingsValues>(
    () => gameSettingsCache ?? DEFAULT_GAME_SETTINGS
  )
  const [loading, setLoading] = useState(() => gameSettingsCache === null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    if (gameSettingsCache) {
      setLoading(false)
      return
    }

    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        const nextValues = {
          revealCountdownSeconds: data.revealCountdownSeconds,
          brTimerSeconds: data.brTimerSeconds,
          brAutoNextSeconds: data.brAutoNextSeconds,
        }
        gameSettingsCache = nextValues
        setValues(nextValues)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error()
      gameSettingsCache = values
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch {
      setError('Nie udało się zapisać ustawień.')
    } finally {
      setSaving(false)
    }
  }

  const fields: Array<{
    key: keyof typeof values
    label: string
    description: string
    color: string
  }> = [
    {
      key: 'revealCountdownSeconds',
      label: 'Przerwa między rundami',
      description:
        'Sekund odliczania po odsłonięciu wyników, zanim pojawi się następna karta (tryb standardowy)',
      color: 'var(--neon-pink)',
    },
    {
      key: 'brTimerSeconds',
      label: 'Czas na odpowiedź — Battle Royale',
      description: 'Sekund na odpowiedź w każdej rundzie Battle Royale',
      color: 'var(--sheriff-pink)',
    },
    {
      key: 'brAutoNextSeconds',
      label: 'Przerwa po rewolacji — Battle Royale',
      description: 'Sekund po pokazaniu wyników rundy, zanim automatycznie startuje kolejna',
      color: '#a78bfa',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div
        className="rounded-2xl border p-5"
        style={{ borderColor: 'rgba(255,220,180,0.12)', backgroundColor: 'rgba(13,8,24,0.5)' }}
      >
        <p
          className="mb-1 text-xs font-semibold tracking-widest uppercase"
          style={{ color: '#34d399' }}
        >
          Ustawienia gier
        </p>
        <p className="text-text-muted mb-6 text-xs">
          Globalne domyślne wartości dla wszystkich Twoich gier. Zmiany obowiązują od następnej
          sesji.
        </p>

        {loading ? (
          <div className="block py-1">
            <SettingsSkeleton />
            <span className="sr-only">Ładowanie ustawień</span>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {fields.map((f) => {
              const limits = SETTING_LIMITS[f.key]
              const value = values[f.key]
              const pct = ((value - limits.min) / (limits.max - limits.min)) * 100
              return (
                <div key={f.key} className="flex flex-col gap-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold tracking-wide" style={{ color: f.color }}>
                        {f.label}
                      </p>
                      <p className="text-text-muted mt-0.5 text-xs">{f.description}</p>
                    </div>
                    <span
                      className="shrink-0 rounded-lg px-3 py-1 text-sm font-bold tabular-nums"
                      style={{ backgroundColor: 'rgba(255,220,180,0.08)', color: f.color }}
                    >
                      {value}s
                    </span>
                  </div>
                  <div className="relative pt-1">
                    <input
                      type="range"
                      min={limits.min}
                      max={limits.max}
                      step={limits.step}
                      value={value}
                      onChange={(e) =>
                        setValues((prev) => ({ ...prev, [f.key]: Number(e.target.value) }))
                      }
                      className="w-full cursor-pointer appearance-none rounded-full"
                      style={{
                        height: '4px',
                        background: `linear-gradient(to right, ${f.color} ${pct}%, rgba(255,220,180,0.12) ${pct}%)`,
                        accentColor: f.color,
                      }}
                    />
                    <div className="mt-1 flex justify-between">
                      <span className="text-text-muted text-xs">{limits.min}s</span>
                      <span className="text-text-muted text-xs">{limits.max}s</span>
                    </div>
                  </div>
                </div>
              )
            })}

            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors disabled:opacity-50"
                {...panelButtonHover(
                  {
                    borderColor: '#34d399',
                    color: '#34d399',
                    backgroundColor: 'transparent',
                  },
                  {
                    borderColor: '#34d399',
                    color: '#d1fae5',
                    backgroundColor: 'rgba(52,211,153,0.1)',
                  }
                )}
              >
                {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                {saving ? 'Zapisywanie…' : 'Zapisz'}
              </button>
              {saved && (
                <span
                  className="flex items-center gap-1.5 text-xs font-semibold"
                  style={{ color: '#34d399' }}
                >
                  <CheckCircle2 size={13} />
                  Zapisano
                </span>
              )}
              {error && (
                <span className="flex items-center gap-1.5 text-xs" style={{ color: '#f87171' }}>
                  <AlertCircle size={13} />
                  {error}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PanelContent() {
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<PanelTab>('quiz')
  const [visitedTabs, setVisitedTabs] = useState<PanelTab[]>(['quiz'])
  const checkoutState = ['success', 'cancelled'].includes(searchParams.get('checkout') ?? '')
    ? (searchParams.get('checkout') as CheckoutState)
    : null
  const openTab = (tab: PanelTab) => {
    setActiveTab(tab)
    setVisitedTabs((prev) => (prev.includes(tab) ? prev : [...prev, tab]))
  }

  const tabs: Array<{
    id: PanelTab
    label: string
    description: string
    icon: typeof Brain
    color: string
  }> = [
    {
      id: 'quiz',
      label: 'Quiz o Pannie Młodej',
      description: 'własne pytania z odpowiedziami',
      icon: Brain,
      color: 'var(--neon-pink)',
    },
    {
      id: 'never',
      label: 'Nigdy przenigdy',
      description: 'własne wyznania dokładane do talii',
      icon: BookOpen,
      color: 'var(--sheriff-pink)',
    },
    {
      id: 'account',
      label: 'Konto i PRO',
      description: 'subskrypcja, dane i hasło',
      icon: Settings,
      color: '#a78bfa',
    },
    {
      id: 'settings',
      label: 'Ustawienia gier',
      description: 'czasy, timery i globalne wartości',
      icon: SlidersHorizontal,
      color: '#34d399',
    },
  ]

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <div
        className="relative z-10 shrink-0 border-b"
        style={{ borderColor: 'rgba(255,220,180,0.1)' }}
      >
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <h1
            className="shimmer-text text-xl tracking-widest"
            style={{ fontFamily: 'var(--font-app)' }}
          >
            Panel szeryfa
          </h1>
          <div className="flex items-center gap-3">
            {session?.user?.name && (
              <span className="text-text-muted hidden text-xs sm:block">{session.user.name}</span>
            )}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors"
              {...panelButtonHover(
                {
                  borderColor: 'rgba(255,220,180,0.15)',
                  color: 'rgba(255,220,180,0.55)',
                  backgroundColor: 'transparent',
                },
                {
                  borderColor: 'rgba(239,68,68,0.35)',
                  color: '#fca5a5',
                  backgroundColor: 'rgba(239,68,68,0.08)',
                }
              )}
            >
              <LogOut size={12} />
              Wyloguj
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-6 py-8">
        <PaymentStatusBanner checkoutState={checkoutState} />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tabs.map((tab) => {
            const active = activeTab === tab.id
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => openTab(tab.id)}
                className="flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-colors"
                {...panelButtonHover(
                  {
                    backgroundColor: active ? 'rgba(255,16,240,0.1)' : 'rgba(13,8,24,0.35)',
                    borderColor: active ? tab.color : 'rgba(255,220,180,0.12)',
                  },
                  {
                    backgroundColor: active ? 'rgba(255,16,240,0.14)' : 'rgba(255,220,180,0.07)',
                    borderColor: active ? tab.color : 'rgba(255,220,180,0.24)',
                  }
                )}
              >
                <Icon size={17} style={{ color: tab.color }} />
                <span className="min-w-0">
                  <span className="text-text-primary block text-xs font-bold tracking-widest uppercase">
                    {tab.label}
                  </span>
                  <span className="text-text-muted block text-xs">{tab.description}</span>
                </span>
              </button>
            )
          })}
        </div>

        {visitedTabs.includes('quiz') && (
          <div className={activeTab === 'quiz' ? 'block' : 'hidden'}>
            <QuizTab />
          </div>
        )}
        {visitedTabs.includes('never') && (
          <div className={activeTab === 'never' ? 'block' : 'hidden'}>
            <NeverTab />
          </div>
        )}
        {visitedTabs.includes('account') && (
          <div className={activeTab === 'account' ? 'block' : 'hidden'}>
            <AccountTab />
          </div>
        )}
        {visitedTabs.includes('settings') && (
          <div className={activeTab === 'settings' ? 'block' : 'hidden'}>
            <GameSettingsTab />
          </div>
        )}
      </div>
    </div>
  )
}

export default function PanelPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh w-full items-center justify-center">
          <Loader2 size={26} className="animate-spin" style={{ color: 'var(--neon-pink)' }} />
        </div>
      }
    >
      <PanelContent />
    </Suspense>
  )
}
