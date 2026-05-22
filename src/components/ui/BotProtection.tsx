'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
const TURNSTILE_WAIT_TIMEOUT_MS = 10_000

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string
          theme?: 'light' | 'dark' | 'auto'
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
        }
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId: string) => void
    }
  }
}

export function isBotProtectionConfigured() {
  return Boolean(TURNSTILE_SITE_KEY)
}

export function BotProtection({
  onVerify,
  onUnavailable,
}: {
  onVerify: (token: string | null) => void
  onUnavailable?: () => void
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetRef = useRef<string | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [scriptError, setScriptError] = useState(false)
  const [retryKey, setRetryKey] = useState(0)
  const scriptSrc =
    retryKey === 0 ? TURNSTILE_SCRIPT_URL : `${TURNSTILE_SCRIPT_URL}&retry=${retryKey}`

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) {
      onVerify(null)
      onUnavailable?.()
      return
    }

    onVerify(null)

    if (window.turnstile) {
      setScriptLoaded(true)
      setScriptError(false)
      return
    }

    const startedAt = Date.now()
    const interval = window.setInterval(() => {
      if (window.turnstile) {
        setScriptLoaded(true)
        setScriptError(false)
        window.clearInterval(interval)
        return
      }

      if (Date.now() - startedAt >= TURNSTILE_WAIT_TIMEOUT_MS) {
        setScriptError(true)
        window.clearInterval(interval)
      }
    }, 250)

    return () => window.clearInterval(interval)
  }, [onUnavailable, onVerify, retryKey])

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return
    if (!scriptLoaded || !containerRef.current || !window.turnstile || widgetRef.current) return

    try {
      widgetRef.current = window.turnstile.render(containerRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: 'dark',
        callback: (token) => {
          setScriptError(false)
          onVerify(token)
        },
        'expired-callback': () => onVerify(null),
        'error-callback': () => {
          onVerify(null)
          setScriptError(true)
        },
      })
    } catch {
      onVerify(null)
      setScriptError(true)
    }

    return () => {
      if (widgetRef.current && window.turnstile) {
        window.turnstile.remove(widgetRef.current)
        widgetRef.current = null
      }
    }
  }, [onVerify, scriptLoaded, retryKey])

  if (!TURNSTILE_SITE_KEY) return null

  return (
    <>
      <Script
        id={`cloudflare-turnstile-${retryKey}`}
        key={retryKey}
        src={scriptSrc}
        strategy="afterInteractive"
        onLoad={() => {
          setScriptLoaded(true)
          setScriptError(false)
        }}
        onReady={() => {
          setScriptLoaded(true)
          setScriptError(false)
        }}
        onError={() => setScriptError(true)}
      />
      <div className="flex min-h-[65px] flex-col items-center justify-center gap-2">
        <div ref={containerRef} />
        {!scriptLoaded && !scriptError && (
          <p className="text-text-muted text-center text-xs">Ładuję zabezpieczenie...</p>
        )}
        {scriptError && (
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-xs text-red-300">
              Nie udało się załadować zabezpieczenia Cloudflare.
            </p>
            <button
              type="button"
              onClick={() => {
                if (widgetRef.current && window.turnstile) {
                  window.turnstile.remove(widgetRef.current)
                  widgetRef.current = null
                }
                setScriptLoaded(Boolean(window.turnstile))
                setScriptError(false)
                onVerify(null)
                setRetryKey((key) => key + 1)
              }}
              className="rounded-full border border-red-300/30 px-3 py-1 text-xs font-bold text-red-100 transition-colors hover:border-red-200/60 hover:bg-red-500/10"
            >
              Spróbuj ponownie
            </button>
          </div>
        )}
      </div>
    </>
  )
}
