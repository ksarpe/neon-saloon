import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zagraj',
  description:
    'Zostań szeryfem i uruchom grę na dużym ekranie, albo dołącz jako kowbojka — wystarczy PIN.',
  robots: { index: true, follow: true },
}

export default function GrajLayout({ children }: { children: React.ReactNode }) {
  return children
}
