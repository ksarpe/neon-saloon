import { BRIDAL_QUIZ_CARDS } from '@/lib/games/bridal-quiz-cards'
import { NEVER_CARDS } from '@/lib/games/never-cards'
import type { GameCard } from '@/lib/store'

export { BRIDAL_QUIZ_CARDS, BRIDAL_QUIZ_TITLE } from '@/lib/games/bridal-quiz-cards'
export { NEVER_CARDS, NEVER_TITLE } from '@/lib/games/never-cards'

export const DEFAULT_CARDS: Omit<GameCard, 'id'>[] = [
  ...BRIDAL_QUIZ_CARDS,
  ...NEVER_CARDS,
]
