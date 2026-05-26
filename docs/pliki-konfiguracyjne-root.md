# Pliki konfiguracyjne w katalogu głównym

Ten dokument opisuje najważniejsze pliki konfiguracyjne znajdujące się w katalogu głównym projektu. Nie obejmuje szczegółowo kodu aplikacji w `src`, konfiguracji GitHub Actions w `.github` ani schematu Prisma, który ma osobny dokument.

## `package.json`

Główny manifest projektu Node/Bun.

Zawiera:

- nazwę i wersję projektu,
- skrypty developerskie i produkcyjne,
- zależności runtime,
- zależności developerskie.

Najważniejsze skrypty:

- `dev` - uruchamia Next.js lokalnie,
- `dev:party` - uruchamia lokalny serwer PartyKit,
- `deploy:party` - deployuje PartyKit,
- `build` - buduje aplikację Next.js,
- `start` - uruchamia zbudowaną aplikację,
- `lint` - uruchamia ESLint,
- `test` / `test:e2e` - uruchamia testy Playwright,
- `test:all` - uruchamia TypeScript check i testy,
- `postinstall` - generuje Prisma Client po instalacji zależności.

Ten plik jest źródłem informacji o stacku technologicznym i wersjach bibliotek.

## `bun.lock`

Lockfile Bun.

Utrwala dokładne wersje zainstalowanych zależności. `package.json` określa zakresy wersji, a `bun.lock` zapisuje konkretne wersje użyte w projekcie.

Ten plik powinien być commitowany, żeby instalacje lokalne, CI i produkcyjne były powtarzalne.

## `next.config.ts`

Konfiguracja Next.js.

Aktualnie ustawia:

- `reactCompiler: true` - włącza React Compiler,
- `allowedDevOrigins` - pozwala na wskazany origin w development,
- globalne nagłówki bezpieczeństwa,
- produkcyjne `Strict-Transport-Security`,
- produkcyjne `Content-Security-Policy`.

Ważna uwaga:

`Content-Security-Policy` definiuje `connect-src`. Jeśli frontend zostanie przełączony na produkcyjne połączenie WebSocket z PartyKit, trzeba upewnić się, że host PartyKit jest dopuszczony w `connect-src`, np. jako `wss://...`.

## `tsconfig.json`

Konfiguracja TypeScript.

Najważniejsze ustawienia:

- `strict: true` - włącza ścisłe typowanie,
- `noEmit: true` - TypeScript sprawdza typy, ale nie generuje plików wynikowych,
- `moduleResolution: "bundler"` - dopasowane do bundlera Next.js,
- `jsx: "react-jsx"` - obsługa JSX dla React,
- `incremental: true` - przyspiesza kolejne sprawdzenia typów,
- plugin `next` - integracja typów Next.js,
- alias `@/*` wskazujący na `./src/*`.

Do sprawdzania typów projekt używa między innymi:

```bash
bunx tsc --noEmit --pretty false
```

## `eslint.config.mjs`

Konfiguracja ESLint w nowym formacie flat config.

Zawiera:

- reguły Next.js Core Web Vitals,
- reguły TypeScript z `eslint-config-next`,
- ignorowane katalogi buildów i raportów,
- plugin `eslint-plugin-unused-imports`,
- plugin `eslint-plugin-simple-import-sort`.

Najważniejsze reguły:

- nieużywane importy są błędem,
- nieużywane zmienne są ostrzeżeniem,
- sortowanie importów i eksportów jest ostrzeżeniem,
- `react-hooks/set-state-in-effect` jest wyłączone dla istniejących wzorców w kodzie.

## `.prettierrc`

Konfiguracja Prettier.

Ustawia między innymi:

- brak średników,
- pojedyncze cudzysłowy w TypeScript/JavaScript,
- `printWidth: 100`,
- `tabWidth: 2`,
- końce linii `lf`,
- plugin `prettier-plugin-tailwindcss`.

Plugin Tailwind porządkuje klasy Tailwind CSS w przewidywalnej kolejności.

## `postcss.config.mjs`

Konfiguracja PostCSS.

Aktualnie rejestruje plugin:

```js
'@tailwindcss/postcss'
```

Jest potrzebna do działania Tailwind CSS 4 w pipeline stylów Next.js.

## `playwright.config.ts`

Konfiguracja testów end-to-end Playwright.

Aktualnie:

- szuka testów w `__tests__/e2e`,
- uruchamia testy równolegle,
- nie ponawia automatycznie nieudanych testów,
- używa reportera HTML,
- ustawia `baseURL` na `http://localhost:3000`,
- zachowuje trace i video przy błędzie,
- robi screenshot tylko przy błędzie,
- testuje projekt `chromium`.

Ważne:

`webServer` jest zakomentowany. Oznacza to, że Playwright zakłada, że aplikacja jest już uruchomiona ręcznie, np. przez:

```bash
bun run dev
```

## `prisma.config.ts`

Konfiguracja Prisma CLI.

Ustawia:

- ścieżkę schematu: `prisma/schema.prisma`,
- ścieżkę migracji: `prisma/migrations`,
- datasource URL z `process.env.DATABASE_URL`.

Plik ładuje zmienne środowiskowe przez:

```ts
import 'dotenv/config'
```

Szczegóły bazy danych są opisane w `docs/baza-danych-prisma.md`.

## `partykit.json`

Konfiguracja PartyKit.

Aktualnie zawiera:

- schema PartyKit,
- nazwę projektu PartyKit: `lastrodeo`,
- entrypoint: `party/server.ts`,
- `compatibilityDate`: `2024-11-12`.

Znaczenie pól:

- `name` wpływa na nazwę deployowanego projektu i adres w PartyKit,
- `main` wskazuje plik serwera realtime,
- `compatibilityDate` stabilizuje zachowanie runtime Cloudflare Workers.

Przy deployu PartyKit publikuje kod z `party/server.ts` jako osobny realtime backend WebSocket.

## `.gitignore`

Lista plików i katalogów ignorowanych przez Git.

Ignoruje między innymi:

- `node_modules`,
- buildy Next.js: `.next`, `out`,
- raporty testów: `playwright-report`, `test-results`,
- pliki środowiskowe `.env*`,
- lokalne sekrety PartyKit `.dev.vars`,
- cache PartyKit `.partykit`,
- katalog `.vercel`,
- pliki `*.tsbuildinfo`,
- wygenerowany `next-env.d.ts`.

Ważne:

- `.env.example` i `.dev.vars.example` są dopuszczone do commitowania, jeśli istnieją,
- prawdziwe `.env`, `.env.local` i `.dev.vars` nie powinny być commitowane.

## `.env`

Lokalny plik zmiennych środowiskowych.

Może być używany przez narzędzia CLI oraz lokalny runtime. Nie powinien być commitowany, bo może zawierać sekrety.

W tym projekcie prawdziwe wartości środowiskowe powinny być ustawiane:

- lokalnie w `.env` / `.env.local`,
- produkcyjnie w Vercel,
- dla CI/CD w GitHub Secrets,
- dla PartyKit przez GitHub Actions albo PartyKit env/vars.

## `.env.local`

Lokalny plik zmiennych środowiskowych używany przez Next.js.

Zwykle zawiera wartości dla:

- NextAuth,
- Stripe,
- Resend,
- Upstash,
- Cloudflare Turnstile,
- PartyKit.

Ten plik jest prywatny i nie powinien trafić do repo.

## `.dev.vars`

Lokalny plik zmiennych środowiskowych dla PartyKit dev.

Jest używany przy:

```bash
bun run dev:party
```

Najważniejsza zmienna w tym pliku to:

```env
PARTY_AUTH_SECRET=...
```

Musi mieć taką samą wartość jak `PARTY_AUTH_SECRET` w `.env.local`, żeby tokeny wystawiane przez Next.js były akceptowane przez lokalny PartyKit.

## `next-env.d.ts`

Plik generowany przez Next.js.

Dostarcza referencje typów Next.js i typów obrazów. Nie powinien być edytowany ręcznie.

W `.gitignore` jest ignorowany, więc traktujemy go jako artefakt generowany lokalnie.

## `tsconfig.tsbuildinfo`

Plik cache TypeScript dla trybu incremental.

Przyspiesza kolejne sprawdzenia typów, ale nie jest źródłem konfiguracji projektu. Jest ignorowany przez Git przez wzorzec:

```gitignore
*.tsbuildinfo
```

## `dev-party.log`

Lokalny log z uruchamiania PartyKit.

Nie jest plikiem konfiguracyjnym. Służy tylko do debugowania lokalnego procesu `partykit dev`.

Jeśli takie logi mają regularnie powstawać w repo, warto rozważyć dopisanie ich do `.gitignore`.

## Pliki, których nie należy edytować ręcznie

Zwykle nie edytujemy ręcznie:

- `bun.lock`, chyba że zmieniają się zależności przez Bun,
- `next-env.d.ts`, bo generuje go Next.js,
- `tsconfig.tsbuildinfo`, bo jest cachem TypeScript,
- lokalnych logów typu `dev-party.log`.

## Pliki wymagające szczególnej ostrożności

Szczególnej ostrożności wymagają:

- `.env`,
- `.env.local`,
- `.dev.vars`.

To pliki lokalne i potencjalnie sekretne. Dokumentacja może opisywać nazwy wymaganych zmiennych, ale nie powinna zawierać ich prawdziwych wartości.
