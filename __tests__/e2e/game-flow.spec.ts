import { expect, type Page, test } from "@playwright/test";

test.describe("Pelny scenariusz gry Last Rodeo (E2E)", () => {
  test("Host tworzy gre, gracze dolaczaja i odpowiadaja na pytania", async ({ browser }) => {
    const hostContext = await browser.newContext();
    const player1Context = await browser.newContext();
    const player2Context = await browser.newContext();

    const hostPage = await hostContext.newPage();
    const p1Page = await player1Context.newPage();
    const p2Page = await player2Context.newPage();

    await hostPage.goto("/graj/host");
    await hostPage.fill("#host-name-input", "Szeryf Testowy");
    await hostPage.click("#mode-trivia");
    await hostPage.click("#create-lobby-btn");

    await hostPage.waitForURL(/\/graj\/host\/\d+/);

    const pin = hostPage.url().split("/").pop()?.split("?")[0];
    expect(pin).toBeDefined();
    expect(pin).toMatch(/^\d{6}$/);

    await hostPage.locator('input[type="text"]').last().waitFor();
    await hostPage.locator('input[type="text"]').last().fill("Szeryf Testowy");
    await hostPage.locator(".grid.grid-cols-5 button").first().click();
    await hostPage.getByRole("button", { name: /Dalej/ }).click();

    await expect(hostPage.locator("text=Ty (organizator)")).toBeVisible();

    async function joinPlayer(page: Page, name: string) {
      await page.goto("/graj/join");

      for (const char of pin!) {
        await page.getByRole("button", { name: char, exact: true }).click();
      }

      await page.locator("#player-name-input").waitFor();
      await page.fill("#player-name-input", name);
      await page.locator(".grid.grid-cols-5 button").first().click();
      await page.click("#name-continue-btn");
      await page.click("#solo-mode-btn");

      await expect(page.locator("text=Siod")).toBeVisible();
    }

    await joinPlayer(p1Page, "Ania");
    await expect(hostPage.locator("text=Ania")).toBeVisible();

    await joinPlayer(p2Page, "Zosia");
    await expect(hostPage.locator("text=Zosia")).toBeVisible();

    await hostPage.click("#host-start-btn");

    async function voteFirstAvailable(page: Page) {
      const answerButton = page
        .locator("button")
        .filter({ hasText: /^(A|B|C|D)|Tak!|PIJ/ })
        .first();

      await expect(answerButton).toBeVisible();
      await answerButton.click();
    }

    await p1Page.getByText(/kart/i).click();
    await p2Page.getByText(/kart/i).click();

    await voteFirstAvailable(hostPage);
    await voteFirstAvailable(p1Page);
    await voteFirstAvailable(p2Page);

    await hostPage.waitForTimeout(1000);

    await hostContext.close();
    await player1Context.close();
    await player2Context.close();
  });
});
