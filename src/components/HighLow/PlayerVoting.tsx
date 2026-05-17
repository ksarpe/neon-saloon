'use client'

import { motion } from 'framer-motion'
import { Loader2, TrendingDown, TrendingUp } from 'lucide-react'
import { PulsingDots } from './PulsingDots'
import type { HighLowRoundStartPayload } from '@/lib/game-types'

type VotingPhase = 'voting-captain-waiting' | 'voting-captain-ready' | 'voting-member'

interface Props {
  phase: VotingPhase
  roundData: HighLowRoundStartPayload
  submittedNumber: string | null
  voted: boolean
  votedChoice: 'mniej' | 'wiecej' | null
  submitting: boolean
  onVote: (vote: 'mniej' | 'wiecej') => void
}

export function PlayerVoting({
  phase,
  roundData,
  submittedNumber,
  voted,
  votedChoice,
  submitting,
  onVote,
}: Props) {
  if (phase === 'voting-captain-waiting') {
    return (
      <motion.div
        key="voting-captain-waiting"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <div
          className="rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
          style={{
            borderColor: 'rgba(167,139,250,0.5)',
            backgroundColor: 'rgba(167,139,250,0.1)',
            color: '#a78bfa',
          }}
        >
          ⚡ Ty głosujesz — jesteś kapitanem!
        </div>

        <div
          className="w-full rounded-2xl border-2 p-5"
          style={{ borderColor: 'rgba(255,215,0,0.25)', backgroundColor: 'rgba(255,215,0,0.05)' }}
        >
          <p className="text-text-muted mb-2 text-xs tracking-widest uppercase">Pytanie</p>
          <p className="text-base font-bold leading-snug" style={{ color: 'var(--sheriff-gold)' }}>
            {roundData.questionText}
          </p>
          <p className="text-text-muted mt-2 text-xs">
            Odpowiedź w:{' '}
            <span className="text-text-primary font-bold">{roundData.questionUnit}</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-text-muted text-sm">
            Czekaj na odpowiedź drużyny{' '}
            <span className="text-text-primary font-bold">{roundData.guessingTeamName}</span>…
          </p>
          <PulsingDots color="#a78bfa" />
        </div>
      </motion.div>
    )
  }

  if (phase === 'voting-captain-ready') {
    return (
      <motion.div
        key="voting-captain-ready"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="flex w-full flex-col items-center gap-5 text-center"
      >
        <div
          className="rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
          style={{
            borderColor: 'rgba(167,139,250,0.5)',
            backgroundColor: 'rgba(167,139,250,0.1)',
            color: '#a78bfa',
          }}
        >
          ⚡ Twój głos decyduje!
        </div>

        <div
          className="w-full rounded-2xl border-2 p-4"
          style={{ borderColor: 'rgba(255,215,0,0.25)', backgroundColor: 'rgba(255,215,0,0.05)' }}
        >
          <p className="text-text-muted mb-1 text-xs">Pytanie</p>
          <p className="text-sm font-bold leading-snug" style={{ color: 'var(--sheriff-gold)' }}>
            {roundData.questionText}
          </p>
        </div>

        <div>
          <p className="text-text-muted mb-1 text-xs tracking-widest uppercase">
            Odpowiedź drużyny {roundData.guessingTeamName}
          </p>
          <p
            className="text-6xl font-black"
            style={{ color: 'var(--sheriff-gold)', fontFamily: "var(--font-app)" }}
          >
            {submittedNumber}
            <span className="ml-2 text-3xl">{roundData.questionUnit}</span>
          </p>
        </div>

        <p className="text-text-muted text-sm font-medium">
          Prawdziwa wartość jest — Mniej czy Więcej?
        </p>

        <div className="flex w-full gap-3">
          <motion.button
            disabled={voted}
            whileTap={{ scale: 0.95 }}
            onClick={() => onVote('mniej')}
            className="flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 py-7 font-bold transition-all disabled:opacity-50"
            style={{
              borderColor: 'rgba(59,130,246,0.5)',
              backgroundColor: votedChoice === 'mniej' ? 'rgba(59,130,246,0.22)' : 'rgba(59,130,246,0.08)',
              color: '#3b82f6',
            }}
          >
            {submitting && votedChoice === 'mniej' ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <>
                <TrendingDown size={30} />
                <span style={{ fontFamily: "var(--font-app)", fontSize: '1.15rem', letterSpacing: '0.15em' }}>
                  Mniej
                </span>
              </>
            )}
          </motion.button>

          <motion.button
            disabled={voted}
            whileTap={{ scale: 0.95 }}
            onClick={() => onVote('wiecej')}
            className="flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 py-7 font-bold transition-all disabled:opacity-50"
            style={{
              borderColor: 'rgba(239,68,68,0.5)',
              backgroundColor: votedChoice === 'wiecej' ? 'rgba(239,68,68,0.22)' : 'rgba(239,68,68,0.08)',
              color: '#ef4444',
            }}
          >
            {submitting && votedChoice === 'wiecej' ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <>
                <TrendingUp size={30} />
                <span style={{ fontFamily: "var(--font-app)", fontSize: '1.15rem', letterSpacing: '0.15em' }}>
                  Więcej
                </span>
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    )
  }

  // voting-member
  return (
    <motion.div
      key="voting-member"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-5 text-center"
    >
      <div
        className="rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest"
        style={{
          borderColor: 'rgba(167,139,250,0.4)',
          backgroundColor: 'rgba(167,139,250,0.08)',
          color: '#a78bfa',
        }}
      >
        Twoja drużyna głosuje
      </div>

      <div
        className="w-full rounded-2xl border-2 p-5"
        style={{ borderColor: 'rgba(255,215,0,0.25)', backgroundColor: 'rgba(255,215,0,0.05)' }}
      >
        <p className="text-text-muted mb-2 text-xs">Pytanie</p>
        <p className="text-base font-bold leading-snug" style={{ color: 'var(--sheriff-gold)' }}>
          {roundData.questionText}
        </p>
      </div>

      {submittedNumber !== null ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-text-muted text-xs">
            Odpowiedź drużyny {roundData.guessingTeamName}
          </p>
          <p
            className="text-4xl font-black"
            style={{ color: 'var(--sheriff-gold)', fontFamily: "var(--font-app)" }}
          >
            {submittedNumber} <span className="text-xl">{roundData.questionUnit}</span>
          </p>
          <p className="text-text-muted mt-1 text-sm">Kapitan decyduje…</p>
          <PulsingDots color="#a78bfa" />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <p className="text-text-muted text-sm">
            Czekaj na odpowiedź drużyny{' '}
            <span className="text-text-primary font-bold">{roundData.guessingTeamName}</span>…
          </p>
          <PulsingDots color="#a78bfa" />
        </div>
      )}
    </motion.div>
  )
}
