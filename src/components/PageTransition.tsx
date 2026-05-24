'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, LogIn, Settings } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { useBackButton } from '@/lib/back-button-context'

const NAV_BTN =
  'pointer-events-auto flex h-10 min-w-10 items-center justify-center gap-2 rounded-xl border border-[#ffdcb4]/25 bg-[#0a0414]/25 px-3 text-xs font-semibold text-[#ffdcb4]/85 backdrop-blur-sm transition-all duration-300 hover:border-[#ffd700]/55 hover:bg-[#ffd700]/12 hover:text-[#ffeb96] hover:shadow-[0_0_14px_rgba(255,215,0,0.18)] active:scale-[0.96] sm:px-4'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { hidden: backHidden, onBack } = useBackButton()
  const { data: session, status } = useSession()

  // Back button: hidden on root pages, hidden when game screen sets backHidden=true
  const isHome = pathname === '/' || pathname === '/graj'
  const showBack = !isHome && !backHidden

  // Session button (login / panel): only on the two lobby routes
  const showSession = pathname === '/graj' || pathname === '/graj/host'

  const showHeader = showBack || showSession

  function getBackHref(): string {
    if (pathname.startsWith('/graj/')) return '/graj'
    if (pathname === '/panel') return '/graj'
    if (pathname === '/login') return '/'
    return '/'
  }

  const handleBack = () => {
    if (onBack) onBack()
    else router.push(getBackHref())
  }

  return (
    <>
      {/* ── Sticky header bar ──────────────────────────────────────────── */}
      {showHeader && (
        <div className="pointer-events-none fixed top-0 right-0 left-0 z-20 flex h-14 items-center justify-between px-4">
          {/* Left slot: Wróć */}
          {showBack ? (
            <motion.button
              onClick={handleBack}
              className={NAV_BTN}
              aria-label="Wróć"
              title="Wróć"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ArrowLeft size={13} />
              <span className="hidden sm:inline">Wróć</span>
            </motion.button>
          ) : (
            <span /> /* spacer so session button stays right */
          )}

          {/* Right slot: login / panel */}
          {showSession && (
            <motion.button
              onClick={() => router.push(session ? '/panel' : '/login')}
              className={NAV_BTN}
              aria-label={session ? (session.user?.name ?? 'Panel') : 'Zaloguj się'}
              title={session ? (session.user?.name ?? 'Panel') : 'Zaloguj się'}
              initial={{ opacity: 0, x: 8 }}
              animate={{
                opacity: status === 'loading' ? 0 : 1,
                x: status === 'loading' ? 8 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {session ? (
                <>
                  <Settings size={13} />
                  <span className="hidden max-w-32 truncate sm:inline">
                    {session.user?.name ?? 'Panel'}
                  </span>
                </>
              ) : (
                <>
                  <LogIn size={13} />
                  <span className="hidden sm:inline">Zaloguj się</span>
                </>
              )}
            </motion.button>
          )}
        </div>
      )}

      {/* ── Page content ────────────────────────────────────────────────── */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: pathname === '/graj' ? 1 : 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="relative z-10 min-h-dvh overflow-x-hidden"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
