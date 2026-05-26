export type WireCard = {
  id: string
  type: 'QUIZ' | 'TEST' | 'NEVER'
  title?: string
  description: string
  emoji?: string
  options?: string[]
}

export type PlayerJoinedPayload = {
  playerId: string
  playerName: string
  avatar: string
  teamId: string | null
  teamName: string | null
}

export type PlayerLeftPayload = {
  playerId: string
}

export type TeamCreatedPayload = {
  teamId: string
  teamName: string
  color: string
  emoji: string
}

export type TeamUpdatedPayload = {
  teamId: string
  teamName: string
  memberCount: number
}

export type VoteCastPayload = {
  playerId: string
  playerName: string
  teamId: string | null
  teamName: string | null
  cardIndex: number
  answerIndex: number
  answerText: string
}

export type ScoreEntry = {
  playerId: string
  playerName: string
  score: number
  drinks?: number
  playerTeamId?: string
  playerTeamName?: string
}

export type TeamScoreEntry = {
  teamId: string
  teamName: string
  score: number
}

export type StandardGameSettings = {
  revealCountdownSeconds: number
  answerTimeLimitSeconds: number
}

export type VotesRevealedPayload = {
  cardIndex: number
  revealStartedAt?: number
  correctAnswer?: string
  votes: Array<{
    playerId: string
    playerName: string
    teamId: string | null
    teamName: string | null
    answerIndex: number
    answerText: string
  }>
  scores: ScoreEntry[]
  teamScores: TeamScoreEntry[]
}

export type NextCardPayload = {
  cardIndex: number
  cardStartedAt?: number
  card: WireCard
  settings?: StandardGameSettings
}

export type GameStartedPayload = {
  cardIndex: number
  cardStartedAt?: number
  card: WireCard
  settings?: StandardGameSettings
}

export type GameFinishedPayload = {
  scores: ScoreEntry[]
  teamScores: TeamScoreEntry[]
  showPlayerPoints?: boolean
}

export type HighLowRoundStartPayload = {
  roundIndex: number
  questionText: string
  questionUnit: string
  guessingTeamId: string
  guessingTeamName: string
  votingTeamId: string
  votingTeamName: string
  guessingCaptainId: string
  votingCaptainId: string
}

export type HighLowNumberSubmittedPayload = {
  number: string
}

export type HighLowRoundResultPayload = {
  correctAnswer: number
  unit: string
  guessingTeamGuess: number
  correctVote: 'mniej' | 'wiecej'
  captainVote: 'mniej' | 'wiecej'
  winningTeamId: string
  winningTeamName: string
  scores: ScoreEntry[]
}

export type BRRoundStartPayload = {
  questionIndex: number
  totalQuestions?: number
  questionText: string
  options: string[]
  timerDuration: number
  roundStartTime: number
  alivePlayers: string[]
}

export type BRAnswerSubmittedPayload = {
  playerId: string
  playerName: string
}

export type BRAnswerResult = {
  playerId: string
  playerName: string
  avatar: string
  answerIndex: number
  answerText: string
  answeredAt: number
  isCorrect: boolean
  isEliminated: boolean
}

export type BRRoundRevealPayload = {
  questionText: string
  correctAnswer: string
  answers: BRAnswerResult[]
  eliminatedThisRound: string[]
  survivingPlayers: string[]
  gameOver: boolean
  winner?: string
}

export type BRGameOverPayload = {
  winner?: string
  survivingPlayers: string[]
}

export type SessionEvent =
  | { event: 'player-joined'; data: PlayerJoinedPayload }
  | { event: 'player-left'; data: PlayerLeftPayload }
  | { event: 'team-created'; data: TeamCreatedPayload }
  | { event: 'team-updated'; data: TeamUpdatedPayload }
  | { event: 'vote-cast'; data: VoteCastPayload }
  | { event: 'votes-revealed'; data: VotesRevealedPayload }
  | { event: 'next-card'; data: NextCardPayload }
  | { event: 'game-started'; data: GameStartedPayload }
  | { event: 'game-finished'; data: GameFinishedPayload }
  | { event: 'highlow-round-start'; data: HighLowRoundStartPayload }
  | { event: 'highlow-number-submitted'; data: HighLowNumberSubmittedPayload }
  | { event: 'highlow-round-result'; data: HighLowRoundResultPayload }
  | { event: 'br-round-start'; data: BRRoundStartPayload }
  | { event: 'br-answer-submitted'; data: BRAnswerSubmittedPayload }
  | { event: 'br-round-reveal'; data: BRRoundRevealPayload }
  | { event: 'br-game-over'; data: BRGameOverPayload }

export interface GameSocketHandlers {
  onPlayerJoined?: (data: PlayerJoinedPayload) => void
  onPlayerLeft?: (data: PlayerLeftPayload) => void
  onTeamCreated?: (data: TeamCreatedPayload) => void
  onTeamUpdated?: (data: TeamUpdatedPayload) => void
  onVoteCast?: (data: VoteCastPayload) => void
  onVotesRevealed?: (data: VotesRevealedPayload) => void
  onNextCard?: (data: NextCardPayload) => void
  onGameStarted?: (data: GameStartedPayload) => void
  onGameFinished?: (data: GameFinishedPayload) => void
  onHighLowRoundStart?: (data: HighLowRoundStartPayload) => void
  onHighLowNumberSubmitted?: (data: HighLowNumberSubmittedPayload) => void
  onHighLowRoundResult?: (data: HighLowRoundResultPayload) => void
  onBRRoundStart?: (data: BRRoundStartPayload) => void
  onBRAnswerSubmitted?: (data: BRAnswerSubmittedPayload) => void
  onBRRoundReveal?: (data: BRRoundRevealPayload) => void
  onBRGameOver?: (data: BRGameOverPayload) => void
}
