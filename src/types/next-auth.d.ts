import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      isPremium: boolean
    } & DefaultSession['user']
  }

  interface User {
    isPremium?: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    isPremium: boolean
  }
}
