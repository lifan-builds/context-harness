# Judge Prompt: snow-plan__cold-resume__progressive-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Flight tracking automation is stopped; future ski-air pricing will be searched manually using the documented seed fares and helper scripts.
- must mention: Manually re-check Alaska-affiliated cash and award options for SEA-SLC/HDN/DEN/JAC/YYC when ready to book 2-4 night Jan-Mar 2027 ski trips.
- must mention: current understanding
- must mention: active blockers
- must mention: immediate next step
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
- progressive card expected: ctx-now-now
- progressive card expected: ctx-context-workflow
