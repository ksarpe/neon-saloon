'use client'

import { AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import { useCallback, useState } from 'react'

import { useRealtimeGame as useGameSocket } from '@/hooks/useRealtimeGame'
import type {
  HighLowRoundResultPayload,
  HighLowRoundStartPayload,
  ScoreEntry,
} from '@/lib/game-types'
import { playerJsonHeaders } from '@/lib/session-player-secret'

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
}: Props) {
  const [phase, setPhase] = useState<PlayerHLPhase>(
    initialRoundData
      ? derivePhase(initialRoundData, playerId, teamId, Boolean(initialSubmittedNumber))
      : 'waiting'
  )
  const [roundData, setRoundData] = useState<HighLowRoundStartPayload | null>(
    initialRoundData ?? null
  )
  const [submittedNumber, setSubmittedNumber] = useState<string | null>(
    initialSubmittedNumber ?? null
  )
  const [resultData, setResultData] = useState<HighLowRoundResultPayload | null>(null)
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [numberInput, setNumberInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [voted, setVoted] = useState(false)
  const [votedChoice, setVotedChoice] = useState<'mniej' | 'wiecej' | null>(null)

  const myScore = scores.find((s) => s.playerId === playerId)?.score ?? 0

  useGameSocket(pin, {
    onHighLowRoundStart: useCallback(
      (d: HighLowRoundStartPayload) => {
        setRoundData(d)
        setSubmittedNumber(null)
        setResultData(null)
        setNumberInput('')
        setVoted(false)
        setVotedChoice(null)
        setSubmitting(false)
        setPhase(derivePhase(d, playerId, teamId, false))
      },
      [playerId, teamId]
    ),
    onHighLowNumberSubmitted: useCallback((d: { number: string }) => {
      setSubmittedNumber(d.number)
      setPhase((prev) => {
        if (prev === 'guessing-captain') return 'guessing-member'
        if (prev === 'voting-captain-waiting') return 'voting-captain-ready'
        return prev
      })
    }, []),
    onHighLowRoundResult: useCallback((d: HighLowRoundResultPayload) => {
      setResultData(d)
      setScores(d.scores)
      setPhase('result')
    }, []),
    onGameFinished: useCallback(() => setPhase('finished'), []),
  })

  const handleSubmitNumber = useCallback(async () => {
    const num = numberInput.trim()
    if (!num || submitting) return
    setSubmitting(true)
    try {
      await fetch(`/api/sessions/${pin}/highlow/number`, {
        method: 'POST',
        headers: playerJsonHeaders(pin, playerId),
        body: JSON.stringify({ playerId, number: num }),
      })
    } catch {
      setSubmitting(false)
    }
  }, [pin, playerId, numberInput, submitting])

  const handleVote = useCallback(
    async (vote: 'mniej' | 'wiecej') => {
      if (voted || submitting) return
      setVoted(true)
      setVotedChoice(vote)
      setSubmitting(true)
      try {
        await fetch(`/api/sessions/${pin}/highlow/vote`, {
          method: 'POST',
          headers: playerJsonHeaders(pin, playerId),
          body: JSON.stringify({ playerId, vote, currentScores: scores }),
        })
      } catch {
        setVoted(false)
        setVotedChoice(null)
        setSubmitting(false)
      }
    },
    [pin, playerId, voted, submitting, scores]
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
