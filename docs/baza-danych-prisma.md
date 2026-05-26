# Baza danych i Prisma

## Rola bazy danych

Aplikacja używa relacyjnej bazy **PostgreSQL** jako głównego storage dla danych kont użytkowników, ustawień gry, pytań premium/użytkownika, resetowania hasła oraz informacji powiązanych z płatnościami.

Warstwa bazy danych jest obsługiwana przez **Prisma 7** z adapterem `@prisma/adapter-pg`.

Najważniejsze pliki:

- `prisma/schema.prisma` - definicja modeli bazy danych,
- `prisma.config.ts` - konfiguracja Prisma CLI,
- `src/lib/prisma.ts` - klient Prisma używany w kodzie aplikacji,
- `package.json` - skrypt `postinstall`, który uruchamia `prisma generate`.

## Konfiguracja Prisma

Plik `prisma.config.ts` definiuje:

```ts
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
})
```

Znaczenie ustawień:

- `schema` wskazuje główny plik schematu Prisma.
- `migrations.path` wskazuje katalog migracji.
- `datasource.url` pobiera connection string z `DATABASE_URL`.
- `import 'dotenv/config'` ładuje zmienne środowiskowe dla komend Prisma CLI.

Obecny stan repo:

- `prisma/schema.prisma` istnieje,
- `prisma/migrations` nie istnieje jeszcze w repo,
- oznacza to, że schema jest zdefiniowana, ale historia migracji nie jest aktualnie utrwalona w katalogu migracji.

## Datasource

W `schema.prisma` datasource jest ustawiony na PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
}
```

Adres bazy nie jest wpisany bezpośrednio w schema. Jest dostarczany przez `prisma.config.ts` z:

```env
DATABASE_URL=postgresql://...
```

`DATABASE_URL` jest wymagane:

- lokalnie w `.env` lub `.env.local`,
- w Vercel Environment Variables,
- w GitHub Actions, jeśli workflow ma wykonywać komendy realnie łączące się z bazą,
- w środowisku produkcyjnym aplikacji.

## Klient Prisma w aplikacji

Klient znajduje się w `src/lib/prisma.ts`.

Projekt używa:

```ts
const adapter = new PrismaPg(process.env.DATABASE_URL!)
```

czyli Prisma Client łączy się z PostgreSQL przez adapter `@prisma/adapter-pg`.

Klient jest eksportowany jako singleton:

```ts
export const prisma = globalForPrisma.prisma ?? createPrismaClient()
```

W trybie development instancja jest zapisywana w `globalThis`, żeby hot reload Next.js nie tworzył wielu klientów Prisma:

```ts
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

Logowanie Prisma:

- development: `error`, `warn`,
- production: `error`.

## Modele danych

### User

Główny model użytkownika.

Przechowuje:

- e-mail,
- nazwę,
- zahashowane hasło,
- wersję sesji,
- status premium,
- identyfikatory Stripe,
- status subskrypcji.

Ważne ograniczenia:

- `email` jest unikalny,
- `stripeCustomerId` jest unikalny,
- `stripeSubscriptionId` jest unikalny,
- istnieją indeksy po `email` i `stripeCustomerId`.

Relacje:

- jeden użytkownik może mieć wiele pytań `NeverQuestion`,
- jeden użytkownik może mieć wiele pytań `QuizQuestion`,
- jeden użytkownik może mieć wiele tokenów resetowania hasła,
- jeden użytkownik może mieć jedne `GameSettings`,
- jeden użytkownik może mieć wiele `PurchaseConsent`.

### GameSettings

Ustawienia gry przypisane do użytkownika.

Przechowuje:

- czas odliczania przed revealem,
- limit czasu odpowiedzi,
- timer dla Battle Royale,
- czas automatycznego przejścia w Battle Royale.

Relacja z `User` jest jeden-do-jednego przez unikalne `userId`.

Usunięcie użytkownika usuwa jego ustawienia dzięki:

```prisma
onDelete: Cascade
```

### NeverQuestion

Własne pytanie użytkownika dla trybu "Nigdy przenigdy".

Przechowuje:

- treść pytania,
- `userId`,
- datę utworzenia.

Model ma indeks po `userId`, co wspiera listowanie pytań danego użytkownika.

### QuizQuestion

Własne pytanie quizowe użytkownika.

Przechowuje:

- treść pytania,
- poprawną odpowiedź,
- listę opcji odpowiedzi jako `String[]`,
- `userId`,
- datę utworzenia.

`String[]` jest typem tablicowym wspieranym przez PostgreSQL.

### PasswordResetToken

Token resetowania hasła.

Przechowuje:

- hash tokenu,
- datę wygaśnięcia,
- datę użycia,
- `userId`.

Ważne ograniczenia:

- `tokenHash` jest unikalny,
- indeks po `userId`,
- indeks po `expiresAt`.

W bazie nie jest trzymany surowy token resetowania hasła, tylko jego hash.

### PurchaseConsent

Rejestr zgód zakupowych.

Przechowuje:

- plan,
- wersję treści zgody,
- treść zgody,
- IP,
- user agent,
- datę utworzenia.

Ten model pełni rolę śladu dowodowego dla zakupów i zgód konsumenta.

Indeksy:

- `userId`,
- `createdAt`.

## Relacje i usuwanie danych

Modele zależne od użytkownika używają:

```prisma
onDelete: Cascade
```

Oznacza to, że usunięcie użytkownika usuwa również jego dane zależne, między innymi:

- ustawienia gry,
- pytania użytkownika,
- tokeny resetowania hasła,
- zgody zakupowe.

To jest ważne dla endpointu usuwania konta.

## Gdzie Prisma jest używana

Prisma jest używana głównie w:

- auth i sesjach użytkownika,
- rejestracji i logowaniu,
- resetowaniu hasła,
- panelu konta,
- ustawieniach gry,
- pytaniach użytkownika,
- Stripe checkout/status/webhook.

Najczęściej używane operacje:

- `findUnique`,
- `create`,
- `update`,
- `updateMany`,
- `delete`,
- `deleteMany`,
- `upsert`,
- `$transaction`.

## Komendy Prisma

Generowanie klienta:

```bash
bunx prisma generate
```

W projekcie jest też:

```json
"postinstall": "prisma generate"
```

czyli klient Prisma generuje się po instalacji zależności.

Tworzenie migracji developerskiej:

```bash
bunx prisma migrate dev --name nazwa_zmiany
```

Wdrożenie migracji na produkcji:

```bash
bunx prisma migrate deploy
```

Podgląd/studio bazy:

```bash
bunx prisma studio
```

Szybkie zsynchronizowanie schematu bez migracji, tylko do prototypowania:

```bash
bunx prisma db push
```

`db push` nie powinno zastępować migracji produkcyjnych.

## Zalecany flow zmian schematu

1. Zmień `prisma/schema.prisma`.
2. Utwórz migrację:

```bash
bunx prisma migrate dev --name opis_zmiany
```

3. Sprawdź wygenerowane pliki w `prisma/migrations`.
4. Uruchom typecheck i build:

```bash
bunx tsc --noEmit --pretty false
bun run build
```

5. Commituj razem:

- `prisma/schema.prisma`,
- nowy katalog migracji,
- ewentualne zmiany w kodzie używającym nowych pól.

6. Na produkcji uruchamiaj:

```bash
bunx prisma migrate deploy
```

## CI/CD i baza danych

Obecny workflow CI/CD wykonuje lint, typecheck i build. Dla tych kroków `DATABASE_URL` jest ustawione jako zmienna środowiskowa CI.

Jeśli w przyszłości CI ma uruchamiać migracje lub testy integracyjne bazy danych, potrzebny będzie jeden z wariantów:

- lokalny PostgreSQL jako service w GitHub Actions,
- osobna testowa baza Neon/PostgreSQL,
- osobny connection string `DATABASE_URL` tylko dla CI.

Produkcja powinna używać osobnej produkcyjnej wartości `DATABASE_URL` ustawionej w Vercel.

## Ważne zmienne środowiskowe

Minimalnie dla Prisma:

```env
DATABASE_URL=postgresql://...
```

Powiązane z danymi użytkownika i płatnościami:

```env
NEXTAUTH_SECRET=...
NEXTAUTH_URL=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
```

Nie należy commitować prawdziwych wartości sekretów ani connection stringów.

## Obecne ograniczenia i uwagi

- Historia migracji nie jest obecnie obecna w repo, mimo konfiguracji `prisma/migrations`.
- Dane gry realtime działają poza PostgreSQL, przez PartyKit.
- Prisma nie przechowuje aktualnie pokoi realtime PartyKit.
- `DATABASE_URL` jest wymagane runtime'owo przez `src/lib/prisma.ts`; brak tej zmiennej spowoduje błąd przy użyciu klienta Prisma.
- Modele są mocno powiązane z użytkownikiem, dlatego kaskadowe usuwanie ma duże znaczenie przy usuwaniu konta.
