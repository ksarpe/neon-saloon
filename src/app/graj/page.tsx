'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function GrajPage() {
  const router = useRouter()

  return (
    <main className="relative -mt-14 flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-6">
      <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-10 text-center">
        {/* Hero */}
        <h1
          className="shimmer-text text-[clamp(2rem,14vw,7rem)] leading-[0.9] tracking-wide whitespace-nowrap uppercase"
          style={{ fontFamily: 'var(--font-logo)' }}
        >
          Last Rodeo
        </h1>

        {/* Action buttons */}
        <div className="flex w-full flex-col gap-4">
          {/* Host */}
          <motion.button
            id="host-game-btn"
            whileTap={{ scale: 0.97 }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 34px var(--sheriff-pink-glow), 0 0 70px var(--sheriff-pink-dim)',
            }}
            onClick={() => router.push('/graj/host')}
            className="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border-2 p-5 text-left transition-colors"
            style={{
              borderColor: 'var(--sheriff-pink)',
              backgroundColor: 'var(--sheriff-pink-dim)',
              boxShadow:
                '0 0 14px var(--sheriff-pink-glow), 0 0 34px rgba(152,151,241,0.16), inset 0 0 18px rgba(255,255,255,0.04)',
            }}
          >
            <div className="pointer-events-none absolute inset-y-0 -left-[100%] z-0 w-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />

            <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center">
              <Image src="/icons/sheriff.png" alt="sheriff icon" width={64} height={64} />
            </div>
            <div className="relative z-10 flex-1">
              <p
                className="text-base font-bold transition-colors"
                style={{ color: 'var(--sheriff-pink)' }}
              >
                Chcę być szeryfem.
              </p>
              <p className="mt-0.5 text-xs" style={{ color: 'rgba(255,220,180,0.6)' }}>
                Zarządzaj grą.
              </p>
            </div>
            <ChevronRight
              size={16}
              className="relative z-10"
              style={{ color: 'rgba(255,220,180,0.5)' }}
            />
          </motion.button>

          {/* Join */}
          <motion.button
            id="join-game-btn"
            whileTap={{ scale: 0.97 }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 34px var(--neon-pink-glow), 0 0 70px var(--neon-pink-dim)',
            }}
            onClick={() => router.push('/graj/join')}
            className="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border-2 p-5 text-left transition-colors"
            style={{
              borderColor: 'var(--neon-pink)',
              backgroundColor: 'var(--neon-pink-dim)',
              boxShadow:
                '0 0 14px var(--neon-pink-glow), 0 0 34px rgba(226,67,157,0.16), inset 0 0 18px rgba(255,255,255,0.04)',
            }}
          >
            <div className="pointer-events-none absolute inset-y-0 -left-[100%] z-0 w-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />

            <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full">
              <Image src="/icons/boots.png" alt="players icon" width={64} height={64} />
            </div>
            <div className="relative z-10 flex-1">
              <p className="text-base font-bold" style={{ color: 'var(--neon-pink)' }}>
                Dołącz do rozgrywki kowbojko.
              </p>
              <p className="mt-0.5 text-xs" style={{ color: 'rgba(255,220,180,0.6)' }}>
                Wpisz PIN lub zeskanuj kod QR.
              </p>
            </div>
            <ChevronRight
              size={16}
              className="relative z-10"
              style={{ color: 'rgba(255,220,180,0.5)' }}
            />
          </motion.button>
        </div>
      </div>
    </main>
  )
}
