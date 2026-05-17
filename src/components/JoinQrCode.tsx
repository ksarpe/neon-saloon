'use client'

import QRCode from 'qrcode'
import { useEffect, useMemo, useState } from 'react'

interface JoinQrCodeProps {
  pin: string
  className?: string
}

export function JoinQrCode({ pin, className }: JoinQrCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  const joinUrl = useMemo(() => {
    if (typeof window === 'undefined') return `/graj/join?pin=${pin}`
    return `${window.location.origin}/graj/join?pin=${pin}`
  }, [pin])

  useEffect(() => {
    let cancelled = false

    QRCode.toDataURL(joinUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 176,
      color: {
        dark: '#0d0818',
        light: '#f0dfc0',
      },
    })
      .then((dataUrl) => {
        if (!cancelled) setQrDataUrl(dataUrl)
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null)
      })

    return () => {
      cancelled = true
    }
  }, [joinUrl])

  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-2xl border p-3 ${className ?? ''}`}
      style={{
        borderColor: 'var(--saloon-border)',
        backgroundColor: 'rgba(255,220,180,0.06)',
      }}
    >
      <div
        className="flex h-36 w-36 items-center justify-center rounded-xl border p-2 sm:h-40 sm:w-40"
        style={{
          borderColor: 'rgba(221,84,162,0.28)',
          backgroundColor: '#f0dfc0',
        }}
      >
        {qrDataUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrDataUrl} alt={`Kod QR do gry ${pin}`} className="h-full w-full" />
        ) : (
          <span className="text-xs font-bold" style={{ color: 'var(--saloon-dark)' }}>
            QR
          </span>
        )}
      </div>
      <p className="text-text-muted text-center text-[11px] leading-snug font-semibold">
        Zeskanuj, aby dołączyć
      </p>
    </div>
  )
}
