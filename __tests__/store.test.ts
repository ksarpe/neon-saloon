import { describe, it, expect, beforeEach } from "vitest";
import { useGameStore } from "../src/lib/store";

/**
 * DLACZEGO TESTUJEMY TEN PLIK?
 * 
 * Plik `store.ts` zawiera główną logikę stanu gry (dodawanie graczy, zmiana punktów, 
 * losowanie kart, przechodzenie do następnej tury). Jest to serce mechaniki "offline"
 * lub bazowej logiki aplikacji. Testując ten plik upewniamy się, że podstawowe zasady
 * gry (np. punkty nie spadają poniżej 0) zawsze działają poprawnie, niezależnie
 * od zmian w interfejsie użytkownika (UI).
 * 
 * JAK TESTUJEMY?
 * 
 * Używamy biblioteki `vitest`. Przed każdym testem (`beforeEach`) resetujemy stan sklepu
 * (Zustand) do wartości domyślnych, aby testy były od siebie niezależne (tzw. izolacja testów).
 * Następnie wywołujemy akcje na sklepie i sprawdzamy (`expect`), czy stan zmienił się
 * zgodnie z naszymi oczekiwaniami.
 */

describe("useGameStore - Logika stanu gry", () => {
  // Wywoływane przed KAŻDYM testem (`it`) - gwarantuje, że jeden test nie popsuje drugiego
  beforeEach(() => {
    useGameStore.getState().resetGame();
  });

  describe("Zarządzanie graczami (Participants)", () => {
    /**
     * CO TESTUJEMY: Funkcję dodającą nowego gracza (`addParticipant`).
     * JAK: Wywołujemy akcję i sprawdzamy, czy tablica `participants` zwiększyła się o 1
     *      i czy nowy gracz ma domyślnie 0 punktów.
     */
    it("powinno poprawnie dodać nowego gracza z początkowym wynikiem 0", () => {
      // 1. Arrange (Przygotowanie) - pobieramy akcję ze sklepu
      const { addParticipant } = useGameStore.getState();

      // 2. Act (Działanie) - dodajemy gracza
      addParticipant("Kasia");

      // 3. Assert (Sprawdzenie) - pobieramy nowy stan i weryfikujemy
      const { participants } = useGameStore.getState();
      expect(participants.length).toBe(1);
      expect(participants[0].name).toBe("Kasia");
      expect(participants[0].score).toBe(0);
      
      // Sprawdzamy też, czy gracz dostał wygenerowane id oraz kolor
      expect(participants[0].id).toBeDefined();
      expect(participants[0].color).toBeDefined();
    });

    /**
     * CO TESTUJEMY: Funkcję usuwającą gracza (`removeParticipant`).
     * JAK: Najpierw dodajemy gracza, pobieramy jego ID, a następnie każemy
     *      sklepowi go usunąć po tym ID. Sprawdzamy czy zniknął.
     */
    it("powinno poprawnie usunąć gracza po jego ID", () => {
      const { addParticipant } = useGameStore.getState();
      
      addParticipant("Kasia");
      addParticipant("Zosia");

      // Pobieramy ID pierwszego gracza (Kasi)
      const firstPlayerId = useGameStore.getState().participants[0].id;

      // Usuwamy Kasię
      useGameStore.getState().removeParticipant(firstPlayerId);

      // Zosia powinna zostać sama
      const { participants } = useGameStore.getState();
      expect(participants.length).toBe(1);
      expect(participants[0].name).toBe("Zosia");
    });
  });

  describe("Zarządzanie punktacją (Scoring)", () => {
    /**
     * CO TESTUJEMY: Funkcję `incrementScore`.
     * DLACZEGO: To kluczowa mechanika. Musimy mieć pewność, że dodawanie punktów działa.
     */
    it("powinno poprawnie dodawać punkty graczowi", () => {
      const { addParticipant } = useGameStore.getState();
      addParticipant("Gracz 1");
      const playerId = useGameStore.getState().participants[0].id;

      // Dodajemy punkty (domyślnie +1)
      useGameStore.getState().incrementScore(playerId);
      expect(useGameStore.getState().participants[0].score).toBe(1);

      // Dodajemy określoną ilość (np. +5)
      useGameStore.getState().incrementScore(playerId, 5);
      expect(useGameStore.getState().participants[0].score).toBe(6);
    });

    /**
     * CO TESTUJEMY: Funkcję `decrementScore` (odejmowanie punktów).
     * SZCZEGÓŁY: Zwracamy uwagę na tzw. "przypadek brzegowy" (edge case) - wynik
     *            nie powinien nigdy spaść poniżej zera, bo w tej grze nie ma ujemnych punktów.
     */
    it("nie powinno pozwalać na ujemne punkty przy odejmowaniu", () => {
      const { addParticipant } = useGameStore.getState();
      addParticipant("Gracz Ujemny");
      const playerId = useGameStore.getState().participants[0].id;

      // Gracz ma 0. Odejmujemy 5.
      useGameStore.getState().decrementScore(playerId, 5);
      
      // Wynik powinien zatrzymać się na 0
      expect(useGameStore.getState().participants[0].score).toBe(0);

      // Dajemy mu 10 punktów i znowu odejmujemy 3. Powinien mieć 7.
      useGameStore.getState().incrementScore(playerId, 10);
      useGameStore.getState().decrementScore(playerId, 3);
      expect(useGameStore.getState().participants[0].score).toBe(7);
    });
  });

  describe("Zarządzanie talią kart (Deck & Gameplay)", () => {
    /**
     * CO TESTUJEMY: Czy zmiana tury odpowiednio przesuwa "wskaźnik" aktualnego gracza.
     * DLACZEGO: Gra turowa musi poprawnie zapętlać graczy (1 -> 2 -> 3 -> 1 -> 2...).
     */
    it("powinno poprawnie przechodzić do następnej tury (zapętlać graczy)", () => {
      const { addParticipant, nextTurn } = useGameStore.getState();
      
      addParticipant("A");
      addParticipant("B");
      addParticipant("C");

      // Na początku tura gracza indeks 0
      expect(useGameStore.getState().currentParticipantIndex).toBe(0);

      // Następna tura -> indeks 1
      nextTurn();
      expect(useGameStore.getState().currentParticipantIndex).toBe(1);

      // Następna tura -> indeks 2
      nextTurn();
      expect(useGameStore.getState().currentParticipantIndex).toBe(2);

      // Następna tura -> powinno zapętlić do indeksu 0
      nextTurn();
      expect(useGameStore.getState().currentParticipantIndex).toBe(0);
    });

    /**
     * CO TESTUJEMY: Mechanikę tasowania (`shuffleDeck`).
     * JAK: Porównujemy, czy nowa talia (po przetasowaniu) ma takie same karty
     *      (ten sam rozmiar i te same ID), ale czy kolejność uległa zmianie.
     *      (Z racji, że to losowość, w bardzo rzadkim przypadku tablice mogą wyjść identyczne, 
     *      ale przy dużej talii jest to statystycznie prawie niemożliwe).
     */
    it("powinno przetasować karty bez ich gubienia", () => {
      const { shuffleDeck, deck: initialDeck } = useGameStore.getState();
      
      shuffleDeck();
      const newDeck = useGameStore.getState().deck;

      // Liczba kart się zgadza
      expect(newDeck.length).toBe(initialDeck.length);
      
      // Indeks powinien wrócić na 0 po przetasowaniu
      expect(useGameStore.getState().currentCardIndex).toBe(0);
      
      // Sprawdzamy czy karty są te same, tylko w innej kolejności
      // Wyciągamy ID obu talii
      const initialIds = initialDeck.map(c => c.id).sort();
      const newIds = newDeck.map(c => c.id).sort();
      
      expect(newIds).toEqual(initialIds); // Te same karty
      
      // Ważne: Kolejność POWINNA być inna (znikoma szansa na identyczne ułożenie przy 30 kartach)
      expect(newDeck.map(c => c.id)).not.toEqual(initialDeck.map(c => c.id));
    });
  });
});
