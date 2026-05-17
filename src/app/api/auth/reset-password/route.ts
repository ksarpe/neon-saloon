import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

import { hashPasswordResetToken } from '@/lib/password-reset'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    token?: string
    password?: string
  }

  if (!body.token || !body.password) {
    return NextResponse.json({ error: 'Token i nowe hasło są wymagane.' }, { status: 400 })
  }
  if (body.password.length < 6) {
    return NextResponse.json({ error: 'Hasło musi mieć minimum 6 znaków.' }, { status: 400 })
  }

  const tokenHash = hashPasswordResetToken(body.token)
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    select: {
      id: true,
      userId: true,
      expiresAt: true,
      usedAt: true,
    },
  })

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date()) {
    return NextResponse.json(
      { error: 'Link resetujący wygasł albo został już wykorzystany.' },
      { status: 400 }
    )
  }

  const passwordHash = await bcrypt.hash(body.password, 12)

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ])

  return NextResponse.json({ ok: true })
}
