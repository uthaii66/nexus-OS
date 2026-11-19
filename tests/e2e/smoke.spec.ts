import { test, expect } from "../fixtures/app.fixture";

test.describe("Nexus OS smoke journey", () => {
  test("loads the dashboard and key chrome", async ({ homePage, page }) => {
    // Role locators are preferred because they match how users and screen readers find UI.
    await expect(page.getByText("Workspace")).toBeVisible();
    await expect(page.getByRole("heading", { name: /Uthai/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Today’s focus" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Life score" })).toBeVisible();

    await homePage.openNotifications();
    await expect(page.getByText(/items need attention|all caught up/i)).toBeVisible();
  });

  test("navigates through major Nexus modules", async ({ homePage, page }) => {
    const modules = [
      { label: "Finance", heading: "Finance" },
      { label: "Health", heading: "Health & fitness" },
      { label: "Learning", heading: "Deliberate practice, compounding daily." },
      { label: "Career", heading: "Move every opportunity forward." },
      { label: "Projects", heading: "Projects" },
      { label: "Calendar", heading: "Calendar" },
      { label: "Insights", heading: "Insights" },
      { label: "Settings", heading: "Settings" },
    ];

    for (const module of modules) {
      await homePage.clickNavigation(module.label);
      await expect(page).toHaveURL(new RegExp(module.label === "Finance" ? "/finance" : `/${module.label.toLowerCase()}`));
      await expect(page.getByRole("heading", { name: module.heading, exact: true })).toBeVisible();
    }
  });
});
