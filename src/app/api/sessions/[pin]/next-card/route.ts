import { NextResponse } from "next/server";
import { triggerSessionEvent } from "@/lib/pusher-server";
import type { WireCard } from "@/lib/pusher-server";

type RouteContext = { params: Promise<{ pin: string }> };

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params;
  try {
    const body = await request.json();
    const { cardIndex, card } = body as { cardIndex: number; card: WireCard };

    await triggerSessionEvent(pin, {
      event: "next-card",
      data: { cardIndex, card },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/next-card]`, err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
