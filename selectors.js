// Single source for the Tailwind selectors that distinguish chat-message
// sides. The app exposes no test id on messages, so this is the one brittle
// point in the whole repo: tests/locators.ts and scripts/capture-response.js
// both import from here. If the markup changes, this is the only file to fix.
module.exports = {
  AGENT_MESSAGE_SELECTOR: 'div.flex.justify-start',
  USER_MESSAGE_SELECTOR: 'div.flex.justify-end',
};
