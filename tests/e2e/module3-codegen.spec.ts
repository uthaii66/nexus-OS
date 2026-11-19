import { test, expect } from '@playwright/test';

test('records an expense using Quick Add and verifies confirmation', async ({ page }) => {
  // 1. Navigate to the app (uses baseURL configured in playwright.config.ts)
  await page.goto('/');

  // 2. Open the Quick Add modal (using .first() since desktop has both sidebar & floating buttons)
  await page.getByRole('button', { name: 'Quick add' }).first().click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  // 3. Select the "Add expense" action
  await page.getByRole('button', { name: /add expense/i }).click();
  await expect(dialog.getByRole('heading', { name: /add expense/i })).toBeVisible();

  // 4. Fill in the expense details (page.fill automatically focuses and clears)
  await page.getByLabel('Amount').fill('1100');
  await page.getByLabel('Category').fill('New book');
  await page.getByLabel('Date').fill('2026-09-17');
  await page.getByLabel(/notes/i).fill('Nothing');

  // 5. Submit the form
  await page.getByRole('button', { name: /save to nexus/i }).click();

  // 6. Assert success feedback and that the modal closed
  await expect(page.getByText(/expense saved/i)).toBeVisible();
  await expect(dialog).toBeHidden();
});