# Judge Prompt: context-harness__next-step__progressive-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: The prioritized eval gaps are addressed in the working tree: harness drift is treated as a follow-up, eval scoring avoids key lexical false positives, and context cleanup guidan...
- must mention: Review the focused gap-fix diff, then run any desired follow-up real-world eval batch before commit/push and local deployment.
- must mention: Test: tests/run-all.sh
- must mention: next step
- must mention: verification
- must mention: Keep context-harness lightweight; do not turn it into a large process framework.
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
- progressive card expected: ctx-now-now
- progressive card expected: ctx-context-operating-constraints
- progressive card expected: ctx-context-workflow
