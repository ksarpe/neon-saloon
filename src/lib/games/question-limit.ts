export const QUESTIONS_PER_GAME = 10

export function shuffleItems<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function limitQuestions<T>(items: T[], limit = QUESTIONS_PER_GAME): T[] {
  return items.slice(0, Math.min(limit, items.length))
}

export function shuffleAndLimitQuestions<T>(items: T[], limit = QUESTIONS_PER_GAME): T[] {
  return limitQuestions(shuffleItems(items), limit)
}

export function createQuestionOrder(totalQuestions: number, limit = QUESTIONS_PER_GAME): number[] {
  return shuffleAndLimitQuestions(
    Array.from({ length: totalQuestions }, (_, index) => index),
    limit
  )
}

export function getOrderedQuestion<T>(
  questions: T[],
  questionIndex: number,
  questionOrder?: number[]
): T | undefined {
  const sourceIndex = questionOrder?.[questionIndex] ?? questionIndex
  return questions[sourceIndex]
}

export function getLimitedQuestionTotal(totalQuestions: number, questionOrder?: number[]): number {
  return questionOrder?.length ?? Math.min(totalQuestions, QUESTIONS_PER_GAME)
}
