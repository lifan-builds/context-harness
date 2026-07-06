# Judge Prompt: flyingpig__cold-resume__no-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Implemented source changes so Flying Pig can use a Claude-Code-style Auto-Connect Existing Chrome path through a helper-owned Chrome DevTools MCP bridge. The dashboard now has A...
- must mention: Rebuild/repackage or run the source helper/app, then verify from the actual UI: open Chrome, visit chrome://inspect/#remote-debugging, allow remote debugging, click Auto-Connect...
- must mention: Run product app: npm run desktop:dev
- must mention: current focus
- must mention: active blockers
- must mention: immediate next step
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
