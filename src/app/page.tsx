'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronRight, Minus, MonitorPlay, PartyPopper, Smartphone } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import { GameCardStack } from '@/components/Card'
import { Button } from '@/components/ui/button'
import { LANDING_SAMPLE_CARDS } from '@/config/landing-sample-cards'
import { PRICING } from '@/config/pricing'

const shuffleIndices = (length: number): number[] => {
  const order = Array.from({ length }, (_, i) => i)
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

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
    price: PRICING.monthly.amount,
    period: PRICING.monthly.period,
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
    price: PRICING.lifetime.amount,
    period: PRICING.lifetime.period,
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
    icon: MonitorPlay,
    title: 'Ktoś tworzy grę...',
    desc: 'Wystarczy jedna osoba jako host i dowolna liczba graczy. Ktoś przecież musi być szeryfem.',
    color: '#f94aff',
  },
  {
    step: '02',
    icon: Smartphone,
    title: 'Gracze dołączają',
    desc: 'Wpisz PIN lub zeskanuj kod QR. Wszyscy lądują w tym samym salonie - bez bałaganu.',
    color: '#dd54a2',
  },
  {
    step: '03',
    icon: PartyPopper,
    title: 'Zaczynamy zabawę',
    desc: 'Kto pierwszy ten lepszy. A może lepiej udawać, że nie wie się o co chodzi? Albo jednak nie...',
    color: '#a78bfa',
  },
]

export default function LandingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  // Deterministyczny porządek na pierwszy render (SSR), tasowany po zamontowaniu —
  // dzięki temu unikamy niezgodności hydratacji, a gracz i tak dostaje losową talię.
  const [order, setOrder] = useState<number[]>(() =>
    Array.from({ length: LANDING_SAMPLE_CARDS.length }, (_, i) => i)
  )
  const [position, setPosition] = useState(0)
  const [isSampleFlipped, setIsSampleFlipped] = useState(false)

  useEffect(() => {
    setOrder(shuffleIndices(LANDING_SAMPLE_CARDS.length))
  }, [])

  const sample = LANDING_SAMPLE_CARDS[order[position]]

  // Każda karta pokazuje się raz; po wyczerpaniu talii tasujemy ją od nowa,
  // pilnując, by pierwsza karta nowego rozdania nie powtórzyła ostatniej.
  const drawRandomSample = () => {
    const next = position + 1
    if (next < order.length) {
      setPosition(next)
    } else {
      const lastShown = order[position]
      const reshuffled = shuffleIndices(LANDING_SAMPLE_CARDS.length)
      if (reshuffled.length > 1 && reshuffled[0] === lastShown) {
        ;[reshuffled[0], reshuffled[1]] = [reshuffled[1], reshuffled[0]]
      }
      setOrder(reshuffled)
      setPosition(0)
    }
    setIsSampleFlipped(false)
  }

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
          className="shimmer-text pt-2 pb-1 text-[clamp(4rem,22vw,10rem)] leading-[0.95] tracking-wide uppercase"
          style={{ fontFamily: 'var(--font-logo)' }}
        >
          Last <br className="md:hidden" />
          Rodeo
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-md text-base leading-relaxed sm:text-xl"
          style={{ color: 'rgba(240,223,192,0.7)' }}
        >
          To, co dzisiaj wyznasz, zrujnuje Ci jutro. Wchodzisz w to?
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
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1"
          style={{ color: 'rgba(255,220,180,0.3)' }}
        >
          <span className="text-[10px] tracking-normal uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronRight size={14} className="rotate-90" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── GAME SAMPLE ───────────────────────────────────────────────────── */}
      <section className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 py-24 sm:px-6 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mx-auto flex w-full max-w-[760px] flex-col items-center gap-5"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={sample.id}
              initial={{ opacity: 0, y: 34, scale: 0.94, rotate: 3 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, y: -42, scale: 0.9, rotate: -5 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            >
              <GameCardStack
                card={sample}
                cardsLeft={order.length - position}
                isFlipped={isSampleFlipped}
                maxWidth={760}
                textScale={1.45}
                onFlip={() => setIsSampleFlipped(true)}
                onFlippedClick={drawRandomSample}
              />
            </motion.div>
          </AnimatePresence>
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
            className="shimmer-text text-5xl tracking-normal sm:text-6xl"
            style={{ fontFamily: 'var(--font-app)' }}
          >
            Jak to działa?
          </h2>
          <p className="mt-3 text-sm" style={{ color: 'rgba(240,223,192,0.5)' }}>
            Trzy kroki do pełnego chaosu.
          </p>
        </motion.div>

        <div className="relative flex w-full flex-col gap-12 sm:flex-row sm:gap-4">
          {HOW_IT_WORKS.map((item, i) => {
            const Icon = item.icon
            const isLast = i === HOW_IT_WORKS.length - 1
            const nextColor = isLast ? item.color : HOW_IT_WORKS[i + 1].color
            return (
              <div
                key={item.step}
                className="relative flex flex-1 flex-col items-center text-center"
              >
                {/* Świecący szlak do następnego kroku — tylko poziomy na desktopie */}
                {!isLast && (
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    whileInView={{ scaleX: 1, opacity: 0.5 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.15 + 0.35 }}
                    className="absolute top-14 left-1/2 hidden h-1 w-[calc(100%+1rem)] origin-left sm:block"
                    style={{ background: `linear-gradient(90deg, ${item.color}, ${nextColor})` }}
                  />
                )}

                {/* Neonowy orb z ikoną i numerem kroku */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 200, damping: 16, delay: i * 0.15 }}
                  whileHover={{ scale: 1.09, rotate: -3 }}
                  className="relative z-10 mb-6 flex h-28 w-28 items-center justify-center rounded-full border-2 backdrop-blur-md"
                  style={{
                    borderColor: `${item.color}99`,
                    backgroundColor: 'rgba(13,8,24,0.85)',
                    boxShadow: `0 0 40px ${item.color}55, inset 0 0 22px ${item.color}1a`,
                  }}
                >
                  <Icon size={46} strokeWidth={1.75} style={{ color: item.color }} />
                  <span
                    className="absolute -top-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full text-sm font-black"
                    style={{
                      backgroundColor: item.color,
                      color: '#0d0818',
                      fontFamily: 'var(--font-app)',
                      boxShadow: `0 2px 10px ${item.color}80`,
                    }}
                  >
                    {item.step}
                  </span>
                </motion.div>

                {/* Tytuł + opis */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.15 + 0.2 }}
                  className="flex flex-col gap-1.5 px-2"
                >
                  <p className="text-lg font-bold" style={{ color: item.color }}>
                    {item.title}
                  </p>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'rgba(240,223,192,0.55)' }}
                  >
                    {item.desc}
                  </p>
                </motion.div>
              </div>
            )
          })}
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
            className="shimmer-text text-5xl tracking-normal sm:text-6xl"
            style={{ fontFamily: 'var(--font-app)' }}
          >
            Plany
          </h2>
          <p className="mt-3 text-sm" style={{ color: 'rgba(240,223,192,0.5)' }}>
            Jedna szansa. Spraw żeby było epickie.
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
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-0.5 text-[10px] font-bold tracking-normal whitespace-nowrap uppercase"
                  style={{ background: 'var(--sheriff-gold)', color: '#0d0a0b' }}
                >
                  {plan.badge}
                </div>
              )}

              {/* Plan name */}
              <p
                className="mb-2 text-[10px] font-bold tracking-normal uppercase"
                style={{ color: plan.accent }}
              >
                {plan.name}
              </p>

              {/* Price */}
              <div className="mb-6 flex items-end gap-1.5">
                {plan.price ? (
                  <>
                    <span
                      className="text-4xl leading-none font-black"
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
                    className="text-4xl leading-none font-black"
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
              <motion.button
                type="button"
                onClick={() => handlePricingCta(plan.id)}
                whileHover={{
                  y: -2,
                  scale: 1.025,
                  boxShadow: `0 0 24px ${plan.accent}44, 0 10px 24px rgba(0,0,0,0.28)`,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 360, damping: 22 }}
                className="mt-auto w-full cursor-pointer rounded-xl py-2.5 text-sm font-semibold tracking-wide transition-colors duration-200"
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
              </motion.button>
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
          className="shimmer-text text-5xl tracking-normal sm:text-7xl"
          style={{ fontFamily: 'var(--font-app)' }}
        >
          Gotowi na
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
          Jeden zwycięzca. Reszta idzie spać ze wstydem.
        </motion.p>

        <Button onClick={() => router.push('/graj')} type="primary" size="lg">
          Odważ się i zacznij grę!
        </Button>
      </section>

      {/* bottom padding for global footer */}
      <div className="h-16" />
    </main>
  )
}
