'use client'

import { PartyBattleRoyaleHost } from './PartyBattleRoyaleHost'

interface Props {
  pin: string
  partyToken?: string
}

export default function BattleRoyaleHost({ pin, partyToken }: Props) {
  if (!partyToken) return null
  return <PartyBattleRoyaleHost pin={pin} partyToken={partyToken} />
}
