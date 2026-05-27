'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'

import BattleRoyalePlayer from '@/components/BattleRoyale/BattleRoyalePlayer'
import PlayerHighLowScreen from '@/components/HighLow/PlayerHighLowScreen'
import PlayerGameScreen from '@/components/PlayerGame'
import { useBackButton } from '@/lib/back-button-context'
import {
  fetchJoinTicket,
  fetchPartyRoomLookup,
  readPlayerCredentials,
  storePlayerCredentials,
} from '@/lib/party-ticket-client'
import { SESSION_PIN_LENGTH } from '@/lib/session-pin'

import { NameInput } from './NameInput'
import { PinInput } from './PinInput'
import { TeamPicker } from './TeamPicker'
import type { LiveTeam, PlayerInfo, Step } from './types'
import { slide } from './types'


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
  const [gameMode, setGameMode] = useState<string>('classic')
  const [partyToken, setPartyToken] = useState<string | null>(null)
  const [resumeChecking, setResumeChecking] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const pinFromUrl = searchParams.get('pin')?.replace(/\D/g, '').slice(0, SESSION_PIN_LENGTH)
      if (!pinFromUrl || pinFromUrl.length !== SESSION_PIN_LENGTH) return false
      return readPlayerCredentials()?.pin === pinFromUrl
    } catch {
      return false
    }
  })
  const resumeAttemptedRef = useRef(false)
  const { setHidden: setBackHidden } = useBackButton()

  useEffect(() => {
    setBackHidden(step === 'playing')
  }, [step, setBackHidden])

  const applyPartyTeams = useCallback((teams: Array<LiveTeam>) => {
    setLiveTeams(
      teams.map((team) => ({
        teamId: team.teamId,
        teamName: team.teamName,
        color: team.color,
        emoji: team.emoji,
        memberCount: team.memberCount ?? 0,
      }))
    )
  }, [])

  useEffect(() => {
    if (step !== 'team' || !pin) return
    let cancelled = false

    const refreshPartyTeams = async () => {
      try {
        const data = await fetchPartyRoomLookup(pin)
        if (!data || cancelled) return
        applyPartyTeams(data.teams)
      } catch {
        // The join ticket is authoritative; this only keeps the picker fresh.
      }
    }

    void refreshPartyTeams()
    const id = window.setInterval(refreshPartyTeams, 2000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [applyPartyTeams, step, pin])

  const tryPartyResume = useCallback(
    async (submittedPin: string) => {
      const stored = readPlayerCredentials()
      if (!stored || stored.pin !== submittedPin) return false

      try {
        const partyRoom = await fetchPartyRoomLookup(submittedPin)
        if (!partyRoom || partyRoom.status === 'finished') return false

        setPin(submittedPin)
        setPlayerName(stored.playerName)
        setAvatar(stored.avatar ?? null)
        setGameMode(stored.gameMode ?? partyRoom.gameMode)
        setPartyToken(stored.partyToken)
        applyPartyTeams(partyRoom.teams)
        setPlayerInfo({
          playerId: stored.playerId,
          avatar: stored.avatar ?? 'default.png',
          teamId: stored.teamId ?? null,
          teamName: stored.teamName ?? null,
        })
        setStep('playing')
        return true
      } catch {
        return false
      }
    },
    [applyPartyTeams]
  )

  const handlePinSubmit = useCallback(
    async (submittedPin: string) => {
      setPin(submittedPin)
      setLoading(true)
      setError(null)
      try {
        if (await tryPartyResume(submittedPin)) return

        const partyRoom = await fetchPartyRoomLookup(submittedPin)
        if (!partyRoom) throw new Error('not_found')
        if (partyRoom.status === 'active' || partyRoom.status === 'finished') {
          setError('Ta gra juz trwa. Nie mozesz teraz dolaczyc.')
          return
        }

        setPartyToken(null)
        setGameMode(partyRoom.gameMode)
        applyPartyTeams(partyRoom.teams)
        setStep('name')
      } catch {
        setError('Nie znaleziono salonu. Sprawdz kod i sprobuj ponownie.')
      } finally {
        setLoading(false)
      }
    },
    [applyPartyTeams, tryPartyResume]
  )

  useEffect(() => {
    if (resumeAttemptedRef.current) return
    resumeAttemptedRef.current = true
    if (!resumeChecking) return

    const pinFromUrl = searchParams.get('pin')?.replace(/\D/g, '').slice(0, SESSION_PIN_LENGTH)
    const targetPin = pinFromUrl && pinFromUrl.length === SESSION_PIN_LENGTH ? pinFromUrl : null
    if (!targetPin) {
      setResumeChecking(false)
      return
    }

    tryPartyResume(targetPin).finally(() => setResumeChecking(false))
  }, [resumeChecking, searchParams, tryPartyResume])

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

  const doJoin = useCallback(
    async (teamId: string | null) => {
      if (joiningRef.current) return
      joiningRef.current = true
      setLoading(true)
      setError(null)
      try {
        const selectedTeam = liveTeams.find((team) => team.teamId === teamId)
        const ticket = await fetchJoinTicket({
          pin,
          playerName,
          avatar: avatar ?? undefined,
          teamId: teamId ?? undefined,
        })

        const resolvedAvatar = avatar ?? 'default.png'
        storePlayerCredentials({
          pin,
          playerId: ticket.playerId,
          partyToken: ticket.partyToken,
          playerName,
          avatar: resolvedAvatar,
          teamId: teamId ?? null,
          teamName: selectedTeam?.teamName ?? null,
          gameMode,
        })
        setPartyToken(ticket.partyToken)
        setPlayerInfo({
          playerId: ticket.playerId,
          avatar: resolvedAvatar,
          teamId: teamId ?? null,
          teamName: selectedTeam?.teamName ?? null,
        })
        setStep('playing')
      } catch {
        setError('Nie udalo sie dolaczyc. Sprobuj ponownie.')
      } finally {
        setLoading(false)
        joiningRef.current = false
      }
    },
    [pin, playerName, avatar, gameMode, liveTeams]
  )

  if (step === 'playing' && playerInfo && partyToken) {
    if (gameMode === 'highlow') {
      return (
        <PlayerHighLowScreen
          pin={pin}
          playerId={playerInfo.playerId}
          playerName={playerName}
          teamId={playerInfo.teamId}
          teamName={playerInfo.teamName}
          avatar={playerInfo.avatar}
          partyToken={partyToken}
        />
      )
    }

    if (gameMode === 'battle-royale') {
      return (
        <BattleRoyalePlayer
          pin={pin}
          playerId={playerInfo.playerId}
          playerName={playerName}
          avatar={playerInfo.avatar}
          partyToken={partyToken}
        />
      )
    }

    return (
      <PlayerGameScreen
        pin={pin}
        playerId={playerInfo.playerId}
        playerName={playerName}
        teamId={playerInfo.teamId}
        teamName={playerInfo.teamName}
        avatar={playerInfo.avatar}
        partyToken={partyToken}
      />
    )
  }

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
            Wracam do gry...
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
                  if (gameMode === 'battle-royale') void doJoin(null)
                  else if (gameMode === 'highlow') setStep('team')
                  else void doJoin(null)
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
                onJoinTeam={(id) => void doJoin(id)}
                onBack={() => setStep('name')}
                loading={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {error && step !== 'pin' && <p className="mt-4 text-center text-xs text-red-400">{error}</p>}
      </div>
    </div>
  )
}
