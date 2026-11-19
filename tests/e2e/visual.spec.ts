import { test, expect } from "../fixtures/app.fixture";

test("dashboard visual regression snapshot", async ({ page }) => {
  await expect(page).toHaveScreenshot("dashboard.png", {
    fullPage: true,
    animations: "disabled",
  });
});
