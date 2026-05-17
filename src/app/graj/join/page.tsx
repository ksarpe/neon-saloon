import { Suspense } from 'react'

import JoinGameForm from '@/components/JoinGame'

export const metadata = {
  title: 'Dołącz do gry – last rodeo andżeliki 🤠',
  description: 'Wpisz PIN i dołącz do szalonej imprezy panieńskiej.',
}

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <JoinGameForm />
    </Suspense>
  )
}
