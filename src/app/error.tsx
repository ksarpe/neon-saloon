'use client'

import { motion } from 'framer-motion'
import { Home, RefreshCw } from 'lucide-react'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to an external observability service here if configured.
    console.error('[ErrorBoundary]', error)
  }, [error])

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex w-full max-w-sm flex-col items-center gap-6 text-center"
      >
        {/* Heading */}
        <div className="flex flex-col gap-2">
          <h1
            className="text-3xl font-black tracking-wide uppercase"
            style={{ fontFamily: 'var(--font-app)', color: 'var(--neon-pink)' }}
          >
            Coś poszło nie tak
          </h1>
          <p className="text-text-muted text-sm leading-relaxed">
            Wystąpił nieoczekiwany błąd. Możesz spróbować ponownie lub wrócić na stronę główną.
          </p>
          {error.digest && (
            <p className="mt-1 font-mono text-xs" style={{ color: 'rgba(255,220,180,0.3)' }}>
              {error.digest}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col gap-3">
          <Button type="primary" onClick={reset} className="w-full">
            <RefreshCw size={15} />
            Spróbuj ponownie
          </Button>
          <Button type="outline" href="/" className="w-full">
            <Home size={15} />
            Strona główna
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
