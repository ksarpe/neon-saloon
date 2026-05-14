"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Star, Home, Users, User } from "lucide-react";

export interface SummaryScore {
  id: string;
  name: string;
  score: number;
}

const MEDALS = ["🥇", "🥈", "🥉"];

const RANK_STYLES = [
  { border: "rgba(192,192,192,0.5)", bg: "rgba(192,192,192,0.06)" },
  { border: "rgba(205,127,50,0.5)", bg: "rgba(205,127,50,0.06)" },
];

function RankingList({ scores }: { scores: SummaryScore[] }) {
  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const winner = sorted[0] ?? null;
  const rest = sorted.slice(1);

  return (
    <>
      {winner ? (
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.1,
            type: "spring",
            stiffness: 220,
            damping: 18,
          }}
          className="w-full p-6 rounded-2xl border-2 flex flex-col items-center gap-3"
          style={{
            borderColor: "var(--sheriff-gold)",
            backgroundColor: "rgba(255,215,0,0.07)",
            boxShadow: "0 0 48px rgba(255,215,0,0.22)",
          }}
        >
          <motion.span
            className="text-5xl"
            animate={{ rotate: [0, -8, 8, -8, 0] }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            👑
          </motion.span>
          <p
            className="text-3xl font-black tracking-wide leading-tight"
            style={{
              fontFamily: "'Bebas Neue',cursive",
              color: "var(--sheriff-gold)",
              letterSpacing: "0.08em",
              textShadow: "0 0 24px rgba(255,215,0,0.6)",
            }}
          >
            {winner.name}
          </p>
          <div className="flex items-center gap-1.5">
            <Star
              size={16}
              fill="var(--sheriff-gold)"
              style={{ color: "var(--sheriff-gold)" }}
            />
            <span
              className="text-2xl font-black"
              style={{ color: "var(--sheriff-gold)" }}
            >
              {winner.score}
            </span>
            <span className="text-text-muted text-sm">
              {winner.score === 1 ? "punkt" : "punkty"}
            </span>
          </div>
        </motion.div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-text-muted text-sm"
        >
          Tym razem nikt nie zdobył punktów
        </motion.p>
      )}

      {rest.length > 0 && (
        <div className="w-full flex flex-col gap-2">
          {rest.map((s, i) => {
            const rank = i + 2;
            const style = RANK_STYLES[i] ?? {
              border: "var(--saloon-border)",
              bg: "var(--saloon-surface)",
            };
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: -18 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.07 }}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl border"
                style={{ borderColor: style.border, backgroundColor: style.bg }}
              >
                <span className="text-xl w-8 text-center shrink-0">
                  {MEDALS[rank - 1] ?? (
                    <span className="text-text-muted text-xs font-bold">
                      {rank}.
                    </span>
                  )}
                </span>
                <span className="flex-1 font-bold text-sm text-text-primary text-left">
                  {s.name}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <Star
                    size={11}
                    fill="var(--sheriff-gold)"
                    style={{ color: "var(--sheriff-gold)" }}
                  />
                  <span
                    className="font-bold text-sm tabular-nums"
                    style={{ color: "var(--sheriff-gold)" }}
                  >
                    {s.score}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
}

export function GameSummary({
  scores,
  teamScores,
  homeHref = "/graj",
}: {
  scores: SummaryScore[];
  teamScores?: SummaryScore[];
  homeHref?: string;
}) {
  const hasTeams = !!teamScores && teamScores.length > 0;
  const [tab, setTab] = useState<"players" | "teams">("players");

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto text-center">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="text-6xl sm:text-7xl tracking-widest shimmer-text"
          style={{ fontFamily: "'Bebas Neue',cursive" }}
        >
          Game Over, Cowgirls!
        </h1>
        <p className="text-text-muted text-xs uppercase tracking-widest mt-2">
          Końcowy ranking kowbojek
        </p>
      </motion.div>

      {/* Tab switcher — only if teams present */}
      {hasTeams && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex gap-1 p-1 rounded-xl self-stretch"
          style={{ backgroundColor: "rgba(255,220,180,0.05)" }}
        >
          <button
            onClick={() => setTab("players")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200"
            style={{
              backgroundColor:
                tab === "players" ? "rgba(255,16,240,0.12)" : "transparent",
              color:
                tab === "players"
                  ? "var(--neon-pink)"
                  : "rgba(255,220,180,0.45)",
              boxShadow:
                tab === "players"
                  ? "inset 0 0 0 1px rgba(255,16,240,0.2)"
                  : "none",
            }}
          >
            <User size={13} />
            Gracze
          </button>
          <button
            onClick={() => setTab("teams")}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200"
            style={{
              backgroundColor:
                tab === "teams" ? "rgba(249,74,255,0.12)" : "transparent",
              color:
                tab === "teams"
                  ? "var(--sheriff-gold)"
                  : "rgba(255,220,180,0.45)",
              boxShadow:
                tab === "teams"
                  ? "inset 0 0 0 1px rgba(249,74,255,0.2)"
                  : "none",
            }}
          >
            <Users size={13} />
            Zespoły
          </button>
        </motion.div>
      )}

      {/* Ranking */}
      {tab === "players" || !hasTeams ? (
        <RankingList scores={scores} />
      ) : (
        <RankingList scores={teamScores!} />
      )}

      {/* Home button */}
      <motion.a
        href={homeHref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-2 flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white w-full"
        style={{
          background: "linear-gradient(135deg,var(--neon-pink),#c800c8)",
          fontFamily: "'Bebas Neue',cursive",
          letterSpacing: "0.12em",
          fontSize: "1.1rem",
          boxShadow: "0 4px 32px rgba(255,16,240,0.4)",
        }}
      >
        Wróć do menu głównego
      </motion.a>
    </div>
  );
}
