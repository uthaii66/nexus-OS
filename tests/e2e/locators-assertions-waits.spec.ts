import { test, expect } from "../fixtures/app.fixture";

test("demonstrates DOM locators, assertions, and waits", async ({ page }) => {
  await test.step("locate by role and accessible name", async () => {
    await expect(page.getByRole("button", { name: /add/i }).first()).toBeVisible();
  });

  await test.step("locate by text and wait for dynamic popover", async () => {
    await page.getByRole("button", { name: /unread notifications/i }).click();
    await expect(page.getByText("Notifications")).toBeVisible();
    await expect(page.getByText(/Barclaycard payment due|No new notifications/i)).toBeVisible();
  });

  await test.step("capture a learning screenshot artifact", async () => {
    await page.screenshot({
      path: "test-results/screenshots/dashboard-notifications.png",
      fullPage: true,
    });
  });
});
