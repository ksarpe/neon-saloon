'use client'

import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Lock,
  Plus,
  Send,
  Trash2,
  X,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { ProModal } from '@/components/ui/ContentGate'
import { getQuestionQuota } from '@/config/usage-limits'
import { useContentAccess } from '@/hooks/useContentAccess'
import { checkAccess } from '@/lib/content-access'

import { PanelModal } from './PanelModal'
import { panelButtonHover, type Question, QUESTION_PAGE_SIZE, type QuizQuestion } from './shared'

export function NeverTab() {
  const access = useContentAccess()
  const hasPremium = checkAccess({ type: 'premium' }, access).granted
  const questionLimit = getQuestionQuota('never', hasPremium)
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionCount, setQuestionCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [proModalOpen, setProModalOpen] = useState(false)
  const [text, setText] = useState('')
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/questions/never')
      .then(async (res) => {
        const data = await res.json()
        if (!cancelled) {
          setQuestions(Array.isArray(data) ? data : [])
          setQuestionCount(readQuestionCountHeader(res, Array.isArray(data) ? data.length : 0))
        }
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
    if (!hasPremium) {
      setAddOpen(false)
      setProModalOpen(true)
      return
    }
    if (questionCount >= questionLimit) {
      setError(`Osiągnięto limit ${questionLimit} własnych wyznań.`)
      return
    }
    setAdding(true)
    setError(null)
    try {
      const res = await fetch('/api/questions/never', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      })
      if (!res.ok) throw new Error(await readApiError(res))
      const created = await res.json()
      setQuestions((prev) => [created, ...prev])
      setQuestionCount(readQuestionCountHeader(res, questionCount + 1))
      setText('')
      setAddOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się dodać pytania.')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await fetch(`/api/questions/never/${id}`, { method: 'DELETE' })
      setQuestions((prev) => prev.filter((q) => q.id !== id))
      setQuestionCount((prev) => Math.max(0, prev - 1))
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
            if (!hasPremium) {
              setProModalOpen(true)
              return
            }
            if (questionCount >= questionLimit) {
              setError(`Osiągnięto limit ${questionLimit} własnych wyznań.`)
              return
            }
            setAddOpen(true)
          }}
          className="flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-xs font-bold tracking-normal uppercase"
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
          {hasPremium ? <Plus size={14} /> : <Lock size={14} />}
          Dodaj wyznanie
          {!hasPremium && <span className="text-yellow-400">PRO</span>}
        </button>
      </div>

      {proModalOpen && <ProModal onClose={() => setProModalOpen(false)} />}

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
                className="flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-xs font-bold tracking-normal uppercase disabled:opacity-30"
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
        emptyText={
          hasPremium
            ? 'Nie masz jeszcze żadnych własnych wyznań.'
            : 'Własne wyznania Nigdy przenigdy są funkcją PRO.'
        }
        emptyActionText={
          hasPremium ? 'Dodaj pierwsze powyżej.' : 'Odblokuj PRO, żeby dodać własne wyznania.'
        }
        label={
          hasPremium
            ? `Twoje wyznania (${questionCount}/${questionLimit})`
            : `Twoje wyznania (${questionCount}/0 PRO)`
        }
        loading={loading}
        loadingColor="var(--neon-pink)"
        deletingId={deletingId}
        questions={questions}
        onDelete={handleDelete}
      />
    </div>
  )
}

export function QuizTab() {
  const access = useContentAccess()
  const hasPremium = checkAccess({ type: 'premium' }, access).granted
  const questionLimit = getQuestionQuota('quiz', hasPremium)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [questionCount, setQuestionCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [proModalOpen, setProModalOpen] = useState(false)
  const [text, setText] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState(0)
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('/api/questions/quiz')
      .then(async (res) => {
        const data = await res.json()
        if (!cancelled) {
          setQuestions(Array.isArray(data) ? data : [])
          setQuestionCount(readQuestionCountHeader(res, Array.isArray(data) ? data.length : 0))
        }
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
    const quotaReached = questionCount >= questionLimit

    if (quotaReached) {
      if (!hasPremium) {
        setAddOpen(false)
        setProModalOpen(true)
      } else {
        setError(`Osiągnięto limit ${questionLimit} pytań quizowych.`)
      }
      return
    }

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
      if (!res.ok) throw new Error(await readApiError(res))
      const created = await res.json()
      setQuestions((prev) => [created, ...prev])
      setQuestionCount(readQuestionCountHeader(res, questionCount + 1))
      setText('')
      setOptions(['', '', '', ''])
      setCorrectIndex(0)
      setAddOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nie udało się dodać pytania quizowego.')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await fetch(`/api/questions/quiz/${id}`, { method: 'DELETE' })
      setQuestions((prev) => prev.filter((q) => q.id !== id))
      setQuestionCount((prev) => Math.max(0, prev - 1))
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
            if (questionCount >= questionLimit) {
              if (!hasPremium) {
                setProModalOpen(true)
                return
              }
              setError(`Osiągnięto limit ${questionLimit} pytań quizowych.`)
              return
            }
            setAddOpen(true)
          }}
          className="flex items-center gap-2 rounded-xl border-2 px-4 py-2.5 text-xs font-bold tracking-normal uppercase"
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

      {proModalOpen && <ProModal onClose={() => setProModalOpen(false)} />}

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
                  className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold tracking-normal uppercase disabled:opacity-30"
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
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-xs font-bold tracking-normal uppercase disabled:opacity-30"
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
        label={`Twoje pytania quizowe (${questionCount}/${questionLimit})`}
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

function readQuestionCountHeader(response: Response, fallback: number) {
  const value = Number(response.headers.get('X-Question-Count'))
  return Number.isFinite(value) ? value : fallback
}

async function readApiError(response: Response) {
  const payload = (await response.json().catch(() => null)) as { error?: unknown } | null
  return typeof payload?.error === 'string' ? payload.error : 'Nie udało się zapisać pytania.'
}

function QuestionList<T extends Question>({
  emptyText,
  emptyActionText = 'Dodaj pierwsze powyżej.',
  label,
  loading,
  loadingColor,
  deletingId,
  questions,
  onDelete,
  renderDetails,
}: {
  emptyText: string
  emptyActionText?: string
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
          {emptyActionText}
        </p>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <p className="text-text-muted text-xs font-semibold tracking-normal uppercase">{label}</p>
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

          <span className="text-text-muted text-xs font-semibold tracking-normal uppercase tabular-nums">
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
