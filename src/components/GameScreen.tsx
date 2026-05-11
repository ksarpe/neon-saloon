"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Trophy, Zap } from "lucide-react";
import { useGameStore } from "@/lib/store";
import Scoreboard from "@/components/Scoreboard";
import CardDeck from "@/components/CardDeck";

type FeedbackType = "success" | "fail" | null;

export default function GameScreen() {
  const { setGamePhase, resetGame, deck, currentCardIndex } = useGameStore();
  const [feedback, setFeedback] = useState<FeedbackType>(null);

  const isLastCard = currentCardIndex >= deck.length - 1;

  const handleSuccess = useCallback(() => {
    setFeedback("success");
    setTimeout(() => setFeedback(null), 1200);
  }, []);

  const handleFail = useCallback(() => {
    setFeedback("fail");
    setTimeout(() => setFeedback(null), 900);
  }, []);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden relative">
      {/* ── Background flash on swipe ─────────────── */}
      <AnimatePresence>
        {feedback === "success" && (
          <motion.div
            key="success-flash"
            className="absolute inset-0 pointer-events-none z-30"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ backgroundColor: "rgba(16, 185, 129, 0.15)" }}
          />
        )}
        {feedback === "fail" && (
          <motion.div
            key="fail-flash"
            className="absolute inset-0 pointer-events-none z-30"
            initial={{ opacity: 0.25 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ backgroundColor: "rgba(239, 68, 68, 0.12)" }}
          />
        )}
      </AnimatePresence>

      {/* ── Top header bar ─────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-3 pb-1 shrink-0">
        <motion.div
          className="flex items-center gap-1.5"
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-xl select-none">🤠</span>
          <span
            className="font-bebas text-xl tracking-widest shimmer-text"
            style={{ fontFamily: "'Bebas Neue', cursive" }}
          >
            NEON SALOON
          </span>
        </motion.div>

        <div className="flex items-center gap-2">
          {/* End game / Leaderboard shortcut */}
          {isLastCard && (
            <motion.button
              id="leaderboard-btn"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.93 }}
              onClick={() => setGamePhase("gameover")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border border-amber-400/40 bg-amber-400/10 text-amber-400"
            >
              <Trophy size={12} />
              Results
            </motion.button>
          )}

          <motion.button
            id="reset-game-btn"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => {
              if (confirm("Reset the game? All scores will be lost.")) {
                resetGame();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-saloon-border bg-saloon-surface text-text-muted"
          >
            <RotateCcw size={12} />
            Reset
          </motion.button>
        </div>
      </div>

      {/* ── Scoreboard ─────────────────────────────── */}
      <div className="relative z-10 shrink-0">
        <Scoreboard />
      </div>

      {/* ── Divider ────────────────────────────────── */}
      <div
        className="h-px w-full shrink-0 opacity-30"
        style={{ background: "linear-gradient(90deg, transparent, var(--saloon-border), transparent)" }}
      />

      {/* ── Card Deck ──────────────────────────────── */}
      <div className="relative z-10 flex-1 min-h-0">
        <CardDeck onSuccess={handleSuccess} onFail={handleFail} />
      </div>

      {/* ── Neon bottom bar ────────────────────────── */}
      <div className="relative z-10 shrink-0 px-4 pb-4 pt-2 flex items-center justify-center gap-2">
        <Zap size={10} style={{ color: "var(--neon-pink)" }} />
        <span className="text-[9px] text-text-muted uppercase tracking-widest opacity-50">
          Neon Saloon • Wild West Edition
        </span>
        <Zap size={10} style={{ color: "var(--neon-pink)" }} />
      </div>
    </div>
  );
}
