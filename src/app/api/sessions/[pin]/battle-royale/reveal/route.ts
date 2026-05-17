import { NextResponse } from 'next/server'
import { getSession, saveSession } from '@/lib/appwrite/sessions'
import { triggerGameEvent } from '@/lib/appwrite/realtime'
import { QUESTION_CATEGORIES } from '@/lib/games/categories'
import { isHostAuthorized } from '@/lib/session-host-auth'
import type { BRAnswer } from '@/lib/appwrite/sessions'
import type { BRAnswerResult } from '@/lib/appwrite/realtime'

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
    const session = await getSession(pin)
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    if (!isHostAuthorized(_request, session)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const br = session.battleRoyaleData
    if (!br) return NextResponse.json({ error: 'Not a battle-royale session' }, { status: 400 })

    const category = QUESTION_CATEGORIES.find((c) => c.id === br.categoryId)
    const question = category?.questions[br.questionIndex]
    if (!question) return NextResponse.json({ error: 'No question found' }, { status: 400 })

    const alivePlayers = session.players.filter((p) => !br.eliminatedPlayers.includes(p.playerId))

    // Build answer list — players who didn't answer are treated as timed out (wrong)
    const submittedIds = new Set(br.roundAnswers.map((a) => a.playerId))
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

    const allAnswers: BRAnswer[] = [...br.roundAnswers, ...timedOutPlayers]

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

    const updatedEliminated = [...br.eliminatedPlayers, ...eliminatedIds]
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
