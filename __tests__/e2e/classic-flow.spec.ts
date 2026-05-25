import { expect, test } from "@playwright/test";

import { GameDriver, makeDeck } from "./helpers/game-driver";

// Logic-level tests for the classic ("trivia") mode. These drive the real API
// the same way the browser does, but with no DOM — so a full game runs in
// milliseconds. Tag: @logic (run the fast suite with `bun run test:logic`).
//
// Requires the dev server (and its Appwrite backend) running on E2E_BASE_URL
// (default http://localhost:3000), same as the existing e2e tests.

test.describe("Tryb klasyczny — logika gry przez API @logic", () => {
  test("nowy salon startuje w stanie 'waiting' bez graczy", async () => {
    const driver = new GameDriver();
    const host = await driver.createHost({ gameMode: "classic" });

    const state = await host.getState();
    expect(state.status).toBe(200);
    expect(state.data.status).toBe("waiting");
    expect(state.data.gameMode).toBe("classic");
    expect(state.data.players).toHaveLength(0);
  });

  test("gracze dołączają i pojawiają się w stanie hosta", async () => {
    const driver = new GameDriver();
    const host = await driver.createHost();

    await driver.joinPlayer(host.pin, { playerName: "Ania" });
    await driver.joinPlayer(host.pin, { playerName: "Zosia" });

    const state = await host.getState();
    const names = state.data.players.map((p) => p.playerName).sort();
    expect(names).toEqual(["Ania", "Zosia"]);
  });

  test("duplikat nazwy gracza dostaje sufiks zamiast nadpisać", async () => {
    const driver = new GameDriver();
    const host = await driver.createHost();

    const first = await driver.joinPlayer(host.pin, { playerName: "Bob" });
    const second = await driver.joinPlayer(host.pin, { playerName: "Bob" });

    expect(first.playerName).toBe("Bob");
    expect(second.playerName).toBe("Bob (2)");
    expect(second.playerId).not.toBe(first.playerId);
  });

  test("w trybie klasycznym nie można podać drużyny przy dołączaniu", async () => {
    const driver = new GameDriver();
    const host = await driver.createHost();

    const res = await driver.joinPlayerRaw(host.pin, {
      playerName: "Drużynowy",
      teamId: "team-1",
    });
    expect(res.status).toBe(400);
  });

  test("start przełącza grę w 'active' na karcie 0", async () => {
    const driver = new GameDriver();
    const host = await driver.createHost();
    await driver.joinPlayer(host.pin, { playerName: "Ania" });

    const started = await host.start({ deck: makeDeck(2) });
    expect(started.status).toBe(200);

    const state = await host.getState();
    expect(state.data.status).toBe("active");
    expect(state.data.cardIndex).toBe(0);
  });

  test("nie można dołączyć po starcie gry", async () => {
    const driver = new GameDriver();
    const host = await driver.createHost();
    await host.start({ deck: makeDeck(1) });

    const res = await driver.joinPlayerRaw(host.pin, { playerName: "Spóźniony" });
    expect(res.status).toBe(409);
  });

  test("głos gracza ląduje w stanie hosta dla bieżącej karty", async () => {
    const driver = new GameDriver();
    const host = await driver.createHost();
    const ania = await driver.joinPlayer(host.pin, { playerName: "Ania" });
    await host.start({ deck: makeDeck(2) });

    const vote = await ania.vote({ cardIndex: 0, answerIndex: 1, answerText: "B" });
    expect(vote.status).toBe(200);

    const state = await host.getState();
    expect(state.data.votes).toHaveLength(1);
    expect(state.data.votes[0]).toMatchObject({
      playerId: ania.playerId,
      cardIndex: 0,
      answerIndex: 1,
      answerText: "B",
    });
  });

  test("ponowny głos tego samego gracza nadpisuje poprzedni (upsert)", async () => {
    const driver = new GameDriver();
    const host = await driver.createHost();
    const ania = await driver.joinPlayer(host.pin, { playerName: "Ania" });
    await host.start({ deck: makeDeck(2) });

    await ania.vote({ cardIndex: 0, answerIndex: 0, answerText: "A" });
    await ania.vote({ cardIndex: 0, answerIndex: 2, answerText: "C" });

    const state = await host.getState();
    expect(state.data.votes).toHaveLength(1);
    expect(state.data.votes[0].answerText).toBe("C");
  });

  test("głos na nieaktualną kartę jest odrzucany (409)", async () => {
    const driver = new GameDriver();
    const host = await driver.createHost();
    const ania = await driver.joinPlayer(host.pin, { playerName: "Ania" });
    await host.start({ deck: makeDeck(2) });

    const stale = await ania.vote({ cardIndex: 5, answerIndex: 0, answerText: "A" });
    expect(stale.status).toBe(409);
  });

  test("po odsłonięciu nie da się już zagłosować na tę kartę (409)", async () => {
    const driver = new GameDriver();
    const host = await driver.createHost();
    const ania = await driver.joinPlayer(host.pin, { playerName: "Ania" });
    await host.start({ deck: makeDeck(2) });
    await ania.vote({ cardIndex: 0, answerIndex: 0, answerText: "A" });

    await host.reveal({ cardIndex: 0, correctAnswer: "A", votes: [ania.asVote(0, "A")] });

    const late = await ania.vote({ cardIndex: 0, answerIndex: 1, answerText: "B" });
    expect(late.status).toBe(409);
  });

  test("next-card przesuwa indeks i czyści głosy", async () => {
    const driver = new GameDriver();
    const host = await driver.createHost();
    const ania = await driver.joinPlayer(host.pin, { playerName: "Ania" });
    await host.start({ deck: makeDeck(3) });
    await ania.vote({ cardIndex: 0, answerIndex: 0, answerText: "A" });

    const next = await host.nextCard(1);
    expect(next.status).toBe(200);

    const state = await host.getState();
    expect(state.data.cardIndex).toBe(1);
    expect(state.data.votes).toHaveLength(0);
  });

  test("finish przełącza grę w 'finished' i blokuje dołączanie", async () => {
    const driver = new GameDriver();
    const host = await driver.createHost();
    await host.start({ deck: makeDeck(1) });

    const finished = await host.finish();
    expect(finished.status).toBe(200);

    const state = await host.getState();
    expect(state.data.status).toBe("finished");

    const lateJoin = await driver.joinPlayerRaw(host.pin, { playerName: "Spóźniony" });
    expect(lateJoin.status).toBe(409);
  });

  test("akcja hosta bez sekretu jest odrzucana (403)", async () => {
    const driver = new GameDriver();
    const host = await driver.createHost();

    const res = await host.start({ deck: makeDeck(1), hostSecret: "zly-sekret" });
    expect(res.status).toBe(403);
  });

  test("głos z błędnym sekretem gracza jest odrzucany (403)", async () => {
    const driver = new GameDriver();
    const host = await driver.createHost();
    const ania = await driver.joinPlayer(host.pin, { playerName: "Ania" });
    await host.start({ deck: makeDeck(1) });

    const res = await ania.vote({
      cardIndex: 0,
      answerIndex: 0,
      answerText: "A",
      playerSecret: "zly-sekret",
    });
    expect(res.status).toBe(403);
  });

  test("zapytanie o nieistniejący salon zwraca 404", async () => {
    const driver = new GameDriver();
    const res = await driver.getSessionRaw("000000");
    expect(res.status).toBe(404);
  });

  test("pełna rozgrywka: 2 graczy, 2 karty, do końca", async () => {
    const driver = new GameDriver();
    const host = await driver.createHost({ gameMode: "classic" });
    const ania = await driver.joinPlayer(host.pin, { playerName: "Ania" });
    const zosia = await driver.joinPlayer(host.pin, { playerName: "Zosia" });

    const deck = makeDeck(2);
    expect((await host.start({ deck })).status).toBe(200);

    // Karta 0 — Ania trafia (A), Zosia pudłuje (B)
    expect((await ania.vote({ cardIndex: 0, answerIndex: 0, answerText: "A" })).status).toBe(200);
    expect((await zosia.vote({ cardIndex: 0, answerIndex: 1, answerText: "B" })).status).toBe(200);

    let state = await host.getState();
    expect(state.data.votes).toHaveLength(2);

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
      ).status,
    ).toBe(200);

    // Karta 1
    expect((await host.nextCard(1)).status).toBe(200);
    state = await host.getState();
    expect(state.data.cardIndex).toBe(1);
    expect(state.data.votes).toHaveLength(0);

    expect((await ania.vote({ cardIndex: 1, answerIndex: 0, answerText: "A" })).status).toBe(200);
    expect((await zosia.vote({ cardIndex: 1, answerIndex: 0, answerText: "A" })).status).toBe(200);

    expect(
      (
        await host.finish({
          scores: [
            { playerId: ania.playerId, playerName: "Ania", score: 2 },
            { playerId: zosia.playerId, playerName: "Zosia", score: 1 },
          ],
        })
      ).status,
    ).toBe(200);

    state = await host.getState();
    expect(state.data.status).toBe("finished");
  });
});
