import { test as base, expect } from "@playwright/test";
import { NexusHomePage } from "../pages/NexusHomePage";

type AppFixtures = {
  homePage: NexusHomePage;
};

export const test = base.extend<AppFixtures>({
  homePage: async ({ page }, use) => {
    const homePage = new NexusHomePage(page);
    await homePage.goto();
    await use(homePage);
  },
});

export { expect };
