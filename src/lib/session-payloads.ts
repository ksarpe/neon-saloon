import type { ScoreEntry, TeamScoreEntry, WireCard } from '@/lib/game-types'
import {
  boundedStringArray,
  INPUT_LIMITS,
  optionalString,
  RequestValidationError,
  requiredString,
} from '@/lib/request-validation'

export function sanitizeWireCard(value: unknown): WireCard {
  if (!value || typeof value !== 'object') {
    throw new RequestValidationError('card is required')
  }

  const card = value as Record<string, unknown>
  const type = requiredString(card.type, 'card.type', 12)
  if (type !== 'QUIZ' && type !== 'TEST' && type !== 'NEVER') {
    throw new RequestValidationError('Invalid card type')
  }

  const options =
    card.options === undefined
      ? undefined
      : boundedStringArray(
          card.options,
          'card.options',
          INPUT_LIMITS.cardOptions,
          INPUT_LIMITS.quizOption
        )

  return {
    id: requiredString(card.id, 'card.id', INPUT_LIMITS.cardId),
    type,
    title: optionalString(card.title, 'card.title', INPUT_LIMITS.cardTitle) ?? undefined,
    description: requiredString(card.description, 'card.description', INPUT_LIMITS.cardDescription),
    emoji: optionalString(card.emoji, 'card.emoji', INPUT_LIMITS.avatar) ?? undefined,
    options,
  }
}

export function sanitizeScoreEntries(value: unknown, field = 'scores'): ScoreEntry[] {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value) || value.length > INPUT_LIMITS.scoreEntries) {
    throw new RequestValidationError(`${field} is invalid`)
  }

  return value.map((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      throw new RequestValidationError(`${field}[${index}] must be an object`)
    }

    const row = entry as Record<string, unknown>
    return {
      playerId: requiredString(row.playerId, `${field}[${index}].playerId`, 80),
      playerName: requiredString(
        row.playerName,
        `${field}[${index}].playerName`,
        INPUT_LIMITS.playerName
      ),
      score: finiteNumber(row.score, `${field}[${index}].score`),
      drinks:
        row.drinks === undefined
          ? undefined
          : finiteNumber(row.drinks, `${field}[${index}].drinks`),
      playerTeamId:
        optionalString(row.playerTeamId, `${field}[${index}].playerTeamId`, 80) ?? undefined,
      playerTeamName:
        optionalString(
          row.playerTeamName,
          `${field}[${index}].playerTeamName`,
          INPUT_LIMITS.teamName
        ) ?? undefined,
    }
  })
}

export function sanitizeTeamScoreEntries(value: unknown, field = 'teamScores'): TeamScoreEntry[] {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value) || value.length > INPUT_LIMITS.scoreEntries) {
    throw new RequestValidationError(`${field} is invalid`)
  }

  return value.map((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      throw new RequestValidationError(`${field}[${index}] must be an object`)
    }

    const row = entry as Record<string, unknown>
    return {
      teamId: requiredString(row.teamId, `${field}[${index}].teamId`, 80),
      teamName: requiredString(row.teamName, `${field}[${index}].teamName`, INPUT_LIMITS.teamName),
      score: finiteNumber(row.score, `${field}[${index}].score`),
    }
  })
}

export function finiteNumber(value: unknown, field: string) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new RequestValidationError(`${field} must be a finite number`)
  }

  if (value < -10_000 || value > 10_000) {
    throw new RequestValidationError(`${field} is out of range`)
  }

  return value
}
