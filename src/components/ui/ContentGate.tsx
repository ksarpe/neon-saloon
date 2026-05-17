'use client'

import { Check, Crown, Loader2, Lock, X } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import { useState } from 'react'

import { useContentAccess } from '@/hooks/useContentAccess'
import { checkAccess, type ContentGate as Gate } from '@/lib/content-access'

interface ContentGateProps {
  gate: Gate
  children: React.ReactNode
  fallback?: React.ReactNode
  className?: string
}

type PlanId = 'monthly' | 'lifetime'

export function ContentGate({ gate, children, fallback, className }: ContentGateProps) {
  const access = useContentAccess()
  const result = checkAccess(gate, access)

  if (result.granted) return <>{children}</>
  if (fallback !== undefined) return <>{fallback}</>

  return (
    <LockedOverlay className={className}>
      {children}
    </LockedOverlay>
  )
}

function LockedOverlay({ children, className }: { children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className={`group relative cursor-pointer ${className ?? ''}`}
        onClick={() => setOpen(true)}
        role="button"
        aria-label="Odblokuj zawartość PRO"
      >
        <div className="pointer-events-none select-none blur-sm" aria-hidden>
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl bg-black/50 transition-colors group-hover:bg-black/60">
          <Lock className="text-yellow-400" size={30} aria-hidden />
          <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">PRO</span>
        </div>
      </div>

      {open && <ProModal onClose={() => setOpen(false)} />}
    </>
  )
}

export function ProModal({ onClose }: { onClose: () => void }) {
  const { status } = useSession()
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null)
  const [error, setError] = useState<string | null>(null)

  const startCheckout = async (plan: PlanId) => {
    setError(null)

    if (status === 'unauthenticated') {
      await signIn(undefined, { callbackUrl: window.location.href })
      return
    }

    setLoadingPlan(plan)
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
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : 'Nie udało się rozpocząć płatności.',
      )
      setLoadingPlan(null)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-yellow-500/30 bg-zinc-950 p-5 shadow-2xl sm:p-7"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:border-white/20 hover:text-white"
          aria-label="Zamknij"
        >
          <X size={18} aria-hidden />
        </button>

        <div className="mb-6 pr-10">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-yellow-500/40 bg-yellow-500/10 text-yellow-400">
            <Crown size={24} aria-hidden />
          </div>
          <h2 className="text-2xl font-bold tracking-wide text-yellow-400">
            Odblokuj Last Rodeo PRO
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
            Wybierz dostęp miesięczny albo jednorazowy plan dożywotni. Oba odblokowują tryby
            premium, w tym Mniej czy więcej.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {PLANS.map((plan) => {
            const loading = loadingPlan === plan.id

            return (
              <div
                key={plan.id}
                className="flex min-h-[320px] flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-left"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-white">{plan.name}</p>
                    <p className="mt-1 text-sm text-zinc-400">{plan.description}</p>
                  </div>
                  {plan.badge && (
                    <span className="rounded-full border border-yellow-500/40 bg-yellow-500/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-yellow-400 uppercase">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="mb-5">
                  <p className="text-2xl font-black text-yellow-400">{plan.priceLabel}</p>
                  <p className="mt-1 text-xs text-zinc-500">{plan.billingLabel}</p>
                </div>

                <div className="flex flex-1 flex-col gap-2 text-sm text-zinc-300">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex gap-2">
                      <Check className="mt-0.5 shrink-0 text-yellow-400" size={16} aria-hidden />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={loadingPlan !== null}
                  onClick={() => startCheckout(plan.id)}
                  className="mt-6 flex min-h-12 items-center justify-center rounded-xl border border-yellow-500/50 bg-yellow-400 px-5 py-3 text-sm font-black text-black transition-colors hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={18} aria-hidden />
                      Przekierowuję...
                    </>
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            )
          })}
        </div>

        <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="mb-3 text-xs font-bold tracking-widest text-zinc-500 uppercase">
            Porównanie
          </p>
          <div className="grid gap-2 text-sm text-zinc-300 sm:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
              <p className="font-bold text-white">Darmowy</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                Podstawowe tryby i standardowe talie.
              </p>
            </div>
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-3 sm:col-span-2">
              <p className="font-bold text-yellow-400">PRO</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                Wszystkie tryby premium, pełne paczki kart i przyszłe rozszerzenia bez kolejnych
                blokad w aplikacji.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

const PLANS: Array<{
  id: PlanId
  name: string
  description: string
  priceLabel: string
  billingLabel: string
  badge?: string
  cta: string
  features: string[]
}> = [
  {
    id: 'monthly',
    name: 'Subskrypcja miesięczna',
    description: 'Elastyczny dostęp PRO z płatnością co miesiąc.',
    priceLabel: 'Miesięcznie',
    billingLabel: 'Cena i rozliczenie widoczne w checkout Stripe.',
    cta: 'Wybierz miesięczny',
    features: [
      'Mniej czy więcej i kolejne tryby premium',
      'Pełne paczki kart oraz pytań',
      'Dostęp do nowych rozszerzeń PRO',
    ],
  },
  {
    id: 'lifetime',
    name: 'Plan dożywotni',
    description: 'Jedna płatność i stały dostęp do PRO na koncie.',
    priceLabel: 'Jednorazowo',
    billingLabel: 'Cena widoczna w checkout Stripe, bez odnawiania.',
    badge: 'Najprościej',
    cta: 'Wybierz dożywotni',
    features: [
      'Stały dostęp do obecnych trybów PRO',
      'Przyszłe paczki i rozszerzenia premium',
      'Brak cyklicznego rozliczania',
    ],
  },
]
