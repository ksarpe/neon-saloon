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

// Maximum participants per room (host included if they also play as a player).
// This is the primary load guard for a single PartyKit room — one Durable Object
// fans every game event out to every connection, so a small cap keeps the
// broadcast cost bounded — and it doubles as the premium upsell lever.
export const ROOM_PLAYER_LIMITS = {
  free: 6,
  premium: 20,
} as const

export function getRoomPlayerLimit(isPremium: boolean) {
  return isPremium ? ROOM_PLAYER_LIMITS.premium : ROOM_PLAYER_LIMITS.free
}
