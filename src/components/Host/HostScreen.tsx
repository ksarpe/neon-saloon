'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useBackButton } from '@/lib/back-button-context'
import { motion, AnimatePresence } from 'framer-motion'
import { useRealtimeGame as useGameSocket } from '@/hooks/useRealtimeGame'
import { GameSummary } from '@/components/GameSummary'
import type {
  PlayerJoinedPayload,
  PlayerLeftPayload,
  VoteCastPayload,
  VotesRevealedPayload,
  NextCardPayload,
} from '@/lib/game-types'
import type { GameCard } from '@/lib/store'
import type { LivePlayer, ScoreEntry, TeamScoreEntry, HostPhase, HostScreenProps, VoteRecord } from './types'
import { computeTeamScores } from './types'
import { SetupView } from './SetupView'
import { LobbyView } from './LobbyView'
import { ActiveCardView } from './ActiveCardView'
import { HostHeader } from './HostHeader'

export default function HostScreen({ pin, initialCards }: HostScreenProps) {
  const { setHidden: setBackHidden } = useBackButton()
  useEffect(() => {
    setBackHidden(true)
    return () => setBackHidden(false)
  }, [setBackHidden])

  // ── Host identity ────────────────────────────────────────────────────────────
  const [hostName, setHostName] = useState('')
  const [hostAvatar, setHostAvatar] = useState<string | null>(null)
  const [hostPlayerId, setHostPlayerId] = useState<string | null>(null)
  const [hostHasVoted, setHostHasVoted] = useState(false)
  const [hostLoading, setHostLoading] = useState(false)

  // ── Game state ───────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<HostPhase>('setup')
  const [players, setPlayers] = useState<LivePlayer[]>([])
  const [cardIndex, setCardIndex] = useState(0)
  const [currentVotes, setCurrentVotes] = useState<VoteCastPayload[]>([])
  const [isRevealed, setIsRevealed] = useState(false)
  const [revealedVotes, setRevealedVotes] = useState<VoteRecord[]>([])
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [teamScores, setTeamScores] = useState<TeamScoreEntry[]>([])
  const [countdown, setCountdown] = useState<number | null>(null)

  const currentCard: GameCard | undefined = initialCards[cardIndex]

  // ── Hydrate on mount ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`/api/sessions/${pin}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return
        if (data.players?.length) setPlayers(data.players)
        if (data.status === 'active') setPhase('active')
        if (data.status === 'finished') setPhase('finished')
        if (typeof data.cardIndex === 'number') setCardIndex(data.cardIndex)
      })
      .catch(() => {})
  }, [pin])

  // ── Poll in lobby ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'lobby') return
    const id = setInterval(() => {
      fetch(`/api/sessions/${pin}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => { if (data?.players) setPlayers(data.players) })
        .catch(() => {})
    }, 5000)
    return () => clearInterval(id)
  }, [phase, pin])

  // ── Poll during active — fallback for missed Realtime events ─────────────────
  useEffect(() => {
    if (phase !== 'active') return
    const id = setInterval(() => {
      fetch(`/api/sessions/${pin}`)
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
    }, 5000)
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
      setIsRevealed(true)
    }, []),
    onNextCard: useCallback((d: NextCardPayload) => {
      setCardIndex(d.cardIndex)
      setCurrentVotes([])
      setIsRevealed(false)
      setRevealedVotes([])
      setCountdown(null)
      setHostHasVoted(false)
    }, []),
    onGameStarted: useCallback(() => setPhase('active'), []),
    onGameFinished: useCallback(() => setPhase('finished'), []),
  })

  // ── Actions ──────────────────────────────────────────────────────────────────

  const handleSetupComplete = useCallback(() => {
    if (!hostName.trim() || !hostAvatar) return
    setPhase('lobby')
  }, [hostName, hostAvatar])

  const handleStart = useCallback(async () => {
    const firstCard = initialCards[0]
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
        setHostPlayerId(data.playerId)
        setPlayers((p) => {
          if (p.some((x) => x.playerId === data.playerId)) return p
          return [...p, {
            playerId: data.playerId,
            playerName: hostName.trim(),
            avatar: hostAvatar,
            teamId: null,
            teamName: null,
          }]
        })
      }
    } catch {
      // Continue even if join fails — game still works for others
    }

    await fetch(`/api/sessions/${pin}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'start', card: firstCard }),
    })
    setPhase('active')
  }, [pin, initialCards, hostName, hostAvatar])

  const handleReveal = useCallback(async () => {
    const card = initialCards[cardIndex]
    const votes = [...currentVotes]
    let updatedScores = [...scores]

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

    const updatedTeamScores = computeTeamScores(updatedScores)
    await fetch(`/api/sessions/${pin}/reveal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cardIndex,
        correctAnswer: card.answer,
        votes,
        scores: updatedScores,
        teamScores: updatedTeamScores,
      }),
    })
    setIsRevealed(true)
    setRevealedVotes(votes)
    setScores(updatedScores)
    setTeamScores(updatedTeamScores)
  }, [pin, cardIndex, currentVotes, scores, initialCards])

  const handleNextCard = useCallback(async () => {
    const next = cardIndex + 1
    if (next >= initialCards.length) {
      await fetch(`/api/sessions/${pin}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'finish', scores, teamScores }),
      })
      setPhase('finished')
      return
    }
    await fetch(`/api/sessions/${pin}/next-card`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cardIndex: next, card: initialCards[next] }),
    })
    setCardIndex(next)
    setCurrentVotes([])
    setIsRevealed(false)
    setRevealedVotes([])
    setCountdown(null)
    setHostHasVoted(false)
  }, [pin, cardIndex, initialCards, scores, teamScores])

  const handleForceFinish = useCallback(async () => {
    setPhase('finished')
    try {
      await fetch(`/api/sessions/${pin}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'finish', scores, teamScores }),
      })
    } catch (err) {
      console.error('[handleForceFinish]', err)
    }
  }, [pin, scores, teamScores])

  const handleHostVote = useCallback(
    async (answerIndex: number, answerText: string) => {
      if (!hostPlayerId || hostHasVoted || hostLoading) return
      setHostLoading(true)
      try {
        await fetch(`/api/sessions/${pin}/vote`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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
  useEffect(() => { handleRevealRef.current = handleReveal })
  useEffect(() => {
    if (phase !== 'active' || isRevealed || players.length === 0) return
    if (currentVotes.length < players.length) return
    const timer = setTimeout(() => handleRevealRef.current(), 600)
    return () => clearTimeout(timer)
  }, [currentVotes.length, players.length, phase, isRevealed])

  // ── Auto-next with countdown ──────────────────────────────────────────────────
  const handleNextCardRef = useRef(handleNextCard)
  useEffect(() => { handleNextCardRef.current = handleNextCard })
  useEffect(() => {
    if (!isRevealed) { setCountdown(null); return }
    setCountdown(4)
    let n = 4
    const tick = setInterval(() => {
      n -= 1
      if (n <= 0) {
        clearInterval(tick)
        setCountdown(null)
        handleNextCardRef.current()
      } else {
        setCountdown(n)
      }
    }, 1000)
    return () => clearInterval(tick)
  }, [isRevealed, cardIndex])

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
        totalCards={initialCards.length}
        currentVotes={currentVotes}
        players={players}
        onForceFinish={handleForceFinish}
      />

      {/* Main content */}
      <div className="relative z-10 flex flex-1 items-center justify-center overflow-y-auto p-6 sm:p-12">
        <div className="mx-auto w-full max-w-5xl">
          <AnimatePresence mode="wait">
            {phase === 'setup' && (
              <motion.div key="setup" className="w-full"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <SetupView
                  name={hostName} onNameChange={setHostName}
                  avatar={hostAvatar} onAvatarChange={setHostAvatar}
                  onContinue={handleSetupComplete}
                />
              </motion.div>
            )}

            {phase === 'lobby' && (
              <motion.div key="lobby" className="w-full"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <LobbyView
                  pin={pin} players={players}
                  hostAvatar={hostAvatar!} hostName={hostName}
                  onStart={handleStart}
                />
              </motion.div>
            )}

            {phase === 'active' && currentCard && (
              <motion.div key={`card-${cardIndex}`} className="w-full"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.35 }}>
                <ActiveCardView
                  card={currentCard}
                  cardIndex={cardIndex}
                  totalCards={initialCards.length}
                  players={players}
                  votes={currentVotes}
                  isRevealed={isRevealed}
                  revealedVotes={revealedVotes}
                  scores={scores}
                  countdown={countdown}
                  hostPlayerId={hostPlayerId}
                  hostHasVoted={hostHasVoted}
                  onHostVote={handleHostVote}
                  hostLoading={hostLoading}
                />
              </motion.div>
            )}

            {phase === 'finished' && (
              <motion.div key="finished" className="w-full"
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <GameSummary
                  scores={scores.map((s) => ({ id: s.playerId, name: s.playerName, score: s.score }))}
                  teamScores={teamScores.length > 0
                    ? teamScores.map((t) => ({ id: t.teamId, name: t.teamName, score: t.score }))
                    : undefined}
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
