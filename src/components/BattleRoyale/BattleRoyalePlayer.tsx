'use client'

import { PartyBattleRoyalePlayer } from './PartyBattleRoyalePlayer'

interface Props {
  pin: string
  playerId: string
  playerName: string
  avatar: string
  partyToken?: string
}

export default function BattleRoyalePlayer({
  pin,
  playerId,
  playerName,
  avatar,
  partyToken,
}: Props) {
  if (!partyToken) return null
  return (
    <PartyBattleRoyalePlayer
      pin={pin}
      partyToken={partyToken}
      playerId={playerId}
      playerName={playerName}
      avatar={avatar}
    />
  )
}
