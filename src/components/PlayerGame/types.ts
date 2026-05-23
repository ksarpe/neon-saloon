import type { StandardGameSettings, WireCard } from '@/lib/game-types'

export type Phase = 'playing' | 'voted' | 'reveal' | 'finished'

export interface PlayerGameScreenProps {
  pin: string
  playerId: string
  playerName: string
  teamId: string | null
  teamName: string | null
  avatar: string
  initialCard: WireCard
  initialCardIndex: number
  initialCardStartedAt?: number | null
  // Set on resume when the player has already voted for the current card
  initialHasVoted?: boolean
  initialSettings?: StandardGameSettings
}
