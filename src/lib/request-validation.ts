import { NextResponse } from 'next/server'

export const INPUT_LIMITS = {
  jsonBodyBytes: 16 * 1024,
  stripeWebhookBytes: 256 * 1024,
  email: 254,
  password: 128,
  accountName: 40,
  resetToken: 256,
  stripePlan: 32,
  questionText: 500,
  quizAnswer: 160,
  quizOption: 160,
  quizOptions: 6,
  playerName: 24,
  teamName: 24,
  avatar: 16,
  answerText: 240,
  cardId: 80,
  cardTitle: 120,
  cardDescription: 600,
  cardOptions: 6,
  highlowNumber: 32,
  action: 24,
  scoreEntries: 100,
} as const

export class RequestValidationError extends Error {
  constructor(
    message: string,
    public readonly status = 400
  ) {
    super(message)
  }
}

export async function readLimitedJson<T>(request: Request, maxBytes = INPUT_LIMITS.jsonBodyBytes) {
  const contentLength = request.headers.get('content-length')
  if (contentLength && Number(contentLength) > maxBytes) {
    throw new RequestValidationError('Payload is too large', 413)
  }

  const body = await readLimitedText(request, maxBytes)
  if (!body.trim()) return {} as T

  try {
    return JSON.parse(body) as T
  } catch {
    throw new RequestValidationError('Invalid JSON', 400)
  }
}

export async function readLimitedText(request: Request, maxBytes: number) {
  const contentLength = request.headers.get('content-length')
  if (contentLength && Number(contentLength) > maxBytes) {
    throw new RequestValidationError('Payload is too large', 413)
  }

  return readLimitedBody(request, maxBytes)
}

export function requiredString(value: unknown, field: string, maxLength: number) {
  if (typeof value !== 'string') {
    throw new RequestValidationError(`${field} is required`)
  }

  const trimmed = value.trim()
  if (!trimmed) throw new RequestValidationError(`${field} is required`)
  if (trimmed.length > maxLength) {
    throw new RequestValidationError(`${field} must be at most ${maxLength} characters`)
  }

  return trimmed
}

export function optionalString(value: unknown, field: string, maxLength: number) {
  if (value === undefined || value === null) return null
  if (typeof value !== 'string') {
    throw new RequestValidationError(`${field} must be a string`)
  }

  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed.length > maxLength) {
    throw new RequestValidationError(`${field} must be at most ${maxLength} characters`)
  }

  return trimmed
}

export function normalizeEmail(value: unknown, field = 'email') {
  const email = requiredString(value, field, INPUT_LIMITS.email).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new RequestValidationError(`${field} must be a valid email`)
  }

  return email
}

export function requiredInteger(value: unknown, field: string, min?: number, max?: number) {
  if (!Number.isInteger(value)) {
    throw new RequestValidationError(`${field} must be an integer`)
  }

  const numberValue = value as number
  if (min !== undefined && numberValue < min) {
    throw new RequestValidationError(`${field} is too small`)
  }
  if (max !== undefined && numberValue > max) {
    throw new RequestValidationError(`${field} is too large`)
  }

  return numberValue
}

export function boundedStringArray(
  value: unknown,
  field: string,
  maxItems: number,
  maxItemLength: number
) {
  if (!Array.isArray(value)) {
    throw new RequestValidationError(`${field} must be an array`)
  }
  if (value.length > maxItems) {
    throw new RequestValidationError(`${field} must contain at most ${maxItems} items`)
  }

  return value
    .map((item, index) => optionalString(item, `${field}[${index}]`, maxItemLength))
    .filter((item): item is string => Boolean(item))
}

export function validationErrorResponse(error: unknown) {
  if (error instanceof RequestValidationError) {
    return NextResponse.json({ error: error.message }, { status: error.status })
  }

  return null
}

async function readLimitedBody(request: Request, maxBytes: number) {
  if (!request.body) return ''

  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let totalBytes = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (!value) continue

    totalBytes += value.byteLength
    if (totalBytes > maxBytes) {
      await reader.cancel()
      throw new RequestValidationError('Payload is too large', 413)
    }
    chunks.push(value)
  }

  return new TextDecoder().decode(concatChunks(chunks, totalBytes))
}

function concatChunks(chunks: Uint8Array[], totalBytes: number) {
  const output = new Uint8Array(totalBytes)
  let offset = 0

  for (const chunk of chunks) {
    output.set(chunk, offset)
    offset += chunk.byteLength
  }

  return output
}
