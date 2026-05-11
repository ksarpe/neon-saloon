"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Tv, Loader2, ChevronRight, Zap, Layers, MessageSquare, Sword } from "lucide-react";

const GAME_MODES = [
  {
    id: "classic",
    emoji: "🃏",
    label: "Classic Card Game",
    description: "Players flip cards & complete tasks. Swipe right = success, left = fail.",
    icon: Layers,
    color: "var(--sheriff-gold)",
    border: "rgba(255,215,0,0.5)",
    bg: "rgba(255,215,0,0.07)",
  },
  {
    id: "trivia",
    emoji: "🧠",
    label: "Bride Trivia Quiz",
    description: "Who knows the bride best? Players answer & vote simultaneously.",
    icon: MessageSquare,
    color: "var(--neon-pink)",
    border: "rgba(255,16,240,0.5)",
    bg: "rgba(255,16,240,0.07)",
  },
  {
    id: "dares",
    emoji: "🌶️",
    label: "Spicy Dares Only",
    description: "Only dare & action cards. The wildest option — you've been warned.",
    icon: Sword,
    color: "#f59e0b",
    border: "rgba(245,158,11,0.5)",
    bg: "rgba(245,158,11,0.07)",
  },
];

export default function HostSetupPage() {
  const router = useRouter();
  const [hostName, setHostName] = useState("");
  const [selectedMode, setSelectedMode] = useState("classic");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!hostName.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostName: hostName.trim(), gameMode: selectedMode }),
      });
      if (!res.ok) throw new Error();
      const { pin } = await res.json();
      // Pass the game mode to the host screen via query param
      router.push(`/host/${pin}?mode=${selectedMode}`);
    } catch {
      setError("Could not create a game. Try again!");
      setCreating(false);
    }
  };

  return (
    <div className="w-full h-dvh flex flex-col items-center justify-start px-4 py-6 bg-saloon-dark overflow-y-auto scrollable">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-25%] left-[-15%] w-[65vw] h-[65vw] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-[-25%] right-[-15%] w-[65vw] h-[65vw] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="relative z-10 w-full max-w-sm flex flex-col gap-7 mt-4">
        {/* Header */}
        <motion.div className="text-center"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="text-5xl block mb-2 select-none">🤠</span>
          <h1 className="text-5xl tracking-widest shimmer-text"
            style={{ fontFamily: "'Bebas Neue',cursive" }}>Host Setup</h1>
          <p className="text-text-muted text-xs uppercase tracking-widest mt-1">
            Configure your Neon Saloon session
          </p>
        </motion.div>

        {/* Host name */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <label className="block text-xs uppercase tracking-widest text-text-muted font-semibold mb-2">
            Your name (host)
          </label>
          <input
            id="host-name-input"
            type="text"
            value={hostName}
            onChange={e => setHostName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && hostName.trim() && handleCreate()}
            maxLength={20}
            autoFocus
            placeholder="e.g. Sheriff Rosa…"
            className="w-full bg-saloon-surface border-2 rounded-xl px-4 py-4 text-lg font-bold text-text-primary placeholder:text-text-muted focus:outline-none transition-colors"
            style={{ borderColor: hostName.trim() ? "var(--sheriff-gold)" : "var(--saloon-border)" }}
          />
        </motion.div>

        {/* Game mode selector */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <label className="block text-xs uppercase tracking-widest text-text-muted font-semibold mb-3">
            Game mode
          </label>
          <div className="flex flex-col gap-3">
            {GAME_MODES.map(mode => {
              const active = selectedMode === mode.id;
              return (
                <motion.button
                  key={mode.id}
                  id={`mode-${mode.id}`}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedMode(mode.id)}
                  className="flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200"
                  style={{
                    borderColor: active ? mode.border : "var(--saloon-border)",
                    backgroundColor: active ? mode.bg : "transparent",
                    boxShadow: active ? `0 0 20px ${mode.border}` : "none",
                  }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: active ? mode.bg : "var(--saloon-surface)", border: `1px solid ${mode.border}` }}>
                    {mode.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: active ? mode.color : "var(--text-primary)" }}>
                      {mode.label}
                    </p>
                    <p className="text-text-muted text-[11px] mt-0.5 leading-snug">
                      {mode.description}
                    </p>
                  </div>
                  {active && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: mode.color }}>
                      <span className="text-white text-[10px]">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Create button */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <motion.button
            id="create-lobby-btn"
            disabled={!hostName.trim() || creating}
            whileTap={{ scale: 0.97 }}
            onClick={handleCreate}
            className="w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-3 disabled:opacity-30"
            style={{
              background: "linear-gradient(135deg,var(--neon-pink),#c800c8)",
              boxShadow: "0 4px 30px rgba(255,16,240,0.5)",
              fontFamily: "'Bebas Neue',cursive",
              fontSize: "1.2rem",
              letterSpacing: "0.15em",
            }}
          >
            {creating
              ? <><Loader2 size={18} className="animate-spin" />Creating lobby…</>
              : <><Tv size={18} />Open the Saloon<ChevronRight size={16} /></>}
          </motion.button>
          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-red-400 text-xs text-center mt-3">{error}</motion.p>
          )}
        </motion.div>

        <p className="text-center text-[10px] text-text-muted opacity-40 pb-4">
          <Zap size={9} className="inline mr-1" style={{ color: "var(--neon-pink)" }} />
          Neon Saloon • Show on TV or big screen
        </p>
      </div>
    </div>
  );
}
