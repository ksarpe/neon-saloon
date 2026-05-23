'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SESSION_PIN_LENGTH } from '@/lib/session-pin'

interface Props {
  value: string
  onChange: (v: string) => void
  onSubmit: (pin: string) => void
  loading: boolean
  error: string | null
}

export function PinInput({ value, onChange, onSubmit, loading, error }: Props) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <p className="text-text-muted text-lg">Wpisz PIN od hosta</p>
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
