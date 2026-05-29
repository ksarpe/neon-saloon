'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

// Minimalny, informacyjny baner cookies. Serwis używa wyłącznie cookies niezbędnych
// i funkcjonalnych (brak analityki/marketingu śledzącego), dlatego wystarczy informacja
// + potwierdzenie. Wybór zapamiętujemy w localStorage (klucz w konwencji `last-rodeo-`),
// żeby nie pokazywać banera ponownie.
const STORAGE_KEY = 'last-rodeo-cookie-ack'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) !== '1') {
        setVisible(true)
      }
    } catch {
      // brak dostępu do localStorage (np. tryb prywatny) — pokaż baner bezpiecznie
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Informacja o plikach cookies"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4"
    >
      <div
        className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl border p-4 shadow-2xl sm:flex-row sm:items-center sm:justify-between"
        style={{
          borderColor: 'rgba(255,16,240,0.28)',
          background: 'linear-gradient(160deg, rgba(26,15,42,0.98), rgba(13,8,24,0.98))',
          boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          color: 'rgba(240,223,192,0.82)',
        }}
      >
        <p className="text-xs leading-relaxed sm:text-[13px]">
          Używamy wyłącznie niezbędnych i funkcjonalnych plików cookies, aby Serwis działał
          poprawnie (m.in. logowanie, bezpieczeństwo i Twoje ustawienia). Nie stosujemy śledzenia
          ani reklam.{' '}
          <Link
            href="/polityka-prywatnosci"
            className="underline"
            style={{ color: 'var(--neon-pink)' }}
          >
            Polityka prywatności
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-xl border-2 px-5 py-2.5 text-xs font-black tracking-normal uppercase transition-colors"
          style={{
            borderColor: 'var(--neon-pink)',
            backgroundColor: 'rgba(255,16,240,0.12)',
            color: 'var(--neon-pink)',
          }}
        >
          OK, rozumiem
        </button>
      </div>
    </div>
  )
}
