import { test, expect } from "@playwright/test";

test.describe("Pełny scenariusz gry Last Rodeo (E2E)", () => {
  test("Host tworzy grę, gracze dołączają i odpowiadają na pytania", async ({ browser }) => {
    // 1. Tworzymy oddzielne konteksty przeglądarki (żeby udawać różne osoby)
    const hostContext = await browser.newContext();
    const player1Context = await browser.newContext();
    const player2Context = await browser.newContext();

    const hostPage = await hostContext.newPage();
    const p1Page = await player1Context.newPage();
    const p2Page = await player2Context.newPage();

    // ==========================================
    // KROK 1: HOST TWORZY GRĘ
    // ==========================================
    await hostPage.goto("/graj/host");
    
    // Host wpisuje nazwę
    await hostPage.fill("#host-name-input", "Szeryf Testowy");
    
    // Host wybiera tryb gry (zwykły quiz)
    await hostPage.click("#mode-trivia");
    
    // Host klika stwórz
    await hostPage.click("#create-lobby-btn");
    
    // Czekamy na przekierowanie do pokoju z PIN-em
    await hostPage.waitForURL(/\/graj\/host\/\d+/);
    
    // Wyciągamy PIN z URL
    const hostUrl = hostPage.url();
    const pin = hostUrl.split("/").pop()?.split("?")[0];
    expect(pin).toBeDefined();
    
    // Czekamy na załadowanie drugiego ekranu (wybór awatara przed wejściem do lobby)
    await hostPage.locator("text=Najpierw wybierz swój awatar").first().waitFor();
    // Animacje powodują, że poprzedni input jeszcze chwile istnieje, bierzemy ostatni
    await hostPage.locator('input[type="text"]').last().fill("Szeryf Testowy");
    await hostPage.getByRole('button', { name: '🤠', exact: true }).first().click();
    await hostPage.getByRole('button', { name: /Dalej/ }).click();

    // Host jest teraz w Lobby i widzi kod PIN
    await expect(hostPage.locator("text=Ty (organizator)")).toBeVisible();

    // ==========================================
    // KROK 2: GRACZE DOŁĄCZAJĄ
    // ==========================================
    
    // Funkcja pomocnicza do dołączania gracza
    async function joinPlayer(page: any, name: string, emoji: string) {
      await page.goto("/graj/join");
      // Wpisywanie PIN-u używając klawiatury na ekranie
      for (const char of pin!) {
        await page.click(`button:has-text("${char}")`, { exact: true });
      }
      await page.click("#pin-continue-btn");
      
      // Wybór imienia i awatara
      await page.fill("#player-name-input", name);
      await page.getByRole('button', { name: emoji, exact: true }).click();
      await page.click("#name-continue-btn");
      
      // Wybór trybu (Samotna Kowbojka)
      await page.click("#solo-mode-btn");
      
      // Czekanie na ekran "Siodła w dłoń..."
      await expect(page.locator("text=Siodła w dłoń i otwieramy rodeo!")).toBeVisible();
    }

    // Gracze dołączają jednocześnie (żeby było szybciej)
    await Promise.all([
      joinPlayer(p1Page, "Ania", "💃"),
      joinPlayer(p2Page, "Zosia", "🌸")
    ]);

    // Sprawdzamy, czy Host widzi graczy na ekranie Lobby (w czasie rzeczywistym!)
    await expect(hostPage.locator("text=Ania")).toBeVisible();
    await expect(hostPage.locator("text=Zosia")).toBeVisible();

    // ==========================================
    // KROK 3: ROZPOCZĘCIE GRY I RUNDA 1
    // ==========================================
    
    // Host uruchamia grę
    await hostPage.click("#host-start-btn");

    // Gracze powinni zobaczyć ekran odpowiedzi (przyciski A, B, C, D)
    await expect(p1Page.locator("text=Wybierz odpowiedź")).toBeVisible();
    await expect(p2Page.locator("text=Wybierz odpowiedź")).toBeVisible();

    // Host też może odpowiedzieć
    await hostPage.locator("button").filter({ hasText: /^A:/ }).click();

    // Gracze odpowiadają
    await p1Page.locator("button").filter({ hasText: /^B:/ }).click();
    await p2Page.locator("button").filter({ hasText: /^C:/ }).click();

    // Host powinien zobaczyć, że wszyscy zagłosowali
    // (Zostanie to wyświetlone na UI, np. "Odkryj odpowiedzi" - zależy od wdrożenia, my symulujemy prosty przebieg)
    // Czekamy chwilę na przetworzenie przez serwer
    await hostPage.waitForTimeout(1000);
  });
});
