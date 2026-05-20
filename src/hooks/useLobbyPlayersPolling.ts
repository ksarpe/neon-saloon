'use client'

import { useEffect } from 'react'

import { hostAuthHeaders } from '@/lib/session-host-secret'

type UseLobbyPlayersPollingOptions<TPlayer> = {
  active: boolean
  pin: string
  onPlayers: (players: TPlayer[]) => void
  intervalMs?: number
}

export function useLobbyPlayersPolling<TPlayer>({
  active,
  pin,
  onPlayers,
  intervalMs = 5000,
}: UseLobbyPlayersPollingOptions<TPlayer>) {
  useEffect(() => {
    if (!active) return

    const id = setInterval(() => {
      fetch(`/api/sessions/${pin}`, { headers: hostAuthHeaders(pin) })
        .then((response) => (response.ok ? response.json() : null))
        .then((data) => {
          if (Array.isArray(data?.players)) onPlayers(data.players)
        })
        .catch(() => {})
    }, intervalMs)

    return () => clearInterval(id)
  }, [active, intervalMs, onPlayers, pin])
}
