# Judge Prompt: agent-nexus__cold-resume__flat-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Agent Nexus release changes are ready to push after public Context Harness deployment.
- must mention: Push Agent Nexus release changes, then restart AI IDEs or agent hosts if updated skill metadata is not visible.
- must mention: Test: nexus doctor
- must mention: current focus
- must mention: active blockers
- must mention: immediate next step
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
