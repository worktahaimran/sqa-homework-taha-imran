No database access. Everything below is inferred from the signup flow and the agent's observable behaviour.

Sending a message. The pre-login agent answers without an account, so a conversation must be keyed by something anonymous, a session or device identifier, not a user id. I'd expect a conversations row per session and a messages row per turn: id, conversation_id, role (user/agent), body, created_at, plus latency and token counts on agent turns. Suggested topics look like seeded prompts, so messages likely carry a source column distinguishing a pill click from free text. If a session later signs up, those anonymous conversations need claiming, which is where orphans appear.

Creating an account. Signup is staged, and the writes are staged with it. users at email and password. An email verification token with a one-hour expiry, then a verified flag. A separate profiles row for legal name, country, phone, birthday, gender. The 100 ASK landed only after the profile form, not at account creation, so the reward is tied to profile completion: a wallet_transactions row of +100 with a reason, and a wallet_balances row that must equal the sum of its transactions.

Downstream pipeline check. Balance reconciliation. For every user, wallet_balances.amount must equal SUM(wallet_transactions.amount). Any drift means the ledger and the displayed number have diverged, which is the one thing a rewards product cannot get wrong. I'd run it on every load and alert on a non-empty result rather than letting it land silently in a dashboard.

sql
-- 1. Every agent turn belongs to a conversation, and every conversation has turns.
SELECT m.id, m.conversation_id
FROM messages m
LEFT JOIN conversations c ON c.id = m.conversation_id
WHERE c.id IS NULL

UNION ALL

SELECT NULL, c.id
FROM conversations c
LEFT JOIN messages m ON m.conversation_id = c.id
WHERE m.id IS NULL;

-- 2. The 100 ASK signup reward: exactly one per user, and only after the
-- profile is complete. Duplicates mean a replayable reward.
SELECT u.id,
       COUNT(t.id) AS reward_rows,
       p.completed_at,
       MIN(t.created_at) AS first_reward_at
FROM users u
LEFT JOIN profiles p ON p.user_id = u.id
LEFT JOIN wallet_transactions t
       ON t.user_id = u.id AND t.reason = 'signup_profile_complete'
GROUP BY u.id, p.completed_at
HAVING COUNT(t.id) <> 1
    OR p.completed_at IS NULL
    OR MIN(t.created_at) < p.completed_at;

-- 3. Displayed balance matches the ledger.
SELECT b.user_id, b.amount AS shown, COALESCE(SUM(t.amount), 0) AS ledger
FROM wallet_balances b
LEFT JOIN wallet_transactions t ON t.user_id = b.user_id
GROUP BY b.user_id, b.amount
HAVING b.amount <> COALESCE(SUM(t.amount), 0);