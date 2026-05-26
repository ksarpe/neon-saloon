// Pure reducers for the HighLow ("Mniej więcej") team-based mode.
// Mirrors the HighLow room actions {setup,round,number,vote}.
//
// Question facts come from a fixed deck (HIGHLOW_QUESTIONS) shuffled
// deterministically by the room PIN — server and client derive the same order
// independently, so the host can refresh mid-game without persisting it.

import { HIGHLOW_QUESTIONS } from '../../src/config/games/highlow'
import { seededShuffleItems } from '../../src/lib/games/question-limit'
import type { SessionEvent } from '../protocol'
import type { HighLowData, HighLowResult, RoomState, RoomTeam } from '../state'
import type { ReducerResult } from './classic'

export function applyHighLowSetup(
  state: RoomState,
  input: { team1Name: string; team2Name: string },
): ReducerResult<{ team1: RoomTeam; team2: RoomTeam }> {
  if (state.gameMode !== 'highlow') {
    return { ok: false, error: 'Not a highlow session', code: 400 }
  }
  if (state.teams.length >= 2) {
    return { ok: false, error: 'Teams already set up', code: 409 }
  }

  const stamp = Date.now()
  const team1: RoomTeam = {
    teamId: `team_${stamp}_1`,
    teamName: input.team1Name,
    color: '#FF10F0',
    emoji: '🤠',
  }
  const team2: RoomTeam = {
    teamId: `team_${stamp}_2`,
    teamName: input.team2Name,
    color: '#FFD700',
    emoji: '🎯',
  }

  return {
    ok: true,
    state: { ...state, teams: [team1, team2] },
    events: [
      { event: 'team-created', data: team1 },
      { event: 'team-created', data: team2 },
    ],
    extra: { team1, team2 },
  }
}

export function applyHighLowRound(
  state: RoomState,
  input: {
    roundIndex: number
    questionText: string
    questionUnit: string
    guessingTeamId: string
    guessingTeamName: string
    votingTeamId: string
    votingTeamName: string
    guessingCaptainId: string
    votingCaptainId: string
  },
): ReducerResult {
  if (state.gameMode !== 'highlow') {
    return { ok: false, error: 'Not a highlow session', code: 400 }
  }

  const highlow: HighLowData = {
    questionIndex: input.roundIndex,
    guessingTeamId: input.guessingTeamId,
    guessingTeamName: input.guessingTeamName,
    votingTeamId: input.votingTeamId,
    votingTeamName: input.votingTeamName,
    guessingCaptainId: input.guessingCaptainId,
    votingCaptainId: input.votingCaptainId,
    questionText: input.questionText,
    questionUnit: input.questionUnit,
    currentNumber: undefined,
    currentResult: undefined,
  }

  return {
    ok: true,
    state: { ...state, status: 'active', highlow },
    events: [
      {
        event: 'highlow-round-start',
        data: {
          roundIndex: input.roundIndex,
          questionText: input.questionText,
          questionUnit: input.questionUnit,
          guessingTeamId: input.guessingTeamId,
          guessingTeamName: input.guessingTeamName,
          votingTeamId: input.votingTeamId,
          votingTeamName: input.votingTeamName,
          guessingCaptainId: input.guessingCaptainId,
          votingCaptainId: input.votingCaptainId,
        },
      },
    ],
  }
}

export function applyHighLowNumber(
  state: RoomState,
  input: { playerId: string; number: string },
): ReducerResult {
  if (state.gameMode !== 'highlow' || !state.highlow) {
    return { ok: false, error: 'No active round', code: 400 }
  }
  if (state.highlow.guessingCaptainId !== input.playerId) {
    return { ok: false, error: 'Not the guessing captain', code: 403 }
  }

  return {
    ok: true,
    state: { ...state, highlow: { ...state.highlow, currentNumber: input.number } },
    events: [{ event: 'highlow-number-submitted', data: { number: input.number } }],
  }
}

export function applyHighLowVote(
  state: RoomState,
  input: { playerId: string; vote: 'mniej' | 'wiecej' },
): ReducerResult<{ result: HighLowResult }> {
  if (state.gameMode !== 'highlow' || !state.highlow) {
    return { ok: false, error: 'No active round', code: 400 }
  }
  const hl = state.highlow
  if (hl.votingCaptainId !== input.playerId) {
    return { ok: false, error: 'Not the voting captain', code: 403 }
  }
  if (!hl.currentNumber) {
    return { ok: false, error: 'No number submitted yet', code: 400 }
  }

  const question =
    seededShuffleItems(HIGHLOW_QUESTIONS, state.pin)[hl.questionIndex % HIGHLOW_QUESTIONS.length]
  const guess = parseFloat(hl.currentNumber)
  const correctVote: 'mniej' | 'wiecej' = guess < question.answer ? 'wiecej' : 'mniej'
  // Exact guess means the guessing team wins immediately — they nailed the number.
  const guessedExactly = guess === question.answer
  const captainWon = guessedExactly ? false : input.vote === correctVote

  const winningTeamId = captainWon ? hl.votingTeamId : hl.guessingTeamId
  const winningTeam = state.teams.find((t) => t.teamId === winningTeamId)
  const winningTeamName = winningTeam?.teamName ?? 'Nieznana banda'

  const winningPlayers = state.players.filter((p) => p.teamId === winningTeamId)
  const updatedScores = [...(state.scores ?? [])]
  winningPlayers.forEach((p) => {
    const idx = updatedScores.findIndex((s) => s.playerId === p.playerId)
    if (idx > -1) {
      updatedScores[idx] = { ...updatedScores[idx], score: updatedScores[idx].score + 1 }
    } else {
      updatedScores.push({
        playerId: p.playerId,
        playerName: p.playerName,
        score: 1,
        playerTeamId: p.teamId ?? undefined,
        playerTeamName: p.teamName ?? undefined,
      })
    }
  })

  const result: HighLowResult = {
    correctAnswer: question.answer,
    unit: question.unit,
    guessingTeamGuess: guess,
    correctVote: guessedExactly ? input.vote : correctVote,
    captainVote: input.vote,
    winningTeamId,
    winningTeamName,
    scores: updatedScores,
  }

  const event: SessionEvent = {
    event: 'highlow-round-result',
    data: {
      correctAnswer: result.correctAnswer,
      unit: result.unit,
      guessingTeamGuess: result.guessingTeamGuess,
      correctVote: result.correctVote,
      captainVote: result.captainVote,
      winningTeamId: result.winningTeamId,
      winningTeamName: result.winningTeamName,
      scores: result.scores,
    },
  }

  return {
    ok: true,
    state: {
      ...state,
      scores: updatedScores,
      highlow: { ...hl, currentResult: result },
    },
    events: [event],
    extra: { result },
  }
}
