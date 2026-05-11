import { NextResponse } from "next/server";
import { triggerSessionEvent } from "@/lib/pusher-server";

type RouteContext = { params: Promise<{ pin: string }> };

// ─── POST /api/sessions/[pin]/join ────────────────────────────────────────────
// Body: { playerName, teamId?, newTeamName? }
// Joins an existing session as a player, optionally into a team.

const PLAYER_AVATARS = ["🤠", "💃", "🌸", "✨", "🍾", "🎀", "👑", "🦋", "🌺", "🎉"];

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params;

  try {
    const body = await request.json();
    const { playerName, teamId, newTeamName } = body as {
      playerName: string;
      teamId?: string;
      newTeamName?: string;
    };

    if (!playerName?.trim()) {
      return NextResponse.json({ error: "playerName is required" }, { status: 400 });
    }

    // ── Mock IDs (replace with real Prisma calls once DB is configured) ───
    const playerId = `player_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const resolvedTeamId = teamId ?? (newTeamName ? `team_${Date.now()}` : null);
    const avatar = PLAYER_AVATARS[Math.floor(Math.random() * PLAYER_AVATARS.length)];

    // ── Prisma (uncomment once DATABASE_URL is set) ────────────────────────
    // import { PrismaClient } from "@prisma/client";
    // const prisma = new PrismaClient();
    // const session = await prisma.gameSession.findUnique({ where: { pin } });
    // if (!session) return NextResponse.json({ error: "Session not found" }, { status: 404 });
    //
    // let resolvedTeam: Team | null = null;
    // if (newTeamName) {
    //   resolvedTeam = await prisma.team.create({
    //     data: { name: newTeamName, sessionId: session.id },
    //   });
    //   await triggerSessionEvent(pin, { event: "team-created", data: { ... } });
    // } else if (teamId) {
    //   resolvedTeam = await prisma.team.findUnique({ where: { id: teamId } });
    // }
    //
    // const player = await prisma.player.create({
    //   data: { name: playerName, sessionId: session.id, teamId: resolvedTeam?.id, avatar },
    // });
    // ──────────────────────────────────────────────────────────────────────

    // Broadcast new player to host screen + all other clients
    await triggerSessionEvent(pin, {
      event: "player-joined",
      data: {
        playerId,
        playerName: playerName.trim(),
        avatar,
        teamId: resolvedTeamId,
        teamName: newTeamName ?? null,
      },
    });

    // If a new team was created, fire that event too
    if (newTeamName && resolvedTeamId) {
      await triggerSessionEvent(pin, {
        event: "team-created",
        data: {
          teamId: resolvedTeamId,
          teamName: newTeamName,
          color: "#FF10F0",
          emoji: "🤠",
        },
      });
    }

    return NextResponse.json(
      { playerId, teamId: resolvedTeamId, avatar },
      { status: 200 }
    );
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/join]`, err);
    return NextResponse.json({ error: "Failed to join session" }, { status: 500 });
  }
}
