// Promptfoo javascript-assertion entrypoint. Each fixture in
// promptfooconfig.yaml declares an `expectPass` label (this is a real answer
// vs. a deliberately bad one); this asserts that answer-quality.js classifies
// it correctly, so the suite proves the checker discriminates good from bad
// rather than just asserting it "ran".
const { assessAnswer } = require('./answer-quality');

module.exports = function (output, context) {
  const expected = context.vars.expectPass === true || context.vars.expectPass === 'true';
  const { pass: actual, reasons } = assessAnswer(output);
  const matches = actual === expected;
  const label = (v) => (v ? 'PASS' : 'FAIL');
  const detail = reasons.length ? ` (${reasons.join('; ')})` : '';

  return {
    pass: matches,
    score: matches ? 1 : 0,
    reason: matches
      ? `checker correctly returned ${label(actual)}${detail}`
      : `checker misclassified: expected ${label(expected)}, got ${label(actual)}${detail}`,
  };
};
