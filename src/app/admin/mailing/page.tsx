import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'

import { AdminMailingForm } from './AdminMailingForm'

// Sesja jest sprawdzana po stronie serwera — strona nie może być statyczna.
export const dynamic = 'force-dynamic'

export default async function AdminMailingPage() {
  const session = await getServerSession(authOptions)
  // Brak roli admina => 404 (nie ujawniamy, że strona istnieje).
  if (!session?.user?.isAdmin) notFound()

  return <AdminMailingForm />
}
