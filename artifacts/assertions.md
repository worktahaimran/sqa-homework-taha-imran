# Assertions

## What we assert (Part 2, `tests/chat.spec.ts`)

- Non-empty, sane length, 40-2000 chars — `chat.spec.ts:20-23`. Catches a bubble
  that never rendered, or a truncated/runaway reply.
- Not an apology/refusal/error string — `chat.spec.ts:25`, pattern at
  `chat.spec.ts:8-9`. Catches the agent bailing out instead of answering.
- Mentions ≥3 of 7 domain keywords — `chat.spec.ts:29-30`. One below the
  weakest reference answer in the brief (4/7 hits) — margin without being
  toothless.
- The user's question echoes in the transcript — `chat.spec.ts:34-35`. Catches
  a response rendered against the wrong turn.
- Same shape repeated for the free-text question — `chat.spec.ts:45-51`.

## What we deliberately don't assert

- Exact response text — non-deterministic app; a fixed string is either
  always-flaky or a no-op regex hiding regressions.
- Latency/streaming duration — only the state transition is asserted
  (`waitForAgentResponse`), never how long it takes.
- Tone, grammar, citation accuracy — out of scope for a smoke suite.

## Promptfoo: deterministic check, not an LLM grader

No ANTHROPIC_API_KEY/OPENAI_API_KEY is available here, so an `llm-rubric`
grader wouldn't be reproducible or runnable without a key. Instead
`promptfooconfig.yaml` uses an `echo` provider (no generation) plus a
`javascript` assertion (`expect-quality.js` → `answer-quality.js`): regexes
checking for (a) a clause defining Permission (`Permission(.ai)
is/acts as/helps you/...`) and (b) hedging/deflection/refusal language. Zero
network calls, zero API key, deterministic, runs in milliseconds.

It runs 6 fixtures: the live-captured answer (refreshed each run by
`scripts/capture-response.js`), the two reference answers from the brief, and
three adversarial fixtures authored to fail for different reasons —
keyword-stuffed with no real definition, a deflection dressed as an answer,
an explicit refusal. This catches what the keyword-count assertion above
cannot: a reply that name-drops every domain noun but never says what
Permission is, or a hedge that would pass on length and keywords alone.
