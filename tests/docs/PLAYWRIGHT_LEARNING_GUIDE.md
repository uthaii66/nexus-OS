# Nexus OS Playwright learning guide

This framework is both a test suite and a study map for the FITA Playwright syllabus.

## Syllabus mapping

| Syllabus area | Where to study in this project |
|---|---|
| Playwright setup | `playwright.config.ts`, `package.json` scripts |
| TypeScript tests | `tests/e2e/*.spec.ts`, `tests/api/*.spec.ts` |
| DOM and locators | `tests/e2e/locators-assertions-waits.spec.ts` |
| Assertions | `expect(...).toBeVisible()`, `toHaveURL()`, `toHaveScreenshot()` |
| Waits | Web-first assertions in e2e specs |
| Screenshots/videos/traces | `playwright.config.ts`, `test-results/`, `playwright-report/` |
| Fixtures and hooks | `tests/fixtures/app.fixture.ts` |
| Page Object Model | `tests/pages/BasePage.ts`, `tests/pages/NexusHomePage.ts` |
| API testing | `tests/api/health.spec.ts` |
| Visual regression | `tests/e2e/visual.spec.ts` |
| Cross-browser/mobile | `projects` in `playwright.config.ts` |
| CI/CD | `.github/workflows/playwright.yml` |
| BDD with Cucumber | `tests/bdd/`, `cucumber.js` |
| AI-assisted testing | `tests/docs/AI_TESTING_PROMPTS.md` |

## One-time setup

```bash
npm install
npx playwright install
```

## Daily commands

```bash
npm run build
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:headed
npm run test:e2e:debug
npm run test:e2e:report
```

## Run selected tests

```bash
npm run test:e2e -- tests/e2e/smoke.spec.ts
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=mobile-chrome
npm run test:e2e -- --grep "navigates"
```

## Visual regression commands

First run creates snapshots:

```bash
npm run test:e2e -- tests/e2e/visual.spec.ts --update-snapshots
```

After UI changes, compare normally:

```bash
npm run test:e2e -- tests/e2e/visual.spec.ts
```

When the new UI is correct, update snapshots again:

```bash
npm run test:e2e -- tests/e2e/visual.spec.ts --update-snapshots
```

## Trace, screenshot, and video review

```bash
npm run test:e2e:report
npx playwright show-trace test-results/**/trace.zip
```

Screenshots and videos are stored under `test-results/` when enabled by the config.

## BDD commands

BDD tests need the app preview server running in one terminal:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Then run Cucumber in another terminal:

```bash
npm run test:bdd
```

Open the Cucumber report:

```bash
open reports/cucumber-report.html
```

## How to read the Page Object Model

`NexusHomePage` stores common locators and actions for the dashboard. Tests call methods like `openNotifications()` instead of repeating locator details everywhere. This keeps tests clean and makes locator changes easier.

## Good locator habits

Prefer:

```ts
page.getByRole("button", { name: /add/i });
page.getByRole("heading", { name: "Today's focus" });
page.getByText("Notifications");
```

Avoid brittle locators unless there is no better option:

```ts
page.locator(".some-generated-class > div:nth-child(2)");
```
