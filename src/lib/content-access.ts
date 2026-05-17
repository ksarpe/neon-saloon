export type GateType = 'free' | 'premium'

export interface ContentGate {
  type: GateType
}

export interface UserAccess {
  isPremium: boolean
}

export type AccessResult =
  | { granted: true }
  | { granted: false; reason: 'upgrade_required' }

export function checkAccess(gate: ContentGate, access: UserAccess): AccessResult {
  if (gate.type === 'free') return { granted: true }

  if (access.isPremium) return { granted: true }
  return { granted: false, reason: 'upgrade_required' }
}
