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

// ─── Types ─────────────────────────────────────────────────────────────────────

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
  gameMode?: string;
}

const ACCENT: Record<string, string> = {
  trivia: "#8b2be2",
  charades: "#1e90ff",
  action: "#f59e0b",
  dare: "#ff10f0",
};

// ─── Card Stack — centre-screen "deck" ─────────────────────────────────────────

function CardStack({
  card,
  cardsLeft,
  isFlipped,
  isRevealed,
  onFlip,
}: {
  card: GameCard;
  cardsLeft: number;
  isFlipped: boolean;
  isRevealed: boolean;
  onFlip: () => void;
}) {
  const accent = ACCENT[card.type] ?? "var(--neon-pink)";

  // Shadow cards underneath (max 3)
  const shadows = Math.min(cardsLeft - 1, 3);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Perspective wrapper */}
      <div
        className="relative flex items-center justify-center"
        style={{ perspective: "1200px", width: 340, height: 220 }}
      >
        {/* Stack shadow cards */}
        {Array.from({ length: shadows }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-2xl border-2"
            style={{
              width: 320,
              height: 200,
              borderColor: "var(--saloon-border)",
              backgroundColor: "var(--saloon-card)",
              transform: `translateY(${(i + 1) * -6}px) rotate(${(i % 2 === 0 ? 1 : -1) * (i + 1) * 1.5}deg)`,
              zIndex: shadows - i,
              opacity: 1 - i * 0.15,
            }}
          >
            {/* Card back pattern */}
            <div className="w-full h-full rounded-2xl flex items-center justify-center overflow-hidden">
              <div
                className="w-[90%] h-[90%] rounded-xl border-2 flex items-center justify-center"
                style={{
                  borderColor: "var(--saloon-border)",
                  backgroundImage:
                    "repeating-linear-gradient(45deg, rgba(255,16,240,0.03) 0px, rgba(255,16,240,0.03) 2px, transparent 2px, transparent 10px)",
                }}
              >
                <span className="text-4xl opacity-20">🤠</span>
              </div>
            </div>
          </div>
        ))}

        {/* Active card — 3D flip */}
        <motion.div
          className="absolute cursor-pointer"
          style={{
            zIndex: 10,
            width: 320,
            height: 200,
            transformStyle: "preserve-3d",
          }}
          animate={{
            rotateY: isRevealed ? 360 : isFlipped ? 180 : 0,
            rotate: isFlipped || isRevealed ? -6 : 0,
            x: isFlipped || isRevealed ? 24 : 0,
            y: isFlipped || isRevealed ? 10 : 0,
          }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          onClick={!isFlipped ? onFlip : undefined}
          whileHover={
            !isFlipped ? { y: -8, boxShadow: `0 20px 60px ${accent}40` } : {}
          }
        >
          {/* Card BACK (visible before flip or when revealed at 360deg) */}
          <div
            className="absolute inset-0 rounded-2xl border-2 overflow-hidden flex items-center justify-center"
            style={{
              borderColor: isRevealed
                ? "var(--sheriff-gold)"
                : "var(--neon-pink)",
              backgroundColor: "var(--saloon-card)",
              backfaceVisibility: "hidden",
              boxShadow: isRevealed
                ? `0 0 40px rgba(255,215,0,0.3)`
                : `0 0 40px rgba(255,16,240,0.3)`,
            }}
          >
            {!isRevealed ? (
              <div
                className="w-[88%] h-[88%] rounded-xl border-2 flex flex-col items-center justify-center gap-3"
                style={{
                  borderColor: "rgba(255,16,240,0.3)",
                  backgroundImage:
                    "repeating-linear-gradient(45deg, rgba(255,16,240,0.04) 0px, rgba(255,16,240,0.04) 2px, transparent 2px, transparent 10px)",
                }}
              >
                <span className="text-5xl">🤠</span>
                <p
                  className="text-xs uppercase tracking-widest font-bold"
                  style={{ color: "var(--neon-pink)" }}
                >
                  Tap to reveal
                </p>
              </div>
            ) : (
              <div
                className="w-[88%] h-[88%] rounded-xl border-2 flex flex-col items-center justify-center gap-3 p-4 text-center"
                style={{
                  borderColor: "rgba(255,215,0,0.3)",
                  backgroundImage:
                    "repeating-linear-gradient(45deg, rgba(255,215,0,0.04) 0px, rgba(255,215,0,0.04) 2px, transparent 2px, transparent 10px)",
                }}
              >
                <span className="text-3xl">🎉</span>
                <p className="text-base font-bold text-text-primary leading-snug">
                  {card.answer ? card.answer : "Time's Up!"}
                </p>
              </div>
            )}
          </div>

          {/* Card FRONT (visible after flip) */}
          <div
            className="absolute inset-0 rounded-2xl border-2 overflow-hidden flex flex-col"
            style={{
              borderColor: accent,
              backgroundColor: "var(--saloon-card)",
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              boxShadow: `0 0 40px ${accent}40`,
            }}
          >
            <div
              className="h-1.5"
              style={{
                background: `linear-gradient(90deg,${accent},${accent}60)`,
              }}
            />
            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-5 text-center">
              <span
                className="px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                style={{
                  color: accent,
                  borderColor: `${accent}60`,
                  backgroundColor: `${accent}18`,
                }}
              >
                {card.type} · {card.points} pts
              </span>
              <p className="text-lg font-bold text-text-primary leading-snug">
                {card.description}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {!isFlipped && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-text-muted text-sm animate-pulse"
        >
          Click the card to reveal it 👆
        </motion.p>
      )}
    </div>
  );
}

// ─── Active game view ──────────────────────────────────────────────────────────

function ActiveCardView({
  card,
  cardIndex,
  totalCards,
  totalPlayers,
  votes,
  onReveal,
  onNext,
  isRevealed,
  revealedVotes,
  scores,
}: {
  card: GameCard;
  cardIndex: number;
  totalCards: number;
  totalPlayers: number;
  votes: VoteCastPayload[];
  onReveal: () => void;
  onNext: () => void;
  isRevealed: boolean;
  revealedVotes: VoteRecord[];
  scores: ScoreEntry[];
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const accent = ACCENT[card.type] ?? "var(--neon-pink)";
  const progress = totalPlayers > 0 ? votes.length / totalPlayers : 0;

  const handleFlip = useCallback(() => setIsFlipped(true), []);
  // Reset flip when card changes
  const cardKey = card.id;

  return (
    <div className="flex flex-col justify-center items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Progress pill */}
      <div className="flex items-center gap-3 text-xs text-text-muted">
        <span className="px-3 py-1 rounded-full bg-saloon-surface border border-saloon-border font-semibold">
          Card {cardIndex + 1} / {totalCards}
        </span>
        <span className="opacity-50">·</span>
        <span>
          {votes.length} / {totalPlayers} voted
        </span>
      </div>

      {/* Card stack — centred */}
      <CardStack
        card={card}
        cardsLeft={totalCards - cardIndex}
        isFlipped={isFlipped}
        isRevealed={isRevealed}
        onFlip={handleFlip}
      />

      {/* Vote progress bar */}
      <div className="w-full max-w-sm">
        <div className="w-full h-2 rounded-full bg-saloon-surface overflow-hidden border border-saloon-border">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: `linear-gradient(90deg,${accent},${accent}80)`,
            }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-3">
          <AnimatePresence>
            {votes.map((v) => (
              <motion.span
                key={v.playerId}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold"
                style={{
                  borderColor: "rgba(255,215,0,0.35)",
                  backgroundColor: "rgba(255,215,0,0.07)",
                  color: "var(--sheriff-gold)",
                }}
              >
                <Star
                  size={9}
                  fill="var(--sheriff-gold)"
                  style={{ color: "var(--sheriff-gold)" }}
                />
                {v.teamName ?? v.playerName}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Revealed results */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm flex flex-col gap-2"
        >
          <p className="text-center text-xs uppercase tracking-widest text-text-muted font-semibold">
            🎉 Results
          </p>
          {revealedVotes.map((v, i) => (
            <motion.div
              key={v.playerId}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3 p-3 rounded-xl border"
              style={{
                borderColor: "var(--saloon-border)",
                backgroundColor: "var(--saloon-surface)",
              }}
            >
              <span className="flex-1 font-semibold text-sm text-text-primary">
                {v.teamName ?? v.playerName}
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor:
                    v.answerIndex >= -1
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(239,68,68,0.15)",
                  color: v.answerIndex >= -1 ? "#10b981" : "#ef4444",
                }}
              >
                {v.answerText}
              </span>
            </motion.div>
          ))}
          {scores.length > 0 && (
            <div className="mt-1 pt-3 border-t border-saloon-border flex flex-col gap-1.5">
              {[...scores]
                .sort((a, b) => b.score - a.score)
                .map((s, i) => (
                  <div
                    key={s.teamId}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="w-5 text-center text-text-muted font-bold">
                      {i + 1}
                    </span>
                    <span className="flex-1 font-semibold text-text-primary">
                      {s.teamName}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star
                        size={11}
                        fill="var(--sheriff-gold)"
                        style={{ color: "var(--sheriff-gold)" }}
                      />
                      <span
                        className="font-bold"
                        style={{ color: "var(--sheriff-gold)" }}
                      >
                        {s.score}
                      </span>
                    </div>
                  </div>
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
            disabled={!isFlipped}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white disabled:opacity-30"
            style={{
              background: "linear-gradient(135deg,var(--sheriff-gold),#b8860b)",
              fontFamily: "'Bebas Neue',cursive",
              letterSpacing: "0.1em",
              fontSize: "1.1rem",
            }}
          >
            <Eye size={18} /> Reveal Answers
          </motion.button>
        ) : (
          <motion.button
            id="next-card-btn"
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white"
            style={{
              background: "linear-gradient(135deg,var(--neon-pink),#c800c8)",
              fontFamily: "'Bebas Neue',cursive",
              letterSpacing: "0.1em",
              fontSize: "1.1rem",
            }}
          >
            Next Card <ChevronRight size={18} />
          </motion.button>
        )}
      </div>
    </div>
  );
}

// ─── Lobby ─────────────────────────────────────────────────────────────────────

function LobbyView({
  pin,
  players,
  onStart,
}: {
  pin: string;
  players: LivePlayer[];
  onStart: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto">
      <div className="text-center">
        <h1
          className="text-6xl sm:text-8xl tracking-widest shimmer-text mt-2"
          style={{ fontFamily: "'Bebas Neue',cursive" }}
        >
          NEON SALOON
        </h1>
      </div>

      {/* PIN */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs uppercase tracking-widest font-semibold text-text-muted">
          PIN gry
        </p>
        <div className="flex gap-3">
          {pin.split("").map((d, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
              className="w-20 h-24 sm:w-28 sm:h-32 rounded-2xl border-2 flex items-center justify-center text-5xl sm:text-6xl font-bold pulse-pink"
              style={{
                fontFamily: "'Bebas Neue',cursive",
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
          Gracze wchodzą na{" "}
          <span className="text-text-primary font-bold">
            neon-saloon.app/join
          </span>
        </p>
      </div>

      {/* Players */}
      <div className="w-full">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Users size={14} style={{ color: "var(--sheriff-gold)" }} />
          <span
            className="text-xs uppercase tracking-widest font-semibold"
            style={{ color: "var(--sheriff-gold)" }}
          >
            {players.length} {players.length === 1 ? "cowgirl" : "cowgirls"} w
            salonie
          </span>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
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
                  borderColor: p.teamId
                    ? "var(--neon-pink)"
                    : "var(--saloon-border)",
                  backgroundColor: p.teamId
                    ? "rgba(255,16,240,0.08)"
                    : "var(--saloon-surface)",
                }}
              >
                <span className="text-lg">{p.avatar}</span>
                <div>
                  <p className="text-sm font-bold text-text-primary leading-none">
                    {p.playerName}
                  </p>
                  {p.teamName && (
                    <p
                      className="text-[10px] mt-0.5"
                      style={{ color: "var(--neon-pink)" }}
                    >
                      {p.teamName}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {players.length === 0 && (
            <p className="text-text-muted text-sm opacity-50">
              Oczekuję na graczy...
            </p>
          )}
        </div>
      </div>

      <motion.button
        id="host-start-btn"
        disabled={players.length < 1}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-white text-xl disabled:opacity-30"
        style={{
          background: "linear-gradient(135deg,var(--neon-pink),#c800c8)",
          boxShadow: "0 4px 40px rgba(255,16,240,0.5)",
          fontFamily: "'Bebas Neue',cursive",
          letterSpacing: "0.15em",
        }}
      >
        <Play size={22} /> Rozpocznij grę
      </motion.button>
    </div>
  );
}

// ─── Main HostScreen ──────────────────────────────────────────────────────────

export default function HostScreen({
  pin,
  initialCards,
  gameMode = "classic",
}: HostScreenProps) {
  const [phase, setPhase] = useState<HostPhase>("lobby");
  const [players, setPlayers] = useState<LivePlayer[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [currentVotes, setCurrentVotes] = useState<VoteCastPayload[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealedVotes, setRevealedVotes] = useState<VoteRecord[]>([]);
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  const currentCard = initialCards[cardIndex];

  useGameSocket(pin, {
    onPlayerJoined: useCallback((d: PlayerJoinedPayload) => {
      setPlayers((p) =>
        p.some((x) => x.playerId === d.playerId) ? p : [...p, d],
      );
    }, []),
    onVoteCast: useCallback((d: VoteCastPayload) => {
      setCurrentVotes((p) =>
        p.some((x) => x.playerId === d.playerId) ? p : [...p, d],
      );
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

  const handleStart = useCallback(async () => {
    const firstCard = initialCards[0];
    if (!firstCard) return;
    await fetch(`/api/sessions/${pin}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start", card: firstCard }),
    });
    setPhase("active");
  }, [pin, initialCards]);

  const handleReveal = useCallback(async () => {
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
        body: JSON.stringify({ action: "finish", scores }),
      });
      setPhase("finished");
      return;
    }
    await fetch(`/api/sessions/${pin}/next-card`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardIndex: next, card: initialCards[next] }),
    });
    setCardIndex(next);
    setCurrentVotes([]);
    setIsRevealed(false);
    setRevealedVotes([]);
  }, [pin, cardIndex, initialCards, scores]);

  return (
    <div className="w-full min-h-dvh flex flex-col bg-saloon-dark">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-[-20%] left-[-15%] w-[60vw] h-[60vw] rounded-full opacity-[0.06]"
          style={{
            background:
              "radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-15%] w-[60vw] h-[60vw] rounded-full opacity-[0.06]"
          style={{
            background:
              "radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 shrink-0 border-b border-saloon-border bg-saloon-dark/50 backdrop-blur-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Zap size={14} style={{ color: "var(--neon-pink)" }} />
            <span className="text-xs uppercase tracking-widest font-semibold text-text-muted">
              PIN: <span className="text-text-primary">{pin}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--neon-pink)" }}
              />
              <span className="text-xs text-text-muted font-bold tracking-tighter">
                LIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main — centred, max-width */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {phase === "lobby" && (
              <motion.div
                key="lobby"
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <LobbyView pin={pin} players={players} onStart={handleStart} />
              </motion.div>
            )}

            {(phase === "active" || phase === "reveal") && currentCard && (
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
                  totalCards={initialCards.length}
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
              <motion.div
                key="finished"
                className="flex flex-col items-center gap-6 text-center w-full max-w-md mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-6xl">🏆</span>
                <h2
                  className="text-5xl sm:text-7xl shimmer-text"
                  style={{ fontFamily: "'Bebas Neue',cursive" }}
                >
                  Game Over, Cowgirls!
                </h2>
                <div className="flex flex-col gap-3 w-full">
                  {[...scores]
                    .sort((a, b) => b.score - a.score)
                    .map((s, i) => (
                      <motion.div
                        key={s.teamId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-3 p-4 rounded-xl border border-saloon-border bg-saloon-surface"
                      >
                        <span className="text-xl">
                          {["🥇", "🥈", "🥉"][i] ?? "🎖️"}
                        </span>
                        <span className="flex-1 font-bold text-text-primary">
                          {s.teamName}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star
                            size={13}
                            fill="var(--sheriff-gold)"
                            style={{ color: "var(--sheriff-gold)" }}
                          />
                          <span
                            className="font-bold"
                            style={{ color: "var(--sheriff-gold)" }}
                          >
                            {s.score}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
