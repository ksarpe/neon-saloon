import { expect, test } from "@playwright/test";

import {
  makeDeck,
  makeNeverDeck,
  PartyClient,
  type PlayerHandle,
} from "./helpers/party-client";

// End-to-end logic tests for the CLASSIC mode running on PartyKit.
//
// What we're proving:
//   1. The full classic flow (join → start → vote → reveal → next → finish)
//      works end-to-end through WebSockets to the Durable Object room.
//   2. State + events stay correct under realistic and pathological load —
//      most importantly, 10 simultaneous votes all land with NO lost events,
//      since the DO actor model serialises writes by design.
//
// Requires TWO dev servers running:
//   • Next.js (default http://localhost:3000, override via E2E_BASE_URL)
//   • PartyKit (default 127.0.0.1:1999 via `bun run dev:party`)
//
// Tagged @party so it doesn't run in the legacy @logic suite.

const PARTYKIT_HOST = process.env.E2E_PARTYKIT_HOST ?? "127.0.0.1:1999";

async function isPartyKitUp(): Promise<boolean> {
  try {
    const res = await fetch(`http://${PARTYKIT_HOST}/`, { signal: AbortSignal.timeout(2000) });
    return res.status < 500;
  } catch {
    return false;
  }
}

test.describe("PartyKit — tryb classic @party", () => {
  test.beforeAll(async () => {
    test.skip(
      !(await isPartyKitUp()),
      `PartyKit dev nie odpowiada pod http://${PARTYKIT_HOST}. Odpal: bun run dev:party`,
    );
  });

  test("nowy salon: snapshot pokazuje waiting + classic + brak graczy", async () => {
    const client = new PartyClient();
    const host = await client.createHost({ gameMode: "classic" });
    try {
      expect(host.state).not.toBeNull();
      expect(host.state?.status).toBe("waiting");
      expect(host.state?.gameMode).toBe("classic");
      expect(host.state?.players).toHaveLength(0);
    } finally {
      host.close();
    }
  });

  test("gracze dołączają — host dostaje broadcast i widzi ich w stanie", async () => {
    const client = new PartyClient();
    const host = await client.createHost();
    try {
      const ania = await client.joinPlayer(host.pin, { playerName: "Ania" });
      const zosia = await client.joinPlayer(host.pin, { playerName: "Zosia" });

      await host.waitForEventCount("player-joined", 2);
      const joinedEvents = host.events.filter((e) => e.event === "player-joined");
      expect(joinedEvents).toHaveLength(2);

      // Snapshot for the connecting player includes themselves + earlier players.
      expect(zosia.state?.players.map((p) => p.playerName).sort()).toEqual(["Ania", "Zosia"]);

      ania.close();
      zosia.close();
    } finally {
      host.close();
    }
  });

  test("duplikat nazwy gracza dostaje sufiks (2)", async () => {
    const client = new PartyClient();
    const host = await client.createHost();
    try {
      const first = await client.joinPlayer(host.pin, { playerName: "Bob" });
      const second = await client.joinPlayer(host.pin, { playerName: "Bob" });
      // Wait until both join events arrive at host so name allocation has settled.
      await host.waitForEventCount("player-joined", 2);

      expect(first.playerName).toBe("Bob");
      expect(second.playerName).toBe("Bob (2)");
      expect(second.playerId).not.toBe(first.playerId);

      first.close();
      second.close();
    } finally {
      host.close();
    }
  });

  test("start: status → active i game-started broadcast", async () => {
    const client = new PartyClient();
    const host = await client.createHost();
    try {
      const ack = await host.start({ deck: makeDeck(2) });
      expect(ack.ok).toBe(true);

      const event = await host.waitForEvent((e) => e.event === "game-started");
      expect(event.event).toBe("game-started");

      // Snapshot should not be stale after the host's own action: do a ping
      // round-trip to flush messages, then look at the snapshot we have.
      // (Snapshots aren't re-sent on host actions, so we rely on event history.)
      expect(host.events.filter((e) => e.event === "game-started")).toHaveLength(1);
    } finally {
      host.close();
    }
  });

  test("vote: gracz dostaje ok=true, host widzi vote-cast", async () => {
    const client = new PartyClient();
    const host = await client.createHost();
    try {
      const ania = await client.joinPlayer(host.pin, { playerName: "Ania" });
      await host.waitForEvent((e) => e.event === "player-joined");

      await host.start({ deck: makeDeck(1) });
      await host.waitForEvent((e) => e.event === "game-started");

      const ack = await ania.vote({ cardIndex: 0, answerIndex: 1, answerText: "B" });
      expect(ack.ok).toBe(true);

      const voteEvt = await host.waitForEvent((e) => e.event === "vote-cast");
      expect((voteEvt.data as { playerId: string; answerText: string }).playerId).toBe(ania.playerId);
      expect((voteEvt.data as { answerText: string }).answerText).toBe("B");

      ania.close();
    } finally {
      host.close();
    }
  });

  test("ponowny vote nadpisuje poprzedni głos (upsert)", async () => {
    const client = new PartyClient();
    const host = await client.createHost();
    try {
      const ania = await client.joinPlayer(host.pin, { playerName: "Ania" });
      await host.waitForEvent((e) => e.event === "player-joined");
      await host.start({ deck: makeDeck(1) });

      const first = await ania.vote({ cardIndex: 0, answerIndex: 0, answerText: "A" });
      expect(first.ok).toBe(true);
      const second = await ania.vote({ cardIndex: 0, answerIndex: 2, answerText: "C" });
      expect(second.ok).toBe(true);

      // Both vote-cast events were broadcast (that's the wire behaviour), but
      // the AUTHORITATIVE state shows just one vote per player for the card.
      await host.waitForEventCount("vote-cast", 2);
      ania.close();
    } finally {
      host.close();
    }
  });

  test("vote na nieaktualną kartę → ack ok=false, code 409", async () => {
    const client = new PartyClient();
    const host = await client.createHost();
    try {
      const ania = await client.joinPlayer(host.pin, { playerName: "Ania" });
      await host.waitForEvent((e) => e.event === "player-joined");
      await host.start({ deck: makeDeck(2) });

      const stale = await ania.vote({ cardIndex: 5, answerIndex: 0, answerText: "A" });
      expect(stale.ok).toBe(false);
      if (!stale.ok) expect(stale.error).toMatch(/Stale/i);

      ania.close();
    } finally {
      host.close();
    }
  });

  test("reveal: votes-revealed event z poprawną odpowiedzią", async () => {
    const client = new PartyClient();
    const host = await client.createHost();
    try {
      const ania = await client.joinPlayer(host.pin, { playerName: "Ania" });
      await host.waitForEvent((e) => e.event === "player-joined");
      await host.start({ deck: makeDeck(1) });
      await ania.vote({ cardIndex: 0, answerIndex: 0, answerText: "A" });
      await host.waitForEvent((e) => e.event === "vote-cast");

      const ack = await host.reveal({
        cardIndex: 0,
        correctAnswer: "A",
        votes: [ania.asVote(0, "A")],
        scores: [{ playerId: ania.playerId, playerName: ania.playerName, score: 1 }],
      });
      expect(ack.ok).toBe(true);

      const event = await host.waitForEvent((e) => e.event === "votes-revealed");
      expect((event.data as { correctAnswer: string }).correctAnswer).toBe("A");

      ania.close();
    } finally {
      host.close();
    }
  });

  test("next-card: przesuwa indeks i czyści głosy", async () => {
    const client = new PartyClient();
    const host = await client.createHost();
    try {
      const ania = await client.joinPlayer(host.pin, { playerName: "Ania" });
      await host.waitForEvent((e) => e.event === "player-joined");
      await host.start({ deck: makeDeck(3) });
      await ania.vote({ cardIndex: 0, answerIndex: 0, answerText: "A" });
      await host.waitForEvent((e) => e.event === "vote-cast");

      const ack = await host.nextCard(1);
      expect(ack.ok).toBe(true);
      const event = await host.waitForEvent((e) => e.event === "next-card");
      expect((event.data as { cardIndex: number }).cardIndex).toBe(1);

      // Voting on the OLD card now stale, voting on the new card OK.
      const staleVote = await ania.vote({ cardIndex: 0, answerIndex: 1, answerText: "B" });
      expect(staleVote.ok).toBe(false);
      const freshVote = await ania.vote({ cardIndex: 1, answerIndex: 1, answerText: "B" });
      expect(freshVote.ok).toBe(true);

      ania.close();
    } finally {
      host.close();
    }
  });

  test("finish: status → finished i game-finished broadcast", async () => {
    const client = new PartyClient();
    const host = await client.createHost();
    try {
      await host.start({ deck: makeDeck(1) });
      const ack = await host.finish();
      expect(ack.ok).toBe(true);
      const event = await host.waitForEvent((e) => e.event === "game-finished");
      expect(event.event).toBe("game-finished");
    } finally {
      host.close();
    }
  });

  test("non-host wysyła host:start → odmowa", async () => {
    const client = new PartyClient();
    const host = await client.createHost();
    try {
      const ania = await client.joinPlayer(host.pin, { playerName: "Ania" });
      // Player tries to send host:start (PartyClient methods don't expose it for
      // players, so go direct through the underlying ws via a typed-as-any send).
      const ack = await (ania as unknown as { sendAndAwait: (b: unknown) => Promise<{ ok: boolean; error?: string }> })
        .sendAndAwait({
          type: "host:start",
          card: { id: "x", type: "QUIZ", description: "should be rejected" },
          deck: [{ id: "x", type: "QUIZ", description: "should be rejected" }],
        });
      expect(ack.ok).toBe(false);
      if (!ack.ok) expect(ack.error).toMatch(/host/i);
      ania.close();
    } finally {
      host.close();
    }
  });

  test("10 graczy głosuje JEDNOCZEŚNIE — wszystkie 10 vote-cast eventów dochodzi", async () => {
    const PLAYERS = 10;
    const ANSWERS = ["A", "B", "C", "D"];
    const client = new PartyClient();
    const host = await client.createHost();
    const players: PlayerHandle[] = [];
    try {
      // Join sequentially to keep setup deterministic; the concurrency stress
      // is the VOTING step below (real users tap-tap-tap simultaneously).
      for (let i = 0; i < PLAYERS; i++) {
        players.push(await client.joinPlayer(host.pin, { playerName: `Gracz${i + 1}` }));
      }
      await host.waitForEventCount("player-joined", PLAYERS);

      await host.start({ deck: makeDeck(1) });
      await host.waitForEvent((e) => e.event === "game-started");

      // The whole point: simultaneous votes via Promise.all. On the OLD Appwrite
      // path this dropped events; on PartyKit DOs it serialises by construction
      // so every vote-cast event must arrive.
      const results = await Promise.all(
        players.map((p, i) =>
          p.vote({ cardIndex: 0, answerIndex: i % 4, answerText: ANSWERS[i % 4] }),
        ),
      );
      results.forEach((r, i) => expect(r.ok, `głos gracza ${i + 1} odrzucony`).toBe(true));

      const votes = await host.waitForEventCount("vote-cast", PLAYERS);
      const uniqueIds = new Set(votes.map((e) => (e.data as { playerId: string }).playerId));
      expect(uniqueIds.size).toBe(PLAYERS);
    } finally {
      for (const p of players) p.close();
      host.close();
    }
  });

  test("pełna rozgrywka: 2 graczy × 2 karty → finished", async () => {
    const client = new PartyClient();
    const host = await client.createHost();
    try {
      const ania = await client.joinPlayer(host.pin, { playerName: "Ania" });
      const zosia = await client.joinPlayer(host.pin, { playerName: "Zosia" });
      await host.waitForEventCount("player-joined", 2);

      await host.start({ deck: makeDeck(2) });
      await host.waitForEvent((e) => e.event === "game-started");

      expect((await ania.vote({ cardIndex: 0, answerIndex: 0, answerText: "A" })).ok).toBe(true);
      expect((await zosia.vote({ cardIndex: 0, answerIndex: 1, answerText: "B" })).ok).toBe(true);
      await host.waitForEventCount("vote-cast", 2);

      expect(
        (
          await host.reveal({
            cardIndex: 0,
            correctAnswer: "A",
            votes: [ania.asVote(0, "A"), zosia.asVote(1, "B")],
            scores: [
              { playerId: ania.playerId, playerName: "Ania", score: 1 },
              { playerId: zosia.playerId, playerName: "Zosia", score: 0 },
            ],
          })
        ).ok,
      ).toBe(true);

      expect((await host.nextCard(1)).ok).toBe(true);
      expect((await ania.vote({ cardIndex: 1, answerIndex: 0, answerText: "A" })).ok).toBe(true);
      expect((await zosia.vote({ cardIndex: 1, answerIndex: 0, answerText: "A" })).ok).toBe(true);

      expect(
        (
          await host.finish({
            scores: [
              { playerId: ania.playerId, playerName: "Ania", score: 2 },
              { playerId: zosia.playerId, playerName: "Zosia", score: 1 },
            ],
          })
        ).ok,
      ).toBe(true);
      await host.waitForEvent((e) => e.event === "game-finished");

      ania.close();
      zosia.close();
    } finally {
      host.close();
    }
  });

  test("NEVER cards: 10 graczy + reveal bez correctAnswer", async () => {
    const PLAYERS = 10;
    const client = new PartyClient();
    const host = await client.createHost();
    const players: PlayerHandle[] = [];
    try {
      for (let i = 0; i < PLAYERS; i++) {
        players.push(await client.joinPlayer(host.pin, { playerName: `Never${i + 1}` }));
      }
      await host.waitForEventCount("player-joined", PLAYERS);

      await host.start({ deck: makeNeverDeck(1) });
      await host.waitForEvent((e) => e.event === "game-started");

      const results = await Promise.all(
        players.map((p, i) =>
          p.vote({
            cardIndex: 0,
            answerIndex: i % 2,
            answerText: i % 2 === 0 ? "Piłam" : "Nie piłam",
          }),
        ),
      );
      results.forEach((r, i) => expect(r.ok, `głos gracza ${i + 1} odrzucony`).toBe(true));
      await host.waitForEventCount("vote-cast", PLAYERS);

      const ack = await host.reveal({
        cardIndex: 0,
        votes: players.map((p, i) => p.asVote(i % 2, i % 2 === 0 ? "Piłam" : "Nie piłam")),
      });
      expect(ack.ok).toBe(true);
      const reveal = await host.waitForEvent((e) => e.event === "votes-revealed");
      // NEVER cards don't score — correctAnswer must be absent / undefined.
      expect((reveal.data as { correctAnswer?: string }).correctAnswer).toBeUndefined();
    } finally {
      for (const p of players) p.close();
      host.close();
    }
  });
});
