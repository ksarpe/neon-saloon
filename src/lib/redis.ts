import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// ─── Session shape stored in Redis ───────────────────────────────────────────

export type SessionPlayer = {
  playerId: string;
  playerName: string;
  avatar: string;
  teamId: string | null;
  teamName: string | null;
};

export type SessionTeam = {
  teamId: string;
  teamName: string;
  color: string;
  emoji: string;
};

export type SessionStatus = "waiting" | "active" | "finished";

export type SessionVote = {
  playerId: string;
  playerName: string;
  teamId: string | null;
  teamName: string | null;
  cardIndex: number;
  answerIndex: number;
  answerText: string;
};

export type SessionData = {
  pin: string;
  hostName: string;
  status: SessionStatus;
  createdAt: number;
  players: SessionPlayer[];
  teams: SessionTeam[];
  cardIndex: number;
  votes: SessionVote[];
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const SESSION_TTL_SECONDS = 60 * 60 * 24; // 24 h

export const sessionKey = (pin: string) => `session:${pin}`;

export async function getSession(pin: string): Promise<SessionData | null> {
  return redis.get<SessionData>(sessionKey(pin));
}

export async function saveSession(data: SessionData): Promise<void> {
  await redis.set(sessionKey(data.pin), data, { ex: SESSION_TTL_SECONDS });
}

export async function updateSession(
  pin: string,
  patch: Partial<Omit<SessionData, "pin">>
): Promise<SessionData | null> {
  const existing = await getSession(pin);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  await saveSession(updated);
  return updated;
}
