Reviewed on desktop (Chrome, macOS) and mobile (Chrome responsive mode, iPhone 14 / 390px), signed out and after creating an account.

Pre-login is one screen: agent header, six suggested topics, ASK input. It's clean and the streaming response is fast. Post-signup is a different product, with a sidebar for Permission Agent, Data Enrichment Hub, Redeem, Referrals, Wallet and Account Settings. The topics are gone, replaced by an interests picker. Signup itself is five steps: email, password, email verification (link expires in an hour), then a form asking legal name, country, phone, birthday and gender. The 100 ASK arrives after that form, not at account creation.

1. New visitors see no suggested topics

On a first visit the page renders a greeting bubble and no topics. Reloading shows all six. Confirmed in a normal window and incognito. The topics are the entry point, and the person who most needs them is the one who never sees them. Render them with the greeting on first paint rather than after a state that only a reload produces.

2. The interests picker is clipped inside the agent

In the agent, the picker cuts off mid-item, showing the top half of "Food", and Continue is greyed out with no indication that 16 options exist or that a selection is required. The same picker on Redeem and Data Enrichment Hub renders all 16 in a clean grid. The fix already exists in the product; reuse that layout in the agent.

3. The same question is asked in three places

"What are you most interested in?" appears in the agent, on Redeem, and on Data Enrichment Hub. Answer it once and you're asked twice more, which makes it look like nothing was saved. Ask once, store it, and have the other surfaces show the saved answer with an edit option.

4. "Great Start!" over a 4,900 ASK shortfall

The wallet shows 100 ASK, a 5,000 minimum to withdraw, and the message "Great Start! You have collected 2%." A new user learns on day one that the promised payout is 49x away. Set the expectation before signup, or lead with a nearer milestone.

5. Mobile clipping

At 390px the sixth topic is cut off at the fold, and the cookie badge sits on top of the footer text. Both are small; both are the first impression on a phone.