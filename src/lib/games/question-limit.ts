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

// Deterministic shuffle keyed by a string seed (e.g. the session PIN). The host
// and the server can derive the same order independently — so the question order
// is randomised per game yet survives a page refresh without being persisted.
export function seededShuffleItems<T>(items: T[], seed: string): T[] {
  let h = 1779033703 ^ seed.length
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  const rng = () => {
    h = (h + 0x6d2b79f5) | 0
    let t = Math.imul(h ^ (h >>> 15), 1 | h)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function seededShuffleAndLimitQuestions<T>(
  items: T[],
  seed: string,
  limit = QUESTIONS_PER_GAME
): T[] {
  return limitQuestions(seededShuffleItems(items, seed), limit)
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
