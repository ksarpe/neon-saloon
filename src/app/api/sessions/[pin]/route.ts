import { NextResponse } from "next/server";
import { triggerSessionEvent } from "@/lib/pusher-server";
import type { WireCard } from "@/lib/pusher-server";

type RouteContext = { params: Promise<{ pin: string }> };

export async function GET(_req: Request, { params }: RouteContext) {
  const { pin } = await params;
  return NextResponse.json({
    pin, status: "WAITING", teams: [], players: [], currentCardIndex: 0,
  });
}

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params;
  try {
    const body = await request.json();
    const { action, card } = body as { action: string; card?: WireCard };

    if (action === "start" && card) {
      await triggerSessionEvent(pin, {
        event: "game-started",
        data: { cardIndex: 0, card },
      });
    } else if (action === "finish") {
      await triggerSessionEvent(pin, {
        event: "game-finished",
        data: { scores: body.scores ?? [] },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}]`, err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
