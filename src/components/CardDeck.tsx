"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
import type { GameCard } from "@/lib/store";
import { useGameStore } from "@/lib/store";
import ReactCanvasConfetti from "react-canvas-confetti";
import type { TCanvasConfettiInstance, TOnInitComponentFn } from "react-canvas-confetti/dist/types";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";

// ─── Card type config ────────────────────────────────────────────────────────

const CARD_CONFIG: Record<
  GameCard["type"],
  {
    label: string;
    bgClass: string;
    accentColor: string;
    labelColor: string;
    badgeBg: string;
    stripeColor: string;
  }
> = {
  trivia: {
    label: "🤠 Bride Trivia",
    bgClass: "card-trivia",
    accentColor: "#8b2be2",
    labelColor: "#c084fc",
    badgeBg: "rgba(139,43,226,0.2)",
    stripeColor: "#7c3aed",
  },
  charades: {
    label: "🎭 Charades",
    bgClass: "card-charades",
    accentColor: "#1e90ff",
    labelColor: "#60a5fa",
    badgeBg: "rgba(30,144,255,0.2)",
    stripeColor: "#2563eb",
  },
  action: {
    label: "🤠 Cowgirl Dare",
    bgClass: "card-action",
    accentColor: "#f59e0b",
    labelColor: "#fbbf24",
    badgeBg: "rgba(245,158,11,0.2)",
    stripeColor: "#d97706",
  },
  dare: {
    label: "🌶️ Spicy Dare",
    bgClass: "card-dare",
    accentColor: "#ff10f0",
    labelColor: "#f9a8d4",
    badgeBg: "rgba(255,16,240,0.2)",
    stripeColor: "#db2777",
  },
};

// ─── Card Back face ──────────────────────────────────────────────────────────

function CardBackFace() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl overflow-hidden card-face"
      style={{ backfaceVisibility: "hidden" }}
    >
      {/* Felt texture */}
      <div className="absolute inset-0 bg-saloon-card" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 8px,
            rgba(255,215,0,0.08) 8px,
            rgba(255,215,0,0.08) 9px
          )`,
        }}
      />
      {/* Border */}
      <div
        className="absolute inset-0 rounded-2xl border-2"
        style={{ borderColor: "var(--sheriff-gold)", opacity: 0.5 }}
      />
      <div
        className="absolute inset-3 rounded-xl border"
        style={{ borderColor: "var(--sheriff-gold)", opacity: 0.3 }}
      />

      {/* Center emblem */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-3"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="text-7xl select-none drop-shadow-lg">🤠</span>
        <div className="flex flex-col items-center gap-1">
          <span
            className="font-bebas text-3xl tracking-[0.25em] shimmer-text"
            style={{ fontFamily: "'Bebas Neue', cursive" }}
          >
            NEON SALOON
          </span>
          <p className="text-[10px] text-text-muted uppercase tracking-widest">
            Tap to reveal your fate
          </p>
        </div>
      </motion.div>

      {/* Corner stars */}
      {[
        "top-3 left-3",
        "top-3 right-3",
        "bottom-3 left-3",
        "bottom-3 right-3",
      ].map((pos, i) => (
        <span
          key={i}
          className={`absolute ${pos} text-xl select-none opacity-50`}
          style={{ color: "var(--sheriff-gold)" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// ─── Card Front face ─────────────────────────────────────────────────────────

function CardFrontFace({ card }: { card: GameCard }) {
  const cfg = CARD_CONFIG[card.type];

  return (
    <div
      className={`absolute inset-0 flex flex-col rounded-2xl overflow-hidden card-face ${cfg.bgClass}`}
      style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
    >
      {/* Top accent stripe */}
      <div
        className="h-1.5 w-full shrink-0"
        style={{ background: `linear-gradient(90deg, ${cfg.stripeColor}, ${cfg.accentColor})` }}
      />

      {/* Type badge */}
      <div className="px-5 pt-4 pb-2">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border"
          style={{
            color: cfg.labelColor,
            borderColor: `${cfg.accentColor}60`,
            backgroundColor: cfg.badgeBg,
          }}
        >
          {cfg.label}
        </span>
      </div>

      {/* Points badge top-right */}
      <div className="absolute top-4 right-4">
        <div
          className="flex flex-col items-center justify-center w-11 h-11 rounded-full border-2 font-bold"
          style={{
            borderColor: "var(--sheriff-gold)",
            color: "var(--sheriff-gold)",
            backgroundColor: "rgba(255,215,0,0.1)",
            boxShadow: "0 0 12px rgba(255,215,0,0.3)",
          }}
        >
          <span className="text-sm leading-none">{card.points}</span>
          <span className="text-[8px] leading-none opacity-70">pts</span>
        </div>
      </div>

      {/* Card description */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 text-center">
        <motion.p
          className="text-text-primary text-xl sm:text-2xl font-bold leading-snug"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          {card.description}
        </motion.p>
      </div>

      {/* Bottom swipe hint */}
      <div className="flex items-center justify-between px-5 pb-5 pt-2">
        <div className="flex items-center gap-1.5 text-red-400 text-[11px] font-semibold">
          <XCircle size={14} />
          <span>Swipe left to fail</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-semibold">
          <span>Swipe right</span>
          <CheckCircle size={14} />
        </div>
      </div>

      {/* Bottom accent stripe */}
      <div
        className="h-1 w-full shrink-0"
        style={{ background: `linear-gradient(90deg, ${cfg.accentColor}, ${cfg.stripeColor})` }}
      />
    </div>
  );
}

// ─── Shadow cards (stack effect) ────────────────────────────────────────────

function StackedShadowCards({ count = 2 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-2xl bg-saloon-surface border border-saloon-border"
          style={{
            transform: `translateY(${(i + 1) * 6}px) scale(${1 - (i + 1) * 0.025})`,
            opacity: 0.6 - i * 0.2,
            zIndex: -(i + 1),
          }}
        />
      ))}
    </>
  );
}

// ─── Confetti hook ───────────────────────────────────────────────────────────

function useConfetti() {
  const confettiRef = useRef<TCanvasConfettiInstance | null>(null);

  const onInit: TOnInitComponentFn = useCallback(({ confetti }) => {
    confettiRef.current = confetti;
  }, []);

  const fire = useCallback(() => {
    if (!confettiRef.current) return;
    confettiRef.current({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5, x: 0.5 },
      colors: ["#FF10F0", "#FFD700", "#FF6B6B", "#4ECDC4", "#ffffff"],
      startVelocity: 35,
      gravity: 0.9,
      ticks: 200,
      scalar: 1.1,
    });
  }, []);

  return { onInit, fire };
}

// ─── Swipe indicator overlay ─────────────────────────────────────────────────

function SwipeIndicator({
  direction,
}: {
  direction: "left" | "right" | "none";
}) {
  return (
    <>
      <AnimatePresence>
        {direction === "right" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="absolute inset-0 flex items-center justify-center rounded-2xl pointer-events-none z-20"
            style={{ backgroundColor: "rgba(16,185,129,0.25)" }}
          >
            <div className="bg-emerald-500 rounded-full p-3 shadow-lg">
              <CheckCircle size={48} className="text-white" />
            </div>
          </motion.div>
        )}
        {direction === "left" && (
          <motion.div
            key="fail"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="absolute inset-0 flex items-center justify-center rounded-2xl pointer-events-none z-20"
            style={{ backgroundColor: "rgba(239,68,68,0.25)" }}
          >
            <div className="bg-red-500 rounded-full p-3 shadow-lg">
              <XCircle size={48} className="text-white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main CardDeck component ─────────────────────────────────────────────────

interface CardDeckProps {
  onSuccess: () => void;
  onFail: () => void;
}

export default function CardDeck({ onSuccess, onFail }: CardDeckProps) {
  const {
    deck,
    currentCardIndex,
    isCardFlipped,
    flipCard,
    nextCard,
    participants,
    currentParticipantIndex,
    incrementScore,
  } = useGameStore();

  const card = deck[currentCardIndex];
  const currentPlayer = participants[currentParticipantIndex];

  // Motion values for drag
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Derived transforms
  const rotate = useTransform(x, [-200, 0, 200], [-18, 0, 18]);
  const cardOpacity = useTransform(x, [-250, -150, 0, 150, 250], [0, 1, 1, 1, 0]);

  // Success/fail overlay state
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | "none">("none");

  // Framer controls for programmatic animation
  const controls = useAnimation();

  const { onInit, fire } = useConfetti();

  // Reset x/y when card changes
  useEffect(() => {
    x.set(0);
    y.set(0);
    setSwipeDir("none");
  }, [currentCardIndex, x, y]);

  // Handle card tap/click to flip
  const handleCardClick = () => {
    if (!isCardFlipped) {
      flipCard();
    }
  };

  // Drag handler
  const handleDragEnd = useCallback(
    async (_: unknown, info: { offset: { x: number; y: number } }) => {
      if (!isCardFlipped) {
        // If not flipped, bounce back
        await controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 400, damping: 25 } });
        return;
      }

      const threshold = 100;
      const { offset } = info;

      if (offset.x > threshold) {
        // SUCCESS — swipe right
        setSwipeDir("right");
        if (currentPlayer) {
          incrementScore(currentPlayer.id, card.points);
        }
        await controls.start({
          x: 400,
          opacity: 0,
          transition: { duration: 0.35, ease: "easeIn" },
        });
        fire(); // 🎉 confetti!
        nextCard("right");
        onSuccess();
      } else if (offset.x < -threshold) {
        // FAIL — swipe left
        setSwipeDir("left");
        await controls.start({
          x: -400,
          opacity: 0,
          transition: { duration: 0.35, ease: "easeIn" },
        });
        nextCard("left");
        onFail();
      } else {
        // Snap back
        setSwipeDir("none");
        await controls.start({
          x: 0,
          y: 0,
          transition: { type: "spring", stiffness: 350, damping: 22 },
        });
      }
    },
    [isCardFlipped, controls, card, currentPlayer, incrementScore, nextCard, fire, onSuccess, onFail]
  );

  // Live swipe direction feedback
  const handleDrag = useCallback(
    (_: unknown, info: { offset: { x: number } }) => {
      if (!isCardFlipped) return;
      if (info.offset.x > 60) setSwipeDir("right");
      else if (info.offset.x < -60) setSwipeDir("left");
      else setSwipeDir("none");
    },
    [isCardFlipped]
  );

  if (!card) {
    return (
      <div className="flex-1 flex items-center justify-center text-center px-6">
        <div>
          <span className="text-5xl">🎉</span>
          <p className="mt-3 text-text-muted text-sm">All cards played!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative flex flex-col items-center justify-center px-6 py-4">
      {/* Canvas Confetti — full-screen overlay */}
      <ReactCanvasConfetti
        onInit={onInit}
        style={{
          position: "fixed",
          pointerEvents: "none",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 50,
        }}
      />

      {/* Instruction text */}
      <AnimatePresence mode="wait">
        {!isCardFlipped ? (
          <motion.p
            key="tap-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 text-xs text-text-muted uppercase tracking-widest"
          >
            👆 Tap card to flip
          </motion.p>
        ) : (
          <motion.p
            key="swipe-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 text-xs text-text-muted uppercase tracking-widest"
          >
            👈 Swipe to judge 👉
          </motion.p>
        )}
      </AnimatePresence>

      {/* Card stack wrapper */}
      <div className="relative w-full max-w-sm" style={{ height: "420px" }}>
        {/* Shadow cards (visual depth) */}
        <StackedShadowCards count={2} />

        {/* Main draggable card */}
        <motion.div
          key={`card-${currentCardIndex}`}
          className="absolute inset-0"
          drag={isCardFlipped}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.9}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={controls}
          initial={{ scale: 0.85, opacity: 0, y: -20 }}
          whileDrag={{ scale: 1.02, cursor: "grabbing" }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          onClick={handleCardClick}
          aria-label="Game card"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
          style={{ x, y, rotate, opacity: cardOpacity, zIndex: 10 }}
        >
          {/* 3D flip container */}
          <div
            className="relative w-full h-full"
            style={{
              perspective: "1200px",
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              className="relative w-full h-full"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: isCardFlipped ? 180 : 0 }}
              transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Card Back */}
              <div
                className="absolute inset-0 rounded-2xl border-2"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  borderColor: "var(--sheriff-gold)",
                  boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 20px rgba(255,215,0,0.2)",
                }}
              >
                <CardBackFace />
              </div>

              {/* Card Front */}
              <div
                className="absolute inset-0 rounded-2xl border-2"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                  borderColor: CARD_CONFIG[card.type].accentColor,
                  boxShadow: `0 8px 40px rgba(0,0,0,0.6), 0 0 30px ${CARD_CONFIG[card.type].accentColor}40`,
                }}
              >
                <CardFrontFace card={card} />
                <SwipeIndicator direction={swipeDir} />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Manual action buttons (if dragging is awkward on desktop) */}
      <AnimatePresence>
        {isCardFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-4 mt-6"
          >
            <motion.button
              id="fail-btn"
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                await controls.start({ x: -400, opacity: 0, transition: { duration: 0.35 } });
                nextCard("left");
                onFail();
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-sm font-semibold"
            >
              <XCircle size={16} />
              Fail
            </motion.button>

            <motion.button
              id="skip-btn"
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                await controls.start({ y: -300, opacity: 0, transition: { duration: 0.3 } });
                nextCard("left");
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border border-saloon-border bg-saloon-surface text-text-muted text-sm font-semibold"
            >
              <RotateCcw size={14} />
              Skip
            </motion.button>

            <motion.button
              id="success-btn"
              whileTap={{ scale: 0.95 }}
              onClick={async () => {
                if (currentPlayer) incrementScore(currentPlayer.id, card.points);
                await controls.start({ x: 400, opacity: 0, transition: { duration: 0.35 } });
                fire();
                nextCard("right");
                onSuccess();
              }}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-sm font-semibold"
            >
              Done
              <CheckCircle size={16} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
