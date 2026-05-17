'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, Brain, Heart, BookOpen, TrendingUp, Check, Minus, type LucideIcon } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'

interface GameModeCard {
  id: string
  icon: LucideIcon
  label: string
  gradient: string
  accent: string
  isPremium?: boolean
}

const GAME_MODES: GameModeCard[] = [
  {
    id: 'trivia',
    icon: Brain,
    label: 'Quiz o Pannie Młodej',
    gradient: 'linear-gradient(160deg, #2d0040 0%, #6b0080 55%, #c0458a 100%)',
    accent: '#dd54a2',
  },
  {
    id: 'categories',
    icon: BookOpen,
    label: 'Skategoryzowane pytania',
    gradient: 'linear-gradient(160deg, #0d0030 0%, #2a0075 55%, #8b72e0 100%)',
    accent: '#a78bfa',
  },
  {
    id: 'never',
    icon: Heart,
    label: 'Nigdy Przenigdy',
    gradient: 'linear-gradient(160deg, #1a0c00 0%, #4a2800 55%, #c47d00 100%)',
    accent: '#f59e0b',
  },
  {
    id: 'highlow',
    icon: TrendingUp,
    label: 'Mniej czy Więcej',
    gradient: 'linear-gradient(160deg, #001a0d 0%, #004020 55%, #0d9e6a 100%)',
    accent: '#10b981',
    isPremium: true,
  },
]

const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Darmowy',
    price: null,
    period: null,
    badge: null,
    accent: 'rgba(255,220,180,0.55)',
    borderColor: 'rgba(255,220,180,0.10)',
    bgColor: 'rgba(13,8,24,0.45)',
    isPrimary: false,
    cta: 'Zagraj za darmo',
    features: [
      { label: '4 tryby gry', ok: true },
      { label: 'Nielimitowani gracze', ok: true },
      { label: 'Wyniki na żywo', ok: true },
      { label: 'Mniej czy Więcej', ok: false },
      { label: 'Własne pytania', ok: false },
      { label: 'Przyszłe tryby gratis', ok: false },
    ],
  },
  {
    id: 'monthly',
    name: 'PRO',
    price: '19,99 zł',
    period: '/ mies.',
    badge: null,
    accent: 'var(--neon-pink)',
    borderColor: 'rgba(255,16,240,0.22)',
    bgColor: 'rgba(13,8,24,0.6)',
    isPrimary: false,
    cta: 'Kup miesięczny',
    features: [
      { label: '4 tryby gry', ok: true },
      { label: 'Nielimitowani gracze', ok: true },
      { label: 'Wyniki na żywo', ok: true },
      { label: 'Mniej czy Więcej', ok: true },
      { label: 'Własne pytania', ok: true },
      { label: 'Przyszłe tryby gratis', ok: false },
    ],
  },
  {
    id: 'lifetime',
    name: 'PRO Dożywotni',
    price: '69 zł',
    period: 'jednorazowo',
    badge: 'Najlepsza wartość',
    accent: 'var(--sheriff-gold)',
    borderColor: 'rgba(255,180,0,0.28)',
    bgColor: 'rgba(13,8,24,0.6)',
    isPrimary: true,
    cta: 'Kup dożywotni',
    features: [
      { label: '4 tryby gry', ok: true },
      { label: 'Nielimitowani gracze', ok: true },
      { label: 'Wyniki na żywo', ok: true },
      { label: 'Mniej czy Więcej', ok: true },
      { label: 'Własne pytania', ok: true },
      { label: 'Przyszłe tryby gratis', ok: true },
    ],
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Host otwiera salon',
    desc: 'Jeden ekran na TV lub laptopie — wchodzi na /graj i klika Chcę być szeryfem.',
    color: 'var(--sheriff-pink)',
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
      {/* PRO badge */}
      {mode.isPremium && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-full border border-yellow-500/50 bg-black/60 px-2.5 py-1 text-[10px] font-bold tracking-widest text-yellow-400 uppercase backdrop-blur-sm">
          🔒 PRO
        </div>
      )}

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
  const { data: session } = useSession()
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

  const handlePricingCta = (planId: string) => {
    if (planId === 'free') return router.push('/graj')
    router.push(session ? '/panel' : '/login')
  }

  return (
    <main className="relative w-full overflow-x-hidden">
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative z-10 flex min-h-dvh flex-col items-center justify-center gap-8 px-6 text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="shimmer-text text-[clamp(2rem,12vw,10rem)] leading-[0.9] tracking-wide whitespace-nowrap uppercase"
          style={{ fontFamily: 'var(--font-logo)' }}
        >
          Last Rodeo
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
            Zagraj teraz
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
      <section className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-16 px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2
            className="shimmer-text text-5xl tracking-widest sm:text-6xl"
            style={{ fontFamily: 'var(--font-app)' }}
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
                  fontFamily: 'var(--font-app)',
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
      <section className="relative z-10 flex w-full flex-col items-center gap-12 overflow-hidden py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="px-6 text-center"
        >
          <h2
            className="shimmer-text text-5xl tracking-widest sm:text-6xl"
            style={{ fontFamily: 'var(--font-app)' }}
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

      {/* ── PRICING ───────────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-16 px-6 py-24">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2
            className="shimmer-text text-5xl tracking-widest sm:text-6xl"
            style={{ fontFamily: 'var(--font-app)' }}
          >
            Plany
          </h2>
          <p className="mt-3 text-sm" style={{ color: 'rgba(240,223,192,0.5)' }}>
            Jedno wesele. Jedna szansa. Spraw żeby było epickie.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col rounded-2xl border p-6"
              style={{
                borderColor: plan.borderColor,
                backgroundColor: plan.bgColor,
                backdropFilter: 'blur(12px)',
                boxShadow: plan.isPrimary
                  ? '0 0 0 1px rgba(255,180,0,0.15), 0 24px 64px rgba(255,180,0,0.07)'
                  : 'none',
              }}
            >
              {/* Top edge glow for highlighted card */}
              {plan.isPrimary && (
                <div
                  className="pointer-events-none absolute top-0 right-0 left-0 h-px rounded-t-2xl"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(255,180,0,0.6), transparent)',
                  }}
                />
              )}

              {/* Badge */}
              {plan.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-0.5 text-[10px] font-bold tracking-widest uppercase"
                  style={{ background: 'var(--sheriff-gold)', color: '#0d0a0b' }}
                >
                  {plan.badge}
                </div>
              )}

              {/* Plan name */}
              <p
                className="mb-2 text-[10px] font-bold tracking-widest uppercase"
                style={{ color: plan.accent }}
              >
                {plan.name}
              </p>

              {/* Price */}
              <div className="mb-6 flex items-end gap-1.5">
                {plan.price ? (
                  <>
                    <span
                      className="text-4xl font-black leading-none"
                      style={{ color: 'rgba(240,223,192,0.92)', fontFamily: 'var(--font-app)' }}
                    >
                      {plan.price}
                    </span>
                    <span className="mb-0.5 text-xs" style={{ color: 'rgba(240,223,192,0.4)' }}>
                      {plan.period}
                    </span>
                  </>
                ) : (
                  <span
                    className="text-4xl font-black leading-none"
                    style={{ color: 'rgba(240,223,192,0.92)', fontFamily: 'var(--font-app)' }}
                  >
                    Bezpłatnie
                  </span>
                )}
              </div>

              {/* Features */}
              <ul className="mb-8 flex flex-col gap-2.5">
                {plan.features.map((f) => (
                  <li key={f.label} className="flex items-center gap-2.5 text-xs">
                    {f.ok ? (
                      <Check size={13} className="shrink-0" style={{ color: plan.accent }} />
                    ) : (
                      <Minus
                        size={13}
                        className="shrink-0"
                        style={{ color: 'rgba(255,220,180,0.18)' }}
                      />
                    )}
                    <span
                      style={{
                        color: f.ok ? 'rgba(240,223,192,0.75)' : 'rgba(240,223,192,0.28)',
                      }}
                    >
                      {f.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                type="button"
                onClick={() => handlePricingCta(plan.id)}
                className="mt-auto w-full cursor-pointer rounded-xl py-2.5 text-sm font-semibold tracking-wide transition-all duration-200"
                style={
                  plan.isPrimary
                    ? {
                        background: 'var(--sheriff-gold)',
                        color: '#0d0a0b',
                        boxShadow: '0 0 24px rgba(255,180,0,0.18)',
                      }
                    : plan.id === 'monthly'
                      ? {
                          background: 'rgba(255,16,240,0.10)',
                          color: 'var(--neon-pink)',
                          border: '1px solid rgba(255,16,240,0.22)',
                        }
                      : {
                          background: 'rgba(255,220,180,0.07)',
                          color: 'rgba(240,223,192,0.65)',
                          border: '1px solid rgba(255,220,180,0.10)',
                        }
                }
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
      <section className="relative z-10 flex flex-col items-center gap-8 px-6 py-32 text-center">
        {/* Glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(221,84,162,0.12) 0%, transparent 70%)',
          }}
        />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="shimmer-text text-5xl tracking-widest sm:text-7xl"
          style={{ fontFamily: 'var(--font-app)' }}
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

        <Button onClick={() => router.push('/graj')} type="primary" size="lg">
          Wejdź do salonu
        </Button>
      </section>

      {/* bottom padding for global footer */}
      <div className="h-16" />
    </main>
  )
}
