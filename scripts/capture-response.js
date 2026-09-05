// Captures one live "What is Permission" answer for Promptfoo to grade.
// Plain JS, not the TS test helpers in tests/ -- this runs standalone via
// node, outside the Playwright test runner, so it can't import a .ts module
// without an extra loader dependency. The cookie/reload/streaming logic is
// intentionally duplicated in miniature from tests/helpers.ts; if that
// behavior changes, update both.
const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { AGENT_MESSAGE_SELECTOR } = require('../selectors');

const BASE_URL = 'https://ask.permission.ai';
const OUT_PATH = path.join(__dirname, '..', 'artifacts', 'captured-response.txt');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(BASE_URL);
  await page.reload(); // reveals suggested-topic pills, see tests/helpers.ts

  const rejectAll = page.getByRole('button', { name: 'Reject All' });
  if (await rejectAll.isVisible().catch(() => false)) {
    await rejectAll.click();
  }

  await page.getByRole('button', { name: 'What is Permission', exact: true }).click();

  const stop = page.getByTestId('agent-chat-input-stop-button');
  await stop.waitFor({ state: 'visible', timeout: 15_000 });
  await stop.waitFor({ state: 'hidden', timeout: 45_000 });

  const answer = (await page.locator(AGENT_MESSAGE_SELECTOR).last().textContent()) ?? '';
  await browser.close();

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, answer.trim());
  console.log(`Captured response (${answer.length} chars) -> ${OUT_PATH}`);
})();
