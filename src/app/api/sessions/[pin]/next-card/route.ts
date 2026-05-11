import { NextResponse } from "next/server";
import { triggerSessionEvent } from "@/lib/pusher-server";

type RouteContext = { params: Promise<{ pin: string }> };

// ─── POST /api/sessions/[pin]/next-card ──────────────────────────────────────
// Body: { cardIndex }
// Host advances the game to the next card.

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params;

  try {
    const body = await request.json();
    const { cardIndex } = body as { cardIndex: number };

    await triggerSessionEvent(pin, {
      event: "next-card",
      data: { cardIndex },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/next-card]`, err);
    return NextResponse.json({ error: "Failed to advance card" }, { status: 500 });
  }
}
