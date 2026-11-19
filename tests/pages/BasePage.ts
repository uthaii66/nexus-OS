import { expect, type Locator, type Page } from "@playwright/test";

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = "/") {
    await this.page.goto(path);
  }

  async expectPageReady(heading: string | RegExp) {
    await expect(this.page.getByRole("heading", { name: heading })).toBeVisible();
  }

  async clickNavigation(label: string) {
    await this.page.getByRole("link", { name: new RegExp(label, "i") }).first().click();
  }

  async expectVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }
}
