# Stack technologiczny

## Cel aplikacji

Neon Saloon to aplikacja webowa do prowadzenia interaktywnych gier imprezowych w czasie rzeczywistym. Projekt składa się z aplikacji Next.js, backendowych endpointów API, warstwy danych, integracji płatności, ochrony przed botami oraz rozwijanego modułu realtime opartego o PartyKit.

## Wersje komponentów

Wersje poniżej pochodzą z `package.json`, czyli są wersjami deklarowanymi przez projekt. Dokładne zainstalowane wersje są utrwalone w `bun.lock`.

### Główne technologie

| Komponent | Wersja |
| --- | --- |
| Next.js | `^16.2.6` |
| React | `^19.2.6` |
| React DOM | `^19.2.6` |
| TypeScript | `^5` |
| Tailwind CSS | `^4` |
| Bun | `1.3.10` lokalnie |
| Node.js | `22.13.0` lokalnie, `22` w GitHub Actions |

### Backend, baza danych i auth

| Komponent | Wersja |
| --- | --- |
| Prisma | `^7.8.0` |
| Prisma Client | `^7.8.0` |
| Prisma PostgreSQL adapter | `^7.8.0` |
| pg | `^8.20.0` |
| NextAuth | `^4.24.14` |
| Auth Prisma Adapter | `^2.11.2` |
| bcryptjs | `^3.0.3` |

### Realtime i integracje

| Komponent | Wersja |
| --- | --- |
| PartyKit | `^0.0.115` |
| PartySocket | `^1.1.19` |
| qrcode | `^1.5.4` |

### UI i stan aplikacji

| Komponent | Wersja |
| --- | --- |
| Framer Motion | `^12.38.0` |
| Lucide React | `^1.14.0` |
| Zustand | `^5.0.13` |
| clsx | `^2.1.1` |
| tailwind-merge | `^3.6.0` |

### Testy i narzędzia developerskie

| Komponent | Wersja |
| --- | --- |
| Playwright | `^1.60.0` |
| Vitest | `^4.1.6` |
| ESLint | `^9` |
| eslint-config-next | `16.2.6` |
| eslint-plugin-simple-import-sort | `^13.0.0` |
| eslint-plugin-unused-imports | `^4.4.1` |
| Prettier | `^3.8.3` |
| prettier-plugin-tailwindcss | `^0.8.0` |
| React Compiler Babel Plugin | `1.0.0` |

## Frontend

- **Next.js 16** - główny framework aplikacji, routing w katalogu `src/app`, API routes oraz renderowanie stron.
- **React 19** - budowa interfejsu użytkownika i komponentów gry.
- **TypeScript** - typowanie kodu aplikacji, kontraktów API i logiki gry.
- **Tailwind CSS 4** - stylowanie interfejsu.
- **Framer Motion** - animacje i przejścia w UI.
- **Lucide React** - ikony w interfejsie.
- **Zustand** - lokalny stan aplikacji po stronie klienta.

## Backend aplikacji

Backend działa głównie jako API routes w Next.js:

- obsługa logowania i sesji użytkownika,
- tworzenie i dołączanie do sesji gry,
- zarządzanie pytaniami i ustawieniami gry,
- obsługa płatności Stripe,
- wystawianie krótkotrwałych tokenów dla PartyKit,
- rate limiting i walidacja wejścia.

Najważniejsze katalogi:

- `src/app/api` - endpointy API,
- `src/lib` - logika współdzielona, integracje i helpery,
- `src/components` - komponenty UI i ekrany gry,
- `src/config` - konfiguracja gry, kart i stałych aplikacji.

## Baza danych i ORM

- **PostgreSQL** - główna relacyjna baza danych.
- **Prisma 7** - ORM i definicja modeli w `prisma/schema.prisma`.
- **@prisma/adapter-pg** oraz **pg** - połączenie Prisma z PostgreSQL.

Modele bazy obejmują między innymi:

- użytkowników,
- ustawienia gry,
- własne pytania użytkowników,
- tokeny resetowania hasła,
- zgody zakupowe.

## Realtime

Projekt używa PartyKit jako warstwy realtime gry.

PartyKit znajduje się w:

- `partykit.json` - konfiguracja projektu PartyKit,
- `party/server.ts` - serwer pokoju realtime,
- `party/protocol.ts` - typy protokołu WebSocket,
- `src/app/api/party/ticket/route.ts` - endpoint wystawiający token połączenia.

Aktualny status PartyKit:

- gotowe jest wystawianie i weryfikowanie tokenów,
- gotowy jest podstawowy handshake WebSocket,
- działa `ping/pong` i snapshot pokoju,
- właściwe akcje gry w `onMessage` są jeszcze etapem migracji.

## Uwierzytelnianie i bezpieczeństwo

- **NextAuth** - sesje użytkownika i integracja logowania.
- **bcryptjs** - haszowanie haseł.
- **Cloudflare Turnstile** - ochrona wybranych akcji przed botami.
- **Rate limiting** - limity zapytań dla krytycznych endpointów.
- **HMAC-SHA256 PartyKit token** - krótkotrwały token dla połączenia WebSocket.

Ważne sekrety:

- `NEXTAUTH_SECRET` - sesje NextAuth,
- `PARTY_AUTH_SECRET` - wspólny sekret Next.js i PartyKit,
- `TURNSTILE_SECRET_KEY` - backendowa weryfikacja Turnstile,
- `UPSTASH_REDIS_REST_TOKEN` - współdzielony storage limitów w produkcji.

## Płatności

- **Stripe** - checkout, portal klienta, webhooki i status subskrypcji.

Główne zmienne środowiskowe:

- `STRIPE_SECRET_KEY`,
- `STRIPE_WEBHOOK_SECRET`,
- `STRIPE_MONTHLY_PRICE_ID`,
- `STRIPE_LIFETIME_PRICE_ID`.

## E-mail

- **Resend** - wysyłka wiadomości e-mail, między innymi resetowania hasła.

Główne zmienne:

- `RESEND_API_KEY`,
- `EMAIL_FROM`.

## Hosting i deploy

- **Vercel** - hosting aplikacji Next.js.
- **PartyKit** - deploy realtime servera z `party/server.ts`.
- **Cloudflare Workers / Durable Objects** - infrastruktura, na której działa PartyKit.
- **GitHub Actions** - CI/CD w `.github/workflows/ci-cd.yml`.

Obecny flow CI/CD:

1. Pull request lub push uruchamia lint, typecheck i build.
2. Push do `main` po udanym CI deployuje PartyKit.
3. Vercel deployuje aplikację Next.js przez integrację z GitHubem.

Ważne: Vercel i GitHub Actions są obecnie dwoma niezależnymi pipeline'ami. PartyKit jest deployowany przez GitHub Actions, a Next.js przez Vercel.

## Testy i jakość kodu

- **ESLint 9** - lintowanie kodu.
- **TypeScript** - statyczna kontrola typów.
- **Playwright** - testy end-to-end.
- **Vitest** - dostępny w projekcie do testów jednostkowych.
- **Prettier** - formatowanie kodu.

Najważniejsze skrypty:

```bash
bun run dev
bun run dev:party
bun run build
bun run lint
bun run test
bun run test:all
```

## Runtime i package manager

- **Bun** - package manager i główne narzędzie uruchamiania skryptów.
- **Node.js 22** - runtime używany w CI oraz kompatybilny z Next.js i Web Crypto używanym przy tokenach PartyKit.

## Najważniejsze integracje zewnętrzne

- Vercel - hosting Next.js,
- PartyKit - realtime server,
- Cloudflare - Turnstile oraz infrastruktura PartyKit,
- Stripe - płatności,
- Resend - e-mail,
- Upstash Redis - rate limiting,
- PostgreSQL/Neon - główna baza danych.

## Podsumowanie architektury

```txt
Browser
  -> Next.js na Vercel
      -> API routes
      -> Prisma/PostgreSQL
      -> Stripe / Resend / Upstash
      -> /api/party/ticket wystawia partyToken

Browser
  -> PartyKit WebSocket
      -> weryfikuje partyToken przez PARTY_AUTH_SECRET
      -> obsługuje realtime pokoju gry
```

PartyKit obsługuje realtime gry i stan pokoi przez WebSockety oraz Durable Objects.
