"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Tv, Loader2, ChevronRight, Dices, MessageSquare } from "lucide-react";
import { useEffect } from "react";

const FUNNY_NAMES = [
  "Dzika Landryna",
  "Szeryfowa Aneta",
  "Różowa Pantera",
  "Kowbojka Kasia",
  "Pijana Pszczółka",
  "Gwiazda Szeryfa",
  "Neonowa Klacz",
  "Złota Ostroga",
  "Buntowniczka",
  "Saloonowa Królowa",
  "Whiskey Lady",
  "Galopująca Gazela",
  "Szalona Ruda",
  "Ostra Tequila",
  "Złota Gwiazda",
  "Różowy Dynamit",
  "Galopująca Panna",
  "Królowa Parkietu",
  "Wieczorowa Dama",
  "Błyszcząca Ostroga",
  "Neonowa Amazonka",
  "Gorąca Czekolada",
  "Słodka Zemsta",
  "Karmazynowa Dama",
  "Diamentowa Przełęcz",
  "Srebrna Podkowa",
  "Błękitna Laguna",
  "Śpiewająca Syrena",
  "Tańcząca z Wilkami",
  "Wielka Błękitna",
  "Słońce Teksasu",
  "Dzika Orchidea",
  "Perłowa Dama",
  "Rubinowa Róża",
  "Szmaragdowa Dolina",
];

const GAME_MODES = [
  {
    id: "trivia",
    emoji: "🧠",
    label: "Quiz o Pannie Młodej",
    description:
      "Kto zna Pannę Młodą najlepiej? Uczestniczki odpowiadają i głosują jednocześnie.",
    icon: MessageSquare,
    color: "var(--neon-pink)",
    border: "rgba(255,16,240,0.5)",
    bg: "rgba(255,16,240,0.07)",
  },
  {
    id: "test",
    emoji: "🔥",
    label: "Test DEVA",
    description: "Testowy tryb gry.",
    icon: MessageSquare,
    color: "var(--neon-pink)",
    border: "rgba(255,16,240,0.5)",
    bg: "rgba(255,16,240,0.07)",
  },
];

export default function HostSetupPage() {
  const router = useRouter();
  const [hostName, setHostName] = useState("");
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState("np. Szeryf Alicja");

  useEffect(() => {
    const randomName =
      FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)];
    setPlaceholder(`np. ${randomName}`);
  }, []);

  const handleCreate = async () => {
    if (!hostName.trim() || !selectedMode) return;
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostName: hostName.trim(),
          gameMode: selectedMode,
        }),
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
    <div className="w-full min-h-dvh flex flex-col items-center justify-center p-6 overflow-y-auto">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-[-25%] left-[-15%] w-[65vw] h-[65vw] rounded-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className=" bottom-[-25%] right-[-15%] w-[65vw] h-[65vw] rounded-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-xl flex flex-col gap-10 mx-auto">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="text-5xl tracking-widest shimmer-text"
            style={{ fontFamily: "'Bebas Neue',cursive" }}
          >
            USTAWIENIA
          </h1>
          <p className="text-text-muted text-xs uppercase tracking-widest mt-1">
            ustaw swoją nazwę oraz wybierz grę w jakiej będziecie rywalizować.
          </p>
        </motion.div>

        {/* Host name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-xs uppercase tracking-widest text-text-muted font-semibold mb-2">
            Nazwa kowboja
          </label>
          <div className="flex gap-2">
            <input
              id="host-name-input"
              type="text"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && hostName.trim() && handleCreate()
              }
              maxLength={20}
              autoFocus
              placeholder={placeholder}
              className="flex-1 bg-saloon-surface border-2 rounded-xl p-4 text-lg font-bold text-text-primary placeholder:text-text-muted focus:outline-none transition-colors"
              style={{
                borderColor: hostName.trim()
                  ? "var(--sheriff-gold)"
                  : "var(--saloon-border)",
              }}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const randomName =
                  FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)];
                setHostName(randomName);
              }}
              className="px-4 rounded-xl border-2 flex items-center justify-center bg-saloon-surface transition-colors"
              style={{ borderColor: "var(--saloon-border)" }}
              title="Losuj imię"
            >
              <Dices size={24} className="text-text-muted" />
            </motion.button>
          </div>
        </motion.div>

        {/* Game mode selector */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-xs uppercase tracking-widest text-text-muted font-semibold mb-3">
            Tryb
          </label>
          <div className="flex flex-col gap-3">
            {GAME_MODES.map((mode) => {
              const active = selectedMode === mode.id;
              return (
                <motion.button
                  key={mode.id}
                  id={`mode-${mode.id}`}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedMode(mode.id)}
                  // 1. Dodano: relative, overflow-hidden i group
                  className="relative overflow-hidden group flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200"
                  style={{
                    borderColor: active ? mode.border : "var(--saloon-border)",
                    backgroundColor: active ? mode.bg : "transparent",
                    boxShadow: active ? `0 0 20px ${mode.border}` : "none",
                  }}
                >
                  {/* 2. Ukryty element światła */}
                  <div className="pointer-events-none absolute inset-y-0 -left-[100%] z-0 w-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 ease-in-out group-hover:left-[100%]" />

                  {/* 3. Dodano 'relative z-10' do kontenera z emoji */}
                  <div
                    className="relative z-10 w-11 h-11 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{
                      backgroundColor: active
                        ? mode.bg
                        : "var(--saloon-surface)",
                      border: `1px solid ${mode.border}`,
                    }}
                  >
                    {mode.emoji}
                  </div>

                  {/* 4. Dodano 'relative z-10' do kontenera z tekstem */}
                  <div className="relative z-10 flex-1">
                    <p
                      className="font-bold text-sm transition-colors duration-200"
                      style={{
                        color: active ? mode.color : "var(--text-primary)",
                      }}
                    >
                      {mode.label}
                    </p>
                    <p className="text-text-muted text-[11px] mt-0.5 leading-snug">
                      {mode.description}
                    </p>
                  </div>

                  {/* 5. Dodano 'relative z-10' do ptaszka zaznaczenia */}
                  {active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="relative z-10 w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: mode.color }}
                    >
                      <span className="text-white text-[10px]">✓</span>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Create button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <motion.button
            id="create-lobby-btn"
            disabled={!hostName.trim() || !selectedMode || creating}
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
            {creating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Tworze salon...
              </>
            ) : (
              <>Otwórz salon na dzikim zachodzie</>
            )}
          </motion.button>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-xs text-center mt-3"
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
