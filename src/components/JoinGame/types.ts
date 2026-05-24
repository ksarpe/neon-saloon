export type Step = 'pin' | 'name' | 'team' | 'waiting' | 'playing'

export interface LiveTeam {
  teamId: string
  teamName: string
  color: string
  emoji: string
  memberCount: number
}

export interface PlayerInfo {
  playerId: string
  avatar: string
  teamId: string | null
  teamName: string | null
}

export const slide = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}
