import { Given, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { CustomWorld } from "../world";

Given("I open Nexus OS", async function (this: CustomWorld) {
  await this.page.goto("/");
});

Then("I should see the dashboard for Uthai", async function (this: CustomWorld) {
  await expect(this.page.getByRole("heading", { name: /Uthai/i })).toBeVisible();
});

Then("I should see the daily focus area", async function (this: CustomWorld) {
  await expect(this.page.getByRole("heading", { name: "Today's focus" })).toBeVisible();
});
