'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Flag, Loader2, Menu, X, Zap } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { GameSummary } from '@/components/GameSummary'
import { SetupView } from '@/components/Host/SetupView'
import { Button } from '@/components/ui/button'
import { HIGHLOW_QUESTIONS } from '@/config/games/highlow'
import { usePartyConnection } from '@/hooks/usePartyConnection'
import { useBackButton } from '@/lib/back-button-context'
import type { HighLowRoundResultPayload, PlayerJoinedPayload, ScoreEntry, TeamCreatedPayload } from '@/lib/game-types'
import { QUESTIONS_PER_GAME, seededShuffleAndLimitQuestions } from '@/lib/games/question-limit'
import { readHostProfile, updateHostProfile } from '@/lib/party-ticket-client'
import type { SessionPlayer, SessionTeam } from '@/lib/session-types'

import { HostLobby } from './HostLobby'
import { HostReveal } from './HostReveal'
import { HostRound } from './HostRound'

type HLPhase = 'setup' | 'team-setup' | 'lobby' | 'guessing' | 'voting' | 'revealed' | 'finished'

interface Props {
  pin: string
  partyToken: string
  questionLimit?: number
}

export function PartyHostHighLowScreen({ pin, partyToken, questionLimit = QUESTIONS_PER_GAME }: Props) {
  const { setHidden: setBackHidden } = useBackButton()
  useEffect(() => {
    setBackHidden(true)
    return () => setBackHidden(false)
  }, [setBackHidden])

  // Host identity
  const [hostName, setHostName] = useState('')
  const [hostAvatar, setHostAvatar] = useState<string | null>(null)

  useEffect(() => {
    const stored = readHostProfile(pin)
    if (stored?.hostName) setHostName(stored.hostName)
    if (stored?.hostAvatar) setHostAvatar(stored.hostAvatar)
  }, [pin])

  // Game state
  const [phase, setPhase] = useState<HLPhase>('setup')
  const [players, setPlayers] = useState<SessionPlayer[]>([])
  const [team1, setTeam1] = useState<SessionTeam | null>(null)
  const [team2, setTeam2] = useState<SessionTeam | null>(null)
  const [roundIndex, setRoundIndex] = useState(0)
  const [guessingTeamId, setGuessingTeamId] = useState<string>('')
  const [captainIndices, setCaptainIndices] = useState<Record<string, number>>({})
  const [submittedNumber, setSubmittedNumber] = useState<string | null>(null)
  const [resultData, setResultData] = useState<HighLowRoundResultPayload | null>(null)
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  // Tracks how many team-created events have been received so far (team1 = 1st, team2 = 2nd).
  // Using a ref avoids stale-closure issues inside the memoised handlers object.
  const teamCreatedCountRef = useRef(0)

  // Team setup form
  const [team1Name, setTeam1Name] = useState('')
  const [team2Name, setTeam2Name] = useState('')
  const [teamSetupLoading, setTeamSetupLoading] = useState(false)

  // Action loading
  const [hostActionLoading, setHostActionLoading] = useState<
    'start' | 'next' | 'finish' | null
  >(null)

  const highLowQuestions = useMemo(
    () => seededShuffleAndLimitQuestions(HIGHLOW_QUESTIONS, pin, questionLimit),
    [pin, questionLimit],
  )

  const teamScores = useMemo(
    () =>
      [team1, team2].filter(Boolean).map((team) => ({
        teamId: team!.teamId,
        teamName: team!.teamName,
        score: Math.max(
          0,
          ...scores.filter((s) => s.playerTeamId === team!.teamId).map((s) => s.score),
        ),
      })),
    [scores, team1, team2],
  )

  const votingTeamId = team1 && team2
    ? (guessingTeamId === team1.teamId ? team2.teamId : team1.teamId)
    : ''
  const guessingTeam = team1 && team2
    ? (guessingTeamId === team1.teamId ? team1 : team2)
    : null
  const votingTeam = team1 && team2
    ? (votingTeamId === team1.teamId ? team1 : team2)
    : null

  const teamPlayers = useCallback(
    (teamId: string) => players.filter((p) => p.teamId === teamId),
    [players],
  )

  const currentCaptain = useCallback(
    (teamId: string): SessionPlayer | null => {
      const tp = teamPlayers(teamId)
      if (!tp.length) return null
      return tp[(captainIndices[teamId] ?? 0) % tp.length]
    },
    [teamPlayers, captainIndices],
  )

  const guessingCaptain = guessingTeamId ? currentCaptain(guessingTeamId) : null
  const votingCaptain = votingTeamId ? currentCaptain(votingTeamId) : null

  const currentQuestion = useMemo(
    () => highLowQuestions[roundIndex % highLowQuestions.length],
    [highLowQuestions, roundIndex],
  )

  const applyNumberSubmitted = useCallback((number: string) => {
    setSubmittedNumber(number)
    setPhase('voting')
  }, [])

  const applyRoundResult = useCallback((result: HighLowRoundResultPayload) => {
    setResultData(result)
    setScores(result.scores)
    setPhase('revealed')
  }, [])

  const handlers = useMemo(
    () => ({
      onPlayerJoined: (d: PlayerJoinedPayload) => {
        setPlayers((p) =>
          p.some((x) => x.playerId === d.playerId)
            ? p
            : [...p, { ...d, teamName: d.teamName ?? null }],
        )
      },
      onTeamCreated: (d: TeamCreatedPayload) => {
        // First event → team1, second event → team2. The counter is held in a
        // ref so the memoised handler always reads the current value.
        teamCreatedCountRef.current += 1
        if (teamCreatedCountRef.current === 1) {
          setTeam1(d)
        } else {
          setTeam2(d)
        }
      },
      onHighLowNumberSubmitted: (d: { number: string }) => applyNumberSubmitted(d.number),
      onHighLowRoundResult: (d: HighLowRoundResultPayload) => applyRoundResult(d),
      onGameFinished: () => setPhase('finished'),
    }),
    [applyNumberSubmitted, applyRoundResult],
  )

  const { send, snapshot } = usePartyConnection({ pin, partyToken, role: 'host', handlers })

  // Snapshot hydration on (re)connect
  useEffect(() => {
    if (!snapshot) return

    setPlayers(snapshot.players as SessionPlayer[])

    if (snapshot.teams.length >= 2) {
      const t1 = snapshot.teams[0] as SessionTeam
      const t2 = snapshot.teams[1] as SessionTeam
      setTeam1(t1)
      setTeam2(t2)
      setCaptainIndices((prev) =>
        Object.keys(prev).length > 0
          ? prev
          : { [t1.teamId]: 0, [t2.teamId]: 0 },
      )
    }

    if (snapshot.status === 'finished') {
      setPhase('finished')
      return
    }

    if (snapshot.status === 'active' && snapshot.highlow) {
      const hl = snapshot.highlow
      setRoundIndex(hl.questionIndex)
      setGuessingTeamId(hl.guessingTeamId)
      if (hl.currentNumber) setSubmittedNumber(hl.currentNumber)
      if (hl.currentResult) {
        setResultData(hl.currentResult)
        setScores(hl.currentResult.scores)
        setPhase('revealed')
      } else {
        setPhase(hl.currentNumber ? 'voting' : 'guessing')
      }
      return
    }

    if (snapshot.teams.length >= 2) {
      setPhase((p) => (p === 'setup' || p === 'team-setup' ? 'lobby' : p))
      if (snapshot.teams.length >= 2) {
        setGuessingTeamId(snapshot.teams[0].teamId)
      }
    }
  }, [snapshot])

  // ── Actions ─────────────────────────────────────────────────────────────────

  const handleSetupComplete = useCallback(() => {
    if (!hostName.trim() || !hostAvatar) return
    updateHostProfile(pin, { hostName: hostName.trim(), hostAvatar })
    setPhase('team-setup')
  }, [pin, hostName, hostAvatar])

  const handleTeamSetup = useCallback(async () => {
    const t1 = team1Name.trim()
    const t2 = team2Name.trim()
    if (!t1 || !t2 || teamSetupLoading || !send) return
    setTeamSetupLoading(true)
    try {
      const result = await send({ type: 'host:highlow-setup', team1Name: t1, team2Name: t2 })
      if (!result.ok) {
        console.error('[host:highlow-setup] rejected:', result.error)
        return
      }
      setPhase('lobby')
    } finally {
      setTeamSetupLoading(false)
    }
  }, [team1Name, team2Name, teamSetupLoading, send])

  const startRound = useCallback(
    async (
      rIdx: number,
      gTeamId: string,
      localCaptainIndices: Record<string, number>,
    ) => {
      if (!team1 || !team2 || !send) return

      const vTeamId = gTeamId === team1.teamId ? team2.teamId : team1.teamId
      const gTeamPlayers = players.filter((p) => p.teamId === gTeamId)
      const vTeamPlayers = players.filter((p) => p.teamId === vTeamId)
      if (!gTeamPlayers.length || !vTeamPlayers.length) return

      const gCaptain = gTeamPlayers[(localCaptainIndices[gTeamId] ?? 0) % gTeamPlayers.length]
      const vCaptain = vTeamPlayers[(localCaptainIndices[vTeamId] ?? 0) % vTeamPlayers.length]

      const q = highLowQuestions[rIdx % highLowQuestions.length]
      const gTeam = gTeamId === team1.teamId ? team1 : team2
      const vTeam = vTeamId === team1.teamId ? team1 : team2

      await send({
        type: 'host:highlow-round',
        roundIndex: rIdx,
        questionText: q.text,
        questionUnit: q.unit,
        guessingTeamId: gTeamId,
        guessingTeamName: gTeam.teamName,
        votingTeamId: vTeamId,
        votingTeamName: vTeam.teamName,
        guessingCaptainId: gCaptain.playerId,
        votingCaptainId: vCaptain.playerId,
      })

      setSubmittedNumber(null)
      setResultData(null)
      setPhase('guessing')
    },
    [team1, team2, players, highLowQuestions, send],
  )

  const handleStart = useCallback(async () => {
    if (hostActionLoading || !team1 || !team2) return
    setHostActionLoading('start')
    try {
      const initialCaptainIndices = {
        [team1.teamId]: 0,
        [team2.teamId]: 0,
      }
      setCaptainIndices(initialCaptainIndices)
      setGuessingTeamId(team1.teamId)
      setRoundIndex(0)
      await startRound(0, team1.teamId, initialCaptainIndices)
    } finally {
      setHostActionLoading(null)
    }
  }, [hostActionLoading, team1, team2, startRound])

  const handleNextRound = useCallback(async () => {
    if (hostActionLoading || !team1 || !team2 || !send) return
    setHostActionLoading('next')
    try {
      const nextRoundIndex = roundIndex + 1
      if (nextRoundIndex >= highLowQuestions.length) {
        await send({
          type: 'host:finish',
          scores,
          teamScores,
          showPlayerPoints: true,
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
      await startRound(nextRoundIndex, nextGuessingTeamId, newCaptainIndices)
    } finally {
      setHostActionLoading(null)
    }
  }, [
    hostActionLoading,
    roundIndex,
    highLowQuestions.length,
    scores,
    votingTeamId,
    guessingTeamId,
    captainIndices,
    teamScores,
    team1,
    team2,
    send,
    startRound,
  ])

  const handleFinish = useCallback(async () => {
    if (hostActionLoading || !send) return
    setHostActionLoading('finish')
    setMenuOpen(false)
    try {
      await send({ type: 'host:finish', scores, teamScores, showPlayerPoints: true })
      setPhase('finished')
    } finally {
      setHostActionLoading(null)
    }
  }, [hostActionLoading, scores, teamScores, send])

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-dvh w-full flex-col">
      {phase !== 'setup' && phase !== 'team-setup' && (
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

      <div className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto p-6 sm:p-12">
        <div className="mx-auto w-full max-w-3xl">
          <AnimatePresence mode="wait">
            {/* Setup — host name / avatar */}
            {phase === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SetupView
                  name={hostName}
                  onNameChange={setHostName}
                  avatar={hostAvatar}
                  onAvatarChange={setHostAvatar}
                  onContinue={handleSetupComplete}
                  onBack={() => { window.location.href = '/graj/host' }}
                />
              </motion.div>
            )}

            {/* Team setup */}
            {phase === 'team-setup' && (
              <motion.div
                key="team-setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex flex-col gap-6">
                  <div>
                    <h2
                      className="text-3xl font-black"
                      style={{ fontFamily: 'var(--font-app)', color: 'var(--neon-pink)' }}
                    >
                      Drużyny
                    </h2>
                    <p className="text-text-muted mt-1 text-sm">
                      Nadaj nazwy dwóm bandom przed startem.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="text-text-muted mb-1.5 block text-xs font-semibold uppercase">
                        Drużyna 1
                      </label>
                      <input
                        value={team1Name}
                        onChange={(e) => setTeam1Name(e.target.value)}
                        placeholder="np. Kowboje"
                        maxLength={24}
                        className="w-full rounded-xl border px-4 py-3 text-sm font-bold outline-none"
                        style={{
                          borderColor: 'var(--saloon-border)',
                          backgroundColor: 'var(--saloon-surface)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-text-muted mb-1.5 block text-xs font-semibold uppercase">
                        Drużyna 2
                      </label>
                      <input
                        value={team2Name}
                        onChange={(e) => setTeam2Name(e.target.value)}
                        placeholder="np. Indianie"
                        maxLength={24}
                        className="w-full rounded-xl border px-4 py-3 text-sm font-bold outline-none"
                        style={{
                          borderColor: 'var(--saloon-border)',
                          backgroundColor: 'var(--saloon-surface)',
                          color: 'var(--text-primary)',
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleTeamSetup()}
                      />
                    </div>
                  </div>
                  <Button
                    type="primary"
                    onClick={handleTeamSetup}
                    disabled={!team1Name.trim() || !team2Name.trim() || teamSetupLoading}
                    className="w-full"
                  >
                    {teamSetupLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : (
                      'Utwórz drużyny'
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Lobby */}
            {phase === 'lobby' && team1 && team2 && (
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

            {/* Active round */}
            {(phase === 'guessing' || phase === 'voting') && guessingTeam && votingTeam && (
              <motion.div key={`round-${roundIndex}-${phase}`}>
                <HostRound
                  phase={phase as 'guessing' | 'voting'}
                  currentQuestion={currentQuestion}
                  scores={scores}
                  team1={team1!}
                  team2={team2!}
                  guessingTeam={guessingTeam}
                  votingTeam={votingTeam}
                  guessingCaptain={guessingCaptain}
                  votingCaptain={votingCaptain}
                  submittedNumber={submittedNumber}
                  isHostGuessingCaptain={false}
                  isHostVotingCaptain={false}
                  numberInput=""
                  onNumberInputChange={() => {}}
                  onHostSubmitNumber={async () => {}}
                  hostSubmitting={false}
                  hostVoted={false}
                  hostVotedChoice={null}
                  onHostVote={async () => {}}
                />
              </motion.div>
            )}

            {/* Reveal */}
            {phase === 'revealed' && resultData && guessingTeam && votingTeam && (
              <motion.div key={`revealed-${roundIndex}`}>
                <HostReveal
                  resultData={resultData}
                  guessingTeam={guessingTeam}
                  votingTeam={votingTeam}
                  questionHint={currentQuestion?.hint}
                  onNextRound={handleNextRound}
                  nextLoading={hostActionLoading === 'next'}
                />
              </motion.div>
            )}

            {/* Finished */}
            {phase === 'finished' && (
              <motion.div
                key="finished"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <GameSummary
                  scores={[]}
                  teamScores={[team1, team2].filter(Boolean).map((t) => ({
                    id: t!.teamId,
                    name: t!.teamName,
                    score: teamScores.find((ts) => ts.teamId === t!.teamId)?.score ?? 0,
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
