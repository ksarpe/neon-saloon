'use client'

// Single re-export — components call useRealtimeGame(pin, handlers) exactly
// as they would have called useGameSocket before the Appwrite migration.
export { useGameEvents as useRealtimeGame } from './useGameEvents'
export type { GameSocketHandlers } from '@/lib/game-types'
