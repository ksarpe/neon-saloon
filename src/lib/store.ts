import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ─── Types ──────────────────────────────────────────────────────────────────

export type CardType = "trivia" | "charades" | "action" | "dare";

export interface GameCard {
  id: string;
  type: CardType;
  title: string;
  description: string;
  points: number;
  emoji: string;
}

export interface Participant {
  id: string;
  name: string;
  score: number;
  color: string;
  avatar: string; // emoji avatar
}

export type GameMode = "individual" | "teams";
export type GamePhase = "setup" | "playing" | "gameover";

export interface GameState {
  // Game config
  gameMode: GameMode;
  gamePhase: GamePhase;

  // Players
  participants: Participant[];
  currentParticipantIndex: number;

  // Deck
  deck: GameCard[];
  currentCardIndex: number;

  // UI state
  isCardFlipped: boolean;
  lastSwipeDirection: "right" | "left" | null;

  // Actions
  setGameMode: (mode: GameMode) => void;
  setGamePhase: (phase: GamePhase) => void;
  setParticipants: (participants: Participant[]) => void;
  addParticipant: (name: string) => void;
  removeParticipant: (id: string) => void;
  incrementScore: (participantId: string, amount?: number) => void;
  decrementScore: (participantId: string, amount?: number) => void;
  setDeck: (deck: GameCard[]) => void;
  shuffleDeck: () => void;
  flipCard: () => void;
  nextCard: (swipeDirection: "right" | "left") => void;
  nextTurn: () => void;
  resetGame: () => void;
}

// ─── Default card deck ───────────────────────────────────────────────────────

const DEFAULT_CARDS: Omit<GameCard, "id">[] = [
  // Trivia cards
  { type: "trivia", title: "Bride Trivia", description: "Where did the bride and groom have their first date?", points: 2, emoji: "🤠" },
  { type: "trivia", title: "Bride Trivia", description: "What is the bride's all-time favourite movie?", points: 1, emoji: "🎬" },
  { type: "trivia", title: "Bride Trivia", description: "What's the groom's middle name?", points: 2, emoji: "💍" },
  { type: "trivia", title: "Bride Trivia", description: "What song will they dance to at the wedding?", points: 3, emoji: "🎵" },
  { type: "trivia", title: "Bride Trivia", description: "How many months have they been together?", points: 1, emoji: "🗓️" },
  { type: "trivia", title: "Bride Trivia", description: "What is the bride's guilty-pleasure TV show?", points: 2, emoji: "📺" },
  { type: "trivia", title: "Bride Trivia", description: "What city does the bride dream of visiting for the honeymoon?", points: 2, emoji: "✈️" },
  { type: "trivia", title: "Bride Trivia", description: "What is the bride's cocktail of choice?", points: 1, emoji: "🍹" },

  // Charades cards
  { type: "charades", title: "Saloon Charades", description: "Act out the bride walking down the aisle — without smiling!", points: 2, emoji: "🎭" },
  { type: "charades", title: "Saloon Charades", description: "Mime the groom proposing — on one knee, the full drama!", points: 2, emoji: "💏" },
  { type: "charades", title: "Saloon Charades", description: "Charades: You're a tumbleweed rolling through a Wild West town.", points: 1, emoji: "🌵" },
  { type: "charades", title: "Saloon Charades", description: "Act out the bride getting ready on the wedding morning — hair, makeup, the works!", points: 3, emoji: "💄" },
  { type: "charades", title: "Saloon Charades", description: "Mime the first dance going catastrophically wrong.", points: 2, emoji: "🕺" },
  { type: "charades", title: "Saloon Charades", description: "Charades: Bride-to-be deciding between two wedding dress options.", points: 2, emoji: "👗" },

  // Action / Dare cards
  { type: "action", title: "Cowgirl Dare", description: "Do your best cowboy swagger across the room. Yeehaw! 🤠", points: 1, emoji: "🤠" },
  { type: "action", title: "Cowgirl Dare", description: "Call the bride by the wrong name 3 times in a row without laughing.", points: 2, emoji: "😂" },
  { type: "action", title: "Cowgirl Dare", description: "Take a shot — or a sip — and share your most embarrassing story about the bride.", points: 3, emoji: "🥃" },
  { type: "action", title: "Cowgirl Dare", description: "Serenade the group with the bride's favourite song — at least one full verse!", points: 3, emoji: "🎤" },
  { type: "action", title: "Cowgirl Dare", description: "Let the group give you a wedding-themed makeover for 60 seconds.", points: 2, emoji: "💅" },
  { type: "action", title: "Cowgirl Dare", description: "Do 10 lasso spins with an imaginary rope, full commitment only.", points: 1, emoji: "🌀" },
  { type: "action", title: "Cowgirl Dare", description: "Write a 3-line poem about the bride. Read it aloud with feeling!", points: 3, emoji: "📝" },
  { type: "action", title: "Cowgirl Dare", description: "Everyone gives you a nickname. You must use it for the next 5 minutes.", points: 2, emoji: "🏷️" },

  // Dare (spicy!)
  { type: "dare", title: "Spicy Dare 🌶️", description: "Tell the group who in the room would survive a zombie apocalypse first — and why.", points: 2, emoji: "🧟" },
  { type: "dare", title: "Spicy Dare 🌶️", description: "Reveal your most unpopular opinion about weddings. No taking it back!", points: 3, emoji: "🌶️" },
  { type: "dare", title: "Spicy Dare 🌶️", description: "Read out the last text you sent — no secrets in the Saloon!", points: 3, emoji: "📱" },
  { type: "dare", title: "Spicy Dare 🌶️", description: "FaceTime or text someone RIGHT NOW and say 'I've been thinking about you.'", points: 4, emoji: "❤️‍🔥" },
  { type: "dare", title: "Spicy Dare 🌶️", description: "Tell the group a secret you've kept from the bride. Tonight is confession night!", points: 4, emoji: "🤫" },
];

const shuffleArray = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildDeck = (): GameCard[] =>
  shuffleArray(DEFAULT_CARDS.map((c, i) => ({ ...c, id: `card-${i}-${Date.now()}` })));

const AVATAR_EMOJIS = ["🤠", "💃", "🎉", "🌸", "🦋", "🌺", "✨", "🍾", "🎀", "👑"];
const PLAYER_COLORS = ["#FF10F0", "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"];

// ─── Store ───────────────────────────────────────────────────────────────────

export const useGameStore = create<GameState>()(
  devtools(
    (set, get) => ({
      // Initial state
      gameMode: "individual",
      gamePhase: "setup",
      participants: [],
      currentParticipantIndex: 0,
      deck: buildDeck(),
      currentCardIndex: 0,
      isCardFlipped: false,
      lastSwipeDirection: null,

      // ── Actions ──────────────────────────────────────────────────────────

      setGameMode: (mode) => set({ gameMode: mode }),

      setGamePhase: (phase) => set({ gamePhase: phase }),

      setParticipants: (participants) => set({ participants }),

      addParticipant: (name) => {
        const { participants } = get();
        const idx = participants.length;
        const newParticipant: Participant = {
          id: `p-${Date.now()}-${Math.random()}`,
          name,
          score: 0,
          color: PLAYER_COLORS[idx % PLAYER_COLORS.length],
          avatar: AVATAR_EMOJIS[idx % AVATAR_EMOJIS.length],
        };
        set({ participants: [...participants, newParticipant] });
      },

      removeParticipant: (id) =>
        set((state) => ({
          participants: state.participants.filter((p) => p.id !== id),
        })),

      incrementScore: (participantId, amount = 1) =>
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === participantId ? { ...p, score: p.score + amount } : p
          ),
        })),

      decrementScore: (participantId, amount = 1) =>
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === participantId
              ? { ...p, score: Math.max(0, p.score - amount) }
              : p
          ),
        })),

      setDeck: (deck) => set({ deck }),

      shuffleDeck: () =>
        set({ deck: shuffleArray(get().deck), currentCardIndex: 0 }),

      flipCard: () => set({ isCardFlipped: true }),

      nextCard: (swipeDirection) => {
        const { currentCardIndex, deck, currentParticipantIndex, participants, isCardFlipped } = get();

        if (!isCardFlipped) return; // Must flip before swiping

        const nextIndex = (currentCardIndex + 1) % deck.length;
        const nextParticipantIndex = (currentParticipantIndex + 1) % Math.max(participants.length, 1);

        set({
          currentCardIndex: nextIndex,
          currentParticipantIndex: nextParticipantIndex,
          isCardFlipped: false,
          lastSwipeDirection: swipeDirection,
        });
      },

      nextTurn: () => {
        const { currentParticipantIndex, participants } = get();
        const nextIndex = (currentParticipantIndex + 1) % Math.max(participants.length, 1);
        set({ currentParticipantIndex: nextIndex });
      },

      resetGame: () =>
        set({
          gamePhase: "setup",
          participants: [],
          currentParticipantIndex: 0,
          deck: buildDeck(),
          currentCardIndex: 0,
          isCardFlipped: false,
          lastSwipeDirection: null,
        }),
    }),
    { name: "NeonSaloonStore" }
  )
);
