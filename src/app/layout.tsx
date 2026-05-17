import type { Metadata, Viewport } from 'next'
import { Sora, Anton } from 'next/font/google'
import './globals.css'
import PageTransition from '@/components/PageTransition'
import { BackButtonProvider } from '@/lib/back-button-context'
import { Providers } from '@/components/Providers'
import { BackgroundMusic } from '@/components/BackgroundMusic'
import { AppFooter } from '@/components/AppFooter'

const font = Sora({
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
      <body className="bg-saloon-dark text-text-primary h-full antialiased">
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

        <AppFooter />
      </body>
    </html>
  )
}
