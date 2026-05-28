import { prisma } from './prisma'

export async function getFreshPremiumAccess(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPremium: true },
  })

  return Boolean(user?.isPremium)
}
