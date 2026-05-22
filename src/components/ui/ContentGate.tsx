'use client'

import { Check, Crown, Loader2, Lock, X } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import { useState } from 'react'

import { useContentAccess } from '@/hooks/useContentAccess'
import { checkAccess, type ContentGate as Gate } from '@/lib/content-access'

import { PurchaseConsent } from './PurchaseConsent'

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

  return <LockedOverlay className={className}>{children}</LockedOverlay>
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
        <div className="pointer-events-none blur-sm select-none" aria-hidden>
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-xl bg-black/50 transition-colors group-hover:bg-black/60">
          <Lock className="text-yellow-400" size={30} aria-hidden />
          <span className="text-xs font-bold tracking-normal text-yellow-400 uppercase">PRO</span>
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
  const [consent, setConsent] = useState(false)
  // Niezalogowany najpierw loguje się — zgodę zbieramy dopiero, gdy klik realnie startuje zakup.
  const needsConsent = status !== 'unauthenticated'

  const startCheckout = async (plan: PlanId) => {
    setError(null)

    if (status === 'unauthenticated') {
      await signIn(undefined, { callbackUrl: window.location.href })
      return
    }

    if (!consent) {
      setError('Zaznacz zgodę na rozpoczęcie świadczenia, aby kontynuować zakup.')
      return
    }

    setLoadingPlan(plan)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, consent: true }),
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
          : 'Nie udało się rozpocząć płatności.'
      )
      setLoadingPlan(null)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#0d0818]/85 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-2xl border p-5 shadow-2xl sm:p-7"
        style={{
          borderColor: 'var(--saloon-border)',
          background:
            'radial-gradient(circle at top left, rgba(221,84,162,0.18), transparent 34%), linear-gradient(160deg, rgba(26,15,42,0.98), rgba(13,8,24,0.98))',
          boxShadow: '0 24px 80px rgba(0,0,0,0.48), 0 0 36px rgba(226,67,157,0.16)',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-[rgba(221,84,162,0.55)] hover:text-[var(--text-primary)]"
          style={{ borderColor: 'var(--saloon-border)', color: 'var(--text-muted)' }}
          aria-label="Zamknij"
        >
          <X size={18} aria-hidden />
        </button>

        <div className="mb-6 pr-10">
          <div
            className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border"
            style={{
              borderColor: 'rgba(221,84,162,0.42)',
              background: 'rgba(221,84,162,0.12)',
              color: 'var(--neon-pink)',
            }}
          >
            <Crown size={24} aria-hidden />
          </div>
          <h2 className="shimmer-text text-3xl tracking-wide">Odblokuj Last Rodeo PRO</h2>
          <p className="text-text-muted mt-2 max-w-2xl text-sm leading-relaxed">
            Wybierz dostęp miesięczny albo jednorazowy plan dożywotni. Oba odblokowują tryby
            premium, własne wyzwania Nigdy przenigdy i dodatkowe talie.
          </p>
        </div>

        {needsConsent && (
          <div className="mb-4">
            <PurchaseConsent checked={consent} onChange={setConsent} id="modal-purchase-consent" />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {PLANS.map((plan) => {
            const loading = loadingPlan === plan.id

            return (
              <div
                key={plan.id}
                className="flex min-h-[320px] flex-col rounded-2xl border p-5 text-left transition-colors"
                style={{
                  borderColor: plan.featured ? 'rgba(221,84,162,0.55)' : 'var(--saloon-border)',
                  background: plan.featured
                    ? 'linear-gradient(180deg, rgba(221,84,162,0.14), rgba(255,220,180,0.055))'
                    : 'rgba(255,220,180,0.055)',
                }}
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-text-primary text-lg font-bold">{plan.name}</p>
                    <p className="text-text-muted mt-1 text-sm">{plan.description}</p>
                  </div>
                  {plan.badge && (
                    <span
                      className="rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-normal uppercase"
                      style={{
                        borderColor: 'rgba(249,74,255,0.4)',
                        background: 'rgba(249,74,255,0.1)',
                        color: 'var(--sheriff-pink)',
                      }}
                    >
                      {plan.badge}
                    </span>
                  )}
                </div>

                <div className="mb-5">
                  <p className="text-4xl font-black" style={{ color: 'var(--text-primary)' }}>
                    {plan.priceLabel}
                  </p>
                  <p className="mt-1 text-xs font-semibold" style={{ color: 'var(--neon-pink)' }}>
                    {plan.billingLabel}
                  </p>
                </div>

                <div className="text-text-primary flex flex-1 flex-col gap-2 text-sm">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex gap-2">
                      <Check
                        className="mt-0.5 shrink-0"
                        size={16}
                        style={{ color: 'var(--neon-pink)' }}
                        aria-hidden
                      />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={loadingPlan !== null || (needsConsent && !consent)}
                  onClick={() => startCheckout(plan.id)}
                  className="mt-6 flex min-h-12 items-center justify-center rounded-xl border px-5 py-3 text-sm font-black transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  style={{
                    borderColor: 'rgba(221,84,162,0.55)',
                    background: 'linear-gradient(135deg, var(--neon-pink), var(--sheriff-pink))',
                    color: '#fff7fb',
                  }}
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

        <div
          className="mt-5 rounded-2xl border p-4"
          style={{ borderColor: 'var(--saloon-border)', background: 'rgba(13,8,24,0.42)' }}
        >
          <p className="text-text-muted mb-3 text-xs font-bold tracking-normal uppercase">
            Porównanie
          </p>
          <div className="text-text-primary grid gap-2 text-sm sm:grid-cols-3">
            <div
              className="rounded-xl border p-3"
              style={{ borderColor: 'var(--saloon-border)', background: 'rgba(255,220,180,0.035)' }}
            >
              <p className="font-bold">Darmowy</p>
              <p className="text-text-muted mt-1 text-xs leading-relaxed">
                Podstawowe tryby i standardowe talie.
              </p>
            </div>
            <div
              className="rounded-xl border p-3 sm:col-span-2"
              style={{
                borderColor: 'rgba(221,84,162,0.38)',
                background: 'rgba(221,84,162,0.1)',
              }}
            >
              <p className="font-bold" style={{ color: 'var(--neon-pink)' }}>
                PRO
              </p>
              <p className="text-text-primary mt-1 text-xs leading-relaxed">
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
  featured?: boolean
  cta: string
  features: string[]
}> = [
  {
    id: 'monthly',
    name: 'Subskrypcja miesięczna',
    description: 'Elastyczny dostęp PRO z płatnością co miesiąc.',
    priceLabel: '19,99 zł',
    billingLabel: 'za miesięczną subskrypcję',
    cta: 'Wybierz miesięczny',
    features: [
      'Mniej czy więcej, Dead or alive i kolejne tryby premium',
      'Własne wyzwania Nigdy przenigdy',
      'Pełne paczki kart oraz pytań',
      'Dostęp do nowych rozszerzeń PRO',
    ],
  },
  {
    id: 'lifetime',
    name: 'Plan dożywotni',
    description: 'Jedna płatność i stały dostęp do PRO na koncie.',
    priceLabel: '69 zł',
    billingLabel: 'jednorazowo za lifetime dostęp',
    badge: 'Najprościej',
    featured: true,
    cta: 'Wybierz dożywotni',
    features: [
      'Stały dostęp do obecnych trybów PRO',
      'Własne wyzwania Nigdy przenigdy',
      'Przyszłe paczki i rozszerzenia premium',
      'Brak cyklicznego rozliczania',
    ],
  },
]
