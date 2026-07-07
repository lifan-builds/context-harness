# Judge Prompt: nitan-pod__next-step__progressive-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Fixed and verified recent GitHub Actions weekly podcast failures.
- must mention: Decide separately whether to commit the context-harness refresh files.
- must mention: Run node scripts/context-index.js check.
- must mention: next step
- must mention: constraints
- must mention: verification
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
- progressive card expected: ctx-now-now
- progressive card expected: ctx-context-operating-constraints
- progressive card expected: ctx-context-workflow
