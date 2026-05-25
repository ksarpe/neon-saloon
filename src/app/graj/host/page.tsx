'use client'

import { motion } from 'framer-motion'
import { AlertTriangle, Loader2, Lock, RotateCcw, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { AgeNotice } from '@/components/ui/AgeNotice'
import { BotProtection, isBotProtectionConfigured } from '@/components/ui/BotProtection'
import { Button } from '@/components/ui/button'
import { ProModal } from '@/components/ui/ContentGate'
import { useContentAccess } from '@/hooks/useContentAccess'
import { checkAccess } from '@/lib/content-access'
import {
  clearHostSession,
  clearOtherHostSessions,
  getStoredHostSessions,
  hostAuthHeaders,
  hostJsonHeaders,
  saveHostSecret,
} from '@/lib/session-host-secret'

const GAME_MODES = [
  {
    id: 'trivia',
    icon: 'icons/veil-icon.png',
    label: 'Quiz o Pannie Młodej',
    description: 'Kto tu zna pannę najlepiej? Strzelaj i głosuj. Czas pokaże.',
    color: 'var(--neon-pink)',
    border: 'rgba(255,16,240,0.5)',
    bg: 'rgba(255,16,240,0.07)',
  },
  {
    id: 'categories',
    icon: 'icons/groins.png',
    label: 'Skategoryzowane pytania',
    description: 'Seks? Anatomia? Kto jest ekspertem? Sprawdźcie to!',
    color: '#a78bfa',
    border: 'rgba(167,139,250,0.5)',
    bg: 'rgba(167,139,250,0.07)',
  },
  {
    id: 'never',
    icon: 'icons/plug.png',
    label: 'Nigdy przenigdy',
    description: 'Masz coś do ukrycia, kowboju? Tu nic nie zostaje w siodle.',
    color: 'rgba(255,215,0,0.5)',
    border: 'rgba(255,215,0,0.5)',
    bg: 'rgba(255,215,0,0.07)',
  },
  {
    id: 'highlow',
    icon: 'icons/breast.png',
    label: 'Mniej czy więcej',
    description: 'Dwie bandy, jeden strzał. Zgadnij — wyżej czy niżej. Bez drugiej szansy.',
    color: '#10b981',
    border: 'rgba(16,185,129,0.5)',
    bg: 'rgba(16,185,129,0.07)',
    isPremium: true,
  },
  {
    id: 'battle-royale',
    icon: 'icons/pistols.png',
    label: 'Dead or alive',
    description:
      'Wszyscy strzelają naraz. Pomylisz się — odpadasz. Najwolniejszy też ginie. Jeden ocaleje.',
    color: '#ef4444',
    border: 'rgba(239,68,68,0.5)',
    bg: 'rgba(239,68,68,0.07)',
    isPremium: true,
  },
]

type ActiveHostSession = {
  pin: string
  status: 'waiting' | 'active'
  gameMode: string
  playersCount: number
}

export default function HostSetupPage() {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [botProtectionToken, setBotProtectionToken] = useState<string | null>(null)
  const [botProtectionKey, setBotProtectionKey] = useState(0)
  const [creating, setCreating] = useState(false)
  const [endingExisting, setEndingExisting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [proModalOpen, setProModalOpen] = useState(false)
  const [activeHostSession, setActiveHostSession] = useState<ActiveHostSession | null>(null)
  const access = useContentAccess()
  const botProtectionEnabled = isBotProtectionConfigured()
  const resetBotProtection = useCallback(() => {
    setBotProtectionToken(null)
    setBotProtectionKey((key) => key + 1)
  }, [])
  const clearBotProtection = useCallback(() => setBotProtectionToken(null), [])

  useEffect(() => {
    let cancelled = false

    async function checkActiveHostSession() {
      const storedSessions = getStoredHostSessions()
      const activeSessions: ActiveHostSession[] = []

      for (const stored of storedSessions) {
        try {
          const response = await fetch(`/api/sessions/${stored.pin}/host-resume`, {
            headers: hostAuthHeaders(stored.pin),
          })

          if (response.status === 401 || response.status === 404) {
            clearHostSession(stored.pin)
            continue
          }
          if (!response.ok) continue

          const data = await response.json()
          if (data.status === 'finished') {
            clearHostSession(stored.pin)
            continue
          }

          const playersCount = Array.isArray(data.players) ? data.players.length : 0
          if (data.status === 'waiting' && playersCount === 0) {
            clearHostSession(stored.pin)
            continue
          }

          if ((data.status === 'waiting' || data.status === 'active') && !cancelled) {
            activeSessions.push({
              pin: stored.pin,
              status: data.status,
              gameMode: typeof data.gameMode === 'string' ? data.gameMode : 'trivia',
              playersCount,
            })
          }
        } catch {
          // Keep the stored session when the network is unavailable.
        }
      }

      const sessionToResume = activeSessions[0]
      if (sessionToResume && !cancelled) {
        clearOtherHostSessions(sessionToResume.pin)
        setActiveHostSession(sessionToResume)
      }
    }

    void checkActiveHostSession()

    return () => {
      cancelled = true
    }
  }, [])

  const handleCreate = async () => {
    if (!selectedMode) return
    if (activeHostSession) return
    if (botProtectionEnabled && !botProtectionToken) {
      setError('Potwierdź, że nie jesteś botem.')
      return
    }
    setCreating(true)
    setError(null)
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameMode: selectedMode,
          botProtectionToken,
        }),
      })
      const payload = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(
          typeof payload.error === 'string' ? payload.error : 'Nie udało się utworzyć gry.'
        )
      }
      const { pin, hostSecret } = payload
      if (typeof hostSecret === 'string') {
        saveHostSecret(pin, hostSecret)
      }
      router.push(`/graj/host/${pin}?mode=${selectedMode}`)
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : 'Nie udało się utworzyć gry.')
      setCreating(false)
      resetBotProtection()
    }
  }

  const handleResumeExisting = () => {
    if (!activeHostSession) return
    router.push(`/graj/host/${activeHostSession.pin}?mode=${activeHostSession.gameMode}`)
  }

  const handleEndExisting = async () => {
    if (!activeHostSession) return
    const sessionToEnd = activeHostSession
    setEndingExisting(true)
    setError(null)

    try {
      const response = await fetch(`/api/sessions/${sessionToEnd.pin}`, {
        method: 'POST',
        headers: hostJsonHeaders(sessionToEnd.pin),
        body: JSON.stringify({ action: 'finish', scores: [], teamScores: [] }),
      })

      if (!response.ok && response.status !== 401 && response.status !== 404) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(
          typeof payload.error === 'string'
            ? payload.error
            : 'Nie udało się zakończyć aktywnej sesji.'
        )
      }

      clearHostSession(sessionToEnd.pin)
      setActiveHostSession(null)
    } catch (endError) {
      setError(
        endError instanceof Error
          ? endError.message
          : 'Nie udało się zakończyć aktywnej sesji.'
      )
    } finally {
      setEndingExisting(false)
    }
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-start overflow-y-auto px-6 pt-20 pb-6 sm:justify-center sm:p-6">
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-8 sm:gap-10">
        {/* Game mode selector */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <label className="text-text-muted mb-3 block text-xs font-semibold tracking-normal uppercase">
            Wybierz tryb gry
          </label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {GAME_MODES.map((mode) => {
              const active = selectedMode === mode.id
              return (
                <motion.button
                  key={mode.id}
                  id={`mode-${mode.id}`}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (mode.isPremium && !checkAccess({ type: 'premium' }, access).granted) {
                      setProModalOpen(true)
                      return
                    }
                    setSelectedMode(mode.id)
                  }}
                  className="group relative flex h-full min-h-[128px] items-start gap-4 overflow-hidden rounded-2xl border-2 p-4 text-left transition-all duration-200"
                  style={{
                    borderColor: active ? mode.border : 'var(--saloon-border)',
                    backgroundColor: active ? mode.bg : 'transparent',
                    boxShadow: active ? `0 0 20px ${mode.border}` : 'none',
                  }}
                >
                  <div className="pointer-events-none absolute inset-y-0 -left-full z-0 w-full skew-x-[-20deg] bg-linear-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />

                  {mode.isPremium && (
                    <div className="absolute right-2 bottom-2 z-20 flex items-center gap-1 rounded-full border border-yellow-500/50 bg-black/60 px-2 py-0.5 text-[9px] font-bold tracking-normal text-yellow-400 uppercase">
                      {!checkAccess({ type: 'premium' }, access).granted && (
                        <Lock size={10} aria-hidden />
                      )}
                      PRO
                    </div>
                  )}

                  <div
                    className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: active ? mode.bg : 'var(--saloon-surface)',
                      border: `1px solid ${mode.border}`,
                    }}
                  >
                    {mode.icon ? (
                      <Image src={`/${mode.icon}`} alt="" width={64} height={64} aria-hidden />
                    ) : (
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: mode.color }}
                      />
                    )}
                  </div>

                  <div className="relative z-10 flex-1">
                    <p
                      className="text-sm font-bold transition-colors duration-200"
                      style={{
                        color: active ? mode.color : 'var(--text-primary)',
                      }}
                    >
                      {mode.label}
                    </p>
                    <p className="text-text-muted mt-0.5 text-[12px] leading-snug">
                      {mode.description}
                    </p>
                  </div>

                  {active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: mode.color }}
                    >
                      <span className="text-[10px] text-white">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Create button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="w-full max-w-xl self-center"
        >
          <BotProtection
            key={botProtectionKey}
            onVerify={setBotProtectionToken}
            onUnavailable={clearBotProtection}
          />

          <Button
            id="create-lobby-btn"
            type="primary"
            disabled={!selectedMode || creating || (botProtectionEnabled && !botProtectionToken)}
            onClick={handleCreate}
            className="w-full"
            size="lg"
          >
            {creating ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Tworze salon...
              </>
            ) : (
              <>Otwórz salon na dzikim zachodzie</>
            )}
          </Button>
          <AgeNotice actionLabel="Otwórz salon" className="mx-auto mt-3 max-w-xl" />
          {!creating && !selectedMode && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-center text-xs"
              style={{ color: 'rgba(255,220,180,0.45)' }}
            >
              Wybierz tryb gry, żeby zacząć
            </motion.p>
          )}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-center text-xs text-red-400"
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </div>

      {proModalOpen && <ProModal onClose={() => setProModalOpen(false)} />}
      {activeHostSession && (
        <ActiveSessionModal
          session={activeHostSession}
          ending={endingExisting}
          onResume={handleResumeExisting}
          onEnd={handleEndExisting}
        />
      )}
    </div>
  )
}

function ActiveSessionModal({
  session,
  ending,
  onResume,
  onEnd,
}: {
  session: ActiveHostSession
  ending: boolean
  onResume: () => void
  onEnd: () => void
}) {
  const statusLabel = session.status === 'active' ? 'Gra trwa' : 'Salon czeka'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#0d0818]/85 p-4 backdrop-blur-sm sm:items-center">
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-lg rounded-2xl border p-5 shadow-2xl sm:p-6"
        style={{
          borderColor: 'var(--saloon-border)',
          background:
            'radial-gradient(circle at top left, rgba(221,84,162,0.18), transparent 34%), linear-gradient(160deg, rgba(26,15,42,0.98), rgba(13,8,24,0.98))',
          boxShadow: '0 24px 80px rgba(0,0,0,0.48), 0 0 36px rgba(226,67,157,0.16)',
        }}
      >
        <div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border"
          style={{
            borderColor: 'rgba(221,84,162,0.42)',
            background: 'rgba(221,84,162,0.12)',
            color: 'var(--neon-pink)',
          }}
        >
          <AlertTriangle size={24} aria-hidden />
        </div>

        <h2 className="text-text-primary text-2xl font-black">Masz aktywną sesję</h2>
        <p className="text-text-muted mt-2 text-sm leading-relaxed">
          Ten telefon lub komputer jest zapisany jako host salonu{' '}
          <span className="text-text-primary font-bold">#{session.pin}</span>. Wróć do tej gry albo
          zakończ ją, żeby utworzyć nową.
        </p>

        <div
          className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border p-4 text-sm"
          style={{ borderColor: 'var(--saloon-border)', background: 'rgba(255,220,180,0.045)' }}
        >
          <div>
            <p className="text-text-muted text-xs font-bold tracking-normal uppercase">Status</p>
            <p className="text-text-primary mt-1 font-semibold">{statusLabel}</p>
          </div>
          <div>
            <p className="text-text-muted text-xs font-bold tracking-normal uppercase">Gracze</p>
            <p className="text-text-primary mt-1 font-semibold">{session.playersCount}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="primary" onClick={onResume} disabled={ending} className="flex-1" size="md">
            <RotateCcw size={18} aria-hidden />
            Wróć do sesji
          </Button>
          <Button type="outline" onClick={onEnd} disabled={ending} className="flex-1" size="md">
            {ending ? (
              <>
                <Loader2 size={18} className="animate-spin" aria-hidden />
                Kończę...
              </>
            ) : (
              <>
                <Trash2 size={18} aria-hidden />
                Zakończ i twórz nową
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
