"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { useBackButton } from "@/lib/back-button-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Star,
  Users,
  Zap,
  Check,
  Menu,
  X,
  Flag,
  Dices,
  ChevronRight,
} from "lucide-react";
import { useRealtimeGame as useGameSocket } from "@/hooks/useRealtimeGame";
import { GameCardStack } from "@/components/SharedCard";
import { GameSummary } from "@/components/GameSummary";
import type {
  PlayerJoinedPayload,
  PlayerLeftPayload,
  VoteCastPayload,
  VotesRevealedPayload,
  NextCardPayload,
} from "@/lib/pusher-server";
import type { GameCard } from "@/lib/store";

// ─── Constants ─────────────────────────────────────────────────────────────────

const AVATAR_LIST = ["🤠", "💃", "🌸", "✨", "🍾", "🎀", "👑", "🦋", "🌺", "🎉"];

const FUNNY_NAMES = [
  "Dzika Landryna", "Szeryfowa Aneta", "Różowa Pantera", "Kowbojka Kasia",
  "Pijana Pszczółka", "Gwiazda Szeryfa", "Neonowa Klacz", "Złota Ostroga",
  "Buntowniczka", "Saloonowa Królowa", "Whiskey Lady", "Galopująca Gazela",
  "Szalona Ruda", "Ostra Tequila", "Złota Gwiazda", "Różowy Dynamit",
];

// ─── Types ─────────────────────────────────────────────────────────────────────

interface LivePlayer {
  playerId: string;
  playerName: string;
  avatar: string;
  teamId: string | null;
  teamName: string | null;
}
interface VoteRecord {
  playerId: string;
  playerName: string;
  teamId: string | null;
  teamName: string | null;
  answerIndex: number;
  answerText: string;
}
interface ScoreEntry {
  playerId: string;
  playerName: string;
  score: number;
  drinks?: number;
  playerTeamId?: string;
  playerTeamName?: string;
}
interface TeamScoreEntry {
  teamId: string;
  teamName: string;
  score: number;
}

function computeTeamScores(scores: ScoreEntry[]): TeamScoreEntry[] {
  const map = new Map<string, TeamScoreEntry>();
  scores.forEach((s) => {
    if (!s.playerTeamId || !s.playerTeamName) return;
    const existing = map.get(s.playerTeamId);
    if (existing) existing.score += s.score;
    else map.set(s.playerTeamId, { teamId: s.playerTeamId, teamName: s.playerTeamName, score: s.score });
  });
  return Array.from(map.values());
}

type HostPhase = "setup" | "lobby" | "active" | "finished";

interface HostScreenProps {
  pin: string;
  initialCards: GameCard[];
  gameMode?: string;
}

const ACCENT: Record<string, string> = {
  trivia: "#8b2be2",
  QUIZ: "#8b2be2",
  NEVER: "#FFD700",
  charades: "#1e90ff",
  action: "#f59e0b",
  dare: "#ff10f0",
};

// ─── Setup view (host picks name + avatar before joining) ──────────────────────

function SetupView({
  name,
  onNameChange,
  avatar,
  onAvatarChange,
  onContinue,
}: {
  name: string;
  onNameChange: (v: string) => void;
  avatar: string | null;
  onAvatarChange: (v: string) => void;
  onContinue: () => void;
}) {
  const [placeholder] = useState(
    () => `np. ${FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)]}`
  );

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto">
      <div className="text-center">
        <h1
          className="text-5xl tracking-widest shimmer-text"
          style={{ fontFamily: "'Bebas Neue',cursive" }}
        >
          last rodeo andżeliki
        </h1>
        <p className="text-text-muted text-xs uppercase tracking-widest mt-1">
          Najpierw wybierz swój awatar
        </p>
      </div>

      {/* Avatar picker */}
      <div className="w-full">
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-3 text-center text-text-muted">
          Wybierz awatar
        </p>
        <div className="grid grid-cols-5 gap-2">
          {AVATAR_LIST.map((emoji) => (
            <motion.button
              key={emoji}
              whileTap={{ scale: 0.88 }}
              onClick={() => onAvatarChange(emoji)}
              className="h-12 rounded-xl text-2xl flex items-center justify-center border-2 transition-colors"
              style={{
                borderColor: avatar === emoji ? "var(--neon-pink)" : "var(--saloon-border)",
                backgroundColor: avatar === emoji ? "rgba(255,16,240,0.15)" : "var(--saloon-surface)",
                boxShadow: avatar === emoji ? "0 0 12px rgba(255,16,240,0.3)" : "none",
              }}
            >
              {emoji}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Name input */}
      <div className="flex gap-2 w-full">
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name.trim() && avatar && onContinue()}
          maxLength={20}
          autoFocus
          placeholder={placeholder}
          className="flex-1 bg-saloon-surface border-2 rounded-xl px-4 py-4 text-center text-lg font-bold text-text-primary placeholder:text-text-muted focus:outline-none transition-colors"
          style={{ borderColor: name.trim() ? "var(--neon-pink)" : "var(--saloon-border)" }}
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onNameChange(FUNNY_NAMES[Math.floor(Math.random() * FUNNY_NAMES.length)])}
          className="px-4 rounded-xl border-2 flex items-center justify-center bg-saloon-surface"
          style={{ borderColor: "var(--saloon-border)" }}
          title="Losuj imię"
        >
          <Dices size={22} className="text-text-muted" />
        </motion.button>
      </div>

      <motion.button
        disabled={!name.trim() || !avatar}
        whileTap={{ scale: 0.97 }}
        onClick={onContinue}
        className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white disabled:opacity-30"
        style={{
          background: "linear-gradient(135deg,var(--neon-pink),#c800c8)",
          fontFamily: "'Bebas Neue',cursive",
          fontSize: "1.1rem",
          letterSpacing: "0.1em",
          boxShadow: "0 4px 30px rgba(255,16,240,0.4)",
        }}
      >
        Dalej <ChevronRight size={18} />
      </motion.button>
    </div>
  );
}

// ─── Lobby ─────────────────────────────────────────────────────────────────────

function LobbyView({
  pin,
  players,
  hostAvatar,
  hostName,
  onStart,
}: {
  pin: string;
  players: LivePlayer[];
  hostAvatar: string;
  hostName: string;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto">
      <div className="text-center">
        <h1
          className="text-6xl sm:text-8xl tracking-widest shimmer-text mt-2"
          style={{ fontFamily: "'Bebas Neue',cursive" }}
        >
          last rodeo andżeliki
        </h1>
      </div>

      {/* Host identity */}
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border"
        style={{ borderColor: "var(--sheriff-gold)", backgroundColor: "rgba(255,215,0,0.07)" }}
      >
        <span className="text-2xl">{hostAvatar}</span>
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold text-text-muted">Ty (organizator)</p>
          <p className="font-bold text-text-primary">{hostName}</p>
        </div>
      </div>

      {/* PIN */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs uppercase tracking-widest font-semibold text-text-muted">KOD GRY</p>
        <div className="flex gap-3">
          {pin.split("").map((d, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
              className="w-20 h-24 sm:w-28 sm:h-32 rounded-2xl border-2 flex items-center justify-center text-5xl sm:text-6xl font-bold pulse-pink"
              style={{
                fontFamily: "'Bebas Neue',cursive",
                color: "var(--neon-pink)",
                borderColor: "var(--neon-pink)",
                backgroundColor: "rgba(255,16,240,0.07)",
              }}
            >
              {d}
            </motion.div>
          ))}
        </div>
        <p className="text-text-muted text-xs">
          Gracze wchodzą na{" "}
          <span className="text-text-primary font-bold">lastrodeoandzeliki.pl/join</span>
        </p>
      </div>

      {/* Players */}
      <div className="w-full">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Users size={14} style={{ color: "var(--sheriff-gold)" }} />
          <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--sheriff-gold)" }}>
            {players.length} {players.length === 1 ? "cowgirl" : "cowgirls"} w salonie
          </span>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <AnimatePresence>
            {players.map((p) => (
              <motion.div
                key={p.playerId}
                layout
                initial={{ opacity: 0, scale: 0.6, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 280, damping: 22 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full border"
                style={{
                  borderColor: p.teamId ? "var(--neon-pink)" : "var(--saloon-border)",
                  backgroundColor: p.teamId ? "rgba(255,16,240,0.08)" : "var(--saloon-surface)",
                }}
              >
                <span className="text-lg">{p.avatar}</span>
                <p className="text-sm font-bold text-text-primary leading-snug">{p.playerName}</p>
              </motion.div>
            ))}
          </AnimatePresence>
          {players.length === 0 && (
            <p className="text-text-muted text-sm opacity-50">Oczekuję na kowbojki …</p>
          )}
        </div>
      </div>

      <motion.button
        id="host-start-btn"
        disabled={players.length < 1}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="flex items-center gap-3 px-10 py-5 rounded-2xl text-white disabled:opacity-30"
        style={{
          background: "linear-gradient(135deg,var(--neon-pink),#c800c8)",
          boxShadow: "0 4px 40px rgba(255,16,240,0.5)",
          fontFamily: "'Bebas Neue',cursive",
          fontSize: "1.15rem",
          letterSpacing: "0.15em",
        }}
      >
        <Play size={22} /> Rozpocznij grę
      </motion.button>
    </div>
  );
}

// ─── Active game view ──────────────────────────────────────────────────────────

function ActiveCardView({
  card,
  cardIndex,
  totalCards,
  players,
  votes,
  isRevealed,
  revealedVotes,
  scores,
  countdown,
  hostPlayerId,
  hostHasVoted,
  onHostVote,
  hostLoading,
}: {
  card: GameCard;
  cardIndex: number;
  totalCards: number;
  players: LivePlayer[];
  votes: VoteCastPayload[];
  isRevealed: boolean;
  revealedVotes: VoteRecord[];
  scores: ScoreEntry[];
  countdown: number | null;
  hostPlayerId: string | null;
  hostHasVoted: boolean;
  onHostVote: (answerIndex: number, answerText: string) => void;
  hostLoading: boolean;
}) {
  const hostPlayer = hostPlayerId ? players.find((p) => p.playerId === hostPlayerId) ?? null : null;

  return (
    <div className="flex flex-col justify-center items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Card — always face-up on host screen */}
      <GameCardStack
        card={card}
        cardsLeft={totalCards - cardIndex}
        isFlipped={true}
        isRevealed={isRevealed}
        onFlip={() => {}}
      />

      {/* Avatar vote grid */}
      <div className="flex flex-wrap gap-3 justify-center max-w-sm">
        {players.map((p) => {
          const hasVoted = votes.some((v) => v.playerId === p.playerId);
          const isHost = p.playerId === hostPlayerId;
          return (
            <div key={p.playerId} className="relative flex flex-col items-center gap-1">
              <motion.div
                animate={{
                  borderColor: hasVoted ? "var(--neon-pink)" : "var(--saloon-border)",
                  backgroundColor: hasVoted ? "rgba(255,16,240,0.12)" : "rgba(255,220,180,0.07)",
                }}
                transition={{ duration: 0.3 }}
                className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl"
              >
                {p.avatar}
              </motion.div>
              {isHost && (
                <span className="text-[8px] uppercase tracking-wider text-text-muted font-bold">ty</span>
              )}
              <AnimatePresence>
                {hasVoted && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--neon-pink)", boxShadow: "0 0 8px rgba(255,16,240,0.7)" }}
                  >
                    <Check size={11} color="white" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Host voting buttons */}
      <AnimatePresence>
        {hostPlayer && !isRevealed && (
          <motion.div
            key="host-vote"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full max-w-sm"
          >
            {hostHasVoted ? (
              <div
                className="flex items-center justify-center gap-2 py-3 rounded-2xl border"
                style={{ borderColor: "#10b981", backgroundColor: "rgba(16,185,129,0.08)" }}
              >
                <Check size={14} color="#10b981" />
                <span className="text-sm font-semibold" style={{ color: "#10b981" }}>
                  Twój głos zapisany
                </span>
              </div>
            ) : card.type === "NEVER" ? (
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={hostLoading}
                  onClick={() => onHostVote(-2, "🚫 Nie piję")}
                  className="flex-1 py-4 rounded-2xl border-2 font-black flex flex-col items-center justify-center gap-1 disabled:opacity-40"
                  style={{
                    borderColor: "rgba(255,220,180,0.25)",
                    backgroundColor: "rgba(255,220,180,0.06)",
                    color: "rgba(255,220,180,0.8)",
                    fontFamily: "'Bebas Neue',cursive",
                    letterSpacing: "0.08em",
                    fontSize: "0.95rem",
                  }}
                >
                  <span className="text-xl">🚫</span>
                  NIE PIJĘ
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={hostLoading}
                  onClick={() => onHostVote(-1, "🍺 Piję")}
                  className="flex-1 py-4 rounded-2xl border-2 font-black flex flex-col items-center justify-center gap-1 disabled:opacity-40"
                  style={{
                    borderColor: "var(--neon-pink)",
                    backgroundColor: "rgba(255,16,240,0.1)",
                    color: "var(--neon-pink)",
                    boxShadow: "0 0 20px rgba(255,16,240,0.2)",
                    fontFamily: "'Bebas Neue',cursive",
                    letterSpacing: "0.08em",
                    fontSize: "0.95rem",
                  }}
                >
                  <span className="text-xl">🍺</span>
                  PIJĘ
                </motion.button>
              </div>
            ) : card.options && card.options.length > 0 ? (
              <div className="flex flex-col gap-2">
                {card.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      disabled={hostLoading}
                      onClick={() => onHostVote(idx, `${letter}: ${opt}`)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-left disabled:opacity-40"
                      style={{
                        borderColor: "rgba(255,220,180,0.15)",
                        backgroundColor: "rgba(255,220,180,0.05)",
                      }}
                      whileHover={{
                        borderColor: "var(--neon-pink)",
                        backgroundColor: "rgba(255,16,240,0.08)",
                        transition: { duration: 0.15 },
                      }}
                    >
                      <span
                        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-black"
                        style={{
                          backgroundColor: "rgba(255,16,240,0.15)",
                          color: "var(--neon-pink)",
                          fontFamily: "'Bebas Neue',cursive",
                        }}
                      >
                        {letter}
                      </span>
                      <span className="text-sm font-semibold text-text-primary leading-snug">{opt}</span>
                    </motion.button>
                  );
                })}
              </div>
            ) : (
              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={hostLoading}
                  onClick={() => onHostVote(-2, "❌ Nie")}
                  className="flex-1 py-4 rounded-2xl border-2 border-red-500/40 bg-red-500/10 text-red-400 font-bold text-sm flex items-center justify-center disabled:opacity-40"
                >
                  Nie
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  disabled={hostLoading}
                  onClick={() => onHostVote(-1, "✅ Tak")}
                  className="flex-1 py-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold text-sm flex items-center justify-center disabled:opacity-40"
                >
                  Tak!
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Revealed results */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm flex flex-col gap-2"
        >
          <p className="text-center text-xs uppercase tracking-widest text-text-muted font-semibold">Wyniki</p>
          {revealedVotes.map((v, i) => {
            const isDrinking = card.type === "NEVER" && v.answerIndex === -1;
            const isNotDrinking = card.type === "NEVER" && v.answerIndex === -2;
            const isCorrect = card.type !== "NEVER" && v.answerIndex >= 0 && card.options?.[v.answerIndex] === card.answer;
            return (
              <motion.div
                key={v.playerId}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ borderColor: "var(--saloon-border)", backgroundColor: "var(--saloon-surface)" }}
              >
                <span className="flex-1 font-semibold text-sm text-text-primary">
                  {v.teamName ?? v.playerName}
                  {v.playerId === hostPlayerId && (
                    <span className="ml-1 text-[10px] text-text-muted">(ty)</span>
                  )}
                </span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: isCorrect || isDrinking ? "rgba(16,185,129,0.15)" : isNotDrinking || (card.type !== "NEVER" && !isCorrect && v.answerIndex >= 0) ? "rgba(239,68,68,0.15)" : "rgba(255,220,180,0.1)",
                    color: isCorrect || isDrinking ? "#10b981" : isNotDrinking || (card.type !== "NEVER" && !isCorrect && v.answerIndex >= 0) ? "#ef4444" : "rgba(255,220,180,0.7)",
                  }}
                >
                  {v.answerText}
                </span>
              </motion.div>
            );
          })}
          {scores.filter((s) => s.score > 0).length > 0 && (
            <div className="mt-1 pt-3 border-t border-saloon-border flex flex-col gap-1.5">
              <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold flex items-center gap-1.5 mb-1">
                <Star size={10} fill="var(--sheriff-gold)" style={{ color: "var(--sheriff-gold)" }} />
                Ranking
              </p>
              {[...scores]
                .filter((s) => s.score > 0)
                .sort((a, b) => b.score - a.score)
                .map((s, i) => (
                  <div key={s.playerId} className="flex items-center gap-2 text-sm">
                    <span className="w-4 text-center font-bold text-text-muted text-[10px]">{i + 1}</span>
                    <span className="flex-1 font-semibold text-text-primary text-xs truncate">{s.playerName}</span>
                    <div className="flex items-center gap-1">
                      <Star size={10} fill="var(--sheriff-gold)" style={{ color: "var(--sheriff-gold)" }} />
                      <span className="font-bold text-xs" style={{ color: "var(--sheriff-gold)" }}>{s.score}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Status / countdown */}
      <div className="h-8 flex items-center justify-center">
        {isRevealed && countdown !== null ? (
          <motion.p
            key={countdown}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-sm font-bold tabular-nums"
            style={{ color: "var(--neon-pink)" }}
          >
            Następna karta za {countdown}…
          </motion.p>
        ) : !isRevealed && votes.length < players.length && players.length > 0 ? (
          <p className="text-xs text-text-muted">
            Czeka na{" "}
            <span className="font-bold text-text-primary">{players.length - votes.length}</span>{" "}
            {players.length - votes.length === 1 ? "głos" : "głosy"}
          </p>
        ) : null}
      </div>
    </div>
  );
}

// ─── Main HostScreen ──────────────────────────────────────────────────────────

export default function HostScreen({
  pin,
  initialCards,
}: HostScreenProps) {
  const { setHidden: setBackHidden } = useBackButton();
  useEffect(() => {
    setBackHidden(true);
    return () => setBackHidden(false);
  }, [setBackHidden]);

  // ── Host identity ────────────────────────────────────────────────────────────
  const [hostName, setHostName] = useState("");
  const [hostAvatar, setHostAvatar] = useState<string | null>(null);
  const [hostPlayerId, setHostPlayerId] = useState<string | null>(null);
  const [hostHasVoted, setHostHasVoted] = useState(false);
  const [hostLoading, setHostLoading] = useState(false);

  // ── Game state ───────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<HostPhase>("setup");
  const [players, setPlayers] = useState<LivePlayer[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [currentVotes, setCurrentVotes] = useState<VoteCastPayload[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealedVotes, setRevealedVotes] = useState<VoteRecord[]>([]);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [teamScores, setTeamScores] = useState<TeamScoreEntry[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const currentCard = initialCards[cardIndex];

  // Hydrate from Redis on mount
  useEffect(() => {
    fetch(`/api/sessions/${pin}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.players?.length) setPlayers(data.players);
        if (data.status === "active") setPhase("active");
        if (data.status === "finished") setPhase("finished");
        if (typeof data.cardIndex === "number") setCardIndex(data.cardIndex);
      })
      .catch(() => {});
  }, [pin]);

  // Poll Redis in lobby
  useEffect(() => {
    if (phase !== "lobby") return;
    const id = setInterval(() => {
      fetch(`/api/sessions/${pin}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => { if (data?.players) setPlayers(data.players); })
        .catch(() => {});
    }, 3000);
    return () => clearInterval(id);
  }, [phase, pin]);

  // Poll Redis during active — fallback for missed votes
  useEffect(() => {
    if (phase !== "active") return;
    const id = setInterval(() => {
      fetch(`/api/sessions/${pin}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!data?.votes) return;
          setCardIndex((ci) => {
            const votesForCard = (data.votes as Array<{ playerId: string; cardIndex: number }>)
              .filter((v) => v.cardIndex === ci);
            setCurrentVotes((prev) => {
              const existing = new Set(prev.map((v) => v.playerId));
              const incoming = votesForCard.filter((v) => !existing.has(v.playerId));
              return incoming.length ? ([...prev, ...incoming] as typeof prev) : prev;
            });
            return ci;
          });
        })
        .catch(() => {});
    }, 3000);
    return () => clearInterval(id);
  }, [phase, pin]);

  useGameSocket(pin, {
    onPlayerJoined: useCallback((d: PlayerJoinedPayload) => {
      setPlayers((p) => p.some((x) => x.playerId === d.playerId) ? p : [...p, d]);
    }, []),
    onPlayerLeft: useCallback((d: PlayerLeftPayload) => {
      setPlayers((p) => p.filter((x) => x.playerId !== d.playerId));
    }, []),
    onVoteCast: useCallback((d: VoteCastPayload) => {
      setCurrentVotes((p) => p.some((x) => x.playerId === d.playerId) ? p : [...p, d]);
    }, []),
    onVotesRevealed: useCallback((d: VotesRevealedPayload) => {
      setRevealedVotes(d.votes);
      setScores(d.scores);
      setTeamScores(d.teamScores ?? []);
      setIsRevealed(true);
    }, []),
    onNextCard: useCallback((d: NextCardPayload) => {
      setCardIndex(d.cardIndex);
      setCurrentVotes([]);
      setIsRevealed(false);
      setRevealedVotes([]);
      setCountdown(null);
      setHostHasVoted(false);
    }, []),
    onGameStarted: useCallback(() => setPhase("active"), []),
    onGameFinished: useCallback(() => setPhase("finished"), []),
  });

  // ── Actions ──────────────────────────────────────────────────────────────────

  const handleSetupComplete = useCallback(() => {
    if (!hostName.trim() || !hostAvatar) return;
    setPhase("lobby");
  }, [hostName, hostAvatar]);

  const handleStart = useCallback(async () => {
    const firstCard = initialCards[0];
    if (!firstCard || !hostName.trim() || !hostAvatar) return;

    // Join host as a player first
    try {
      const res = await fetch(`/api/sessions/${pin}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerName: hostName.trim(), avatar: hostAvatar }),
      });
      if (res.ok) {
        const data = await res.json();
        setHostPlayerId(data.playerId);
        // Optimistically add host to local player list
        setPlayers((p) => {
          if (p.some((x) => x.playerId === data.playerId)) return p;
          return [...p, {
            playerId: data.playerId,
            playerName: hostName.trim(),
            avatar: hostAvatar,
            teamId: null,
            teamName: null,
          }];
        });
      }
    } catch {
      // Continue even if join fails — game still works for others
    }

    // Start the game
    await fetch(`/api/sessions/${pin}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start", card: firstCard }),
    });
    setPhase("active");
  }, [pin, initialCards, hostName, hostAvatar]);

  const handleReveal = useCallback(async () => {
    const card = initialCards[cardIndex];
    const votes: VoteRecord[] = currentVotes.map((v) => ({ ...v }));
    let updatedScores = [...scores];

    if (card.type === "QUIZ" && card.answer) {
      votes.forEach((v) => {
        const isCorrect = card.options?.[v.answerIndex] === card.answer;
        if (!isCorrect) return;
        const idx = updatedScores.findIndex((s) => s.playerId === v.playerId);
        if (idx > -1) {
          updatedScores[idx] = { ...updatedScores[idx], score: updatedScores[idx].score + 1 };
        } else {
          updatedScores.push({ playerId: v.playerId, playerName: v.playerName, score: 1, drinks: 0, playerTeamId: v.teamId ?? undefined, playerTeamName: v.teamName ?? undefined });
        }
      });
    }

    if (card.type === "NEVER") {
      votes.forEach((v) => {
        if (v.answerIndex !== -1) return;
        const idx = updatedScores.findIndex((s) => s.playerId === v.playerId);
        if (idx > -1) {
          updatedScores[idx] = { ...updatedScores[idx], drinks: (updatedScores[idx].drinks ?? 0) + 1 };
        } else {
          updatedScores.push({ playerId: v.playerId, playerName: v.playerName, score: 0, drinks: 1, playerTeamId: v.teamId ?? undefined, playerTeamName: v.teamName ?? undefined });
        }
      });
    }

    const updatedTeamScores = computeTeamScores(updatedScores);
    await fetch(`/api/sessions/${pin}/reveal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardIndex, correctAnswer: card.answer, votes, scores: updatedScores, teamScores: updatedTeamScores }),
    });
    setIsRevealed(true);
    setRevealedVotes(votes);
    setScores(updatedScores);
    setTeamScores(updatedTeamScores);
  }, [pin, cardIndex, currentVotes, scores, initialCards]);

  const handleNextCard = useCallback(async () => {
    const next = cardIndex + 1;
    if (next >= initialCards.length) {
      await fetch(`/api/sessions/${pin}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "finish", scores, teamScores }),
      });
      setPhase("finished");
      return;
    }
    await fetch(`/api/sessions/${pin}/next-card`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardIndex: next, card: initialCards[next] }),
    });
    setCardIndex(next);
    setCurrentVotes([]);
    setIsRevealed(false);
    setRevealedVotes([]);
    setCountdown(null);
    setHostHasVoted(false);
  }, [pin, cardIndex, initialCards, scores, teamScores]);

  const handleForceFinish = useCallback(async () => {
    setMenuOpen(false);
    setPhase("finished");
    try {
      await fetch(`/api/sessions/${pin}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "finish", scores, teamScores }),
      });
    } catch (err) {
      console.error("[handleForceFinish]", err);
    }
  }, [pin, scores, teamScores]);

  const handleHostVote = useCallback(async (answerIndex: number, answerText: string) => {
    if (!hostPlayerId || hostHasVoted || hostLoading) return;
    setHostLoading(true);
    try {
      await fetch(`/api/sessions/${pin}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: hostPlayerId,
          playerName: hostName,
          teamId: null,
          teamName: null,
          cardIndex,
          answerIndex,
          answerText,
        }),
      });
      setHostHasVoted(true);
    } finally {
      setHostLoading(false);
    }
  }, [hostPlayerId, hostHasVoted, hostLoading, pin, hostName, cardIndex]);

  // ── Auto-reveal when all players voted ───────────────────────────────────────

  const handleRevealRef = useRef(handleReveal);
  useEffect(() => { handleRevealRef.current = handleReveal; });

  useEffect(() => {
    if (phase !== "active" || isRevealed || players.length === 0) return;
    if (currentVotes.length < players.length) return;
    const timer = setTimeout(() => handleRevealRef.current(), 600);
    return () => clearTimeout(timer);
  }, [currentVotes.length, players.length, phase, isRevealed]);

  // ── Auto-next with countdown ──────────────────────────────────────────────────

  const handleNextCardRef = useRef(handleNextCard);
  useEffect(() => { handleNextCardRef.current = handleNextCard; });

  useEffect(() => {
    if (!isRevealed) {
      setCountdown(null);
      return;
    }
    setCountdown(4);
    let n = 4;
    const tick = setInterval(() => {
      n -= 1;
      if (n <= 0) {
        clearInterval(tick);
        setCountdown(null);
        handleNextCardRef.current();
      } else {
        setCountdown(n);
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [isRevealed, cardIndex]);

  // ── Derived ───────────────────────────────────────────────────────────────────

  const drinksScores = scores
    .filter((s) => (s.drinks ?? 0) > 0)
    .map((s) => ({ id: s.playerId, name: s.playerName, score: s.drinks! }));

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full min-h-dvh flex flex-col">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-20%] left-[-15%] w-[60vw] h-[60vw] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-[-20%] right-[-15%] w-[60vw] h-[60vw] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* Header — hidden in setup */}
      {phase !== "setup" && (
        <div className="relative z-20 shrink-0 border-b" style={{ borderColor: "rgba(255,220,180,0.1)" }}>
          <div className="max-w-5xl mx-auto grid grid-cols-3 items-center px-6 py-4">
            <div className="flex items-center gap-2">
              <Zap size={14} style={{ color: "var(--neon-pink)" }} />
              <span className="text-xs uppercase tracking-widest font-semibold text-text-muted">
                PIN: <span className="text-text-primary">{pin}</span>
              </span>
            </div>

            <div className="flex justify-center items-center gap-2">
              {phase === "active" && currentCard && (
                <>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                    style={{
                      color: ACCENT[currentCard.type] ?? "var(--neon-pink)",
                      borderColor: `${ACCENT[currentCard.type] ?? "var(--neon-pink)"}55`,
                      backgroundColor: `${ACCENT[currentCard.type] ?? "var(--neon-pink)"}15`,
                    }}
                  >
                    {currentCard.type}
                  </span>
                  <span className="text-xs font-semibold text-text-muted tabular-nums">
                    {cardIndex + 1} / {initialCards.length}
                  </span>
                </>
              )}
            </div>

            <div className="flex justify-end items-center gap-3">
              {phase === "active" && (
                <span className="text-xs font-semibold text-text-muted tabular-nums">
                  <span className="text-text-primary">{currentVotes.length}</span>
                  {" / "}
                  <span className="text-text-primary">{players.length}</span>
                  {" głosów"}
                </span>
              )}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--neon-pink)" }} />
                <span className="text-xs text-text-muted font-bold tracking-tighter">LIVE</span>
              </div>

              <div ref={menuRef} className="relative">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMenuOpen((o) => !o)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border"
                  style={{
                    borderColor: "rgba(255,220,180,0.18)",
                    backgroundColor: "rgba(255,220,180,0.05)",
                    color: "rgba(255,220,180,0.65)",
                  }}
                >
                  {menuOpen ? <X size={15} /> : <Menu size={15} />}
                </motion.button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: -6 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-10 z-[100] min-w-[180px] rounded-2xl border p-1.5 shadow-xl"
                      style={{ borderColor: "rgba(255,220,180,0.15)", backgroundColor: "rgba(13,8,24,0.95)", backdropFilter: "blur(16px)" }}
                    >
                      {phase !== "finished" ? (
                        <button
                          onClick={handleForceFinish}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left"
                          style={{ color: "#ef4444" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                          <Flag size={14} />
                          Zakończ grę
                        </button>
                      ) : (
                        <p className="px-4 py-3 text-xs text-text-muted">Gra zakończona</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {phase === "setup" && (
              <motion.div key="setup" className="w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <SetupView
                  name={hostName}
                  onNameChange={setHostName}
                  avatar={hostAvatar}
                  onAvatarChange={setHostAvatar}
                  onContinue={handleSetupComplete}
                />
              </motion.div>
            )}

            {phase === "lobby" && (
              <motion.div key="lobby" className="w-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
                <LobbyView
                  pin={pin}
                  players={players}
                  hostAvatar={hostAvatar!}
                  hostName={hostName}
                  onStart={handleStart}
                />
              </motion.div>
            )}

            {phase === "active" && currentCard && (
              <motion.div key={`card-${cardIndex}`} className="w-full" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.35 }}>
                <ActiveCardView
                  card={currentCard}
                  cardIndex={cardIndex}
                  totalCards={initialCards.length}
                  players={players}
                  votes={currentVotes}
                  isRevealed={isRevealed}
                  revealedVotes={revealedVotes}
                  scores={scores}
                  countdown={countdown}
                  hostPlayerId={hostPlayerId}
                  hostHasVoted={hostHasVoted}
                  onHostVote={handleHostVote}
                  hostLoading={hostLoading}
                />
              </motion.div>
            )}

            {phase === "finished" && (
              <motion.div key="finished" className="w-full" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <GameSummary
                  scores={scores.map((s) => ({ id: s.playerId, name: s.playerName, score: s.score }))}
                  teamScores={teamScores.length > 0 ? teamScores.map((t) => ({ id: t.teamId, name: t.teamName, score: t.score })) : undefined}
                  drinksScores={drinksScores.length > 0 ? drinksScores : undefined}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
