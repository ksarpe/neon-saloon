'use client'

import { PartyHostHighLowScreen } from './PartyHostHighLowScreen'

interface Props {
  pin: string
  partyToken?: string
  questionLimit?: number
}

export default function HostHighLowScreen({ pin, partyToken, questionLimit }: Props) {
  if (!partyToken) return null
  return <PartyHostHighLowScreen pin={pin} partyToken={partyToken} questionLimit={questionLimit} />
}
