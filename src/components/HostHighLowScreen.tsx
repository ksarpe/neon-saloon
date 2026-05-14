"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ChevronRight, Users, Zap, Star, Flag, Menu, X } from "lucide-react";
import { useGameSocket } from "@/hooks/useGameSocket";
import { useBackButton } from "@/lib/back-button-context";
import { GameSummary } from "@/components/GameSummary";
import { HIGHLOW_QUESTIONS } from "@/lib/highlow";
import type { HighLowRoundResultPayload, ScoreEntry, PlayerJoinedPayload } from "@/lib/pusher-server";
import type { SessionTeam, SessionPlayer } from "@/lib/redis";

// ─── Types ────────────────────────────────────────────────────────────────────

type HLPhase = "lobby" | "guessing" | "voting" | "revealed" | "finished";

interface HostHighLowScreenProps {
  pin: string;
  team1: SessionTeam;
  team2: SessionTeam;
  initialPlayers: SessionPlayer[];
}

// ─── Lobby ────────────────────────────────────────────────────────────────────

function HighLowLobby({
  pin, players, team1, team2, onStart,
}: {
  pin: string;
  players: SessionPlayer[];
  team1: SessionTeam;
  team2: SessionTeam;
  onStart: () => void;
}) {
  const team1Players = players.filter((p) => p.teamId === team1.teamId);
  const team2Players = players.filter((p) => p.teamId === team2.teamId);
  const canStart = team1Players.length > 0 && team2Players.length > 0;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-6xl sm:text-8xl tracking-widest shimmer-text mt-2" style={{ fontFamily: "'Bebas Neue',cursive" }}>
          mniej czy więcej
        </h1>
        <p className="text-text-muted text-xs uppercase tracking-widest mt-2">Gracze dołączają do swoich drużyn</p>
      </div>

      {/* PIN */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs uppercase tracking-widest font-semibold text-text-muted">KOD SZERYFA</p>
        <div className="flex gap-3">
          {pin.split("").map((d, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }}
              className="w-20 h-24 sm:w-28 sm:h-32 rounded-2xl border-2 flex items-center justify-center text-5xl sm:text-6xl font-bold"
              style={{ fontFamily: "'Bebas Neue',cursive", color: "var(--neon-pink)", borderColor: "var(--neon-pink)", backgroundColor: "rgba(255,16,240,0.07)" }}
            >
              {d}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Teams */}
      <div className="w-full grid grid-cols-2 gap-4">
        {[{ team: team1, players: team1Players, accent: "var(--neon-pink)" }, { team: team2, players: team2Players, accent: "var(--sheriff-gold)" }].map(({ team, players: tp, accent }) => (
          <div key={team.teamId} className="flex flex-col gap-3 p-4 rounded-2xl border" style={{ borderColor: `${accent}44`, backgroundColor: `${accent}0d` }}>
            <p className="font-bold text-sm uppercase tracking-widest" style={{ color: accent }}>{team.teamName}</p>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {tp.map((p) => (
                  <motion.div
                    key={p.playerId}
                    layout
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.7 }}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-semibold"
                    style={{ borderColor: `${accent}55`, backgroundColor: `${accent}15`, color: accent }}
                  >
                    <span>{p.avatar}</span>
                    <span>{p.playerName}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              {tp.length === 0 && <p className="text-text-muted text-xs opacity-50">Oczekuję na graczy…</p>}
            </div>
          </div>
        ))}
      </div>

      <motion.button
        disabled={!canStart}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="flex items-center gap-3 px-10 py-5 rounded-2xl text-white disabled:opacity-30"
        style={{ background: "linear-gradient(135deg,var(--neon-pink),#c800c8)", boxShadow: "0 4px 40px rgba(255,16,240,0.5)", fontFamily: "'Bebas Neue',cursive", fontSize: "1.15rem", letterSpacing: "0.15em" }}
      >
        <Play size={22} /> Rozpocznij grę
      </motion.button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function HostHighLowScreen({ pin, team1, team2, initialPlayers }: HostHighLowScreenProps) {
  const { setHidden: setBackHidden } = useBackButton();
  useEffect(() => {
    setBackHidden(true);
    return () => setBackHidden(false);
  }, [setBackHidden]);

  const [phase, setPhase] = useState<HLPhase>("lobby");
  const [players, setPlayers] = useState<SessionPlayer[]>(initialPlayers);
  const [roundIndex, setRoundIndex] = useState(0);
  const [guessingTeamId, setGuessingTeamId] = useState(team1.teamId);
  const [captainIndices, setCaptainIndices] = useState<Record<string, number>>({ [team1.teamId]: 0, [team2.teamId]: 0 });
  const [submittedNumber, setSubmittedNumber] = useState<string | null>(null);
  const [resultData, setResultData] = useState<HighLowRoundResultPayload | null>(null);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const votingTeamId = guessingTeamId === team1.teamId ? team2.teamId : team1.teamId;
  const guessingTeam = guessingTeamId === team1.teamId ? team1 : team2;
  const votingTeam = votingTeamId === team1.teamId ? team1 : team2;

  const teamPlayers = useCallback((teamId: string) =>
    players.filter((p) => p.teamId === teamId), [players]);

  const currentCaptain = useCallback((teamId: string) => {
    const tp = teamPlayers(teamId);
    if (!tp.length) return null;
    return tp[(captainIndices[teamId] ?? 0) % tp.length];
  }, [teamPlayers, captainIndices]);

  const currentQuestion = useMemo(
    () => HIGHLOW_QUESTIONS[roundIndex % HIGHLOW_QUESTIONS.length],
    [roundIndex],
  );

  // Poll for players in lobby
  useEffect(() => {
    if (phase !== "lobby") return;
    const id = setInterval(() => {
      fetch(`/api/sessions/${pin}`).then((r) => r.json()).then((d) => {
        if (d.players) setPlayers(d.players);
      }).catch(() => {});
    }, 3000);
    return () => clearInterval(id);
  }, [phase, pin]);

  useGameSocket(pin, {
    onPlayerJoined: useCallback((d: PlayerJoinedPayload) => {
      setPlayers((p) => p.some((x) => x.playerId === d.playerId) ? p : [...p, { ...d, teamName: d.teamName ?? null }]);
    }, []),
    onHighLowNumberSubmitted: useCallback((d: { number: string }) => {
      setSubmittedNumber(d.number);
      setPhase("voting");
    }, []),
    onHighLowRoundResult: useCallback((d: HighLowRoundResultPayload) => {
      setResultData(d);
      setScores(d.scores);
      setPhase("revealed");
    }, []),
    onGameFinished: useCallback(() => setPhase("finished"), []),
  });

  const startRound = useCallback(async (rIdx: number, gTeamId: string) => {
    const gCaptain = currentCaptain(gTeamId);
    const vTeamId = gTeamId === team1.teamId ? team2.teamId : team1.teamId;
    const vCaptain = currentCaptain(vTeamId);
    if (!gCaptain || !vCaptain) return;

    const q = HIGHLOW_QUESTIONS[rIdx % HIGHLOW_QUESTIONS.length];
    const gTeam = gTeamId === team1.teamId ? team1 : team2;
    const vTeam = vTeamId === team1.teamId ? team1 : team2;

    await fetch(`/api/sessions/${pin}/highlow/round`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roundIndex: rIdx,
        questionText: q.text,
        questionUnit: q.unit,
        guessingTeamId: gTeamId,
        guessingTeamName: gTeam.teamName,
        votingTeamId: vTeamId,
        votingTeamName: vTeam.teamName,
        guessingCaptainId: gCaptain.playerId,
        votingCaptainId: vCaptain.playerId,
      }),
    });

    setSubmittedNumber(null);
    setResultData(null);
    setPhase("guessing");
  }, [currentCaptain, pin, team1, team2]);

  const handleStart = useCallback(() => {
    startRound(0, team1.teamId);
  }, [startRound, team1.teamId]);

  const handleNextRound = useCallback(async () => {
    const nextRoundIndex = roundIndex + 1;
    const nextGuessingTeamId = votingTeamId; // swap teams
    const newCaptainIndices = {
      ...captainIndices,
      [guessingTeamId]: (captainIndices[guessingTeamId] ?? 0) + 1,
      [votingTeamId]: (captainIndices[votingTeamId] ?? 0) + 1,
    };
    setRoundIndex(nextRoundIndex);
    setGuessingTeamId(nextGuessingTeamId);
    setCaptainIndices(newCaptainIndices);
    await startRound(nextRoundIndex, nextGuessingTeamId);
  }, [roundIndex, votingTeamId, guessingTeamId, captainIndices, startRound]);

  const handleFinish = useCallback(async () => {
    setMenuOpen(false);
    await fetch(`/api/sessions/${pin}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "finish", scores, teamScores: [] }),
    });
    setPhase("finished");
  }, [pin, scores]);

  const guessingCaptain = currentCaptain(guessingTeamId);
  const votingCaptain = currentCaptain(votingTeamId);

  return (
    <div className="w-full min-h-dvh flex flex-col">
      {/* Glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0">
        <div className="absolute top-[-20%] left-[-15%] w-[60vw] h-[60vw] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle,var(--neon-pink) 0%,transparent 70%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-[-20%] right-[-15%] w-[60vw] h-[60vw] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle,var(--sheriff-gold) 0%,transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* Header */}
      <div className="relative z-20 shrink-0 border-b" style={{ borderColor: "rgba(255,220,180,0.1)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-3 items-center px-6 py-4">
          <div className="flex items-center gap-2">
            <Zap size={14} style={{ color: "var(--neon-pink)" }} />
            <span className="text-xs uppercase tracking-widest font-semibold text-text-muted">PIN: <span className="text-text-primary">{pin}</span></span>
          </div>
          <div className="flex justify-center">
            {phase !== "lobby" && phase !== "finished" && (
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border" style={{ color: "var(--sheriff-gold)", borderColor: "rgba(255,215,0,0.35)", backgroundColor: "rgba(255,215,0,0.08)" }}>
                Runda {roundIndex + 1}
              </span>
            )}
          </div>
          <div className="flex justify-end items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--neon-pink)" }} />
              <span className="text-xs text-text-muted font-bold">LIVE</span>
            </div>
            {phase !== "finished" && (
              <div className="relative">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setMenuOpen((o) => !o)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border"
                  style={{ borderColor: "rgba(255,220,180,0.18)", backgroundColor: "rgba(255,220,180,0.05)", color: "rgba(255,220,180,0.65)" }}>
                  {menuOpen ? <X size={15} /> : <Menu size={15} />}
                </motion.button>
                <AnimatePresence>
                  {menuOpen && (
                    <motion.div initial={{ opacity: 0, scale: 0.92, y: -6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
                      className="absolute right-0 top-10 z-[100] min-w-[180px] rounded-2xl border p-1.5 shadow-xl"
                      style={{ borderColor: "rgba(255,220,180,0.15)", backgroundColor: "rgba(13,8,24,0.95)", backdropFilter: "blur(16px)" }}>
                      <button onClick={handleFinish} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-left" style={{ color: "#ef4444" }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)")}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                        <Flag size={14} /> Zakończ grę
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto">
          <AnimatePresence mode="wait">

            {phase === "lobby" && (
              <motion.div key="lobby" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <HighLowLobby pin={pin} players={players} team1={team1} team2={team2} onStart={handleStart} />
              </motion.div>
            )}

            {(phase === "guessing" || phase === "voting") && (
              <motion.div key={`round-${roundIndex}-${phase}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-8 text-center">

                {/* Scores bar */}
                {scores.length > 0 && (
                  <div className="flex gap-4 flex-wrap justify-center">
                    {[team1, team2].map((team) => {
                      const total = scores.filter((s) => s.playerTeamId === team.teamId).reduce((sum, s) => sum + s.score, 0);
                      const accent = team.teamId === team1.teamId ? "var(--neon-pink)" : "var(--sheriff-gold)";
                      return (
                        <div key={team.teamId} className="flex items-center gap-2 px-4 py-2 rounded-xl border" style={{ borderColor: `${accent}44`, backgroundColor: `${accent}0d` }}>
                          <span className="text-xs font-bold" style={{ color: accent }}>{team.teamName}</span>
                          <div className="flex items-center gap-1">
                            <Star size={11} fill={accent} style={{ color: accent }} />
                            <span className="font-black text-sm" style={{ color: accent }}>{total}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Question */}
                <div className="w-full p-8 rounded-3xl border-2 flex flex-col gap-4"
                  style={{ borderColor: "rgba(255,215,0,0.25)", backgroundColor: "rgba(255,215,0,0.05)" }}>
                  <p className="text-xs uppercase tracking-widest text-text-muted font-semibold">Pytanie</p>
                  <p className="text-2xl sm:text-3xl font-bold leading-snug" style={{ color: "var(--sheriff-gold)" }}>
                    {currentQuestion.text}
                  </p>
                  <p className="text-sm text-text-muted">Odpowiedź w: <span className="font-bold text-text-primary">{currentQuestion.unit}</span></p>
                </div>

                {/* Phase info */}
                {phase === "guessing" && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="px-4 py-2 rounded-full border text-sm font-bold" style={{ borderColor: "rgba(255,16,240,0.4)", backgroundColor: "rgba(255,16,240,0.08)", color: "var(--neon-pink)" }}>
                      {guessingTeam.teamName} zgaduje
                    </div>
                    <p className="text-text-muted text-sm">
                      Kapitan: <span className="font-bold text-text-primary">{guessingCaptain?.playerName ?? "—"}</span> podaje liczbę na telefonie
                    </p>
                    <div className="flex items-center gap-2 animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-neon-pink" style={{ backgroundColor: "var(--neon-pink)" }} />
                      <span className="text-xs text-text-muted">Oczekuję na odpowiedź...</span>
                    </div>
                  </div>
                )}

                {phase === "voting" && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="px-6 py-4 rounded-2xl border-2 text-center"
                      style={{ borderColor: "rgba(255,215,0,0.4)", backgroundColor: "rgba(255,215,0,0.06)" }}>
                      <p className="text-xs uppercase tracking-widest text-text-muted mb-1">Odpowiedź drużyny {guessingTeam.teamName}</p>
                      <p className="text-5xl font-black" style={{ color: "var(--sheriff-gold)", fontFamily: "'Bebas Neue',cursive" }}>
                        {submittedNumber} <span className="text-2xl">{currentQuestion.unit}</span>
                      </p>
                    </div>
                    <div className="px-4 py-2 rounded-full border text-sm font-bold" style={{ borderColor: "rgba(167,139,250,0.4)", backgroundColor: "rgba(167,139,250,0.08)", color: "#a78bfa" }}>
                      {votingTeam.teamName} odpowiada
                    </div>
                    <p className="text-text-muted text-sm">
                      Kapitan: <span className="font-bold text-text-primary">{votingCaptain?.playerName ?? "—"}</span> klika Mniej lub Więcej
                    </p>
                    <div className="flex items-center gap-2 animate-pulse">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "#a78bfa" }} />
                      <span className="text-xs text-text-muted">Oczekuję na głos...</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {phase === "revealed" && resultData && (
              <motion.div key={`revealed-${roundIndex}`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-8 text-center">

                {/* Result */}
                <div className="w-full max-w-lg flex flex-col gap-4">
                  <p className="text-xs uppercase tracking-widest text-text-muted font-semibold">Prawidłowa odpowiedź</p>
                  <div className="p-6 rounded-3xl border-2" style={{ borderColor: "rgba(16,185,129,0.4)", backgroundColor: "rgba(16,185,129,0.06)" }}>
                    <p className="text-6xl font-black" style={{ color: "#10b981", fontFamily: "'Bebas Neue',cursive" }}>
                      {resultData.correctAnswer.toLocaleString("pl-PL")} <span className="text-3xl">{resultData.unit}</span>
                    </p>
                    {HIGHLOW_QUESTIONS[roundIndex % HIGHLOW_QUESTIONS.length].hint && (
                      <p className="text-xs text-text-muted mt-2">{HIGHLOW_QUESTIONS[roundIndex % HIGHLOW_QUESTIONS.length].hint}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl border" style={{ borderColor: "rgba(255,220,180,0.15)", backgroundColor: "rgba(255,220,180,0.04)" }}>
                      <p className="text-xs text-text-muted mb-1">Odpowiedź {guessingTeam.teamName}</p>
                      <p className="text-2xl font-black" style={{ color: "var(--sheriff-gold)" }}>{resultData.guessingTeamGuess.toLocaleString("pl-PL")} {resultData.unit}</p>
                    </div>
                    <div className="p-4 rounded-2xl border" style={{
                      borderColor: resultData.captainVote === resultData.correctVote ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)",
                      backgroundColor: resultData.captainVote === resultData.correctVote ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
                    }}>
                      <p className="text-xs text-text-muted mb-1">Głos {votingTeam.teamName}</p>
                      <p className="text-2xl font-black" style={{ color: resultData.captainVote === resultData.correctVote ? "#10b981" : "#ef4444" }}>
                        {resultData.captainVote === "mniej" ? "Mniej" : "Więcej"}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl border-2" style={{ borderColor: "rgba(255,215,0,0.4)", backgroundColor: "rgba(255,215,0,0.07)" }}>
                    <p className="text-xs text-text-muted uppercase tracking-widest mb-1">Punkt dla</p>
                    <p className="text-3xl font-black tracking-widest" style={{ color: "var(--sheriff-gold)", fontFamily: "'Bebas Neue',cursive" }}>
                      {resultData.winningTeamName}
                    </p>
                  </div>
                </div>

                <motion.button whileTap={{ scale: 0.97 }} onClick={handleNextRound}
                  className="flex items-center gap-2 px-8 py-4 rounded-2xl text-white"
                  style={{ background: "linear-gradient(135deg,var(--neon-pink),#c800c8)", fontFamily: "'Bebas Neue',cursive", letterSpacing: "0.1em", fontSize: "1.1rem" }}>
                  Następna runda <ChevronRight size={18} />
                </motion.button>
              </motion.div>
            )}

            {phase === "finished" && (
              <motion.div key="finished" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                <GameSummary
                  scores={scores.map((s) => ({ id: s.playerId, name: s.playerName, score: s.score }))}
                  teamScores={[team1, team2].map((t) => ({
                    id: t.teamId,
                    name: t.teamName,
                    score: scores.filter((s) => s.playerTeamId === t.teamId).reduce((sum, s) => sum + s.score, 0),
                  }))}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
