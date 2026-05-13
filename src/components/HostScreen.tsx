"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Eye,
  ChevronRight,
  Star,
  Users,
  Zap,
  Check,
  Menu,
  X,
  Flag,
} from "lucide-react";
import { useGameSocket } from "@/hooks/useGameSocket";
import { GameCardStack } from "@/components/SharedCard";
import type {
  PlayerJoinedPayload,
  VoteCastPayload,
  VotesRevealedPayload,
  NextCardPayload,
} from "@/lib/pusher-server";
import type { GameCard } from "@/lib/store";

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
  teamId: string;
  teamName: string;
  score: number;
  playerName: string;
}
type HostPhase = "lobby" | "active" | "reveal" | "finished";
interface HostScreenProps {
  pin: string;
  initialCards: GameCard[];
  gameMode?: string;
}

const ACCENT: Record<string, string> = {
  trivia: "#8b2be2",
  QUIZ: "#8b2be2",
  charades: "#1e90ff",
  action: "#f59e0b",
  dare: "#ff10f0",
};

// ─── Active game view ──────────────────────────────────────────────────────────

function ActiveCardView({
  card,
  cardIndex,
  totalCards,
  players,
  votes,
  onReveal,
  onNext,
  isRevealed,
  revealedVotes,
  scores,
}: {
  card: GameCard;
  cardIndex: number;
  totalCards: number;
  players: LivePlayer[];
  votes: VoteCastPayload[];
  onReveal: () => void;
  onNext: () => void;
  isRevealed: boolean;
  revealedVotes: VoteRecord[];
  scores: ScoreEntry[];
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = useCallback(() => setIsFlipped(true), []);

  return (
    <div className="flex flex-col justify-center items-center gap-6 w-full max-w-2xl mx-auto">
      {/* Card stack — centred */}
      <GameCardStack
        card={card}
        cardsLeft={totalCards - cardIndex}
        isFlipped={isFlipped}
        isRevealed={isRevealed}
        onFlip={handleFlip}
      />

      {/* Avatar vote grid */}
      <div className="flex flex-wrap gap-3 justify-center max-w-sm">
        {players.map((p) => {
          const hasVoted = votes.some((v) => v.playerId === p.playerId);
          return (
            <div
              key={p.playerId}
              className="relative flex flex-col items-center gap-1"
            >
              <motion.div
                animate={{
                  borderColor: hasVoted
                    ? "var(--neon-pink)"
                    : "var(--saloon-border)",
                  backgroundColor: hasVoted
                    ? "rgba(255,16,240,0.12)"
                    : "rgba(255,220,180,0.07)",
                }}
                transition={{ duration: 0.3 }}
                className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl"
              >
                {p.avatar}
              </motion.div>
              <AnimatePresence>
                {hasVoted && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: "var(--neon-pink)",
                      boxShadow: "0 0 8px rgba(255,16,240,0.7)",
                    }}
                  >
                    <Check size={11} color="white" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Revealed results */}
      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm flex flex-col gap-2"
        >
          <p className="text-center text-xs uppercase tracking-widest text-text-muted font-semibold">
            Wyniki
          </p>
          {revealedVotes.map((v, i) => (
            <motion.div
              key={v.playerId}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3 p-3 rounded-xl border"
              style={{
                borderColor: "var(--saloon-border)",
                backgroundColor: "var(--saloon-surface)",
              }}
            >
              <span className="flex-1 font-semibold text-sm text-text-primary">
                {v.teamName ?? v.playerName}
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor:
                    v.answerIndex >= 0
                      ? isRevealed &&
                        card.options?.[v.answerIndex] === card.answer
                        ? "rgba(16,185,129,0.15)"
                        : isRevealed
                          ? "rgba(239,68,68,0.15)"
                          : "rgba(255,16,240,0.15)"
                      : v.answerIndex === -1
                        ? "rgba(16,185,129,0.15)"
                        : "rgba(239,68,68,0.15)",
                  color:
                    v.answerIndex >= 0
                      ? isRevealed &&
                        card.options?.[v.answerIndex] === card.answer
                        ? "#10b981"
                        : isRevealed
                          ? "#ef4444"
                          : "var(--neon-pink)"
                      : v.answerIndex === -1
                        ? "#10b981"
                        : "#ef4444",
                }}
              >
                {v.answerText}
              </span>
            </motion.div>
          ))}
          {scores.length > 0 && (
            <div className="mt-1 pt-3 border-t border-saloon-border flex flex-col gap-1.5">
              <p className="text-[10px] uppercase tracking-widest text-text-muted font-bold flex items-center gap-1.5 mb-1">
                <Star
                  size={10}
                  fill="var(--sheriff-gold)"
                  style={{ color: "var(--sheriff-gold)" }}
                />{" "}
                Ranking
              </p>
              {[...scores]
                .sort((a, b) => b.score - a.score)
                .map((s, i) => (
                  <div
                    key={s.teamId}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="w-4 text-center font-bold text-text-muted text-[10px]">
                      {i + 1}
                    </span>
                    <span className="flex-1 font-semibold text-text-primary text-xs truncate">
                      {s.teamName ?? s.playerName}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star
                        size={10}
                        fill="var(--sheriff-gold)"
                        style={{ color: "var(--sheriff-gold)" }}
                      />
                      <span
                        className="font-bold text-xs"
                        style={{ color: "var(--sheriff-gold)" }}
                      >
                        {s.score}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Host controls */}
      <div className="flex gap-3">
        {!isRevealed ? (
          <motion.button
            id="reveal-votes-btn"
            whileTap={{ scale: 0.97 }}
            onClick={onReveal}
            disabled={!isFlipped || votes.length < players.length}
            className="relative overflow-hidden group flex items-center gap-2 px-8 py-4 rounded-2xl font-bold border-2 disabled:opacity-30 flex-col"
            style={{
              borderColor: "var(--sheriff-gold)",
              backgroundColor: "rgba(249,74,255,0.08)",
              color: "var(--sheriff-gold)",
              fontFamily: "'Bebas Neue',cursive",
              letterSpacing: "0.12em",
              fontSize: "1.1rem",
              boxShadow: "0 0 20px rgba(249,74,255,0.2)",
            }}
          >
            <span className="relative z-10">Pokaż odpowiedź kowboju</span>
            {isFlipped && votes.length < players.length && (
              <span
                className="text-[10px] tracking-widest font-semibold opacity-70 normal-case"
                style={{ fontFamily: "inherit", letterSpacing: "0.05em" }}
              >
                czeka na {players.length - votes.length}{" "}
                {players.length - votes.length === 1 ? "głos" : "głosy"}
              </span>
            )}
          </motion.button>
        ) : (
          <motion.button
            id="next-card-btn"
            whileTap={{ scale: 0.97 }}
            onClick={onNext}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white"
            style={{
              background: "linear-gradient(135deg,var(--neon-pink),#c800c8)",
              fontFamily: "'Bebas Neue',cursive",
              letterSpacing: "0.1em",
              fontSize: "1.1rem",
            }}
          >
            Kolejna dzika karta <ChevronRight size={18} />
          </motion.button>
        )}
      </div>
    </div>
  );
}

// ─── Lobby ─────────────────────────────────────────────────────────────────────

function LobbyView({
  pin,
  players,
  onStart,
}: {
  pin: string;
  players: LivePlayer[];
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

      {/* PIN */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-xs uppercase tracking-widest font-semibold text-text-muted">
          KOD SZERYFA
        </p>
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
          <span className="text-text-primary font-bold">
            lastrodeoandzeliki.pl/join
          </span>
        </p>
      </div>

      {/* Players */}
      <div className="w-full">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Users size={14} style={{ color: "var(--sheriff-gold)" }} />
          <span
            className="text-xs uppercase tracking-widest font-semibold"
            style={{ color: "var(--sheriff-gold)" }}
          >
            {players.length} {players.length === 1 ? "cowgirl" : "cowgirls"} w
            salonie
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
                  borderColor: p.teamId
                    ? "var(--neon-pink)"
                    : "var(--saloon-border)",
                  backgroundColor: p.teamId
                    ? "rgba(255,16,240,0.08)"
                    : "var(--saloon-surface)",
                }}
              >
                <span className="text-lg">{p.avatar}</span>
                <div>
                  <p className="text-sm font-bold text-text-primary leading-snug">
                    {p.playerName}
                  </p>
                  {p.teamName && (
                    <p
                      className="text-[10px] mt-0.5"
                      style={{ color: "var(--neon-pink)" }}
                    >
                      {p.teamName}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {players.length === 0 && (
            <p className="text-text-muted text-sm opacity-50">
              Oczekuję na kowbojki ...
            </p>
          )}
        </div>
      </div>

      <motion.button
        id="host-start-btn"
        disabled={players.length < 1}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="flex items-center gap-3 px-10 py-5 rounded-2xl font-bold text-white text-xl disabled:opacity-30"
        style={{
          background: "linear-gradient(135deg,var(--neon-pink),#c800c8)",
          boxShadow: "0 4px 40px rgba(255,16,240,0.5)",
          fontFamily: "'Bebas Neue',cursive",
          letterSpacing: "0.15em",
        }}
      >
        <Play size={22} /> Rozpocznij grę
      </motion.button>
    </div>
  );
}

// ─── Main HostScreen ──────────────────────────────────────────────────────────

export default function HostScreen({
  pin,
  initialCards,
  gameMode = "classic",
}: HostScreenProps) {
  const [phase, setPhase] = useState<HostPhase>("lobby");
  const [players, setPlayers] = useState<LivePlayer[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [currentVotes, setCurrentVotes] = useState<VoteCastPayload[]>([]);
  const [isRevealed, setIsRevealed] = useState(false);
  const [revealedVotes, setRevealedVotes] = useState<VoteRecord[]>([]);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const currentCard = initialCards[cardIndex];

  // Pre-populate state from Redis on mount (handles refresh + Pusher timing gaps).
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

  // Poll Redis every 3s while in lobby — fallback for missed Pusher events.
  useEffect(() => {
    if (phase !== "lobby") return;
    const id = setInterval(() => {
      fetch(`/api/sessions/${pin}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!data?.players) return;
          setPlayers((prev) => {
            const existing = new Set(prev.map((p) => p.playerId));
            const merged = [
              ...prev,
              ...data.players.filter(
                (p: { playerId: string }) => !existing.has(p.playerId),
              ),
            ];
            return merged.length !== prev.length ? merged : prev;
          });
        })
        .catch(() => {});
    }, 3000);
    return () => clearInterval(id);
  }, [phase, pin]);

  // Poll Redis every 3s during active phase — fallback for missed vote-cast events.
  useEffect(() => {
    if (phase !== "active" && phase !== "reveal") return;
    const id = setInterval(() => {
      fetch(`/api/sessions/${pin}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!data?.votes) return;
          setCardIndex((ci) => {
            const votesForCard = (
              data.votes as Array<{ playerId: string; cardIndex: number }>
            ).filter((v) => v.cardIndex === ci);
            setCurrentVotes((prev) => {
              const existing = new Set(prev.map((v) => v.playerId));
              const incoming = votesForCard.filter(
                (v) => !existing.has(v.playerId),
              );
              return incoming.length
                ? ([...prev, ...incoming] as typeof prev)
                : prev;
            });
            return ci; // don't change cardIndex
          });
        })
        .catch(() => {});
    }, 3000);
    return () => clearInterval(id);
  }, [phase, pin]);

  useGameSocket(pin, {
    onPlayerJoined: useCallback((d: PlayerJoinedPayload) => {
      setPlayers((p) =>
        p.some((x) => x.playerId === d.playerId) ? p : [...p, d],
      );
    }, []),
    onVoteCast: useCallback((d: VoteCastPayload) => {
      setCurrentVotes((p) =>
        p.some((x) => x.playerId === d.playerId) ? p : [...p, d],
      );
    }, []),
    onVotesRevealed: useCallback((d: VotesRevealedPayload) => {
      setRevealedVotes(d.votes);
      setScores(d.scores);
      setIsRevealed(true);
    }, []),
    onNextCard: useCallback((d: NextCardPayload) => {
      setCardIndex(d.cardIndex);
      setCurrentVotes([]);
      setIsRevealed(false);
      setRevealedVotes([]);
    }, []),
    onGameStarted: useCallback(() => setPhase("active"), []),
    onGameFinished: useCallback(() => setPhase("finished"), []),
  });

  const handleStart = useCallback(async () => {
    const firstCard = initialCards[0];
    if (!firstCard) return;
    await fetch(`/api/sessions/${pin}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "start", card: firstCard }),
    });
    setPhase("active");
  }, [pin, initialCards]);

  const handleReveal = useCallback(async () => {
    const card = initialCards[cardIndex];
    const votes: VoteRecord[] = currentVotes.map((v) => ({ ...v }));

    // Calculate new scores
    let updatedScores = [...scores];
    if (card.type === "QUIZ" && card.answer) {
      votes.forEach((v) => {
        const isCorrect = card.options?.[v.answerIndex] === card.answer;
        if (isCorrect) {
          const id = v.teamId || v.playerId;
          const name = v.teamName || v.playerName;
          const teamIdx = updatedScores.findIndex((s) => s.teamId === id);
          if (teamIdx > -1) {
            updatedScores[teamIdx] = {
              ...updatedScores[teamIdx],
              score: updatedScores[teamIdx].score + 1,
            };
          } else {
            updatedScores.push({
              teamId: id,
              teamName: name,
              score: 1,
              playerName: v.playerName,
            });
          }
        }
      });
    }

    await fetch(`/api/sessions/${pin}/reveal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardIndex, votes, scores: updatedScores }),
    });
    setIsRevealed(true);
    setRevealedVotes(votes);
    setScores(updatedScores);
  }, [pin, cardIndex, currentVotes, scores, initialCards]);

  const handleForceFinish = useCallback(async () => {
    setMenuOpen(false);
    setPhase("finished");
    try {
      await fetch(`/api/sessions/${pin}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "finish", scores }),
      });
    } catch (err) {
      console.error("[handleForceFinish]", err);
    }
  }, [pin, scores]);

  const handleNextCard = useCallback(async () => {
    const next = cardIndex + 1;
    if (next >= initialCards.length) {
      await fetch(`/api/sessions/${pin}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "finish", scores }),
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
  }, [pin, cardIndex, initialCards, scores]);

  return (
    <div className="w-full min-h-dvh flex flex-col">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-[-20%] left-[-15%] w-[60vw] h-[60vw] rounded-full opacity-[0.06]"
          style={{
            background:
              "radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute bottom-[-20%] right-[-15%] w-[60vw] h-[60vw] rounded-full opacity-[0.06]"
          style={{
            background:
              "radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Header */}
      <div
        className="relative z-20 shrink-0 border-b"
        style={{ borderColor: "rgba(255,220,180,0.1)" }}
      >
        <div className="max-w-5xl mx-auto grid grid-cols-3 items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <Zap size={14} style={{ color: "var(--neon-pink)" }} />
            <span className="text-xs uppercase tracking-widest font-semibold text-text-muted">
              PIN: <span className="text-text-primary">{pin}</span>
            </span>
          </div>

          {/* Centre — card type + counter during game */}
          <div className="flex justify-center items-center gap-2">
            {(phase === "active" || phase === "reveal") && currentCard && (
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
            {/* Vote count */}
            {(phase === "active" || phase === "reveal") && (
              <span className="text-xs font-semibold text-text-muted tabular-nums">
                <span className="text-text-primary">{currentVotes.length}</span>
                {" / "}
                <span className="text-text-primary">{players.length}</span>
                {" głosów"}
              </span>
            )}
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--neon-pink)" }}
              />
              <span className="text-xs text-text-muted font-bold tracking-tighter">
                LIVE
              </span>
            </div>

            {/* Hamburger menu */}
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
                    style={{
                      borderColor: "rgba(255,220,180,0.15)",
                      backgroundColor: "rgba(13,8,24,0.95)",
                      backdropFilter: "blur(16px)",
                    }}
                  >
                    {phase !== "finished" ? (
                      <button
                        onClick={handleForceFinish}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left transition-colors"
                        style={{ color: "#ef4444" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "rgba(239,68,68,0.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <Flag size={14} />
                        Zakończ grę
                      </button>
                    ) : (
                      <p className="px-4 py-3 text-xs text-text-muted">
                        Gra zakończona
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Main — centred, max-width */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {phase === "lobby" && (
              <motion.div
                key="lobby"
                className="w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <LobbyView pin={pin} players={players} onStart={handleStart} />
              </motion.div>
            )}

            {(phase === "active" || phase === "reveal") && currentCard && (
              <motion.div
                key={`card-${cardIndex}`}
                className="w-full"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
              >
                <ActiveCardView
                  card={currentCard}
                  cardIndex={cardIndex}
                  totalCards={initialCards.length}
                  players={players}
                  votes={currentVotes}
                  onReveal={handleReveal}
                  onNext={handleNextCard}
                  isRevealed={isRevealed}
                  revealedVotes={revealedVotes}
                  scores={scores}
                />
              </motion.div>
            )}

            {phase === "finished" && (
              <motion.div
                key="finished"
                className="flex flex-col items-center gap-6 text-center w-full max-w-md mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2
                  className="text-5xl sm:text-7xl shimmer-text"
                  style={{ fontFamily: "'Bebas Neue',cursive" }}
                >
                  Game Over, Cowgirls!
                </h2>
                <div className="flex flex-col gap-3 w-full">
                  {[...scores]
                    .sort((a, b) => b.score - a.score)
                    .map((s, i) => (
                      <motion.div
                        key={s.teamId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-3 p-4 rounded-xl border border-saloon-border bg-saloon-surface"
                      >
                        <span className="text-xl">
                          {["🥇", "🥈", "🥉"][i] ?? "🎖️"}
                        </span>
                        <span className="flex-1 font-bold text-text-primary">
                          {s.teamName}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star
                            size={13}
                            fill="var(--sheriff-gold)"
                            style={{ color: "var(--sheriff-gold)" }}
                          />
                          <span
                            className="font-bold"
                            style={{ color: "var(--sheriff-gold)" }}
                          >
                            {s.score}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                </div>
                <motion.a
                  href="/"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-2 flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white"
                  style={{
                    background:
                      "linear-gradient(135deg,var(--neon-pink),#c800c8)",
                    fontFamily: "'Bebas Neue',cursive",
                    letterSpacing: "0.12em",
                    fontSize: "1.1rem",
                    boxShadow: "0 4px 32px rgba(255,16,240,0.4)",
                  }}
                >
                  Wróć do menu głównego
                </motion.a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
