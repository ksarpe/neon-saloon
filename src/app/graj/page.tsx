'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Tv, Smartphone, ChevronRight } from 'lucide-react'

export default function GrajPage() {
  const router = useRouter()

  return (
    <main className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-6">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[2]">
        <div
          className="absolute top-[-25%] left-[-15%] h-[65vw] w-[65vw] rounded-full opacity-[0.15]"
          style={{
            background: 'radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute right-[-15%] bottom-[-25%] h-[65vw] w-[65vw] rounded-full opacity-[0.15]"
          style={{
            background: 'radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-[10] flex w-full max-w-lg flex-col items-center gap-10 text-center">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="shimmer-text text-6xl leading-none tracking-widest sm:text-8xl"
            style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', cursive" }}
          >
            Last rodeo Andżeliki
          </h1>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex w-full flex-col gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Host */}
          <motion.button
            id="host-game-btn"
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/graj/host')}
            className="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border-2 p-5 text-left"
            style={{
              borderColor: 'var(--sheriff-gold)',
              backgroundColor: 'rgba(255,215,0,0.12)',
            }}
          >
            <div className="pointer-events-none absolute inset-y-0 -left-[100%] z-0 w-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />

            <div
              className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(255,215,0,0.15)' }}
            >
              <Tv size={22} style={{ color: 'var(--sheriff-gold)' }} />
            </div>
            <div className="relative z-10 flex-1">
              <p
                className="text-base font-bold transition-colors"
                style={{ color: 'var(--sheriff-gold)' }}
              >
                Chcę być szeryfem.
              </p>
              <p className="mt-0.5 text-xs" style={{ color: 'rgba(255,220,180,0.6)' }}>
                Wyświetl na dużym ekranie / TV
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
            onClick={() => router.push('/graj/join')}
            className="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border-2 p-5 text-left"
            style={{
              borderColor: 'var(--neon-pink)',
              backgroundColor: 'var(--neon-pink-dim)',
            }}
          >
            <div className="pointer-events-none absolute inset-y-0 -left-[100%] z-0 w-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />

            <div
              className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: 'rgba(255,16,240,0.15)' }}
            >
              <Smartphone size={22} style={{ color: 'var(--neon-pink)' }} />
            </div>
            <div className="relative z-10 flex-1">
              <p className="text-base font-bold" style={{ color: 'var(--neon-pink)' }}>
                Dołącz do rozgrywki kowbojko.
              </p>
              <p className="mt-0.5 text-xs" style={{ color: 'rgba(255,220,180,0.6)' }}>
                Wpisz kod szeryfa na telefonie.
              </p>
            </div>
            <ChevronRight
              size={16}
              className="relative z-10"
              style={{ color: 'rgba(255,220,180,0.5)' }}
            />
          </motion.button>
        </motion.div>
      </div>

    </main>
  )
}
