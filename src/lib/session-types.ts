export type SessionPlayer = {
  playerId: string
  playerSecretHash?: string
  playerName: string
  avatar: string
  teamId: string | null
  teamName: string | null
}

export type SessionTeam = {
  teamId: string
  teamName: string
  color: string
  emoji: string
}

export type SessionStatus = 'waiting' | 'active' | 'finished'

export type SessionVote = {
  playerId: string
  playerName: string
  teamId: string | null
  teamName: string | null
  cardIndex: number
  answerIndex: number
  answerText: string
}

export type StoredCard = {
  id: string
  type: 'QUIZ' | 'TEST' | 'NEVER'
  title?: string
  description: string
  emoji?: string
  answer?: string
  options?: string[]
}

export type StoredScoreEntry = {
  playerId: string
  playerName: string
  score: number
  drinks?: number
  egzekwo?: number
  playerTeamId?: string
  playerTeamName?: string
}

export type StoredTeamScoreEntry = {
  teamId: string
  teamName: string
  score: number
}

export type StoredVoteRecord = {
  playerId: string
  playerName: string
  teamId: string | null
  teamName: string | null
  answerIndex: number
  answerText: string
}

export type CurrentRevealSnapshot = {
  cardIndex: number
  revealStartedAt?: number
  correctAnswer?: string
  votes: StoredVoteRecord[]
}

export type StandardSessionSettings = {
  revealCountdownSeconds: number
  answerTimeLimitSeconds: number
}

export type HighLowSessionData = {
  questionIndex: number
  guessingTeamId: string
  votingTeamId: string
  guessingCaptainId: string
  votingCaptainId: string
  currentNumber?: string
  currentResult?: {
    correctAnswer: number
    unit: string
    guessingTeamGuess: number
    correctVote: 'mniej' | 'wiecej'
    captainVote: 'mniej' | 'wiecej'
    winningTeamId: string
    winningTeamName: string
    scores: StoredScoreEntry[]
  }
  questionText?: string
  questionUnit?: string
  guessingTeamName?: string
  votingTeamName?: string
}

export type BRAnswer = {
  playerId: string
  playerName: string
  avatar: string
  answerIndex: number
  answerText: string
  answeredAt: number
  isCorrect: boolean
}

export type BattleRoyaleData = {
  categoryId: string
  questionOrder?: number[]
  questionIndex: number
  eliminatedPlayers: string[]
  roundAnswers: BRAnswer[]
  timerDuration: number
  roundStartTime?: number
}

export type SessionData = {
  pin: string
  hostSecretHash?: string
  hostName: string
  status: SessionStatus
  createdAt: number
  players: SessionPlayer[]
  teams: SessionTeam[]
  cardIndex: number
  currentCardStartedAt?: number
  currentCard?: StoredCard
  deck?: StoredCard[]
  votes: SessionVote[]
  scores?: StoredScoreEntry[]
  teamScores?: StoredTeamScoreEntry[]
  currentReveal?: CurrentRevealSnapshot
  settings?: StandardSessionSettings
  gameMode?: string
  highlowData?: HighLowSessionData
  battleRoyaleData?: BattleRoyaleData
}
