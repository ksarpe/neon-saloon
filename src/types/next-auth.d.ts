import 'next-auth'
import 'next-auth/jwt'

import type { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user?: {
      id: string
      isPremium: boolean
    } & DefaultSession['user']
  }

  interface User {
    isPremium?: boolean
    sessionVersion?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    isPremium?: boolean
    sessionVersion?: number
    sessionInvalid?: boolean
  }
}
