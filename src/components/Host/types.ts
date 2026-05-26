import type { GameCard } from '@/lib/store'

export const ACCENT: Record<string, string> = {
  trivia: '#8b2be2',
  QUIZ: '#8b2be2',
  NEVER: '#FFD700',
  charades: '#1e90ff',
  action: '#f59e0b',
  dare: '#ff10f0',
}

export interface LivePlayer {
  playerId: string
  playerName: string
  avatar: string
  teamId: string | null
  teamName: string | null
}

export interface VoteRecord {
  playerId: string
  playerName: string
  teamId: string | null
  teamName: string | null
  answerIndex: number
  answerText: string
}

export interface ScoreEntry {
  playerId: string
  playerName: string
  score: number
  drinks?: number
  egzekwo?: number
  playerTeamId?: string
  playerTeamName?: string
}

export interface TeamScoreEntry {
  teamId: string
  teamName: string
  score: number
}

export type HostPhase = 'setup' | 'lobby' | 'active' | 'finished'

export interface HostScreenProps {
  pin: string
  initialCards: GameCard[]
  gameMode?: string
  /** PartyKit auth token used by the host WebSocket connection. */
  partyToken?: string
}

export function computeTeamScores(scores: ScoreEntry[]): TeamScoreEntry[] {
  const map = new Map<string, TeamScoreEntry>()
  scores.forEach((s) => {
    if (!s.playerTeamId || !s.playerTeamName) return
    const existing = map.get(s.playerTeamId)
    if (existing) existing.score += s.score
    else map.set(s.playerTeamId, { teamId: s.playerTeamId, teamName: s.playerTeamName, score: s.score })
  })
  return Array.from(map.values())
}
