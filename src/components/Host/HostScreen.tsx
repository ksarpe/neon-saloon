'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'

import { GameSummary } from '@/components/GameSummary'
import { useAutoCountdown } from '@/hooks/useAutoCountdown'
import { useGameSettings } from '@/hooks/useGameSettings'
import { useLobbyPlayersPolling } from '@/hooks/useLobbyPlayersPolling'
import { useRealtimeGame as useGameSocket } from '@/hooks/useRealtimeGame'
import { useBackButton } from '@/lib/back-button-context'
import type {
  NextCardPayload,
  PlayerJoinedPayload,
  PlayerLeftPayload,
  VoteCastPayload,
  VotesRevealedPayload,
} from '@/lib/game-types'
import {
  getHostSession,
  hostAuthHeaders,
  hostJsonHeaders,
  updateHostSession,
} from '@/lib/session-host-secret'
import { playerJsonHeaders, savePlayerSecret } from '@/lib/session-player-secret'
import type { GameCard } from '@/lib/store'

import { ActiveCardView } from './ActiveCardView'
import { HostHeader } from './HostHeader'
import { LobbyView } from './LobbyView'
import { SetupView } from './SetupView'
import type {
  HostPhase,
  HostScreenProps,
  LivePlayer,
  ScoreEntry,
  TeamScoreEntry,
  VoteRecord,
} from './types'
import { computeTeamScores } from './types'

export default function HostScreen({ pin, initialCards }: HostScreenProps) {
  const { setHidden: setBackHidden } = useBackButton()
  useEffect(() => {
    setBackHidden(true)
    return () => setBackHidden(false)
  }, [setBackHidden])

  // ── Game settings (fetched once; falls back to global defaults) ─────────────
  const gameSettings = useGameSettings()

  // ── Host identity ────────────────────────────────────────────────────────────
  const [hostName, setHostName] = useState('')
  const [hostAvatar, setHostAvatar] = useState<string | null>(null)
  const [hostPlayerId, setHostPlayerId] = useState<string | null>(null)
  const [hostHasVoted, setHostHasVoted] = useState(false)
  const [hostLoading, setHostLoading] = useState(false)

  // ── Game state ───────────────────────────────────────────────────────────────
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

  // ── Hydrate on mount ─────────────────────────────────────────────────────────
  // Full restore: identity from localStorage, game state (scores, reveal snapshot,
  // current votes) from /host-resume. Lets the host refresh mid-game without losing
  // accumulated points or having to re-enter name/avatar.
  useEffect(() => {
    const stored = getHostSession(pin)
    if (stored?.hostName) setHostName(stored.hostName)
    if (stored?.hostAvatar) setHostAvatar(stored.hostAvatar)
    if (stored?.hostPlayerId) setHostPlayerId(stored.hostPlayerId)

    fetch(`/api/sessions/${pin}/host-resume`, { headers: hostAuthHeaders(pin) })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data?.ok) return
        const alignServerTimestamp = (timestamp?: number | null) => {
          if (typeof timestamp !== 'number') return null
          if (typeof data.serverNow !== 'number') return timestamp
          return Date.now() - Math.max(0, data.serverNow - timestamp)
        }
        if (Array.isArray(data.players) && data.players.length) setPlayers(data.players)
        if (typeof data.cardIndex === 'number') setCardIndex(data.cardIndex)
        if (typeof data.currentCardStartedAt === 'number') {
          setCardStartedAt(alignServerTimestamp(data.currentCardStartedAt))
        }
        if (Array.isArray(data.deck) && data.deck.length) {
          setCards(data.deck)
        } else if (data.currentCard && typeof data.cardIndex === 'number') {
          setCards((prev) =>
            prev.map((card, index) => (index === data.cardIndex ? data.currentCard : card))
          )
        }
        if (Array.isArray(data.scores)) setScores(data.scores)
        if (Array.isArray(data.teamScores)) setTeamScores(data.teamScores)

        // Phase: setup unless we already have identity, then lobby/active/finished
        const hasIdentity = Boolean(stored?.hostName && stored?.hostAvatar)
        if (data.status === 'finished') setPhase('finished')
        else if (data.status === 'active') setPhase('active')
        else if (hasIdentity) setPhase('lobby')

        // Restore reveal snapshot if host left mid-reveal
        if (data.currentReveal && data.currentReveal.cardIndex === data.cardIndex) {
          setIsRevealed(true)
          if (typeof data.currentReveal.revealStartedAt === 'number') {
            setRevealStartedAt(alignServerTimestamp(data.currentReveal.revealStartedAt))
          }
          setRevealedVotes(data.currentReveal.votes ?? [])
        }

        // Restore unrevealed votes-in-progress
        if (Array.isArray(data.votes) && data.votes.length) {
          setCurrentVotes(data.votes)
        }

        // Did the host already cast their own vote for the current card?
        if (stored?.hostPlayerId && Array.isArray(data.votes)) {
          if (data.votes.some((v: { playerId: string }) => v.playerId === stored.hostPlayerId)) {
            setHostHasVoted(true)
          }
        }
      })
      .catch(() => {})
  }, [pin])

  // ── Poll in lobby ────────────────────────────────────────────────────────────
  useLobbyPlayersPolling<LivePlayer>({
    active: phase === 'lobby',
    pin,
    onPlayers: setPlayers,
  })

  // ── Poll during active — fallback for missed Realtime events ─────────────────
  useEffect(() => {
    if (phase !== 'active') return
    const refreshVotes = () => {
      fetch(`/api/sessions/${pin}`, { headers: hostAuthHeaders(pin) })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!data?.votes) return
          setCardIndex((ci) => {
            const votesForCard = (
              data.votes as Array<{ playerId: string; cardIndex: number }>
            ).filter((v) => v.cardIndex === ci)
            setCurrentVotes((prev) => {
              const existing = new Set(prev.map((v) => v.playerId))
              const incoming = votesForCard.filter((v) => !existing.has(v.playerId))
              return incoming.length ? ([...prev, ...incoming] as typeof prev) : prev
            })
            return ci
          })
        })
        .catch(() => {})
    }

    refreshVotes()
    const id = setInterval(refreshVotes, 1500)
    return () => clearInterval(id)
  }, [phase, pin])

  // ── Realtime socket ──────────────────────────────────────────────────────────
  useGameSocket(pin, {
    onPlayerJoined: useCallback((d: PlayerJoinedPayload) => {
      setPlayers((p) => (p.some((x) => x.playerId === d.playerId) ? p : [...p, d]))
    }, []),
    onPlayerLeft: useCallback((d: PlayerLeftPayload) => {
      setPlayers((p) => p.filter((x) => x.playerId !== d.playerId))
    }, []),
    onVoteCast: useCallback((d: VoteCastPayload) => {
      setCurrentVotes((p) => (p.some((x) => x.playerId === d.playerId) ? p : [...p, d]))
    }, []),
    onVotesRevealed: useCallback((d: VotesRevealedPayload) => {
      setRevealedVotes(d.votes)
      setScores(d.scores)
      setTeamScores(d.teamScores ?? [])
      setRevealStartedAt(d.revealStartedAt ?? Date.now())
      setIsRevealed(true)
    }, []),
    onNextCard: useCallback((d: NextCardPayload) => {
      setCardIndex(d.cardIndex)
      setCardStartedAt(d.cardStartedAt ?? Date.now())
      setRevealStartedAt(null)
      setCurrentVotes([])
      setIsRevealed(false)
      setRevealedVotes([])
      setHostHasVoted(false)
    }, []),
    onGameStarted: useCallback(() => setPhase('active'), []),
    onGameFinished: useCallback(() => setPhase('finished'), []),
  })

  // ── Actions ──────────────────────────────────────────────────────────────────

  const handleSetupComplete = useCallback(() => {
    if (!hostName.trim() || !hostAvatar) return
    updateHostSession(pin, { hostName: hostName.trim(), hostAvatar })
    setPhase('lobby')
  }, [pin, hostName, hostAvatar])

  const handleStart = useCallback(async () => {
    const firstCard = cards[0]
    if (!firstCard || !hostName.trim() || !hostAvatar) return

    // Join host as a player first
    try {
      const res = await fetch(`/api/sessions/${pin}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: hostName.trim(), avatar: hostAvatar }),
      })
      if (res.ok) {
        const data = await res.json()
        const resolvedHostName =
          typeof data.playerName === 'string' ? data.playerName : hostName.trim()
        if (typeof data.playerSecret === 'string') {
          savePlayerSecret(pin, data.playerId, data.playerSecret)
        }
        updateHostSession(pin, { hostName: resolvedHostName, hostPlayerId: data.playerId })
        setHostName(resolvedHostName)
        setHostPlayerId(data.playerId)
        setPlayers((p) => {
          if (p.some((x) => x.playerId === data.playerId)) return p
          return [
            ...p,
            {
              playerId: data.playerId,
              playerName: resolvedHostName,
              avatar: hostAvatar,
              teamId: null,
              teamName: null,
            },
          ]
        })
      }
    } catch {
      // Continue even if join fails — game still works for others
    }

    const startedAt = Date.now()
    setCardStartedAt(startedAt)
    await fetch(`/api/sessions/${pin}`, {
      method: 'POST',
      headers: hostJsonHeaders(pin),
      body: JSON.stringify({
        action: 'start',
        card: firstCard,
        deck: cards,
        settings: {
          revealCountdownSeconds: gameSettings.revealCountdownSeconds,
          answerTimeLimitSeconds: gameSettings.answerTimeLimitSeconds,
        },
      }),
    })
    setPhase('active')
  }, [pin, cards, hostName, hostAvatar, gameSettings])

  const handleReveal = useCallback(async () => {
    const card = cards[cardIndex]
    if (!card || isRevealed) return

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

    const normalizedScores = ensurePointScoreEntries(updatedScores, players, cards)
    const updatedTeamScores = computeTeamScores(normalizedScores)
    const response = await fetch(`/api/sessions/${pin}/reveal`, {
      method: 'POST',
      headers: hostJsonHeaders(pin),
      body: JSON.stringify({
        cardIndex,
        correctAnswer: card.answer,
        votes,
        scores: normalizedScores,
        teamScores: updatedTeamScores,
      }),
    })
    const data = await response.json().catch(() => ({}))
    setRevealStartedAt(typeof data.revealStartedAt === 'number' ? data.revealStartedAt : Date.now())
    setIsRevealed(true)
    setRevealedVotes(votes)
    setScores(normalizedScores)
    setTeamScores(updatedTeamScores)
  }, [pin, cardIndex, currentVotes, scores, cards, isRevealed, players])

  const handleNextCard = useCallback(async () => {
    const next = cardIndex + 1
    if (next >= cards.length) {
      const finalScores = ensurePointScoreEntries(scores, players, cards)
      const finalTeamScores = computeTeamScores(finalScores)
      await fetch(`/api/sessions/${pin}`, {
        method: 'POST',
        headers: hostJsonHeaders(pin),
        body: JSON.stringify({
          action: 'finish',
          scores: finalScores,
          teamScores: finalTeamScores,
        }),
      })
      setScores(finalScores)
      setTeamScores(finalTeamScores)
      setPhase('finished')
      return
    }
    const response = await fetch(`/api/sessions/${pin}/next-card`, {
      method: 'POST',
      headers: hostJsonHeaders(pin),
      body: JSON.stringify({ cardIndex: next, card: cards[next] }),
    })
    const data = await response.json().catch(() => ({}))
    setCardIndex(next)
    setCardStartedAt(typeof data.cardStartedAt === 'number' ? data.cardStartedAt : Date.now())
    setRevealStartedAt(null)
    setCurrentVotes([])
    setIsRevealed(false)
    setRevealedVotes([])
    setHostHasVoted(false)
  }, [pin, cardIndex, cards, scores, players])

  const handleForceFinish = useCallback(async () => {
    const finalScores = ensurePointScoreEntries(scores, players, cards)
    const finalTeamScores = computeTeamScores(finalScores)
    setPhase('finished')
    setScores(finalScores)
    setTeamScores(finalTeamScores)
    try {
      await fetch(`/api/sessions/${pin}`, {
        method: 'POST',
        headers: hostJsonHeaders(pin),
        body: JSON.stringify({
          action: 'finish',
          scores: finalScores,
          teamScores: finalTeamScores,
        }),
      })
    } catch (err) {
      console.error('[handleForceFinish]', err)
    }
  }, [pin, scores, players, cards])

  const handleHostVote = useCallback(
    async (answerIndex: number, answerText: string) => {
      if (!hostPlayerId || hostHasVoted || hostLoading) return
      setHostLoading(true)
      try {
        await fetch(`/api/sessions/${pin}/vote`, {
          method: 'POST',
          headers: playerJsonHeaders(pin, hostPlayerId),
          body: JSON.stringify({
            playerId: hostPlayerId,
            playerName: hostName,
            teamId: null,
            teamName: null,
            cardIndex,
            answerIndex,
            answerText,
          }),
        })
        setHostHasVoted(true)
      } finally {
        setHostLoading(false)
      }
    },
    [hostPlayerId, hostHasVoted, hostLoading, pin, hostName, cardIndex]
  )

  // ── Auto-reveal when all players voted ───────────────────────────────────────
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

  // ── Auto-next with countdown ──────────────────────────────────────────────────
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

  // ── Derived scores ────────────────────────────────────────────────────────────
  const drinksScores = scores
    .filter((s) => (s.drinks ?? 0) > 0)
    .map((s) => ({ id: s.playerId, name: s.playerName, score: s.drinks! }))

  const egzekwoScores = scores
    .filter((s) => (s.egzekwo ?? 0) > 0)
    .map((s) => ({ id: s.playerId, name: s.playerName, score: s.egzekwo! }))

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-dvh w-full flex-col">
      {/* Header */}
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

      {/* Main content */}
      <div className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto p-6 sm:p-12">
        <div className="mx-auto w-full max-w-5xl">
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
  cards: GameCard[]
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
