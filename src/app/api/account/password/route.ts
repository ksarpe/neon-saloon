import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json().catch(() => ({}))) as {
    currentPassword?: string
    newPassword?: string
  }

  if (!body.currentPassword || !body.newPassword) {
    return NextResponse.json({ error: 'Podaj obecne i nowe hasło.' }, { status: 400 })
  }
  if (body.newPassword.length < 6) {
    return NextResponse.json({ error: 'Nowe hasło musi mieć minimum 6 znaków.' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { password: true },
  })

  if (!user?.password) {
    return NextResponse.json({ error: 'Nie można zmienić hasła dla tego konta.' }, { status: 400 })
  }

  const passwordValid = await bcrypt.compare(body.currentPassword, user.password)
  if (!passwordValid) {
    return NextResponse.json({ error: 'Obecne hasło jest nieprawidłowe.' }, { status: 400 })
  }

  const nextPasswordHash = await bcrypt.hash(body.newPassword, 12)
  await prisma.user.update({
    where: { id: session.user.id },
    data: { password: nextPasswordHash },
  })

  return NextResponse.json({ ok: true })
}
