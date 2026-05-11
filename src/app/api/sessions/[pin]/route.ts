import { NextResponse } from "next/server";
import { triggerSessionEvent } from "@/lib/pusher-server";

type RouteContext = { params: Promise<{ pin: string }> };

// ─── GET /api/sessions/[pin] ─────────────────────────────────────────────────
// Returns the current lobby state: players, teams, status.

export async function GET(_req: Request, { params }: RouteContext) {
  const { pin } = await params;

  try {
    // ── Prisma (uncomment once DATABASE_URL is set) ────────────────────────
    // const session = await prisma.gameSession.findUnique({
    //   where: { pin },
    //   include: { teams: { include: { players: true } }, players: true },
    // });
    // if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });
    // return NextResponse.json(session);
    // ──────────────────────────────────────────────────────────────────────

    // Stub response (remove once Prisma is wired up)
    return NextResponse.json({
      pin,
      status: "WAITING",
      teams: [],
      players: [],
      currentCardIndex: 0,
    });
  } catch (err) {
    console.error(`[GET /api/sessions/${pin}]`, err);
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}

// ─── POST /api/sessions/[pin] ────────────────────────────────────────────────
// Body: { action: "start" | "finish" }
// Host changes session status.

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params;

  try {
    const { action } = await request.json();

    if (action === "start") {
      await triggerSessionEvent(pin, {
        event: "game-started",
        data: { cardIndex: 0 },
      });
    } else if (action === "finish") {
      await triggerSessionEvent(pin, {
        event: "game-finished",
        data: { scores: [] },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}]`, err);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}
