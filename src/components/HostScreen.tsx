"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Eye, ChevronRight, Star, Users, Zap } from "lucide-react";
import { useGameSocket } from "@/hooks/useGameSocket";
import type {
  PlayerJoinedPayload,
  VoteCastPayload,
  VotesRevealedPayload,
  NextCardPayload,
} from "@/lib/pusher-server";
import type { GameCard } from "@/lib/store";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LivePlayer {
  playerId: string;
  playerName: string;
  avatar: string;
  teamId: string | null;
  teamName: string | null;
}

interface VoteRecord {
  playerId: string;
  playerName: string;
  teamId: string | null;
  teamName: string | null;
  answerIndex: number;
  answerText: string;
}

interface ScoreEntry {
  teamId: string;
  teamName: string;
  score: number;
}

type HostPhase = "lobby" | "active" | "reveal" | "finished";

interface HostScreenProps {
  pin: string;
  initialCards: GameCard[];
}

// ─── Lobby view ───────────────────────────────────────────────────────────────

function LobbyView({
  pin,
  players,
  onStart,
}: {
  pin: string;
  players: LivePlayer[];
  onStart: () => void;
}) {
  const digits = pin.split("");

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      {/* Title */}
      <div className="text-center">
        <span className="text-5xl">🤠</span>
        <h1
          className="text-6xl sm:text-8xl tracking-widest shimmer-text mt-2"
          style={{ fontFamily: "'Bebas Neue', cursive" }}
        >
          NEON SALOON
        </h1>
        <p className="text-text-muted uppercase tracking-widest text-sm mt-1">
          Bachelorette Edition
        </p>
      </div>

      {/* PIN display */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--text-muted)" }}>
          Game PIN — scan or enter on your phone
        </p>
        <div className="flex gap-3">
          {digits.map((d, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
              className="w-20 h-24 sm:w-28 sm:h-32 rounded-2xl border-2 flex items-center justify-center text-5xl sm:text-6xl font-bold pulse-pink"
              style={{
                fontFamily: "'Bebas Neue', cursive",
                color: "var(--neon-pink)",
                borderColor: "var(--neon-pink)",
                backgroundColor: "rgba(255,16,240,0.07)",
              }}
            >
              {d}
            </motion.div>
          ))}
        </div>
        <p className="text-text-muted text-xs">
          Players go to <span className="text-text-primary font-bold">neon-saloon.app/join</span>
        </p>
      </div>

      {/* Live player list */}
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Users size={14} style={{ color: "var(--sheriff-gold)" }} />
          <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--sheriff-gold)" }}>
            {players.length} {players.length === 1 ? "cowgirl" : "cowgirls"} in the Saloon
          </span>
        </div>
        <div className="flex flex-wrap gap-3">
          <AnimatePresence>
            {players.map((p) => (
              <motion.div
                key={p.playerId}
                layout
                initial={{ opacity: 0, scale: 0.6, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border"
                style={{
                  borderColor: p.teamId ? "var(--neon-pink)" : "var(--saloon-border)",
                  backgroundColor: p.teamId ? "rgba(255,16,240,0.08)" : "var(--saloon-surface)",
                }}
              >
                <span className="text-lg">{p.avatar}</span>
                <div>
                  <p className="text-sm font-bold text-text-primary leading-none">{p.playerName}</p>
                  {p.teamName && (
                    <p className="text-[10px] leading-none mt-0.5" style={{ color: "var(--neon-pink)" }}>
                      {p.teamName}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {players.length === 0 && (
            <p className="text-text-muted text-sm opacity-50">
              Waiting for cowboys to ride in… 🌵
            </p>
          )}
        </div>
      </div>

      {/* Start button */}
      <motion.button
        id="host-start-btn"
        disabled={players.length < 1}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-white text-xl disabled:opacity-30"
        style={{
          background: "linear-gradient(135deg, var(--neon-pink), #c800c8)",
          boxShadow: "0 4px 40px rgba(255,16,240,0.5)",
          fontFamily: "'Bebas Neue', cursive",
          letterSpacing: "0.15em",
        }}
      >
        <Play size={22} />
        Start the Game
      </motion.button>
    </div>
  );
}

// ─── Active card view ─────────────────────────────────────────────────────────

const CARD_COLORS: Record<string, string> = {
  trivia: "#8b2be2",
  charades: "#1e90ff",
  action: "#f59e0b",
  dare: "#ff10f0",
};

function ActiveCardView({
  card,
  totalPlayers,
  votes,
  onReveal,
  onNext,
  isRevealed,
  revealedVotes,
  scores,
}: {
  card: GameCard;
  totalPlayers: number;
  votes: VoteCastPayload[];
  onReveal: () => void;
  onNext: () => void;
  isRevealed: boolean;
  revealedVotes: VoteRecord[];
  scores: ScoreEntry[];
}) {
  const accent = CARD_COLORS[card.type] ?? "var(--neon-pink)";
  const voteCount = votes.length;
  const progress = totalPlayers > 0 ? voteCount / totalPlayers : 0;

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto">
      {/* Card display */}
      <motion.div
        key={card.id}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full rounded-3xl border-2 overflow-hidden"
        style={{ borderColor: accent, boxShadow: `0 0 40px ${accent}30` }}
      >
        {/* Top stripe */}
        <div className="h-2" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}80)` }} />

        {/* Card content */}
        <div className="p-8 flex flex-col items-center gap-4 text-center"
          style={{ backgroundColor: "var(--saloon-card)" }}>
          <span
            className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border"
            style={{ color: accent, borderColor: `${accent}60`, backgroundColor: `${accent}18` }}
          >
            {card.type} · {card.points} pts
          </span>
          <p className="text-2xl sm:text-4xl font-bold text-text-primary leading-snug">
            {card.description}
          </p>
        </div>
      </motion.div>

      {/* Vote progress bar */}
      <div className="w-full">
        <div className="flex items-center justify-between text-xs text-text-muted mb-2">
          <span>
            {voteCount} / {totalPlayers} voted
          </span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-saloon-surface overflow-hidden border border-saloon-border">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${accent}, ${accent}80)` }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* "Who voted" list (names only — no answer revealed yet) */}
      {!isRevealed && (
        <div className="flex flex-wrap gap-2 justify-center">
          <AnimatePresence>
            {votes.map((v) => (
              <motion.div
                key={v.playerId}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold"
                style={{
                  borderColor: "rgba(255,215,0,0.4)",
                  backgroundColor: "rgba(255,215,0,0.08)",
                  color: "var(--sheriff-gold)",
                }}
              >
                <Star size={11} fill="var(--sheriff-gold)" style={{ color: "var(--sheriff-gold)" }} />
                {v.teamName ?? v.playerName} voted…
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Revealed answers */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col gap-3"
        >
          <p className="text-center text-xs uppercase tracking-widest text-text-muted font-semibold">
            🎉 Results
          </p>
          {revealedVotes.map((v, i) => (
            <motion.div
              key={v.playerId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3 p-4 rounded-xl border"
              style={{ borderColor: "var(--saloon-border)", backgroundColor: "var(--saloon-surface)" }}
            >
              <span className="font-bold text-sm flex-1" style={{ color: "var(--text-primary)" }}>
                {v.teamName ?? v.playerName}
              </span>
              <span
                className="text-sm font-semibold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: v.answerIndex >= 0 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                  color: v.answerIndex >= 0 ? "#10b981" : "#ef4444",
                }}
              >
                {v.answerText || (v.answerIndex === -1 ? "✅ Done" : "❌ Skipped")}
              </span>
            </motion.div>
          ))}

          {/* Score leaderboard */}
          {scores.length > 0 && (
            <div className="mt-2 pt-4 border-t border-saloon-border flex flex-col gap-2">
              <p className="text-xs uppercase tracking-widest text-text-muted font-semibold flex items-center gap-2">
                <Star size={11} fill="var(--sheriff-gold)" style={{ color: "var(--sheriff-gold)" }} />
                Scoreboard
              </p>
              {[...scores].sort((a, b) => b.score - a.score).map((s, i) => (
                <motion.div
                  key={s.teamId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 + 0.3 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-sm font-bold w-6 text-text-muted">{i + 1}</span>
                  <span className="flex-1 text-sm font-semibold text-text-primary">{s.teamName}</span>
                  <div className="flex items-center gap-1">
                    <Star size={12} fill="var(--sheriff-gold)" style={{ color: "var(--sheriff-gold)" }} />
                    <span className="font-bold text-sm" style={{ color: "var(--sheriff-gold)" }}>
                      {s.score}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Host controls */}
      <div className="flex gap-3">
        {!isRevealed ? (
          <motion.button
            id="reveal-votes-btn"
            whileTap={{ scale: 0.97 }}
            onClick={onReveal}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white"
            style={{
              background: "linear-gradient(135deg, var(--sheriff-gold), #b8860b)",
              fontFamily: "'Bebas Neue', cursive",
              letterSpacing: "0.1em",
              fontSize: "1.1rem",
            }}
          >
            <Eye size={18} />
            Reveal Answers
          </motion.button>
        ) : (
          <motion.button
            id="next-card-btn"
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white"
            style={{
              background: "linear-gradient(135deg, var(--neon-pink), #c800c8)",
              fontFamily: "'Bebas Neue', cursive",
              letterSpacing: "0.1em",
              fontSize: "1.1rem",
            }}
          >
            Next Card
            <ChevronRight size={18} />
          </motion.button>
        )}
      </div>
    </div>
  );
}

// ─── Main HostScreen ──────────────────────────────────────────────────────────

export default function HostScreen({ pin, initialCards }: HostScreenProps) {
  const [phase, setPhase] = useState<HostPhase>("lobby");
  const [players, setPlayers] = useState<LivePlayer[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [currentVotes, setCurrentVotes] = useState<VoteCastPayload[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealedVotes, setRevealedVotes] = useState<VoteRecord[]>([]);
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  const currentCard = initialCards[cardIndex];

  // ── WebSocket events ───────────────────────────────────────────────────────

  useGameSocket(pin, {
    onPlayerJoined: useCallback((d: PlayerJoinedPayload) => {
      setPlayers((prev) => {
        if (prev.some((p) => p.playerId === d.playerId)) return prev;
        return [...prev, d];
      });
    }, []),

    onVoteCast: useCallback((d: VoteCastPayload) => {
      setCurrentVotes((prev) => {
        if (prev.some((v) => v.playerId === d.playerId)) return prev;
        return [...prev, d];
      });
    }, []),

    onVotesRevealed: useCallback((d: VotesRevealedPayload) => {
      setRevealedVotes(d.votes);
      setScores(d.scores);
      setIsRevealed(true);
    }, []),

    onNextCard: useCallback((d: NextCardPayload) => {
      setCardIndex(d.cardIndex);
      setCurrentVotes([]);
      setIsRevealed(false);
      setRevealedVotes([]);
    }, []),

    onGameStarted: useCallback(() => setPhase("active"), []),
    onGameFinished: useCallback(() => setPhase("finished"), []),
  });

  // ── Host actions ───────────────────────────────────────────────────────────

  const handleStart = useCallback(async () => {
    await fetch(`/api/sessions/${pin}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start" }),
    });
    setPhase("active");
  }, [pin]);

  const handleReveal = useCallback(async () => {
    // In a real app, load actual votes from DB; for now, pass the cast list as stubs
    const votes: VoteRecord[] = currentVotes.map((v) => ({
      ...v,
      answerIndex: -1,
      answerText: "✅ Answered",
    }));
    await fetch(`/api/sessions/${pin}/reveal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardIndex, votes, scores }),
    });
    setIsRevealed(true);
    setRevealedVotes(votes);
  }, [pin, cardIndex, currentVotes, scores]);

  const handleNextCard = useCallback(async () => {
    const next = cardIndex + 1;
    if (next >= initialCards.length) {
      await fetch(`/api/sessions/${pin}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "finish" }),
      });
      setPhase("finished");
      return;
    }
    await fetch(`/api/sessions/${pin}/next-card`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardIndex: next }),
    });
    setCardIndex(next);
    setCurrentVotes([]);
    setIsRevealed(false);
    setRevealedVotes([]);
  }, [pin, cardIndex, initialCards.length]);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="w-full min-h-dvh flex flex-col bg-saloon-dark overflow-y-auto scrollable">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-20%] left-[-15%] w-[60vw] h-[60vw] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-[-20%] right-[-15%] w-[60vw] h-[60vw] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* Header bar */}
      <div className="relative z-10 shrink-0 flex items-center justify-between px-6 py-3 border-b border-saloon-border">
        <div className="flex items-center gap-2">
          <Zap size={14} style={{ color: "var(--neon-pink)" }} />
          <span className="text-xs uppercase tracking-widest font-semibold text-text-muted">
            PIN: <span className="text-text-primary">{pin}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--neon-pink)" }} />
          <span className="text-xs text-text-muted">LIVE</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <AnimatePresence mode="wait">
          {phase === "lobby" && (
            <motion.div key="lobby"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
              className="w-full">
              <LobbyView pin={pin} players={players} onStart={handleStart} />
            </motion.div>
          )}

          {(phase === "active" || phase === "reveal") && currentCard && (
            <motion.div key={`card-${cardIndex}`}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.35 }}
              className="w-full">
              <ActiveCardView
                card={currentCard}
                totalPlayers={players.length}
                votes={currentVotes}
                onReveal={handleReveal}
                onNext={handleNextCard}
                isRevealed={isRevealed}
                revealedVotes={revealedVotes}
                scores={scores}
              />
            </motion.div>
          )}

          {phase === "finished" && (
            <motion.div key="finished"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-6 text-center">
              <span className="text-6xl">🏆</span>
              <h2 className="text-5xl sm:text-7xl shimmer-text"
                style={{ fontFamily: "'Bebas Neue', cursive" }}>
                Game Over, Cowgirls!
              </h2>
              <div className="flex flex-col gap-3 mt-4 w-full max-w-md">
                {[...scores].sort((a, b) => b.score - a.score).map((s, i) => (
                  <motion.div key={s.teamId} initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3 p-4 rounded-xl border border-saloon-border bg-saloon-surface">
                    <span className="text-xl">{["🥇", "🥈", "🥉"][i] ?? "🎖️"}</span>
                    <span className="flex-1 font-bold text-text-primary">{s.teamName}</span>
                    <div className="flex items-center gap-1">
                      <Star size={13} fill="var(--sheriff-gold)" style={{ color: "var(--sheriff-gold)" }} />
                      <span className="font-bold" style={{ color: "var(--sheriff-gold)" }}>{s.score}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
