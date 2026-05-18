import { Suspense } from 'react'

import JoinGameForm from '@/components/JoinGame'

export const metadata = {
  title: 'Dołącz do gry',
  description:
    'Wpisz PIN od szeryfa i dołącz do rozgrywki na telefonie — bez rejestracji, bez aplikacji.',
}

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <JoinGameForm />
    </Suspense>
  )
}
