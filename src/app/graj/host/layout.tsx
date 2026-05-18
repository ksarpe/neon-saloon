import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Stwórz grę',
  description: 'Wybierz tryb gry i otwórz salon. Gracze dołączą przez PIN lub skanując kod QR.',
  robots: { index: false, follow: false },
}

export default function HostLayout({ children }: { children: React.ReactNode }) {
  return children
}
