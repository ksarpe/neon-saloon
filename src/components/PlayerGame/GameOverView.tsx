'use client'

import { GameSummary } from '@/components/GameSummary'
import type { GameFinishedPayload } from '@/lib/game-types'

interface Props {
  data: GameFinishedPayload
}

export function GameOverView({ data }: Props) {
  const drinksScores = data.scores
    .filter((s) => (s.drinks ?? 0) > 0)
    .map((s) => ({ id: s.playerId, name: s.playerName, score: s.drinks! }))

  return (
    <GameSummary
      scores={data.scores.map((s) => ({ id: s.playerId, name: s.playerName, score: s.score }))}
      teamScores={
        data.teamScores?.length
          ? data.teamScores.map((t) => ({ id: t.teamId, name: t.teamName, score: t.score }))
          : undefined
      }
      drinksScores={drinksScores.length > 0 ? drinksScores : undefined}
    />
  )
}
