import { test, expect } from '@playwright/test';
import { openApp, waitForAgentResponse, askQuestion } from './helpers';
import { agentMessages, pill, userMessages } from './locators';

const DOMAIN_KEYWORDS = ['permission', 'data', 'earn', 'ask', 'share', 'wallet', 'broker'];
const MIN_KEYWORD_HITS = 3; // tuned below the weakest of the two reference answers (4/7)

const OFF_TOPIC_PATTERNS =
  /\b(sorry|i can'?t|i cannot|unable to (help|answer)|something went wrong|no response|i don'?t have (that|access))\b/i;

test('clicking a suggested topic produces an on-topic agent response', async ({ page }) => {
  await openApp(page);

  await pill(page, 'What is Permission').click();
  await waitForAgentResponse(page);

  const answer = (await agentMessages(page).last().textContent()) ?? '';

  // Catches: a bubble that never rendered, or one that rendered empty/whitespace.
  expect(answer.trim().length).toBeGreaterThan(0);
  // Catches: truncated one-word replies and runaway/garbled walls of text.
  expect(answer.length).toBeGreaterThanOrEqual(40);
  expect(answer.length).toBeLessThanOrEqual(2000);
  // Catches: the agent bailing out with a refusal/apology instead of answering.
  expect(answer).not.toMatch(OFF_TOPIC_PATTERNS);

  // Catches: an on-topic-looking but generic/evasive answer that never actually
  // engages with Permission's product (data, earning, wallet, broker, ...).
  const hits = DOMAIN_KEYWORDS.filter((kw) => answer.toLowerCase().includes(kw));
  expect(hits.length).toBeGreaterThanOrEqual(MIN_KEYWORD_HITS);

  // Catches: the transcript rendering the response to the wrong question, or
  // losing the user's turn entirely.
  const question = (await userMessages(page).last().textContent()) ?? '';
  expect(question).toContain('What is Permission');
});

test('a free-text question via the ASK input produces an agent response', async ({ page }) => {
  await openApp(page);

  const question = 'Why should I trust an AI agent with my data?';
  await askQuestion(page, question);

  const answer = (await agentMessages(page).last().textContent()) ?? '';
  expect(answer.trim().length).toBeGreaterThan(0);
  expect(answer.length).toBeGreaterThanOrEqual(40);
  expect(answer.length).toBeLessThanOrEqual(2000);
  expect(answer).not.toMatch(OFF_TOPIC_PATTERNS);

  const echoedQuestion = (await userMessages(page).last().textContent()) ?? '';
  expect(echoedQuestion).toContain(question);
});
