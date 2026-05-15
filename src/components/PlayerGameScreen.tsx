"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { GameCardStack } from "@/components/SharedCard";
import { GameSummary } from "@/components/GameSummary";
import { useRealtimeGame as useGameSocket } from "@/hooks/useRealtimeGame";
import type {
  WireCard,
  VotesRevealedPayload,
  NextCardPayload,
  GameFinishedPayload,
} from "@/lib/pusher-server";

// ─── Reveal view ──────────────────────────────────────────────────────────────

function RevealView({ data, countdown }: { data: VotesRevealedPayload; countdown: number | null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-3 w-full max-w-sm mx-auto"
    >
      <p className="text-center text-xs uppercase tracking-widest text-text-muted font-semibold">
        OTO WYNIKI
      </p>
      {data.votes.map((v, i) => {
        const hasCorrectAnswer = !!data.correctAnswer;
        const rawAnswerText = v.answerText.replace(/^[A-Z]: /, "");
        const isCorrect = hasCorrectAnswer && rawAnswerText === data.correctAnswer;
        const isWrong = hasCorrectAnswer && !isCorrect;
        const isDrinking = !hasCorrectAnswer && v.answerIndex === -1;
        const isNotDrinking = !hasCorrectAnswer && v.answerIndex === -2;
        return (
          <motion.div
            key={v.playerId}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 p-3 rounded-xl border border-saloon-border bg-saloon-surface"
          >
            <span className="flex-1 font-semibold text-sm text-text-primary">
              {v.teamName ?? v.playerName}
            </span>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: isCorrect || isDrinking
                  ? "rgba(16,185,129,0.15)"
                  : isWrong || isNotDrinking
                    ? "rgba(239,68,68,0.15)"
                    : "rgba(255,220,180,0.1)",
                color: isCorrect || isDrinking
                  ? "#10b981"
                  : isWrong || isNotDrinking
                    ? "#ef4444"
                    : "rgba(255,220,180,0.7)",
              }}
            >
              {v.answerText}
            </span>
          </motion.div>
        );
      })}
      {data.scores.length > 0 && (
        <div className="mt-4 pt-4 border-t-2 border-saloon-border flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted font-bold flex items-center justify-center gap-2">
            <Star
              size={12}
              fill="var(--sheriff-gold)"
              style={{ color: "var(--sheriff-gold)" }}
            />
            RANKING OGÓLNY
            <Star
              size={12}
              fill="var(--sheriff-gold)"
              style={{ color: "var(--sheriff-gold)" }}
            />
          </p>
          <div className="flex flex-col gap-2">
            {[...data.scores]
              .sort((a, b) => b.score - a.score)
              .map((s, i) => (
                <div
                  key={s.playerId}
                  className="flex items-center gap-3 p-3 rounded-xl bg-saloon-card border border-saloon-border shadow-lg"
                >
                  <span className="w-6 text-center font-black text-neon-pink">
                    {i + 1}.
                  </span>
                  <span className="flex-1 font-bold text-sm text-text-primary">
                    {s.playerName}
                  </span>
                  <div className="flex items-center gap-1 bg-black/30 px-2 py-1 rounded-lg">
                    <Star
                      size={12}
                      fill="var(--sheriff-gold)"
                      style={{ color: "var(--sheriff-gold)" }}
                    />
                    <span
                      className="font-black text-sm"
                      style={{ color: "var(--sheriff-gold)" }}
                    >
                      {s.score}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      {countdown !== null && (
        <p className="text-center text-xs text-text-muted animate-pulse mt-1">
          Następna karta za {countdown}…
        </p>
      )}
    </motion.div>
  );
}

// ─── Game over ────────────────────────────────────────────────────────────────

function GameOverView({ data }: { data: GameFinishedPayload }) {
  const drinksScores = data.scores
    .filter((s) => (s.drinks ?? 0) > 0)
    .map((s) => ({ id: s.playerId, name: s.playerName, score: s.drinks! }));

  return (
    <GameSummary
      scores={data.scores.map((s) => ({
        id: s.playerId,
        name: s.playerName,
        score: s.score,
      }))}
      teamScores={
        data.teamScores?.length
          ? data.teamScores.map((t) => ({ id: t.teamId, name: t.teamName, score: t.score }))
          : undefined
      }
      drinksScores={drinksScores.length > 0 ? drinksScores : undefined}
    />
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

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

type Phase = "playing" | "voted" | "reveal" | "finished";

export default function PlayerGameScreen({
  pin,
  playerId,
  playerName,
  teamId,
  teamName,
  avatar,
  initialCard,
  initialCardIndex,
}: PlayerGameScreenProps) {
  const [phase, setPhase] = useState<Phase>("playing");
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentCard, setCurrentCard] = useState<WireCard>(initialCard);
  const [currentCardIndex, setCurrentCardIndex] = useState(initialCardIndex);
  const [revealData, setRevealData] = useState<VotesRevealedPayload | null>(null);
  const [finishData, setFinishData] = useState<GameFinishedPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Visual countdown after votes are revealed — HostScreen sends the actual next-card event
  useEffect(() => {
    if (phase !== "reveal") {
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
      } else {
        setCountdown(n);
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [phase, currentCardIndex]);

  useGameSocket(pin, {
    onVotesRevealed: useCallback((d: VotesRevealedPayload) => {
      setRevealData(d);
      setPhase("reveal");
    }, []),
    onNextCard: useCallback((d: NextCardPayload) => {
      setCurrentCard(d.card);
      setCurrentCardIndex(d.cardIndex);
      setRevealData(null);
      setIsFlipped(false);
      setPhase("playing");
    }, []),
    onGameFinished: useCallback((d: GameFinishedPayload) => {
      setFinishData(d);
      setPhase("finished");
    }, []),
  });

  const castVote = useCallback(
    async (answerIndex: number, answerText: string) => {
      if (loading) return;
      setLoading(true);
      try {
        await fetch(`/api/sessions/${pin}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerId,
            playerName,
            teamId,
            teamName,
            cardIndex: currentCardIndex,
            answerIndex,
            answerText,
          }),
        });
        setPhase("voted");
      } finally {
        setLoading(false);
      }
    },
    [loading, pin, playerId, playerName, teamId, teamName, currentCardIndex],
  );

  return (
    <div className="w-full min-h-dvh flex flex-col">
      {/* Glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-[-15%] right-[-10%] w-[40vw] h-[40vw] rounded-full opacity-[0.06]"
          style={{
            background: "radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 shrink-0 flex items-center justify-between px-4 py-3 border-b border-saloon-border">
        <div className="flex items-center gap-2">
          <span className="text-xl">{avatar}</span>
          <div>
            <p className="text-xs font-bold text-text-primary leading-none">{playerName}</p>
            {teamName && (
              <p className="text-[10px] mt-0.5 leading-none" style={{ color: "var(--neon-pink)" }}>
                {teamName}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--neon-pink)" }}
          />
          PIN: <span className="text-text-primary font-bold">{pin}</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-6">
          <AnimatePresence mode="wait">
            {/* Playing — show card stack */}
            {phase === "playing" && (
              <motion.div
                key={`card-${currentCard.id}`}
                className="flex flex-col items-center gap-6 w-full"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <GameCardStack
                  card={currentCard}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped(true)}
                />

                <AnimatePresence>
                  {isFlipped && currentCard.type !== "NEVER" && (
                    <motion.div
                      key="btns"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full"
                    >
                      {currentCard.options && currentCard.options.length > 0 ? (
                        <div className="flex flex-col gap-2.5 w-full">
                          {currentCard.options.map((opt, idx) => {
                            const letter = String.fromCharCode(65 + idx);
                            return (
                              <motion.button
                                key={idx}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                onClick={() => castVote(idx, `${letter}: ${opt}`)}
                                className="group relative w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 text-left overflow-hidden"
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
                                  className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black"
                                  style={{
                                    backgroundColor: "rgba(255,16,240,0.15)",
                                    color: "var(--neon-pink)",
                                    fontFamily: "'Bebas Neue',cursive",
                                    letterSpacing: "0.05em",
                                    fontSize: "1rem",
                                  }}
                                >
                                  {letter}
                                </span>
                                <span className="text-sm font-semibold text-text-primary leading-snug">
                                  {opt}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex gap-3 w-full">
                          <motion.button
                            id="player-fail-btn"
                            whileTap={{ scale: 0.95 }}
                            disabled={loading}
                            onClick={() => castVote(-2, "❌ Nie")}
                            className="flex-1 py-4 rounded-2xl border-2 border-red-500/40 bg-red-500/10 text-red-400 font-bold text-sm flex items-center justify-center gap-2"
                          >
                            Nie
                          </motion.button>
                          <motion.button
                            id="player-done-btn"
                            whileTap={{ scale: 0.95 }}
                            disabled={loading}
                            onClick={() => castVote(-1, "✅ Tak")}
                            className="flex-1 py-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-bold text-sm flex items-center justify-center gap-2"
                          >
                            Tak!
                          </motion.button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* NEVER cards — PIJĘ / NIE PIJĘ */}
                  {isFlipped && currentCard.type === "NEVER" && (
                    <motion.div
                      key="never-btns"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 w-full"
                    >
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                        onClick={() => castVote(-2, "🚫 Nie piję")}
                        className="flex-1 py-5 rounded-2xl border-2 font-black text-sm flex flex-col items-center justify-center gap-1"
                        style={{
                          borderColor: "rgba(255,220,180,0.25)",
                          backgroundColor: "rgba(255,220,180,0.06)",
                          color: "rgba(255,220,180,0.8)",
                          fontFamily: "'Bebas Neue',cursive",
                          letterSpacing: "0.08em",
                          fontSize: "1rem",
                        }}
                      >
                        <span className="text-2xl">🚫</span>
                        NIE PIJĘ
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                        onClick={() => castVote(-1, "🍺 Piję")}
                        className="flex-1 py-5 rounded-2xl border-2 font-black text-sm flex flex-col items-center justify-center gap-1"
                        style={{
                          borderColor: "var(--neon-pink)",
                          backgroundColor: "rgba(255,16,240,0.1)",
                          color: "var(--neon-pink)",
                          boxShadow: "0 0 20px rgba(255,16,240,0.2)",
                          fontFamily: "'Bebas Neue',cursive",
                          letterSpacing: "0.08em",
                          fontSize: "1rem",
                        }}
                      >
                        <span className="text-2xl">🍺</span>
                        PIJĘ
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Voted — waiting */}
            {phase === "voted" && (
              <motion.div
                key="voted"
                className="flex flex-col items-center gap-6 py-6 text-center"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-2"
                  style={{
                    borderColor: "#10b981",
                    backgroundColor: "rgba(16,185,129,0.12)",
                    boxShadow: "0 0 24px rgba(16,185,129,0.3)",
                  }}
                >
                  {avatar}
                </motion.div>

                <div className="flex flex-col gap-1">
                  <h2
                    className="text-3xl tracking-widest"
                    style={{ fontFamily: "'Bebas Neue',cursive", color: "#10b981" }}
                  >
                    Odpowiedź zapisana!
                  </h2>
                  <p className="text-text-muted text-sm">Czekaj na wyniki…</p>
                </div>

                <div className="flex gap-2 mt-1">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--neon-pink)" }}
                      animate={{ scale: [1, 1.6, 1], opacity: [0.35, 1, 0.35] }}
                      transition={{ duration: 1.4, delay: i * 0.25, repeat: Infinity }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reveal */}
            {phase === "reveal" && revealData && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <RevealView data={revealData} countdown={countdown} />
              </motion.div>
            )}

            {/* Finished */}
            {phase === "finished" && finishData && (
              <motion.div
                key="finished"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <GameOverView data={finishData} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
