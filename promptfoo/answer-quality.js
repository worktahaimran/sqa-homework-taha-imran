// Deterministic structural checker for an agent's "What is Permission" answer.
// Exists to catch failure modes a keyword-presence check (tests/chat.spec.ts)
// cannot: a reply that name-drops every domain noun without ever defining the
// product, a deflection that talks around the question, or a refusal dressed
// up as an answer. No network calls, no API key -- pure regex, runs instantly.

// Requires "Permission"/"Permission.ai" to be the subject of a defining verb
// within a short span, e.g. "Permission.ai acts as your data broker" or
// "Permission is a platform that...". Catches: answers that mention every
// domain keyword (data, earn, wallet, broker, ...) but never actually say
// what Permission is or does -- keyword-stuffed non-answers.
const DEFINITIONAL =
  /\bpermission(\.ai)?\b[^.?!]{0,40}\b(is|are|acts as|helps you|provides|works as)\b/i;

// Catches: hedging, "great question" stalling, asking the user to clarify
// instead of answering, or an explicit "I can't/won't/am unable to" refusal
// -- including one wrapped in a sentence that otherwise reads like an answer
// (e.g. "Permission is best understood once you clarify what you mean...").
const HEDGING =
  /\b(great question|i'?m not sure|i don'?t know|it depends|could you (clarify|specify|tell me more)|what (would you like|specifically)|can you (clarify|be more specific)|i'?m (just|only) an ai|i (can'?t|cannot|won'?t|am unable to) (share|discuss|answer|help with|summarize))\b/i;

function assessAnswer(text) {
  const t = (text || '').trim();
  const reasons = [];

  if (t.length < 40) reasons.push('too short to contain a real definition');
  if (!DEFINITIONAL.test(t)) reasons.push('no clause defining what Permission is/does');
  if (HEDGING.test(t)) reasons.push('hedges, deflects, or refuses instead of answering');

  return { pass: reasons.length === 0, reasons };
}

module.exports = { assessAnswer };
