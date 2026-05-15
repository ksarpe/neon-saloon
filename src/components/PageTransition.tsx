'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useBackButton } from '@/lib/back-button-context'
import { PanelButton } from './ui/panel-button'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { hidden: backHidden, onBack } = useBackButton()
  const isHome = pathname === '/' || pathname === '/graj'

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
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
          className="fixed inset-0 z-10 overflow-y-auto"
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {!isHome && !backHidden && (
        <PanelButton onClick={handleBack} position="top-left">
          <ArrowLeft size={13} />
          Wróć
        </PanelButton>
      )}
    </>
  )
}
