"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "neon-music-muted";
const BTN_ATTR = "data-music-btn";

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const savedMuted = localStorage.getItem(STORAGE_KEY) === "true";
    setMuted(savedMuted);

    const audio = new Audio("/sounds/angelika_na_byku.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audio.muted = savedMuted;
    audioRef.current = audio;

    const start = () => {
      if (startedRef.current) return;
      audio
        .play()
        .then(() => {
          startedRef.current = true;
          setPlaying(true);
        })
        .catch(() => {});
    };

    // Try immediate autoplay
    start();

    // On first interaction anywhere except the music button itself, start audio.
    // We skip the button because toggleMute handles its own play() call when unmuting.
    const onInteraction = (e: Event) => {
      if ((e.target as Element | null)?.closest(`[${BTN_ATTR}]`)) return;
      start();
      if (startedRef.current) {
        document.removeEventListener("click", onInteraction, true);
        document.removeEventListener("touchstart", onInteraction, true);
      }
    };

    document.addEventListener("click", onInteraction, true);
    document.addEventListener("touchstart", onInteraction, true);

    return () => {
      audio.pause();
      audioRef.current = null;
      document.removeEventListener("click", onInteraction, true);
      document.removeEventListener("touchstart", onInteraction, true);
    };
  }, []);

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    localStorage.setItem(STORAGE_KEY, String(next));

    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = next;

    // If unmuting and audio was never started (e.g. after refresh + autoplay blocked),
    // kick it off now — the button click counts as a user gesture.
    if (!next && !startedRef.current) {
      audio
        .play()
        .then(() => {
          startedRef.current = true;
          setPlaying(true);
        })
        .catch(() => {});
    }
  };

  return (
    <motion.button
      {...{ [BTN_ATTR]: "" }}
      onClick={toggleMute}
      whileTap={{ scale: 0.85 }}
      title={muted ? "Włącz muzykę" : "Wycisz muzykę"}
      className="fixed bottom-14 left-4 z-[50] w-10 h-10 rounded-full flex items-center justify-center border"
      style={{
        backgroundColor: "rgba(13,8,24,0.88)",
        backdropFilter: "blur(14px)",
        borderColor: muted ? "rgba(255,220,180,0.18)" : "rgba(255,16,240,0.45)",
        boxShadow: muted
          ? "none"
          : "0 0 16px rgba(255,16,240,0.35), inset 0 0 0 1px rgba(255,16,240,0.1)",
        color: muted ? "rgba(255,220,180,0.4)" : "var(--neon-pink)",
      }}
    >
      {muted ? (
        <VolumeX size={15} />
      ) : (
        <motion.span
          animate={playing ? { scale: [1, 1.12, 1] } : {}}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          <Volume2 size={15} />
        </motion.span>
      )}
    </motion.button>
  );
}
