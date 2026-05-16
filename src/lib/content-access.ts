export type GateType = 'free' | 'premium' | 'ad' | 'premium_or_ad'

export interface ContentGate {
  type: GateType
  /** Required for 'ad' and 'premium_or_ad' gates — identifies which content was unlocked via ad */
  contentId?: string
}

export interface UserAccess {
  isPremium: boolean
  /** IDs unlocked by watching an ad (mobile flow, future) */
  unlockedByAd: string[]
}

export type AccessResult =
  | { granted: true }
  | { granted: false; reason: 'upgrade_required' }
  | { granted: false; reason: 'watch_ad'; contentId: string }
  | { granted: false; reason: 'upgrade_or_ad'; contentId?: string }

export function checkAccess(gate: ContentGate, access: UserAccess): AccessResult {
  if (gate.type === 'free') return { granted: true }

  if (gate.type === 'premium') {
    if (access.isPremium) return { granted: true }
    return { granted: false, reason: 'upgrade_required' }
  }

  if (gate.type === 'ad') {
    const contentId = gate.contentId ?? 'unknown'
    if (access.unlockedByAd.includes(contentId)) return { granted: true }
    return { granted: false, reason: 'watch_ad', contentId }
  }

  // premium_or_ad
  if (access.isPremium) return { granted: true }
  const contentId = gate.contentId ?? 'unknown'
  if (access.unlockedByAd.includes(contentId)) return { granted: true }
  return { granted: false, reason: 'upgrade_or_ad', contentId }
}
