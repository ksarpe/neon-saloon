// Pure input validators for the PartyKit room. Self-contained on purpose —
// no Next.js / Node-specific imports — so the Workers bundle doesn't drag
// `next/server` (which exists in request-validation.ts in the Next.js tree).
//
// Keep these local to avoid a transitive Next-import sneaking into the room build.

export const INPUT_LIMITS = {
  playerName: 24,
  teamName: 24,
  avatar: 64,
  answerText: 240,
  cardId: 80,
  cardTitle: 120,
  cardDescription: 600,
  cardOptions: 6,
  quizOption: 160,
  quizAnswer: 160,
  scoreEntries: 100,
} as const

export class ValidationError extends Error {
  constructor(message: string, public readonly status = 400) {
    super(message)
  }
}

export function requiredString(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string") throw new ValidationError(`${field} is required`)
  const trimmed = value.trim()
  if (!trimmed) throw new ValidationError(`${field} is required`)
  if (trimmed.length > maxLength) {
    throw new ValidationError(`${field} must be at most ${maxLength} characters`)
  }
  return trimmed
}

export function optionalString(
  value: unknown,
  field: string,
  maxLength: number,
): string | null {
  if (value === undefined || value === null) return null
  if (typeof value !== "string") throw new ValidationError(`${field} must be a string`)
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed.length > maxLength) {
    throw new ValidationError(`${field} must be at most ${maxLength} characters`)
  }
  return trimmed
}

export function requiredInteger(
  value: unknown,
  field: string,
  min?: number,
  max?: number,
): number {
  if (!Number.isInteger(value)) throw new ValidationError(`${field} must be an integer`)
  const n = value as number
  if (min !== undefined && n < min) throw new ValidationError(`${field} is too small`)
  if (max !== undefined && n > max) throw new ValidationError(`${field} is too large`)
  return n
}

export function boundedStringArray(
  value: unknown,
  field: string,
  maxItems: number,
  maxItemLength: number,
): string[] {
  if (!Array.isArray(value)) throw new ValidationError(`${field} must be an array`)
  if (value.length > maxItems) {
    throw new ValidationError(`${field} must contain at most ${maxItems} items`)
  }
  return value
    .map((item, i) => optionalString(item, `${field}[${i}]`, maxItemLength))
    .filter((item): item is string => Boolean(item))
}

export function finiteNumber(value: unknown, field: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new ValidationError(`${field} must be a finite number`)
  }
  if (value < -10_000 || value > 10_000) {
    throw new ValidationError(`${field} is out of range`)
  }
  return value
}
