# Judge Prompt: flyingpig__cold-resume__no-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Investigated the installed/local packaged Flying Pig desktop app work-window connection failure. The helper is healthy, but Open Work Window is blocked by a CDP loopback/port co...
- must mention: Fix the dashboard/helper CDP launch/status path: use an app-owned alternate CDP port or honor FLYINGPIGCDPPORT, preserve the requested CDP host, and report port ownership confli...
- must mention: Run product app: npm run desktop:dev
- must mention: current focus
- must mention: active blockers
- must mention: immediate next step
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
