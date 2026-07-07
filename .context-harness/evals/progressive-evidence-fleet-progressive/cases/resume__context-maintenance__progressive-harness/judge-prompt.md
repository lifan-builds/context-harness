# Judge Prompt: resume__context-maintenance__progressive-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: OpenAI interview preparation for the applied Senior Software Engineer, Infrastructure role in Bellevue, WA, likely Statsig infrastructure inside OpenAI.
- must mention: Use interview-prep/openai-recruiter-round-statsig-infrastructure.md as the primary recruiter-screen guide. If continuing prep, rehearse the 30-second pitch, Why OpenAI, Why Stat...
- must mention: NOW.md
- must mention: PLAN.md
- must mention: CONTEXT.md
- must mention: context-index.js update
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
- progressive card expected: ctx-now-now
- progressive card expected: ctx-context-operating-constraints
