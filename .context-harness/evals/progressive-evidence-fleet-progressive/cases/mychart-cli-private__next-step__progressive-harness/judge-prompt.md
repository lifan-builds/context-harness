# Judge Prompt: mychart-cli-private__next-step__progressive-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Auditing whether mychart-cli can be made public.
- must mention: Choose a release path: sanitized no-history public snapshot, or full history rewrite plus verification before changing GitHub visibility.
- must mention: Audit checked tracked files, ignored local sensitive paths, Git history
- must mention: next step
- must mention: constraints
- must mention: verification
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
- progressive card expected: ctx-now-now
- progressive card expected: ctx-context-operating-constraints
- progressive card expected: ctx-context-workflow
