// Card / score-entry sanitisers for the PartyKit room. Self-contained
// (depends only on party/validators.ts) so the Workers bundle is clean.

import type {
  ScoreEntry,
  TeamScoreEntry,
  WireCard,
} from "../src/lib/game-types"
import {
  boundedStringArray,
  finiteNumber,
  INPUT_LIMITS,
  optionalString,
  requiredString,
  ValidationError,
} from "./validators"

export type StoredCard = WireCard & { answer?: string }

export function sanitizeWireCard(value: unknown): WireCard {
  return sanitizeWireCardWithPrefix(value, "card")
}

export function sanitizeStoredDeck(value: unknown): StoredCard[] {
  if (!Array.isArray(value)) throw new ValidationError("deck must be an array")
  if (value.length > INPUT_LIMITS.scoreEntries) {
    throw new ValidationError(`deck must contain at most ${INPUT_LIMITS.scoreEntries} cards`)
  }
  return value.map((card, index) => {
    const wireCard = sanitizeWireCardWithPrefix(card, `deck[${index}]`)
    const row = card as Record<string, unknown>
    return {
      ...wireCard,
      answer:
        optionalString(row.answer, `deck[${index}].answer`, INPUT_LIMITS.quizAnswer) ?? undefined,
    }
  })
}

export function sanitizeScoreEntries(value: unknown, field = "scores"): ScoreEntry[] {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value) || value.length > INPUT_LIMITS.scoreEntries) {
    throw new ValidationError(`${field} is invalid`)
  }
  return value.map((entry, i) => {
    if (!entry || typeof entry !== "object") {
      throw new ValidationError(`${field}[${i}] must be an object`)
    }
    const row = entry as Record<string, unknown>
    return {
      playerId: requiredString(row.playerId, `${field}[${i}].playerId`, 80),
      playerName: requiredString(
        row.playerName,
        `${field}[${i}].playerName`,
        INPUT_LIMITS.playerName,
      ),
      score: finiteNumber(row.score, `${field}[${i}].score`),
      drinks:
        row.drinks === undefined ? undefined : finiteNumber(row.drinks, `${field}[${i}].drinks`),
      playerTeamId:
        optionalString(row.playerTeamId, `${field}[${i}].playerTeamId`, 80) ?? undefined,
      playerTeamName:
        optionalString(
          row.playerTeamName,
          `${field}[${i}].playerTeamName`,
          INPUT_LIMITS.teamName,
        ) ?? undefined,
    }
  })
}

export function sanitizeTeamScoreEntries(value: unknown, field = "teamScores"): TeamScoreEntry[] {
  if (value === undefined || value === null) return []
  if (!Array.isArray(value) || value.length > INPUT_LIMITS.scoreEntries) {
    throw new ValidationError(`${field} is invalid`)
  }
  return value.map((entry, i) => {
    if (!entry || typeof entry !== "object") {
      throw new ValidationError(`${field}[${i}] must be an object`)
    }
    const row = entry as Record<string, unknown>
    return {
      teamId: requiredString(row.teamId, `${field}[${i}].teamId`, 80),
      teamName: requiredString(
        row.teamName,
        `${field}[${i}].teamName`,
        INPUT_LIMITS.teamName,
      ),
      score: finiteNumber(row.score, `${field}[${i}].score`),
    }
  })
}

function sanitizeWireCardWithPrefix(value: unknown, field: string): WireCard {
  if (!value || typeof value !== "object") {
    throw new ValidationError(`${field} must be an object`)
  }
  const card = value as Record<string, unknown>
  const type = requiredString(card.type, `${field}.type`, 12)
  if (type !== "QUIZ" && type !== "TEST" && type !== "NEVER") {
    throw new ValidationError(`Invalid ${field}.type`)
  }
  const options =
    card.options === undefined
      ? undefined
      : boundedStringArray(
          card.options,
          `${field}.options`,
          INPUT_LIMITS.cardOptions,
          INPUT_LIMITS.quizOption,
        )
  return {
    id: requiredString(card.id, `${field}.id`, INPUT_LIMITS.cardId),
    type,
    title: optionalString(card.title, `${field}.title`, INPUT_LIMITS.cardTitle) ?? undefined,
    description: requiredString(
      card.description,
      `${field}.description`,
      INPUT_LIMITS.cardDescription,
    ),
    emoji: optionalString(card.emoji, `${field}.emoji`, INPUT_LIMITS.avatar) ?? undefined,
    options,
  }
}

export function sanitizeStoredVotes(value: unknown, field = "votes"): Array<{
  playerId: string
  playerName: string
  teamId: string | null
  teamName: string | null
  cardIndex: number
  answerIndex: number
  answerText: string
}> {
  if (!Array.isArray(value)) throw new ValidationError(`${field} must be an array`)
  if (value.length > INPUT_LIMITS.scoreEntries) {
    throw new ValidationError(`${field} must contain at most ${INPUT_LIMITS.scoreEntries} items`)
  }
  return value.map((vote, i) => {
    if (!vote || typeof vote !== "object") {
      throw new ValidationError(`${field}[${i}] must be an object`)
    }
    const row = vote as Record<string, unknown>
    const answerIndex =
      typeof row.answerIndex === "number" && Number.isInteger(row.answerIndex)
        ? row.answerIndex
        : -1
    return {
      playerId: requiredString(row.playerId, `${field}[${i}].playerId`, 80),
      playerName: requiredString(
        row.playerName,
        `${field}[${i}].playerName`,
        INPUT_LIMITS.playerName,
      ),
      teamId: optionalString(row.teamId, `${field}[${i}].teamId`, 80),
      teamName: optionalString(row.teamName, `${field}[${i}].teamName`, INPUT_LIMITS.teamName),
      cardIndex:
        typeof row.cardIndex === "number" && Number.isInteger(row.cardIndex) ? row.cardIndex : 0,
      answerIndex,
      answerText:
        optionalString(row.answerText, `${field}[${i}].answerText`, INPUT_LIMITS.answerText) ??
        "",
    }
  })
}
