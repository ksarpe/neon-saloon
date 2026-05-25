import { QUESTION_CATEGORIES } from './categories'

export const ALL_CATEGORIES_ID = 'all-categories'
export const PREMIUM_CATEGORY_IDS = [ALL_CATEGORIES_ID, 'stats', 'alcohol'] as const

export const ALL_CATEGORIES_OPTION = {
  id: ALL_CATEGORIES_ID,
  name: 'Wszystko na raz',
  description: 'Losuje pytania ze wszystkich kategorii w jednej grze',
  color: '#22c55e',
  border: 'rgba(34,197,94,0.5)',
  bg: 'rgba(34,197,94,0.07)',
  questions: QUESTION_CATEGORIES.flatMap((cat) => cat.questions),
} satisfies (typeof QUESTION_CATEGORIES)[number]

export function getQuestionCategorySelection(categoryId: string) {
  if (categoryId === ALL_CATEGORIES_ID) return ALL_CATEGORIES_OPTION
  return QUESTION_CATEGORIES.find((category) => category.id === categoryId)
}
