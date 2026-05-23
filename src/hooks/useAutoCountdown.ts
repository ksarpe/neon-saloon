'use client'

import { useEffect, useRef, useState } from 'react'

type UseAutoCountdownOptions = {
  active: boolean
  seconds: number
  resetKey?: unknown
  startedAtMs?: number | null
  onComplete?: () => void
}

export function useAutoCountdown({
  active,
  seconds,
  resetKey,
  startedAtMs,
  onComplete,
}: UseAutoCountdownOptions) {
  const [countdown, setCountdown] = useState<number | null>(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    if (!active) {
      setCountdown(null)
      return
    }

    const startedAt = startedAtMs ?? Date.now()
    const deadline = startedAt + seconds * 1000
    let completed = false

    const update = () => {
      const next = Math.ceil((deadline - Date.now()) / 1000)
      if (next <= 0) {
        setCountdown(null)
        if (!completed) {
          completed = true
          onCompleteRef.current?.()
        }
      } else {
        setCountdown(next)
      }
    }

    update()
    const tick = setInterval(update, 1000)

    return () => clearInterval(tick)
  }, [active, resetKey, seconds, startedAtMs])

  return countdown
}
