import './globals.css'

import type { Metadata, Viewport } from 'next'
import { Anton, Sora } from 'next/font/google'

import { AppFooter } from '@/components/AppFooter'
import { BackgroundMusic } from '@/components/BackgroundMusic'
import PageTransition from '@/components/PageTransition'
import { Providers } from '@/components/Providers'
import { BackButtonProvider } from '@/lib/back-button-context'

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
  metadataBase: new URL('https://lastrodeoandzeliki.pl'),
  title: {
    default: 'Last Rodeo – Gra na wieczór panieński',
    template: '%s – Last Rodeo',
  },
  description:
    'Interaktywna gra imprezowa na wieczór panieński w stylu kahoota. Quiz o Pannie Młodej, Nigdy przenigdy, Battle Royale i więcej — bez aplikacji, wystarczy PIN.',
  keywords: [
    'wieczór panieński',
    'gra na wieczór panieński',
    'quiz o pannie młodej',
    'nigdy przenigdy',
    'gra imprezowa',
    'kahoot po polsku',
    'last rodeo',
    'gra przez przeglądarkę',
  ],
  openGraph: {
    title: 'Last Rodeo – Gra na wieczór panieński',
    description:
      'Quiz, Nigdy przenigdy i Battle Royale dla Panny Młodej i jej ekipy. Dołącz przez PIN — bez aplikacji.',
    type: 'website',
    url: 'https://lastrodeoandzeliki.pl',
    siteName: 'Last Rodeo',
    locale: 'pl_PL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Last Rodeo – Gra na wieczór panieński',
    description: 'Quiz, Nigdy przenigdy i Battle Royale dla Panny Młodej i jej ekipy.',
  },
  robots: { index: true, follow: true },
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
    <html lang="pl" className={`h-full ${font.variable} ${logoFont.variable}`}>
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
