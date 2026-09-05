import { test, expect } from '@playwright/test';
import { openApp } from './helpers';
import { chatInput, pill } from './locators';

test.use({ viewport: { width: 390, height: 844 } });

test('at 390px viewport, pills are reachable and the ASK input is usable', async ({ page }) => {
  await openApp(page);

  const topicPill = pill(page, 'Best way to earn ASK');
  await topicPill.scrollIntoViewIfNeeded();
  await expect(topicPill).toBeInViewport();

  const input = chatInput(page);
  await input.scrollIntoViewIfNeeded();
  await expect(input).toBeVisible();
  await expect(input).toBeEditable();
  await input.fill('Testing on mobile');
  await expect(input).toHaveValue('Testing on mobile');
});
