'use client'

import { motion } from 'framer-motion'
import { Camera, Loader2, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { SESSION_PIN_LENGTH } from '@/lib/session-pin'

interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit: (pin: string) => void
  loading: boolean
  error: string | null
}

type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => {
  detect: (source: CanvasImageSource) => Promise<Array<{ rawValue: string }>>
}

function extractPinFromQr(value: string) {
  try {
    const url = new URL(value)
    const pin = url.searchParams.get('pin')?.replace(/\D/g, '').slice(0, SESSION_PIN_LENGTH)
    if (pin?.length === SESSION_PIN_LENGTH) return pin
  } catch {}

  const digits = value.replace(/\D/g, '')
  return digits.length >= SESSION_PIN_LENGTH ? digits.slice(0, SESSION_PIN_LENGTH) : null
}

function getBarcodeDetector() {
  if (typeof window === 'undefined') return null
  return (window as typeof window & { BarcodeDetector?: BarcodeDetectorConstructor })
    .BarcodeDetector
}

export function PinInput({ value, onChange, onSubmit, loading, error }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const frameRef = useRef<number | null>(null)
  const [scannerOpen, setScannerOpen] = useState(false)
  const [scannerError, setScannerError] = useState<string | null>(null)

  const stopScanner = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setScannerOpen(false)
  }, [])

  useEffect(() => stopScanner, [stopScanner])

  const startScanner = useCallback(async () => {
    const BarcodeDetector = getBarcodeDetector()
    if (!BarcodeDetector) {
      setScannerError('Ta przeglądarka nie obsługuje skanera QR w aplikacji.')
      return
    }

    setScannerError(null)
    setScannerOpen(true)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })
      streamRef.current = stream

      await new Promise((resolve) => requestAnimationFrame(resolve))
      const video = videoRef.current
      if (!video) throw new Error('Scanner video is not ready')
      video.srcObject = stream
      await video.play()

      const detector = new BarcodeDetector({ formats: ['qr_code'] })
      const scan = async () => {
        if (!videoRef.current || !streamRef.current) return

        try {
          const codes = await detector.detect(videoRef.current)
          const pin = codes.map((code) => extractPinFromQr(code.rawValue)).find(Boolean)
          if (pin) {
            onChange(pin)
            stopScanner()
            setTimeout(() => onSubmit(pin), 100)
            return
          }
        } catch {
          // Moving the camera often produces transient decode errors.
        }

        frameRef.current = requestAnimationFrame(scan)
      }

      frameRef.current = requestAnimationFrame(scan)
    } catch {
      stopScanner()
      setScannerError('Nie udało się uruchomić aparatu. Sprawdź uprawnienia kamery.')
    }
  }, [onChange, onSubmit, stopScanner])

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-text-muted text-lg">Wpisz PIN lub zeskanuj QR</p>
      </div>

      {/* Digit display */}
      <div className="flex gap-1.5 sm:gap-2">
        {Array.from({ length: SESSION_PIN_LENGTH }, (_, i) => (
          <motion.div
            key={i}
            animate={{
              borderColor: value[i]
                ? 'var(--neon-pink)'
                : i === value.length
                  ? 'rgba(255,16,240,0.5)'
                  : 'var(--saloon-border)',
              scale: i === value.length ? 1.08 : 1,
            }}
            transition={{ duration: 0.15 }}
            className="flex h-16 w-11 items-center justify-center rounded-xl border-2 text-xl font-bold sm:h-20 sm:w-16 sm:text-2xl"
            style={{ backgroundColor: 'var(--saloon-surface)' }}
          >
            {value[i] ? (
              <motion.span
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                style={{ color: 'var(--neon-pink)' }}
              >
                {value[i]}
              </motion.span>
            ) : (
              <span className="opacity-20">-</span>
            )}
          </motion.div>
        ))}
      </div>

      {scannerOpen ? (
        <div className="border-saloon-border bg-saloon-surface/80 w-full max-w-xs overflow-hidden rounded-2xl border p-2">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-black">
            <video
              ref={videoRef}
              muted
              playsInline
              className="h-full w-full object-cover"
              aria-label="Skaner kodu QR"
            />
            <div className="pointer-events-none absolute inset-8 rounded-2xl border-2 border-[var(--neon-pink)] shadow-[0_0_24px_rgba(255,16,240,0.35)]" />
            <button
              type="button"
              onClick={stopScanner}
              className="absolute top-2 right-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white"
              aria-label="Zamknij skaner"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <Button
          type="outline"
          onClick={startScanner}
          disabled={loading}
          className="w-full max-w-[240px]"
        >
          <Camera size={18} />
          Skanuj QR
        </Button>
      )}

      {scannerError && <p className="max-w-xs text-center text-xs text-red-300">{scannerError}</p>}

      {/* Numpad */}
      <div className="grid w-full max-w-[240px] grid-cols-3 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, '⌫'].map((k, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.92 }}
            disabled={k === null}
            onClick={() => {
              if (k === null) return
              if (k === '⌫') {
                onChange(value.slice(0, -1))
                return
              }
              if (value.length < SESSION_PIN_LENGTH) {
                const n = value + String(k)
                onChange(n)
                if (n.length === SESSION_PIN_LENGTH) setTimeout(() => onSubmit(n), 100)
              }
            }}
            className={`bg-saloon-surface border-saloon-border text-text-primary flex h-12 items-center justify-center rounded-xl border text-base font-bold ${
              k === null ? 'invisible' : ''
            }`}
          >
            {k}
          </motion.button>
        ))}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button
        id="pin-continue-btn"
        type="primary"
        disabled={value.length < SESSION_PIN_LENGTH || loading}
        onClick={() => onSubmit(value)}
        className="w-full max-w-[240px]"
      >
        {loading && <Loader2 size={18} className="animate-spin" />}
        {loading ? 'Sprawdzanie...' : 'Wejdź do salonu'}
      </Button>
    </div>
  )
}
