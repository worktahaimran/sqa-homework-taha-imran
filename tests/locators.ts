import { Page } from '@playwright/test';

export const PILL_LABELS = [
  'What is Permission',
  'Best way to earn ASK',
  'How permission uses my data',
  'What is passive earning',
  'What is data ownership',
  'Permission Wallet',
] as const;

export const chatInput = (page: Page) => page.getByTestId('agent-chat-input');
export const sendButton = (page: Page) => page.getByTestId('agent-chat-input-send-button');
export const stopButton = (page: Page) => page.getByTestId('agent-chat-input-stop-button');
export const pageTitle = (page: Page) => page.getByTestId('ai-page-title');
export const pageDescription = (page: Page) => page.getByTestId('ai-page-description');
export const loginButton = (page: Page) => page.getByTestId('log-in-button');
export const signUpButton = (page: Page) => page.getByTestId('sign-up-button');
export const pill = (page: Page, label: (typeof PILL_LABELS)[number]) =>
  page.getByRole('button', { name: label, exact: true });

// WEAK POINT: there are no test ids on chat messages, so bubble side is read
// from Tailwind utility classes. If the markup changes, update these two
// locators only -- every spec reads messages through them, never the raw class.
export const agentMessages = (page: Page) => page.locator('div.flex.justify-start');
export const userMessages = (page: Page) => page.locator('div.flex.justify-end');
