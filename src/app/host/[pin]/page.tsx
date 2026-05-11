"use client";

import { useParams } from "next/navigation";
import HostScreen from "@/components/HostScreen";

// Default deck used when no custom cards are loaded from DB
// In production: fetch from /api/sessions/[pin] which returns the card list
import { useGameStore } from "@/lib/store";

export default function HostPage() {
  const { pin } = useParams<{ pin: string }>();
  const deck = useGameStore((s) => s.deck);

  return <HostScreen pin={pin} initialCards={deck} />;
}
