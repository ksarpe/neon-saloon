export const CARD_BACKGROUNDS: readonly string[] = ['q1.png', 'q2.png', 'q3.png', 'q4.png']

export const DEFAULT_CARD_BACKGROUND = '/cards/q1.png'

function getSeedHash(seed: string | number): number {
  const str = String(seed)
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  }

  return hash
}

function getCardBackgroundPath(index: number): string {
  return `/cards/${CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length]}`
}

export function pickDeckBackgrounds(seed: string | number, count: number): string[] {
  if (CARD_BACKGROUNDS.length === 0) {
    return Array.from({ length: count }, () => DEFAULT_CARD_BACKGROUND)
  }

  const start = getSeedHash(seed) % CARD_BACKGROUNDS.length

  return Array.from({ length: count }, (_, i) => getCardBackgroundPath(start + i))
}
