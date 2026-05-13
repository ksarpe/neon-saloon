"use client";

import { useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Play, Users, User, Star } from "lucide-react";
import { useGameStore } from "@/lib/store";

const GAME_MODE_OPTIONS = [
  {
    value: "individual" as const,
    label: "Individual",
    icon: User,
    description: "Every cowgirl for herself!",
  },
  {
    value: "teams" as const,
    label: "Teams",
    icon: Users,
    description: "Ride together, win together.",
  },
];

export default function SetupScreen() {
  const {
    gameMode,
    participants,
    setGameMode,
    addParticipant,
    removeParticipant,
    setGamePhase,
  } = useGameStore();
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    const name = inputValue.trim();
    if (!name || participants.length >= 10) return;
    addParticipant(name);
    setInputValue("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAdd();
  };

  const canStart = participants.length >= 2;

  return (
    <div className="w-full h-full flex flex-col items-center justify-start px-4 py-6 overflow-y-auto scrollable">
      {/* ── Hero Header ──────────────────────────────────────────────── */}
      <motion.div
        className="text-center mb-8 mt-2"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="text-6xl mb-2 select-none"
          animate={{ rotate: [0, -8, 8, -5, 5, 0] }}
          transition={{
            duration: 2,
            delay: 0.8,
            repeat: Infinity,
            repeatDelay: 5,
          }}
        >
          🤠
        </motion.div>
        <h1
          className="font-bebas text-5xl sm:text-7xl tracking-widest shimmer-text leading-none"
          style={{ fontFamily: "'Bebas Neue', cursive" }}
        >
          last rodeo andżeliki
        </h1>
        <p className="mt-2 text-text-muted text-sm tracking-wider uppercase font-medium">
          The Wildest Bachelorette Game in the West
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          {["🌵", "💍", "🥃", "🌸", "✨"].map((e, i) => (
            <motion.span
              key={i}
              className="text-lg"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}
            >
              {e}
            </motion.span>
          ))}
        </div>
      </motion.div>

      <div className="w-full max-w-md flex flex-col gap-5">
        {/* ── Game Mode ────────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label className="block text-xs uppercase tracking-widest text-text-muted mb-3 font-semibold">
            Game Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            {GAME_MODE_OPTIONS.map(
              ({ value, label, icon: Icon, description }) => {
                const isActive = gameMode === value;
                return (
                  <motion.button
                    key={value}
                    id={`mode-${value}`}
                    onClick={() => setGameMode(value)}
                    whileTap={{ scale: 0.97 }}
                    className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                      isActive
                        ? "border-neon-pink bg-neon-pink-dim text-text-primary box-glow-pink"
                        : "border-saloon-border bg-saloon-surface text-text-muted hover:border-saloon-border/80"
                    }`}
                    style={isActive ? { borderColor: "var(--neon-pink)" } : {}}
                  >
                    <Icon
                      size={22}
                      className={
                        isActive ? "text-neon-pink" : "text-text-muted"
                      }
                      style={isActive ? { color: "var(--neon-pink)" } : {}}
                    />
                    <span className="font-bold text-sm tracking-wide">
                      {label}
                    </span>
                    <span className="text-[10px] text-center leading-tight opacity-70">
                      {description}
                    </span>
                  </motion.button>
                );
              },
            )}
          </div>
        </motion.section>

        {/* ── Player Setup ─────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs uppercase tracking-widest text-text-muted font-semibold">
              {gameMode === "teams" ? "Teams" : "Players"} (
              {participants.length}/10)
            </label>
            {participants.length < 2 && (
              <span className="text-[10px] text-amber-400 font-medium">
                Add at least 2
              </span>
            )}
          </div>

          {/* Input row */}
          <div className="flex gap-2 mb-3">
            <input
              id="player-name-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={20}
              placeholder={`${gameMode === "teams" ? "Team" : "Player"} name…`}
              className="flex-1 bg-saloon-surface border border-saloon-border rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-neon-pink transition-colors"
              style={
                { "--tw-ring-color": "var(--neon-pink)" } as React.CSSProperties
              }
              disabled={participants.length >= 10}
            />
            <motion.button
              id="add-player-btn"
              onClick={handleAdd}
              disabled={!inputValue.trim() || participants.length >= 10}
              whileTap={{ scale: 0.93 }}
              className="w-12 h-12 flex items-center justify-center rounded-xl border border-neon-pink bg-neon-pink-dim disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              style={{ borderColor: "var(--neon-pink)" }}
            >
              <Plus size={20} style={{ color: "var(--neon-pink)" }} />
            </motion.button>
          </div>

          {/* Player list */}
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {participants.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-3 bg-saloon-surface border border-saloon-border rounded-xl px-4 py-3"
                >
                  <span className="text-xl select-none">{p.avatar}</span>
                  <span
                    className="flex-1 text-sm font-semibold"
                    style={{ color: p.color }}
                  >
                    {p.name}
                  </span>
                  <div className="flex items-center gap-1 mr-1">
                    <Star size={12} style={{ color: "var(--sheriff-gold)" }} />
                    <span className="text-xs text-text-muted">0</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeParticipant(p.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors"
                    aria-label={`Remove ${p.name}`}
                  >
                    <Trash2 size={14} className="text-red-400" />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>

            {participants.length === 0 && (
              <div className="text-center py-6 text-text-muted text-xs opacity-60">
                No players yet — saddle up! 🐴
              </div>
            )}
          </div>
        </motion.section>

        {/* ── Start Button ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: canStart ? 1 : 0.4, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.button
            id="start-game-btn"
            disabled={!canStart}
            onClick={() => setGamePhase("playing")}
            whileTap={canStart ? { scale: 0.97 } : {}}
            className="w-full py-4 rounded-2xl font-bold text-lg tracking-widest uppercase flex items-center justify-center gap-3 disabled:cursor-not-allowed transition-all duration-300"
            style={{
              background: canStart
                ? "linear-gradient(135deg, var(--neon-pink), #c800c8)"
                : "rgba(255,16,240,0.1)",
              color: canStart ? "#fff" : "var(--text-muted)",
              boxShadow: canStart
                ? "0 4px 30px rgba(255,16,240,0.5), 0 0 60px rgba(255,16,240,0.2)"
                : "none",
            }}
          >
            <Play size={20} />
            <span
              style={{
                fontFamily: "'Bebas Neue', cursive",
                letterSpacing: "0.15em",
                fontSize: "1.25rem",
              }}
            >
              Ride into the Saloon
            </span>
          </motion.button>
        </motion.div>

        <p className="text-center text-[10px] text-text-muted pb-6 opacity-50">
          🌵 last rodeo andżeliki • Not responsible for chaos
        </p>
      </div>
    </div>
  );
}
