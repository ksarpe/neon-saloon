"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronRight } from "lucide-react";
import { useGameStore } from "@/lib/store";

export default function Scoreboard() {
  const { participants, currentParticipantIndex, deck, currentCardIndex, gameMode } =
    useGameStore();

  const currentPlayer = participants[currentParticipantIndex];
  const cardsRemaining = deck.length - currentCardIndex;

  if (!currentPlayer) return null;

  return (
    <div className="w-full shrink-0 px-3 pt-3 pb-2 flex flex-col gap-2">
      {/* ── Top bar: current turn + deck counter ─── */}
      <div className="flex items-center justify-between">
        <motion.div
          key={currentPlayer.id}
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2"
        >
          <span className="text-xl select-none">{currentPlayer.avatar}</span>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-muted font-semibold leading-none mb-0.5">
              {gameMode === "teams" ? "Team's Turn" : "Cowgirl's Turn"}
            </p>
            <p
              className="text-sm font-bold leading-tight"
              style={{ color: currentPlayer.color }}
            >
              {currentPlayer.name}
            </p>
          </div>
        </motion.div>

        {/* Cards remaining badge */}
        <div className="flex items-center gap-1.5 bg-saloon-surface border border-saloon-border rounded-full px-3 py-1.5">
          <span className="text-xs text-text-muted">🃏</span>
          <span className="text-xs font-bold text-text-primary">{cardsRemaining}</span>
          <span className="text-[9px] text-text-muted">left</span>
        </div>
      </div>

      {/* ── Player score chips ─────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollable" style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}>
        <AnimatePresence>
          {participants.map((p, idx) => {
            const isActive = idx === currentParticipantIndex;
            return (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center gap-1.5 shrink-0 px-3 py-1.5 rounded-full border transition-all duration-300 ${
                  isActive ? "border-opacity-100" : "border-opacity-30 opacity-60"
                }`}
                style={{
                  borderColor: isActive ? p.color : `${p.color}50`,
                  backgroundColor: isActive ? `${p.color}18` : "transparent",
                  boxShadow: isActive ? `0 0 12px ${p.color}40` : "none",
                }}
              >
                <span className="text-xs select-none">{p.avatar}</span>
                <span
                  className="text-xs font-bold leading-none"
                  style={{ color: isActive ? p.color : `${p.color}80` }}
                >
                  {p.name.length > 8 ? p.name.slice(0, 7) + "…" : p.name}
                </span>

                {/* Sheriff badge score */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: Math.min(p.score, 5) }).map((_, si) => (
                    <motion.span
                      key={si}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: si * 0.05 }}
                    >
                      <Star
                        size={9}
                        fill="var(--sheriff-gold)"
                        style={{ color: "var(--sheriff-gold)" }}
                      />
                    </motion.span>
                  ))}
                  {p.score > 5 && (
                    <span className="text-[9px] font-bold" style={{ color: "var(--sheriff-gold)" }}>
                      +{p.score - 5}
                    </span>
                  )}
                  {p.score === 0 && (
                    <span className="text-[9px] text-text-muted">–</span>
                  )}
                </div>

                {isActive && (
                  <ChevronRight
                    size={10}
                    className="ml-0.5"
                    style={{ color: p.color }}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
