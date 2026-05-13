import { NextResponse } from "next/server";
import { getSession, saveSession } from "@/lib/redis";
import { triggerSessionEvent } from "@/lib/pusher-server";

type RouteContext = { params: Promise<{ pin: string }> };

const PLAYER_AVATARS = ["🤠", "💃", "🌸", "✨", "🍾", "🎀", "👑", "🦋", "🌺", "🎉"];

export async function POST(request: Request, { params }: RouteContext) {
  const { pin } = await params;

  try {
    const body = await request.json();
    const { playerName, avatar: chosenAvatar, teamId, newTeamName } = body as {
      playerName: string;
      avatar?: string;
      teamId?: string;
      newTeamName?: string;
    };

    if (!playerName?.trim()) {
      return NextResponse.json({ error: "playerName is required" }, { status: 400 });
    }

    const session = await getSession(pin);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }
    if (session.status === "active") {
      return NextResponse.json({ error: "Game already started" }, { status: 423 });
    }
    if (session.status === "finished") {
      return NextResponse.json({ error: "Game already finished" }, { status: 410 });
    }

    const playerId = `player_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const avatar = chosenAvatar ?? PLAYER_AVATARS[Math.floor(Math.random() * PLAYER_AVATARS.length)];

    // Resolve team
    let resolvedTeamId = teamId ?? null;
    let resolvedTeamName = newTeamName ?? null;

    if (newTeamName && !teamId) {
      resolvedTeamId = `team_${Date.now()}`;
      const newTeam = {
        teamId: resolvedTeamId,
        teamName: newTeamName,
        color: "#FF10F0",
        emoji: "🤠",
      };
      session.teams = [...session.teams, newTeam];

      await triggerSessionEvent(pin, {
        event: "team-created",
        data: newTeam,
      });
    }

    // Add player
    session.players = [
      ...session.players,
      { playerId, playerName: playerName.trim(), avatar, teamId: resolvedTeamId, teamName: resolvedTeamName },
    ];

    await saveSession(session);

    await triggerSessionEvent(pin, {
      event: "player-joined",
      data: {
        playerId,
        playerName: playerName.trim(),
        avatar,
        teamId: resolvedTeamId,
        teamName: resolvedTeamName,
      },
    });

    return NextResponse.json({ playerId, teamId: resolvedTeamId, avatar }, { status: 200 });
  } catch (err) {
    console.error(`[POST /api/sessions/${pin}/join]`, err);
    return NextResponse.json({ error: "Failed to join session" }, { status: 500 });
  }
}
