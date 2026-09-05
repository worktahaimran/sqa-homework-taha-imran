import { test, expect } from '@playwright/test';
import { openApp, waitForAgentResponse } from './helpers';
import { chatInput, sendButton, stopButton, userMessages } from './locators';

test('Shift+Enter inserts a newline and does not send', async ({ page }) => {
  await openApp(page);
  const input = chatInput(page);

  await input.fill('line one');
  await input.press('Shift+Enter');
  await input.type('line two');

  await expect(input).toHaveValue('line one\nline two');
  await expect(userMessages(page)).toHaveCount(0);
});

test('Enter alone sends the message', async ({ page }) => {
  await openApp(page);
  const input = chatInput(page);

  await input.fill('What is passive earning?');
  await input.press('Enter');

  await expect(userMessages(page)).toHaveCount(1);
  await expect(input).toHaveValue('');
  await waitForAgentResponse(page);
});

test('input state machine: empty disables send, streaming disables the textarea, both re-enable after', async ({
  page,
}) => {
  await openApp(page);
  const input = chatInput(page);
  const send = sendButton(page);

  await expect(send).toBeDisabled();

  await input.fill('What is data ownership?');
  await expect(send).toBeEnabled();

  await send.click();

  await expect(stopButton(page)).toBeVisible();
  await expect(input).toBeDisabled();
  await expect(input).toHaveAttribute('placeholder', 'Agent is responding...');

  await waitForAgentResponse(page);

  await expect(input).toBeEnabled();
  await expect(input).toHaveAttribute('placeholder', 'ASK anything...');
  await expect(send).toBeDisabled(); // input is empty again after sending
});
