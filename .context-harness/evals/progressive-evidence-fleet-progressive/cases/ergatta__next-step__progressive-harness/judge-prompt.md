# Judge Prompt: ergatta__next-step__progressive-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Track 7 on-device work (catalog restored). Pulse gameplay bug is fixed. Classes cache audit completed: no local experience=9 class catalog rows/history/media are present in curr...
- must mention: Resume Program Start investigation: GET /workoutprograms/{id} detail endpoint still returns 403 and is currently passed through to avoid JSON crashes.
- must mention: This is a research project, not a code project — there is no test suite or
- must mention: next step
- must mention: constraints
- must mention: verification
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
- progressive card expected: ctx-now-now
- progressive card expected: ctx-context-operating-constraints
- progressive card expected: ctx-context-workflow
