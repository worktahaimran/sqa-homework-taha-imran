import { test, expect } from '@playwright/test';
import { openApp } from './helpers';
import { PILL_LABELS, pageTitle, pageDescription, pill } from './locators';

test('landing renders agent title, description and all suggested topics', async ({ page }) => {
  await openApp(page);

  await expect(pageTitle(page)).toBeVisible();
  await expect(pageDescription(page)).toBeVisible();

  for (const label of PILL_LABELS) {
    await expect(pill(page, label)).toBeVisible();
  }
});
