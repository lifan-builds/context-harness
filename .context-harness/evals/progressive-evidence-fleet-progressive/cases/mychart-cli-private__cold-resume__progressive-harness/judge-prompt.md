# Judge Prompt: mychart-cli-private__cold-resume__progressive-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Auditing whether mychart-cli can be made public.
- must mention: Choose a release path: sanitized no-history public snapshot, or full history rewrite plus verification before changing GitHub visibility.
- must mention: Audit checked tracked files, ignored local sensitive paths, Git history
- must mention: current understanding
- must mention: active blockers
- must mention: immediate next step
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
- progressive card expected: ctx-now-now
- progressive card expected: ctx-context-workflow
