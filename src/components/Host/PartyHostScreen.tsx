'use client'

// PartyKit-backed host screen for the classic family of game modes.
// Mirrors the legacy HostScreen UI flow (setup → lobby → active → finished)
// but talks to a Durable Object over WebSocket instead of the old REST path +
// Realtime stack — so a roomful of players never collides on a hot DB row.
//
// The host's identity (display name, avatar) stays in localStorage and the
// game transport is entirely PartyKit.

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { GameSummary } from '@/components/GameSummary'
import { useAutoCountdown } from '@/hooks/useAutoCountdown'
import { useGameSettings } from '@/hooks/useGameSettings'
import { usePartyConnection } from '@/hooks/usePartyConnection'
import { useBackButton } from '@/lib/back-button-context'
import type {
  NextCardPayload,
  PlayerJoinedPayload,
  PlayerLeftPayload,
  VoteCastPayload,
  VotesRevealedPayload,
} from '@/lib/game-types'
import { readHostProfile, updateHostProfile } from '@/lib/party-ticket-client'
import type { ConnectionStatus } from '@/lib/party-ws'
import type { GameCard } from '@/lib/store'

import { ActiveCardView } from './ActiveCardView'
import { HostHeader } from './HostHeader'
import { LobbyView } from './LobbyView'
import { SetupView } from './SetupView'
import type {
  HostPhase,
  LivePlayer,
  ScoreEntry,
  TeamScoreEntry,
  VoteRecord,
} from './types'
import { computeTeamScores } from './types'

type Props = {
  pin: string
  initialCards: GameCard[]
  partyToken: string
}

export default function PartyHostScreen({ pin, initialCards, partyToken }: Props) {
  const { setHidden: setBackHidden } = useBackButton()
  useEffect(() => {
    setBackHidden(true)
    return () => setBackHidden(false)
  }, [setBackHidden])

  const gameSettings = useGameSettings()

  // ─── Host identity (localStorage-backed; independent of transport) ──────────
  const [hostName, setHostName] = useState('')
  const [hostAvatar, setHostAvatar] = useState<string | null>(null)
  const [hostActionLoading, setHostActionLoading] = useState<
    'start' | 'reveal' | 'next' | 'finish' | null
  >(null)

  // ─── Host-as-player state ────────────────────────────────────────────────────
  // The host participates as a player. playerId is fixed as `host-<pin>` so it
  // survives reconnects. We re-register on every connect so the server's
  // per-connection meta stays fresh after WS restarts.
  const [hostPlayerId, setHostPlayerId] = useState<string | null>(null)
  const [hostHasVoted, setHostHasVoted] = useState(false)
  const [hostCardFlipped, setHostCardFlipped] = useState(false)
  const [hostLoading, setHostLoading] = useState(false)
  const prevStatusRef = useRef<ConnectionStatus>('connecting')

  useEffect(() => {
    const stored = readHostProfile(pin)
    if (stored?.hostName) setHostName(stored.hostName)
    if (stored?.hostAvatar) setHostAvatar(stored.hostAvatar)
  }, [pin])

  // ─── Game state (driven by snapshot + events) ───────────────────────────────
  const [phase, setPhase] = useState<HostPhase>('setup')
  const [players, setPlayers] = useState<LivePlayer[]>([])
  const [cards, setCards] = useState<GameCard[]>(initialCards)
  const [cardIndex, setCardIndex] = useState(0)
  const [cardStartedAt, setCardStartedAt] = useState<number | null>(null)
  const [revealStartedAt, setRevealStartedAt] = useState<number | null>(null)
  const [currentVotes, setCurrentVotes] = useState<VoteCastPayload[]>([])
  const [isRevealed, setIsRevealed] = useState(false)
  const [revealedVotes, setRevealedVotes] = useState<VoteRecord[]>([])
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [teamScores, setTeamScores] = useState<TeamScoreEntry[]>([])

  const currentCard: GameCard | undefined = cards[cardIndex]

  useEffect(() => {
    setCards(initialCards)
  }, [initialCards])

  // ─── WebSocket: snapshot resets state, events apply deltas ──────────────────
  const handlers = useMemo(
    () => ({
      onPlayerJoined: (data: PlayerJoinedPayload) => {
        setPlayers((p) => (p.some((x) => x.playerId === data.playerId) ? p : [...p, data]))
      },
      onPlayerLeft: (data: PlayerLeftPayload) => {
        setPlayers((p) => p.filter((x) => x.playerId !== data.playerId))
      },
      onVoteCast: (data: VoteCastPayload) => {
        setCurrentVotes((p) => {
          const filtered = p.filter((x) => x.playerId !== data.playerId)
          return [...filtered, data]
        })
      },
      onVotesRevealed: (data: VotesRevealedPayload) => {
        setRevealedVotes(data.votes)
        setScores(data.scores)
        setTeamScores(data.teamScores ?? [])
        setRevealStartedAt(data.revealStartedAt ?? Date.now())
        setIsRevealed(true)
      },
      onNextCard: (data: NextCardPayload) => {
        setCardIndex(data.cardIndex)
        setCardStartedAt(data.cardStartedAt ?? Date.now())
        setRevealStartedAt(null)
        setCurrentVotes([])
        setIsRevealed(false)
        setRevealedVotes([])
        setHostHasVoted(false)
        setHostCardFlipped(false)
      },
      onGameStarted: () => {
        setPhase('active')
      },
      onGameFinished: () => setPhase('finished'),
    }),
    [],
  )

  const { send, snapshot, status } = usePartyConnection({
    pin,
    partyToken,
    role: 'host',
    handlers,
  })

  // ─── Host-as-player registration ─────────────────────────────────────────────
  // Re-register on every (re)connect so the server connectionMeta has the
  // host's playerId. applyJoin is idempotent — no duplicate player-joined events.
  useEffect(() => {
    const prev = prevStatusRef.current
    prevStatusRef.current = status
    if (status !== 'connected' || prev === 'connected' || !hostAvatar || !hostName.trim() || !send) return

    send({ type: 'host:register-player', playerName: hostName.trim(), avatar: hostAvatar })
      .then((result) => {
        if (result.ok) setHostPlayerId(`host-${pin}`)
      })
      .catch((err) => console.error('[host:register-player]', err))
  // We intentionally only track status changes; other deps are stable refs.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const handleHostVote = useCallback(
    async (answerIndex: number, answerText: string) => {
      if (!send || !hostPlayerId || hostHasVoted || hostLoading) return
      setHostLoading(true)
      try {
        const result = await send({
          type: 'player:vote',
          cardIndex,
          answerIndex,
          answerText,
        })
        if (result.ok) setHostHasVoted(true)
      } finally {
        setHostLoading(false)
      }
    },
    [send, hostPlayerId, hostHasVoted, hostLoading, cardIndex],
  )

  // Snapshot is the authoritative state on connect + every reconnect. It only
  // carries non-mode-specific fields today — votes/scores hydrate from the
  // event log replayed on connect (the room ships them between snapshots).
  useEffect(() => {
    if (!snapshot) return
    if (snapshot.status === 'finished') setPhase('finished')
    else if (snapshot.status === 'active') setPhase('active')
    // Don't override 'setup' / 'lobby' from a 'waiting' snapshot — those are
    // local UI states driven by whether the host has entered name+avatar.
    setPlayers(snapshot.players)
    setCardIndex(snapshot.cardIndex)
  }, [snapshot])

  // ─── Actions ────────────────────────────────────────────────────────────────

  const handleSetupComplete = useCallback(() => {
    if (!hostName.trim() || !hostAvatar) return
    updateHostProfile(pin, { hostName: hostName.trim(), hostAvatar })
    setPhase('lobby')
    // If we're already connected (WS was ready before setup finished), register
    // immediately. Otherwise the status-change effect above handles it.
    if (status === 'connected' && send) {
      send({ type: 'host:register-player', playerName: hostName.trim(), avatar: hostAvatar })
        .then((result) => {
          if (result.ok) setHostPlayerId(`host-${pin}`)
        })
        .catch((err) => console.error('[host:register-player setup]', err))
    }
  }, [pin, hostName, hostAvatar, status, send])

  const handleStart = useCallback(async () => {
    const firstCard = cards[0]
    if (!firstCard || !hostName.trim() || !hostAvatar || hostActionLoading || !send) return

    setHostActionLoading('start')
    try {
      const startedAt = Date.now()
      setCardStartedAt(startedAt)
      const result = await send({
        type: 'host:start',
        card: firstCard,
        deck: cards,
        settings: {
          revealCountdownSeconds: gameSettings.revealCountdownSeconds,
          answerTimeLimitSeconds: gameSettings.answerTimeLimitSeconds,
        },
      })
      if (!result.ok) {
        console.error('[host:start] rejected:', result.error)
        return
      }
      setPhase('active')
    } finally {
      setHostActionLoading(null)
    }
  }, [send, cards, hostName, hostAvatar, gameSettings, hostActionLoading])

  const handleReveal = useCallback(async () => {
    const card = cards[cardIndex]
    if (!card || isRevealed || hostActionLoading || !send) return
    setHostActionLoading('reveal')

    const votes = [...currentVotes]
    const updatedScores = [...scores]

    if (card.type === 'QUIZ' && card.answer) {
      votes.forEach((v) => {
        const isCorrect = card.options?.[v.answerIndex] === card.answer
        if (!isCorrect) return
        const idx = updatedScores.findIndex((s) => s.playerId === v.playerId)
        if (idx > -1) {
          updatedScores[idx] = { ...updatedScores[idx], score: updatedScores[idx].score + 1 }
        } else {
          updatedScores.push({
            playerId: v.playerId,
            playerName: v.playerName,
            score: 1,
            drinks: 0,
            playerTeamId: v.teamId ?? undefined,
            playerTeamName: v.teamName ?? undefined,
          })
        }
      })
    }

    if (card.type === 'NEVER') {
      votes.forEach((v) => {
        if (v.answerIndex !== -1) return
        const idx = updatedScores.findIndex((s) => s.playerId === v.playerId)
        if (idx > -1) {
          updatedScores[idx] = {
            ...updatedScores[idx],
            drinks: (updatedScores[idx].drinks ?? 0) + 1,
          }
        } else {
          updatedScores.push({
            playerId: v.playerId,
            playerName: v.playerName,
            score: 0,
            drinks: 1,
            playerTeamId: v.teamId ?? undefined,
            playerTeamName: v.teamName ?? undefined,
          })
        }
      })
    }

    try {
      const normalizedScores = ensurePointScoreEntries(updatedScores, players, cards)
      const updatedTeamScores = computeTeamScores(normalizedScores)
      const result = await send({
        type: 'host:reveal',
        cardIndex,
        correctAnswer: card.answer,
        votes,
        scores: normalizedScores,
        teamScores: updatedTeamScores,
      })
      if (!result.ok) {
        console.error('[host:reveal] rejected:', result.error)
        return
      }
      // Optimistic local update (votes-revealed event will overwrite identically)
      setRevealStartedAt(Date.now())
      setIsRevealed(true)
      setRevealedVotes(votes)
      setScores(normalizedScores)
      setTeamScores(updatedTeamScores)
    } finally {
      setHostActionLoading(null)
    }
  }, [send, cardIndex, currentVotes, scores, cards, isRevealed, players, hostActionLoading])

  const handleNextCard = useCallback(async () => {
    if (hostActionLoading || !send) return
    setHostActionLoading('next')
    try {
      const next = cardIndex + 1
      if (next >= cards.length) {
        const finalScores = ensurePointScoreEntries(scores, players, cards)
        const finalTeamScores = computeTeamScores(finalScores)
        const showPlayerPoints = !isNeverOnlyDeck(cards)
        await send({
          type: 'host:finish',
          scores: finalScores,
          teamScores: finalTeamScores,
          showPlayerPoints,
        })
        setScores(finalScores)
        setTeamScores(finalTeamScores)
        setPhase('finished')
        return
      }
      const result = await send({ type: 'host:next', cardIndex: next, card: cards[next] })
      if (!result.ok) {
        console.error('[host:next] rejected:', result.error)
        return
      }
      // The next-card event handler updates state too — these are belt-and-braces.
      setCardIndex(next)
      setCardStartedAt(Date.now())
      setRevealStartedAt(null)
      setCurrentVotes([])
      setIsRevealed(false)
      setRevealedVotes([])
    } finally {
      setHostActionLoading(null)
    }
  }, [send, cardIndex, cards, scores, players, hostActionLoading])

  const handleForceFinish = useCallback(async () => {
    if (!send) return
    const finalScores = ensurePointScoreEntries(scores, players, cards)
    const finalTeamScores = computeTeamScores(finalScores)
    const showPlayerPoints = !isNeverOnlyDeck(cards)
    setPhase('finished')
    setScores(finalScores)
    setTeamScores(finalTeamScores)
    try {
      await send({
        type: 'host:finish',
        scores: finalScores,
        teamScores: finalTeamScores,
        showPlayerPoints,
      })
    } catch (err) {
      console.error('[handleForceFinish]', err)
    }
  }, [send, scores, players, cards])

  // ─── Auto-reveal & auto-next (timer-driven) ─────────────────────────────────

  const handleRevealRef = useRef(handleReveal)
  useEffect(() => {
    handleRevealRef.current = handleReveal
  })
  useEffect(() => {
    if (phase !== 'active' || isRevealed || players.length === 0) return
    if (currentVotes.length < players.length) return
    const timer = setTimeout(() => handleRevealRef.current(), 600)
    return () => clearTimeout(timer)
  }, [currentVotes.length, players.length, phase, isRevealed])

  const answerCountdown = useAutoCountdown({
    active: phase === 'active' && !isRevealed && Boolean(currentCard) && players.length > 0,
    seconds: gameSettings.answerTimeLimitSeconds,
    resetKey: cardIndex,
    startedAtMs: cardStartedAt,
    onComplete: () => handleRevealRef.current(),
  })

  const handleNextCardRef = useRef(handleNextCard)
  useEffect(() => {
    handleNextCardRef.current = handleNextCard
  })
  const countdown = useAutoCountdown({
    active: isRevealed,
    seconds: gameSettings.revealCountdownSeconds,
    resetKey: cardIndex,
    startedAtMs: revealStartedAt,
    onComplete: () => handleNextCardRef.current(),
  })

  // ─── Derived scores ─────────────────────────────────────────────────────────

  const drinksScores = scores
    .filter((s) => (s.drinks ?? 0) > 0)
    .map((s) => ({ id: s.playerId, name: s.playerName, score: s.drinks! }))

  const egzekwoScores = scores
    .filter((s) => (s.egzekwo ?? 0) > 0)
    .map((s) => ({ id: s.playerId, name: s.playerName, score: s.egzekwo! }))
  const showPlayerPoints = !isNeverOnlyDeck(cards)

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <HostHeader
        phase={phase}
        pin={pin}
        currentCard={currentCard}
        cardIndex={cardIndex}
        totalCards={cards.length}
        currentVotes={currentVotes}
        players={players}
        onForceFinish={handleForceFinish}
      />

      <div className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto p-6 sm:p-12">
        <div className="mx-auto w-full max-w-5xl">
          {status !== 'connected' && phase !== 'finished' && (
            <div className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-center text-xs text-amber-300">
              {status === 'connecting' && 'Łączenie z salonem...'}
              {status === 'closed' && 'Połączenie zerwane — próbuję wrócić...'}
              {status === 'error' && 'Błąd połączenia z salonem.'}
            </div>
          )}

          <AnimatePresence mode="wait">
            {phase === 'setup' && (
              <motion.div
                key="setup"
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <SetupView
                  name={hostName}
                  onNameChange={setHostName}
                  avatar={hostAvatar}
                  onAvatarChange={setHostAvatar}
                  onContinue={handleSetupComplete}
                  onBack={() => {
                    window.location.href = '/graj/host'
                  }}
                />
              </motion.div>
            )}

            {phase === 'lobby' && (
              <motion.div
                key="lobby"
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <LobbyView
                  pin={pin}
                  players={players}
                  hostAvatar={hostAvatar!}
                  hostName={hostName}
                  onStart={handleStart}
                  starting={hostActionLoading === 'start'}
                />
              </motion.div>
            )}

            {phase === 'active' && currentCard && (
              <motion.div
                key={`card-${cardIndex}`}
                className="w-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
              >
                <ActiveCardView
                  card={currentCard}
                  cardIndex={cardIndex}
                  totalCards={cards.length}
                  players={players}
                  votes={currentVotes}
                  isRevealed={isRevealed}
                  revealedVotes={revealedVotes}
                  scores={scores}
                  answerCountdown={answerCountdown}
                  countdown={countdown}
                  hostCardFlipped={hostCardFlipped}
                  onHostCardFlip={() => setHostCardFlipped(true)}
                  hostPlayerId={hostPlayerId}
                  hostHasVoted={hostHasVoted}
                  onHostVote={handleHostVote}
                  hostLoading={hostLoading}
                />
              </motion.div>
            )}

            {phase === 'finished' && (
              <motion.div
                key="finished"
                className="w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <GameSummary
                  scores={scores.map((s) => ({
                    id: s.playerId,
                    name: s.playerName,
                    score: s.score,
                  }))}
                  teamScores={
                    teamScores.length > 0
                      ? teamScores.map((t) => ({ id: t.teamId, name: t.teamName, score: t.score }))
                      : undefined
                  }
                  drinksScores={drinksScores.length > 0 ? drinksScores : undefined}
                  egzekwoScores={egzekwoScores.length > 0 ? egzekwoScores : undefined}
                  showPlayerPoints={showPlayerPoints}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

function ensurePointScoreEntries(
  scores: ScoreEntry[],
  players: LivePlayer[],
  cards: GameCard[],
): ScoreEntry[] {
  if (!cards.some((card) => card.type === 'QUIZ')) return scores
  const next = [...scores]
  players.forEach((player) => {
    if (next.some((score) => score.playerId === player.playerId)) return
    next.push({
      playerId: player.playerId,
      playerName: player.playerName,
      score: 0,
      drinks: 0,
      playerTeamId: player.teamId ?? undefined,
      playerTeamName: player.teamName ?? undefined,
    })
  })
  return next
}

function isNeverOnlyDeck(cards: GameCard[]) {
  return cards.length > 0 && cards.every((card) => card.type === 'NEVER')
}
