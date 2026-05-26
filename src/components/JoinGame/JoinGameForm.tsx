'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import BattleRoyalePlayer from '@/components/BattleRoyale/BattleRoyalePlayer'
import PlayerHighLowScreen from '@/components/HighLow/PlayerHighLowScreen'
import PlayerGameScreen from '@/components/PlayerGame'
import { useRealtimeGame as useGameSocket } from '@/hooks/useRealtimeGame'
import { ensureAnonymousSession } from '@/lib/appwrite/client'
import { fetchJoinTicket } from '@/lib/party-ticket-client'
import { useBackButton } from '@/lib/back-button-context'
import type {
  BRRoundStartPayload,
  GameStartedPayload,
  HighLowRoundResultPayload,
  HighLowRoundStartPayload,
  StandardGameSettings,
  TeamCreatedPayload,
  TeamUpdatedPayload,
  WireCard,
} from '@/lib/game-types'
import { SESSION_PIN_LENGTH } from '@/lib/session-pin'
import {
  clearPlayerSession,
  getPlayerSession,
  playerAuthHeaders,
  savePlayerSession,
} from '@/lib/session-player-secret'

import { NameInput } from './NameInput'
import { PinInput } from './PinInput'
import { TeamPicker } from './TeamPicker'
import type { LiveTeam, PlayerInfo, Step } from './types'
import { slide } from './types'
import { WaitingState } from './WaitingState'

export default function JoinGameForm() {
  const searchParams = useSearchParams()
  const [step, setStep] = useState<Step>('pin')
  const [pin, setPin] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const joiningRef = useRef(false)
  const autoSubmittedPinRef = useRef<string | null>(null)
  const [liveTeams, setLiveTeams] = useState<LiveTeam[]>([])
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null)
  const [gameMode, setGameMode] = useState<string>('trivia')
  // Set when the room is on PartyKit (classic family). Routes the playing
  // screen straight to PartyPlayerGameScreen via PlayerGameScreen's branch.
  const [partyToken, setPartyToken] = useState<string | null>(null)

  // Regular game start data (quiz/never/categories)
  const [gameStartData, setGameStartData] = useState<GameStartedPayload | null>(null)
  // HighLow first round data
  const [hlRoundData, setHlRoundData] = useState<HighLowRoundStartPayload | null>(null)
  const [hlResultData, setHlResultData] = useState<HighLowRoundResultPayload | null>(null)
  // Battle Royale: store first round data so BattleRoyalePlayer can initialize immediately
  const [brRoundData, setBrRoundData] = useState<BRRoundStartPayload | null>(null)

  // Resume-time supplemental state (mid-game catch-up)
  const [classicHasVoted, setClassicHasVoted] = useState(false)
  const [brIsEliminated, setBrIsEliminated] = useState(false)
  const [brHasAnswered, setBrHasAnswered] = useState(false)
  const [hlSubmittedNumber, setHlSubmittedNumber] = useState<string | null>(null)

  // Resume status — drives the brief "Wracam do gry…" splash so the form doesn't flash.
  // Initial value is computed synchronously: only show the splash if we have a stored
  // session for the URL pin (otherwise there's nothing to resume and we render immediately).
  const [resumeChecking, setResumeChecking] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const pinFromUrl = searchParams.get('pin')?.replace(/\D/g, '').slice(0, SESSION_PIN_LENGTH)
      if (!pinFromUrl || pinFromUrl.length !== SESSION_PIN_LENGTH) return false
      return Boolean(getPlayerSession(pinFromUrl))
    } catch {
      return false
    }
  })
  const resumeAttemptedRef = useRef(false)

  const { setHidden: setBackHidden } = useBackButton()

  useEffect(() => {
    setBackHidden(step === 'waiting' || step === 'playing')
  }, [step, setBackHidden])

  // Track pin + playerId + step in refs so the unload handler can read current values
  const pinRef = useRef(pin)
  const playerIdRef = useRef<string | null>(null)
  const stepRef = useRef<Step>(step)
  useEffect(() => {
    pinRef.current = pin
  }, [pin])
  useEffect(() => {
    playerIdRef.current = playerInfo?.playerId ?? null
  }, [playerInfo])
  useEffect(() => {
    stepRef.current = step
  }, [step])

  // Auto-leave on unload — only while still in the lobby (waiting/team). Once the
  // game starts, we keep the player in the session so they can resume after a
  // refresh or accidental tab close. Stored credentials in localStorage let them
  // come back.
  useEffect(() => {
    function leave() {
      const pid = playerIdRef.current
      const p = pinRef.current
      const s = stepRef.current
      if (!pid || !p) return
      if (s !== 'waiting' && s !== 'team') return
      const stored = getPlayerSession(p)
      const secret = stored?.playerId === pid ? stored.playerSecret : null
      navigator.sendBeacon(
        `/api/sessions/${p}/leave`,
        new Blob([JSON.stringify({ playerId: pid, playerSecret: secret })], {
          type: 'application/json',
        })
      )
      clearPlayerSession(p)
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
          setLiveTeams(
            data.teams.map(
              (t: {
                teamId: string
                teamName: string
                color: string
                emoji: string
                memberCount?: number
              }) => ({
                teamId: t.teamId,
                teamName: t.teamName,
                color: t.color,
                emoji: t.emoji,
                memberCount: t.memberCount ?? 0,
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
    onPlayerJoined: useCallback(() => {
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
      setHlResultData(null)
      setStep('playing')
    }, []),
    onBRRoundStart: useCallback((d: BRRoundStartPayload) => {
      setBrRoundData(d)
      setStep('playing')
    }, []),
  })

  // ── Step handlers ────────────────────────────────────────────────────────────

  // Apply a successful /resume payload to local state and jump straight into the game.
  const applyResume = useCallback(
    (
      submittedPin: string,
      data: {
        player: {
          playerId: string
          playerName: string
          avatar: string
          teamId: string | null
          teamName: string | null
        }
        serverNow?: number
        session: { status: string; gameMode: string }
        classic?: {
          cardIndex: number
          card: WireCard
          cardStartedAt?: number | null
          hasVoted: boolean
          settings?: StandardGameSettings | null
        }
        battleRoyale?: {
          questionIndex: number
          totalQuestions: number
          questionText: string
          options: string[]
          timerDuration: number
          roundStartTime: number
          alivePlayers: string[]
          isEliminated: boolean
          hasAnswered: boolean
        }
        highlow?: {
          roundIndex: number
          questionText: string
          questionUnit: string
          guessingTeamId: string
          guessingTeamName: string
          votingTeamId: string
          votingTeamName: string
          guessingCaptainId: string
          votingCaptainId: string
          submittedNumber: string | null
          currentResult?: HighLowRoundResultPayload | null
        }
      }
    ) => {
      setPin(submittedPin)
      setPlayerName(data.player.playerName)
      setAvatar(data.player.avatar)
      setGameMode(data.session.gameMode)
      setPlayerInfo({
        playerId: data.player.playerId,
        avatar: data.player.avatar,
        teamId: data.player.teamId,
        teamName: data.player.teamName,
      })

      const alignServerTimestamp = (timestamp?: number | null) => {
        if (typeof timestamp !== 'number') return undefined
        if (typeof data.serverNow !== 'number') return timestamp
        return Date.now() - Math.max(0, data.serverNow - timestamp)
      }

      if (data.session.status === 'waiting') {
        // Host hasn't started yet — drop back into the waiting room
        setStep('waiting')
        return
      }
      if (data.session.status === 'finished') {
        clearPlayerSession(submittedPin)
        setError('Ta gra już się zakończyła.')
        setStep('pin')
        return
      }

      if (data.battleRoyale) {
        setBrRoundData({
          questionIndex: data.battleRoyale.questionIndex,
          totalQuestions: data.battleRoyale.totalQuestions,
          questionText: data.battleRoyale.questionText,
          options: data.battleRoyale.options,
          timerDuration: data.battleRoyale.timerDuration,
          roundStartTime: data.battleRoyale.roundStartTime,
          alivePlayers: data.battleRoyale.alivePlayers,
        })
        setBrIsEliminated(data.battleRoyale.isEliminated)
        setBrHasAnswered(data.battleRoyale.hasAnswered)
        setStep('playing')
      } else if (data.highlow) {
        setHlRoundData({
          roundIndex: data.highlow.roundIndex,
          questionText: data.highlow.questionText,
          questionUnit: data.highlow.questionUnit,
          guessingTeamId: data.highlow.guessingTeamId,
          guessingTeamName: data.highlow.guessingTeamName,
          votingTeamId: data.highlow.votingTeamId,
          votingTeamName: data.highlow.votingTeamName,
          guessingCaptainId: data.highlow.guessingCaptainId,
          votingCaptainId: data.highlow.votingCaptainId,
        })
        setHlSubmittedNumber(data.highlow.submittedNumber)
        setHlResultData(data.highlow.currentResult ?? null)
        setStep('playing')
      } else if (data.classic) {
        setGameStartData({
          cardIndex: data.classic.cardIndex,
          card: data.classic.card,
          cardStartedAt: alignServerTimestamp(data.classic.cardStartedAt),
          settings: data.classic.settings ?? undefined,
        })
        setClassicHasVoted(data.classic.hasVoted)
        setStep('playing')
      } else {
        // Active session but server couldn't reconstruct game state (e.g. mid-game between rounds).
        // Park player in 'waiting' — they'll auto-advance when the next round/card event fires.
        setStep('waiting')
      }
    },
    []
  )

  const tryResume = useCallback(
    async (submittedPin: string) => {
      const stored = getPlayerSession(submittedPin)
      if (!stored) return false
      try {
        const res = await fetch(`/api/sessions/${submittedPin}/resume`, {
          headers: playerAuthHeaders(submittedPin, stored.playerId),
        })
        if (!res.ok) {
          if (res.status === 401 || res.status === 404) clearPlayerSession(submittedPin)
          return false
        }
        const data = await res.json()
        // Persist any refreshed identity fields (e.g. avatar/team changes)
        savePlayerSession(submittedPin, {
          playerId: data.player.playerId,
          playerSecret: stored.playerSecret,
          playerName: data.player.playerName,
          avatar: data.player.avatar,
          teamId: data.player.teamId,
          teamName: data.player.teamName,
          gameMode: data.session.gameMode,
        })
        applyResume(submittedPin, data)
        return true
      } catch {
        return false
      }
    },
    [applyResume]
  )

  const handlePinSubmit = useCallback(
    async (submittedPin: string) => {
      setPin(submittedPin)
      setLoading(true)
      setError(null)
      try {
        // First — if we have stored creds for this PIN, try to resume regardless of status.
        if (await tryResume(submittedPin)) return

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
    },
    [tryResume]
  )

  // Auto-resume on mount: if we have stored creds for the URL pin, try /resume.
  // resumeChecking was already initialized synchronously above based on the same
  // condition, so reaching this effect implies we have something to try.
  useEffect(() => {
    if (resumeAttemptedRef.current) return
    resumeAttemptedRef.current = true
    if (!resumeChecking) return

    const pinFromUrl = searchParams.get('pin')?.replace(/\D/g, '').slice(0, SESSION_PIN_LENGTH)
    const targetPin = pinFromUrl && pinFromUrl.length === SESSION_PIN_LENGTH ? pinFromUrl : null
    if (!targetPin) return

    // tryResume is async — the setState happens after the fetch settles, not synchronously.

    tryResume(targetPin).finally(() => setResumeChecking(false))
  }, [resumeChecking, searchParams, tryResume])

  useEffect(() => {
    if (resumeChecking) return
    const pinFromUrl = searchParams.get('pin')?.replace(/\D/g, '').slice(0, SESSION_PIN_LENGTH)
    if (
      !pinFromUrl ||
      pinFromUrl.length !== SESSION_PIN_LENGTH ||
      step !== 'pin' ||
      loading ||
      autoSubmittedPinRef.current === pinFromUrl
    ) {
      return
    }

    autoSubmittedPinRef.current = pinFromUrl
    setPin(pinFromUrl)
    void handlePinSubmit(pinFromUrl)
  }, [handlePinSubmit, loading, resumeChecking, searchParams, step])

  useEffect(() => {
    if (step !== 'waiting' || !pin || !playerInfo) return

    const refreshGameState = () => {
      if (window.location.pathname !== '/graj/join') return
      if (document.visibilityState !== 'visible') return
      void tryResume(pin)
    }

    refreshGameState()
    const id = window.setInterval(refreshGameState, 5000)
    return () => window.clearInterval(id)
  }, [pin, playerInfo, step, tryResume])

  const doJoin = useCallback(
    async (teamId: string | null) => {
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
          body: JSON.stringify({ playerName, avatar, teamId }),
        })

        // If Appwrite says the session doesn't exist, the host may have created
        // it on PartyKit instead — try the WebSocket flow before giving up.
        if (res.status === 404) {
          try {
            const ticket = await fetchJoinTicket({
              pin,
              playerName,
              avatar: avatar ?? undefined,
              teamId: teamId ?? undefined,
            })
            setPartyToken(ticket.partyToken)
            setPlayerInfo({
              playerId: ticket.playerId,
              avatar: avatar ?? 'default.png',
              teamId: null,
              teamName: null,
            })
            // PartyPlayerGameScreen handles the waiting-for-host phase itself,
            // so we transition straight into "playing" — no separate WaitingState.
            setStep('playing')
            return
          } catch (partyErr) {
            console.warn('[PartyKit] join ticket failed:', partyErr)
            // Fall through to error message below.
          }
        }

        if (!res.ok) throw new Error()
        const data = await res.json()
        const resolvedPlayerName =
          typeof data.playerName === 'string' ? data.playerName : playerName
        const resolvedTeamName = typeof data.teamName === 'string' ? data.teamName : null
        if (typeof data.playerSecret === 'string') {
          savePlayerSession(pin, {
            playerId: data.playerId,
            playerSecret: data.playerSecret,
            playerName: resolvedPlayerName,
            avatar: data.avatar,
            teamId: data.teamId ?? null,
            teamName: resolvedTeamName,
            gameMode,
          })
        }
        setPlayerName(resolvedPlayerName)
        setPlayerInfo({
          playerId: data.playerId,
          avatar: data.avatar,
          teamId: data.teamId,
          teamName: resolvedTeamName,
        })
        setStep('waiting')
      } catch {
        setError('Could not join. Please try again.')
      } finally {
        setLoading(false)
        joiningRef.current = false
      }
    },
    [pin, playerName, avatar, gameMode]
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
          initialSubmittedNumber={hlSubmittedNumber}
          initialResultData={hlResultData}
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
          initialIsEliminated={brIsEliminated}
          initialHasAnswered={brHasAnswered}
        />
      )
    }
    // PartyKit-backed flow: PartyPlayerGameScreen handles the "waiting for host
    // to start" state internally via the room's snapshot, so we don't gate on
    // gameStartData (it's only produced by the legacy Appwrite Realtime path).
    if (partyToken) {
      return (
        <PlayerGameScreen
          pin={pin}
          playerId={playerInfo.playerId}
          playerName={playerName}
          teamId={playerInfo.teamId}
          teamName={playerInfo.teamName}
          avatar={playerInfo.avatar}
          // Card/index are unknown until the host starts the game — the WS
          // snapshot fills them in. Pass safe placeholders.
          initialCard={{
            id: 'placeholder',
            type: 'QUIZ',
            description: 'Waiting for host…',
          } as WireCard}
          initialCardIndex={0}
          partyToken={partyToken}
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
          initialCardStartedAt={gameStartData.cardStartedAt}
          initialHasVoted={classicHasVoted}
          initialSettings={gameStartData.settings}
        />
      )
    }
  }

  // ── Join / waiting flow ──────────────────────────────────────────────────────

  if (resumeChecking) {
    return (
      <div className="flex min-h-dvh w-full flex-col items-center justify-center px-6 py-20">
        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className="h-10 w-10 animate-spin rounded-full border-2"
            style={{
              borderColor: 'rgba(255,220,180,0.18)',
              borderTopColor: 'var(--neon-pink)',
            }}
          />
          <p
            className="text-xs tracking-normal uppercase"
            style={{ color: 'rgba(255,220,180,0.6)' }}
          >
            Wracam do gry…
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center overflow-y-auto overflow-x-hidden px-6 py-20">
      <div className={`relative z-10 w-full ${step === 'name' ? 'max-w-2xl' : 'max-w-sm'}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          {step === 'pin' && (
            <motion.div
              key="pin"
              variants={slide}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}
            >
              <PinInput
                value={pin}
                onChange={setPin}
                onSubmit={handlePinSubmit}
                loading={loading}
                error={error}
              />
            </motion.div>
          )}
          {step === 'name' && (
            <motion.div
              key="name"
              variants={slide}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}
            >
              <NameInput
                value={playerName}
                onChange={setPlayerName}
                avatar={avatar}
                onAvatarChange={setAvatar}
                onSubmit={() => {
                  if (gameMode === 'battle-royale') doJoin(null)
                  else if (gameMode === 'highlow') setStep('team')
                  else doJoin(null)
                }}
                onBack={() => setStep('pin')}
              />
            </motion.div>
          )}
          {step === 'team' && (
            <motion.div
              key="team"
              variants={slide}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}
            >
              <TeamPicker
                teams={liveTeams}
                onJoinTeam={(id) => doJoin(id)}
                onBack={() => setStep('name')}
                loading={loading}
              />
            </motion.div>
          )}
          {step === 'waiting' && playerInfo && (
            <motion.div
              key="waiting"
              variants={slide}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}
            >
              <WaitingState
                playerName={playerName}
                teamName={playerInfo.teamName}
                avatar={playerInfo.avatar}
              />
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
