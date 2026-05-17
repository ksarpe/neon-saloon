'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Tab = 'login' | 'register'

function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  right,
}: {
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
  right?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-text-muted text-[11px] font-semibold tracking-widest uppercase">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="text-text-primary placeholder:text-text-muted w-full rounded-xl border-2 bg-transparent px-4 py-3.5 text-sm font-semibold transition-all duration-200 focus:outline-none"
          style={{
            borderColor: value ? 'var(--sheriff-gold)' : 'rgba(255,220,180,0.18)',
            backgroundColor: 'rgba(255,220,180,0.04)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--neon-pink)'
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(255,16,240,0.1)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = value
              ? 'var(--sheriff-gold)'
              : 'rgba(255,220,180,0.18)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
        {right && <div className="absolute top-1/2 right-3 -translate-y-1/2">{right}</div>}
      </div>
    </div>
  )
}

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <InputField
      label={label}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      right={
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="text-text-muted hover:text-text-primary transition-colors"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
    />
  )
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="rounded-xl px-4 py-3 text-center text-sm font-semibold"
      style={{
        backgroundColor: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.35)',
        color: '#f87171',
      }}
    >
      {message}
    </motion.div>
  )
}

// ─── Login form ───────────────────────────────────────────────────────────────

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/graj/host'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError(null)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('Nieprawidłowy e-mail lub hasło')
      setLoading(false)
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <InputField
        label="Adres e-mail"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="szeryf@saloon.pl"
        autoComplete="email"
      />
      <PasswordField
        label="Hasło"
        value={password}
        onChange={setPassword}
        placeholder="••••••••"
        autoComplete="current-password"
      />

      <AnimatePresence mode="wait">
        {error && <ErrorBanner key={error} message={error} />}
      </AnimatePresence>

      <Button
        type="primary"
        htmlType="submit"
        disabled={loading || !email || !password}
        className="mt-1 w-full"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Wejdź do salonu'}
      </Button>

      <p className="text-text-muted text-center text-sm">
        Nie masz konta?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="font-bold transition-colors"
          style={{ color: 'var(--sheriff-gold)' }}
        >
          Załóż teraz
        </button>
      </p>
    </form>
  )
}

// ─── Register form ────────────────────────────────────────────────────────────

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/graj/host'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    if (password !== confirm) {
      setError('Hasła nie są takie same')
      return
    }
    if (password.length < 6) {
      setError('Hasło musi mieć minimum 6 znaków')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Coś poszło nie tak')
        setLoading(false)
        return
      }

      // Auto-login after successful registration
      const signInRes = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (signInRes?.error) {
        setError('Konto założone! Zaloguj się ręcznie.')
        setLoading(false)
      } else {
        router.push(callbackUrl)
      }
    } catch {
      setError('Błąd połączenia — spróbuj ponownie')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <InputField
        label="Imię / ksywka"
        type="text"
        value={name}
        onChange={setName}
        placeholder="np. Szeryf Alicja"
        autoComplete="name"
      />
      <InputField
        label="Adres e-mail"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="szeryf@saloon.pl"
        autoComplete="email"
      />
      <PasswordField
        label="Hasło"
        value={password}
        onChange={setPassword}
        placeholder="min. 6 znaków"
        autoComplete="new-password"
      />
      <PasswordField
        label="Powtórz hasło"
        value={confirm}
        onChange={setConfirm}
        placeholder="••••••••"
        autoComplete="new-password"
      />

      <AnimatePresence mode="wait">
        {error && <ErrorBanner key={error} message={error} />}
      </AnimatePresence>

      <Button
        type="primary"
        htmlType="submit"
        disabled={loading || !email || !password || !confirm}
        className="mt-1 w-full"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Otwórz konto'}
      </Button>

      <p className="text-text-muted text-center text-sm">
        Masz już konto?{' '}
        <button
          type="button"
          onClick={onSwitch}
          className="font-bold transition-colors"
          style={{ color: 'var(--sheriff-gold)' }}
        >
          Zaloguj się
        </button>
      </p>
    </form>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  return (
    <Suspense>
      <LoginPageInner />
    </Suspense>
  )
}

function LoginPageInner() {
  const [tab, setTab] = useState<Tab>('login')

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center p-6">

      <div className="relative z-10 flex w-full max-w-sm flex-col gap-8">
        {/* Logo / title */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="mb-3 flex items-center justify-center gap-2">
            <span
              className="shimmer-text text-6xl tracking-widest"
              style={{ fontFamily: "var(--font-app)" }}
            >
              last rodeo
            </span>
          </div>
          <p className="text-text-muted text-xs tracking-widest uppercase">
            Zaloguj się, żeby prowadzić gry
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-6 rounded-2xl border p-6"
          style={{
            borderColor: 'rgba(255,220,180,0.12)',
            backgroundColor: 'rgba(13,8,24,0.85)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,16,240,0.06)',
          }}
        >
          {/* Tab switcher */}
          <div
            className="flex gap-1 rounded-xl p-1"
            style={{ backgroundColor: 'rgba(255,220,180,0.06)' }}
          >
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className="flex-1 rounded-lg py-2 text-xs font-bold tracking-widest uppercase transition-all duration-200"
                style={{
                  backgroundColor: tab === t ? 'rgba(255,16,240,0.15)' : 'transparent',
                  color: tab === t ? 'var(--neon-pink)' : 'rgba(255,220,180,0.45)',
                  boxShadow:
                    tab === t
                      ? '0 0 16px rgba(255,16,240,0.2), inset 0 0 0 1px rgba(255,16,240,0.25)'
                      : 'none',
                }}
              >
                {t === 'login' ? 'Zaloguj się' : 'Załóż konto'}
              </button>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            {tab === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.2 }}
              >
                <LoginForm onSwitch={() => setTab('register')} />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.2 }}
              >
                <RegisterForm onSwitch={() => setTab('login')} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer hint */}
        <motion.p
          className="text-text-muted text-center text-[11px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Gracze nie potrzebują konta — dołączają przez PIN
        </motion.p>
      </div>
    </div>
  )
}
