"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Tv, Smartphone, Loader2, ChevronRight, Zap } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleHostGame = async () => {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostName: "Host" }),
      });
      if (!res.ok) throw new Error("Failed to create session");
      const { pin } = await res.json();
      router.push(`/host/${pin}`);
    } catch {
      setError("Could not create a game. Try again!");
      setCreating(false);
    }
  };

  return (
    <main className="relative w-full h-dvh overflow-hidden flex flex-col items-center justify-center px-6 bg-saloon-dark">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-25%] left-[-15%] w-[65vw] h-[65vw] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-[-25%] right-[-15%] w-[65vw] h-[65vw] rounded-full opacity-[0.08]"
          style={{ background: "radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)", filter: "blur(80px)" }} />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-sm text-center">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="text-7xl block mb-3 select-none"
            animate={{ rotate: [0, -8, 8, -5, 5, 0] }}
            transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 5 }}
          >
            🤠
          </motion.span>
          <h1
            className="text-6xl sm:text-7xl tracking-widest shimmer-text leading-none"
            style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', cursive" }}
          >
            NEON SALOON
          </h1>
          <p className="mt-3 text-text-muted text-sm uppercase tracking-widest">
            The Wildest Bachelorette Game in the West
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            {["🌵", "💍", "🥃", "🌸", "✨"].map((e, i) => (
              <motion.span key={i} className="text-lg"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}>
                {e}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="flex flex-col gap-4 w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Host */}
          <motion.button
            id="host-game-btn"
            disabled={creating}
            whileTap={{ scale: 0.97 }}
            onClick={handleHostGame}
            className="flex items-center gap-4 p-5 rounded-2xl border-2 text-left disabled:opacity-50"
            style={{ borderColor: "var(--sheriff-gold)", backgroundColor: "rgba(255,215,0,0.07)" }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(255,215,0,0.15)" }}>
              {creating
                ? <Loader2 size={22} className="animate-spin" style={{ color: "var(--sheriff-gold)" }} />
                : <Tv size={22} style={{ color: "var(--sheriff-gold)" }} />}
            </div>
            <div className="flex-1">
              <p className="font-bold text-base" style={{ color: "var(--sheriff-gold)" }}>
                Host a Game
              </p>
              <p className="text-text-muted text-xs mt-0.5">
                Display on the big screen / TV
              </p>
            </div>
            <ChevronRight size={16} className="text-text-muted" />
          </motion.button>

          {/* Join */}
          <motion.button
            id="join-game-btn"
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/join")}
            className="flex items-center gap-4 p-5 rounded-2xl border-2 text-left"
            style={{ borderColor: "var(--neon-pink)", backgroundColor: "var(--neon-pink-dim)" }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(255,16,240,0.15)" }}>
              <Smartphone size={22} style={{ color: "var(--neon-pink)" }} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-base" style={{ color: "var(--neon-pink)" }}>
                Join a Game
              </p>
              <p className="text-text-muted text-xs mt-0.5">
                Enter PIN on your phone
              </p>
            </div>
            <ChevronRight size={16} className="text-text-muted" />
          </motion.button>
        </motion.div>

        {error && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-red-400 text-sm">{error}</motion.p>
        )}

        <motion.p
          className="text-[10px] text-text-muted opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.8 }}
        >
          <Zap size={9} className="inline mr-1" style={{ color: "var(--neon-pink)" }} />
          Neon Saloon • Powered by Pusher & Framer Motion
        </motion.p>
      </div>
    </main>
  );
}
