import { Page } from '@playwright/test';
import { chatInput, stopButton } from './locators';

async function dismissCookieBanner(page: Page) {
  const rejectAll = page.getByRole('button', { name: 'Reject All' });
  if (await rejectAll.isVisible().catch(() => false)) {
    await rejectAll.click();
  }
}

// On a brand-new browser context the app often renders a greeting bubble and
// NO suggested-topic pills; a reload reliably shows the pills instead (verified
// by hand in normal and incognito windows -- this is app behavior, not a bug we
// introduced). Every test goes through this helper instead of a bare goto() so
// the starting DOM is consistent, and it also clears the cookie-consent dialog,
// which overlaps the chat input/pills on first visit.
export async function openApp(page: Page) {
  await page.goto('/');
  await page.reload();
  await dismissCookieBanner(page);
}

// The rendered answer is non-deterministic in text and timing, so we never
// poll message text to detect completion. The send/stop button swap is the
// one reliable signal the app exposes: idle -> streaming (stop button
// appears, textarea disabled) -> idle again (stop button gone).
export async function waitForAgentResponse(page: Page) {
  const stop = stopButton(page);
  await stop.waitFor({ state: 'visible', timeout: 15_000 });
  await stop.waitFor({ state: 'hidden', timeout: 45_000 });
}

export async function askQuestion(page: Page, text: string) {
  await chatInput(page).fill(text);
  await chatInput(page).press('Enter');
  await waitForAgentResponse(page);
}
