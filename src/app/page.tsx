"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Tv, Smartphone, ChevronRight, Zap } from "lucide-react";

export default function Home() {
  const router = useRouter();

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
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/host")}
            className="flex items-center gap-4 p-5 rounded-2xl border-2 text-left"
            style={{ borderColor: "var(--sheriff-gold)", backgroundColor: "rgba(255,215,0,0.07)" }}
          >
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(255,215,0,0.15)" }}>
              <Tv size={22} style={{ color: "var(--sheriff-gold)" }} />
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
