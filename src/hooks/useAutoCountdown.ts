'use client'

import { useEffect, useRef, useState } from 'react'

type UseAutoCountdownOptions = {
  active: boolean
  seconds: number
  resetKey?: unknown
  onComplete?: () => void
}

export function useAutoCountdown({
  active,
  seconds,
  resetKey,
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

    let next = seconds
    setCountdown(next)

    const tick = setInterval(() => {
      next -= 1
      if (next <= 0) {
        clearInterval(tick)
        setCountdown(null)
        onCompleteRef.current?.()
      } else {
        setCountdown(next)
      }
    }, 1000)

    return () => clearInterval(tick)
  }, [active, resetKey, seconds])

  return countdown
}
