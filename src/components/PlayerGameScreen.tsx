"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Star, Eye } from "lucide-react";
import { useGameSocket } from "@/hooks/useGameSocket";
import type { WireCard, VotesRevealedPayload, NextCardPayload, GameFinishedPayload } from "@/lib/pusher-server";

const ACCENT: Record<string, string> = { trivia: "#8b2be2", charades: "#1e90ff", action: "#f59e0b", dare: "#ff10f0" };

// ─── Card Stack (player version — same visual, different CTA) ─────────────────

function PlayerCardStack({ card, isFlipped, onFlip, hasVoted }:
  { card: WireCard; isFlipped: boolean; onFlip: () => void; hasVoted: boolean }) {
  const accent = ACCENT[card.type] ?? "var(--neon-pink)";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex items-center justify-center" style={{ perspective: "1200px", width: 300, height: 190 }}>
        {/* Stack shadow cards (2 underneath) */}
        {[1, 2].map(i => (
          <div key={i} className="absolute rounded-2xl border-2"
            style={{
              width: 280, height: 175,
              borderColor: "var(--saloon-border)", backgroundColor: "var(--saloon-card)",
              transform: `translateY(${i * -5}px) rotate(${i % 2 === 0 ? 2 : -2}deg)`,
              zIndex: 2 - i, opacity: 1 - i * 0.2,
            }}>
            <div className="w-full h-full rounded-2xl flex items-center justify-center"
              style={{ backgroundImage: "repeating-linear-gradient(45deg,rgba(255,16,240,0.03) 0,rgba(255,16,240,0.03) 2px,transparent 2px,transparent 10px)" }}>
              <span className="text-3xl opacity-20">🤠</span>
            </div>
          </div>
        ))}

        {/* Active card */}
        <motion.div className="absolute"
          style={{ zIndex: 10, width: 280, height: 175, transformStyle: "preserve-3d", cursor: isFlipped ? "default" : "pointer" }}
          animate={{ rotateY: isFlipped ? 180 : 0, rotate: isFlipped ? -5 : 0, x: isFlipped ? 16 : 0, y: isFlipped ? 8 : 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          onClick={!isFlipped && !hasVoted ? onFlip : undefined}
          whileHover={!isFlipped ? { y: -6 } : {}}
        >
          {/* Back */}
          <div className="absolute inset-0 rounded-2xl border-2 flex items-center justify-center"
            style={{ borderColor: "var(--neon-pink)", backgroundColor: "var(--saloon-card)", backfaceVisibility: "hidden", boxShadow: "0 0 30px rgba(255,16,240,0.25)" }}>
            <div className="w-[88%] h-[88%] rounded-xl border flex flex-col items-center justify-center gap-2"
              style={{ borderColor: "rgba(255,16,240,0.3)", backgroundImage: "repeating-linear-gradient(45deg,rgba(255,16,240,0.04) 0,rgba(255,16,240,0.04) 2px,transparent 2px,transparent 10px)" }}>
              <span className="text-4xl">🤠</span>
              <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: "var(--neon-pink)" }}>Tap to reveal</p>
            </div>
          </div>
          {/* Front */}
          <div className="absolute inset-0 rounded-2xl border-2 overflow-hidden flex flex-col"
            style={{ borderColor: accent, backgroundColor: "var(--saloon-card)", backfaceVisibility: "hidden", transform: "rotateY(180deg)", boxShadow: `0 0 30px ${accent}35` }}>
            <div className="h-1.5" style={{ background: `linear-gradient(90deg,${accent},${accent}60)` }} />
            <div className="flex-1 flex flex-col items-center justify-center gap-2 p-4 text-center">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border"
                style={{ color: accent, borderColor: `${accent}60`, backgroundColor: `${accent}18` }}>
                {card.type} · {card.points} pts
              </span>
              <p className="text-base font-bold text-text-primary leading-snug">{card.description}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {!isFlipped && !hasVoted && (
        <p className="text-text-muted text-xs animate-pulse">Tap the card to reveal it 👆</p>
      )}
    </div>
  );
}

// ─── Reveal view ──────────────────────────────────────────────────────────────

function RevealView({ data, playerName }: { data: VotesRevealedPayload; playerName: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 w-full max-w-sm mx-auto">
      <p className="text-center text-xs uppercase tracking-widest text-text-muted font-semibold">🎉 Results revealed!</p>
      {data.votes.map((v, i) => (
        <motion.div key={v.playerId} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
          className="flex items-center gap-3 p-3 rounded-xl border border-saloon-border bg-saloon-surface">
          <span className="flex-1 font-semibold text-sm text-text-primary">{v.teamName ?? v.playerName}</span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: v.answerIndex >= -1 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: v.answerIndex >= -1 ? "#10b981" : "#ef4444" }}>
            {v.answerText}
          </span>
        </motion.div>
      ))}
      {data.scores.length > 0 && (
        <div className="mt-1 pt-3 border-t border-saloon-border flex flex-col gap-1.5">
          <p className="text-xs uppercase tracking-widest text-text-muted font-semibold flex items-center gap-2">
            <Star size={10} fill="var(--sheriff-gold)" style={{ color: "var(--sheriff-gold)" }} /> Scores
          </p>
          {[...data.scores].sort((a, b) => b.score - a.score).map((s, i) => (
            <div key={s.teamId} className="flex items-center gap-2 text-sm">
              <span className="w-4 text-center font-bold text-text-muted">{i + 1}</span>
              <span className="flex-1 font-semibold text-text-primary">{s.teamName}</span>
              <div className="flex items-center gap-1">
                <Star size={10} fill="var(--sheriff-gold)" style={{ color: "var(--sheriff-gold)" }} />
                <span className="font-bold" style={{ color: "var(--sheriff-gold)" }}>{s.score}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="text-center text-xs text-text-muted animate-pulse mt-1">Waiting for host to advance…</p>
    </motion.div>
  );
}

// ─── Game over ────────────────────────────────────────────────────────────────

function GameOverView({ data }: { data: GameFinishedPayload }) {
  return (
    <div className="flex flex-col items-center gap-5 text-center w-full max-w-sm mx-auto">
      <motion.span className="text-6xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}>🏆</motion.span>
      <h2 className="text-4xl tracking-widest shimmer-text" style={{ fontFamily: "'Bebas Neue',cursive" }}>Game Over!</h2>
      <div className="flex flex-col gap-2 w-full">
        {[...data.scores].sort((a, b) => b.score - a.score).map((s, i) => (
          <motion.div key={s.teamId} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="flex items-center gap-3 p-3 rounded-xl border border-saloon-border bg-saloon-surface">
            <span className="text-lg">{["🥇", "🥈", "🥉"][i] ?? "🎖️"}</span>
            <span className="flex-1 font-bold text-sm text-text-primary">{s.teamName}</span>
            <div className="flex items-center gap-1">
              <Star size={11} fill="var(--sheriff-gold)" style={{ color: "var(--sheriff-gold)" }} />
              <span className="font-bold text-sm" style={{ color: "var(--sheriff-gold)" }}>{s.score}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

interface PlayerGameScreenProps {
  pin: string; playerId: string; playerName: string;
  teamId: string | null; teamName: string | null; avatar: string;
  initialCard: WireCard; initialCardIndex: number;
}

type Phase = "playing" | "voted" | "reveal" | "finished";

export default function PlayerGameScreen({
  pin, playerId, playerName, teamId, teamName, avatar, initialCard, initialCardIndex,
}: PlayerGameScreenProps) {
  const [phase, setPhase] = useState<Phase>("playing");
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCard, setCurrentCard] = useState<WireCard>(initialCard);
  const [revealData, setRevealData] = useState<VotesRevealedPayload | null>(null);
  const [finishData, setFinishData] = useState<GameFinishedPayload | null>(null);
  const [loading, setLoading] = useState(false);

  useGameSocket(pin, {
    onVotesRevealed: useCallback((d: VotesRevealedPayload) => { setRevealData(d); setPhase("reveal"); }, []),
    onNextCard: useCallback((d: NextCardPayload) => {
      setCurrentCard(d.card); setRevealData(null); setIsFlipped(false); setPhase("playing");
    }, []),
    onGameFinished: useCallback((d: GameFinishedPayload) => { setFinishData(d); setPhase("finished"); }, []),
  });

  const castVote = useCallback(async (answerIndex: number, answerText: string) => {
    if (loading) return;
    setLoading(true);
    try {
      await fetch(`/api/sessions/${pin}/vote`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, playerName, teamId, teamName, cardIndex: initialCardIndex, answerIndex, answerText }),
      });
      setPhase("voted");
    } finally { setLoading(false); }
  }, [loading, pin, playerId, playerName, teamId, teamName, initialCardIndex]);

  return (
    <div className="w-full min-h-dvh flex flex-col bg-saloon-dark">
      {/* Glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-[-15%] right-[-10%] w-[40vw] h-[40vw] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* Header */}
      <div className="relative z-10 shrink-0 flex items-center justify-between px-4 py-3 border-b border-saloon-border">
        <div className="flex items-center gap-2">
          <span className="text-xl">{avatar}</span>
          <div>
            <p className="text-xs font-bold text-text-primary leading-none">{playerName}</p>
            {teamName && <p className="text-[10px] mt-0.5 leading-none" style={{ color: "var(--neon-pink)" }}>{teamName}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--neon-pink)" }} />
          PIN: <span className="text-text-primary font-bold">{pin}</span>
        </div>
      </div>

      {/* Content — centred */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6">
          <AnimatePresence mode="wait">

            {/* Playing — show card stack */}
            {phase === "playing" && (
              <motion.div key={`card-${currentCard.id}`} className="flex flex-col items-center gap-6 w-full"
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
                <PlayerCardStack card={currentCard} isFlipped={isFlipped} onFlip={() => setIsFlipped(true)} hasVoted={false} />

                {/* Action buttons — only show after reveal */}
                <AnimatePresence>
                  {isFlipped && (
                    <motion.div key="btns" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 w-full">
                      <motion.button id="player-fail-btn" whileTap={{ scale: 0.95 }} disabled={loading}
                        onClick={() => castVote(-2, "❌ Failed")}
                        className="flex-1 py-4 rounded-2xl border-2 border-red-500/40 bg-red-500/10 text-red-400 font-bold text-sm flex items-center justify-center gap-2">
                        <XCircle size={17} /> Nope
                      </motion.button>
                      <motion.button id="player-done-btn" whileTap={{ scale: 0.95 }} disabled={loading}
                        onClick={() => castVote(-1, "✅ Done")}
                        className="flex-1 py-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold text-sm flex items-center justify-center gap-2">
                        <CheckCircle size={17} /> Done!
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Voted — waiting */}
            {phase === "voted" && (
              <motion.div key="voted" className="flex flex-col items-center gap-5 py-6"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
                  style={{ backgroundColor: "rgba(16,185,129,0.15)", border: "2px solid #10b981" }}
                  animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2, repeat: Infinity }}>✅</motion.div>
                <p className="font-bold text-emerald-400">Answer locked in!</p>
                <div className="flex items-center gap-2 text-text-muted text-sm">
                  <Eye size={14} /><span>Waiting for host to reveal…</span>
                </div>
              </motion.div>
            )}

            {/* Reveal */}
            {phase === "reveal" && revealData && (
              <motion.div key="reveal" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                <RevealView data={revealData} playerName={playerName} />
              </motion.div>
            )}

            {/* Finished */}
            {phase === "finished" && finishData && (
              <motion.div key="finished" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <GameOverView data={finishData} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
