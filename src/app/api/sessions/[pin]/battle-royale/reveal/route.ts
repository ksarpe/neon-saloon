import { NextResponse } from 'next/server'

import { getQuestionCategorySelection } from '@/config/games/category-selection'
import type { BRAnswerResult } from '@/lib/appwrite/realtime'
import { triggerGameEvent } from '@/lib/appwrite/realtime'
import type { BRAnswer } from '@/lib/appwrite/sessions'
import { saveSession } from '@/lib/appwrite/sessions'
import { getOrderedQuestion } from '@/lib/games/question-limit'
import { enforceSessionActionRateLimit } from '@/lib/session-action-rate-limit'
import { requireHostSession } from '@/lib/session-api'

type RouteContext = { params: Promise<{ pin: string }> }

function getSlowest(answers: BRAnswer[]): BRAnswer | null {
  if (answers.length === 0) return null
  return answers.reduce((slowest, a) => {
    if (a.answeredAt === -1) return a
    if (slowest.answeredAt === -1) return slowest
    return a.answeredAt > slowest.answeredAt ? a : slowest
  }, answers[0])
}

export async function POST(_request: Request, { params }: RouteContext) {
  const { pin } = await params

  try {
    const hostSession = await requireHostSession(_request, pin)
    if (!hostSession.ok) return hostSession.response
    const rateLimitResponse = await enforceSessionActionRateLimit('hostAction', pin, 'host')
    if (rateLimitResponse) return rateLimitResponse
    const session = hostSession.value

    const br = session.battleRoyaleData
    if (!br) return NextResponse.json({ error: 'Not a battle-royale session' }, { status: 400 })

    const category = getQuestionCategorySelection(br.categoryId)
    const question = category
      ? getOrderedQuestion(category.questions, br.questionIndex, br.questionOrder)
      : undefined
    if (!question) return NextResponse.json({ error: 'No question found' }, { status: 400 })

    const alivePlayers = session.players.filter((p) => !br.eliminatedPlayers.includes(p.playerId))
    const submittedAnswers = normalizeRoundAnswers(
      br.roundAnswers,
      alivePlayers.map((p) => p.playerId)
    )

    // Build answer list — players who didn't answer are treated as timed out (wrong)
    const submittedIds = new Set(submittedAnswers.map((a) => a.playerId))
    const timedOutPlayers: BRAnswer[] = alivePlayers
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

    const allAnswers: BRAnswer[] = [...submittedAnswers, ...timedOutPlayers]

    // Elimination logic
    const correctOnes = allAnswers.filter((a) => a.isCorrect)
    const wrongOnes = allAnswers.filter((a) => !a.isCorrect)

    let eliminatedIds: string[] = []

    if (correctOnes.length === 0) {
      // Nobody answered correctly → only slowest eliminated
      const slowest = getSlowest(allAnswers)
      if (slowest) eliminatedIds = [slowest.playerId]
    } else if (wrongOnes.length === 0) {
      // Everyone correct → slowest eliminated
      const slowest = getSlowest(correctOnes)
      if (slowest) eliminatedIds = [slowest.playerId]
    } else {
      // Mixed → wrong players eliminated
      eliminatedIds = wrongOnes.map((a) => a.playerId)
    }

    const updatedEliminated = Array.from(new Set([...br.eliminatedPlayers, ...eliminatedIds]))
    const survivingIds = alivePlayers
      .map((p) => p.playerId)
      .filter((id) => !eliminatedIds.includes(id))

    const gameOver = survivingIds.length <= 1
    const winner =
      survivingIds.length === 1
        ? session.players.find((p) => p.playerId === survivingIds[0])?.playerName
        : undefined

    const answers: BRAnswerResult[] = allAnswers.map((a) => ({
      ...a,
      isEliminated: eliminatedIds.includes(a.playerId),
    }))

    session.battleRoyaleData = {
      ...br,
      eliminatedPlayers: updatedEliminated,
      roundAnswers: allAnswers,
    }
    if (gameOver) session.status = 'finished'
    await saveSession(session)

    await triggerGameEvent(pin, {
      event: 'br-round-reveal',
      data: {
        questionText: question.text,
        correctAnswer: question.answer,
        answers,
        eliminatedThisRound: eliminatedIds,
        survivingPlayers: survivingIds,
        gameOver,
        winner,
      },
    })

    if (gameOver) {
      await triggerGameEvent(pin, {
        event: 'br-game-over',
        data: { winner, survivingPlayers: survivingIds },
      })
    }

    return NextResponse.json({ ok: true, eliminatedIds, survivingIds, gameOver, winner })
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/battle-royale/reveal]`, err)
    return NextResponse.json({ error: 'Failed to reveal round' }, { status: 500 })
  }
}

function normalizeRoundAnswers(answers: BRAnswer[] | undefined, alivePlayerIds: string[]) {
  const alive = new Set(alivePlayerIds)
  const byPlayer = new Map<string, BRAnswer>()

  for (const answer of answers ?? []) {
    if (alive.has(answer.playerId)) byPlayer.set(answer.playerId, answer)
  }

  return Array.from(byPlayer.values())
}
