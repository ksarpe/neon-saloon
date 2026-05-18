import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panel szeryfa',
  description: 'Zarządzaj własnymi pytaniami do quizu, wyznaniami Nigdy przenigdy i kontem PRO.',
  robots: { index: false, follow: false },
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return children
}
