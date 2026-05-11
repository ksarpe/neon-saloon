"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Medal, RotateCcw, Home } from "lucide-react";
import { useGameStore, Participant } from "@/lib/store";

function PodiumCard({
  participant,
  rank,
  delay,
}: {
  participant: Participant;
  rank: number;
  delay: number;
}) {
  const heights = { 1: "h-28", 2: "h-20", 3: "h-14" } as Record<number, string>;
  const rankEmojis = { 1: "🥇", 2: "🥈", 3: "🥉" } as Record<number, string>;
  const isWinner = rank === 1;

  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-1">
        <motion.span
          className="text-4xl select-none"
          animate={isWinner ? { rotate: [0, -10, 10, -8, 8, 0] } : {}}
          transition={{ duration: 2, delay: delay + 0.8, repeat: Infinity, repeatDelay: 4 }}
        >
          {participant.avatar}
        </motion.span>
        {isWinner && (
          <motion.span
            className="text-xl select-none"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            👑
          </motion.span>
        )}
        <p
          className="text-xs font-bold text-center max-w-[70px] leading-tight"
          style={{ color: participant.color }}
        >
          {participant.name}
        </p>
      </div>

      {/* Score */}
      <div className="flex items-center gap-1">
        <Star
          size={11}
          fill="var(--sheriff-gold)"
          style={{ color: "var(--sheriff-gold)" }}
        />
        <span className="text-sm font-bold" style={{ color: "var(--sheriff-gold)" }}>
          {participant.score}
        </span>
      </div>

      {/* Podium block */}
      <div
        className={`w-20 ${heights[rank] ?? "h-10"} rounded-t-lg flex items-end justify-center pb-2 relative overflow-hidden`}
        style={{
          background: isWinner
            ? "linear-gradient(180deg, rgba(255,215,0,0.3), rgba(255,215,0,0.1))"
            : "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
          border: `1px solid ${isWinner ? "rgba(255,215,0,0.5)" : "rgba(255,255,255,0.1)"}`,
        }}
      >
        <span className="text-2xl select-none">{rankEmojis[rank]}</span>
        {isWinner && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 6px,
                rgba(255,215,0,0.3) 6px,
                rgba(255,215,0,0.3) 7px
              )`,
            }}
          />
        )}
      </div>
    </motion.div>
  );
}

export default function GameOverScreen() {
  const { participants, resetGame, setGamePhase, shuffleDeck } = useGameStore();

  // Sort by score descending
  const ranked = useMemo(
    () => [...participants].sort((a, b) => b.score - a.score),
    [participants]
  );

  const [first, second, third, ...rest] = ranked;

  const handlePlayAgain = () => {
    // Keep participants but reset scores + shuffle deck
    useGameStore.setState((s) => ({
      participants: s.participants.map((p) => ({ ...p, score: 0 })),
      currentParticipantIndex: 0,
      currentCardIndex: 0,
      isCardFlipped: false,
    }));
    shuffleDeck();
    setGamePhase("playing");
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start px-4 py-6 overflow-y-auto scrollable">
      {/* Header */}
      <motion.div
        className="text-center mb-8 mt-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-5xl mb-2 select-none"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          🏆
        </motion.div>
        <h1
          className="font-bebas text-5xl sm:text-6xl tracking-widest shimmer-text"
          style={{ fontFamily: "'Bebas Neue', cursive" }}
        >
          Saloon Standings
        </h1>
        <p className="text-text-muted text-xs uppercase tracking-widest mt-1">
          The dust has settled, cowgirls…
        </p>
      </motion.div>

      {/* Podium — top 3 */}
      {ranked.length >= 2 && (
        <motion.div
          className="flex items-end justify-center gap-3 mb-8 w-full max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* 2nd place (left) */}
          {second && <PodiumCard participant={second} rank={2} delay={0.4} />}
          {/* 1st place (center) */}
          {first && <PodiumCard participant={first} rank={1} delay={0.2} />}
          {/* 3rd place (right) */}
          {third && <PodiumCard participant={third} rank={3} delay={0.6} />}
        </motion.div>
      )}

      {/* Full leaderboard */}
      <div className="w-full max-w-md flex flex-col gap-2 mb-8">
        <p className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-1 flex items-center gap-2">
          <Medal size={12} style={{ color: "var(--sheriff-gold)" }} />
          Full Leaderboard
        </p>
        {ranked.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.07 }}
            className="flex items-center gap-3 bg-saloon-surface border border-saloon-border rounded-xl px-4 py-3"
          >
            <span className="text-sm font-bold w-5 text-text-muted text-center">
              {i + 1}
            </span>
            <span className="text-xl select-none">{p.avatar}</span>
            <span className="flex-1 text-sm font-semibold" style={{ color: p.color }}>
              {p.name}
            </span>
            <div className="flex items-center gap-1">
              <Star
                size={12}
                fill="var(--sheriff-gold)"
                style={{ color: "var(--sheriff-gold)" }}
              />
              <span className="text-sm font-bold" style={{ color: "var(--sheriff-gold)" }}>
                {p.score}
              </span>
              <span className="text-[10px] text-text-muted ml-0.5">pts</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="w-full max-w-md flex flex-col gap-3">
        <motion.button
          id="play-again-btn"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          whileTap={{ scale: 0.97 }}
          onClick={handlePlayAgain}
          className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2"
          style={{
            background: "linear-gradient(135deg, var(--neon-pink), #c800c8)",
            boxShadow: "0 4px 30px rgba(255,16,240,0.5)",
            fontFamily: "'Bebas Neue', cursive",
            letterSpacing: "0.15em",
            fontSize: "1.2rem",
          }}
        >
          <RotateCcw size={18} />
          Play Again
        </motion.button>

        <motion.button
          id="new-game-btn"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileTap={{ scale: 0.97 }}
          onClick={resetGame}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 border border-saloon-border bg-saloon-surface text-text-muted hover:text-text-primary transition-colors"
        >
          <Home size={15} />
          New Game (Reset All)
        </motion.button>
      </div>

      <p className="text-center text-[10px] text-text-muted opacity-40 mt-6 pb-4">
        🌵 Neon Saloon • The wildest night in the West
      </p>
    </div>
  );
}
