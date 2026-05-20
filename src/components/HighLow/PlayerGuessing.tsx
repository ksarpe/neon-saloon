'use client'

import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

import type { HighLowRoundStartPayload } from '@/lib/game-types'

import { PulsingDots } from './PulsingDots'

interface Props {
  phase: 'guessing-captain' | 'guessing-member'
  roundData: HighLowRoundStartPayload
  numberInput: string
  onNumberInputChange: (v: string) => void
  submitting: boolean
  submittedNumber: string | null
  onSubmitNumber: () => void
}

export function PlayerGuessing({
  phase,
  roundData,
  numberInput,
  onNumberInputChange,
  submitting,
  submittedNumber,
  onSubmitNumber,
}: Props) {
  if (phase === 'guessing-captain') {
    return (
      <motion.div
        key="guessing-captain"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="flex w-full flex-col items-center gap-5 text-center"
      >
        <div
          className="rounded-full border px-4 py-1.5 text-xs font-bold tracking-normal uppercase"
          style={{
            borderColor: 'rgba(255,16,240,0.5)',
            backgroundColor: 'rgba(255,16,240,0.1)',
            color: 'var(--neon-pink)',
          }}
        >
          🎯 Ty podajesz liczbę!
        </div>

        <div
          className="w-full rounded-2xl border-2 p-5"
          style={{ borderColor: 'rgba(255,215,0,0.25)', backgroundColor: 'rgba(255,215,0,0.05)' }}
        >
          <p className="text-text-muted mb-2 text-xs tracking-normal uppercase">Pytanie</p>
          <p className="text-lg leading-snug font-bold" style={{ color: 'var(--sheriff-pink)' }}>
            {roundData.questionText}
          </p>
          <p className="text-text-muted mt-2 text-xs">
            Odpowiedź w:{' '}
            <span className="text-text-primary font-bold">{roundData.questionUnit}</span>
          </p>
        </div>

        <div className="flex w-full flex-col gap-3">
          <input
            type="number"
            inputMode="numeric"
            value={numberInput}
            onChange={(e) => onNumberInputChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSubmitNumber()}
            placeholder={`Liczba w ${roundData.questionUnit}…`}
            autoFocus
            className="bg-saloon-surface text-text-primary placeholder:text-text-muted w-full rounded-xl border-2 px-4 py-4 text-center text-3xl font-black transition-colors focus:outline-none"
            style={{
              borderColor: numberInput ? 'var(--neon-pink)' : 'var(--saloon-border)',
              fontFamily: 'var(--font-app)',
              letterSpacing: '0.1em',
            }}
          />
          <motion.button
            disabled={!numberInput.trim() || submitting}
            whileTap={{ scale: 0.97 }}
            onClick={onSubmitNumber}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-white disabled:opacity-30"
            style={{
              background: 'linear-gradient(135deg,var(--neon-pink),#c800c8)',
              boxShadow: '0 4px 30px rgba(255,16,240,0.4)',
              fontFamily: 'var(--font-app)',
              fontSize: '1.1rem',
              letterSpacing: '0.1em',
            }}
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Zatwierdź odpowiedź'}
          </motion.button>
        </div>
      </motion.div>
    )
  }

  // guessing-member
  return (
    <motion.div
      key="guessing-member"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-5 text-center"
    >
      <div
        className="rounded-full border px-4 py-1.5 text-xs font-bold tracking-normal uppercase"
        style={{
          borderColor: 'rgba(255,16,240,0.4)',
          backgroundColor: 'rgba(255,16,240,0.08)',
          color: 'var(--neon-pink)',
        }}
      >
        Twoja drużyna zgaduje
      </div>

      <div
        className="w-full rounded-2xl border-2 p-5"
        style={{ borderColor: 'rgba(255,215,0,0.25)', backgroundColor: 'rgba(255,215,0,0.05)' }}
      >
        <p className="text-text-muted mb-2 text-xs">Pytanie</p>
        <p className="text-base leading-snug font-bold" style={{ color: 'var(--sheriff-pink)' }}>
          {roundData.questionText}
        </p>
      </div>

      {submittedNumber !== null ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-text-muted text-xs tracking-normal uppercase">Wasza odpowiedź</p>
          <p
            className="text-5xl font-black"
            style={{ color: 'var(--neon-pink)', fontFamily: 'var(--font-app)' }}
          >
            {submittedNumber} <span className="text-2xl">{roundData.questionUnit}</span>
          </p>
          <p className="text-text-muted mt-1 text-xs">Czekaj na głos drużyny przeciwnej…</p>
          <PulsingDots color="var(--neon-pink)" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="text-text-muted text-sm">Kapitan podaje odpowiedź…</p>
          <PulsingDots color="var(--neon-pink)" />
        </div>
      )}
    </motion.div>
  )
}
