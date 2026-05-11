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
        <div
          className="absolute top-[-25%] left-[-15%] w-[65vw] h-[65vw] rounded-full opacity-[0.08]"
          style={{
            background:
              "radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[-25%] right-[-15%] w-[65vw] h-[65vw] rounded-full opacity-[0.08]"
          style={{
            background:
              "radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 w-full max-w-lg text-center">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="text-6xl sm:text-8xl tracking-widest shimmer-text leading-none"
            style={{ fontFamily: "var(--font-bebas), 'Bebas Neue', cursive" }}
          >
            NEON SALOON
          </h1>
          <p className="mt-3 text-text-muted text-sm uppercase tracking-widest">
            dzikie Gry na wieczory panieńskie.
          </p>
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
            // 1. Dodano: relative, overflow-hidden (aby światło nie wychodziło poza przycisk) oraz group
            className="relative cursor-pointer overflow-hidden group flex items-center gap-4 p-5 rounded-2xl border-2 text-left"
            style={{
              borderColor: "var(--sheriff-gold)",
              backgroundColor: "rgba(255,215,0,0.07)",
            }}
          >
            {/* 2. Element światła: jest z lewej strony (-left-full), pochylony (skew-x) i na hover przejeżdża w prawo (group-hover:left-full) */}
            <div className="pointer-events-none absolute inset-y-0 -left-[100%] z-0 w-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />

            {/* 3. Dodano 'relative z-10' do zawartości, aby światło przesuwało się POD ikonami i tekstem */}
            <div
              className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(255,215,0,0.15)" }}
            >
              <Tv size={22} style={{ color: "var(--sheriff-gold)" }} />
            </div>
            <div className="relative z-10 flex-1">
              <p
                className="font-bold text-base transition-colors"
                style={{ color: "var(--sheriff-gold)" }}
              >
                Chcę być organizatorem.
              </p>
              <p className="text-text-muted text-xs mt-0.5">
                Wyświetl na dużym ekranie / TV
              </p>
            </div>
            <ChevronRight size={16} className="relative z-10 text-text-muted" />
          </motion.button>

          {/* Join */}
          <motion.button
            id="join-game-btn"
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/join")}
            // 1. Dodano: relative, overflow-hidden, group
            className="relative cursor-pointer overflow-hidden group flex items-center gap-4 p-5 rounded-2xl border-2 text-left"
            style={{
              borderColor: "var(--neon-pink)",
              // Zakładam, że masz zdefiniowane var(--neon-pink-dim), jeśli nie, użyj rgba() tak jak wyżej
              backgroundColor: "var(--neon-pink-dim)",
            }}
          >
            {/* 2. Element światła */}
            <div className="pointer-events-none absolute inset-y-0 -left-[100%] z-0 w-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />

            {/* 3. Dodano 'relative z-10' */}
            <div
              className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(255,16,240,0.15)" }}
            >
              <Smartphone size={22} style={{ color: "var(--neon-pink)" }} />
            </div>
            <div className="relative z-10 flex-1">
              <p
                className="font-bold text-base"
                style={{ color: "var(--neon-pink)" }}
              >
                Dołącz do gry.
              </p>
              <p className="text-text-muted text-xs mt-0.5">
                Wpisz PIN na telefonie.
              </p>
            </div>
            <ChevronRight size={16} className="relative z-10 text-text-muted" />
          </motion.button>
        </motion.div>

        <motion.p
          className="text-[10px] text-text-muted opacity-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.8 }}
        >
          <Zap
            size={9}
            className="inline mr-1"
            style={{ color: "var(--neon-pink)" }}
          />
          Neon Saloon v1.0• AKN Software 2026
        </motion.p>
      </div>
    </main>
  );
}
