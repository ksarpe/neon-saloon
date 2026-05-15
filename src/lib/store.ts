import { DEFAULT_CARDS } from "@/lib/games/default-deck";

export type CardType = "QUIZ" | "NEVER";

export interface GameCard {
  id: string;
  type: CardType;
  title: string;
  description: string;
  emoji?: string;
  answer?: string;
  options?: string[];
}

const shuffleArray = <T>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const buildDeck = (): GameCard[] =>
  shuffleArray(
    DEFAULT_CARDS.map((c, i) => ({ ...c, id: `card-${i}-${Date.now()}` })),
  );
