# ask.permission.ai — Playwright test suite

Pre-login only. No test ever signs up or logs in.

## Setup

Requires Node 20+ (Playwright 1.63's minimum; this was built and verified on 22).

```bash
git clone <this-repo-url>
cd sqa-homework-taha-imran
npm install
npx playwright install --with-deps chromium
```

Already on Node 20+? The commands above work as-is. If you use nvm and want to
match the version this was built on, run `nvm use` first (reads `.nvmrc`).

Run the suite:

```bash
npm test                      # 8 Playwright tests, HTML report -> artifacts/report/index.html
npm run report                # open that report
```

Run the Promptfoo structural check (no API key needed):

```bash
npm run eval                  # captures a live answer, then runs promptfoo -> artifacts/report/promptfoo.html
```

## Test strategy

8 tests, chosen deliberately: 4 mandated by the brief (landing render, pill
click + semantic assertions, free-text question, Shift+Enter), 4 judgment
calls covering the input state machine, Enter-to-send, pre-login navigation,
and a 390px viewport. No page-object classes — a locators module plus three
tiny helpers (`openApp`, `waitForAgentResponse`, `askQuestion`). The app is
non-deterministic in response text and streaming timing, so every wait is
state-based (button swap), never a text poll, and every content assertion is
structural, never an exact string.

## Key decisions

- **Locators + waiting survive UI change**: message bubbles have no test id,
  only brittle Tailwind classes (`div.flex.justify-start/justify-end`),
  isolated to one place (`tests/locators.ts`) with a comment on what to fix if
  the markup shifts. Response completion is never detected by polling text
  (non-deterministic) — it's read off the send/stop button swap, the one
  stable state signal the app exposes (`waitForAgentResponse` in
  `tests/helpers.ts`).
- A fresh context shows a greeting bubble and no pills; a `reload()` reliably
  reveals them. Every test goes through `openApp()`, never a bare `goto()`.
- The cookie-consent dialog overlaps the input/pills on first visit and is
  dismissed inside the same helper, discovered by hand while probing the DOM.
- Domain-keyword threshold (3 of 7) is tuned one below the weakest of the two
  reference answers given in the brief, for margin without being toothless.
- Promptfoo runs a deterministic regex classifier, not an LLM grader — no API
  key is available in this environment, so `llm-rubric` wasn't reproducible.
  See `artifacts/assertions.md` for what it catches that a keyword match can't.
- Tests 5-8 are my picks, not mandated — the input state machine and Enter-send
  are the highest-value coverage after the required 4; navigation and mobile
  round out pre-login coverage without touching auth.

AI disclosure: see `artifacts/ai-workflow.md`.

## Next steps

- Widen the Promptfoo fixture set as more real captured answers accumulate.
- Add a firefox/webkit project once chromium-only coverage feels thin.
- Trace/screenshot review on CI failures (`trace: 'retain-on-failure'` is
  already wired in `playwright.config.ts`).

## Submission checklist

- [ ] Repo named sqa-homework-<first-last> and default branch is main
- [ ] Submitted as a new email with subject "Senior Quality Assurance Engineer – Take-Home Submission"
- [ ] README includes exact Setup + run commands (verified from a clean clone)
- [ ] README word count <= 500 (excluding commands/checkboxes)
- [ ] Max 8 tests; all 4 required behaviors covered
- [ ] artifacts/assertions.md included (<= 300 words)
- [ ] At least one assertion wired into an LLM-evaluation framework and running as part of the suite
- [ ] artifacts/ux-review.md included (<= 400 words, desktop + mobile, post-signup exploration, 3-5 prioritized improvements)
- [ ] artifacts/data-checks.md included (<= 300 words + SQL: expected data, verification queries, one pipeline integrity check)
- [ ] artifacts/ai-workflow.md included (<= 300 words, all 4 questions answered)
- [ ] artifacts/report/ included (or hosted link + screenshot)
- [ ] artifacts/demo.mp4 included (60-90 sec, narrated: suite + report + one Part 2 assertion explained)
- [ ] Commit history shows how the work evolved
