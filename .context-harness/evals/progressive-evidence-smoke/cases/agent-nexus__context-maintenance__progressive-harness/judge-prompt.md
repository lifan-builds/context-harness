# Judge Prompt: agent-nexus__context-maintenance__progressive-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Agent Nexus release changes are ready to push after public Context Harness deployment.
- must mention: Push Agent Nexus release changes, then restart AI IDEs or agent hosts if updated skill metadata is not visible.
- must mention: Test: nexus doctor
- must mention: NOW.md
- must mention: PLAN.md
- must mention: CONTEXT.md
- must mention: context-index.js update
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
- progressive card expected: ctx-now-now
- progressive card expected: ctx-context-operating-constraints
