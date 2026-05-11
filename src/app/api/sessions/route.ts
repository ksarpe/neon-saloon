import { NextResponse } from "next/server";
import { triggerSessionEvent } from "@/lib/pusher-server";

// ─── POST /api/sessions ───────────────────────────────────────────────────────
// Body: { hostName?: string }
// Creates a new GameSession with a random 4-digit PIN.
// Returns: { pin, sessionId }

function generatePin(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const hostName: string = body.hostName ?? "Host";

    // NOTE: Prisma client is deliberately omitted here because the project
    // does not yet have a datasource configured. Replace the mock with
    // `await prisma.gameSession.create(...)` once DATABASE_URL is set.
    const pin = generatePin();
    const sessionId = `session_${Date.now()}`;

    // ── Prisma (uncomment once DATABASE_URL is configured) ─────────────────
    // const { PrismaClient } = await import("@prisma/client");
    // const prisma = new PrismaClient();
    // const session = await prisma.gameSession.create({
    //   data: { pin, hostName },
    // });
    // const sessionId = session.id;
    // ─────────────────────────────────────────────────────────────────────────

    return NextResponse.json({ pin, sessionId }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/sessions]", err);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}
