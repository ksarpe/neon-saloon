import { NextResponse } from "next/server";
import { getSession, saveSession } from "@/lib/sessions";
import { triggerGameEvent as triggerSessionEvent } from "@/lib/realtime";

type RouteContext = { params: Promise<{ pin: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params;

  try {
    const body = await request.json();
    const { playerId } = body as { playerId?: string };
    if (!playerId) {
      return NextResponse.json({ error: "playerId required" }, { status: 400 });
    }

    const session = await getSession(pin);
    if (!session) return NextResponse.json({ ok: true });

    session.players = session.players.filter((p) => p.playerId !== playerId);
    await saveSession(session);

    await triggerSessionEvent(pin, {
      event: "player-left",
      data: { playerId },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/leave]`, err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
