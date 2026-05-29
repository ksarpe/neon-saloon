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
  Trash2,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'

import { PurchaseConsent } from '@/components/ui/PurchaseConsent'
import { COMPANY } from '@/config/company'
import { PRICE_VAT_NOTE, PRICING } from '@/config/pricing'
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
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [marketingSaving, setMarketingSaving] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [checkoutPlan, setCheckoutPlan] = useState<PlanId | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [billingError, setBillingError] = useState<string | null>(null)
  const [consent, setConsent] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const loadAccount = async () => {
    setLoading(true)
    setBillingError(null)
    try {
      const response = await fetch('/api/account', { cache: 'no-store' })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(payload.error ?? 'Nie udało się pobrać konta.')
      setAccount(payload)
      setName(payload.name ?? '')
      setMarketingConsent(Boolean(payload.marketingConsent))
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
        setMarketingConsent(Boolean(payload.marketingConsent))
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

  const updateMarketingConsent = async (next: boolean) => {
    if (marketingSaving) return
    const previous = marketingConsent
    setMarketingConsent(next)
    setMarketingSaving(true)
    setProfileError(null)
    try {
      const response = await fetch('/api/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketingConsent: next }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(payload.error ?? 'Nie udało się zapisać zgody.')
      setAccount((prev) => (prev ? { ...prev, marketingConsent: payload.marketingConsent } : prev))
    } catch (error) {
      setMarketingConsent(previous)
      setProfileError(error instanceof Error ? error.message : 'Nie udało się zapisać zgody.')
    } finally {
      setMarketingSaving(false)
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
    if (!consent) {
      setBillingError('Zaznacz zgodę na rozpoczęcie świadczenia, aby kontynuować zakup.')
      return
    }
    setCheckoutPlan(plan)
    setBillingError(null)
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

  const deleteAccount = async () => {
    if (deleteLoading || deleteConfirmation !== 'USUŃ KONTO') return
    setDeleteLoading(true)
    setDeleteError(null)

    try {
      const response = await fetch('/api/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: deletePassword,
          confirmation: deleteConfirmation,
        }),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(payload.error ?? 'Nie udało się usunąć konta.')

      clearLocalGameStorage()
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Nie udało się usunąć konta.')
      setDeleteLoading(false)
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

        {!isLifetime && (
          <div className="mt-5">
            <PurchaseConsent
              checked={consent}
              onChange={setConsent}
              id="account-purchase-consent"
            />
          </div>
        )}

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            disabled={checkoutPlan !== null || isLifetime || !consent}
            onClick={() => startCheckout('monthly')}
            className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl border px-4 py-3 text-xs font-black tracking-normal uppercase disabled:opacity-35"
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
            <span className="flex items-center gap-2">
              {checkoutPlan === 'monthly' ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <CreditCard size={15} />
              )}
              Kup miesięczny
            </span>
            <span className="text-[11px] font-bold normal-case opacity-90">
              {PRICING.monthly.amount} {PRICING.monthly.period}
            </span>
          </button>
          <button
            type="button"
            disabled={checkoutPlan !== null || isLifetime || !consent}
            onClick={() => startCheckout('lifetime')}
            className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl border px-4 py-3 text-xs font-black tracking-normal uppercase disabled:opacity-35"
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
            <span className="flex items-center gap-2">
              {checkoutPlan === 'lifetime' ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Crown size={15} />
              )}
              Kup dożywotni
            </span>
            <span className="text-[11px] font-bold normal-case opacity-90">
              {PRICING.lifetime.amount} {PRICING.lifetime.period}
            </span>
          </button>
          {!isLifetime && (
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
          )}
        </div>

        {!isLifetime && <p className="text-text-muted mt-3 text-xs">{PRICE_VAT_NOTE}</p>}

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

            <div
              className="mt-2 border-t pt-3"
              style={{ borderColor: 'rgba(255,220,180,0.1)' }}
            >
              <label
                htmlFor="account-marketing-consent"
                className="flex cursor-pointer items-start gap-2.5 text-left text-xs leading-relaxed"
                style={{ color: 'rgba(240,223,192,0.78)' }}
              >
                <input
                  id="account-marketing-consent"
                  type="checkbox"
                  checked={marketingConsent}
                  disabled={marketingSaving}
                  onChange={(event) => updateMarketingConsent(event.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--neon-pink)]"
                />
                <span>
                  Zgoda na wiadomości marketingowe (nowości, talie kart, promocje). Dobrowolna —
                  możesz ją włączyć lub wyłączyć w każdej chwili.
                </span>
              </label>
            </div>
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
              placeholder="Nowe hasło: min. 10, Aa1!"
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

      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: 'rgba(239,68,68,0.28)',
          backgroundColor: 'rgba(127,29,29,0.12)',
        }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
              style={{
                borderColor: 'rgba(239,68,68,0.35)',
                color: '#f87171',
                backgroundColor: 'rgba(239,68,68,0.1)',
              }}
            >
              <Trash2 size={20} />
            </div>
            <div>
              <p className="text-text-primary text-sm font-black">Usuń konto</p>
              <p className="text-text-muted mt-1 text-sm leading-snug">
                Usuniemy konto, zapisane pytania, ustawienia i dane profilu. Tej operacji nie da się
                cofnąć.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setDeleteError(null)
              setDeleteModalOpen(true)
            }}
            className="flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-black tracking-normal uppercase"
            {...panelButtonHover(
              {
                borderColor: 'rgba(239,68,68,0.45)',
                color: '#f87171',
                backgroundColor: 'rgba(239,68,68,0.08)',
              },
              {
                borderColor: 'rgba(239,68,68,0.65)',
                color: '#fecaca',
                backgroundColor: 'rgba(239,68,68,0.16)',
              }
            )}
          >
            <Trash2 size={15} />
            Usuń konto
          </button>
        </div>
      </div>

      {deleteModalOpen && (
        <DeleteAccountModal
          email={account?.email ?? ''}
          password={deletePassword}
          confirmation={deleteConfirmation}
          loading={deleteLoading}
          error={deleteError}
          onPasswordChange={setDeletePassword}
          onConfirmationChange={setDeleteConfirmation}
          onDelete={deleteAccount}
          onClose={() => {
            if (deleteLoading) return
            setDeleteModalOpen(false)
            setDeletePassword('')
            setDeleteConfirmation('')
            setDeleteError(null)
          }}
        />
      )}
    </div>
  )
}

function DeleteAccountModal({
  email,
  password,
  confirmation,
  loading,
  error,
  onPasswordChange,
  onConfirmationChange,
  onDelete,
  onClose,
}: {
  email: string
  password: string
  confirmation: string
  loading: boolean
  error: string | null
  onPasswordChange: (value: string) => void
  onConfirmationChange: (value: string) => void
  onDelete: () => void
  onClose: () => void
}) {
  const canDelete = confirmation === 'USUŃ KONTO' && password.length > 0 && !loading

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0d0818]/85 p-4 backdrop-blur-sm sm:items-center">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-lg rounded-2xl border p-5 shadow-2xl sm:p-6"
        style={{
          borderColor: 'rgba(239,68,68,0.35)',
          background:
            'radial-gradient(circle at top left, rgba(239,68,68,0.18), transparent 34%), linear-gradient(160deg, rgba(26,15,42,0.98), rgba(13,8,24,0.98))',
          boxShadow: '0 24px 80px rgba(0,0,0,0.48), 0 0 36px rgba(239,68,68,0.16)',
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div
              className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border"
              style={{
                borderColor: 'rgba(239,68,68,0.4)',
                background: 'rgba(239,68,68,0.12)',
                color: '#f87171',
              }}
            >
              <Trash2 size={24} aria-hidden />
            </div>
            <h2 className="text-text-primary text-2xl font-black">Usunąć konto?</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-text-muted flex h-9 w-9 items-center justify-center rounded-full border transition-colors disabled:opacity-40"
            style={{ borderColor: 'var(--saloon-border)' }}
            aria-label="Zamknij"
          >
            ×
          </button>
        </div>

        <p className="text-text-muted mt-2 text-sm leading-relaxed">
          Konto <span className="text-text-primary font-bold">{email}</span> zostanie trwale
          usunięte razem z pytaniami i ustawieniami. Jeśli masz aktywną subskrypcję miesięczną,
          spróbujemy anulować ją w Stripe przed usunięciem konta.
        </p>

        <div className="mt-5 flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder="Obecne hasło"
            autoComplete="current-password"
            className="bg-saloon-surface text-text-primary placeholder:text-text-muted rounded-xl border-2 px-4 py-3 text-sm transition-colors focus:outline-none"
            style={{ borderColor: password ? 'rgba(239,68,68,0.65)' : 'var(--saloon-border)' }}
          />
          <div>
            <label className="text-text-muted mb-2 block text-xs font-semibold tracking-normal uppercase">
              Wpisz USUŃ KONTO
            </label>
            <input
              value={confirmation}
              onChange={(event) => onConfirmationChange(event.target.value)}
              className="bg-saloon-surface text-text-primary placeholder:text-text-muted rounded-xl border-2 px-4 py-3 text-sm transition-colors focus:outline-none"
              style={{
                borderColor:
                  confirmation === 'USUŃ KONTO' ? 'rgba(239,68,68,0.65)' : 'var(--saloon-border)',
              }}
            />
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
            {error}
          </p>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex min-h-11 flex-1 items-center justify-center rounded-xl border px-4 py-3 text-xs font-black tracking-normal uppercase disabled:opacity-40"
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
            Anuluj
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={!canDelete}
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-black tracking-normal uppercase disabled:opacity-35"
            {...panelButtonHover(
              {
                borderColor: 'rgba(239,68,68,0.45)',
                color: '#f87171',
                backgroundColor: 'rgba(239,68,68,0.08)',
              },
              {
                borderColor: 'rgba(239,68,68,0.65)',
                color: '#fecaca',
                backgroundColor: 'rgba(239,68,68,0.16)',
              }
            )}
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            Usuń konto
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function clearLocalGameStorage() {
  if (typeof window === 'undefined') return
  try {
    const keys = Array.from({ length: window.localStorage.length }, (_, index) =>
      window.localStorage.key(index)
    ).filter((key): key is string => Boolean(key?.startsWith('last-rodeo-')))

    keys.forEach((key) => window.localStorage.removeItem(key))
  } catch {
    // ignore
  }
}

export function PaymentStatusBanner({
  checkoutState,
  checkoutSessionId,
}: {
  checkoutState: CheckoutState
  checkoutSessionId?: string | null
}) {
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
        const response =
          checkoutSessionId && attempts === 1
            ? await fetch('/api/stripe/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: checkoutSessionId }),
              })
            : await fetch('/api/stripe/status', { cache: 'no-store' })
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
  }, [checkoutSessionId, checkoutState])

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
        ? `Nie widzimy aktywnego dostępu PRO. Jeśli płatność została pobrana, napisz do nas na ${COMPANY.email} — sprawdzimy to.`
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
