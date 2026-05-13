import { NextResponse } from "next/server";
import { triggerSessionEvent } from "@/lib/pusher-server";

type RouteContext = { params: Promise<{ pin: string }> };

// ─── POST /api/sessions/[pin]/reveal ─────────────────────────────────────────
// Triggered by the host to reveal all votes for the current card.
// Body: { cardIndex, votes: [...], scores: [...] }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params;

  try {
    const body = await request.json();
    const { cardIndex, votes, scores } = body as {
      cardIndex: number;
      votes: Array<{
        playerId: string;
        playerName: string;
        teamId: string | null;
        teamName: string | null;
        answerIndex: number;
        answerText: string;
      }>;
      scores: Array<{ teamId: string; teamName: string; score: number; playerName: string }>;
    };

    await triggerSessionEvent(pin, {
      event: "votes-revealed",
      data: { cardIndex, votes, scores },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/reveal]`, err);
    return NextResponse.json(
      { error: "Failed to reveal votes" },
      { status: 500 },
    );
  }
}
