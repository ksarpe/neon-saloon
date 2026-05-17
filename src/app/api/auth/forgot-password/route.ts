import { NextResponse } from 'next/server'

import { getAppUrl, sendPasswordResetEmail } from '@/lib/email'
import {
  createPasswordResetToken,
  getPasswordResetExpiry,
  hashPasswordResetToken,
} from '@/lib/password-reset'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { email?: string }
  const email = body.email?.toLowerCase().trim()

  if (!email) {
    return NextResponse.json({ error: 'Podaj adres e-mail.' }, { status: 400 })
  }

  const genericResponse = {
    ok: true,
    message: 'Jeśli konto istnieje, wysłaliśmy link do resetu hasła.',
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  })

  if (!user) {
    return NextResponse.json(genericResponse)
  }

  await prisma.passwordResetToken.updateMany({
    where: {
      userId: user.id,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    data: { usedAt: new Date() },
  })

  const token = createPasswordResetToken()
  const tokenHash = hashPasswordResetToken(token)
  const resetUrl = `${getAppUrl()}/login?resetToken=${encodeURIComponent(token)}`

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      expiresAt: getPasswordResetExpiry(),
      userId: user.id,
    },
  })

  try {
    const result = await sendPasswordResetEmail({
      to: user.email,
      resetUrl,
    })

    return NextResponse.json({
      ...genericResponse,
      devResetUrl: result.devUrl,
    })
  } catch (error) {
    console.error('[POST /api/auth/forgot-password]', error)
    return NextResponse.json(
      { error: 'Nie udało się wysłać maila resetującego hasło.' },
      { status: 500 }
    )
  }
}
