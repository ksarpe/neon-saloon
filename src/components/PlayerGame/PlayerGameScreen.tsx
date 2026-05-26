'use client'

import PartyPlayerGameScreen from './PartyPlayerGameScreen'
import type { PlayerGameScreenProps } from './types'

export default function PlayerGameScreen({
  pin,
  playerId,
  playerName,
  teamId,
  teamName,
  avatar,
  initialCard,
  initialCardIndex,
  initialCardStartedAt,
  initialHasVoted,
  initialSettings,
  partyToken,
}: PlayerGameScreenProps) {
  if (!partyToken) return null

  return (
    <PartyPlayerGameScreen
      pin={pin}
      partyToken={partyToken}
      playerId={playerId}
      playerName={playerName}
      teamId={teamId}
      teamName={teamName}
      avatar={avatar}
      initialCard={initialCard}
      initialCardIndex={initialCardIndex}
      initialCardStartedAt={initialCardStartedAt}
      initialHasVoted={initialHasVoted}
      initialSettings={initialSettings}
    />
  )
}
