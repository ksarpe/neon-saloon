'use client'

import { motion } from 'framer-motion'
import { Loader2, Star, TrendingDown, TrendingUp } from 'lucide-react'

import type { SessionPlayer, SessionTeam } from '@/lib/appwrite/sessions'
import type { ScoreEntry } from '@/lib/game-types'
import type { HighLowQuestion } from '@/config/games/highlow'

interface Props {
  phase: 'guessing' | 'voting'
  currentQuestion: HighLowQuestion
  scores: ScoreEntry[]
  team1: SessionTeam
  team2: SessionTeam
  guessingTeam: SessionTeam
  votingTeam: SessionTeam
  guessingCaptain: SessionPlayer | null
  votingCaptain: SessionPlayer | null
  submittedNumber: string | null
  // Host captain
  isHostGuessingCaptain: boolean
  isHostVotingCaptain: boolean
  numberInput: string
  onNumberInputChange: (v: string) => void
  onHostSubmitNumber: () => void
  hostSubmitting: boolean
  hostVoted: boolean
  hostVotedChoice: 'mniej' | 'wiecej' | null
  onHostVote: (vote: 'mniej' | 'wiecej') => void
}

export function HostRound({
  phase,
  currentQuestion,
  scores,
  team1,
  team2,
  guessingTeam,
  votingTeam,
  guessingCaptain,
  votingCaptain,
  submittedNumber,
  isHostGuessingCaptain,
  isHostVotingCaptain,
  numberInput,
  onNumberInputChange,
  onHostSubmitNumber,
  hostSubmitting,
  hostVoted,
  hostVotedChoice,
  onHostVote,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-8 text-center"
    >
      {/* Scores bar */}
      {scores.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {[team1, team2].map((team) => {
            const total = scores
              .filter((s) => s.playerTeamId === team.teamId)
              .reduce((sum, s) => sum + s.score, 0)
            const accent = team.teamId === team1.teamId ? 'var(--neon-pink)' : 'var(--sheriff-pink)'
            return (
              <div
                key={team.teamId}
                className="flex items-center gap-2 rounded-xl border px-4 py-2"
                style={{ borderColor: `${accent}44`, backgroundColor: `${accent}0d` }}
              >
                <span className="text-xs font-bold" style={{ color: accent }}>
                  {team.teamName}
                </span>
                <div className="flex items-center gap-1">
                  <Star size={11} fill={accent} style={{ color: accent }} />
                  <span className="text-sm font-black" style={{ color: accent }}>
                    {total}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Question card */}
      <div
        className="flex w-full flex-col gap-4 rounded-3xl border-2 p-8"
        style={{ borderColor: 'rgba(255,215,0,0.25)', backgroundColor: 'rgba(255,215,0,0.05)' }}
      >
        <p className="text-text-muted text-xs font-semibold tracking-normal uppercase">Pytanie</p>
        <p
          className="text-2xl leading-snug font-bold sm:text-3xl"
          style={{ color: 'var(--sheriff-pink)' }}
        >
          {currentQuestion.text}
        </p>
        <p className="text-text-muted text-sm">
          Odpowiedź w: <span className="text-text-primary font-bold">{currentQuestion.unit}</span>
        </p>
      </div>

      {/* Guessing phase */}
      {phase === 'guessing' && (
        <div className="flex w-full flex-col items-center gap-4">
          <div
            className="rounded-full border px-4 py-2 text-sm font-bold"
            style={{
              borderColor: 'rgba(255,16,240,0.4)',
              backgroundColor: 'rgba(255,16,240,0.08)',
              color: 'var(--neon-pink)',
            }}
          >
            kolej na {guessingTeam.teamName}
          </div>

          {isHostGuessingCaptain ? (
            <div className="flex w-full max-w-sm flex-col gap-3">
              <div
                className="rounded-full border px-4 py-1.5 text-center text-xs font-bold tracking-normal uppercase"
                style={{
                  borderColor: 'rgba(255,16,240,0.5)',
                  backgroundColor: 'rgba(255,16,240,0.1)',
                  color: 'var(--neon-pink)',
                }}
              >
                Ty jesteś głową bandy — podaj liczbę!
              </div>
              <input
                type="number"
                inputMode="numeric"
                value={numberInput}
                onChange={(e) => onNumberInputChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onHostSubmitNumber()}
                placeholder={`Liczba w "${currentQuestion.unit}"`}
                autoFocus
                className="bg-saloon-surface text-text-primary placeholder:text-text-muted w-full rounded-xl border-2 px-4 py-4 text-center text-3xl font-black transition-colors focus:outline-none"
                style={{
                  borderColor: numberInput ? 'var(--neon-pink)' : 'var(--saloon-border)',
                  fontFamily: 'var(--font-app)',
                  letterSpacing: '0.1em',
                }}
              />
              <motion.button
                disabled={!numberInput.trim() || hostSubmitting}
                whileTap={{ scale: 0.97 }}
                onClick={onHostSubmitNumber}
                className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-white disabled:opacity-30"
                style={{
                  background: 'linear-gradient(135deg,var(--neon-pink),#c800c8)',
                  boxShadow: '0 4px 30px rgba(255,16,240,0.4)',
                  fontFamily: 'var(--font-app)',
                  fontSize: '1.1rem',
                  letterSpacing: '0.1em',
                }}
              >
                {hostSubmitting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  'Zatwierdź odpowiedź'
                )}
              </motion.button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <p className="text-text-muted text-sm">
                Kapitan:{' '}
                <span className="text-text-primary font-bold">
                  {guessingCaptain?.playerName ?? '—'}
                </span>{' '}
                podaje liczbę na telefonie
              </p>
              <div className="flex animate-pulse items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: 'var(--neon-pink)' }}
                />
                <span className="text-text-muted text-xs">Oczekuję na odpowiedź…</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Voting phase */}
      {phase === 'voting' && (
        <div className="flex w-full flex-col items-center gap-4">
          <div
            className="rounded-2xl border-2 px-6 py-4 text-center"
            style={{ borderColor: 'rgba(255,215,0,0.4)', backgroundColor: 'rgba(255,215,0,0.06)' }}
          >
            <p className="text-text-muted mb-1 text-xs tracking-normal uppercase">
              Odpowiedź bandy {guessingTeam.teamName}
            </p>
            <p
              className="text-5xl font-black"
              style={{ color: 'var(--sheriff-pink)', fontFamily: 'var(--font-app)' }}
            >
              {submittedNumber} <span className="text-2xl">{currentQuestion.unit}</span>
            </p>
          </div>

          <div
            className="rounded-full border px-4 py-2 text-sm font-bold"
            style={{
              borderColor: 'rgba(167,139,250,0.4)',
              backgroundColor: 'rgba(167,139,250,0.08)',
              color: '#a78bfa',
            }}
          >
            kolej na {votingTeam.teamName} 
          </div>

          {isHostVotingCaptain ? (
            <div className="flex w-full max-w-sm flex-col gap-3">
              <div
                className="rounded-full border px-4 py-1.5 text-center text-xs font-bold tracking-normal uppercase"
                style={{
                  borderColor: 'rgba(167,139,250,0.5)',
                  backgroundColor: 'rgba(167,139,250,0.1)',
                  color: '#a78bfa',
                }}
              >
                Ty jesteś głową bandy — Twój głos decyduje!
              </div>
              <div className="flex w-full gap-3">
                <motion.button
                  disabled={hostVoted || hostSubmitting}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onHostVote('mniej')}
                  className="flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 py-7 font-bold transition-all disabled:opacity-50"
                  style={{
                    borderColor: 'rgba(59,130,246,0.5)',
                    backgroundColor:
                      hostVotedChoice === 'mniej'
                        ? 'rgba(59,130,246,0.22)'
                        : 'rgba(59,130,246,0.08)',
                    color: '#3b82f6',
                  }}
                >
                  {hostSubmitting && hostVotedChoice === 'mniej' ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      <TrendingDown size={30} />
                      <span
                        style={{
                          fontFamily: 'var(--font-app)',
                          fontSize: '1.15rem',
                          letterSpacing: '0.15em',
                        }}
                      >
                        Mniej
                      </span>
                    </>
                  )}
                </motion.button>
                <motion.button
                  disabled={hostVoted || hostSubmitting}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onHostVote('wiecej')}
                  className="flex flex-1 flex-col items-center gap-2 rounded-2xl border-2 py-7 font-bold transition-all disabled:opacity-50"
                  style={{
                    borderColor: 'rgba(239,68,68,0.5)',
                    backgroundColor:
                      hostVotedChoice === 'wiecej'
                        ? 'rgba(239,68,68,0.22)'
                        : 'rgba(239,68,68,0.08)',
                    color: '#ef4444',
                  }}
                >
                  {hostSubmitting && hostVotedChoice === 'wiecej' ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      <TrendingUp size={30} />
                      <span
                        style={{
                          fontFamily: 'var(--font-app)',
                          fontSize: '1.15rem',
                          letterSpacing: '0.15em',
                        }}
                      >
                        Więcej
                      </span>
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <p className="text-text-muted text-sm">
                Kapitan:{' '}
                <span className="text-text-primary font-bold">
                  {votingCaptain?.playerName ?? '—'}
                </span>{' '}
                klika Mniej lub Więcej
              </p>
              <div className="flex animate-pulse items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#a78bfa' }} />
                <span className="text-text-muted text-xs">Oczekuję na głos…</span>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
