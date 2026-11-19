# Module 7: Playwright Test Runner — Architectural Guide & Reference

> **Nexus OS Automated Quality Engineering Series**  
> **Topic:** Module 7 — Test Runner Architecture, Hooks, Isolation, & Reporters  
> **Reference Spec:** [`tests/e2e/overview.spec.ts`](../e2e/overview.spec.ts)

---

## 1. What is the Playwright Test Runner?

The **Playwright Test Runner** (`@playwright/test`) is an end-to-end testing framework engineered for modern web applications. Unlike general-purpose runners like Jest or Mocha, the Playwright Test Runner is deeply integrated with browser engines and web standards.

Key capabilities include:
- **Zero-Setup Browser Management**: Automatically provisions Chromium, Firefox, WebKit, and mobile emulators.
- **Strict Test Isolation**: Every test executes in its own pristine `BrowserContext`, completely isolated from other tests.
- **Full Parallelism**: Runs tests across multiple worker processes concurrently without state collision.
- **Web-First Assertions**: Retrying assertions (`expect(locator).toBeVisible()`) that automatically wait for DOM stability without arbitrary timeouts.
- **Multi-Format Reporting**: Built-in rich HTML, JSON, JUnit, and console list reporting.

---

## 2. Core Concepts Demonstrated in `overview.spec.ts`

### 2.1 `test.describe(title, callback)`
`test.describe()` groups related test cases into suites and sub-suites.

```typescript
test.describe('Module 7: Nexus OS — Overview Menu & Dashboard', () => {
  test.describe('1. Navigation & Header Chrome', () => {
    test('validates Overview menu item is active...', async ({ page }) => { ... });
  });

  test.describe('2. Today\'s Focus Priorities', () => {
    test('updates completed counter when toggling...', async ({ page }) => { ... });
  });
});
```

**Why it matters:**
1. **Hierarchical Reporting**: The HTML report mirrors this exact tree structure, making test triage instantaneous.
2. **Hook Scoping**: `beforeEach` and `afterEach` hooks declared inside a `describe` block only run for tests within that block.
3. **Execution Control**: You can apply `.only`, `.skip`, or `.serial` to an entire `describe` group.

---

### 2.2 `test.beforeEach(callback)`
`test.beforeEach()` executes before **each** individual test in its scope.

```typescript
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /good (morning|afternoon|evening), uthai/i })
  ).toBeVisible();
});
```

**Key Architectural Rules:**
- **Avoid Duplication (DRY)**: Reusable setup (like navigation to `/` and initial mount verification) lives in one place.
- **Fresh Context**: Even though `beforeEach` runs repeatedly, it operates on a brand new `Page` fixture for every test.
- **Fail-Fast**: If `beforeEach` fails (e.g. server is down), Playwright marks the test failed immediately, saving execution time.

---

### 2.3 `test.afterEach(callback)`
`test.afterEach()` executes after **each** individual test, regardless of whether the test passed or failed.

```typescript
test.afterEach(async ({ page }, testInfo) => {
  const openDialog = page.getByRole('dialog');
  if (await openDialog.isVisible().catch(() => false)) {
    await page.keyboard.press('Escape');
  }

  if (testInfo.status !== testInfo.expectedStatus) {
    console.warn(`[DIAGNOSTIC] Test "${testInfo.title}" failed.`);
  }
});
```

**Key Architectural Rules:**
- **Graceful Teardown**: Guarantees modals, alert dialogs, or dropdowns are dismissed even if an assertion in the test threw an error.
- **Access to `testInfo`**: Allows custom diagnostics, attachments, or screenshot logs when `testInfo.status === 'failed'`.

---

### 2.4 Test Isolation (Hermetic Testing)
Every test in Playwright receives:
1. A fresh **`BrowserContext`** (equivalent to an incognito window with its own isolated cookies, localStorage, and session cache).
2. A fresh **`Page`** object.

```
Worker 1 ──── BrowserContext A (Test 1: Navigation) ── Cleaned up
Worker 2 ──── BrowserContext B (Test 2: Priorities) ── Cleaned up
```

**Why Test Isolation is Critical:**
- **No Test Pollution**: Test B cannot fail because Test A mutated data or left a dialog open.
- **Randomized Execution**: Tests can run in any order or across multiple parallel workers safely.
- **Confidence in CI**: Eliminates flaky tests caused by residual state.

---

### 2.5 Headed vs. Headless Mode

| Mode | Command | When to Use | Performance |
|---|---|---|---|
| **Headless** (Default) | `npx playwright test` | CI/CD pipelines, automated PR checks | Fastest, lowest memory footprint |
| **Headed** | `npx playwright test --headed` | Local visual debugging, observing animations | Slower, opens visible browser window |
| **UI Mode** | `npx playwright test --ui` | Interactive development, time-travel debugging | Full visual workbench with DOM inspector |

---

### 2.6 Web-First Assertions vs. `waitForTimeout()`

#### The Anti-Pattern (Never Do This):
```typescript
// ❌ BAD: Arbitrary sleep
await page.waitForTimeout(3000);
```
- If the app responds in 200ms, you waste 2800ms.
- If the app takes 3100ms under load, your test fails flakily.

#### The Playwright Standard:
```typescript
// ✅ GOOD: Web-First Auto-Retrying Assertion
await expect(page.getByText(/1 of 3 priorities completed/i)).toBeVisible();
```
- Playwright continuously re-checks the assertion until it passes or the 5,000ms timeout expires.
- Resolves as soon as the DOM updates (e.g. 50ms), keeping tests lightning fast and rock solid.

---

## 3. Configuration & Reporters (`playwright.config.ts`)

In `playwright.config.ts`, we enabled multi-reporter output:

```typescript
export default defineConfig({
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "test-results/test-results.json" }],
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
});
```

- **List Reporter**: Real-time pass/fail indicators in the terminal.
- **HTML Reporter**: Interactive web report containing traces, screenshots, video recordings, and step-by-step logs.
- **JSON Reporter**: Machine-readable file (`test-results/test-results.json`) consumed by CI tools and automated quality dashboards.

---

## 4. Available NPM Scripts

You can run your E2E suite using the following scripts configured in `package.json`:

| Script | Command | Purpose |
|---|---|---|
| `npm run test:e2e` | `playwright test` | Run all E2E tests headless across all configured browsers |
| `npm run test:e2e:headed` | `playwright test --headed` | Run tests with visible browser windows |
| `npm run test:e2e:ui` | `playwright test --ui` | Open Playwright's interactive visual UI workbench |
| `npm run test:e2e:debug` | `playwright test --debug` | Step through tests with Playwright Inspector |
| `npm run test:e2e:report` | `playwright show-report` | Open the HTML test report in your browser |
| `npm run test:e2e:chromium` | `playwright test --project=chromium` | Fast test run specifically against Google Chromium |
| `npm run test:e2e:firefox` | `playwright test --project=firefox` | Cross-browser test run against Mozilla Firefox |
| `npm run test:e2e:webkit` | `playwright test --project=webkit` | Cross-browser test run against Apple WebKit / Safari |

---

## 5. Verification Commands

Run the suite against your live development server:
```bash
# Run in headless mode (Chromium)
PLAYWRIGHT_BASE_URL=http://localhost:5173 npm run test:e2e:chromium

# Run in headed mode (observe live browser)
PLAYWRIGHT_BASE_URL=http://localhost:5173 npm run test:e2e:headed

# Inspect HTML report
npm run test:e2e:report
```
