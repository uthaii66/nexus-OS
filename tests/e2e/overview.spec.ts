import { test, expect } from '@playwright/test';

/**
 * ============================================================================
 * MODULE 7: PLAYWRIGHT TEST RUNNER — COMPREHENSIVE ARCHITECTURAL EXAMPLE
 * ============================================================================
 *
 * Subject Under Test: Nexus OS — Overview Menu & Dashboard (`/`)
 *
 * CORE PLAYWRIGHT TEST RUNNER CONCEPTS DEMONSTRATED IN THIS FILE:
 *
 * 1. test.describe()
 *    - Groups related tests into logical suites and sub-suites.
 *    - Creates clear visual hierarchies in HTML, JSON, and terminal reports.
 *    - Can be scoped with its own beforeEach() / afterEach() hooks.
 *
 * 2. test.beforeEach()
 *    - Executes BEFORE every single test inside its describe block.
 *    - Used for reusable setup (e.g. navigating to '/', preparing cookies/state).
 *    - Prevents repetitive boilerplate code across tests (DRY principle).
 *
 * 3. test.afterEach()
 *    - Executes AFTER every test, whether the test passed or failed.
 *    - Used for teardown, resetting modal states, or taking custom diagnostics.
 *    - Guarantees clean state for subsequent tests.
 *
 * 4. Test Isolation (Browser Contexts)
 *    - Every test receives a pristine browser context and a new Page object.
 *    - Tests never share cookies, localStorage, or DOM state with other tests.
 *    - Tests can be run in any sequence without order-dependence.
 *
 * 5. Parallel Execution Readiness
 *    - Because tests are stateless and isolated, Playwright can execute them
 *      concurrently across multiple worker threads (CPU cores) safely.
 *
 * 6. Headed vs. Headless Mode
 *    - Headless: Runs without a visible GUI (faster, default for CI/CD pipelines).
 *    - Headed: Launches a visible browser window (ideal for visual debugging).
 *
 * 7. Web-First Assertions vs. waitForTimeout()
 *    - We NEVER use `page.waitForTimeout(3000)` because hardcoded sleeps cause flaky tests.
 *    - Instead, we use Playwright's `await expect(locator).toBeVisible()`, which
 *      automatically polls and retries until the element is actionable or timeout expires.
 * ============================================================================
 */

test.describe('Module 7: Nexus OS — Overview Menu & Dashboard', () => {

  /**
   * --------------------------------------------------------------------------
   * HOOK: test.beforeEach()
   * --------------------------------------------------------------------------
   * What it does:
   * Playwright runs this function automatically before every test in this suite.
   *
   * Why we use it:
   * Every test in this file targets the Overview dashboard. Instead of writing
   * `await page.goto('/')` in every single test, we centralize navigation here.
   *
   * Test Runner Concept — Reusable Setup & Test Isolation:
   * Notice that `page` is passed as a fixture. Playwright gives each test a brand
   * new, isolated browser page, ensuring no test affects another.
   */
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to the root URL (uses baseURL configured in playwright.config.ts)
    await page.goto('/');

    // 2. Smoke check: Ensure the shell layout is mounted before proceeding
    // Auto-waits for the page header greeting to become visible
    await expect(
      page.getByRole('heading', { name: /good (morning|afternoon|evening), uthai/i })
    ).toBeVisible();
  });

  /**
   * --------------------------------------------------------------------------
   * HOOK: test.afterEach()
   * --------------------------------------------------------------------------
   * What it does:
   * Playwright runs this function automatically after every test finishes,
   * regardless of whether the test PASSED or FAILED.
   *
   * Why we use it:
   * In UI testing, if a modal or dialog was left open due to a failure or unclosed
   * state, we can ensure it is dismissed so teardown is graceful.
   */
  test.afterEach(async ({ page }, testInfo) => {
    // If a modal dialog remained open at the end of the test, close it
    const openDialog = page.getByRole('dialog');
    if (await openDialog.isVisible().catch(() => false)) {
      await page.keyboard.press('Escape');
    }

    // Optional: Log test outcome for CI diagnostics
    if (testInfo.status !== testInfo.expectedStatus) {
      console.warn(`[DIAGNOSTIC] Test "${testInfo.title}" failed on project: ${testInfo.project.name}`);
    }
  });

  // ==========================================================================
  // SUB-SUITE 1: Navigation, Active State, and Header Chrome
  // ==========================================================================
  test.describe('1. Navigation & Header Chrome', () => {

    test('validates Overview menu item is active in the primary sidebar navigation', async ({ page }) => {
      // Role-based locator: finds the <a> tag representing the Overview navigation link
      const overviewLink = page.getByRole('link', { name: 'Overview' });

      // Assert the navigation link is visible to the user
      await expect(overviewLink).toBeVisible();

      // Assert the current URL matches the root path
      await expect(page).toHaveURL(/\/$/);
    });

    test('displays dynamic time-of-day greeting, date eyebrow, and steady status tagline', async ({ page }) => {
      // Greeting matches "Good morning, Uthai" | "Good afternoon, Uthai" | "Good evening, Uthai"
      const greetingHeading = page.getByRole('heading', {
        name: /good (morning|afternoon|evening), uthai/i,
      });
      await expect(greetingHeading).toBeVisible();

      // The eyebrow contains today's formatted date containing the 4-digit current year
      const currentYear = new Date().getFullYear().toString();
      await expect(page.getByText(new RegExp(currentYear))).toBeVisible();

      // Sub-tagline below header
      await expect(page.getByText(/your systems are steady/i)).toBeVisible();
    });

    test('navigates to Calendar view when clicking "View schedule" button', async ({ page }) => {
      // Locate the primary schedule shortcut button in the header
      const viewScheduleBtn = page.getByRole('button', { name: /view schedule/i });
      await expect(viewScheduleBtn).toBeVisible();

      // Click to trigger navigation
      await viewScheduleBtn.click();

      // Assert URL updated to /calendar and Calendar h1 is visible
      await expect(page).toHaveURL(/\/calendar/);
      await expect(page.getByRole('heading', { name: 'Calendar', exact: true })).toBeVisible();
    });

    test('opens and dismisses the Quick Add modal using "Add to Nexus" button', async ({ page }) => {
      // Locate the Quick Add launcher button in the header
      const addToNexusBtn = page.getByRole('button', { name: /add to nexus/i });
      await expect(addToNexusBtn).toBeVisible();
      await addToNexusBtn.click();

      // Assert the dialog opens (Playwright checks accessibility role="dialog")
      const dialog = page.getByRole('dialog');
      await expect(dialog).toBeVisible();
      await expect(dialog.getByText(/quick add/i)).toBeVisible();

      // Press Escape to dismiss the modal
      await page.keyboard.press('Escape');

      // Assert dialog is hidden without any hardcoded sleep (Playwright auto-waits)
      await expect(dialog).toBeHidden();
    });

  });

  // ==========================================================================
  // SUB-SUITE 2: Today's Focus & Priority Tasks (Interactive State)
  // ==========================================================================
  test.describe('2. Today\'s Focus Priorities', () => {

    test('renders initial focus priorities list with zero completed progress', async ({ page }) => {
      // Verify card heading
      await expect(page.getByRole('heading', { name: "Today’s focus" })).toBeVisible();

      // Verify task titles from mock data
      await expect(page.getByText('Complete Python array practice')).toBeVisible();
      await expect(page.getByText('Review monthly expenses')).toBeVisible();
      await expect(page.getByText('Finish Terra-Zone deployment task')).toBeVisible();

      // Verify initial progress counter and percentage
      await expect(page.getByText(/0 of 3 priorities completed/i)).toBeVisible();
      await expect(page.getByText('0%')).toBeVisible();
    });

    test('updates completed counter and progress percentage when toggling task state', async ({ page }) => {
      // 1. Locate the checkbox button for the first task
      const completeTaskButton = page.getByRole('button', {
        name: /complete complete python array practice/i,
      });
      await expect(completeTaskButton).toBeVisible();

      // 2. Click to toggle as completed
      await completeTaskButton.click();

      // 3. Web-first assertion: counter dynamically updates to "1 of 3 priorities completed"
      await expect(page.getByText(/1 of 3 priorities completed/i)).toBeVisible();

      // 4. Progress percentage updates to 33%
      await expect(page.getByText('33%')).toBeVisible();

      // 5. The button's accessible name flips to "Mark ... incomplete"
      const markIncompleteButton = page.getByRole('button', {
        name: /mark complete python array practice incomplete/i,
      });
      await expect(markIncompleteButton).toBeVisible();

      // 6. Toggle it back to verify reversible state
      await markIncompleteButton.click();
      await expect(page.getByText(/0 of 3 priorities completed/i)).toBeVisible();
      await expect(page.getByText('0%')).toBeVisible();
    });

  });

  // ==========================================================================
  // SUB-SUITE 3: Life Score & Daily Summary Metrics
  // ==========================================================================
  test.describe('3. Life Score & Daily Summary Metrics', () => {

    test('displays Life Score radial ring and all 5 life domain category bars', async ({ page }) => {
      // Verify Life Score header
      await expect(page.getByRole('heading', { name: 'Life score' })).toBeVisible();
      await expect(page.getByText('overall', { exact: true })).toBeVisible();

      // Scope to the Life Score card panel to avoid matching duplicate navigation text
      const lifeScoreCard = page.locator('.shadow-panel').filter({
        has: page.getByRole('heading', { name: 'Life score' }),
      });

      // The 5 core domains in Nexus OS
      const domainCategories = ['Health', 'Finance', 'Career', 'Learning', 'Projects'];
      for (const domain of domainCategories) {
        await expect(lifeScoreCard.getByText(domain, { exact: true })).toBeVisible();
      }

      // Check weekly comparison delta text (e.g. "+4 points from last week")
      await expect(lifeScoreCard.getByText(/\+.*points from last week/i)).toBeVisible();
    });

    test('renders all 8 Daily Summary metric cards with formatted values and trends', async ({ page }) => {
      // Verify section heading
      await expect(page.getByRole('heading', { name: 'Daily summary' })).toBeVisible();

      // Verify all 8 metric labels
      const metricLabels = [
        'Monthly spending',
        'Current debt',
        'Current weight',
        'Weekly calories',
        'Study streak',
        'Problems solved',
        'Active applications',
        'Active projects',
      ];

      for (const label of metricLabels) {
        await expect(page.getByText(label)).toBeVisible();
      }

      // Exact value assertions (using exact: true where text might appear in descriptions)
      await expect(page.getByText('77.3 kg', { exact: true })).toBeVisible();
      await expect(page.getByText('12 days')).toBeVisible();
      await expect(page.getByText('148')).toBeVisible();
      await expect(page.getByText('14', { exact: true })).toBeVisible();
    });

  });

  // ==========================================================================
  // SUB-SUITE 4: Upcoming Schedule & Attention Required Alerts
  // ==========================================================================
  test.describe('4. Schedule & Attention Alerts', () => {

    test('displays scheduled agenda events and links to Calendar', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Upcoming schedule' })).toBeVisible();

      // Verify mock schedule items
      await expect(page.getByText('Python: Sliding window patterns')).toBeVisible();
      await expect(page.getByText('Strength workout · Upper body')).toBeVisible();

      // Click "Open calendar" action button inside card header
      const openCalendarBtn = page.getByRole('button', { name: /open calendar/i });
      await openCalendarBtn.click();

      // Assert redirected to calendar module
      await expect(page).toHaveURL(/\/calendar/);
      await expect(page.getByRole('heading', { name: 'Calendar', exact: true })).toBeVisible();
    });

    test('displays Attention Required alert items and routes to finance on review click', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Attention required' })).toBeVisible();

      // Verify alert titles from mock overview data
      await expect(page.getByText('Credit-card payment due soon')).toBeVisible();
      await expect(page.getByText('Two applications need follow-up')).toBeVisible();
      await expect(page.getByText('Protein target missed')).toBeVisible();

      // Click "Review" button on payment alert (uses exact: true to avoid fuzzy partials)
      const reviewButton = page.getByRole('button', { name: 'Review', exact: true });
      await expect(reviewButton).toBeVisible();
      await reviewButton.click();

      // Verify directed to /finance module
      await expect(page).toHaveURL(/\/finance/);
      await expect(page.getByRole('heading', { name: /finance/i })).toBeVisible();
    });

  });

  // ==========================================================================
  // SUB-SUITE 5: Weekly Progress, Activity Timeline & Global Shortcuts
  // ==========================================================================
  test.describe('5. Weekly Progress, Insights & Command Palette', () => {

    test('renders Weekly Progress bar chart legend and bottom statistical counters', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Weekly progress' })).toBeVisible();

      // Verify legend indicators
      await expect(page.getByText('Completed', { exact: true })).toBeVisible();
      await expect(page.getByText('Planned', { exact: true })).toBeVisible();

      // Verify bottom 4 stat categories
      await expect(page.getByText('Tasks', { exact: true })).toBeVisible();
      await expect(page.getByText('30 / 38')).toBeVisible();

      await expect(page.getByText('Study', { exact: true })).toBeVisible();
      await expect(page.getByText('7h 25m')).toBeVisible();

      await expect(page.getByText('Workouts', { exact: true })).toBeVisible();
      await expect(page.getByText('4 / 5')).toBeVisible();

      await expect(page.getByText('Vs budget')).toBeVisible();
      await expect(page.getByText('£96 under')).toBeVisible();
    });

    test('renders Recent Activity audit timeline items across domains', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Recent activity' })).toBeVisible();
      await expect(page.getByText('Latest updates across Nexus')).toBeVisible();

      // Verify recent entries
      await expect(page.getByText('Weight logged')).toBeVisible();
      await expect(page.getByText('LeetCode problem completed')).toBeVisible();
      await expect(page.getByText('Expense added')).toBeVisible();
      await expect(page.getByText('Application updated')).toBeVisible();
    });

    test('navigates to Insights page when clicking "Explore all insights"', async ({ page }) => {
      await expect(page.getByText('Weekly rhythm')).toBeVisible();
      await expect(page.getByText(/your strongest momentum is learning consistency/i)).toBeVisible();

      // Click CTA button
      const exploreBtn = page.getByRole('button', { name: /explore all insights/i });
      await exploreBtn.click();

      // Assert redirected to /insights
      await expect(page).toHaveURL(/\/insights/);
      await expect(page.getByRole('heading', { name: /insights/i })).toBeVisible();
    });

    test('opens Command Palette dialog via search trigger and closes on Escape', async ({ page }) => {
      // Find the search trigger button in the top navigation bar
      const searchTrigger = page.getByRole('button', {
        name: /search or run a command|open command palette/i,
      });
      await expect(searchTrigger).toBeVisible();
      await searchTrigger.click();

      // Verify palette dialog opened
      const commandDialog = page.getByRole('dialog');
      await expect(commandDialog).toBeVisible();

      // Verify input placeholder
      const searchInput = page.getByPlaceholder(/search pages, projects, or actions/i);
      await expect(searchInput).toBeVisible();

      // Press Escape to close palette
      await page.keyboard.press('Escape');
      await expect(commandDialog).toBeHidden();
    });

  });


  test("Smaple test" , async ({page})=>{
    // await page.getByRole()



const search = page.getByLabel('Search');

search.pressSequentially("Cat")

await search.press("delete")

search.pressSequentially("Ca")




  })

});
