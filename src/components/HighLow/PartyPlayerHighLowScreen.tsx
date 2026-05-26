'use client'

import { AnimatePresence } from 'framer-motion'
import { Star } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { usePartyConnection } from '@/hooks/usePartyConnection'
import type { HighLowRoundResultPayload, HighLowRoundStartPayload, ScoreEntry } from '@/lib/game-types'

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
  partyToken: string
  playerId: string
  playerName: string
  teamId: string | null
  teamName: string | null
  avatar: string
}

function derivePhase(
  data: HighLowRoundStartPayload,
  playerId: string,
  teamId: string | null,
  hasSubmittedNumber: boolean,
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

export function PartyPlayerHighLowScreen({
  pin,
  partyToken,
  playerId,
  playerName,
  teamId,
  teamName,
  avatar,
}: Props) {
  const [phase, setPhase] = useState<PlayerHLPhase>('waiting')
  const [roundData, setRoundData] = useState<HighLowRoundStartPayload | null>(null)
  const [submittedNumber, setSubmittedNumber] = useState<string | null>(null)
  const [resultData, setResultData] = useState<HighLowRoundResultPayload | null>(null)
  const [scores, setScores] = useState<ScoreEntry[]>([])
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
    [playerId, teamId],
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

  const handlers = useMemo(
    () => ({
      onHighLowRoundStart: (d: HighLowRoundStartPayload) => applyRoundStart(d, false),
      onHighLowNumberSubmitted: (d: { number: string }) => applyNumberSubmitted(d.number),
      onHighLowRoundResult: (d: HighLowRoundResultPayload) => applyRoundResult(d),
      onGameFinished: () => setPhase('finished'),
    }),
    [applyRoundStart, applyNumberSubmitted, applyRoundResult],
  )

  const { send, snapshot } = usePartyConnection({ pin, partyToken, role: 'player', handlers })

  // Hydrate on (re)connect so a refresh doesn't drop state.
  useEffect(() => {
    if (!snapshot) return

    if (snapshot.status === 'finished') {
      setPhase('finished')
      return
    }

    const hl = snapshot.highlow
    if (!hl) return

    const round: HighLowRoundStartPayload = {
      roundIndex: hl.questionIndex,
      questionText: hl.questionText ?? '',
      questionUnit: hl.questionUnit ?? '',
      guessingTeamId: hl.guessingTeamId,
      guessingTeamName: hl.guessingTeamName,
      votingTeamId: hl.votingTeamId,
      votingTeamName: hl.votingTeamName,
      guessingCaptainId: hl.guessingCaptainId,
      votingCaptainId: hl.votingCaptainId,
    }

    if (hl.currentResult) {
      setRoundData(round)
      setScores(hl.currentResult.scores)
      setResultData(hl.currentResult)
      setPhase('result')
    } else {
      applyRoundStart(round, Boolean(hl.currentNumber))
      if (hl.currentNumber) setSubmittedNumber(hl.currentNumber)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot])

  const handleSubmitNumber = useCallback(async () => {
    const num = numberInput.trim()
    if (!num || submitting || !send) return
    setSubmitting(true)
    const result = await send({ type: 'player:highlow-number', number: num })
    if (result.ok) {
      applyNumberSubmitted(num)
    } else {
      setSubmitting(false)
    }
  }, [applyNumberSubmitted, numberInput, submitting, send])

  const handleVote = useCallback(
    async (vote: 'mniej' | 'wiecej') => {
      if (voted || submitting || !send) return
      setVoted(true)
      setVotedChoice(vote)
      setSubmitting(true)
      const result = await send({ type: 'player:highlow-vote', vote })
      if (!result.ok) {
        setVoted(false)
        setVotedChoice(null)
        setSubmitting(false)
      }
    },
    [send, voted, submitting],
  )

  return (
    <div className="relative flex min-h-dvh w-full flex-col items-center justify-center p-6">
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
