'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRealtimeGame as useGameSocket } from '@/hooks/useRealtimeGame'
import { ensureAnonymousSession } from '@/lib/appwrite/client'
import PlayerGameScreen from '@/components/PlayerGame'
import PlayerHighLowScreen from '@/components/HighLow/PlayerHighLowScreen'
import BattleRoyalePlayer from '@/components/BattleRoyale/BattleRoyalePlayer'
import { useBackButton } from '@/lib/back-button-context'
import type {
  PlayerJoinedPayload,
  TeamCreatedPayload,
  TeamUpdatedPayload,
  GameStartedPayload,
  HighLowRoundStartPayload,
  BRRoundStartPayload,
} from '@/lib/game-types'
import { slide } from './types'
import type { Step, LiveTeam, PlayerInfo } from './types'
import { PinInput } from './PinInput'
import { NameInput } from './NameInput'
import { ModeSelector } from './ModeSelector'
import { TeamPicker } from './TeamPicker'
import { WaitingState } from './WaitingState'

export default function JoinGameForm() {
  const [step, setStep] = useState<Step>('pin')
  const [pin, setPin] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [newTeamName, setNewTeamName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const joiningRef = useRef(false)
  const [liveTeams, setLiveTeams] = useState<LiveTeam[]>([])
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null)
  const [gameMode, setGameMode] = useState<string>('trivia')

  // Regular game start data (quiz/never/categories)
  const [gameStartData, setGameStartData] = useState<GameStartedPayload | null>(null)
  // HighLow first round data
  const [hlRoundData, setHlRoundData] = useState<HighLowRoundStartPayload | null>(null)
  // Battle Royale: store first round data so BattleRoyalePlayer can initialize immediately
  const [brRoundData, setBrRoundData] = useState<BRRoundStartPayload | null>(null)

  const { setHidden: setBackHidden } = useBackButton()

  useEffect(() => {
    setBackHidden(step === 'waiting' || step === 'playing')
  }, [step, setBackHidden])

  // Track pin + playerId in refs so the unload handler can read current values
  const pinRef = useRef(pin)
  const playerIdRef = useRef<string | null>(null)
  useEffect(() => { pinRef.current = pin }, [pin])
  useEffect(() => { playerIdRef.current = playerInfo?.playerId ?? null }, [playerInfo])

  // Send beacon on tab close / component unmount
  useEffect(() => {
    function leave() {
      const pid = playerIdRef.current
      const p = pinRef.current
      if (!pid || !p) return
      navigator.sendBeacon(
        `/api/sessions/${p}/leave`,
        new Blob([JSON.stringify({ playerId: pid })], { type: 'application/json' })
      )
    }
    window.addEventListener('beforeunload', leave)
    return () => {
      window.removeEventListener('beforeunload', leave)
      leave()
    }
  }, [])

  // Pre-fetch existing teams when entering the team step
  useEffect(() => {
    if (step !== 'team' || !pin) return
    fetch(`/api/sessions/${pin}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.teams)) {
          const players: Array<{ teamId: string | null }> = Array.isArray(data.players)
            ? data.players
            : []
          setLiveTeams(
            data.teams.map(
              (t: { teamId: string; teamName: string; color: string; emoji: string }) => ({
                teamId: t.teamId,
                teamName: t.teamName,
                color: t.color,
                emoji: t.emoji,
                memberCount: players.filter((p) => p.teamId === t.teamId).length,
              })
            )
          )
        }
      })
      .catch(() => {})
  }, [step, pin])

  // Subscribe to realtime channel once in team / waiting / playing step
  const shouldSubscribe = step === 'team' || step === 'waiting' || step === 'playing'

  useGameSocket(shouldSubscribe ? pin : null, {
    onPlayerJoined: useCallback((_d: PlayerJoinedPayload) => {
      // memberCount updated authoritatively via onTeamUpdated
    }, []),
    onTeamCreated: useCallback(
      (d: TeamCreatedPayload) =>
        setLiveTeams((p) =>
          p.some((t) => t.teamId === d.teamId) ? p : [...p, { ...d, memberCount: 1 }]
        ),
      []
    ),
    onTeamUpdated: useCallback(
      (d: TeamUpdatedPayload) =>
        setLiveTeams((p) =>
          p.map((t) => (t.teamId === d.teamId ? { ...t, memberCount: d.memberCount } : t))
        ),
      []
    ),
    onGameStarted: useCallback((d: GameStartedPayload) => {
      setGameStartData(d)
      setStep('playing')
    }, []),
    onHighLowRoundStart: useCallback((d: HighLowRoundStartPayload) => {
      setHlRoundData(d)
      setStep('playing')
    }, []),
    onBRRoundStart: useCallback((d: BRRoundStartPayload) => {
      setBrRoundData(d)
      setStep('playing')
    }, []),
  })

  // ── Step handlers ────────────────────────────────────────────────────────────

  const handlePinSubmit = useCallback(async (submittedPin: string) => {
    setPin(submittedPin)
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/sessions/${submittedPin}`)
      if (!res.ok) throw new Error('not_found')
      const data = await res.json()
      if (data.status === 'active' || data.status === 'finished') {
        setError('Ta gra już trwa. Nie możesz teraz dołączyć.')
        return
      }
      setGameMode(data.gameMode ?? 'trivia')
      setStep('name')
    } catch {
      setError('Nie znaleziono salonu. Sprawdź kod i spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }, [])

  const doJoin = useCallback(
    async (teamId: string | null, teamName: string | null) => {
      if (joiningRef.current) return
      joiningRef.current = true
      setLoading(true)
      setError(null)
      try {
        await ensureAnonymousSession().catch((err) =>
          console.warn('[Appwrite] anon session bootstrap failed:', err)
        )
        const res = await fetch(`/api/sessions/${pin}/join`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerName, avatar, teamId, newTeamName: teamName }),
        })
        if (!res.ok) throw new Error()
        const data = await res.json()
        setPlayerInfo({
          playerId: data.playerId,
          avatar: data.avatar,
          teamId: data.teamId,
          teamName,
        })
        setStep('waiting')
      } catch {
        setError('Could not join. Please try again.')
      } finally {
        setLoading(false)
        joiningRef.current = false
      }
    },
    [pin, playerName, avatar]
  )

  // ── Playing: hand off to the appropriate game screen ────────────────────────

  if (step === 'playing' && playerInfo) {
    if (gameMode === 'highlow') {
      return (
        <PlayerHighLowScreen
          pin={pin}
          playerId={playerInfo.playerId}
          playerName={playerName}
          teamId={playerInfo.teamId}
          teamName={playerInfo.teamName}
          avatar={playerInfo.avatar}
          initialRoundData={hlRoundData}
        />
      )
    }
    if (gameMode === 'battle-royale' && brRoundData) {
      return (
        <BattleRoyalePlayer
          pin={pin}
          playerId={playerInfo.playerId}
          playerName={playerName}
          avatar={playerInfo.avatar}
          initialRoundData={brRoundData}
        />
      )
    }
    if (gameStartData) {
      return (
        <PlayerGameScreen
          pin={pin}
          playerId={playerInfo.playerId}
          playerName={playerName}
          teamId={playerInfo.teamId}
          teamName={playerInfo.teamName}
          avatar={playerInfo.avatar}
          initialCard={gameStartData.card}
          initialCardIndex={gameStartData.cardIndex}
        />
      )
    }
  }

  // ── Join / waiting flow ──────────────────────────────────────────────────────

  return (
    <div className="flex h-dvh w-full flex-col items-center justify-center overflow-hidden px-6">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-[-20%] left-[-10%] h-[50vw] w-[50vw] rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute right-[-10%] bottom-[-15%] h-[40vw] w-[40vw] rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <AnimatePresence mode="popLayout" initial={false}>
          {step === 'pin' && (
            <motion.div key="pin" variants={slide} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}>
              <PinInput value={pin} onChange={setPin} onSubmit={handlePinSubmit}
                loading={loading} error={error} />
            </motion.div>
          )}
          {step === 'name' && (
            <motion.div key="name" variants={slide} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}>
              <NameInput value={playerName} onChange={setPlayerName} avatar={avatar}
                onAvatarChange={setAvatar}
                onSubmit={() => {
                  if (gameMode === 'battle-royale') doJoin(null, null)
                  else if (gameMode === 'highlow') setStep('team')
                  else setStep('mode')
                }}
                onBack={() => setStep('pin')} />
            </motion.div>
          )}
          {step === 'mode' && (
            <motion.div key="mode" variants={slide} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}>
              <ModeSelector onSolo={() => doJoin(null, null)} onTeam={() => setStep('team')}
                onBack={() => setStep('name')} loading={loading} />
            </motion.div>
          )}
          {step === 'team' && (
            <motion.div key="team" variants={slide} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}>
              <TeamPicker teams={liveTeams} newTeamName={newTeamName}
                onNewTeamNameChange={setNewTeamName}
                onJoinTeam={(id, name) => doJoin(id, name)}
                onCreateTeam={() => doJoin(null, newTeamName.trim())}
                onBack={() => setStep(gameMode === 'highlow' ? 'name' : 'mode')}
                loading={loading} hideCreate={gameMode === 'highlow'} />
            </motion.div>
          )}
          {step === 'waiting' && playerInfo && (
            <motion.div key="waiting" variants={slide} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}>
              <WaitingState playerName={playerName} teamName={playerInfo.teamName}
                avatar={playerInfo.avatar} />
            </motion.div>
          )}
        </AnimatePresence>

        {error && step !== 'pin' && (
          <p className="mt-4 text-center text-xs text-red-400">{error}</p>
        )}
      </div>
    </div>
  )
}
