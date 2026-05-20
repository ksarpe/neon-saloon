'use client'

import { motion } from 'framer-motion'
import {
  AlertCircle,
  CreditCard,
  Crown,
  KeyRound,
  Loader2,
  RefreshCw,
  Save,
  Settings,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'

import { getPasswordPolicyError } from '@/lib/password-policy'

import {
  type AccountPayload,
  type CheckoutState,
  formatAccountDate,
  panelButtonHover,
  type PaymentStatus,
  type PlanId,
} from './shared'

export function AccountTab() {
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
                <p className="mt-2 text-xs font-semibold tracking-normal text-white/45 uppercase">
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
            className="flex items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold tracking-normal uppercase"
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
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-black tracking-normal uppercase disabled:opacity-35"
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
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-black tracking-normal uppercase disabled:opacity-35"
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
            className="flex min-h-12 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-black tracking-normal uppercase disabled:opacity-35"
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
            <label className="text-text-muted text-xs font-semibold tracking-normal uppercase">
              Email
            </label>
            <input
              value={account?.email ?? ''}
              disabled
              className="bg-saloon-surface text-text-muted rounded-xl border px-4 py-3 text-sm"
              style={{ borderColor: 'rgba(255,220,180,0.12)' }}
            />
            <label className="text-text-muted text-xs font-semibold tracking-normal uppercase">
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
              className="mt-1 flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-xs font-black tracking-normal uppercase disabled:opacity-35"
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
              className="mt-1 flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-xs font-black tracking-normal uppercase disabled:opacity-35"
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

export function PaymentStatusBanner({ checkoutState }: { checkoutState: CheckoutState }) {
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
              <p className="mt-2 text-xs font-semibold tracking-normal text-white/45 uppercase">
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
          className="rounded-xl border px-4 py-2 text-xs font-bold tracking-normal uppercase"
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
