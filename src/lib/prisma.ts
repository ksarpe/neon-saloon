import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// Production safety guards. Running these at module load means a misconfigured
// deploy fails the build/boot with a clear message instead of crashing later
// with a Stripe/Prisma stack trace, and prevents the dev-only premium-gate
// escape hatch from ever being honoured in production.
if (process.env.NODE_ENV === 'production') {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      '[boot] DATABASE_URL is required in production. Set it in the hosting platform secrets.'
    )
  }
  if (process.env.DISABLE_PREMIUM_GATE === 'true') {
    throw new Error(
      '[boot] DISABLE_PREMIUM_GATE must NOT be set in production — it bypasses paywall checks. ' +
        'Remove the env var from the production environment.'
    )
  }
}

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set — cannot initialise Prisma client.')
  }
  const adapter = new PrismaPg(databaseUrl)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
