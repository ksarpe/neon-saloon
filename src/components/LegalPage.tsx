'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export interface LegalSection {
  id: string
  heading: string
  content: React.ReactNode
}

interface Props {
  title: string
  subtitle?: string
  lastUpdated?: string
  sections: LegalSection[]
}

export function LegalPage({ title, subtitle, lastUpdated, sections }: Props) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-10% 0% -75% 0%' }
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sections])

  return (
    <div className="relative z-10 min-h-dvh w-full">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-[-10%] left-[-10%] h-[50vw] w-[50vw] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] h-[50vw] w-[50vw] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)', filter: 'blur(80px)' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-24 pt-10 sm:px-8">
        {/* Back link */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase transition-colors"
          style={{ color: 'rgba(255,220,180,0.4)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--neon-pink)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,220,180,0.4)')}
        >
          <ChevronLeft size={13} />
          Wróć na stronę główną
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1
            className="shimmer-text text-5xl tracking-widest sm:text-6xl"
            style={{ fontFamily: "'Bebas Neue',cursive" }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-text-muted mt-2 text-sm">{subtitle}</p>
          )}
          {lastUpdated && (
            <p className="mt-1 text-xs" style={{ color: 'rgba(255,220,180,0.3)' }}>
              Ostatnia aktualizacja: {lastUpdated}
            </p>
          )}
        </motion.div>

        {/* Two-column layout */}
        <div className="flex gap-12">
          {/* Sidebar — sticky nav */}
          <aside className="hidden w-52 shrink-0 lg:block">
            <nav className="sticky top-10 flex flex-col gap-0.5">
              <p
                className="mb-3 text-[10px] font-bold tracking-widest uppercase"
                style={{ color: 'rgba(255,220,180,0.3)' }}
              >
                Spis treści
              </p>
              {sections.map((s) => {
                const isActive = activeId === s.id
                return (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="group relative flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all duration-200"
                    style={{
                      color: isActive ? 'var(--neon-pink)' : 'rgba(255,220,180,0.4)',
                      backgroundColor: isActive ? 'rgba(255,16,240,0.07)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.color = 'rgba(255,220,180,0.7)'
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.color = 'rgba(255,220,180,0.4)'
                    }}
                  >
                    {/* Active indicator bar */}
                    <span
                      className="absolute left-0 top-1/2 h-3/5 w-0.5 -translate-y-1/2 rounded-full transition-all duration-200"
                      style={{
                        backgroundColor: isActive ? 'var(--neon-pink)' : 'transparent',
                        boxShadow: isActive ? '0 0 8px var(--neon-pink)' : 'none',
                      }}
                    />
                    {s.heading}
                  </a>
                )
              })}
            </nav>
          </aside>

          {/* Content */}
          <article ref={contentRef} className="min-w-0 flex-1">
            {sections.map((s, i) => (
              <motion.section
                key={s.id}
                id={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 + 0.1, duration: 0.4 }}
                className="mb-12 scroll-mt-10"
              >
                <h2
                  className="mb-4 text-2xl tracking-wider"
                  style={{
                    fontFamily: "'Bebas Neue',cursive",
                    color: 'var(--sheriff-gold)',
                    letterSpacing: '0.06em',
                  }}
                >
                  {s.heading}
                </h2>
                <div
                  className="legal-content text-sm leading-relaxed"
                  style={{ color: 'rgba(240,223,192,0.72)' }}
                >
                  {s.content}
                </div>
                {i < sections.length - 1 && (
                  <div
                    className="mt-10 h-px w-full"
                    style={{ backgroundColor: 'rgba(255,220,180,0.08)' }}
                  />
                )}
              </motion.section>
            ))}
          </article>
        </div>
      </div>
    </div>
  )
}
