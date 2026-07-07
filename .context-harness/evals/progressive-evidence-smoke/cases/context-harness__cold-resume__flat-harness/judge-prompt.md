# Judge Prompt: context-harness__cold-resume__flat-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Legacy migration/eval/ADR tooling has been removed from context-harness now that the local project fleet is on current schema v3 with Operating Constraints.
- must mention: Review the cleanup diff, then commit/push and redeploy with Agent Nexus if accepted.
- must mention: Test: tests/run-all.sh
- must mention: current focus
- must mention: active blockers
- must mention: immediate next step
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
