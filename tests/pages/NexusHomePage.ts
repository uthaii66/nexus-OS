import { expect, type Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class NexusHomePage extends BasePage {
  readonly addButton = this.page.getByRole("button", { name: /^add$/i });
  readonly commandButton = this.page.getByRole("button", {
    name: /search or run a command|open command palette/i,
  });
  readonly notificationsButton = this.page.getByRole("button", {
    name: /unread notifications/i,
  });

  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await super.goto("/");
    await this.expectPageReady(/Uthai/i);
  }

  async openNotifications() {
    await this.notificationsButton.click();
    await expect(this.page.getByText("Notifications")).toBeVisible();
  }

  async openQuickAdd() {
    await this.addButton.click();
    await expect(this.page.getByRole("dialog")).toBeVisible();
  }
}
