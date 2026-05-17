import bcrypt from 'bcryptjs'
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { prisma } from './prisma'

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
        }
      },
    }),
  ],

  session: { strategy: 'jwt' },

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.isPremium = user.isPremium ?? false
        return token
      }

      if (token.id) {
        const freshUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { email: true, isPremium: true, name: true },
        })

        if (freshUser) {
          token.email = freshUser.email
          token.isPremium = freshUser.isPremium
          token.name = freshUser.name ?? freshUser.email
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.email = token.email ?? session.user.email
        session.user.isPremium = token.isPremium
        session.user.name = token.name ?? session.user.name
      }
      return session
    },
  },
}
