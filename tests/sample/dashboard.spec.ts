import { test, expect } from "@playwright/test";

test("Check Dashboard UI Elements", async ({ page }) => {
  await page.goto(
    "https://demos.creative-tim.com/nextjs-tailwind-author-page",
  );

  // Check for the presence of key UI elements on the dashboard
  await expect(
    page.getByRole("heading", { name: "Emma Roberts" }),
  ).toBeVisible();
});
