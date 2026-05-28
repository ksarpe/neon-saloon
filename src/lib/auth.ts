import bcrypt from 'bcryptjs'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { prisma } from './prisma'

const USER_REFRESH_INTERVAL_MS = 60 * 60 * 1000

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        })

        if (!user?.password) return null

        const valid = await bcrypt.compare(credentials.password, user.password)
        if (!valid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? user.email,
          isPremium: user.isPremium ?? false,
          sessionVersion: user.sessionVersion,
        }
      },
    }),
  ],

  session: { strategy: 'jwt' },

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.isPremium = user.isPremium ?? false
        token.sessionVersion = user.sessionVersion ?? 0
        token.userCheckedAt = Date.now()
        delete token.sessionInvalid
        return token
      }

      if (!token.id || token.sessionInvalid) return token
      if (
        trigger !== 'update' &&
        typeof token.userCheckedAt === 'number' &&
        Date.now() - token.userCheckedAt < USER_REFRESH_INTERVAL_MS
      ) {
        return token
      }

      const freshUser = await prisma.user.findUnique({
        where: { id: token.id },
        select: { email: true, isPremium: true, name: true, sessionVersion: true },
      })

      if (!freshUser || freshUser.sessionVersion !== (token.sessionVersion ?? 0)) {
        delete token.id
        delete token.email
        delete token.name
        delete token.isPremium
        delete token.sessionVersion
        delete token.userCheckedAt
        token.sessionInvalid = true
        return token
      }

      token.email = freshUser.email
      token.isPremium = freshUser.isPremium
      token.name = freshUser.name ?? freshUser.email
      token.userCheckedAt = Date.now()

      return token
    },
    async session({ session, token }) {
      if (!token.id || token.sessionInvalid) {
        delete session.user
        return session
      }

      if (session.user) {
        session.user.id = token.id
        session.user.email = token.email ?? session.user.email
        session.user.isPremium = token.isPremium ?? false
        session.user.name = token.name ?? session.user.name
      }
      return session
    },
  },
}
