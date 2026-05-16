'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, Brain, Heart, Tv, BookOpen, TrendingUp, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GameModeCard {
  id: string
  icon: LucideIcon
  label: string
  desc: string
  gradient: string
  accent: string
}

const GAME_MODES: GameModeCard[] = [
  {
    id: 'trivia',
    icon: Brain,
    label: 'Quiz o Pannie Młodej',
    desc: 'Kto zna ją najlepiej? Odpowiadajcie jednocześnie.',
    gradient: 'linear-gradient(160deg, #2d0040 0%, #6b0080 55%, #c0458a 100%)',
    accent: '#dd54a2',
  },
  {
    id: 'categories',
    icon: BookOpen,
    label: 'Skategoryzowane pytania',
    desc: 'Anatomia, historia, kultura — pytania dla całej ekipy.',
    gradient: 'linear-gradient(160deg, #0d0030 0%, #2a0075 55%, #8b72e0 100%)',
    accent: '#a78bfa',
  },
  {
    id: 'never',
    icon: Heart,
    label: 'Nigdy Przenigdy',
    desc: 'Karty z wyznaniami. Podniesione ręce, czerwone twarze.',
    gradient: 'linear-gradient(160deg, #1a0c00 0%, #4a2800 55%, #c47d00 100%)',
    accent: '#f59e0b',
  },
  {
    id: 'highlow',
    icon: TrendingUp,
    label: 'Mniej czy Więcej',
    desc: 'Dwie drużyny, zgadywanie na żywo. Wygrywają sprytniejsi.',
    gradient: 'linear-gradient(160deg, #001a0d 0%, #004020 55%, #0d9e6a 100%)',
    accent: '#10b981',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Host otwiera salon',
    desc: 'Jeden ekran na TV lub laptopie — wchodzi na /graj i klika Chcę być szeryfem.',
    color: 'var(--sheriff-gold)',
  },
  {
    step: '02',
    title: 'Uczestniczki skanują',
    desc: 'Każda wchodzi na stronę na telefonie, wpisuje PIN wyświetlony przez hosta.',
    color: 'var(--neon-pink)',
  },
  {
    step: '03',
    title: 'Chaos i śmiech gwarantowane',
    desc: 'Host przełącza karty, wyniki lecą na żywo. Rywalizujcie, wyznawajcie, śmiejcie się.',
    color: '#a78bfa',
  },
]

function ModeCardContent({ mode, isActive }: { mode: GameModeCard; isActive: boolean }) {
  return (
    <>
      {/* Top edge shine */}
      <div
        className="absolute top-0 right-0 left-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${mode.accent}70, transparent)`,
        }}
      />

      {/* Large decorative icon — top-right corner */}
      <div className="absolute -top-10 -right-10 opacity-[0.08]">
        <mode.icon style={{ color: mode.accent, width: '260px', height: '260px' }} />
      </div>

      {/* Centred icon badge */}
      <div className="absolute inset-0 flex items-center justify-center pb-20">
        <div
          className="flex items-center justify-center rounded-[20px]"
          style={{
            width: isActive ? 88 : 68,
            height: isActive ? 88 : 68,
            background: `${mode.accent}1c`,
            border: `1px solid ${mode.accent}40`,
            boxShadow: `0 0 28px ${mode.accent}22`,
            transition: 'width 0.4s, height 0.4s',
          }}
        >
          <mode.icon
            style={{
              color: mode.accent,
              width: isActive ? 36 : 28,
              height: isActive ? 36 : 28,
              transition: 'width 0.4s, height 0.4s',
            }}
          />
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-black/65 to-transparent" />

      {/* Label pill */}
      <div className="absolute right-0 bottom-6 left-0 flex justify-center px-6">
        <span
          className="rounded-full font-semibold whitespace-nowrap text-white"
          style={{
            fontSize: isActive ? '13px' : '11px',
            padding: isActive ? '8px 18px' : '6px 14px',
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'font-size 0.4s, padding 0.4s',
          }}
        >
          {mode.label}
        </span>
      </div>
    </>
  )
}

export default function LandingPage() {
  const router = useRouter()
  const [activeMode, setActiveMode] = useState(0)
  const prevActiveRef = useRef(0)

  useEffect(() => {
    prevActiveRef.current = activeMode
  }, [activeMode])

  const totalModes = GAME_MODES.length
  const halfModes = totalModes / 2
  const wrapOffset = (i: number, active: number) => {
    let o = i - active
    if (o > halfModes) o -= totalModes
    else if (o < -halfModes) o += totalModes
    return o
  }
  const goNext = () => setActiveMode((a) => (a + 1) % totalModes)
  const goPrev = () => setActiveMode((a) => (a - 1 + totalModes) % totalModes)

  return (
    <main className="relative w-full overflow-x-hidden">
      {/* ── Ambient glows ────────────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[2]">
        <div
          className="absolute top-[-20%] left-[-10%] h-[60vw] w-[60vw] rounded-full"
          style={{
            background: 'radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)',
            filter: 'blur(120px)',
            opacity: 0.12,
          }}
        />
        <div
          className="absolute right-[-10%] bottom-[-10%] h-[55vw] w-[55vw] rounded-full"
          style={{
            background: 'radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)',
            filter: 'blur(120px)',
            opacity: 0.1,
          }}
        />
      </div>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative z-[10] flex min-h-dvh flex-col items-center justify-center gap-8 px-6 text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="shimmer-text text-[clamp(3.5rem,14vw,9rem)] leading-[0.9] tracking-widest"
          style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', cursive" }}
        >
          Last Rodeo
          <br />
          Andżeliki
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-md text-xl leading-relaxed"
          style={{ color: 'rgba(240,223,192,0.7)' }}
        >
          Zadaj pytanie. Odkryj prawdę. Nie żałuj.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex w-full max-w-sm flex-col gap-3 sm:flex-row"
        >
          <Button onClick={() => router.push('/graj')} type="primary" className="flex-1">
            Zagrajcie teraz
          </Button>

          <Button onClick={() => router.push('/graj/join')} type="outline">
            Dołącz z kodem
          </Button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1"
          style={{ color: 'rgba(255,220,180,0.3)' }}
        >
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronRight size={14} className="rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="relative z-[10] mx-auto flex max-w-4xl flex-col items-center gap-16 px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2
            className="shimmer-text text-5xl tracking-widest sm:text-6xl"
            style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', cursive" }}
          >
            Jak to działa?
          </h2>
          <p className="mt-3 text-sm" style={{ color: 'rgba(240,223,192,0.5)' }}>
            Trzy kroki do pełnego chaosu.
          </p>
        </motion.div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          {HOW_IT_WORKS.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex flex-col gap-4 rounded-2xl border p-6"
              style={{
                borderColor: 'rgba(255,220,180,0.1)',
                backgroundColor: 'rgba(13,8,24,0.5)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span
                className="text-4xl font-black tracking-tight"
                style={{
                  fontFamily: "var(--font-bebas), 'Bebas Neue', cursive",
                  color: item.color,
                  opacity: 0.9,
                }}
              >
                {item.step}
              </span>
              <div>
                <p className="mb-1 text-base font-bold" style={{ color: item.color }}>
                  {item.title}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,223,192,0.55)' }}>
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── GAME MODES ────────────────────────────────────────────────────── */}
      <section className="relative z-[10] flex w-full flex-col items-center gap-12 overflow-hidden py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-6 text-center"
        >
          <h2
            className="shimmer-text text-5xl tracking-widest sm:text-6xl"
            style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', cursive" }}
          >
            Tryby gry
          </h2>
          <p className="mt-3 text-sm" style={{ color: 'rgba(240,223,192,0.5)' }}>
            Każda runda inna, każda niezapomniana.
          </p>
        </motion.div>

        {/* Featured carousel — center card prominent, sides peek */}
        <div
          className="relative flex w-full items-center justify-center"
          style={{ height: 'clamp(440px, 62vh, 640px)' }}
        >
          {GAME_MODES.map((mode, i) => {
            const offset = wrapOffset(i, activeMode)
            const prevOffset = wrapOffset(i, prevActiveRef.current)
            const isWrapping = Math.abs(offset - prevOffset) > 1.5
            const absOffset = Math.abs(offset)
            const isActive = absOffset === 0

            return (
              <motion.button
                key={mode.id}
                type="button"
                onClick={() => setActiveMode(i)}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) goNext()
                  else if (info.offset.x > 60) goPrev()
                }}
                animate={{
                  x: `${offset * 38}vw`,
                  scale: isActive ? 1 : 0.72,
                  opacity: absOffset > 1 ? 0 : 1,
                  zIndex: 20 - absOffset,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 220,
                  damping: 30,
                  x: isWrapping ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 30 },
                  opacity: { duration: 0.35 },
                }}
                className="absolute cursor-pointer overflow-hidden select-none"
                style={{
                  width: 'min(620px, 78vw)',
                  height: 'clamp(420px, 60vh, 620px)',
                  borderRadius: '28px',
                  background: mode.gradient,
                  border: `1px solid ${mode.accent}35`,
                  boxShadow: isActive
                    ? `0 24px 80px ${mode.accent}30, 0 0 1px ${mode.accent}50`
                    : `0 10px 40px rgba(0,0,0,0.35)`,
                  filter: isActive ? 'none' : 'brightness(0.7) saturate(0.85)',
                  WebkitTapHighlightColor: 'transparent',
                  pointerEvents: absOffset > 1 ? 'none' : 'auto',
                }}
              >
                <ModeCardContent mode={mode} isActive={isActive} />
              </motion.button>
            )
          })}
        </div>

        {/* Description for active mode */}
        <motion.p
          key={activeMode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md px-6 text-center text-sm leading-relaxed"
          style={{ color: 'rgba(240,223,192,0.7)' }}
        >
          {GAME_MODES[activeMode].desc}
        </motion.p>

        {/* Navigation dots */}
        <div className="flex items-center gap-2">
          {GAME_MODES.map((mode, i) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveMode(i)}
              aria-label={`Pokaż tryb ${mode.label}`}
              className="cursor-pointer rounded-full transition-all duration-300"
              style={{
                width: i === activeMode ? '28px' : '8px',
                height: '8px',
                backgroundColor:
                  i === activeMode ? GAME_MODES[activeMode].accent : 'rgba(255,220,180,0.25)',
              }}
            />
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="relative z-[10] flex flex-col items-center gap-8 px-6 py-32 text-center">
        {/* Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(221,84,162,0.12) 0%, transparent 70%)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex h-20 w-20 items-center justify-center rounded-3xl"
          style={{
            backgroundColor: 'rgba(221,84,162,0.1)',
            border: '2px solid rgba(221,84,162,0.3)',
            boxShadow: '0 0 40px rgba(221,84,162,0.2)',
          }}
        >
          <Tv size={36} style={{ color: 'var(--neon-pink)' }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="shimmer-text text-5xl tracking-widest sm:text-7xl"
          style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', cursive" }}
        >
          Gotowe na
          <br />
          Wielki Finał?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="max-w-sm text-sm leading-relaxed"
          style={{ color: 'rgba(240,223,192,0.6)' }}
        >
          Zaproście uczestniczki, podłączcie TV i niech się zacznie ostatnie wielkie rodeo
          Andżeliki.
        </motion.p>

        <Button onClick={() => router.push('/graj')} type="primary" size='lg'>
          Wejdź do salonu
        </Button>
      </section>

      {/* bottom padding for global footer */}
      <div className="h-16" />
    </main>
  )
}
