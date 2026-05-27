// Short-lived HMAC-SHA256 ticket the Next.js /api/party/ticket endpoint signs
// and the PartyKit room verifies in onBeforeConnect. The token IS the auth — no
// separate hostSecret/playerSecret. Same `PARTY_AUTH_SECRET` must be configured
// on both sides (.env.local for Next.js, .dev.vars / `partykit secret put` for
// the room).
//
// Uses Web Crypto (crypto.subtle) so the SAME implementation runs on Cloudflare
// Workers (the PartyKit runtime) and on Node 22+ (Next.js API routes).

export type HostTokenPayload = {
  pin: string;
  role: "host";
  tokenKind: "party" | "connect";
  hostId: string;
  hostName: string;
  gameMode: string;
  iat: number;
  exp: number;
};

export type PlayerTokenPayload = {
  pin: string;
  role: "player";
  tokenKind: "party" | "connect";
  playerId: string;
  playerName: string;
  avatar?: string;
  teamId?: string;
  iat: number;
  exp: number;
};

export type PartyTokenPayload = HostTokenPayload | PlayerTokenPayload;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToB64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64UrlToBytes(s: string): Uint8Array<ArrayBuffer> {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(s.length / 4) * 4, "=");
  const binary = atob(padded);
  // Allocate against a concrete ArrayBuffer so crypto.subtle accepts the
  // resulting view (BufferSource excludes SharedArrayBuffer in TS 5.7+).
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function signPartyToken(
  payload: PartyTokenPayload,
  secret: string,
): Promise<string> {
  const body = bytesToB64Url(encoder.encode(JSON.stringify(payload)));
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return `${body}.${bytesToB64Url(new Uint8Array(signature))}`;
}

export type VerifyResult =
  | { ok: true; payload: PartyTokenPayload }
  | { ok: false; reason: "malformed" | "signature" | "payload-parse" | "expired" | "shape" };

export async function verifyPartyToken(token: string, secret: string): Promise<VerifyResult> {
  const parts = token.split(".");
  if (parts.length !== 2) return { ok: false, reason: "malformed" };
  const [body, sig] = parts;

  let key: CryptoKey;
  try {
    key = await hmacKey(secret);
  } catch {
    return { ok: false, reason: "signature" };
  }

  let valid = false;
  try {
    valid = await crypto.subtle.verify("HMAC", key, b64UrlToBytes(sig), encoder.encode(body));
  } catch {
    return { ok: false, reason: "signature" };
  }
  if (!valid) return { ok: false, reason: "signature" };

  let payload: unknown;
  try {
    payload = JSON.parse(decoder.decode(b64UrlToBytes(body)));
  } catch {
    return { ok: false, reason: "payload-parse" };
  }

  if (!isPartyTokenPayload(payload)) return { ok: false, reason: "shape" };
  if (payload.exp < Date.now()) return { ok: false, reason: "expired" };

  return { ok: true, payload };
}

function isPartyTokenPayload(value: unknown): value is PartyTokenPayload {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.pin !== "string" || typeof v.iat !== "number" || typeof v.exp !== "number") {
    return false;
  }
  if (v.tokenKind !== "party" && v.tokenKind !== "connect") {
    return false;
  }
  if (v.role === "host") {
    return (
      typeof v.hostId === "string" &&
      typeof v.hostName === "string" &&
      typeof v.gameMode === "string"
    );
  }
  if (v.role === "player") {
    return typeof v.playerId === "string" && typeof v.playerName === "string";
  }
  return false;
}
