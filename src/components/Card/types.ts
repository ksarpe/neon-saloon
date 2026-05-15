export const CARD_W = 320
export const CARD_H = 200

// Minimal shape — compatible with both GameCard and WireCard
export interface CardLike {
  id: string
  type: string
  description: string
  options?: string[]
  answer?: string | null
}
