import { NextResponse } from 'next/server'
import { getSession, saveSession } from '@/lib/appwrite/sessions'
import { QUESTION_CATEGORIES } from '@/lib/games/categories'

type RouteContext = { params: Promise<{ pin: string }> }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params

  try {
    const body = await request.json()
    const { categoryId } = body as { categoryId: string }

    const category = QUESTION_CATEGORIES.find((c) => c.id === categoryId)
    if (!category) return NextResponse.json({ error: 'Invalid category' }, { status: 400 })

    const session = await getSession(pin)
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

    session.battleRoyaleData = {
      categoryId,
      questionIndex: 0,
      eliminatedPlayers: [],
      roundAnswers: [],
      timerDuration: 20,
    }
    await saveSession(session)

    return NextResponse.json({ ok: true, categoryId, totalQuestions: category.questions.length })
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/battle-royale/setup]`, err)
    return NextResponse.json({ error: 'Failed to setup battle royale' }, { status: 500 })
  }
}
