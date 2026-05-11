"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Users,
  UserPlus,
  ChevronRight,
  Loader2,
  CheckCircle,
  ArrowLeft,
  Dices,
} from "lucide-react";
import { useGameSocket } from "@/hooks/useGameSocket";
import PlayerGameScreen from "@/components/PlayerGameScreen";
import type {
  TeamCreatedPayload,
  WireCard,
  GameStartedPayload,
} from "@/lib/pusher-server";
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

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = "pin" | "name" | "mode" | "team" | "waiting" | "playing";

interface LiveTeam {
  teamId: string;
  teamName: string;
  color: string;
  emoji: string;
  memberCount: number;
}

interface PlayerInfo {
  playerId: string;
  avatar: string;
  teamId: string | null;
  teamName: string | null;
}

const slide = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
};

// ─── PIN pad ─────────────────────────────────────────────────────────────────

function PinInput({
  value,
  onChange,
  onSubmit,
  loading,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
  error: string | null;
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h1
          className="text-6xl tracking-widest shimmer-text mt-1"
          style={{ fontFamily: "'Bebas Neue',cursive" }}
        >
          NEON SALOON
        </h1>
        <p className="text-text-muted text-sm">Wpisz PIN aby dołączyć do gry</p>
      </div>
      <div className="flex gap-3">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              borderColor: value[i]
                ? "var(--neon-pink)"
                : i === value.length
                  ? "rgba(255,16,240,0.5)"
                  : "var(--saloon-border)",
              scale: i === value.length ? 1.08 : 1,
            }}
            transition={{ duration: 0.15 }}
            className="w-16 h-20 rounded-xl border-2 flex items-center justify-center text-3xl font-bold"
            style={{ backgroundColor: "var(--saloon-surface)" }}
          >
            {value[i] ? (
              <motion.span
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                style={{ color: "var(--neon-pink)" }}
              >
                {value[i]}
              </motion.span>
            ) : (
              <span className="opacity-20">—</span>
            )}
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "⌫"].map((k, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.92 }}
            disabled={k === null}
            onClick={() => {
              if (k === null) return;
              if (k === "⌫") {
                onChange(value.slice(0, -1));
                return;
              }
              if (value.length < 4) {
                const n = value + String(k);
                onChange(n);
                if (n.length === 4) setTimeout(onSubmit, 100);
              }
            }}
            className={`h-14 rounded-xl text-xl font-bold flex items-center justify-center ${k === null ? "invisible" : "bg-saloon-surface border border-saloon-border text-text-primary"}`}
          >
            {k}
          </motion.button>
        ))}
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <motion.button
        id="pin-continue-btn"
        disabled={value.length < 4 || loading}
        whileTap={{ scale: 0.97 }}
        onClick={onSubmit}
        className="w-full max-w-[240px] py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-30"
        style={{
          background: "linear-gradient(135deg,var(--neon-pink),#c800c8)",
          boxShadow: "0 4px 30px rgba(255,16,240,0.4)",
          fontFamily: "'Bebas Neue',cursive",
          fontSize: "1.1rem",
          letterSpacing: "0.1em",
        }}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : ""}
        {loading ? "Sprawdzanie…" : "Wejdź do salonu"}
      </motion.button>
    </div>
  );
}

// ─── Name input ──────────────────────────────────────────────────────────────

function NameInput({
  value,
  onChange,
  onSubmit,
  onBack,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const [placeholder, setPlaceholder] = useState("np. Duchess Rosa…");

  useEffect(() => {
    const randomName =
      FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)];
    setPlaceholder(`np. ${randomName}`);
  }, []);
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <h2
          className="text-3xl tracking-widest mt-2"
          style={{
            fontFamily: "'Bebas Neue',cursive",
            color: "var(--sheriff-gold)",
          }}
        >
          Jak masz na imię kowboju?
        </h2>
      </div>
      <div className="flex gap-2 w-full max-w-xs">
        <input
          id="player-name-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && value.trim() && onSubmit()}
          maxLength={20}
          autoFocus
          placeholder={placeholder}
          className="flex-1 bg-saloon-surface border-2 rounded-xl px-4 py-4 text-center text-lg font-bold text-text-primary placeholder:text-text-muted focus:outline-none transition-colors"
          style={{
            borderColor: value.trim()
              ? "var(--neon-pink)"
              : "var(--saloon-border)",
          }}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const randomName =
              FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)];
            onChange(randomName);
          }}
          className="px-4 rounded-xl border-2 flex items-center justify-center bg-saloon-surface transition-colors"
          style={{ borderColor: "var(--saloon-border)" }}
          title="Losuj imię"
        >
          <Dices size={24} className="text-text-muted" />
        </motion.button>
      </div>
      <div className="flex gap-3 w-full max-w-xs">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border border-saloon-border bg-saloon-surface text-text-muted text-sm font-semibold"
        >
          <ArrowLeft size={14} />
          Wróć
        </motion.button>
        <motion.button
          id="name-continue-btn"
          disabled={!value.trim()}
          whileTap={{ scale: 0.97 }}
          onClick={onSubmit}
          className="flex-1 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-30"
          style={{
            background: "linear-gradient(135deg,var(--neon-pink),#c800c8)",
          }}
        >
          Dalej <ChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  );
}

// ─── Mode selector ────────────────────────────────────────────────────────────

function ModeSelector({
  onSolo,
  onTeam,
  onBack,
}: {
  onSolo: () => void;
  onTeam: () => void;
  onBack: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center">
        <span className="text-4xl">🎯</span>
        <h2
          className="text-3xl tracking-widest mt-2"
          style={{
            fontFamily: "'Bebas Neue',cursive",
            color: "var(--sheriff-gold)",
          }}
        >
          Siodłaj konie
        </h2>
      </div>
      <div className="flex flex-col gap-3 w-full max-w-lg">
        <motion.button
          id="solo-mode-btn"
          whileTap={{ scale: 0.97 }}
          onClick={onSolo}
          className="flex items-center gap-4 p-5 rounded-2xl border-2 text-left"
          style={{
            borderColor: "var(--sheriff-gold)",
            backgroundColor: "rgba(255,215,0,0.08)",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: "rgba(255,215,0,0.15)" }}
          >
            <User size={22} style={{ color: "var(--sheriff-gold)" }} />
          </div>
          <div>
            <p
              className="font-bold text-base"
              style={{ color: "var(--sheriff-gold)" }}
            >
              Samotna Kowbojka
            </p>
            <p className="text-text-muted text-xs">
              Każda kowbojka orze jak może!
            </p>
          </div>
          <ChevronRight size={16} className="ml-auto text-text-muted" />
        </motion.button>

        <motion.button
          id="team-mode-btn"
          whileTap={{ scale: 0.97 }}
          onClick={onTeam}
          className="flex items-center gap-4 p-5 rounded-2xl border-2 text-left"
          style={{
            borderColor: "var(--neon-pink)",
            backgroundColor: "var(--neon-pink-dim)",
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: "rgba(255,16,240,0.15)" }}
          >
            <Users size={22} style={{ color: "var(--neon-pink)" }} />
          </div>
          <div>
            <p
              className="font-bold text-base"
              style={{ color: "var(--neon-pink)" }}
            >
              Skrzyknij Gang / Dołącz do Bandy
            </p>
            <p className="text-text-muted text-xs">
              Jedna za wszystkie, wszystkie na rodeo!
            </p>
          </div>
          <ChevronRight size={16} className="ml-auto text-text-muted" />
        </motion.button>
      </div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-text-muted text-sm"
      >
        <ArrowLeft size={14} />
        Powrót
      </button>
    </div>
  );
}

// ─── Team picker ──────────────────────────────────────────────────────────────

function TeamPicker({
  teams,
  newTeamName,
  onNewTeamNameChange,
  onJoinTeam,
  onCreateTeam,
  onBack,
  loading,
}: {
  teams: LiveTeam[];
  newTeamName: string;
  onNewTeamNameChange: (v: string) => void;
  onJoinTeam: (id: string, name: string) => void;
  onCreateTeam: () => void;
  onBack: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="text-center">
        <span className="text-4xl">🏇</span>
        <h2
          className="text-3xl tracking-widest mt-2"
          style={{
            fontFamily: "'Bebas Neue',cursive",
            color: "var(--neon-pink)",
          }}
        >
          Pick Your Posse
        </h2>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <p className="text-[10px] uppercase tracking-widest text-text-muted font-semibold">
          Live teams
        </p>
        <AnimatePresence>
          {teams.length === 0 && (
            <p className="text-text-muted text-xs text-center py-3 opacity-60">
              No teams yet 🤠
            </p>
          )}
          {teams.map((t) => (
            <motion.button
              key={t.teamId}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onJoinTeam(t.teamId, t.teamName)}
              className="flex items-center gap-3 p-4 rounded-xl border text-left"
              style={{
                borderColor: `${t.color}60`,
                backgroundColor: `${t.color}0f`,
              }}
            >
              <span className="text-xl">{t.emoji}</span>
              <div className="flex-1">
                <p className="font-bold text-sm" style={{ color: t.color }}>
                  {t.teamName}
                </p>
                <p className="text-[10px] text-text-muted">
                  {t.memberCount} member{t.memberCount !== 1 ? "s" : ""}
                </p>
              </div>
              <span className="text-xs text-text-muted">Join →</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <p className="text-[10px] uppercase tracking-widest text-text-muted font-semibold">
          Create new team
        </p>
        <div className="flex gap-2">
          <input
            id="new-team-name-input"
            type="text"
            value={newTeamName}
            onChange={(e) => onNewTeamNameChange(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && newTeamName.trim() && onCreateTeam()
            }
            maxLength={20}
            placeholder="Team name…"
            className="flex-1 bg-saloon-surface border border-saloon-border rounded-xl px-3 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          <motion.button
            id="create-team-btn"
            disabled={!newTeamName.trim() || loading}
            whileTap={{ scale: 0.93 }}
            onClick={onCreateTeam}
            className="w-12 h-12 flex items-center justify-center rounded-xl border border-neon-pink bg-neon-pink-dim disabled:opacity-30"
          >
            {loading ? (
              <Loader2
                size={16}
                className="animate-spin"
                style={{ color: "var(--neon-pink)" }}
              />
            ) : (
              <UserPlus size={16} style={{ color: "var(--neon-pink)" }} />
            )}
          </motion.button>
        </div>
      </div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-text-muted text-sm"
      >
        <ArrowLeft size={14} />
        Back
      </button>
    </div>
  );
}

// ─── Waiting for host ─────────────────────────────────────────────────────────

function WaitingState({
  playerName,
  teamName,
  avatar,
}: {
  playerName: string;
  teamName: string | null;
  avatar: string;
}) {
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
        style={{
          backgroundColor: "rgba(16,185,129,0.15)",
          border: "2px solid #10b981",
        }}
      >
        {avatar}
      </motion.div>
      <div>
        <h2
          className="text-4xl tracking-widest"
          style={{
            fontFamily: "'Bebas Neue',cursive",
            color: "var(--sheriff-gold)",
          }}
        >
          Zaczynamy!
        </h2>
        <p className="text-text-muted text-sm mt-1">
          Witaj,{" "}
          <span className="text-text-primary font-bold">{playerName}</span>!
        </p>
        {teamName && (
          <p className="text-xs mt-1" style={{ color: "var(--neon-pink)" }}>
            Gang: {teamName}
          </p>
        )}
      </div>
      <div className="bg-saloon-surface border border-saloon-border rounded-2xl px-6 py-5 w-full max-w-xs flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "var(--neon-pink)" }}
              animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.4, delay: i * 0.25, repeat: Infinity }}
            />
          ))}
        </div>
        <p className="text-text-muted text-sm font-medium">
          Czekaj aż host zacznie grę.
        </p>
        <p className="text-[10px] text-text-muted opacity-50">
          Ekran zaktualizuje się automatycznie
        </p>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function JoinGameForm() {
  const [step, setStep] = useState<Step>("pin");
  const [pin, setPin] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveTeams, setLiveTeams] = useState<LiveTeam[]>([]);
  const [playerInfo, setPlayerInfo] = useState<PlayerInfo | null>(null);

  // When game starts, we store the initial card so PlayerGameScreen can render
  const [gameStartData, setGameStartData] = useState<GameStartedPayload | null>(
    null,
  );

  // Subscribe to channel as soon as we have a PIN and are in team or waiting step
  const shouldSubscribe =
    step === "team" || step === "waiting" || step === "playing";

  useGameSocket(shouldSubscribe ? pin : null, {
    onTeamCreated: useCallback(
      (d: TeamCreatedPayload) =>
        setLiveTeams((p) =>
          p.some((t) => t.teamId === d.teamId)
            ? p
            : [...p, { ...d, memberCount: 1 }],
        ),
      [],
    ),
    onTeamUpdated: useCallback(
      (d: import("@/lib/pusher-server").TeamUpdatedPayload) =>
        setLiveTeams((p) =>
          p.map((t) =>
            t.teamId === d.teamId ? { ...t, memberCount: d.memberCount } : t,
          ),
        ),
      [],
    ),
    // ⬇️  THIS is the key fix — transitions player to active game
    onGameStarted: useCallback((d: GameStartedPayload) => {
      setGameStartData(d);
      setStep("playing");
    }, []),
  });

  // ── Step handlers ──────────────────────────────────────────────────────────

  const handlePinSubmit = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/sessions/${pin}`);
      if (!res.ok) throw new Error();
      setStep("name");
    } catch {
      setError("That PIN doesn't exist. Try again!");
    } finally {
      setLoading(false);
    }
  }, [pin]);

  const doJoin = useCallback(
    async (teamId: string | null, teamName: string | null) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/sessions/${pin}/join`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerName, teamId, newTeamName: teamName }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setPlayerInfo({
          playerId: data.playerId,
          avatar: data.avatar,
          teamId: data.teamId,
          teamName,
        });
        setStep("waiting");
      } catch {
        setError("Could not join. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [pin, playerName],
  );

  // ── Playing: hand off to PlayerGameScreen ─────────────────────────────────

  if (step === "playing" && gameStartData && playerInfo) {
    return (
      <PlayerGameScreen
        pin={pin}
        playerId={playerInfo.playerId}
        playerName={playerName}
        teamId={playerInfo.teamId}
        teamName={playerInfo.teamName}
        avatar={playerInfo.avatar}
        initialCard={gameStartData.card}
        initialCardIndex={gameStartData.cardIndex}
      />
    );
  }

  // ── Join / waiting flow ───────────────────────────────────────────────────

  return (
    <div className="w-full h-dvh flex flex-col items-center justify-center px-6 bg-saloon-dark overflow-hidden">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-[-15%] right-[-10%] w-[40vw] h-[40vw] rounded-full opacity-[0.06]"
          style={{
            background:
              "radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <AnimatePresence mode="wait">
          {step === "pin" && (
            <motion.div
              key="pin"
              variants={slide}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <PinInput
                value={pin}
                onChange={setPin}
                onSubmit={handlePinSubmit}
                loading={loading}
                error={error}
              />
            </motion.div>
          )}
          {step === "name" && (
            <motion.div
              key="name"
              variants={slide}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <NameInput
                value={playerName}
                onChange={setPlayerName}
                onSubmit={() => setStep("mode")}
                onBack={() => setStep("pin")}
              />
            </motion.div>
          )}
          {step === "mode" && (
            <motion.div
              key="mode"
              variants={slide}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <ModeSelector
                onSolo={() => doJoin(null, null)}
                onTeam={() => setStep("team")}
                onBack={() => setStep("name")}
              />
            </motion.div>
          )}
          {step === "team" && (
            <motion.div
              key="team"
              variants={slide}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <TeamPicker
                teams={liveTeams}
                newTeamName={newTeamName}
                onNewTeamNameChange={setNewTeamName}
                onJoinTeam={(id, name) => doJoin(id, name)}
                onCreateTeam={() => doJoin(null, newTeamName.trim())}
                onBack={() => setStep("mode")}
                loading={loading}
              />
            </motion.div>
          )}
          {step === "waiting" && playerInfo && (
            <motion.div
              key="waiting"
              variants={slide}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.25 }}
            >
              <WaitingState
                playerName={playerName}
                teamName={playerInfo.teamName}
                avatar={playerInfo.avatar}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {error && step !== "pin" && (
          <p className="text-center text-red-400 text-xs mt-4">{error}</p>
        )}
      </div>
    </div>
  );
}
