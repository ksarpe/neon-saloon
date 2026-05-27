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

  // ── Host identity ────────────────────────────────────────────────────────────
  const [hostName, setHostName] = useState('')
  const [hostAvatar, setHostAvatar] = useState<string | null>(null)

  useEffect(() => {
    const stored = readHostProfile(pin)
    if (stored?.hostName) setHostName(stored.hostName)
    if (stored?.hostAvatar) setHostAvatar(stored.hostAvatar)
  }, [pin])

  // ── Host-as-player state ─────────────────────────────────────────────────────
  const [hostPlayerId, setHostPlayerId] = useState<string | null>(null)
  const [hostTeamChoice, setHostTeamChoice] = useState<'team1' | 'team2' | null>(null)
  const [hostNumberInput, setHostNumberInput] = useState('')
  const [hostVoted, setHostVoted] = useState(false)
  const [hostVotedChoice, setHostVotedChoice] = useState<'mniej' | 'wiecej' | null>(null)
  const [hostSubmitting, setHostSubmitting] = useState(false)

  // ── Game state ───────────────────────────────────────────────────────────────
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

  // Team setup form
  const [team1Name, setTeam1Name] = useState('')
  const [team2Name, setTeam2Name] = useState('')
  const [teamSetupLoading, setTeamSetupLoading] = useState(false)

  // Action loading
  const [hostActionLoading, setHostActionLoading] = useState<'start' | 'next' | 'finish' | null>(null)

  // ── Refs ─────────────────────────────────────────────────────────────────────
  // Counts team-created events so the first always maps to team1, second to team2.
  const teamCreatedCountRef = useRef(0)
  // Captures team objects synchronously — available before React re-renders.
  const createdTeamsRef = useRef<SessionTeam[]>([])
  // Guards against re-registering as player more than once per WS connection.
  const registeredOnThisConnectionRef = useRef(false)
  // Stable refs to avoid stale closures in snapshot effect.
  const sendRef = useRef<((body: Parameters<ReturnType<typeof usePartyConnection>['send'] & object>[0]) => Promise<unknown>) | null>(null)
  const hostNameRef = useRef(hostName)
  const hostAvatarRef = useRef(hostAvatar)
  useEffect(() => { hostNameRef.current = hostName }, [hostName])
  useEffect(() => { hostAvatarRef.current = hostAvatar }, [hostAvatar])

  // ── Derived values ───────────────────────────────────────────────────────────
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
  const isHostGuessingCaptain = Boolean(hostPlayerId && guessingCaptain?.playerId === hostPlayerId)
  const isHostVotingCaptain = Boolean(hostPlayerId && votingCaptain?.playerId === hostPlayerId)

  const currentQuestion = useMemo(
    () => highLowQuestions[roundIndex % highLowQuestions.length],
    [highLowQuestions, roundIndex],
  )

  // ── Event handlers (memoised, fed to usePartyConnection) ────────────────────
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
        // First event → team1, second event → team2.
        // Both ref (synchronous) and state (async) are updated so that:
        //  - createdTeamsRef is readable immediately in handleTeamSetup after await
        //  - team1/team2 state drives the render
        createdTeamsRef.current = [...createdTeamsRef.current, d]
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

  const { send, snapshot, status } = usePartyConnection({ pin, partyToken, role: 'host', handlers })

  // Keep sendRef in sync so snapshot effect can call send without it as a dep.
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendRef.current = send as any
  }, [send])

  // Reset registration guard whenever the WS drops so we re-register on next connect.
  useEffect(() => {
    if (status === 'connecting' || status === 'closed') {
      registeredOnThisConnectionRef.current = false
    }
  }, [status])

  // ── Snapshot hydration on (re)connect ────────────────────────────────────────
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
    } else if (snapshot.teams.length >= 2) {
      setPhase((p) => (p === 'setup' || p === 'team-setup' ? 'lobby' : p))
      setGuessingTeamId(snapshot.teams[0].teamId)
    }

    // ── Host-as-player: restore state from snapshot on reconnect ─────────────
    const hostPlayer = snapshot.players.find((p) => p.playerId === `host-${pin}`)
    if (hostPlayer?.teamId) {
      setHostPlayerId(`host-${pin}`)
      // Re-register once per connection to restore connectionMeta.playerId on the server.
      if (!registeredOnThisConnectionRef.current) {
        const currentSend = sendRef.current
        const name = hostNameRef.current.trim()
        const avatar = hostAvatarRef.current
        if (currentSend && name && avatar) {
          registeredOnThisConnectionRef.current = true
          void currentSend({
            type: 'host:register-player',
            playerName: name,
            avatar,
            teamId: hostPlayer.teamId,
          } as Parameters<NonNullable<typeof send>>[0]).catch(console.error)
        }
      }
    }
  // snapshot is the only reactive dep; stable refs are used for everything else.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot])

  // ── Actions ──────────────────────────────────────────────────────────────────

  const handleSetupComplete = useCallback(() => {
    if (!hostName.trim() || !hostAvatar) return
    updateHostProfile(pin, { hostName: hostName.trim(), hostAvatar })
    setPhase('team-setup')
  }, [pin, hostName, hostAvatar])

  const handleTeamSetup = useCallback(async () => {
    const t1 = team1Name.trim()
    const t2 = team2Name.trim()
    if (!t1 || !t2 || !hostTeamChoice || teamSetupLoading || !send) return
    setTeamSetupLoading(true)
    try {
      // 1. Create the teams on the server.
      const result = await send({ type: 'host:highlow-setup', team1Name: t1, team2Name: t2 })
      if (!result.ok) {
        console.error('[host:highlow-setup] rejected:', result.error)
        return
      }

      // 2. By the time the ack arrives, both team-created events have already been
      //    processed (server broadcasts events before sending the ack), so
      //    createdTeamsRef has both teams available synchronously.
      const teams = createdTeamsRef.current
      const chosenTeamId =
        hostTeamChoice === 'team1' ? teams[0]?.teamId : teams[1]?.teamId

      if (chosenTeamId && hostAvatar && hostName.trim()) {
        const regResult = await send({
          type: 'host:register-player',
          playerName: hostName.trim(),
          avatar: hostAvatar,
          teamId: chosenTeamId,
        })
        if (regResult.ok) {
          registeredOnThisConnectionRef.current = true
          setHostPlayerId(`host-${pin}`)
        }
      }

      setPhase('lobby')
    } finally {
      setTeamSetupLoading(false)
    }
  }, [team1Name, team2Name, hostTeamChoice, teamSetupLoading, send, pin, hostAvatar, hostName])

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

      // Reset per-round host state.
      setSubmittedNumber(null)
      setResultData(null)
      setPhase('guessing')
      setHostVoted(false)
      setHostVotedChoice(null)
      setHostNumberInput('')
      setHostSubmitting(false)
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

  const handleHostSubmitNumber = useCallback(async () => {
    if (!hostNumberInput.trim() || hostSubmitting || !send) return
    setHostSubmitting(true)
    try {
      await send({ type: 'player:highlow-number', number: hostNumberInput.trim() })
    } finally {
      setHostSubmitting(false)
    }
  }, [hostNumberInput, hostSubmitting, send])

  const handleHostVote = useCallback(async (vote: 'mniej' | 'wiecej') => {
    if (hostVoted || hostSubmitting || !send) return
    setHostSubmitting(true)
    setHostVotedChoice(vote)
    try {
      const result = await send({ type: 'player:highlow-vote', vote })
      if (result.ok) setHostVoted(true)
    } finally {
      setHostSubmitting(false)
    }
  }, [hostVoted, hostSubmitting, send])

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
                      Nadaj nazwy dwóm bandom i wybierz swoją.
                    </p>
                  </div>

                  {/* Team name inputs */}
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
                        onKeyDown={(e) => e.key === 'Enter' && void handleTeamSetup()}
                      />
                    </div>
                  </div>

                  {/* Host team picker */}
                  <div className="flex flex-col gap-2">
                    <label className="text-text-muted block text-xs font-semibold uppercase">
                      Dołączasz do…
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['team1', 'team2'] as const).map((key, i) => {
                        const label = (i === 0 ? team1Name : team2Name).trim() || `Drużyna ${i + 1}`
                        const selected = hostTeamChoice === key
                        return (
                          <motion.button
                            key={key}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setHostTeamChoice(key)}
                            className="rounded-2xl border-2 px-4 py-4 text-sm font-bold transition-all"
                            style={{
                              borderColor: selected ? 'var(--neon-pink)' : 'rgba(255,220,180,0.18)',
                              backgroundColor: selected
                                ? 'rgba(255,16,240,0.12)'
                                : 'rgba(255,220,180,0.04)',
                              color: selected ? 'var(--neon-pink)' : 'rgba(255,220,180,0.65)',
                            }}
                          >
                            {label}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>

                  <Button
                    type="primary"
                    onClick={handleTeamSetup}
                    disabled={!team1Name.trim() || !team2Name.trim() || !hostTeamChoice || teamSetupLoading}
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
                  isHostGuessingCaptain={isHostGuessingCaptain}
                  isHostVotingCaptain={isHostVotingCaptain}
                  numberInput={hostNumberInput}
                  onNumberInputChange={setHostNumberInput}
                  onHostSubmitNumber={handleHostSubmitNumber}
                  hostSubmitting={hostSubmitting}
                  hostVoted={hostVoted}
                  hostVotedChoice={hostVotedChoice}
                  onHostVote={handleHostVote}
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
