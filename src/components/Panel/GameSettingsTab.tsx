'use client'

import { AlertCircle, CheckCircle2, Loader2, Save } from 'lucide-react'
import { useEffect, useState } from 'react'

import { BR_AUTO_NEXT_SECONDS, BR_TIMER_SECONDS, REVEAL_COUNTDOWN_SECONDS } from '@/config/game'

import { panelButtonHover } from './shared'

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

export function GameSettingsTab() {
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
          className="mb-1 text-xs font-semibold tracking-normal uppercase"
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
                className="flex items-center gap-2 rounded-xl border px-5 py-2.5 text-xs font-bold tracking-normal uppercase transition-colors disabled:opacity-50"
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

