import { timingSafeEqual } from 'node:crypto'

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'

/**
 * Autoryzacja żądań administracyjnych.
 *
 * Podstawowa droga: zalogowany użytkownik z rolą administratora (sesja NextAuth) —
 * tak działa panel `/admin/mailing` wywoływany z przeglądarki (cookie sesji).
 *
 * Dodatkowo, gdy ustawiony jest `MARKETING_ADMIN_SECRET`, akceptujemy nagłówek
 * `Authorization: Bearer <sekret>` — wyłącznie do wywołań programatycznych (skrypty,
 * cron), które nie mają sesji. Brak sekretu w env oznacza, że ta droga jest wyłączona.
 *
 * Zwraca `null`, gdy żądanie jest autoryzowane, albo gotową odpowiedź 401/403.
 */
export async function authorizeAdmin(request: Request): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions)
  if (session?.user?.id) {
    return session.user.isAdmin
      ? null
      : NextResponse.json({ error: 'Brak uprawnień administratora.' }, { status: 403 })
  }

  const secret = process.env.MARKETING_ADMIN_SECRET
  if (secret) {
    const header = request.headers.get('authorization') ?? ''
    const provided = header.startsWith('Bearer ') ? header.slice(7) : ''
    if (safeEqual(provided, secret)) return null
  }

  return NextResponse.json({ error: 'Brak autoryzacji.' }, { status: 401 })
}

function safeEqual(a: string, b: string) {
  const bufferA = Buffer.from(a)
  const bufferB = Buffer.from(b)
  if (bufferA.length !== bufferB.length) return false
  return timingSafeEqual(bufferA, bufferB)
}
