# Judge Prompt: flyingpig__cold-resume__no-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Implemented and verified a minimal MCP-native existing-Chrome backend. Flying Pig can now Auto-Connect to an existing Chrome tab through Chrome DevTools MCP and run a minimal su...
- must mention: If continuing implementation, run a source dashboard/manual smoke against a local mock page using Auto-Connect Existing Chrome and start a harmless MCP task from the UI. If prep...
- must mention: Run product app: npm run desktop:dev
- must mention: current focus
- must mention: active blockers
- must mention: immediate next step
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
