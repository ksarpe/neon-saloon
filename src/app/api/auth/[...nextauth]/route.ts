import type { NextRequest } from 'next/server'
import NextAuth from 'next-auth'

import { authOptions } from '@/lib/auth'
import { consumeRateLimit, getClientIp, rateLimitHeaders } from '@/lib/rate-limit'

const handler = NextAuth(authOptions)
export { handler as GET }

type NextAuthRouteContext = {
  params: Promise<{ nextauth: string[] }>
}

export async function POST(request: NextRequest, context: NextAuthRouteContext) {
  const { nextauth } = await context.params
  const action = nextauth.join('/')

  if (action === 'callback/credentials') {
    const ipLimit = await consumeRateLimit(`auth:login:ip:${getClientIp(request)}`, {
      limit: 10,
      windowMs: 15 * 60_000,
    })

    if (!ipLimit.allowed) {
      return Response.json(
        { error: 'Za dużo prób logowania. Spróbuj ponownie za chwilę.' },
        { status: 429, headers: rateLimitHeaders(ipLimit) }
      )
    }

    const formData = await request
      .clone()
      .formData()
      .catch(() => null)
    const email = formData?.get('email')?.toString().toLowerCase().trim()

    if (email) {
      const emailLimit = await consumeRateLimit(`auth:login:email:${email}`, {
        limit: 5,
        windowMs: 15 * 60_000,
      })

      if (!emailLimit.allowed) {
        return Response.json(
          { error: 'Za dużo prób logowania. Spróbuj ponownie za chwilę.' },
          { status: 429, headers: rateLimitHeaders(emailLimit) }
        )
      }
    }
  }

  return handler(request, context)
}
