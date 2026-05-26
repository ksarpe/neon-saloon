'use client'

import { PartyPlayerHighLowScreen } from './PartyPlayerHighLowScreen'

interface Props {
  pin: string
  playerId: string
  playerName: string
  teamId: string | null
  teamName: string | null
  avatar: string
  partyToken?: string
}

export default function PlayerHighLowScreen({
  pin,
  playerId,
  playerName,
  teamId,
  teamName,
  avatar,
  partyToken,
}: Props) {
  if (!partyToken) return null
  return (
    <PartyPlayerHighLowScreen
      pin={pin}
      partyToken={partyToken}
      playerId={playerId}
      playerName={playerName}
      teamId={teamId}
      teamName={teamName}
      avatar={avatar}
    />
  )
}
