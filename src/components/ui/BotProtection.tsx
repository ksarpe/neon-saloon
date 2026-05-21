'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

const TURNSTILE_SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

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

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) {
      onVerify(null)
      onUnavailable?.()
      return
    }
    if (!scriptLoaded || !containerRef.current || !window.turnstile || widgetRef.current) return

    widgetRef.current = window.turnstile.render(containerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: 'dark',
      callback: (token) => onVerify(token),
      'expired-callback': () => onVerify(null),
      'error-callback': () => onVerify(null),
    })

    return () => {
      if (widgetRef.current && window.turnstile) {
        window.turnstile.remove(widgetRef.current)
        widgetRef.current = null
      }
    }
  }, [onUnavailable, onVerify, scriptLoaded])

  if (!TURNSTILE_SITE_KEY) return null

  return (
    <>
      <Script
        src={TURNSTILE_SCRIPT_URL}
        strategy="afterInteractive"
        onReady={() => setScriptLoaded(true)}
      />
      <div className="flex min-h-[65px] justify-center">
        <div ref={containerRef} />
      </div>
    </>
  )
}
