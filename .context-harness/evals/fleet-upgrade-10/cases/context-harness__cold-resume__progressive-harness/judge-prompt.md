# Judge Prompt: context-harness__cold-resume__progressive-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Operating Constraints replaced the project Rules/Never/Always taxonomy in the working tree, and the second 10-pair real-world eval shows progressive-harness improving all 10 pairs.
- must mention: Review the Operating Constraints diff, then decide whether to run the one-time fleet migration from legacy Rules/Never/Always to Operating Constraints before commit/push and loc...
- must mention: Test: tests/run-all.sh
- must mention: current focus
- must mention: active blockers
- must mention: immediate next step
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
- progressive card expected: ctx-now-now
- progressive card expected: ctx-context-workflow
