'use client'

import { useSession } from 'next-auth/react'
import type { UserAccess } from '@/lib/content-access'

export function useContentAccess(): UserAccess {
  const { data: session } = useSession()
  return {
    isPremium: session?.user?.isPremium ?? false,
    unlockedByAd: [],
  }
}
