import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zaloguj się',
  description:
    'Zaloguj się lub załóż konto, żeby prowadzić gry i zarządzać własnymi pytaniami do quizu.',
  robots: { index: false, follow: false },
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
