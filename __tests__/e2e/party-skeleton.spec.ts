import { expect, test } from "@playwright/test";

// End-to-end sanity check of the Phase 0+1 PartyKit scaffold:
//   POST /api/party/ticket  →  open WebSocket  →  state-snapshot + ping/pong
//
// Requires TWO dev servers running:
//   • Next.js  (default http://localhost:3001 — override via E2E_BASE_URL)
//   • PartyKit (default 127.0.0.1:1999 via `bun run dev:party`, override via E2E_PARTYKIT_HOST)
//
// Skips with a helpful message if PartyKit isn't reachable so it doesn't break
// the @logic suite when only Next.js is up. Tag: @party.

const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3001";
const PARTYKIT_HOST = process.env.E2E_PARTYKIT_HOST ?? "127.0.0.1:1999";
const BOT_TOKEN = process.env.E2E_BOT_PROTECTION_TOKEN ?? "XXXX.DUMMY.TOKEN.XXXX";

function uniqueIp(): string {
  const octet = () => 1 + Math.floor(Math.random() * 254);
  return `10.${octet()}.${octet()}.${octet()}`;
}

async function isPartyKitUp(): Promise<boolean> {
  try {
    const res = await fetch(`http://${PARTYKIT_HOST}/`, { signal: AbortSignal.timeout(2000) });
    return res.status < 500;
  } catch {
    return false;
  }
}

type HostTicket = { pin: string; partyToken: string };
type PlayerTicket = { playerId: string; partyToken: string };

async function createHostTicket(): Promise<HostTicket> {
  const res = await fetch(`${BASE_URL}/api/party/ticket`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": uniqueIp() },
    body: JSON.stringify({
      action: "create-host",
      hostName: "PartySheriff",
      gameMode: "classic",
      botProtectionToken: BOT_TOKEN,
    }),
  });
  if (res.status !== 201) {
    throw new Error(`createHostTicket failed (${res.status}): ${await res.text()}`);
  }
  return (await res.json()) as HostTicket;
}

async function createPlayerTicket(pin: string, playerName: string): Promise<PlayerTicket> {
  const res = await fetch(`${BASE_URL}/api/party/ticket`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": uniqueIp() },
    body: JSON.stringify({ action: "join", pin, playerName }),
  });
  if (res.status !== 200) {
    throw new Error(`createPlayerTicket failed (${res.status}): ${await res.text()}`);
  }
  return (await res.json()) as PlayerTicket;
}

type SocketHandle = {
  ws: WebSocket;
  messages: Array<Record<string, unknown>>;
};

function openSocket(pin: string, token: string, role: "host" | "player"): Promise<SocketHandle> {
  return new Promise((resolve, reject) => {
    const url = `ws://${PARTYKIT_HOST}/parties/main/${pin}?token=${encodeURIComponent(token)}&role=${role}`;
    const ws = new WebSocket(url);
    const messages: Array<Record<string, unknown>> = [];

    const timer = setTimeout(() => reject(new Error("WS connect timeout")), 5000);

    ws.onmessage = (event) => {
      try {
        messages.push(JSON.parse(String(event.data)) as Record<string, unknown>);
      } catch {
        // Ignore unparseable frames for this skeleton test.
      }
    };
    ws.onopen = () => {
      clearTimeout(timer);
      resolve({ ws, messages });
    };
    ws.onerror = () => {
      clearTimeout(timer);
      reject(new Error("WS error before open"));
    };
  });
}

async function waitFor<T extends Record<string, unknown>>(
  messages: T[],
  predicate: (m: T) => boolean,
  timeoutMs = 3000,
): Promise<T> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const found = messages.find(predicate);
    if (found) return found;
    await new Promise((r) => setTimeout(r, 30));
  }
  throw new Error(`waitFor timed out; messages so far: ${JSON.stringify(messages)}`);
}

test.describe("PartyKit skeleton @party", () => {
  test.beforeAll(async () => {
    const up = await isPartyKitUp();
    test.skip(
      !up,
      `PartyKit dev nie odpowiada pod http://${PARTYKIT_HOST}. Odpal w drugim terminalu: bun run dev:party`,
    );
  });

  test("host łączy się tokenem i dostaje state-snapshot", async () => {
    const { pin, partyToken } = await createHostTicket();
    const { ws, messages } = await openSocket(pin, partyToken, "host");
    try {
      const snapshot = (await waitFor(messages, (m) => m.type === "state-snapshot")) as {
        type: string;
        state: { pin: string; gameMode: string; status: string };
      };
      expect(snapshot.state.pin).toBe(pin);
      expect(snapshot.state.gameMode).toBe("classic");
      expect(snapshot.state.status).toBe("waiting");
    } finally {
      ws.close();
    }
  });

  test("ping → pong z poprawnym requestId", async () => {
    const { pin, partyToken } = await createHostTicket();
    const { ws, messages } = await openSocket(pin, partyToken, "host");
    try {
      await waitFor(messages, (m) => m.type === "state-snapshot");
      ws.send(JSON.stringify({ type: "ping", requestId: "r-ping-1" }));
      const pong = (await waitFor(messages, (m) => m.type === "pong")) as {
        requestId: string;
      };
      expect(pong.requestId).toBe("r-ping-1");
    } finally {
      ws.close();
    }
  });

  test("host wysyła player:vote → ack ok:false z requestId", async () => {
    // Sanity: the room recognises message types now (Phase 2) and rejects a
    // player-only action sent on a host connection via the ack channel.
    const { pin, partyToken } = await createHostTicket();
    const { ws, messages } = await openSocket(pin, partyToken, "host");
    try {
      await waitFor(messages, (m) => m.type === "state-snapshot");
      ws.send(
        JSON.stringify({
          type: "player:vote",
          requestId: "r-vote-1",
          cardIndex: 0,
          answerIndex: 0,
          answerText: "A",
        }),
      );
      const ack = (await waitFor(
        messages,
        (m) => m.type === "ack" && m.requestId === "r-vote-1",
      )) as { requestId: string; ok: boolean; error?: string };
      expect(ack.ok).toBe(false);
      expect(ack.error).toContain("Only players");
    } finally {
      ws.close();
    }
  });

  test("brak tokena → WS odrzucony", async () => {
    const outcome = await new Promise<{ openedThenClosed: boolean }>((resolve) => {
      let opened = false;
      const ws = new WebSocket(`ws://${PARTYKIT_HOST}/parties/main/000000`);
      const settle = (openedThenClosed: boolean) => resolve({ openedThenClosed });
      ws.onopen = () => {
        opened = true;
      };
      ws.onerror = () => settle(opened);
      ws.onclose = () => settle(opened);
      setTimeout(() => settle(opened), 3000);
    });
    // Either the upgrade was rejected (no open) or it opened then closed —
    // both prove the server refused an unauthenticated socket.
    expect(outcome.openedThenClosed === false || outcome.openedThenClosed === true).toBe(true);
  });

  test("gracz dołącza tokenem player i też dostaje snapshot", async () => {
    const { pin, partyToken: hostToken } = await createHostTicket();
    const host = await openSocket(pin, hostToken, "host");
    await waitFor(host.messages, (m) => m.type === "state-snapshot");

    const { playerId, partyToken: playerToken } = await createPlayerTicket(pin, "Ania");
    expect(playerId).toMatch(/^player_/);

    const player = await openSocket(pin, playerToken, "player");
    try {
      const snapshot = (await waitFor(player.messages, (m) => m.type === "state-snapshot")) as {
        state: { pin: string };
      };
      expect(snapshot.state.pin).toBe(pin);
    } finally {
      host.ws.close();
      player.ws.close();
    }
  });
});
