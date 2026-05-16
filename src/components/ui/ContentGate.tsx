'use client'

import { useState } from 'react'
import { useContentAccess } from '@/hooks/useContentAccess'
import { checkAccess, type ContentGate as Gate } from '@/lib/content-access'

interface ContentGateProps {
  gate: Gate
  children: React.ReactNode
  /** Override the default blur+lock fallback with your own UI */
  fallback?: React.ReactNode
  className?: string
}

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

// — Internal components —

function LockedOverlay({ children, className }: { children: React.ReactNode; className?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div
        className={`relative cursor-pointer group ${className ?? ''}`}
        onClick={() => setOpen(true)}
        role="button"
        aria-label="Odblokuj zawartość PRO"
      >
        <div className="blur-sm pointer-events-none select-none" aria-hidden>
          {children}
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 rounded-xl transition-colors group-hover:bg-black/60">
          <span className="text-3xl">🔒</span>
          <span className="text-xs font-bold tracking-widest text-yellow-400 uppercase">PRO</span>
        </div>
      </div>

      {open && <ProModal onClose={() => setOpen(false)} />}
    </>
  )
}

export function ProModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-yellow-500/30 bg-zinc-900 p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 text-5xl">⭐</div>

        <h2 className="mb-1 text-2xl font-bold tracking-wide text-yellow-400">Plan PRO</h2>
        <p className="mb-6 text-sm leading-relaxed text-zinc-400">
          Odblokuj wszystkie tryby gry, paczki kart i ekskluzywne pytania — bez reklam,
          bez limitów.
        </p>

        <div className="mb-3 flex flex-col gap-2 text-left text-sm text-zinc-300">
          {PRO_PERKS.map((perk) => (
            <div key={perk} className="flex items-center gap-2">
              <span className="text-yellow-400">✓</span>
              {perk}
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            disabled
            className="cursor-not-allowed rounded-xl border border-yellow-500/40 bg-yellow-500/10 py-3 px-6 font-bold text-yellow-400/60"
          >
            Wkrótce dostępny
          </button>
          <button
            onClick={onClose}
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
          >
            Zamknij
          </button>
        </div>
      </div>
    </div>
  )
}

const PRO_PERKS = [
  'Wszystkie paczki kart odblokowane',
  'Brak reklam',
  'Tryby ekskluzywne',
  'Priorytetowe wsparcie',
]
