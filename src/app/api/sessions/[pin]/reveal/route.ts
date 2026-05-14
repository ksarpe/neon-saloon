import { NextResponse } from "next/server";
import { triggerSessionEvent } from "@/lib/pusher-server";
import type { ScoreEntry, TeamScoreEntry } from "@/lib/pusher-server";

type RouteContext = { params: Promise<{ pin: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params;

  try {
    const body = await request.json();
    const { cardIndex, correctAnswer, votes, scores, teamScores } = body as {
      cardIndex: number;
      correctAnswer?: string;
      votes: Array<{
        playerId: string;
        playerName: string;
        teamId: string | null;
        teamName: string | null;
        answerIndex: number;
        answerText: string;
      }>;
      scores: ScoreEntry[];
      teamScores: TeamScoreEntry[];
    };

    await triggerSessionEvent(pin, {
      event: "votes-revealed",
      data: { cardIndex, correctAnswer, votes, scores, teamScores },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/reveal]`, err);
    return NextResponse.json({ error: "Failed to reveal votes" }, { status: 500 });
  }
}
