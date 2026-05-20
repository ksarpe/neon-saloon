'use client'

import { Zap } from 'lucide-react'
import { usePathname } from 'next/navigation'

const FOOTER_PATHS = ['/', '/login']

export function AppFooter() {
  const pathname = usePathname()

  if (!FOOTER_PATHS.includes(pathname)) return null

  return (
    <footer
      className="pointer-events-none fixed right-0 bottom-0 left-0 z-20 flex items-center justify-center gap-2 pt-6 pb-3"
      style={{
        background: 'linear-gradient(to top, rgba(10,4,20,0.75) 0%, transparent 100%)',
      }}
    >
      <Zap size={10} style={{ color: 'var(--neon-pink)' }} />
      <span
        className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 text-[11px] tracking-wide"
        style={{ color: 'rgba(255,220,180,0.4)' }}
      >
        Last Rodeo{' '}
        <span style={{ color: 'rgba(255,220,180,0.22)' }}>
          v{process.env.NEXT_PUBLIC_APP_VERSION}
        </span>
        {' · '}
        <a href="https://aknsoftware.com" style={{ color: 'rgba(255,220,180,0.4)' }}>
          AKN Software
        </a>
        {' · '}
        <a href="/regulamin" style={{ color: 'rgba(255,220,180,0.4)' }}>
          Regulamin
        </a>
        {' · '}
        <a href="/polityka-prywatnosci" style={{ color: 'rgba(255,220,180,0.4)' }}>
          Polityka prywatności
        </a>
      </span>
    </footer>
  )
}
