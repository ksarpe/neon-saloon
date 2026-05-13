"use client";

import React from "react";
import { motion } from "framer-motion";

const ACCENT: Record<string, string> = {
  trivia: "#8b2be2",
  QUIZ: "#8b2be2",
  charades: "#1e90ff",
  action: "#f59e0b",
  dare: "#ff10f0",
};

export const CARD_W = 320;
export const CARD_H = 200;

// Minimal shape required — compatible with both GameCard and WireCard
export interface CardLike {
  id: string;
  type: string;
  description: string;
  options?: string[];
  answer?: string | null;
}

// ─── Card face (back or front) ─────────────────────────────────────────────

export function CardFace({
  children,
  flipped = false,
}: {
  children: React.ReactNode;
  flipped?: boolean;
}) {
  return (
    <div
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        backgroundImage: "url('/bg/card1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}
    >
      <div className="relative w-full h-full">{children}</div>
    </div>
  );
}

// ─── Card stack ────────────────────────────────────────────────────────────

export function GameCardStack({
  card,
  cardsLeft = 4,
  isFlipped,
  isRevealed = false,
  onFlip,
}: {
  card: CardLike;
  cardsLeft?: number;
  isFlipped: boolean;
  isRevealed?: boolean;
  onFlip: () => void;
}) {
  const accent = ACCENT[card.type] ?? "var(--neon-pink)";
  const shadows = Math.min((cardsLeft ?? 1) - 1, 3);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ perspective: "1200px", width: CARD_W + 20, height: CARD_H + 20 }}
    >
      {/* Shadow cards */}
      {Array.from({ length: shadows }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-2xl overflow-hidden"
          style={{
            width: CARD_W,
            height: CARD_H,
            backgroundImage: "url('/bg/card1.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `translateY(${(i + 1) * -7}px) rotate(${(i % 2 === 0 ? 1 : -1) * (i + 1) * 1.8}deg)`,
            zIndex: shadows - i,
          }}
        >
        </div>
      ))}

      {/* Active card — 3D flip */}
      <motion.div
        className="absolute cursor-pointer"
        style={{
          zIndex: 10,
          width: CARD_W,
          height: CARD_H,
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateY: isRevealed ? 360 : isFlipped ? 180 : 0,
          rotate: isFlipped || isRevealed ? -5 : 0,
          x: isFlipped || isRevealed ? 20 : 0,
          y: isFlipped || isRevealed ? 8 : 0,
        }}
        transition={{ type: "spring", stiffness: 180, damping: 22 }}
        onClick={!isFlipped ? onFlip : undefined}
        whileHover={
          !isFlipped ? { rotateX: 14, rotateZ: -4, scale: 1.04, y: -3 } : {}
        }
      >
        {/* BACK face */}
        <CardFace>
          {!isRevealed ? (
            <div className="w-full h-full flex items-center justify-center">
              <p
                className="text-sm uppercase tracking-[0.25em] font-bold"
                style={{
                  color: "var(--neon-pink)",
                  textShadow:
                    "0 0 12px var(--neon-pink), 0 0 30px rgba(221,84,162,0.5)",
                }}
              >
                odsłoń dziką kartę
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 px-6 text-center">
              <span className="text-3xl">🎉</span>
              <p
                className="text-base font-bold leading-snug"
                style={{ color: "var(--sheriff-gold)" }}
              >
                {card.answer ?? "Czas minął!"}
              </p>
            </div>
          )}
        </CardFace>

        {/* FRONT face */}
        <CardFace flipped>
          <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center">
            <p className="text-lg font-bold leading-snug" style={{ color: "#1a1a1a" }}>
              {card.description}
            </p>
          </div>
        </CardFace>
      </motion.div>
    </div>
  );
}
