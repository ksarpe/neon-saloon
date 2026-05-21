// Tła kart do decku — pełna talia: rangi od Asa do Króla × 4 kolory (52 karty).
//
// Jak dodać grafiki:
//   1. Wrzuć pliki (PNG / WebP / SVG) do  public/cards/
//   2. Nazywaj je wg wzorca `${ranga}-${kolor}.png`, np.:
//        as-pik.png, 10-kier.png, krol-karo.png, dama-trefl.png
//      (jeśli używasz innych nazw, zmień CARD_RANKS / CARD_SUITS / rozszerzenie niżej)
//   3. Włącz pełną talię ustawiając:
//        export const CARD_BACKGROUNDS = buildDeckBackgrounds()
//
// Pusta lista = używany jest domyślny fallback (DEFAULT_CARD_BACKGROUND),
// więc gra działa zanim dorobisz wszystkie grafiki.

/** Rangi kart: As, 2–10, Walet, Dama, Król. */
export const CARD_RANKS = [
  'as',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'walet',
  'dama',
  'krol',
] as const

/** 4 kolory talii. */
export const CARD_SUITS = ['podkowa', 'zabawka'] as const

/**
 * Buduje pełną talię nazw plików (rangi × kolory) wg wzorca `${ranga}-${kolor}.${ext}`.
 * Po skończeniu kompletu grafik użyj:  export const CARD_BACKGROUNDS = buildDeckBackgrounds()
 */
export function buildDeckBackgrounds(ext = 'png'): string[] {
  return CARD_SUITS.flatMap((suit) => CARD_RANKS.map((rank) => `${rank}-${suit}.${ext}`))
}

// Lista grafik faktycznie używana w grze. Opcje:
//   • puste []  → fallback (DEFAULT_CARD_BACKGROUND)
//   • ręcznie   → ['as-pik.png', 'krol-kier.png', ...]  (np. gdy masz tylko część)
//   • cała talia → buildDeckBackgrounds()
export const CARD_BACKGROUNDS: string[] = [
  '2-podkowa.png',
  '3-zabawka.png',
]

/** Tło używane, gdy lista jest pusta (jeszcze brak grafik As–Król). */
export const DEFAULT_CARD_BACKGROUND = '/cards/card-3d.png'

/**
 * Zwraca ścieżkę do tła karty. Wybór jest STABILNY dla danego klucza (np. id karty)
 * — ta sama karta zawsze dostaje tę samą grafikę i nie miga przy re-renderze,
 * a różne karty dostają różne grafiki z zestawu.
 */
export function getCardBackground(seed: string | number): string {
  if (CARD_BACKGROUNDS.length === 0) return DEFAULT_CARD_BACKGROUND

  const str = String(seed)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  return `/cards/${CARD_BACKGROUNDS[hash % CARD_BACKGROUNDS.length]}`
}

/**
 * Zwraca `count` ścieżek do RÓŻNYCH grafik dla całego decku (aktywna karta + cienie).
 * Start jest stabilny (hash z seeda), a kolejne karty biorą NASTĘPNE grafiki z listy,
 * więc w decku widać różne karty zamiast tej samej powielonej. Gdy grafik jest mniej
 * niż kart, lista cyklicznie się powtarza (i tak naprzemiennie, nie wszystkie te same).
 */
export function pickDeckBackgrounds(seed: string | number, count: number): string[] {
  if (CARD_BACKGROUNDS.length === 0) {
    return Array.from({ length: count }, () => DEFAULT_CARD_BACKGROUND)
  }

  const str = String(seed)
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }
  const start = hash % CARD_BACKGROUNDS.length

  return Array.from(
    { length: count },
    (_, i) => `/cards/${CARD_BACKGROUNDS[(start + i) % CARD_BACKGROUNDS.length]}`
  )
}
