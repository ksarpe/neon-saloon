"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Star, Clock, Eye } from "lucide-react";
import { useGameSocket } from "@/hooks/useGameSocket";
import type {
  WireCard, VotesRevealedPayload, NextCardPayload, GameFinishedPayload,
} from "@/lib/pusher-server";

// ─── Card type colours ────────────────────────────────────────────────────────

const CARD_ACCENT: Record<string, string> = {
  trivia: "#8b2be2", charades: "#1e90ff", action: "#f59e0b", dare: "#ff10f0",
};

// ─── Waiting for next card ────────────────────────────────────────────────────

function WaitingForNextCard({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center py-10">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: "var(--neon-pink)" }}
          animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, delay: i * 0.3, repeat: Infinity }} />
      ))}
      <motion.span className="text-5xl mt-8" animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}>⏳</motion.span>
      <p className="text-text-muted text-sm font-medium">{message}</p>
    </div>
  );
}

// ─── Active card view for the PLAYER ─────────────────────────────────────────

function PlayerCardView({
  card, cardIndex, playerId, playerName, teamId, teamName, pin,
  onVoted,
}: {
  card: WireCard;
  cardIndex: number;
  playerId: string;
  playerName: string;
  teamId: string | null;
  teamName: string | null;
  pin: string;
  onVoted: () => void;
}) {
  const accent = CARD_ACCENT[card.type] ?? "var(--neon-pink)";
  const [voted, setVoted] = useState(false);
  const [loading, setLoading] = useState(false);

  const castVote = useCallback(async (answerIndex: number, answerText: string) => {
    if (voted || loading) return;
    setLoading(true);
    try {
      await fetch(`/api/sessions/${pin}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId, playerName, teamId, teamName, cardIndex, answerIndex, answerText,
        }),
      });
      setVoted(true);
      onVoted();
    } finally {
      setLoading(false);
    }
  }, [voted, loading, pin, playerId, playerName, teamId, teamName, cardIndex, onVoted]);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Card */}
      <motion.div
        key={card.id}
        initial={{ opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full rounded-2xl border-2 overflow-hidden"
        style={{ borderColor: accent, boxShadow: `0 0 30px ${accent}30` }}
      >
        <div className="h-1.5" style={{ background: `linear-gradient(90deg,${accent},${accent}60)` }} />
        <div className="p-6 flex flex-col gap-4 text-center" style={{ backgroundColor: "var(--saloon-card)" }}>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border"
            style={{ color: accent, borderColor: `${accent}60`, backgroundColor: `${accent}18` }}>
            {card.title} · {card.points} pts
          </span>
          <p className="text-xl font-bold text-text-primary leading-snug">
            {card.description}
          </p>
        </div>
      </motion.div>

      {/* Action buttons */}
      <AnimatePresence mode="wait">
        {!voted ? (
          <motion.div key="buttons"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-3">
            <p className="text-center text-xs text-text-muted uppercase tracking-widest">
              Did you complete it?
            </p>
            <div className="flex gap-3">
              <motion.button
                id="player-fail-btn"
                whileTap={{ scale: 0.96 }} disabled={loading}
                onClick={() => castVote(-2, "❌ Failed")}
                className="flex-1 py-4 rounded-2xl border-2 border-red-500/40 bg-red-500/10 text-red-400 font-bold text-sm flex items-center justify-center gap-2"
              >
                <XCircle size={18} /> Nope
              </motion.button>
              <motion.button
                id="player-done-btn"
                whileTap={{ scale: 0.96 }} disabled={loading}
                onClick={() => castVote(-1, "✅ Done")}
                className="flex-1 py-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold text-sm flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} /> Done!
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="voted"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 py-4">
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
              style={{ backgroundColor: "rgba(16,185,129,0.15)", border: "2px solid #10b981" }}>
              ✅
            </motion.div>
            <p className="text-emerald-400 font-bold text-sm">Voted! Waiting for host…</p>
            <div className="flex gap-1 mt-1">
              {[0, 1, 2].map(i => (
                <motion.span key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, delay: i * 0.25, repeat: Infinity }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Reveal view ──────────────────────────────────────────────────────────────

function RevealView({ data, playerName }: { data: VotesRevealedPayload; playerName: string }) {
  const myVote = data.votes.find(v => v.playerName === playerName);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4 w-full">
      <p className="text-center text-xs uppercase tracking-widest text-text-muted font-semibold">🎉 Results revealed!</p>

      {/* My result */}
      {myVote && (
        <div className="p-4 rounded-2xl border text-center"
          style={{
            borderColor: myVote.answerIndex >= -1 ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)",
            backgroundColor: myVote.answerIndex >= -1 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
          }}>
          <p className="text-xs text-text-muted mb-1 uppercase tracking-widest">Your answer</p>
          <p className="font-bold text-lg"
            style={{ color: myVote.answerIndex >= -1 ? "#10b981" : "#ef4444" }}>
            {myVote.answerText}
          </p>
        </div>
      )}

      {/* All players */}
      <div className="flex flex-col gap-2">
        {data.votes.map((v, i) => (
          <motion.div key={v.playerId}
            initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 p-3 rounded-xl border border-saloon-border bg-saloon-surface">
            <span className="text-sm font-semibold flex-1 text-text-primary">
              {v.teamName ?? v.playerName}
            </span>
            <span className="text-xs font-bold px-2 py-1 rounded-full"
              style={{
                backgroundColor: v.answerIndex >= -1 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                color: v.answerIndex >= -1 ? "#10b981" : "#ef4444",
              }}>
              {v.answerText}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Scores */}
      {data.scores.length > 0 && (
        <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-saloon-border">
          <p className="text-xs uppercase tracking-widest text-text-muted font-semibold flex items-center gap-2">
            <Star size={10} fill="var(--sheriff-gold)" style={{ color: "var(--sheriff-gold)" }} />
            Scores
          </p>
          {[...data.scores].sort((a, b) => b.score - a.score).map((s, i) => (
            <div key={s.teamId} className="flex items-center gap-3 text-sm">
              <span className="w-4 text-text-muted text-center font-bold">{i + 1}</span>
              <span className="flex-1 font-semibold text-text-primary">{s.teamName}</span>
              <div className="flex items-center gap-1">
                <Star size={11} fill="var(--sheriff-gold)" style={{ color: "var(--sheriff-gold)" }} />
                <span className="font-bold" style={{ color: "var(--sheriff-gold)" }}>{s.score}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-text-muted animate-pulse mt-1">
        Waiting for host to advance…
      </p>
    </motion.div>
  );
}

// ─── Game Over view ───────────────────────────────────────────────────────────

function GameOverView({ data, playerName }: { data: GameFinishedPayload; playerName: string }) {
  const sorted = [...data.scores].sort((a, b) => b.score - a.score);
  const rank = sorted.findIndex(s => s.teamName === playerName) + 1;

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <motion.span className="text-6xl" animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}>🏆</motion.span>
      <h2 className="text-4xl tracking-widest shimmer-text"
        style={{ fontFamily: "'Bebas Neue',cursive" }}>Game Over!</h2>
      {rank > 0 && (
        <p className="text-text-muted text-sm">
          You finished <span className="font-bold text-text-primary">#{rank}</span>!
        </p>
      )}
      <div className="flex flex-col gap-2 w-full">
        {sorted.map((s, i) => (
          <motion.div key={s.teamId}
            initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 p-3 rounded-xl border border-saloon-border bg-saloon-surface">
            <span className="text-lg">{["🥇", "🥈", "🥉"][i] ?? "🎖️"}</span>
            <span className="flex-1 font-bold text-sm text-text-primary">{s.teamName}</span>
            <div className="flex items-center gap-1">
              <Star size={12} fill="var(--sheriff-gold)" style={{ color: "var(--sheriff-gold)" }} />
              <span className="font-bold text-sm" style={{ color: "var(--sheriff-gold)" }}>{s.score}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Main PlayerGameScreen ────────────────────────────────────────────────────

interface PlayerGameScreenProps {
  pin: string;
  playerId: string;
  playerName: string;
  teamId: string | null;
  teamName: string | null;
  avatar: string;
  initialCard: WireCard;
  initialCardIndex: number;
}

type PlayerPhase = "playing" | "voted" | "reveal" | "next-wait" | "finished";

export default function PlayerGameScreen({
  pin, playerId, playerName, teamId, teamName, avatar,
  initialCard, initialCardIndex,
}: PlayerGameScreenProps) {
  const [phase, setPhase] = useState<PlayerPhase>("playing");
  const [currentCard, setCurrentCard] = useState<WireCard>(initialCard);
  const [cardIndex, setCardIndex] = useState(initialCardIndex);
  const [revealData, setRevealData] = useState<VotesRevealedPayload | null>(null);
  const [finishData, setFinishData] = useState<GameFinishedPayload | null>(null);

  useGameSocket(pin, {
    onVotesRevealed: useCallback((d: VotesRevealedPayload) => {
      setRevealData(d);
      setPhase("reveal");
    }, []),

    onNextCard: useCallback((d: NextCardPayload) => {
      setCurrentCard(d.card);
      setCardIndex(d.cardIndex);
      setRevealData(null);
      setPhase("playing");
    }, []),

    onGameFinished: useCallback((d: GameFinishedPayload) => {
      setFinishData(d);
      setPhase("finished");
    }, []),
  });

  return (
    <div className="w-full h-dvh flex flex-col bg-saloon-dark overflow-hidden">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-[-15%] right-[-10%] w-[40vw] h-[40vw] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* Header */}
      <div className="relative z-10 shrink-0 flex items-center justify-between px-4 py-3 border-b border-saloon-border">
        <div className="flex items-center gap-2">
          <span className="text-lg">{avatar}</span>
          <div>
            <p className="text-xs font-bold text-text-primary leading-none">{playerName}</p>
            {teamName && <p className="text-[10px] leading-none mt-0.5" style={{ color: "var(--neon-pink)" }}>{teamName}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--neon-pink)" }} />
          PIN: <span className="text-text-primary font-bold">{pin}</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-5 scrollable">
        <AnimatePresence mode="wait">
          {phase === "playing" && (
            <motion.div key={`card-${cardIndex}`}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
              <PlayerCardView
                card={currentCard} cardIndex={cardIndex}
                playerId={playerId} playerName={playerName}
                teamId={teamId} teamName={teamName} pin={pin}
                onVoted={() => setPhase("voted")}
              />
            </motion.div>
          )}

          {phase === "voted" && (
            <motion.div key="voted-wait"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5 py-10">
              <motion.div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                style={{ backgroundColor: "rgba(16,185,129,0.15)", border: "2px solid #10b981" }}
                animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                ✅
              </motion.div>
              <p className="font-bold text-emerald-400">Answer locked in!</p>
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <Eye size={14} />
                <span>Waiting for host to reveal…</span>
              </div>
            </motion.div>
          )}

          {phase === "reveal" && revealData && (
            <motion.div key="reveal"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}>
              <RevealView data={revealData} playerName={playerName} />
            </motion.div>
          )}

          {phase === "finished" && finishData && (
            <motion.div key="finished"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}>
              <GameOverView data={finishData} playerName={playerName} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
