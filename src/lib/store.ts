import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ─── Types ──────────────────────────────────────────────────────────────────

export type CardType = "QUIZ" | "NEVER";

export interface GameCard {
  id: string;
  type: CardType;
  title: string;
  description: string;
  emoji?: string;
  answer?: string;
  options?: string[]; // Added for A, B, C, D support
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
  {
    type: "QUIZ",
    title: "Quiz o Pannie Młodej",
    description: "Jak miała na imię jej pierwsza miłość?",
    emoji: "💔",
    answer: "Adam",
    options: ["Tomek", "Marcin", "Adam", "Robert"],
  },
  {
    type: "QUIZ",
    title: "Quiz o Pannie Młodej",
    description: "Jaki jest dokładny rozmiar stopy Panny Młodej?",
    emoji: "👠",
    answer: "37",
    options: ["36", "36,5", "37", "38"],
  },
  {
    type: "QUIZ",
    title: "Quiz o Pannie Młodej",
    description: "Co najczęściej zamawia do jedzenia?",
    emoji: "🍕",
    answer: "Sushi",
    options: ["Sushi", "Shoarma", "Burger", "Pizza"],
  },
  {
    type: "QUIZ",
    title: "Quiz o Pannie Młodej",
    description: "Co robi, kiedy jest mocno zestresowana?",
    emoji: "😤",
    answer: "Wyżywa się na Marcinie",
    options: [
      "Płacze",
      "Obgryza paznokcie",
      "Wyżywa się na Marcinie",
      "Idzie na zakupy",
    ],
  },
  {
    type: "QUIZ",
    title: "Quiz o Pannie Młodej",
    description: "O czym marzyła jako mała dziewczynka?",
    emoji: "💭",
    answer: "O byciu rolnikiem",
    options: [
      "O byciu rolnikiem",
      "O byciu żoną męża",
      "O byciu bizneswoman",
      "O własnym salonie beauty",
    ],
  },
  {
    type: "QUIZ",
    title: "Quiz o Pannie Młodej",
    description: "Gdzie miał miejsce ich pierwszy pocałunek?",
    emoji: "💋",
    answer: "Wrocław, mieszkanie",
    options: [
      "Bełchatów, spacer",
      "Wrocław, klub",
      "Wrocław, mieszkanie",
      "Bełchatów, wesele",
    ],
  },
  {
    type: "QUIZ",
    title: "Quiz o Pannie Młodej",
    description:
      "Co na samym początku najbardziej nie pasowało jej w Marcinie?",
    emoji: "🚩",
    answer: "Ubiór",
    options: ["Miejsce zamieszkania", "Praca", "Ubiór", "Wzrost"],
  },
  {
    type: "QUIZ",
    title: "Quiz o Pannie Młodej",
    description: "Najbardziej żenująca sytuacja z przyszłym mężem to...?",
    emoji: "🙈",
    answer: "Lunatykowanie podczas pierwszej nocy u Marcina",
    options: [
      "Seks na weselu Magdy",
      "Obrzyganie płaszcza",
      "Lunatykowanie podczas pierwszej nocy u Marcina",
      "Pierd podczas minetki",
    ],
  },
  {
    type: "QUIZ",
    title: "Quiz o Pannie Młodej",
    description: "Ile osób pocałowała na imprezie w jedną noc? (Rekord)",
    emoji: "👅",
    answer: "3",
    options: ["1", "2", "3", "4"],
  },
  {
    type: "QUIZ",
    title: "Quiz o Pannie Młodej",
    description: "Jej ulubiona pozycja seksualna to?",
    emoji: "🌶️",
    answer: "Odwrócony kowboj",
    options: ["Na pieska", "69", "Na misjonarza", "Odwrócony kowboj"],
  },
  {
    type: "QUIZ",
    title: "Quiz o Pannie Młodej",
    description: "Czy zdarzyło jej się potajemnie sprawdzać telefon Marcina?",
    emoji: "📱",
    answer: "Tak",
    options: ["Tak", "Nie"],
  },
  {
    type: "QUIZ",
    title: "Quiz o Pannie Młodej",
    description: "Jakie imię by wybrała, gdyby miała mieć córkę?",
    emoji: "👧",
    answer: "Liliana",
    options: ["Aurelia", "Liliana", "Zofia", "Oliwia"],
  },
  {
    type: "QUIZ",
    title: "Quiz o Pannie Młodej",
    description: "Jakie imię by wybrała, gdyby miała mieć syna?",
    emoji: "👦",
    answer: "Ignacy",
    options: ["Franek", "Staś", "Ignacy", "Antoś"],
  },
  {
    type: "QUIZ",
    title: "Quiz o Pannie Młodej",
    description: "Czego za żadne skarby świata nie chciałaby na swoim weselu?",
    emoji: "🛑",
    answer: "Pijanych dram i awantur",
    options: [
      "By ktoś założył białą sukienkę",
      "Pijanych dram i awantur",
      "Żenujących zabaw z podtekstem",
      "Krzyczenia „Gorzko, gorzko” co 5 minut",
    ],
  },
  {
    type: "QUIZ",
    title: "Quiz o Pannie Młodej",
    description: "Jakie było jej największe kłamstwo w tym związku?",
    emoji: "🤥",
    answer: "Mam naturalne usta",
    options: [
      "Jestem dziewicą",
      "Mam naturalne usta",
      "Nie palę papierosów",
      "Nie stalkowałam twojej byłej",
    ],
  },
  {
    type: "QUIZ",
    title: "Quiz o Pannie Młodej",
    description: "Jaka była najbardziej pikantna wiadomość, którą mu wysłała?",
    emoji: "🔥",
    answer: "Całe nagie foto",
    options: [
      "Gołe zdjęcie cyców",
      "Całe nagie foto",
      "Tekst: „Mam na ciebie ochotę”",
      "Tekst: „Przyjedź, natychmiast”",
    ],
  },
  {
    type: "QUIZ",
    title: "Quiz o Pannie Młodej",
    description: "O co ta dwójka najczęściej się kłóci?",
    emoji: "🥊",
    answer: "O sprzątanie",
    options: ["O sprzątanie", "O granie Marcina", "O zazdrość", "O brak czasu"],
  },
  {
    type: "NEVER",
    title: "Nigdy przenigdy",
    description: "Nigdy przenigdy nie urwałam się z domu przez okno.",
    emoji: "🪟",
  },
  {
    type: "NEVER",
    title: "Nigdy przenigdy",
    description: "Nigdy przenigdy nie wysłałam wiadomości do byłego po alkoholu.",
    emoji: "📲",
  },
  {
    type: "NEVER",
    title: "Nigdy przenigdy",
    description: "Nigdy przenigdy nie tańczyłam na barze lub stole.",
    emoji: "💃",
  },
  {
    type: "NEVER",
    title: "Nigdy przenigdy",
    description: "Nigdy przenigdy nie pocałowałam kogoś z obecnych na imprezie.",
    emoji: "💋",
  },
  {
    type: "NEVER",
    title: "Nigdy przenigdy",
    description: "Nigdy przenigdy nie podglądałam profilu byłego po rozstaniu.",
    emoji: "👀",
  },
  {
    type: "NEVER",
    title: "Nigdy przenigdy",
    description: "Nigdy przenigdy nie kłamałam na temat swojego wieku.",
    emoji: "🎂",
  },
  {
    type: "NEVER",
    title: "Nigdy przenigdy",
    description: "Nigdy przenigdy nie płakałam po alkoholu bez powodu.",
    emoji: "😭",
  },
  {
    type: "NEVER",
    title: "Nigdy przenigdy",
    description: "Nigdy przenigdy nie udawałam choroby, żeby nie iść do pracy.",
    emoji: "🤒",
  },
  {
    type: "NEVER",
    title: "Nigdy przenigdy",
    description: "Nigdy przenigdy nie rozmawiałam z byłym przez zamkniętą toaletę.",
    emoji: "🚽",
  },
  {
    type: "NEVER",
    title: "Nigdy przenigdy",
    description: "Nigdy przenigdy nie zrobiłam czegoś, czego się wstydzę, na imprezie.",
    emoji: "🙈",
  },
];

const shuffleArray = <T>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const buildDeck = (): GameCard[] =>
  shuffleArray(
    DEFAULT_CARDS.map((c, i) => ({ ...c, id: `card-${i}-${Date.now()}` })),
  );

const AVATAR_EMOJIS = [
  "🤠",
  "💃",
  "🎉",
  "🌸",
  "🦋",
  "🌺",
  "✨",
  "🍾",
  "🎀",
  "👑",
];
const PLAYER_COLORS = [
  "#FF10F0",
  "#FFD700",
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
];

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
            p.id === participantId ? { ...p, score: p.score + amount } : p,
          ),
        })),

      decrementScore: (participantId, amount = 1) =>
        set((state) => ({
          participants: state.participants.map((p) =>
            p.id === participantId
              ? { ...p, score: Math.max(0, p.score - amount) }
              : p,
          ),
        })),

      setDeck: (deck) => set({ deck }),

      shuffleDeck: () =>
        set({ deck: shuffleArray(get().deck), currentCardIndex: 0 }),

      flipCard: () => set({ isCardFlipped: true }),

      nextCard: (swipeDirection) => {
        const {
          currentCardIndex,
          deck,
          currentParticipantIndex,
          participants,
          isCardFlipped,
        } = get();

        if (!isCardFlipped) return; // Must flip before swiping

        const nextIndex = (currentCardIndex + 1) % deck.length;
        const nextParticipantIndex =
          (currentParticipantIndex + 1) % Math.max(participants.length, 1);

        set({
          currentCardIndex: nextIndex,
          currentParticipantIndex: nextParticipantIndex,
          isCardFlipped: false,
          lastSwipeDirection: swipeDirection,
        });
      },

      nextTurn: () => {
        const { currentParticipantIndex, participants } = get();
        const nextIndex =
          (currentParticipantIndex + 1) % Math.max(participants.length, 1);
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
    { name: "NeonSaloonStore" },
  ),
);
