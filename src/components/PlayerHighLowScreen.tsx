"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, TrendingDown, TrendingUp, Star, Trophy } from "lucide-react";
import { useGameSocket } from "@/hooks/useGameSocket";
import type {
  HighLowRoundStartPayload,
  HighLowRoundResultPayload,
  ScoreEntry,
} from "@/lib/pusher-server";

// ─── Types ────────────────────────────────────────────────────────────────────

type PlayerHLPhase =
  | "waiting"
  | "guessing-captain"
  | "guessing-member"
  | "voting-captain-waiting"
  | "voting-captain-ready"
  | "voting-member"
  | "result"
  | "finished";

interface Props {
  pin: string;
  playerId: string;
  playerName: string;
  teamId: string | null;
  teamName: string | null;
  avatar: string;
  initialRoundData?: HighLowRoundStartPayload | null;
}

function derivePhase(
  data: HighLowRoundStartPayload,
  playerId: string,
  teamId: string | null,
): PlayerHLPhase {
  if (playerId === data.guessingCaptainId) return "guessing-captain";
  if (playerId === data.votingCaptainId) return "voting-captain-waiting";
  if (teamId === data.guessingTeamId) return "guessing-member";
  if (teamId === data.votingTeamId) return "voting-member";
  return "guessing-member";
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function PulsingDots({ color }: { color: string }) {
  return (
    <div className="flex gap-1.5 justify-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.4, delay: i * 0.25, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PlayerHighLowScreen({
  pin,
  playerId,
  playerName,
  teamId,
  teamName,
  avatar,
  initialRoundData,
}: Props) {
  const [phase, setPhase] = useState<PlayerHLPhase>(
    initialRoundData ? derivePhase(initialRoundData, playerId, teamId) : "waiting",
  );
  const [roundData, setRoundData] = useState<HighLowRoundStartPayload | null>(
    initialRoundData ?? null,
  );
  const [submittedNumber, setSubmittedNumber] = useState<string | null>(null);
  const [resultData, setResultData] = useState<HighLowRoundResultPayload | null>(null);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [numberInput, setNumberInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [voted, setVoted] = useState(false);
  const [votedChoice, setVotedChoice] = useState<"mniej" | "wiecej" | null>(null);

  const myScore = scores.find((s) => s.playerId === playerId)?.score ?? 0;

  // ── Socket ──────────────────────────────────────────────────────────────────

  useGameSocket(pin, {
    onHighLowRoundStart: useCallback(
      (d: HighLowRoundStartPayload) => {
        setRoundData(d);
        setSubmittedNumber(null);
        setResultData(null);
        setNumberInput("");
        setVoted(false);
        setVotedChoice(null);
        setSubmitting(false);
        setPhase(derivePhase(d, playerId, teamId));
      },
      [playerId, teamId],
    ),

    onHighLowNumberSubmitted: useCallback((d: { number: string }) => {
      setSubmittedNumber(d.number);
      setPhase((prev) => {
        if (prev === "guessing-captain") return "guessing-member";
        if (prev === "voting-captain-waiting") return "voting-captain-ready";
        return prev;
      });
    }, []),

    onHighLowRoundResult: useCallback((d: HighLowRoundResultPayload) => {
      setResultData(d);
      setScores(d.scores);
      setPhase("result");
    }, []),

    onGameFinished: useCallback(() => setPhase("finished"), []),
  });

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSubmitNumber = useCallback(async () => {
    const num = numberInput.trim();
    if (!num || submitting) return;
    setSubmitting(true);
    try {
      await fetch(`/api/sessions/${pin}/highlow/number`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playerId, number: num }),
      });
      // Phase transitions on Pusher event
    } catch {
      setSubmitting(false);
    }
  }, [pin, playerId, numberInput, submitting]);

  const handleVote = useCallback(
    async (vote: "mniej" | "wiecej") => {
      if (voted || submitting) return;
      setVoted(true);
      setVotedChoice(vote);
      setSubmitting(true);
      try {
        await fetch(`/api/sessions/${pin}/highlow/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId, vote, currentScores: scores }),
        });
      } catch {
        setVoted(false);
        setVotedChoice(null);
        setSubmitting(false);
      }
    },
    [pin, playerId, voted, submitting, scores],
  );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="w-full min-h-dvh flex flex-col items-center justify-center p-6 relative">
      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div
          className="absolute top-[-20%] left-[-15%] w-[60vw] h-[60vw] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-[-20%] right-[-15%] w-[60vw] h-[60vw] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      {/* Score chip */}
      {myScore > 0 && (
        <div
          className="fixed top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-bold text-xs"
          style={{ borderColor: "rgba(255,215,0,0.4)", backgroundColor: "rgba(255,215,0,0.08)", color: "var(--sheriff-gold)" }}
        >
          <Star size={11} fill="var(--sheriff-gold)" style={{ color: "var(--sheriff-gold)" }} />
          {myScore} pkt
        </div>
      )}

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6">
        <AnimatePresence mode="wait">

          {/* ─── WAITING ────────────────────────────────────────────── */}
          {phase === "waiting" && (
            <motion.div key="waiting"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-6 text-center"
            >
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-5xl border-2"
                style={{ borderColor: "rgba(255,215,0,0.4)", backgroundColor: "rgba(255,215,0,0.06)" }}
              >
                {avatar}
              </div>
              <div>
                <h1 className="text-5xl tracking-widest shimmer-text" style={{ fontFamily: "'Bebas Neue',cursive" }}>
                  mniej czy więcej
                </h1>
                {teamName && (
                  <p className="text-text-muted text-xs mt-1">
                    Drużyna: <span className="text-text-primary font-bold">{teamName}</span>
                  </p>
                )}
              </div>
              <div className="bg-saloon-surface border border-saloon-border rounded-2xl px-6 py-5 w-full flex flex-col items-center gap-3">
                <PulsingDots color="var(--neon-pink)" />
                <p className="text-text-muted text-sm font-medium">Czekaj na hosta…</p>
                <p className="text-[10px] text-text-muted opacity-50">Ekran zaktualizuje się automatycznie</p>
              </div>
            </motion.div>
          )}

          {/* ─── GUESSING CAPTAIN ───────────────────────────────────── */}
          {phase === "guessing-captain" && roundData && (
            <motion.div key="guessing-captain"
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center gap-5 text-center w-full"
            >
              <div
                className="px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest"
                style={{ borderColor: "rgba(255,16,240,0.5)", backgroundColor: "rgba(255,16,240,0.1)", color: "var(--neon-pink)" }}
              >
                🎯 Ty podajesz liczbę!
              </div>

              <div className="w-full p-5 rounded-2xl border-2"
                style={{ borderColor: "rgba(255,215,0,0.25)", backgroundColor: "rgba(255,215,0,0.05)" }}>
                <p className="text-xs uppercase tracking-widest text-text-muted mb-2">Pytanie</p>
                <p className="text-lg font-bold leading-snug" style={{ color: "var(--sheriff-gold)" }}>
                  {roundData.questionText}
                </p>
                <p className="text-xs text-text-muted mt-2">
                  Odpowiedź w: <span className="font-bold text-text-primary">{roundData.questionUnit}</span>
                </p>
              </div>

              <div className="w-full flex flex-col gap-3">
                <input
                  type="number"
                  inputMode="numeric"
                  value={numberInput}
                  onChange={(e) => setNumberInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmitNumber()}
                  placeholder={`Liczba w ${roundData.questionUnit}…`}
                  autoFocus
                  className="w-full bg-saloon-surface border-2 rounded-xl px-4 py-4 text-center text-3xl font-black text-text-primary placeholder:text-text-muted focus:outline-none transition-colors"
                  style={{
                    borderColor: numberInput ? "var(--neon-pink)" : "var(--saloon-border)",
                    fontFamily: "'Bebas Neue',cursive",
                    letterSpacing: "0.1em",
                  }}
                />
                <motion.button
                  disabled={!numberInput.trim() || submitting}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubmitNumber}
                  className="w-full py-4 rounded-2xl text-white flex items-center justify-center gap-2 disabled:opacity-30"
                  style={{
                    background: "linear-gradient(135deg,var(--neon-pink),#c800c8)",
                    boxShadow: "0 4px 30px rgba(255,16,240,0.4)",
                    fontFamily: "'Bebas Neue',cursive",
                    fontSize: "1.1rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : "Zatwierdź odpowiedź"}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ─── GUESSING MEMBER ────────────────────────────────────── */}
          {phase === "guessing-member" && roundData && (
            <motion.div key="guessing-member"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5 text-center"
            >
              <div className="px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest"
                style={{ borderColor: "rgba(255,16,240,0.4)", backgroundColor: "rgba(255,16,240,0.08)", color: "var(--neon-pink)" }}>
                Twoja drużyna zgaduje
              </div>

              <div className="w-full p-5 rounded-2xl border-2"
                style={{ borderColor: "rgba(255,215,0,0.25)", backgroundColor: "rgba(255,215,0,0.05)" }}>
                <p className="text-xs text-text-muted mb-2">Pytanie</p>
                <p className="text-base font-bold leading-snug" style={{ color: "var(--sheriff-gold)" }}>
                  {roundData.questionText}
                </p>
              </div>

              {submittedNumber !== null ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs uppercase tracking-widest text-text-muted">Wasza odpowiedź</p>
                  <p className="text-5xl font-black" style={{ color: "var(--neon-pink)", fontFamily: "'Bebas Neue',cursive" }}>
                    {submittedNumber} <span className="text-2xl">{roundData.questionUnit}</span>
                  </p>
                  <p className="text-xs text-text-muted mt-1">Czekaj na głos drużyny przeciwnej…</p>
                  <PulsingDots color="var(--neon-pink)" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-text-muted text-sm">Kapitan podaje odpowiedź…</p>
                  <PulsingDots color="var(--neon-pink)" />
                </div>
              )}
            </motion.div>
          )}

          {/* ─── VOTING CAPTAIN WAITING ─────────────────────────────── */}
          {phase === "voting-captain-waiting" && roundData && (
            <motion.div key="voting-captain-waiting"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5 text-center"
            >
              <div className="px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest"
                style={{ borderColor: "rgba(167,139,250,0.5)", backgroundColor: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>
                ⚡ Ty głosujesz — jesteś kapitanem!
              </div>

              <div className="w-full p-5 rounded-2xl border-2"
                style={{ borderColor: "rgba(255,215,0,0.25)", backgroundColor: "rgba(255,215,0,0.05)" }}>
                <p className="text-xs uppercase tracking-widest text-text-muted mb-2">Pytanie</p>
                <p className="text-base font-bold leading-snug" style={{ color: "var(--sheriff-gold)" }}>
                  {roundData.questionText}
                </p>
                <p className="text-xs text-text-muted mt-2">
                  Odpowiedź w: <span className="font-bold text-text-primary">{roundData.questionUnit}</span>
                </p>
              </div>

              <div className="flex flex-col items-center gap-3">
                <p className="text-text-muted text-sm">
                  Czekaj na odpowiedź drużyny{" "}
                  <span className="font-bold text-text-primary">{roundData.guessingTeamName}</span>…
                </p>
                <PulsingDots color="#a78bfa" />
              </div>
            </motion.div>
          )}

          {/* ─── VOTING CAPTAIN READY ───────────────────────────────── */}
          {phase === "voting-captain-ready" && roundData && submittedNumber !== null && (
            <motion.div key="voting-captain-ready"
              initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5 text-center w-full"
            >
              <div className="px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest"
                style={{ borderColor: "rgba(167,139,250,0.5)", backgroundColor: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>
                ⚡ Twój głos decyduje!
              </div>

              <div className="w-full p-4 rounded-2xl border-2"
                style={{ borderColor: "rgba(255,215,0,0.25)", backgroundColor: "rgba(255,215,0,0.05)" }}>
                <p className="text-xs text-text-muted mb-1">Pytanie</p>
                <p className="text-sm font-bold leading-snug" style={{ color: "var(--sheriff-gold)" }}>
                  {roundData.questionText}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-text-muted mb-1">
                  Odpowiedź drużyny {roundData.guessingTeamName}
                </p>
                <p className="text-6xl font-black" style={{ color: "var(--sheriff-gold)", fontFamily: "'Bebas Neue',cursive" }}>
                  {submittedNumber}
                  <span className="text-3xl ml-2">{roundData.questionUnit}</span>
                </p>
              </div>

              <p className="text-text-muted text-sm font-medium">
                Prawdziwa wartość jest — Mniej czy Więcej?
              </p>

              <div className="flex gap-3 w-full">
                <motion.button
                  disabled={voted}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVote("mniej")}
                  className="flex-1 flex flex-col items-center gap-2 py-7 rounded-2xl border-2 font-bold disabled:opacity-50 transition-all"
                  style={{
                    borderColor: "rgba(59,130,246,0.5)",
                    backgroundColor: votedChoice === "mniej" ? "rgba(59,130,246,0.22)" : "rgba(59,130,246,0.08)",
                    color: "#3b82f6",
                  }}
                >
                  {submitting && votedChoice === "mniej" ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      <TrendingDown size={30} />
                      <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.15rem", letterSpacing: "0.15em" }}>Mniej</span>
                    </>
                  )}
                </motion.button>

                <motion.button
                  disabled={voted}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleVote("wiecej")}
                  className="flex-1 flex flex-col items-center gap-2 py-7 rounded-2xl border-2 font-bold disabled:opacity-50 transition-all"
                  style={{
                    borderColor: "rgba(239,68,68,0.5)",
                    backgroundColor: votedChoice === "wiecej" ? "rgba(239,68,68,0.22)" : "rgba(239,68,68,0.08)",
                    color: "#ef4444",
                  }}
                >
                  {submitting && votedChoice === "wiecej" ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      <TrendingUp size={30} />
                      <span style={{ fontFamily: "'Bebas Neue',cursive", fontSize: "1.15rem", letterSpacing: "0.15em" }}>Więcej</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ─── VOTING MEMBER ──────────────────────────────────────── */}
          {phase === "voting-member" && roundData && (
            <motion.div key="voting-member"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5 text-center"
            >
              <div className="px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest"
                style={{ borderColor: "rgba(167,139,250,0.4)", backgroundColor: "rgba(167,139,250,0.08)", color: "#a78bfa" }}>
                Twoja drużyna głosuje
              </div>

              <div className="w-full p-5 rounded-2xl border-2"
                style={{ borderColor: "rgba(255,215,0,0.25)", backgroundColor: "rgba(255,215,0,0.05)" }}>
                <p className="text-xs text-text-muted mb-2">Pytanie</p>
                <p className="text-base font-bold leading-snug" style={{ color: "var(--sheriff-gold)" }}>
                  {roundData.questionText}
                </p>
              </div>

              {submittedNumber !== null ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-xs text-text-muted">Odpowiedź drużyny {roundData.guessingTeamName}</p>
                  <p className="text-4xl font-black" style={{ color: "var(--sheriff-gold)", fontFamily: "'Bebas Neue',cursive" }}>
                    {submittedNumber} <span className="text-xl">{roundData.questionUnit}</span>
                  </p>
                  <p className="text-text-muted text-sm mt-1">Kapitan decyduje…</p>
                  <PulsingDots color="#a78bfa" />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-text-muted text-sm">
                    Czekaj na odpowiedź drużyny{" "}
                    <span className="font-bold text-text-primary">{roundData.guessingTeamName}</span>…
                  </p>
                  <PulsingDots color="#a78bfa" />
                </div>
              )}
            </motion.div>
          )}

          {/* ─── RESULT ─────────────────────────────────────────────── */}
          {phase === "result" && resultData && (
            <motion.div key="result"
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-5 text-center w-full"
            >
              {resultData.winningTeamId === teamId ? (
                <motion.div
                  initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 300 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="text-5xl">🎉</div>
                  <p className="text-3xl font-black tracking-widest" style={{ color: "#10b981", fontFamily: "'Bebas Neue',cursive" }}>
                    Wasza drużyna wygrywa!
                  </p>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: "rgba(16,185,129,0.12)", color: "#10b981" }}>
                    <Star size={12} fill="#10b981" />
                    <span className="text-xs font-bold">+1 punkt dla każdego!</span>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="text-5xl">😬</div>
                  <p className="text-3xl font-black tracking-widest" style={{ color: "#ef4444", fontFamily: "'Bebas Neue',cursive" }}>
                    Nie tym razem
                  </p>
                </div>
              )}

              <div className="w-full p-5 rounded-2xl border-2"
                style={{ borderColor: "rgba(16,185,129,0.35)", backgroundColor: "rgba(16,185,129,0.05)" }}>
                <p className="text-xs uppercase tracking-widest text-text-muted mb-1">Prawidłowa odpowiedź</p>
                <p className="text-5xl font-black" style={{ color: "#10b981", fontFamily: "'Bebas Neue',cursive" }}>
                  {resultData.correctAnswer.toLocaleString("pl-PL")}{" "}
                  <span className="text-2xl">{resultData.unit}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border"
                style={{ borderColor: "rgba(255,215,0,0.3)", backgroundColor: "rgba(255,215,0,0.06)", color: "var(--sheriff-gold)" }}>
                <Star size={14} fill="var(--sheriff-gold)" />
                <span className="font-bold text-sm">Twój wynik: {myScore} pkt</span>
              </div>

              <p className="text-text-muted text-xs">Czekaj na kolejną rundę…</p>
            </motion.div>
          )}

          {/* ─── FINISHED ───────────────────────────────────────────── */}
          {phase === "finished" && (
            <motion.div key="finished"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-5 text-center w-full"
            >
              <Trophy size={48} style={{ color: "var(--sheriff-gold)" }} />
              <h2 className="text-4xl tracking-widest shimmer-text" style={{ fontFamily: "'Bebas Neue',cursive" }}>
                KONIEC GRY
              </h2>

              <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl border-2"
                style={{ borderColor: "rgba(255,215,0,0.4)", backgroundColor: "rgba(255,215,0,0.06)" }}>
                {avatar}
              </div>
              <div>
                <p className="text-text-muted text-sm">{playerName}</p>
                {teamName && <p className="text-xs mt-0.5" style={{ color: "var(--neon-pink)" }}>{teamName}</p>}
              </div>

              <div className="flex items-center gap-2 px-6 py-3 rounded-xl border"
                style={{ borderColor: "rgba(255,215,0,0.4)", backgroundColor: "rgba(255,215,0,0.08)" }}>
                <Star size={16} fill="var(--sheriff-gold)" style={{ color: "var(--sheriff-gold)" }} />
                <span className="font-black text-2xl" style={{ color: "var(--sheriff-gold)", fontFamily: "'Bebas Neue',cursive", letterSpacing: "0.1em" }}>
                  {myScore} PUNKTÓW
                </span>
              </div>

              {scores.length > 0 && (
                <div className="w-full flex flex-col gap-2">
                  <p className="text-xs uppercase tracking-widest text-text-muted">Wyniki końcowe</p>
                  {[...scores].sort((a, b) => b.score - a.score).map((s, i) => (
                    <div key={s.playerId} className="flex items-center gap-3 p-3 rounded-xl border"
                      style={{
                        borderColor: s.playerId === playerId ? "rgba(255,215,0,0.35)" : "rgba(255,220,180,0.1)",
                        backgroundColor: s.playerId === playerId ? "rgba(255,215,0,0.06)" : "transparent",
                      }}>
                      <span className="text-text-muted text-xs w-5">#{i + 1}</span>
                      <span className="text-sm font-semibold flex-1 text-left"
                        style={{ color: s.playerId === playerId ? "var(--sheriff-gold)" : "var(--text-primary)" }}>
                        {s.playerName}
                        {s.playerTeamName && (
                          <span className="text-text-muted text-xs ml-1">({s.playerTeamName})</span>
                        )}
                      </span>
                      <span className="font-bold text-sm"
                        style={{ color: s.playerId === playerId ? "var(--sheriff-gold)" : "var(--text-primary)" }}>
                        {s.score}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
