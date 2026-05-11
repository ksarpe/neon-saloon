"use client";

import { useParams, useSearchParams } from "next/navigation";
import HostScreen from "@/components/HostScreen";
import { useGameStore } from "@/lib/store";
import { useMemo } from "react";
import type { GameCard } from "@/lib/store";

// Filter the deck based on the game mode selected on the setup page
function filterDeck(deck: GameCard[], mode: string): GameCard[] {
  if (mode === "trivia") return deck.filter(c => c.type === "trivia");
  if (mode === "dares") return deck.filter(c => c.type === "dare" || c.type === "action");
  return deck; // "classic" = full deck
}

export default function HostPage() {
  const { pin } = useParams<{ pin: string }>();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode") ?? "classic";

  const fullDeck = useGameStore(s => s.deck);
  const deck = useMemo(() => filterDeck(fullDeck, mode), [fullDeck, mode]);

  return <HostScreen pin={pin} initialCards={deck} gameMode={mode} />;
}
