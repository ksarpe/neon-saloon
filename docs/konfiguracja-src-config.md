# Konfiguracja w `src/config`

Katalog `src/config` zawiera centralne pliki konfiguracyjne aplikacji: treści kart, ustawienia czasu gry, limity kont, dane firmy, zgody zakupowe, awatary i kategorie pytań.

Zasada ogólna: jeśli zmiana dotyczy treści, limitu, domyślnego ustawienia lub listy opcji widocznej w UI, najpierw sprawdź `src/config`, zanim dodasz wartość bezpośrednio w komponencie.

## Szybka mapa plików

| Plik | Co konfiguruje |
| --- | --- |
| `src/config/game.ts` | Domyślne czasy i timery gry |
| `src/config/usage-limits.ts` | Limity własnych pytań dla free/premium |
| `src/config/company.ts` | Dane operatora serwisu do dokumentów prawnych |
| `src/config/consent.ts` | Treść i wersję zgody zakupowej |
| `src/config/player-avatars.ts` | Listę dostępnych awatarów gracza |
| `src/config/player-names.ts` | Losowe przykładowe nazwy graczy |
| `src/config/card-backgrounds.ts` | Tła kart i sposób ich dobierania |
| `src/config/landing-sample-cards.ts` | Przykładowe karty na landing page |
| `src/config/games/default-deck.ts` | Domyślną talię startową |
| `src/config/games/never-cards.ts` | Talie trybu "Nigdy przenigdy" |
| `src/config/games/bridal-quiz-cards.ts` | Quiz o Pannie Młodej |
| `src/config/games/categories.ts` | Kategorie i pytania quizowe/Battle Royale |
| `src/config/games/category-selection.ts` | Logikę wyboru kategorii i premium category IDs |
| `src/config/games/highlow.ts` | Pytania trybu High Low |

## `game.ts`

Centralne domyślne wartości czasowe gry.

Eksportuje:

- `REVEAL_COUNTDOWN_SECONDS` - czas po reveal przed przejściem dalej w trybie standardowym,
- `ANSWER_TIME_LIMIT_SECONDS` - czas na odpowiedź w standardowej karcie,
- `BR_TIMER_SECONDS` - czas na odpowiedź w Battle Royale,
- `BR_AUTO_NEXT_SECONDS` - czas po reveal w Battle Royale przed następną rundą.

Używane w:

- ustawieniach gry,
- panelu konfiguracji,
- API sesji,
- komponentach Battle Royale.

Co można zmieniać:

- wartości liczbowe w sekundach.

Na co uważać:

- wartości powinny być dodatnie i realistyczne dla UI,
- jeśli zwiększasz/zmniejszasz timery, sprawdź widoki hosta i gracza.

## `usage-limits.ts`

Konfiguracja limitów własnych pytań użytkownika.

Eksportuje:

- `QUESTION_QUOTAS`,
- `getQuestionQuota(kind, isPremium)`.

Obecne typy limitów:

- `quiz`,
- `never`.

Dla każdego typu można ustawić:

- `free` - limit dla konta bez premium,
- `premium` - limit dla konta premium.

Używane w:

- API pytań `quiz`,
- API pytań `never`,
- panelu pytań użytkownika.

Co można zmieniać:

- limity free/premium,
- nowe typy limitów, jeśli powstaną nowe sekcje pytań.

Na co uważać:

- typ dodany w `QUESTION_QUOTAS` powinien być obsłużony w miejscach, które wywołują `getQuestionQuota`.

## `company.ts`

Jedno źródło prawdy dla danych firmy/operatora serwisu.

Eksportuje:

- `COMPANY`,
- `COMPANY_ADDRESS_LINE`.

Konfiguruje między innymi:

- markę,
- domenę,
- adres URL,
- nazwę firmy,
- właściciela,
- formę prawną,
- NIP,
- REGON,
- adres,
- e-mail,
- telefon,
- datę ostatniej aktualizacji dokumentów.

Używane w:

- regulaminie,
- polityce prywatności,
- metadanych stron prawnych.

Co można zmieniać:

- dane firmy,
- adres kontaktowy,
- datę aktualizacji dokumentów.

Na co uważać:

- zmiany danych prawnych powinny być świadome i zgodne z dokumentami firmy,
- puste pola są miejscami pomijane w dokumentach,
- przed sprzedażą konsumentom dane kontaktowe/adresowe muszą być poprawne.

## `consent.ts`

Konfiguracja zgody konsumenta przy zakupie.

Eksportuje:

- `PURCHASE_CONSENT_VERSION`,
- `PURCHASE_CONSENT_TEXT`.

Używane w:

- Stripe checkout,
- zapisie `PurchaseConsent` w bazie.

Co można zmieniać:

- tekst zgody,
- wersję zgody.

Na co uważać:

- przy każdej zmianie tekstu zgody należy podbić `PURCHASE_CONSENT_VERSION`,
- wersja jest zapisywana w bazie jako dowód, na jaką treść zgodził się użytkownik.

## `player-avatars.ts`

Lista dostępnych awatarów gracza.

Eksportuje:

- `PLAYER_AVATARS`.

Wartości to nazwy plików z:

```txt
public/player-avatars/
```

Używane w:

- formularzu wyboru tożsamości,
- API dołączania do sesji,
- automatycznym wyborze awatara, gdy gracz nie wybierze własnego.

Co można zmieniać:

- dodać nazwę nowego pliku,
- usunąć awatar z listy,
- zmienić kolejność awatarów w selektorze.

Na co uważać:

- plik musi istnieć w `public/player-avatars`,
- kolejność listy wpływa na UI,
- jeśli lista jest pusta, kod ma fallback, ale normalnie powinna zawierać dostępne awatary.

## `player-names.ts`

Lista przykładowych losowych nazw graczy.

Eksportuje:

- `FUNNY_NAMES`.

Używane w:

- placeholderze formularza nazwy gracza,
- przycisku generowania przykładowej nazwy.

Co można zmieniać:

- dodawać nowe nazwy,
- usuwać nazwy,
- ton i styl nazw.

Na co uważać:

- nazwy powinny mieścić się w limitach walidacji nazwy gracza,
- warto utrzymać spójny ton z marką aplikacji.

## `card-backgrounds.ts`

Konfiguracja teł kart.

Eksportuje:

- `CARD_BACKGROUNDS`,
- `DEFAULT_CARD_BACKGROUND`,
- `pickDeckBackgrounds(seed, count)`.

Wartości w `CARD_BACKGROUNDS` to nazwy plików z:

```txt
public/cards/
```

Mechanizm:

- `pickDeckBackgrounds` dobiera tła deterministycznie na podstawie `seed`,
- dzięki temu stos kart może mieć powtarzalny, ale zróżnicowany wygląd,
- jeśli lista jest pusta, używany jest `DEFAULT_CARD_BACKGROUND`.

Używane w:

- `GameCardStack`,
- `CardFace`.

Co można zmieniać:

- dodać nowe tła kart,
- zmienić domyślne tło,
- zmienić kolejność rotacji.

Na co uważać:

- pliki muszą istnieć w `public/cards`,
- `DEFAULT_CARD_BACKGROUND` powinien zawsze wskazywać istniejący plik.

## `landing-sample-cards.ts`

Przykładowe karty pokazywane na stronie głównej.

Eksportuje:

- `LANDING_SAMPLE_CARDS`.

Każda karta ma strukturę zgodną z `CardLike`:

- `id`,
- `type`,
- `description`,
- `options`,
- `answer`.

Używane w:

- landing page `src/app/page.tsx`.

Co można zmieniać:

- treść przykładowych kart,
- typy kart,
- odpowiedzi,
- liczbę kart.

Na co uważać:

- `id` powinno być unikalne,
- karty są elementem marketingowym, więc powinny dobrze reprezentować ton aplikacji,
- typ i struktura muszą pasować do komponentu karty.

## `games/default-deck.ts`

Agregator domyślnej talii kart.

Eksportuje:

- `DEFAULT_CARDS`,
- `BRIDAL_QUIZ_CARDS`,
- `BRIDAL_QUIZ_TITLE`,
- `NEVER_CARDS`,
- `NEVER_TITLE`.

Aktualnie `DEFAULT_CARDS` bazuje na:

```ts
NEVER_DECKS.classic
```

Używane w:

- store gry jako domyślna talia startowa.

Co można zmieniać:

- źródło domyślnej talii,
- eksportowane zestawy kart.

Na co uważać:

- zmiana `DEFAULT_CARDS` wpływa na bazowy zestaw kart w grze,
- karty powinny mieć strukturę `Omit<GameCard, 'id'>`, bo ID jest nadawane później.

## `games/never-cards.ts`

Konfiguracja talii "Nigdy przenigdy".

Eksportuje:

- `NEVER_TITLE`,
- `NEVER_CARDS`,
- `NeverDeckId`,
- `NEVER_DECKS`,
- `getNeverDeck(deckId)`.

Obecne talie:

- `classic`,
- `spicy`,
- `uncensored`,
- `all`.

Mechanizm:

- pełna lista kart jest dzielona indeksami na segmenty,
- `all` zwraca połączenie talii classic, spicy i uncensored,
- API decków korzysta z `getNeverDeck`.

Co można zmieniać:

- treści kart,
- kolejność kart,
- progi podziału talii,
- dostępne deck IDs.

Na co uważać:

- zmiana progów `NEVER_SPICY_START_INDEX` i `NEVER_UNCENSORED_START_INDEX` zmienia klasyfikację talii,
- każdy obiekt karty powinien mieć pola wymagane przez `GameCard`,
- bardziej odważne treści powinny trafiać do właściwej talii.

## `games/bridal-quiz-cards.ts`

Konfiguracja quizu o Pannie Młodej.

Eksportuje:

- `BRIDAL_QUIZ_TITLE`,
- `BRIDAL_QUIZ_CARDS`.

Każda karta quizowa zawiera:

- `type: 'QUIZ'`,
- `description`,
- `answer`,
- `options`.

Co można zmieniać:

- tytuł quizu,
- pytania,
- odpowiedzi,
- opcje odpowiedzi.

Na co uważać:

- `answer` powinien dokładnie odpowiadać jednej z wartości w `options`,
- liczba opcji powinna pasować do UI karty quizowej.

## `games/categories.ts`

Konfiguracja kategorii pytań używanych w wyborze kategorii i Battle Royale.

Eksportuje:

- `CategoryQuestion`,
- `QuestionCategory`,
- `QUESTION_CATEGORIES`.

Struktura kategorii:

- `id` - stabilny identyfikator techniczny,
- `name` - nazwa widoczna w UI,
- `description` - opis kategorii,
- `color` - kolor akcentu,
- `border` - kolor ramki,
- `bg` - tło,
- `questions` - lista pytań.

Struktura pytania:

- `text`,
- `answer`,
- `options`.

Używane w:

- wyborze kategorii hosta,
- resume sesji,
- trybie Battle Royale,
- opcji "Wszystko na raz".

Co można zmieniać:

- dodawać nowe kategorie,
- usuwać kategorie,
- zmieniać kolory i opisy,
- dodawać/edytować pytania.

Na co uważać:

- `id` kategorii powinno być stabilne, bo może być zapisane w stanie sesji,
- `answer` powinien występować w `options`,
- kolory powinny mieć format akceptowany przez CSS,
- jeśli kategoria ma być premium, dopisz jej `id` w `category-selection.ts`.

## `games/category-selection.ts`

Logika wyboru kategorii.

Eksportuje:

- `ALL_CATEGORIES_ID`,
- `PREMIUM_CATEGORY_IDS`,
- `ALL_CATEGORIES_OPTION`,
- `getQuestionCategorySelection(categoryId)`.

Mechanizm:

- `ALL_CATEGORIES_OPTION` tworzy sztuczną kategorię "Wszystko na raz",
- pytania tej opcji są zebrane ze wszystkich kategorii,
- `PREMIUM_CATEGORY_IDS` określa kategorie wymagające premium.

Używane w:

- ekranie hosta,
- pickerach trybu gry,
- walidacji dostępu do kategorii premium.

Co można zmieniać:

- etykietę i wygląd opcji "Wszystko na raz",
- listę kategorii premium,
- ID opcji zbiorczej.

Na co uważać:

- `PREMIUM_CATEGORY_IDS` musi zawierać istniejące ID kategorii albo `ALL_CATEGORIES_ID`,
- zmiana `ALL_CATEGORIES_ID` wymaga sprawdzenia miejsc, które porównują wybrane ID.

## `games/highlow.ts`

Konfiguracja pytań trybu High Low.

Eksportuje:

- `HighLowQuestion`,
- `HIGHLOW_QUESTIONS`.

Struktura pytania:

- `id`,
- `text`,
- `answer`,
- `unit`,
- `hint`.

Używane w:

- ekranie hosta High Low,
- głosowaniu High Low,
- losowaniu i limitowaniu pytań na podstawie PIN-u sesji.

Co można zmieniać:

- treść pytań,
- odpowiedzi liczbowe,
- jednostki,
- hinty,
- liczbę pytań.

Na co uważać:

- `id` powinno być unikalne,
- `answer` musi być liczbą,
- `unit` powinna być krótka i czytelna w UI,
- `hint` jest pokazywany po reveal, więc może zawierać źródło lub krótkie wyjaśnienie.

## Zasady edycji konfiguracji gier

Przy zmianie kart i pytań:

- utrzymuj zgodność typów,
- pilnuj unikalnych `id`, jeśli dany typ danych ich używa,
- sprawdzaj, czy `answer` znajduje się w `options`,
- po większej zmianie odpal typecheck i build.

Przy zmianie limitów i timerów:

- sprawdź widok hosta,
- sprawdź widok gracza,
- sprawdź API, jeśli wartość jest też zapisywana w ustawieniach lub sesji.

Przy zmianie danych prawnych:

- zmieniaj dane tylko w `company.ts` i `consent.ts`,
- przy zmianie tekstu zgody podbij `PURCHASE_CONSENT_VERSION`,
- sprawdź regulamin, politykę prywatności i checkout.

## Zalecana weryfikacja po zmianach

Minimum:

```bash
bunx tsc --noEmit --pretty false
bun run build
```

Dla zmian w grach:

```bash
bun run test:e2e
```

Dla zmian w limitach pytań lub API:

```bash
bun run lint
```

oraz ręczne sprawdzenie panelu użytkownika i tworzenia gry.
