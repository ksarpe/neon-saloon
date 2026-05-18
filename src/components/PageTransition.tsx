'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft, LogIn, Settings } from 'lucide-react'
import { useBackButton } from '@/lib/back-button-context'
import { useSession } from 'next-auth/react'

const NAV_BTN =
  'flex items-center gap-2 rounded-xl border border-[#ffdcb4]/25 bg-[#0a0414]/25 px-4 py-2 text-xs font-semibold text-[#ffdcb4]/85 backdrop-blur-sm transition-all duration-300 hover:border-[#ffd700]/55 hover:bg-[#ffd700]/12 hover:text-[#ffeb96] hover:shadow-[0_0_14px_rgba(255,215,0,0.18)] active:scale-[0.96]'

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
        <div className="fixed top-0 left-0 right-0 z-20 flex h-14 items-center justify-between px-4">
          {/* Left slot: Wróć */}
          {showBack ? (
            <motion.button
              onClick={handleBack}
              className={NAV_BTN}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ArrowLeft size={13} />
              Wróć
            </motion.button>
          ) : (
            <span /> /* spacer so session button stays right */
          )}

          {/* Right slot: login / panel */}
          {showSession && (
            <motion.button
              onClick={() => router.push(session ? '/panel' : '/login')}
              className={NAV_BTN}
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
                  {session.user?.name ?? 'Panel'}
                </>
              ) : (
                <>
                  <LogIn size={13} />
                  Zaloguj się
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
          className={`fixed inset-0 z-10 overflow-y-auto${showHeader ? ' pt-14' : ''}`}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
