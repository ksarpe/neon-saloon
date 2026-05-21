export const QUESTION_QUOTAS = {
  quiz: {
    free: 10,
    premium: 1000,
  },
  never: {
    free: 0,
    premium: 1000,
  },
} as const

export type QuestionQuotaKind = keyof typeof QUESTION_QUOTAS

export function getQuestionQuota(kind: QuestionQuotaKind, isPremium: boolean) {
  const quota = QUESTION_QUOTAS[kind]
  return isPremium ? quota.premium : quota.free
}
