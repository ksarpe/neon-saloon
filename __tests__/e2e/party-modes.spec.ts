import { expect, test } from '@playwright/test'

import { PartyClient, type PlayerHandle } from './helpers/party-client'

// Premium-mode E2E for HighLow + Battle Royale running on PartyKit. Like the
// classic spec, this drives the room over the WebSocket and reads back broadcast
// events — proves that the team-based + survival flows actually work on DOs.
//
// Requires DISABLE_PREMIUM_GATE=true in .env.local for the Next.js dev server,
// so the /api/party/ticket endpoint lets us create premium-mode rooms without
// seeding a NextAuth premium user. The flag is hard-gated to non-production.
//
// Requires `bun run dev:party` (PartyKit) and `bun run dev` (Next.js).

const PARTYKIT_HOST = process.env.E2E_PARTYKIT_HOST ?? '127.0.0.1:1999'

async function isPartyKitUp(): Promise<boolean> {
  try {
    const res = await fetch(`http://${PARTYKIT_HOST}/`, { signal: AbortSignal.timeout(2000) })
    return res.status < 500
  } catch {
    return false
  }
}

test.describe('PartyKit — tryb HighLow @party', () => {
  test.beforeAll(async () => {
    test.skip(
      !(await isPartyKitUp()),
      `PartyKit dev nie odpowiada pod http://${PARTYKIT_HOST}. Odpal: bun run dev:party`,
    )
  })

  test('setup → 4 graczy w 2 drużynach → kapitanowie liczba+głos → result', async () => {
    const client = new PartyClient()
    const host = await client.createHost({ gameMode: 'highlow' })
    const players: PlayerHandle[] = []
    try {
      // 1. Host tworzy 2 drużyny
      const setupAck = await host.highLowSetup({ team1Name: 'Kowboje', team2Name: 'Indianie' })
      expect(setupAck.ok).toBe(true)
      await host.waitForEventCount('team-created', 2)

      // Wyciągam id drużyn ze snapshot hosta (server-side authoritative)
      // Czekamy na kolejny snapshot push po dwóch team-created — host nadal ma
      // ten z connect, którego state.teams=[]. Sprawdzam stan przez kolejne dołączenie.
      // Najprościej: każdy team-created event ma w data teamId — z eventów go odczytam.
      const teamEvents = host.events.filter((e) => e.event === 'team-created')
      const team1Id = (teamEvents[0].data as { teamId: string }).teamId
      const team2Id = (teamEvents[1].data as { teamId: string }).teamId

      // 2. 2 graczy do każdej drużyny
      const a1 = await client.joinPlayer(host.pin, { playerName: 'Ania', teamId: team1Id })
      const a2 = await client.joinPlayer(host.pin, { playerName: 'Adam', teamId: team1Id })
      const b1 = await client.joinPlayer(host.pin, { playerName: 'Beata', teamId: team2Id })
      const b2 = await client.joinPlayer(host.pin, { playerName: 'Bartek', teamId: team2Id })
      players.push(a1, a2, b1, b2)
      await host.waitForEventCount('player-joined', 4)

      // 3. Host startuje rundę — drużyna 1 zgaduje, kapitan a1; drużyna 2 głosuje, kapitan b1
      const roundAck = await host.highLowRound({
        roundIndex: 0,
        questionText: 'Ile gości na przeciętnym weselu w Polsce?',
        questionUnit: 'osób',
        guessingTeamId: team1Id,
        guessingTeamName: 'Kowboje',
        votingTeamId: team2Id,
        votingTeamName: 'Indianie',
        guessingCaptainId: a1.playerId,
        votingCaptainId: b1.playerId,
      })
      expect(roundAck.ok).toBe(true)
      await host.waitForEvent((e) => e.event === 'highlow-round-start')

      // 4. Kapitan zgadujący wysyła liczbę
      const numberAck = await a1.highLowNumber('150')
      expect(numberAck.ok).toBe(true)
      const numberEvent = await host.waitForEvent((e) => e.event === 'highlow-number-submitted')
      expect((numberEvent.data as { number: string }).number).toBe('150')

      // 5. Kapitan głosujący wybiera 'mniej' lub 'wiecej' — wynik dyspatchowany
      const voteAck = await b1.highLowVote('wiecej')
      expect(voteAck.ok).toBe(true)
      const resultEvent = await host.waitForEvent((e) => e.event === 'highlow-round-result')
      const result = resultEvent.data as {
        winningTeamId: string
        winningTeamName: string
        captainVote: string
        scores: Array<{ playerId: string; score: number }>
      }
      expect(result.captainVote).toBe('wiecej')
      // Wygrana drużyna ma teraz +1 punkt dla każdego z 2 graczy
      expect(result.scores.length).toBeGreaterThanOrEqual(2)
      expect([team1Id, team2Id]).toContain(result.winningTeamId)
    } finally {
      for (const p of players) p.close()
      host.close()
    }
  })

  test('niewłaściwy gracz wysyła liczbę → ack odrzucony', async () => {
    const client = new PartyClient()
    const host = await client.createHost({ gameMode: 'highlow' })
    try {
      await host.highLowSetup({ team1Name: 'A', team2Name: 'B' })
      await host.waitForEventCount('team-created', 2)
      const teamEvents = host.events.filter((e) => e.event === 'team-created')
      const team1Id = (teamEvents[0].data as { teamId: string }).teamId
      const team2Id = (teamEvents[1].data as { teamId: string }).teamId

      const cap = await client.joinPlayer(host.pin, { playerName: 'Cap', teamId: team1Id })
      const intruder = await client.joinPlayer(host.pin, { playerName: 'Intruder', teamId: team2Id })
      try {
        await host.waitForEventCount('player-joined', 2)

        await host.highLowRound({
          roundIndex: 0,
          questionText: 'q',
          questionUnit: 'u',
          guessingTeamId: team1Id,
          guessingTeamName: 'A',
          votingTeamId: team2Id,
          votingTeamName: 'B',
          guessingCaptainId: cap.playerId,
          votingCaptainId: intruder.playerId,
        })
        await host.waitForEvent((e) => e.event === 'highlow-round-start')

        // intruder próbuje wysłać liczbę — ale nie jest kapitanem zgadującym
        const ack = await intruder.highLowNumber('100')
        expect(ack.ok).toBe(false)
        if (!ack.ok) expect(ack.error).toMatch(/captain/i)
      } finally {
        cap.close()
        intruder.close()
      }
    } finally {
      host.close()
    }
  })
})

test.describe('PartyKit — tryb Battle Royale @party', () => {
  test.beforeAll(async () => {
    test.skip(
      !(await isPartyKitUp()),
      `PartyKit dev nie odpowiada pod http://${PARTYKIT_HOST}. Odpal: bun run dev:party`,
    )
  })

  test('setup → round → 5 graczy odpowiada → reveal eliminuje', async () => {
    const client = new PartyClient()
    const host = await client.createHost({ gameMode: 'battle-royale' })
    const players: PlayerHandle[] = []
    try {
      // 5 graczy dołącza
      for (let i = 0; i < 5; i++) {
        players.push(await client.joinPlayer(host.pin, { playerName: `Pistolero${i + 1}` }))
      }
      await host.waitForEventCount('player-joined', 5)

      // Host setup kategorii — ANATOMY istnieje w QUESTION_CATEGORIES
      const setupAck = await host.brSetup({ categoryId: 'anatomy', timerDuration: 20 })
      expect(setupAck.ok).toBe(true)

      // Host startuje pierwszą rundę — broadcast br-round-start z pytaniem
      const roundAck = await host.brRound()
      expect(roundAck.ok).toBe(true)
      const roundEvent = await host.waitForEvent((e) => e.event === 'br-round-start')
      const round = roundEvent.data as {
        questionText: string
        options: string[]
        alivePlayers: string[]
      }
      expect(round.options.length).toBeGreaterThan(0)
      expect(round.alivePlayers).toHaveLength(5)

      // Wszyscy odpowiadają — żeby na pewno był mix (część trafia, część nie),
      // dwóch wybiera index 0, dwóch index 1, jeden index 2. Korelacja z prawdą
      // zależy od pytania — celem testu jest sprawdzić, że reveal eliminuje
      // graczy zgodnie z regułami, niezależnie kto trafił.
      const answers = [0, 0, 1, 1, 2]
      const submits = await Promise.all(
        players.map((p, i) => p.brAnswer({ answerIndex: answers[i], answerText: round.options[answers[i]] })),
      )
      submits.forEach((s, i) => expect(s.ok, `gracz ${i + 1} odpowiedź odrzucona`).toBe(true))
      await host.waitForEventCount('br-answer-submitted', 5)

      // Host odsłania — wszyscy mieli odpowiedzieć więc nikt nie pada przez timeout
      const revealAck = await host.brReveal()
      expect(revealAck.ok).toBe(true)
      const reveal = (await host.waitForEvent((e) => e.event === 'br-round-reveal')).data as {
        eliminatedThisRound: string[]
        survivingPlayers: string[]
        gameOver: boolean
        correctAnswer: string
      }
      // Przy mixed (część trafia, część nie) wszyscy źli padają. Jeśli akurat
      // wszystkie 3 indeksy okazały się złe, eliminowany jest najwolniejszy.
      expect(reveal.eliminatedThisRound.length).toBeGreaterThan(0)
      expect(reveal.survivingPlayers.length + reveal.eliminatedThisRound.length).toBe(5)
      expect(reveal.correctAnswer.length).toBeGreaterThan(0)
    } finally {
      for (const p of players) p.close()
      host.close()
    }
  })

  test('answer od wyeliminowanego gracza jest cicho ignorowany', async () => {
    const client = new PartyClient()
    const host = await client.createHost({ gameMode: 'battle-royale' })
    const players: PlayerHandle[] = []
    try {
      for (let i = 0; i < 3; i++) {
        players.push(await client.joinPlayer(host.pin, { playerName: `Solo${i + 1}` }))
      }
      await host.waitForEventCount('player-joined', 3)

      await host.brSetup({ categoryId: 'anatomy' })
      await host.brRound()
      const round = (await host.waitForEvent((e) => e.event === 'br-round-start')).data as {
        options: string[]
      }

      // wszyscy 3 odpowiadają tak samo (żeby na pewno mix lub all-correct/wrong wyzwoli eliminację)
      await Promise.all(
        players.map((p) => p.brAnswer({ answerIndex: 0, answerText: round.options[0] })),
      )
      await host.waitForEventCount('br-answer-submitted', 3)
      await host.brReveal()
      const reveal = (await host.waitForEvent((e) => e.event === 'br-round-reveal')).data as {
        eliminatedThisRound: string[]
      }
      const eliminatedId = reveal.eliminatedThisRound[0]
      const eliminated = players.find((p) => p.playerId === eliminatedId)!
      expect(eliminated).toBeDefined()

      // Następna runda
      const nextAck = await host.brNext()
      expect(nextAck.ok).toBe(true)
      await host.brRound()
      const r2 = (await host.waitForEvent((e) => e.event === 'br-round-start' && (e.data as { questionIndex: number }).questionIndex === 1)).data as {
        options: string[]
      }

      // Wyeliminowany gracz wysyła odpowiedź — server odpowiada ok ale event NIE leci
      const eventsBeforeIgnore = host.events.filter((e) => e.event === 'br-answer-submitted').length
      const ignoredAck = await eliminated.brAnswer({ answerIndex: 0, answerText: r2.options[0] })
      expect(ignoredAck.ok).toBe(true)
      // Daj chwilę — event nie powinien dojść
      await new Promise((r) => setTimeout(r, 200))
      const eventsAfterIgnore = host.events.filter((e) => e.event === 'br-answer-submitted').length
      expect(eventsAfterIgnore).toBe(eventsBeforeIgnore)
    } finally {
      for (const p of players) p.close()
      host.close()
    }
  })
})
