'use client'

import { type GameSocketHandlers } from './useGameSocket'
import { useGameEvents } from './useGameEvents'

export const useRealtimeGame: (pin: string | null) => void =
  useGameEvents
