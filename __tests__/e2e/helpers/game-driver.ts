// API-driven game driver: plays a full session the same way the browser does,
// but over plain HTTP — no DOM, no clicking. The same primitives back both the
// logic specs and a future "fill a real game with bots" simulator script.
//
// Rate limits in the app are keyed on the client IP (x-forwarded-for, falling
// back to "unknown"). Each driver instance sends a unique synthetic IP so every
// test gets its own rate-limit budget and runs can stay parallel.

const DEFAULT_BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";

// Session creation is gated by Cloudflare Turnstile. Local/dev uses Cloudflare's
// "always passes" test secret (1x000...AA), which accepts any non-empty token, so
// a dummy token clears the gate without disabling protection. Override via
// E2E_BOT_PROTECTION_TOKEN if your test backend runs a real Turnstile secret.
const BOT_PROTECTION_TOKEN =
  process.env.E2E_BOT_PROTECTION_TOKEN ?? "XXXX.DUMMY.TOKEN.XXXX";

export type GameMode = "classic" | "highlow" | "battle-royale";

export type DriverCard = {
  id: string;
  type: "QUIZ" | "TEST" | "NEVER";
  description: string;
  title?: string;
  emoji?: string;
  options?: string[];
  answer?: string;
};

export type DriverVote = {
  playerId: string;
  playerName: string;
  teamId?: string | null;
  teamName?: string | null;
  answerIndex: number;
  answerText: string;
};

export type DriverScore = {
  playerId: string;
  playerName: string;
  score: number;
  drinks?: number;
  playerTeamId?: string;
  playerTeamName?: string;
};

export type DriverTeamScore = { teamId: string; teamName: string; score: number };

export type HostStateView = {
  pin: string;
  status: "waiting" | "active" | "finished";
  players: Array<{
    playerId: string;
    playerName: string;
    avatar: string;
    teamId: string | null;
    teamName: string | null;
  }>;
  teams: unknown[];
  cardIndex: number;
  votes: Array<{
    playerId: string;
    playerName: string;
    cardIndex: number;
    answerIndex: number;
    answerText: string;
  }>;
  gameMode: string;
  highlowData: unknown;
};

export type ApiResponse<T = unknown> = { status: number; ok: boolean; data: T };

type HttpInit = {
  method: "GET" | "POST";
  path: string;
  headers?: Record<string, string>;
  body?: unknown;
};

type JoinResult = {
  playerId: string;
  playerSecret: string;
  playerName: string;
  avatar: string;
  teamId: string | null;
  teamName: string | null;
};

function randomClientIp() {
  const octet = () => 1 + Math.floor(Math.random() * 254);
  return `10.${octet()}.${octet()}.${octet()}`;
}

export class GameDriver {
  readonly baseUrl: string;
  readonly clientIp: string;

  constructor(opts?: { baseUrl?: string; clientIp?: string }) {
    this.baseUrl = (opts?.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, "");
    this.clientIp = opts?.clientIp ?? randomClientIp();
  }

  async http<T = unknown>(init: HttpInit): Promise<ApiResponse<T>> {
    const res = await fetch(this.baseUrl + init.path, {
      method: init.method,
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": this.clientIp,
        ...init.headers,
      },
      body: init.body === undefined ? undefined : JSON.stringify(init.body),
    });

    const text = await res.text();
    let data: unknown;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    return { status: res.status, ok: res.ok, data: data as T };
  }

  /** Create a session and return a host handle. Throws if creation fails. */
  async createHost(opts?: { hostName?: string; gameMode?: GameMode }): Promise<Host> {
    const res = await this.http<{ pin?: string; hostSecret?: string; error?: string }>({
      method: "POST",
      path: "/api/sessions",
      body: {
        hostName: opts?.hostName ?? "Szeryf Testowy",
        gameMode: opts?.gameMode ?? "classic",
        botProtectionToken: BOT_PROTECTION_TOKEN,
      },
    });

    if (res.status !== 201 || !res.data?.pin || !res.data?.hostSecret) {
      throw new Error(`createHost failed (${res.status}): ${JSON.stringify(res.data)}`);
    }

    return new Host(this, res.data.pin, res.data.hostSecret);
  }

  /** Join a player into an existing session. Throws if join fails. */
  async joinPlayer(
    pin: string,
    opts: { playerName: string; avatar?: string; teamId?: string; newTeamName?: string },
  ): Promise<Player> {
    const res = await this.http<JoinResult & { error?: string }>({
      method: "POST",
      path: `/api/sessions/${pin}/join`,
      body: {
        playerName: opts.playerName,
        avatar: opts.avatar,
        teamId: opts.teamId,
        newTeamName: opts.newTeamName,
      },
    });

    if (res.status !== 200 || !res.data?.playerId) {
      throw new Error(`joinPlayer failed (${res.status}): ${JSON.stringify(res.data)}`);
    }

    return new Player(this, pin, res.data);
  }

  /** Raw join — does not throw, so negative cases can assert on status. */
  joinPlayerRaw(
    pin: string,
    body: Record<string, unknown>,
  ): Promise<ApiResponse<JoinResult & { error?: string }>> {
    return this.http({ method: "POST", path: `/api/sessions/${pin}/join`, body });
  }

  /** Raw GET of a session. Pass a host secret for the host view. */
  getSessionRaw(pin: string, hostSecret?: string): Promise<ApiResponse<HostStateView>> {
    return this.http({
      method: "GET",
      path: `/api/sessions/${pin}`,
      headers: hostSecret ? { "x-host-secret": hostSecret } : undefined,
    });
  }
}

export class Host {
  constructor(
    private readonly driver: GameDriver,
    readonly pin: string,
    readonly hostSecret: string,
  ) {}

  private headers(secret = this.hostSecret) {
    return { "x-host-secret": secret };
  }

  /** Start the game. Deck defaults to [card]; card defaults to deck[0]. */
  start(opts?: {
    card?: DriverCard;
    deck?: DriverCard[];
    settings?: { revealCountdownSeconds?: number; answerTimeLimitSeconds?: number };
    hostSecret?: string;
  }): Promise<ApiResponse<{ ok?: boolean; error?: string }>> {
    const deck = opts?.deck ?? (opts?.card ? [opts.card] : makeDeck(1));
    const card = opts?.card ?? deck[0];
    return this.driver.http({
      method: "POST",
      path: `/api/sessions/${this.pin}`,
      headers: this.headers(opts?.hostSecret),
      body: { action: "start", card, deck, settings: opts?.settings },
    });
  }

  reveal(opts: {
    cardIndex: number;
    correctAnswer?: string;
    votes?: DriverVote[];
    scores?: DriverScore[];
    teamScores?: DriverTeamScore[];
    hostSecret?: string;
  }): Promise<ApiResponse<{ ok?: boolean; revealStartedAt?: number; error?: string }>> {
    return this.driver.http({
      method: "POST",
      path: `/api/sessions/${this.pin}/reveal`,
      headers: this.headers(opts.hostSecret),
      body: {
        cardIndex: opts.cardIndex,
        correctAnswer: opts.correctAnswer,
        votes: opts.votes ?? [],
        scores: opts.scores ?? [],
        teamScores: opts.teamScores ?? [],
      },
    });
  }

  nextCard(
    cardIndex: number,
    opts?: { card?: DriverCard; hostSecret?: string },
  ): Promise<ApiResponse<{ ok?: boolean; cardStartedAt?: number; error?: string }>> {
    return this.driver.http({
      method: "POST",
      path: `/api/sessions/${this.pin}/next-card`,
      headers: this.headers(opts?.hostSecret),
      body: { cardIndex, card: opts?.card },
    });
  }

  finish(opts?: {
    scores?: DriverScore[];
    teamScores?: DriverTeamScore[];
    showPlayerPoints?: boolean;
    hostSecret?: string;
  }): Promise<ApiResponse<{ ok?: boolean; error?: string }>> {
    return this.driver.http({
      method: "POST",
      path: `/api/sessions/${this.pin}`,
      headers: this.headers(opts?.hostSecret),
      body: {
        action: "finish",
        scores: opts?.scores ?? [],
        teamScores: opts?.teamScores ?? [],
        showPlayerPoints: opts?.showPlayerPoints,
      },
    });
  }

  getState(opts?: { hostSecret?: string }): Promise<ApiResponse<HostStateView>> {
    return this.driver.getSessionRaw(this.pin, opts?.hostSecret ?? this.hostSecret);
  }
}

export class Player {
  readonly playerId: string;
  readonly playerSecret: string;
  readonly playerName: string;
  readonly avatar: string;
  readonly teamId: string | null;
  readonly teamName: string | null;

  constructor(
    private readonly driver: GameDriver,
    readonly pin: string,
    data: JoinResult,
  ) {
    this.playerId = data.playerId;
    this.playerSecret = data.playerSecret;
    this.playerName = data.playerName;
    this.avatar = data.avatar;
    this.teamId = data.teamId;
    this.teamName = data.teamName;
  }

  vote(opts: {
    cardIndex: number;
    answerIndex: number;
    answerText?: string;
    playerSecret?: string;
  }): Promise<ApiResponse<{ ok?: boolean; error?: string }>> {
    return this.driver.http({
      method: "POST",
      path: `/api/sessions/${this.pin}/vote`,
      headers: { "x-player-secret": opts.playerSecret ?? this.playerSecret },
      body: {
        playerId: this.playerId,
        cardIndex: opts.cardIndex,
        answerIndex: opts.answerIndex,
        answerText: opts.answerText ?? "",
      },
    });
  }

  /** A vote payload shaped for Host.reveal, so tests can echo player choices. */
  asVote(answerIndex: number, answerText: string): DriverVote {
    return {
      playerId: this.playerId,
      playerName: this.playerName,
      teamId: this.teamId,
      teamName: this.teamName,
      answerIndex,
      answerText,
    };
  }
}

const DEFAULT_OPTIONS = ["A", "B", "C", "D"];

export function makeCard(index: number, overrides?: Partial<DriverCard>): DriverCard {
  return {
    id: `card-${index}`,
    type: "QUIZ",
    title: `Pytanie ${index}`,
    description: `Treść pytania numer ${index}`,
    options: DEFAULT_OPTIONS,
    answer: DEFAULT_OPTIONS[0],
    ...overrides,
  };
}

export function makeDeck(count: number): DriverCard[] {
  return Array.from({ length: count }, (_, index) => makeCard(index));
}

// NEVER cards ("Nigdy przenigdy") have no options and no correct answer —
// players just declare did/didn't, and the reveal carries no correctAnswer.
export function makeNeverCard(index: number, overrides?: Partial<DriverCard>): DriverCard {
  return {
    id: `never-${index}`,
    type: "NEVER",
    description: `Nigdy przenigdy nie testowałem eventów numer ${index}.`,
    ...overrides,
  };
}

export function makeNeverDeck(count: number): DriverCard[] {
  return Array.from({ length: count }, (_, index) => makeNeverCard(index));
}
