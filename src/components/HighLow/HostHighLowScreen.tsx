'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Flag, Menu, X } from 'lucide-react'
import { useRealtimeGame as useGameSocket } from '@/hooks/useRealtimeGame'
import { useBackButton } from '@/lib/back-button-context'
import { GameSummary } from '@/components/GameSummary'
import { HIGHLOW_QUESTIONS } from '@/lib/games/highlow'
import { HostSetupView } from './HostSetupView'
import { HostLobby } from './HostLobby'
import { HostRound } from './HostRound'
import { HostReveal } from './HostReveal'
import type {
  HighLowRoundResultPayload,
  ScoreEntry,
  PlayerJoinedPayload,
} from '@/lib/game-types'
import type { SessionTeam, SessionPlayer } from '@/lib/appwrite/sessions'

type HLPhase = 'setup' | 'lobby' | 'guessing' | 'voting' | 'revealed' | 'finished'

interface Props {
  pin: string
  team1: SessionTeam
  team2: SessionTeam
  initialPlayers: SessionPlayer[]
}

export default function HostHighLowScreen({ pin, team1, team2, initialPlayers }: Props) {
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

  const votingTeamId = guessingTeamId === team1.teamId ? team2.teamId : team1.teamId
  const guessingTeam = guessingTeamId === team1.teamId ? team1 : team2
  const votingTeam = votingTeamId === team1.teamId ? team1 : team2

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
    () => HIGHLOW_QUESTIONS[roundIndex % HIGHLOW_QUESTIONS.length],
    [roundIndex]
  )

  const guessingCaptain = currentCaptain(guessingTeamId)
  const votingCaptain = currentCaptain(votingTeamId)
  const isHostGuessingCaptain = hostPlayerId !== null && guessingCaptain?.playerId === hostPlayerId
  const isHostVotingCaptain = hostPlayerId !== null && votingCaptain?.playerId === hostPlayerId

  useEffect(() => {
    if (phase !== 'lobby') return
    const id = setInterval(() => {
      fetch(`/api/sessions/${pin}`)
        .then((r) => r.json())
        .then((d) => { if (d.players) setPlayers(d.players) })
        .catch(() => {})
    }, 3000)
    return () => clearInterval(id)
  }, [phase, pin])

  useGameSocket(pin, {
    onPlayerJoined: useCallback((d: PlayerJoinedPayload) => {
      setPlayers((p) =>
        p.some((x) => x.playerId === d.playerId)
          ? p
          : [...p, { ...d, teamName: d.teamName ?? null }]
      )
    }, []),
    onHighLowNumberSubmitted: useCallback((d: { number: string }) => {
      setSubmittedNumber(d.number)
      setHostSubmitting(false)
      setPhase('voting')
    }, []),
    onHighLowRoundResult: useCallback((d: HighLowRoundResultPayload) => {
      setResultData(d)
      setScores(d.scores)
      setHostSubmitting(false)
      setPhase('revealed')
    }, []),
    onGameFinished: useCallback(() => setPhase('finished'), []),
  })

  const handleSetupComplete = useCallback(
    async (name: string, avatar: string, chosenTeamId: string) => {
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
          setHostPlayerId(data.playerId)
          setPlayers((p) => {
            if (p.some((x) => x.playerId === data.playerId)) return p
            return [...p, { playerId: data.playerId, playerName: name, avatar, teamId: chosenTeam.teamId, teamName: chosenTeam.teamName }]
          })
        }
      } catch {
        // Non-fatal — host proceeds to lobby without player identity
      }
      setPhase('lobby')
    },
    [pin, team1, team2]
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

      const q = HIGHLOW_QUESTIONS[rIdx % HIGHLOW_QUESTIONS.length]
      const gTeam = gTeamId === team1.teamId ? team1 : team2
      const vTeam = vTeamId === team1.teamId ? team1 : team2

      await fetch(`/api/sessions/${pin}/highlow/round`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    [currentCaptain, pin, team1, team2, resetCaptainState]
  )

  const handleStart = useCallback(() => startRound(0, team1.teamId), [startRound, team1.teamId])

  const handleNextRound = useCallback(async () => {
    const nextRoundIndex = roundIndex + 1
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
  }, [roundIndex, votingTeamId, guessingTeamId, captainIndices, startRound])

  const handleFinish = useCallback(async () => {
    setMenuOpen(false)
    await fetch(`/api/sessions/${pin}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'finish', scores, teamScores: [] }),
    })
    setPhase('finished')
  }, [pin, scores])

  const handleHostSubmitNumber = useCallback(async () => {
    const num = numberInput.trim()
    if (!num || hostSubmitting || !hostPlayerId) return
    setHostSubmitting(true)
    try {
      await fetch(`/api/sessions/${pin}/highlow/number`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: hostPlayerId, number: num }),
      })
    } catch {
      setHostSubmitting(false)
    }
  }, [pin, hostPlayerId, numberInput, hostSubmitting])

  const handleHostVote = useCallback(
    async (vote: 'mniej' | 'wiecej') => {
      if (hostVoted || hostSubmitting || !hostPlayerId) return
      setHostVoted(true)
      setHostVotedChoice(vote)
      setHostSubmitting(true)
      try {
        await fetch(`/api/sessions/${pin}/highlow/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId: hostPlayerId, vote, currentScores: scores }),
        })
      } catch {
        setHostVoted(false)
        setHostVotedChoice(null)
        setHostSubmitting(false)
      }
    },
    [pin, hostPlayerId, hostVoted, hostSubmitting, scores]
  )

  return (
    <div className="flex min-h-dvh w-full flex-col">
      {/* Glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-[-20%] left-[-15%] h-[60vw] w-[60vw] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute right-[-15%] bottom-[-20%] h-[60vw] w-[60vw] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)', filter: 'blur(80px)' }}
        />
      </div>

      {/* Header — hidden in setup */}
      {phase !== 'setup' && (
        <div className="relative z-20 shrink-0 border-b" style={{ borderColor: 'rgba(255,220,180,0.1)' }}>
          <div className="mx-auto grid max-w-5xl grid-cols-3 items-center px-6 py-4">
            <div className="flex items-center gap-2">
              <Zap size={14} style={{ color: 'var(--neon-pink)' }} />
              <span className="text-text-muted text-xs font-semibold tracking-widest uppercase">
                PIN: <span className="text-text-primary">{pin}</span>
              </span>
            </div>
            <div className="flex justify-center">
              {phase !== 'lobby' && phase !== 'finished' && (
                <span
                  className="rounded-full border px-3 py-1 text-[10px] font-bold tracking-widest uppercase"
                  style={{ color: 'var(--sheriff-gold)', borderColor: 'rgba(255,215,0,0.35)', backgroundColor: 'rgba(255,215,0,0.08)' }}
                >
                  Runda {roundIndex + 1}
                </span>
              )}
            </div>
            <div className="flex items-center justify-end gap-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: 'var(--neon-pink)' }} />
                <span className="text-text-muted text-xs font-bold">LIVE</span>
              </div>
              {phase !== 'finished' && (
                <div className="relative">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border"
                    style={{ borderColor: 'rgba(255,220,180,0.18)', backgroundColor: 'rgba(255,220,180,0.05)', color: 'rgba(255,220,180,0.65)' }}
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
                        style={{ borderColor: 'rgba(255,220,180,0.15)', backgroundColor: 'rgba(13,8,24,0.95)', backdropFilter: 'blur(16px)' }}
                      >
                        <button
                          onClick={handleFinish}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold"
                          style={{ color: '#ef4444' }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <Flag size={14} /> Zakończ grę
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
              <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <HostSetupView team1={team1} team2={team2} onContinue={handleSetupComplete} />
              </motion.div>
            )}

            {phase === 'lobby' && (
              <motion.div key="lobby" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <HostLobby pin={pin} players={players} team1={team1} team2={team2} onStart={handleStart} />
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
                />
              </motion.div>
            )}

            {phase === 'finished' && (
              <motion.div key="finished" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                <GameSummary
                  scores={scores.map((s) => ({ id: s.playerId, name: s.playerName, score: s.score }))}
                  teamScores={[team1, team2].map((t) => ({
                    id: t.teamId,
                    name: t.teamName,
                    score: scores.filter((s) => s.playerTeamId === t.teamId).reduce((sum, s) => sum + s.score, 0),
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
