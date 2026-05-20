'use client'

import { useEffect, useState } from 'react'

import type { GameSettingsPayload } from '@/app/api/settings/route'
import { BR_AUTO_NEXT_SECONDS, BR_TIMER_SECONDS, REVEAL_COUNTDOWN_SECONDS } from '@/config/game'

export const DEFAULT_GAME_SETTINGS: GameSettingsPayload = {
  revealCountdownSeconds: REVEAL_COUNTDOWN_SECONDS,
  brTimerSeconds: BR_TIMER_SECONDS,
  brAutoNextSeconds: BR_AUTO_NEXT_SECONDS,
}

export function useGameSettings(defaults: GameSettingsPayload = DEFAULT_GAME_SETTINGS) {
  const [gameSettings, setGameSettings] = useState<GameSettingsPayload>(defaults)

  useEffect(() => {
    let cancelled = false

    fetch('/api/settings')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancelled && data) setGameSettings(data)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [])

  return gameSettings
}

