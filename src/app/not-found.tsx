import { Home, Search } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: '404 – Nie znaleziono strony',
}

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center px-6 py-20">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 text-center">
        {/* 404 number */}
        <div className="flex flex-col items-center gap-1">
          <span
            className="text-[6rem] leading-none font-black tracking-tight"
            style={{
              fontFamily: 'var(--font-logo)',
              background: 'linear-gradient(135deg, var(--neon-pink), var(--sheriff-pink))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            404
          </span>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-2xl border-2"
            style={{
              borderColor: 'rgba(255,220,180,0.18)',
              backgroundColor: 'rgba(255,220,180,0.05)',
            }}
          >
            <Search size={18} style={{ color: 'rgba(255,220,180,0.5)' }} />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h1
            className="text-2xl font-black uppercase tracking-wide"
            style={{ fontFamily: 'var(--font-app)', color: 'var(--text-primary)' }}
          >
            Strony nie ma w saloonie
          </h1>
          <p className="text-text-muted text-sm leading-relaxed">
            Ta strona nie istnieje lub została przeniesiona. Sprawdź adres i spróbuj ponownie.
          </p>
        </div>

        {/* Action */}
        <Link
          href="/"
          className="group relative flex w-full items-center justify-center overflow-hidden rounded-2xl px-6 py-4 text-base text-white"
          style={{
            background: 'linear-gradient(135deg,var(--neon-pink),#c800c8)',
            boxShadow: '0 4px 40px rgba(221,84,162,0.55)',
            fontFamily: 'var(--font-app)',
            fontSize: '1.1rem',
          }}
        >
          <div className="pointer-events-none absolute inset-y-0 -left-full z-0 w-full skew-x-[-20deg] bg-linear-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ease-in-out group-hover:left-full" />
          <span className="relative z-10 flex items-center gap-2">
          <Home size={15} />
          Wróć na stronę główną
          </span>
        </Link>
      </div>
    </div>
  )
}
