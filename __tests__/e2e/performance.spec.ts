import { type Browser, type BrowserContext, expect, type Page, test } from "@playwright/test";

type NetworkProfile = {
  connectionType: "wifi" | "cellular3g" | "cellular4g";
  downloadThroughput: number;
  latency: number;
  uploadThroughput: number;
};

type PerformanceBudget = {
  cls: number;
  domContentLoaded: number;
  domNodes: number;
  load: number;
  lcp: number;
  maxLongTask: number;
  totalBlockingTime: number;
  usedJsHeapSize: number;
};

type DeviceProfile = {
  budget: PerformanceBudget;
  cpuThrottleRate: number;
  deviceScaleFactor: number;
  hasTouch: boolean;
  isMobile: boolean;
  name: string;
  network: NetworkProfile;
  userAgent: string;
  viewport: { height: number; width: number };
};

type ClientMetrics = {
  cls: number;
  longTasks: number[];
  lcp: number;
};

type PerformanceMetrics = ClientMetrics & {
  domContentLoaded: number;
  domNodes: number;
  firstContentfulPaint: number | null;
  load: number;
  maxLongTask: number;
  path: string;
  profile: string;
  totalBlockingTime: number;
  transferSize: number;
  usedJsHeapSize: number | null;
};

type PerfWindow = Window & {
  __perfMetrics?: ClientMetrics;
};

const bytesPerSecond = (kilobitsPerSecond: number) => (kilobitsPerSecond * 1024) / 8;

const testedPaths = ["/", "/graj", "/graj/host", "/graj/join"];

const deviceProfiles: DeviceProfile[] = [
  {
    name: "desktop-fast",
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
    cpuThrottleRate: 1,
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
    network: {
      connectionType: "wifi",
      downloadThroughput: bytesPerSecond(20_000),
      uploadThroughput: bytesPerSecond(10_000),
      latency: 20,
    },
    budget: {
      domContentLoaded: 4_000,
      load: 6_000,
      lcp: 3_500,
      cls: 0.1,
      totalBlockingTime: 1_500,
      maxLongTask: 1_000,
      domNodes: 5_000,
      usedJsHeapSize: 120 * 1024 * 1024,
    },
  },
  {
    name: "mobile-mid",
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    cpuThrottleRate: 4,
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    network: {
      connectionType: "cellular4g",
      downloadThroughput: bytesPerSecond(9_000),
      uploadThroughput: bytesPerSecond(3_000),
      latency: 80,
    },
    budget: {
      domContentLoaded: 6_500,
      load: 9_000,
      lcp: 6_000,
      cls: 0.15,
      totalBlockingTime: 2_500,
      maxLongTask: 1_600,
      domNodes: 5_000,
      usedJsHeapSize: 140 * 1024 * 1024,
    },
  },
  {
    name: "mobile-low-end",
    viewport: { width: 360, height: 740 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    cpuThrottleRate: 6,
    userAgent:
      "Mozilla/5.0 (Linux; Android 11; Moto G Power) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Mobile Safari/537.36",
    network: {
      connectionType: "cellular3g",
      downloadThroughput: bytesPerSecond(1_600),
      uploadThroughput: bytesPerSecond(750),
      latency: 180,
    },
    budget: {
      domContentLoaded: 10_000,
      load: 14_000,
      lcp: 9_500,
      cls: 0.2,
      totalBlockingTime: 4_500,
      maxLongTask: 2_500,
      domNodes: 5_000,
      usedJsHeapSize: 160 * 1024 * 1024,
    },
  },
];

async function createProfileContext(browser: Browser, profile: DeviceProfile) {
  const context = await browser.newContext({
    deviceScaleFactor: profile.deviceScaleFactor,
    hasTouch: profile.hasTouch,
    isMobile: profile.isMobile,
    userAgent: profile.userAgent,
    viewport: profile.viewport,
  });

  await context.addInitScript(() => {
    const perfWindow = window as PerfWindow;
    perfWindow.__perfMetrics = {
      cls: 0,
      longTasks: [],
      lcp: 0,
    };

    if (!("PerformanceObserver" in window)) {
      return;
    }

    try {
      new PerformanceObserver((list) => {
        const metrics = perfWindow.__perfMetrics;
        if (!metrics) return;

        for (const entry of list.getEntries()) {
          metrics.lcp = entry.startTime;
        }
      }).observe({ buffered: true, type: "largest-contentful-paint" });
    } catch {
      // Some browser engines do not expose LCP in automation.
    }

    try {
      new PerformanceObserver((list) => {
        const metrics = perfWindow.__perfMetrics;
        if (!metrics) return;

        for (const entry of list.getEntries()) {
          const layoutShift = entry as PerformanceEntry & {
            hadRecentInput?: boolean;
            value?: number;
          };

          if (!layoutShift.hadRecentInput) {
            metrics.cls += layoutShift.value ?? 0;
          }
        }
      }).observe({ buffered: true, type: "layout-shift" });
    } catch {
      // Layout shift is Chromium-only.
    }

    try {
      new PerformanceObserver((list) => {
        const metrics = perfWindow.__perfMetrics;
        if (!metrics) return;

        for (const entry of list.getEntries()) {
          metrics.longTasks.push(entry.duration);
        }
      }).observe({ buffered: true, type: "longtask" });
    } catch {
      // Long tasks are Chromium-only.
    }
  });

  return context;
}

async function applyDeviceThrottle(context: BrowserContext, page: Page, profile: DeviceProfile) {
  const client = await context.newCDPSession(page);

  await client.send("Emulation.setCPUThrottlingRate", {
    rate: profile.cpuThrottleRate,
  });

  await client.send("Network.enable");
  await client.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: profile.network.latency,
    downloadThroughput: profile.network.downloadThroughput,
    uploadThroughput: profile.network.uploadThroughput,
    connectionType: profile.network.connectionType,
  });
}

async function collectMetrics(page: Page, profile: DeviceProfile, path: string): Promise<PerformanceMetrics> {
  const metrics = await page.evaluate(
    ({ path, profileName }) => {
      const perfWindow = window as PerfWindow;
      const navigation = performance.getEntriesByType("navigation")[0] as
        | PerformanceNavigationTiming
        | undefined;
      const firstContentfulPaint = performance
        .getEntriesByName("first-contentful-paint")
        .at(0);
      const memory = (
        performance as Performance & {
          memory?: { usedJSHeapSize?: number };
        }
      ).memory;
      const clientMetrics = perfWindow.__perfMetrics ?? {
        cls: 0,
        longTasks: [],
        lcp: 0,
      };
      const longTasks = clientMetrics.longTasks;

      return {
        cls: clientMetrics.cls,
        domContentLoaded: navigation
          ? navigation.domContentLoadedEventEnd - navigation.startTime
          : 0,
        domNodes: document.querySelectorAll("*").length,
        firstContentfulPaint: firstContentfulPaint?.startTime ?? null,
        load: navigation ? navigation.loadEventEnd - navigation.startTime : 0,
        longTasks,
        lcp: clientMetrics.lcp,
        maxLongTask: longTasks.length ? Math.max(...longTasks) : 0,
        path,
        profile: profileName,
        totalBlockingTime: longTasks.reduce((total, duration) => total + Math.max(0, duration - 50), 0),
        transferSize: navigation?.transferSize ?? 0,
        usedJsHeapSize: memory?.usedJSHeapSize ?? null,
      };
    },
    { path, profileName: profile.name },
  );

  return metrics;
}

function assertWithinBudget(metrics: PerformanceMetrics, budget: PerformanceBudget) {
  expect(metrics.domContentLoaded, "DOM Content Loaded").toBeLessThanOrEqual(
    budget.domContentLoaded,
  );
  expect(metrics.load, "window load").toBeLessThanOrEqual(budget.load);
  expect(metrics.lcp, "Largest Contentful Paint").toBeLessThanOrEqual(budget.lcp);
  expect(metrics.cls, "Cumulative Layout Shift").toBeLessThanOrEqual(budget.cls);
  expect(metrics.totalBlockingTime, "Total Blocking Time").toBeLessThanOrEqual(
    budget.totalBlockingTime,
  );
  expect(metrics.maxLongTask, "Najdłuższy long task").toBeLessThanOrEqual(budget.maxLongTask);
  expect(metrics.domNodes, "Liczba node'ów DOM").toBeLessThanOrEqual(budget.domNodes);

  if (metrics.usedJsHeapSize !== null) {
    expect(metrics.usedJsHeapSize, "Zużyty JS heap").toBeLessThanOrEqual(budget.usedJsHeapSize);
  }
}

test.describe("Budżety wydajnościowe aplikacji", () => {
  test.describe.configure({ mode: "serial", timeout: 120_000 });

  for (const profile of deviceProfiles) {
    for (const path of testedPaths) {
      test(`${profile.name} ładuje ${path} w budżecie`, async ({ browser }, testInfo) => {
        const context = await createProfileContext(browser, profile);
        const page = await context.newPage();

        await page.goto(path, { waitUntil: "load", timeout: 45_000 });
        await applyDeviceThrottle(context, page, profile);
        await page.goto(path, { waitUntil: "load", timeout: 45_000 });
        await page.waitForTimeout(750);

        const metrics = await collectMetrics(page, profile, path);

        await testInfo.attach(`performance-${profile.name}-${path.replaceAll("/", "_") || "home"}`, {
          body: JSON.stringify(metrics, null, 2),
          contentType: "application/json",
        });

        assertWithinBudget(metrics, profile.budget);

        await context.close();
      });
    }
  }
});
