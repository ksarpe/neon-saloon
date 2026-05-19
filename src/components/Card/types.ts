export const CARD_W = 380
export const CARD_H = 238

// Minimal shape — compatible with both GameCard and WireCard
export interface CardLike {
  id: string
  type: string
  description: string
  options?: string[]
  answer?: string | null
}
