'use client'

import { motion } from 'framer-motion'
import { ChevronRight, Loader2 } from 'lucide-react'

import type { SessionTeam } from '@/lib/appwrite/sessions'
import type { HighLowRoundResultPayload } from '@/lib/game-types'

interface Props {
  resultData: HighLowRoundResultPayload
  guessingTeam: SessionTeam
  votingTeam: SessionTeam
  questionHint?: string
  onNextRound: () => void
  nextLoading?: boolean
}

export function HostReveal({
  resultData,
  guessingTeam,
  votingTeam,
  questionHint,
  onNextRound,
  nextLoading = false,
}: Props) {
  const voteCorrect = resultData.captainVote === resultData.correctVote

  return (
    <motion.div
      key="revealed"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-8 text-center"
    >
      <div className="flex w-full max-w-lg flex-col gap-4">
        <p className="text-text-muted text-xs font-semibold tracking-normal uppercase">
          Prawidłowa odpowiedź
        </p>

        <div
          className="rounded-3xl border-2 p-6"
          style={{ borderColor: 'rgba(16,185,129,0.4)', backgroundColor: 'rgba(16,185,129,0.06)' }}
        >
          <p
            className="text-6xl font-black"
            style={{ color: '#10b981', fontFamily: 'var(--font-app)' }}
          >
            {resultData.correctAnswer.toLocaleString('pl-PL')}{' '}
            <span className="text-3xl">{resultData.unit}</span>
          </p>
          {questionHint && <p className="text-text-muted mt-2 text-xs">{questionHint}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-2xl border p-4"
            style={{
              borderColor: 'rgba(255,220,180,0.15)',
              backgroundColor: 'rgba(255,220,180,0.04)',
            }}
          >
            <p className="text-text-muted mb-1 text-xs">Odpowiedź {guessingTeam.teamName}</p>
            <p className="text-2xl font-black" style={{ color: 'var(--sheriff-pink)' }}>
              {resultData.guessingTeamGuess.toLocaleString('pl-PL')} {resultData.unit}
            </p>
          </div>
          <div
            className="rounded-2xl border p-4"
            style={{
              borderColor: voteCorrect ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)',
              backgroundColor: voteCorrect ? 'rgba(16,185,129,0.06)' : 'rgba(239,68,68,0.06)',
            }}
          >
            <p className="text-text-muted mb-1 text-xs">Głos {votingTeam.teamName}</p>
            <p
              className="text-2xl font-black"
              style={{ color: voteCorrect ? '#10b981' : '#ef4444' }}
            >
              {resultData.captainVote === 'mniej' ? 'Mniej' : 'Więcej'}
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl border-2 p-5"
          style={{ borderColor: 'rgba(255,215,0,0.4)', backgroundColor: 'rgba(255,215,0,0.07)' }}
        >
          <p className="text-text-muted mb-1 text-xs tracking-normal uppercase">Punkt dla</p>
          <p
            className="text-3xl font-black tracking-normal"
            style={{ color: 'var(--sheriff-pink)', fontFamily: 'var(--font-app)' }}
          >
            {resultData.winningTeamName}
          </p>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onNextRound}
        disabled={nextLoading}
        className="flex items-center gap-2 rounded-2xl px-8 py-4 text-white disabled:opacity-40"
        style={{
          background: 'linear-gradient(135deg,var(--neon-pink),#c800c8)',
          fontFamily: 'var(--font-app)',
          letterSpacing: '0.1em',
          fontSize: '1.1rem',
        }}
      >
        {nextLoading ? (
          <>
            <Loader2 size={18} className="animate-spin" /> Ładuję...
          </>
        ) : (
          <>
            Następna runda <ChevronRight size={18} />
          </>
        )}
      </motion.button>
    </motion.div>
  )
}
