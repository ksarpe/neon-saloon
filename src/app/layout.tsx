import type { Metadata, Viewport } from 'next'
import { Open_Sans, Anton } from 'next/font/google'
import './globals.css'
import PageTransition from '@/components/PageTransition'
import { BackButtonProvider } from '@/lib/back-button-context'
import { Providers } from '@/components/Providers'
import { BackgroundMusic } from '@/components/BackgroundMusic'
import { Zap } from 'lucide-react'

const font = Open_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-app',
  display: 'swap',
})

const logoFont = Anton({
  weight: '400',
  subsets: ['latin', 'latin-ext'],
  variable: '--font-logo',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'last rodeo andżeliki – Bachelorette Party Game',
  description:
    'The wildest bachelorette party card game in the West. Kahoot-style trivia, charades & dares — powered by neon lights and pure chaos.',
  keywords: ['bachelorette party', 'party game', 'card game', 'bridal shower', 'kahoot'],
  openGraph: {
    title: 'last rodeo andżeliki',
    description: 'The wildest bachelorette party card game in the West.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0d0a0b',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full ${font.variable} ${logoFont.variable}`}>
      <body className="bg-saloon-dark text-text-primary noise-overlay h-full antialiased">
        {/* Global background video (ping-pong loop) */}
        {/* Global dark overlay */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-1"
          style={{ background: 'rgba(23, 2, 23, 0.75)' }}
        />
        <Providers>
          <BackButtonProvider>
            <PageTransition>{children}</PageTransition>
          </BackButtonProvider>
          <BackgroundMusic />
        </Providers>

        {/* Global footer */}
        <footer
          className="pointer-events-none fixed right-0 bottom-0 left-0 z-20 flex items-center justify-center gap-2 pt-6 pb-3"
          style={{
            background: 'linear-gradient(to top, rgba(10,4,20,0.75) 0%, transparent 100%)',
          }}
        >
          <Zap size={10} style={{ color: 'var(--neon-pink)' }} />
          <span
            className="pointer-events-auto flex flex-wrap items-center justify-center gap-2 text-[11px] tracking-wide"
            style={{ color: 'rgba(255,220,180,0.4)' }}
          >
            Last Rodeo <span style={{ color: 'rgba(255,220,180,0.22)' }}>v1.0 custom</span>
            {' · '}
            <a href="https://aknsoftware.com" style={{ color: 'rgba(255,220,180,0.4)' }}>
              AKN Software
            </a>
            {' · '}
            <a href="/regulamin" style={{ color: 'rgba(255,220,180,0.4)' }}>
              Regulamin
            </a>
            {' · '}
            <a href="/polityka-prywatnosci" style={{ color: 'rgba(255,220,180,0.4)' }}>
              Polityka prywatności
            </a>
          </span>
        </footer>
      </body>
    </html>
  )
}
