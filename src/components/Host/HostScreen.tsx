'use client'

import PartyHostScreen from './PartyHostScreen'
import type { HostScreenProps } from './types'

export default function HostScreen({ pin, initialCards, partyToken }: HostScreenProps) {
  if (!partyToken) return null
  return <PartyHostScreen pin={pin} initialCards={initialCards} partyToken={partyToken} />
}
