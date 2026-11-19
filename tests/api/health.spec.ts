import { test, expect } from "@playwright/test";

test("serves the app shell successfully", async ({ request }) => {
  const response = await request.get("/");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("text/html");
  await expect(response).toBeOK();
});

test("returns bundled frontend assets", async ({ request }) => {
  const html = await (await request.get("/")).text();
  expect(html).toContain('<div id="root">');
});
