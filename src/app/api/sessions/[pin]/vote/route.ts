import { NextResponse } from "next/server";
import { triggerSessionEvent } from "@/lib/pusher-server";

type RouteContext = { params: Promise<{ pin: string }> };

// ─── POST /api/sessions/[pin]/vote ──────────────────────────────────────────
// Body: { playerId, playerName, teamId?, teamName?, cardIndex, answerIndex, answerText }

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params;

  try {
    const body = await request.json();
    const { playerId, playerName, teamId, teamName, cardIndex, answerIndex, answerText } =
      body as {
        playerId: string;
        playerName: string;
        teamId?: string;
        teamName?: string;
        cardIndex: number;
        answerIndex: number;
        answerText: string;
      };

    if (!playerId || cardIndex === undefined) {
      return NextResponse.json({ error: "playerId and cardIndex required" }, { status: 400 });
    }

    // ── Prisma (uncomment once DATABASE_URL is set) ────────────────────────
    // const vote = await prisma.vote.upsert({
    //   where: { sessionId_playerId_cardIndex: { sessionId, playerId, cardIndex } },
    //   create: { sessionId, playerId, teamId, cardIndex, answerIndex, answerText },
    //   update: { answerIndex, answerText },
    // });
    // ──────────────────────────────────────────────────────────────────────

    // Broadcast "someone voted" (answer hidden until reveal)
    await triggerSessionEvent(pin, {
      event: "vote-cast",
      data: {
        playerId,
        playerName,
        teamId: teamId ?? null,
        teamName: teamName ?? null,
        cardIndex,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/vote]`, err);
    return NextResponse.json({ error: "Failed to cast vote" }, { status: 500 });
  }
}
