import { test, expect } from "../fixtures/app.fixture";

test.describe("Finance menu", () => {
  test("opens each finance section from the menu", async ({
    homePage,
    page,
  }) => {
    await homePage.clickNavigation("Finance");
    await expect(page).toHaveURL(/\/finance$/);
    await expect(
      page.getByRole("heading", { name: "Finance", exact: true }),
    ).toBeVisible();

    const sections = [
      { tab: "Overview", heading: "Accounts" },
      { tab: "Transactions", heading: "Recent transactions" },
      { tab: "Debt", heading: "Debt accounts" },
      { tab: "Home contributions", heading: "Home contribution ledger" },
      { tab: "Savings", heading: "Savings ledger" },
      { tab: "Budgets", heading: "Budget health" },
    ];

    for (const section of sections) {
      const tab = page.getByRole("tab", { name: section.tab, exact: true });
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", "true");
      await expect(page.getByRole("tabpanel")).toBeVisible();
      await expect(
        page.getByRole("heading", { name: section.heading, exact: true }),
      ).toBeVisible();
    }
  });
});
