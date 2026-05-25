import { expect, test } from "@playwright/test";

import {
  appwriteEventsConfigured,
  eventsOfType,
  type StoredEvent,
  waitForEvents,
} from "./helpers/appwrite-events";
import { GameDriver, makeDeck, makeNeverDeck, type Player } from "./helpers/game-driver";

// Verifies the realtime EVENT layer under load: 10 players acting at once.
//
// What this actually checks: the server appends every realtime event to the
// session row's `events` column (the broadcast channel the browser subscribes
// to). When 10 players vote simultaneously, those appends race on one row —
// the risk is a lost event. This spec drives 10 players concurrently and reads
// the real broadcast stream back from Appwrite, asserting nothing is dropped,
// for both QUIZ and NEVER cards.
//
// Each simulated player uses its own GameDriver (= its own synthetic client IP),
// mirroring 10 real devices and side-stepping per-PIN join rate limits.

const PLAYERS = 10;
const ANSWERS = ["A", "B", "C", "D"];

const describe = appwriteEventsConfigured() ? test.describe : test.describe.skip;

type JoinOutcome = { players: Player[]; failures: string[] };

// All 10 players join *simultaneously* — the join route's transaction now
// retries on conflict, so concurrent lobby joins must all succeed. Each player
// gets its own GameDriver (= its own synthetic client IP), like 10 real phones.
async function joinPlayers(pin: string, count: number, prefix: string): Promise<JoinOutcome> {
  const results = await Promise.allSettled(
    Array.from({ length: count }, (_, i) =>
      new GameDriver().joinPlayer(pin, { playerName: `${prefix}${i + 1}` }),
    ),
  );

  return {
    players: results
      .filter((r): r is PromiseFulfilledResult<Player> => r.status === "fulfilled")
      .map((r) => r.value),
    failures: results
      .filter((r): r is PromiseRejectedResult => r.status === "rejected")
      .map((r) => String(r.reason)),
  };
}

function uniquePlayerIds(events: StoredEvent[]): Set<string> {
  return new Set(events.map((e) => (e.payload as { playerId: string }).playerId));
}

function assertSeqIntegrity(events: StoredEvent[]) {
  const seqs = events.map((e) => e.seq);
  expect(new Set(seqs).size, "zduplikowane numery seq w strumieniu eventów").toBe(seqs.length);
  const min = Math.min(...seqs);
  const max = Math.max(...seqs);
  expect(max - min + 1, "luki w numeracji seq (zgubiony event)").toBe(seqs.length);
}

describe("Eventy realtime przy 10 graczach @logic @realtime", () => {
  test("QUIZ: 10 graczy dołącza i głosuje naraz — żaden event nie ginie", async () => {
    const driver = new GameDriver();
    const host = await driver.createHost({ gameMode: "classic" });

    // 1) 10 graczy dołącza jednocześnie
    const { players, failures } = await joinPlayers(host.pin, PLAYERS, "Quiz");
    expect(failures, `nieudane dołączenia: ${failures.join(" | ")}`).toHaveLength(0);
    expect(players).toHaveLength(PLAYERS);

    // serwer widzi wszystkich 10 graczy w stanie sesji
    const state = await host.getState();
    expect(state.data.players).toHaveLength(PLAYERS);

    // każde dołączenie wyemitowało event player-joined
    let events = await waitForEvents(host.pin, "player-joined", PLAYERS);
    expect(eventsOfType(events, "player-joined"), "zgubione eventy player-joined").toHaveLength(
      PLAYERS,
    );
    expect(uniquePlayerIds(eventsOfType(events, "player-joined")).size).toBe(PLAYERS);

    // 2) start gry QUIZ → event game-started
    expect((await host.start({ deck: makeDeck(2) })).status).toBe(200);
    events = await waitForEvents(host.pin, "game-started", 1);
    expect(eventsOfType(events, "game-started")).toHaveLength(1);

    // 3) 10 głosów NARAZ — newralgiczny test współbieżnych dopisań do kolumny events
    const voteResults = await Promise.all(
      players.map((p, i) =>
        p.vote({ cardIndex: 0, answerIndex: i % 4, answerText: ANSWERS[i % 4] }),
      ),
    );
    voteResults.forEach((r, i) => expect(r.status, `głos gracza ${i + 1} odrzucony`).toBe(200));

    events = await waitForEvents(host.pin, "vote-cast", PLAYERS);
    const voteEvents = eventsOfType(events, "vote-cast");
    expect(voteEvents, "część głosów nie trafiła do strumienia eventów (wyścig)").toHaveLength(
      PLAYERS,
    );
    expect(uniquePlayerIds(voteEvents).size, "kolizja/utrata eventu głosu").toBe(PLAYERS);

    // 4) odsłonięcie wyników → event votes-revealed z poprawną odpowiedzią
    expect(
      (
        await host.reveal({
          cardIndex: 0,
          correctAnswer: "A",
          votes: players.map((p, i) => p.asVote(i % 4, ANSWERS[i % 4])),
        })
      ).status,
    ).toBe(200);
    events = await waitForEvents(host.pin, "votes-revealed", 1);
    const reveal = eventsOfType(events, "votes-revealed");
    expect(reveal).toHaveLength(1);
    expect((reveal[0].payload as { correctAnswer?: string }).correctAnswer).toBe("A");

    // 5) integralność całego strumienia: kolejność i numeracja bez luk/duplikatów
    assertSeqIntegrity(events);
  });

  test("NEVER: 10 graczy głosuje naraz — eventy poprawne, reveal bez correctAnswer", async () => {
    const driver = new GameDriver();
    const host = await driver.createHost({ gameMode: "classic" });

    const { players, failures } = await joinPlayers(host.pin, PLAYERS, "Never");
    expect(failures, `nieudane dołączenia: ${failures.join(" | ")}`).toHaveLength(0);
    expect(players).toHaveLength(PLAYERS);

    let events = await waitForEvents(host.pin, "player-joined", PLAYERS);
    expect(eventsOfType(events, "player-joined")).toHaveLength(PLAYERS);

    // start z talią kart NEVER (bez opcji i bez poprawnej odpowiedzi)
    expect((await host.start({ deck: makeNeverDeck(2) })).status).toBe(200);
    await waitForEvents(host.pin, "game-started", 1);

    // 10 deklaracji "piłam / nie piłam" jednocześnie
    const voteResults = await Promise.all(
      players.map((p, i) =>
        p.vote({ cardIndex: 0, answerIndex: i % 2, answerText: i % 2 === 0 ? "Piłam" : "Nie piłam" }),
      ),
    );
    voteResults.forEach((r, i) => expect(r.status, `głos gracza ${i + 1} odrzucony`).toBe(200));

    events = await waitForEvents(host.pin, "vote-cast", PLAYERS);
    const voteEvents = eventsOfType(events, "vote-cast");
    expect(voteEvents, "część głosów NEVER nie trafiła do strumienia eventów").toHaveLength(PLAYERS);
    expect(uniquePlayerIds(voteEvents).size).toBe(PLAYERS);

    // reveal BEZ poprawnej odpowiedzi — karty NEVER nie są punktowane
    expect((await host.reveal({ cardIndex: 0, votes: players.map((p, i) => p.asVote(i % 2, "")) })).status).toBe(200);
    events = await waitForEvents(host.pin, "votes-revealed", 1);
    const reveal = eventsOfType(events, "votes-revealed");
    expect(reveal).toHaveLength(1);
    expect(
      (reveal[0].payload as { correctAnswer?: string }).correctAnswer,
      "karta NEVER nie powinna mieć correctAnswer",
    ).toBeUndefined();

    assertSeqIntegrity(events);
  });
});
