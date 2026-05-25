'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Flag, Loader2, Menu, X, Zap } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { GameSummary } from '@/components/GameSummary'
import { HIGHLOW_QUESTIONS } from '@/config/games/highlow'
import { useLobbyPlayersPolling } from '@/hooks/useLobbyPlayersPolling'
import { useRealtimeGame as useGameSocket } from '@/hooks/useRealtimeGame'
import type { SessionPlayer, SessionTeam } from '@/lib/appwrite/sessions'
import { useBackButton } from '@/lib/back-button-context'
import type { HighLowRoundResultPayload, PlayerJoinedPayload, ScoreEntry } from '@/lib/game-types'
import { QUESTIONS_PER_GAME, seededShuffleAndLimitQuestions } from '@/lib/games/question-limit'
import {
  getHostSession,
  hostAuthHeaders,
  hostJsonHeaders,
  updateHostSession,
} from '@/lib/session-host-secret'
import { playerJsonHeaders, savePlayerSecret } from '@/lib/session-player-secret'

import { HostLobby } from './HostLobby'
import { HostReveal } from './HostReveal'
import { HostRound } from './HostRound'
import { HostSetupView } from './HostSetupView'

type HLPhase = 'setup' | 'lobby' | 'guessing' | 'voting' | 'revealed' | 'finished'

interface Props {
  pin: string
  team1: SessionTeam
  team2: SessionTeam
  initialPlayers: SessionPlayer[]
  questionLimit?: number
}

export default function HostHighLowScreen({
  pin,
  team1,
  team2,
  initialPlayers,
  questionLimit = QUESTIONS_PER_GAME,
}: Props) {
  const { setHidden: setBackHidden } = useBackButton()
  useEffect(() => {
    setBackHidden(true)
    return () => setBackHidden(false)
  }, [setBackHidden])

  const [phase, setPhase] = useState<HLPhase>('setup')
  const [players, setPlayers] = useState<SessionPlayer[]>(initialPlayers)
  const [roundIndex, setRoundIndex] = useState(0)
  const [guessingTeamId, setGuessingTeamId] = useState(team1.teamId)
  const [captainIndices, setCaptainIndices] = useState<Record<string, number>>({
    [team1.teamId]: 0,
    [team2.teamId]: 0,
  })
  const [submittedNumber, setSubmittedNumber] = useState<string | null>(null)
  const [resultData, setResultData] = useState<HighLowRoundResultPayload | null>(null)
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [menuOpen, setMenuOpen] = useState(false)

  const [hostPlayerId, setHostPlayerId] = useState<string | null>(null)
  const [numberInput, setNumberInput] = useState('')
  const [hostSubmitting, setHostSubmitting] = useState(false)
  const [hostVoted, setHostVoted] = useState(false)
  const [hostVotedChoice, setHostVotedChoice] = useState<'mniej' | 'wiecej' | null>(null)
  const [hostActionLoading, setHostActionLoading] = useState<
    'setup' | 'start' | 'next' | 'finish' | null
  >(null)
  const teamScores = useMemo(
    () =>
      [team1, team2].map((team) => ({
        teamId: team.teamId,
        teamName: team.teamName,
        score: Math.max(
          0,
          ...scores.filter((score) => score.playerTeamId === team.teamId).map((score) => score.score)
        ),
      })),
    [scores, team1, team2]
  )

  const votingTeamId = guessingTeamId === team1.teamId ? team2.teamId : team1.teamId
  const guessingTeam = guessingTeamId === team1.teamId ? team1 : team2
  const votingTeam = votingTeamId === team1.teamId ? team1 : team2
  const highLowQuestions = useMemo(
    () => seededShuffleAndLimitQuestions(HIGHLOW_QUESTIONS, pin, questionLimit),
    [pin, questionLimit]
  )

  const teamPlayers = useCallback(
    (teamId: string) => players.filter((p) => p.teamId === teamId),
    [players]
  )

  const currentCaptain = useCallback(
    (teamId: string) => {
      const tp = teamPlayers(teamId)
      if (!tp.length) return null
      return tp[(captainIndices[teamId] ?? 0) % tp.length]
    },
    [teamPlayers, captainIndices]
  )

  const currentQuestion = useMemo(
    () => highLowQuestions[roundIndex % highLowQuestions.length],
    [highLowQuestions, roundIndex]
  )

  const guessingCaptain = currentCaptain(guessingTeamId)
  const votingCaptain = currentCaptain(votingTeamId)
  const isHostGuessingCaptain = hostPlayerId !== null && guessingCaptain?.playerId === hostPlayerId
  const isHostVotingCaptain = hostPlayerId !== null && votingCaptain?.playerId === hostPlayerId

  // Hydrate on mount — pick up identity + persisted scores + current round state
  // so a refresh during HL doesn't bounce the host back to setup.
  useEffect(() => {
    const stored = getHostSession(pin)
    if (stored?.hostPlayerId) setHostPlayerId(stored.hostPlayerId)

    fetch(`/api/sessions/${pin}/host-resume`, { headers: hostAuthHeaders(pin) })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.ok) return
        if (Array.isArray(data.players) && data.players.length) setPlayers(data.players)
        if (Array.isArray(data.scores)) setScores(data.scores)
        if (data.highlowData) {
          const hl = data.highlowData
          if (typeof hl.questionIndex === 'number') setRoundIndex(hl.questionIndex)
          if (typeof hl.guessingTeamId === 'string') setGuessingTeamId(hl.guessingTeamId)
          if (typeof hl.currentNumber === 'string') setSubmittedNumber(hl.currentNumber)
          if (hl.currentResult) {
            setResultData(hl.currentResult)
            setScores(hl.currentResult.scores)
          }
        }
        const hasIdentity = Boolean(stored?.hostPlayerId)
        if (data.status === 'finished') setPhase('finished')
        else if (data.status === 'active') {
          setPhase(
            data.highlowData?.currentResult
              ? 'revealed'
              : data.highlowData?.currentNumber
                ? 'voting'
                : 'guessing'
          )
        } else if (hasIdentity) setPhase('lobby')
      })
      .catch(() => {})
  }, [pin])

  useLobbyPlayersPolling<SessionPlayer>({
    active: phase === 'lobby',
    pin,
    onPlayers: setPlayers,
  })

  const applyNumberSubmitted = useCallback((number: string) => {
    setSubmittedNumber(number)
    setHostSubmitting(false)
    setPhase('voting')
  }, [])

  const applyRoundResult = useCallback((result: HighLowRoundResultPayload) => {
    setResultData(result)
    setScores(result.scores)
    setHostSubmitting(false)
    setHostVoted(true)
    setPhase('revealed')
  }, [])

  useGameSocket(pin, {
    onPlayerJoined: useCallback((d: PlayerJoinedPayload) => {
      setPlayers((p) =>
        p.some((x) => x.playerId === d.playerId)
          ? p
          : [...p, { ...d, teamName: d.teamName ?? null }]
      )
    }, []),
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
    if (phase !== 'guessing' && phase !== 'voting') return

    const refreshRoundState = async () => {
      if (document.visibilityState !== 'visible') return

      try {
        const response = await fetch(`/api/sessions/${pin}/host-resume`, {
          headers: hostAuthHeaders(pin),
        })
        if (!response.ok) return
        const data = await response.json()
        const highlow = data.highlowData
        if (!highlow) return

        if (highlow.currentResult) {
          applyRoundResult(highlow.currentResult)
          return
        }

        if (typeof highlow.currentNumber === 'string') {
          applyNumberSubmitted(highlow.currentNumber)
        }
      } catch {
        // Realtime is primary; this is only the recovery path.
      }
    }

    void refreshRoundState()
    const id = window.setInterval(refreshRoundState, 5000)
    return () => window.clearInterval(id)
  }, [applyNumberSubmitted, applyRoundResult, phase, pin])

  const handleSetupComplete = useCallback(
    async (name: string, avatar: string, chosenTeamId: string) => {
      if (hostActionLoading) return
      setHostActionLoading('setup')
      const chosenTeam = chosenTeamId === team1.teamId ? team1 : team2
      try {
        const res = await fetch(`/api/sessions/${pin}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            playerName: name,
            avatar,
            teamId: chosenTeam.teamId,
            teamName: chosenTeam.teamName,
          }),
        })
        if (res.ok) {
          const data = await res.json()
          const resolvedHostName = typeof data.playerName === 'string' ? data.playerName : name
          const resolvedTeamName =
            typeof data.teamName === 'string' ? data.teamName : chosenTeam.teamName
          if (typeof data.playerSecret === 'string') {
            savePlayerSecret(pin, data.playerId, data.playerSecret)
          }
          updateHostSession(pin, {
            hostName: resolvedHostName,
            hostAvatar: avatar,
            hostPlayerId: data.playerId,
          })
          setHostPlayerId(data.playerId)
          setPlayers((p) => {
            if (p.some((x) => x.playerId === data.playerId)) return p
            return [
              ...p,
              {
                playerId: data.playerId,
                playerName: resolvedHostName,
                avatar,
                teamId: chosenTeam.teamId,
                teamName: resolvedTeamName,
              },
            ]
          })
        }
      } catch {
        // Non-fatal — host proceeds to lobby without player identity
      } finally {
        setHostActionLoading(null)
      }
      setPhase('lobby')
    },
    [pin, team1, team2, hostActionLoading]
  )

  const resetCaptainState = useCallback(() => {
    setNumberInput('')
    setHostSubmitting(false)
    setHostVoted(false)
    setHostVotedChoice(null)
  }, [])

  const startRound = useCallback(
    async (rIdx: number, gTeamId: string) => {
      const gCaptain = currentCaptain(gTeamId)
      const vTeamId = gTeamId === team1.teamId ? team2.teamId : team1.teamId
      const vCaptain = currentCaptain(vTeamId)
      if (!gCaptain || !vCaptain) return

      const q = highLowQuestions[rIdx % highLowQuestions.length]
      const gTeam = gTeamId === team1.teamId ? team1 : team2
      const vTeam = vTeamId === team1.teamId ? team1 : team2

      await fetch(`/api/sessions/${pin}/highlow/round`, {
        method: 'POST',
        headers: hostJsonHeaders(pin),
        body: JSON.stringify({
          roundIndex: rIdx,
          questionText: q.text,
          questionUnit: q.unit,
          guessingTeamId: gTeamId,
          guessingTeamName: gTeam.teamName,
          votingTeamId: vTeamId,
          votingTeamName: vTeam.teamName,
          guessingCaptainId: gCaptain.playerId,
          votingCaptainId: vCaptain.playerId,
        }),
      })

      setSubmittedNumber(null)
      setResultData(null)
      resetCaptainState()
      setPhase('guessing')
    },
    [currentCaptain, highLowQuestions, pin, team1, team2, resetCaptainState]
  )

  const handleStart = useCallback(async () => {
    if (hostActionLoading) return
    setHostActionLoading('start')
    try {
      await startRound(0, team1.teamId)
    } finally {
      setHostActionLoading(null)
    }
  }, [hostActionLoading, startRound, team1.teamId])

  const handleNextRound = useCallback(async () => {
    if (hostActionLoading) return
    setHostActionLoading('next')
    try {
      const nextRoundIndex = roundIndex + 1
      if (nextRoundIndex >= highLowQuestions.length) {
        await fetch(`/api/sessions/${pin}`, {
          method: 'POST',
          headers: hostJsonHeaders(pin),
          body: JSON.stringify({ action: 'finish', scores, teamScores }),
        })
        setPhase('finished')
        return
      }

      const nextGuessingTeamId = votingTeamId
      const newCaptainIndices = {
        ...captainIndices,
        [guessingTeamId]: (captainIndices[guessingTeamId] ?? 0) + 1,
        [votingTeamId]: (captainIndices[votingTeamId] ?? 0) + 1,
      }
      setRoundIndex(nextRoundIndex)
      setGuessingTeamId(nextGuessingTeamId)
      setCaptainIndices(newCaptainIndices)
      await startRound(nextRoundIndex, nextGuessingTeamId)
    } finally {
      setHostActionLoading(null)
    }
  }, [
    hostActionLoading,
    roundIndex,
    highLowQuestions.length,
    pin,
    scores,
    votingTeamId,
    guessingTeamId,
    captainIndices,
    teamScores,
    startRound,
  ])

  const handleFinish = useCallback(async () => {
    if (hostActionLoading) return
    setHostActionLoading('finish')
    setMenuOpen(false)
    try {
      await fetch(`/api/sessions/${pin}`, {
        method: 'POST',
        headers: hostJsonHeaders(pin),
        body: JSON.stringify({ action: 'finish', scores, teamScores }),
      })
      setPhase('finished')
    } finally {
      setHostActionLoading(null)
    }
  }, [pin, scores, teamScores, hostActionLoading])

  const handleHostSubmitNumber = useCallback(async () => {
    const num = numberInput.trim()
    if (!num || hostSubmitting || !hostPlayerId) return
    setHostSubmitting(true)
    try {
      const response = await fetch(`/api/sessions/${pin}/highlow/number`, {
        method: 'POST',
        headers: playerJsonHeaders(pin, hostPlayerId),
        body: JSON.stringify({ playerId: hostPlayerId, number: num }),
      })
      if (response.ok) applyNumberSubmitted(num)
      else setHostSubmitting(false)
    } catch {
      setHostSubmitting(false)
    }
  }, [applyNumberSubmitted, pin, hostPlayerId, numberInput, hostSubmitting])

  const handleHostVote = useCallback(
    async (vote: 'mniej' | 'wiecej') => {
      if (hostVoted || hostSubmitting || !hostPlayerId) return
      setHostVoted(true)
      setHostVotedChoice(vote)
      setHostSubmitting(true)
      try {
        const response = await fetch(`/api/sessions/${pin}/highlow/vote`, {
          method: 'POST',
          headers: playerJsonHeaders(pin, hostPlayerId),
          body: JSON.stringify({ playerId: hostPlayerId, vote }),
        })
        if (!response.ok) {
          setHostVoted(false)
          setHostVotedChoice(null)
          setHostSubmitting(false)
          return
        }
        const data = await response.json().catch(() => null)
        if (data?.result) applyRoundResult(data.result)
        else setHostSubmitting(false)
      } catch {
        setHostVoted(false)
        setHostVotedChoice(null)
        setHostSubmitting(false)
      }
    },
    [applyRoundResult, pin, hostPlayerId, hostVoted, hostSubmitting]
  )

  return (
    <div className="flex min-h-dvh w-full flex-col">
      {/* Header — hidden in setup */}
      {phase !== 'setup' && (
        <div
          className="relative z-20 shrink-0 border-b"
          style={{ borderColor: 'rgba(255,220,180,0.1)' }}
        >
          <div className="mx-auto grid max-w-5xl grid-cols-3 items-center px-6 py-4">
            <div className="flex items-center gap-2">
              <Zap size={14} style={{ color: 'var(--neon-pink)' }} />
              <span className="text-text-muted text-xs font-semibold tracking-normal uppercase">
                PIN: <span className="text-text-primary">{pin}</span>
              </span>
            </div>
            <div className="flex justify-center">
              {phase !== 'lobby' && phase !== 'finished' && (
                <span
                  className="rounded-full border px-3 py-1 text-[10px] font-bold tracking-normal uppercase"
                  style={{
                    color: 'var(--sheriff-pink)',
                    borderColor: 'rgba(255,215,0,0.35)',
                    backgroundColor: 'rgba(255,215,0,0.08)',
                  }}
                >
                  Runda {roundIndex + 1} / {highLowQuestions.length}
                </span>
              )}
            </div>
            <div className="flex items-center justify-end gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 animate-pulse rounded-full"
                  style={{ backgroundColor: 'var(--neon-pink)' }}
                />
                <span className="text-text-muted text-xs font-bold">LIVE</span>
              </div>
              {phase !== 'finished' && (
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border"
                    style={{
                      borderColor: 'rgba(255,220,180,0.18)',
                      backgroundColor: 'rgba(255,220,180,0.05)',
                      color: 'rgba(255,220,180,0.65)',
                    }}
                  >
                    {menuOpen ? <X size={15} /> : <Menu size={15} />}
                  </motion.button>
                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: -6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        className="absolute top-10 right-0 z-[100] min-w-[180px] rounded-2xl border p-1.5 shadow-xl"
                        style={{
                          borderColor: 'rgba(255,220,180,0.15)',
                          backgroundColor: 'rgba(13,8,24,0.95)',
                          backdropFilter: 'blur(16px)',
                        }}
                      >
                        <button
                          onClick={handleFinish}
                          disabled={hostActionLoading === 'finish'}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold"
                          style={{ color: '#ef4444' }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)')
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = 'transparent')
                          }
                        >
                          {hostActionLoading === 'finish' ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Flag size={14} />
                          )}{' '}
                          Zakończ grę
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto p-6 sm:p-12">
        <div className="mx-auto w-full max-w-3xl">
          <AnimatePresence mode="wait">
            {phase === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <HostSetupView
                  team1={team1}
                  team2={team2}
                  onContinue={handleSetupComplete}
                  onBack={() => {
                    window.location.href = '/graj/host'
                  }}
                  loading={hostActionLoading === 'setup'}
                />
              </motion.div>
            )}

            {phase === 'lobby' && (
              <motion.div
                key="lobby"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <HostLobby
                  pin={pin}
                  players={players}
                  team1={team1}
                  team2={team2}
                  onStart={handleStart}
                  starting={hostActionLoading === 'start'}
                />
              </motion.div>
            )}

            {(phase === 'guessing' || phase === 'voting') && (
              <motion.div key={`round-${roundIndex}-${phase}`}>
                <HostRound
                  phase={phase}
                  currentQuestion={currentQuestion}
                  scores={scores}
                  team1={team1}
                  team2={team2}
                  guessingTeam={guessingTeam}
                  votingTeam={votingTeam}
                  guessingCaptain={guessingCaptain}
                  votingCaptain={votingCaptain}
                  submittedNumber={submittedNumber}
                  isHostGuessingCaptain={isHostGuessingCaptain}
                  isHostVotingCaptain={isHostVotingCaptain}
                  numberInput={numberInput}
                  onNumberInputChange={setNumberInput}
                  onHostSubmitNumber={handleHostSubmitNumber}
                  hostSubmitting={hostSubmitting}
                  hostVoted={hostVoted}
                  hostVotedChoice={hostVotedChoice}
                  onHostVote={handleHostVote}
                />
              </motion.div>
            )}

            {phase === 'revealed' && resultData && (
              <motion.div key={`revealed-${roundIndex}`}>
                <HostReveal
                  resultData={resultData}
                  guessingTeam={guessingTeam}
                  votingTeam={votingTeam}
                  questionHint={currentQuestion.hint}
                  onNextRound={handleNextRound}
                  nextLoading={hostActionLoading === 'next'}
                />
              </motion.div>
            )}

            {phase === 'finished' && (
              <motion.div
                key="finished"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GameSummary
                  scores={[]}
                  teamScores={[team1, team2].map((t) => ({
                    id: t.teamId,
                    name: t.teamName,
                    score: teamScores.find((score) => score.teamId === t.teamId)?.score ?? 0,
                  }))}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
