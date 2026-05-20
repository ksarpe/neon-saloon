import { NEVER_CARDS } from '@/config/games/never-cards'
import type { GameCard } from '@/lib/store'

export { BRIDAL_QUIZ_CARDS, BRIDAL_QUIZ_TITLE } from '@/config/games/bridal-quiz-cards'
export { NEVER_CARDS, NEVER_TITLE } from '@/config/games/never-cards'

export const DEFAULT_CARDS: Omit<GameCard, 'id'>[] = [...NEVER_CARDS]

