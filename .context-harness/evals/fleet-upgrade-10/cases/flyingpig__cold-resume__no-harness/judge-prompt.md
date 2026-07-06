# Judge Prompt: flyingpig__cold-resume__no-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Implemented and minimally live-smoked Flying Pig's Claude-Code-style Auto-Connect Existing Chrome path through a helper-owned Chrome DevTools MCP bridge. The helper starts npx -...
- must mention: If the goal is full agent execution inside the existing normal Chrome tab without a CDP URL, implement an MCP-native browser backend or adapter for the subset of browser-use act...
- must mention: Run product app: npm run desktop:dev
- must mention: current focus
- must mention: active blockers
- must mention: immediate next step
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
