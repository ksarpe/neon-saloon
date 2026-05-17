'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

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
      { rootMargin: '-10% 0% -80% 0%' }
    )

    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    const lastId = sections[sections.length - 1]?.id
    const handleScroll = () => {
      if (!lastId) return
      // Only override when close to the bottom — avoids racing with the main observer
      const nearBottom =
        window.scrollY + window.innerHeight >= document.body.scrollHeight - window.innerHeight * 0.5
      if (!nearBottom) return
      const lastEl = document.getElementById(lastId)
      if (!lastEl) return
      const rect = lastEl.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.top >= 0) setActiveId(lastId)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [sections])

  return (
    <div className="relative z-10 mb-100 min-h-dvh w-full">
      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-10 pb-24 sm:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1
            className="text-5xl tracking-widest sm:text-6xl"
            style={{ fontFamily: 'var(--font-logo)', color: 'var(--sheriff-pink)' }}
          >
            {title}
          </h1>
          {subtitle && <p className="text-text-muted mt-2 text-sm">{subtitle}</p>}
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
                      className="absolute top-1/2 left-0 h-3/5 w-0.5 -translate-y-1/2 rounded-full transition-all duration-200"
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
                    fontFamily: 'var(--font-app)',
                    color: 'var(--sheriff-pink)',
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
