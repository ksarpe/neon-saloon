import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./__tests__/e2e",
  /* Uruchamiaj testy równolegle (bardzo przyspiesza testy) */
  fullyParallel: true,
  /* Jeśli test nie przejdzie, nie ponawiaj od razu (żeby szybciej zobaczyć błąd) */
  retries: 0,
  /* Reporter do wyświetlania wyników */
  reporter: "html",
  /* Globalne ustawienia dla przeglądarek */
  use: {
    /* Podstawowy adres URL aplikacji */
    baseURL: "http://localhost:3000",
    /* Zbieraj zrzuty ekranu i nagrania wideo tylko w razie błędu testu */
    trace: "retain-on-failure",
    video: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  /* Konfiguracja używanych przeglądarek */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  /* Konfiguracja serwera WWW - Playwright NIE będzie uruchamiał aplikacji, użyje tej co działa z bun run dev */
  // webServer: {
  //   command: 'bun run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: true,
  // },
});
