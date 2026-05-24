'use client'

import { AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { useRealtimeGame as useGameSocket } from '@/hooks/useRealtimeGame'
import type {
  HighLowRoundResultPayload,
  HighLowRoundStartPayload,
  ScoreEntry,
} from '@/lib/game-types'
import { playerAuthHeaders, playerJsonHeaders } from '@/lib/session-player-secret'

import { PlayerFinished } from './PlayerFinished'
import { PlayerGuessing } from './PlayerGuessing'
import { PlayerResult } from './PlayerResult'
import { PlayerVoting } from './PlayerVoting'
import { PlayerWaiting } from './PlayerWaiting'

type PlayerHLPhase =
  | 'waiting'
  | 'guessing-captain'
  | 'guessing-member'
  | 'voting-captain-waiting'
  | 'voting-captain-ready'
  | 'voting-member'
  | 'result'
  | 'finished'

interface Props {
  pin: string
  playerId: string
  playerName: string
  teamId: string | null
  teamName: string | null
  avatar: string
  initialRoundData?: HighLowRoundStartPayload | null
  initialSubmittedNumber?: string | null
  initialResultData?: HighLowRoundResultPayload | null
}

function derivePhase(
  data: HighLowRoundStartPayload,
  playerId: string,
  teamId: string | null,
  hasSubmittedNumber: boolean
): PlayerHLPhase {
  if (playerId === data.guessingCaptainId) {
    return hasSubmittedNumber ? 'guessing-member' : 'guessing-captain'
  }
  if (playerId === data.votingCaptainId) {
    return hasSubmittedNumber ? 'voting-captain-ready' : 'voting-captain-waiting'
  }
  if (teamId === data.guessingTeamId) return 'guessing-member'
  if (teamId === data.votingTeamId) return 'voting-member'
  return 'guessing-member'
}

export default function PlayerHighLowScreen({
  pin,
  playerId,
  playerName,
  teamId,
  teamName,
  avatar,
  initialRoundData,
  initialSubmittedNumber,
  initialResultData,
}: Props) {
  const [phase, setPhase] = useState<PlayerHLPhase>(
    initialResultData
      ? 'result'
      : initialRoundData
        ? derivePhase(initialRoundData, playerId, teamId, Boolean(initialSubmittedNumber))
        : 'waiting'
  )
  const [roundData, setRoundData] = useState<HighLowRoundStartPayload | null>(
    initialRoundData ?? null
  )
  const [submittedNumber, setSubmittedNumber] = useState<string | null>(
    initialSubmittedNumber ?? null
  )
  const [resultData, setResultData] = useState<HighLowRoundResultPayload | null>(
    initialResultData ?? null
  )
  const [scores, setScores] = useState<ScoreEntry[]>(initialResultData?.scores ?? [])
  const [numberInput, setNumberInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [voted, setVoted] = useState(false)
  const [votedChoice, setVotedChoice] = useState<'mniej' | 'wiecej' | null>(null)

  const myScore = scores.find((s) => s.playerId === playerId)?.score ?? 0

  const applyRoundStart = useCallback(
    (round: HighLowRoundStartPayload, hasSubmittedNumber: boolean) => {
      setRoundData(round)
      setSubmittedNumber(null)
      setResultData(null)
      setNumberInput('')
      setVoted(false)
      setVotedChoice(null)
      setSubmitting(false)
      setPhase(derivePhase(round, playerId, teamId, hasSubmittedNumber))
    },
    [playerId, teamId]
  )

  const applyNumberSubmitted = useCallback((number: string) => {
    setSubmittedNumber(number)
    setSubmitting(false)
    setPhase((prev) => {
      if (prev === 'guessing-captain') return 'guessing-member'
      if (prev === 'voting-captain-waiting') return 'voting-captain-ready'
      return prev
    })
  }, [])

  const applyRoundResult = useCallback((result: HighLowRoundResultPayload) => {
    setResultData(result)
    setScores(result.scores)
    setSubmitting(false)
    setVoted(true)
    setPhase('result')
  }, [])

  useGameSocket(pin, {
    onHighLowRoundStart: useCallback(
      (d: HighLowRoundStartPayload) => {
        applyRoundStart(d, false)
      },
      [applyRoundStart]
    ),
    onHighLowNumberSubmitted: useCallback(
      (d: { number: string }) => {
        applyNumberSubmitted(d.number)
      },
      [applyNumberSubmitted]
    ),
    onHighLowRoundResult: useCallback(
      (d: HighLowRoundResultPayload) => {
        applyRoundResult(d)
      },
      [applyRoundResult]
    ),
    onGameFinished: useCallback(() => setPhase('finished'), []),
  })

  useEffect(() => {
    if (phase === 'finished') return

    const refreshState = async () => {
      if (window.location.pathname !== '/graj/join') return
      if (document.visibilityState !== 'visible') return

      try {
        const response = await fetch(`/api/sessions/${pin}/resume`, {
          headers: playerAuthHeaders(pin, playerId),
        })
        if (!response.ok) return
        const data = await response.json()
        const highlow = data.highlow
        if (!highlow) return

        const resumedRound: HighLowRoundStartPayload = {
          roundIndex: highlow.roundIndex,
          questionText: highlow.questionText,
          questionUnit: highlow.questionUnit,
          guessingTeamId: highlow.guessingTeamId,
          guessingTeamName: highlow.guessingTeamName,
          votingTeamId: highlow.votingTeamId,
          votingTeamName: highlow.votingTeamName,
          guessingCaptainId: highlow.guessingCaptainId,
          votingCaptainId: highlow.votingCaptainId,
        }
        if (!roundData || roundData.roundIndex !== highlow.roundIndex) {
          applyRoundStart(resumedRound, Boolean(highlow.submittedNumber))
        }

        if (highlow.currentResult) {
          applyRoundResult(highlow.currentResult)
          return
        }

        if (highlow.submittedNumber) {
          applyNumberSubmitted(highlow.submittedNumber)
        }
      } catch {
        // Realtime is primary; this is only the recovery path.
      }
    }

    void refreshState()
    const id = window.setInterval(refreshState, 5000)
    return () => window.clearInterval(id)
  }, [applyNumberSubmitted, applyRoundResult, applyRoundStart, phase, pin, playerId, roundData])

  const handleSubmitNumber = useCallback(async () => {
    const num = numberInput.trim()
    if (!num || submitting) return
    setSubmitting(true)
    try {
      const response = await fetch(`/api/sessions/${pin}/highlow/number`, {
        method: 'POST',
        headers: playerJsonHeaders(pin, playerId),
        body: JSON.stringify({ playerId, number: num }),
      })
      if (response.ok) applyNumberSubmitted(num)
      else setSubmitting(false)
    } catch {
      setSubmitting(false)
    }
  }, [applyNumberSubmitted, pin, playerId, numberInput, submitting])

  const handleVote = useCallback(
    async (vote: 'mniej' | 'wiecej') => {
      if (voted || submitting) return
      setVoted(true)
      setVotedChoice(vote)
      setSubmitting(true)
      try {
        const response = await fetch(`/api/sessions/${pin}/highlow/vote`, {
          method: 'POST',
          headers: playerJsonHeaders(pin, playerId),
          body: JSON.stringify({ playerId, vote }),
        })
        if (!response.ok) {
          setVoted(false)
          setVotedChoice(null)
          setSubmitting(false)
          return
        }
        const data = await response.json().catch(() => null)
        if (data?.result) applyRoundResult(data.result)
        else setSubmitting(false)
      } catch {
        setVoted(false)
        setVotedChoice(null)
        setSubmitting(false)
      }
    },
    [applyRoundResult, pin, playerId, voted, submitting]
  )

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center p-6">
      {/* Score chip */}
      {myScore > 0 && (
        <div
          className="fixed top-4 right-4 z-20 flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold"
          style={{
            borderColor: 'rgba(255,215,0,0.4)',
            backgroundColor: 'rgba(255,215,0,0.08)',
            color: 'var(--sheriff-pink)',
          }}
        >
          <Star size={11} fill="var(--sheriff-pink)" style={{ color: 'var(--sheriff-pink)' }} />
          {myScore} pkt
        </div>
      )}

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6">
        <AnimatePresence mode="wait">
          {phase === 'waiting' && <PlayerWaiting avatar={avatar} teamName={teamName} />}

          {(phase === 'guessing-captain' || phase === 'guessing-member') && roundData && (
            <PlayerGuessing
              key={`guessing-${phase}`}
              phase={phase}
              roundData={roundData}
              numberInput={numberInput}
              onNumberInputChange={setNumberInput}
              submitting={submitting}
              submittedNumber={submittedNumber}
              onSubmitNumber={handleSubmitNumber}
            />
          )}

          {(phase === 'voting-captain-waiting' ||
            phase === 'voting-captain-ready' ||
            phase === 'voting-member') &&
            roundData && (
              <PlayerVoting
                key={`voting-${phase}`}
                phase={phase}
                roundData={roundData}
                submittedNumber={submittedNumber}
                voted={voted}
                votedChoice={votedChoice}
                submitting={submitting}
                onVote={handleVote}
              />
            )}

          {phase === 'result' && resultData && (
            <PlayerResult key="result" resultData={resultData} teamId={teamId} myScore={myScore} />
          )}

          {phase === 'finished' && (
            <PlayerFinished
              key="finished"
              avatar={avatar}
              playerName={playerName}
              teamName={teamName}
              playerId={playerId}
              myScore={myScore}
              scores={scores}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
