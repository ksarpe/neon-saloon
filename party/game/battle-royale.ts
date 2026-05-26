// Pure reducers for the Battle Royale survival mode.
// Maps the Battle Royale room actions {setup,round,answer,reveal,next}.
//
// Elimination rules (from reveal):
//   • nobody correct  → slowest of all answers is eliminated
//   • all correct     → slowest of correct answers is eliminated
//   • mixed           → every wrong/timed-out player is eliminated
// Game ends when ≤1 alive players remain.
//
// Timer is intentionally driven from the host (host clicks "Odsłoń wyniki"
// after the client-side countdown). Auto-reveal via DO Alarms can be layered
// on later without changing this reducer.

import { getQuestionCategorySelection } from '../../src/config/games/category-selection'
import {
  createQuestionOrder,
  getLimitedQuestionTotal,
  getOrderedQuestion,
} from '../../src/lib/games/question-limit'
import type { BRStoredAnswer, BattleRoyaleData, RoomState } from '../state'
import type { ReducerResult } from './classic'

const DEFAULT_TIMER_SECONDS = 20

export function applyBattleRoyaleSetup(
  state: RoomState,
  input: { categoryId: string; timerDuration?: number },
): ReducerResult<{ totalQuestions: number }> {
  if (state.gameMode !== 'battle-royale') {
    return { ok: false, error: 'Not a battle-royale session', code: 400 }
  }

  const category = getQuestionCategorySelection(input.categoryId)
  if (!category) return { ok: false, error: 'Invalid category', code: 400 }

  const timerDuration =
    typeof input.timerDuration === 'number' &&
    Number.isInteger(input.timerDuration) &&
    input.timerDuration >= 5 &&
    input.timerDuration <= 60
      ? input.timerDuration
      : DEFAULT_TIMER_SECONDS

  const questionOrder = createQuestionOrder(category.questions.length)
  const totalQuestions = getLimitedQuestionTotal(category.questions.length, questionOrder)

  const battleRoyale: BattleRoyaleData = {
    categoryId: input.categoryId,
    questionOrder,
    questionIndex: 0,
    totalQuestions,
    eliminatedPlayers: [],
    roundAnswers: [],
    timerDuration,
  }

  return {
    ok: true,
    state: { ...state, battleRoyale },
    events: [],
    extra: { totalQuestions },
  }
}

export function applyBattleRoyaleRound(state: RoomState): ReducerResult {
  if (state.gameMode !== 'battle-royale' || !state.battleRoyale) {
    return { ok: false, error: 'Not a battle-royale session', code: 400 }
  }
  const br = state.battleRoyale
  const category = getQuestionCategorySelection(br.categoryId)
  if (!category) return { ok: false, error: 'Category not found', code: 400 }
  if (br.questionIndex >= br.totalQuestions) {
    return { ok: false, error: 'No more questions', code: 400 }
  }

  const question = getOrderedQuestion(category.questions, br.questionIndex, br.questionOrder)
  if (!question) return { ok: false, error: 'No more questions', code: 400 }

  const roundStartTime = Date.now()
  const alivePlayers = state.players
    .filter((p) => !br.eliminatedPlayers.includes(p.playerId))
    .map((p) => p.playerId)

  return {
    ok: true,
    state: {
      ...state,
      status: 'active',
      battleRoyale: { ...br, roundAnswers: [], roundStartTime },
    },
    events: [
      {
        event: 'br-round-start',
        data: {
          questionIndex: br.questionIndex,
          totalQuestions: br.totalQuestions,
          questionText: question.text,
          options: question.options,
          timerDuration: br.timerDuration,
          roundStartTime,
          alivePlayers,
        },
      },
    ],
  }
}

export function applyBattleRoyaleAnswer(
  state: RoomState,
  input: {
    playerId: string
    playerName: string
    avatar: string
    answerIndex: number
    answerText: string
  },
): ReducerResult<{ ignored?: boolean }> {
  if (state.gameMode !== 'battle-royale' || !state.battleRoyale) {
    return { ok: false, error: 'Not a battle-royale session', code: 400 }
  }
  const br = state.battleRoyale
  if (!br.roundStartTime) {
    return { ok: false, error: 'No active round', code: 400 }
  }

  // Silently ignore answers from already-eliminated players — they should be
  // in spectator mode on the client side anyway.
  if (br.eliminatedPlayers.includes(input.playerId)) {
    return { ok: true, state, events: [], extra: { ignored: true } }
  }

  const category = getQuestionCategorySelection(br.categoryId)
  const question = category
    ? getOrderedQuestion(category.questions, br.questionIndex, br.questionOrder)
    : undefined
  const isCorrect = question ? question.options[input.answerIndex] === question.answer : false

  const answer: BRStoredAnswer = {
    playerId: input.playerId,
    playerName: input.playerName,
    avatar: input.avatar,
    answerIndex: input.answerIndex,
    answerText: input.answerText,
    answeredAt: Date.now(),
    isCorrect,
  }

  const alive = new Set(
    state.players.filter((p) => !br.eliminatedPlayers.includes(p.playerId)).map((p) => p.playerId),
  )
  const filtered = br.roundAnswers.filter(
    (a) => a.playerId !== input.playerId && alive.has(a.playerId),
  )

  return {
    ok: true,
    state: {
      ...state,
      battleRoyale: { ...br, roundAnswers: [...filtered, answer] },
    },
    events: [
      {
        event: 'br-answer-submitted',
        data: { playerId: input.playerId, playerName: input.playerName },
      },
    ],
  }
}

export function applyBattleRoyaleReveal(
  state: RoomState,
): ReducerResult<{ eliminatedIds: string[]; survivingIds: string[]; gameOver: boolean }> {
  if (state.gameMode !== 'battle-royale' || !state.battleRoyale) {
    return { ok: false, error: 'Not a battle-royale session', code: 400 }
  }
  const br = state.battleRoyale
  const category = getQuestionCategorySelection(br.categoryId)
  const question = category
    ? getOrderedQuestion(category.questions, br.questionIndex, br.questionOrder)
    : undefined
  if (!question) return { ok: false, error: 'No question found', code: 400 }

  const alivePlayers = state.players.filter((p) => !br.eliminatedPlayers.includes(p.playerId))

  // Drop answers from eliminated players, dedup to latest per player.
  const aliveIds = new Set(alivePlayers.map((p) => p.playerId))
  const byPlayer = new Map<string, BRStoredAnswer>()
  for (const a of br.roundAnswers) {
    if (aliveIds.has(a.playerId)) byPlayer.set(a.playerId, a)
  }
  const submittedAnswers = Array.from(byPlayer.values())

  // Players who didn't answer are treated as timed-out (wrong).
  const submittedIds = new Set(submittedAnswers.map((a) => a.playerId))
  const timedOut: BRStoredAnswer[] = alivePlayers
    .filter((p) => !submittedIds.has(p.playerId))
    .map((p) => ({
      playerId: p.playerId,
      playerName: p.playerName,
      avatar: p.avatar,
      answerIndex: -1,
      answerText: '—',
      answeredAt: -1,
      isCorrect: false,
    }))

  const allAnswers = [...submittedAnswers, ...timedOut]
  const correctOnes = allAnswers.filter((a) => a.isCorrect)
  const wrongOnes = allAnswers.filter((a) => !a.isCorrect)

  let eliminatedIds: string[] = []
  if (correctOnes.length === 0) {
    const slowest = getSlowest(allAnswers)
    if (slowest) eliminatedIds = [slowest.playerId]
  } else if (wrongOnes.length === 0) {
    const slowest = getSlowest(correctOnes)
    if (slowest) eliminatedIds = [slowest.playerId]
  } else {
    eliminatedIds = wrongOnes.map((a) => a.playerId)
  }

  const updatedEliminated = Array.from(new Set([...br.eliminatedPlayers, ...eliminatedIds]))
  const survivingIds = alivePlayers
    .map((p) => p.playerId)
    .filter((id) => !eliminatedIds.includes(id))

  const gameOver = survivingIds.length <= 1
  const winnerName =
    survivingIds.length === 1
      ? state.players.find((p) => p.playerId === survivingIds[0])?.playerName
      : undefined

  const answersWithFlag = allAnswers.map((a) => ({
    ...a,
    isEliminated: eliminatedIds.includes(a.playerId),
  }))

  const events: ReducerResult['ok'] extends true ? never : never[] = [] as never
  const eventList: import('../protocol').SessionEvent[] = [
    {
      event: 'br-round-reveal',
      data: {
        questionText: question.text,
        correctAnswer: question.answer,
        answers: answersWithFlag,
        eliminatedThisRound: eliminatedIds,
        survivingPlayers: survivingIds,
        gameOver,
        winner: winnerName,
      },
    },
  ]
  if (gameOver) {
    eventList.push({
      event: 'br-game-over',
      data: { winner: winnerName, survivingPlayers: survivingIds },
    })
  }
  void events // silence unused

  return {
    ok: true,
    state: {
      ...state,
      battleRoyale: {
        ...br,
        eliminatedPlayers: updatedEliminated,
        roundAnswers: allAnswers,
      },
      status: gameOver ? 'finished' : state.status,
    },
    events: eventList,
    extra: { eliminatedIds, survivingIds, gameOver },
  }
}

export function applyBattleRoyaleNext(state: RoomState): ReducerResult<{ finished: boolean }> {
  if (state.gameMode !== 'battle-royale' || !state.battleRoyale) {
    return { ok: false, error: 'Not a battle-royale session', code: 400 }
  }
  const br = state.battleRoyale
  const nextIndex = br.questionIndex + 1
  if (nextIndex >= br.totalQuestions) {
    return {
      ok: true,
      state: { ...state, status: 'finished' },
      events: [],
      extra: { finished: true },
    }
  }

  return {
    ok: true,
    state: {
      ...state,
      battleRoyale: { ...br, questionIndex: nextIndex, roundAnswers: [], roundStartTime: undefined },
    },
    events: [],
    extra: { finished: false },
  }
}

function getSlowest(answers: BRStoredAnswer[]): BRStoredAnswer | null {
  if (answers.length === 0) return null
  return answers.reduce((slowest, a) => {
    if (a.answeredAt === -1) return a
    if (slowest.answeredAt === -1) return slowest
    return a.answeredAt > slowest.answeredAt ? a : slowest
  }, answers[0])
}
