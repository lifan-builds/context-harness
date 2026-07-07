# Judge Prompt: baby__context-maintenance__progressive-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Felix remains in a 2026-07-04/06 SCH ED/PICU surgical readmission after hematochezia and high-grade bowel obstruction from ileocolic intussusception with ischemic terminal ileum...
- must mention: Pull/review the next MyChart update for the ongoing SCH PICU/surgery admission, then update growth/medical.md, growth/feeding.md, growth/formula-history.md, growth/episode-patte...
- must mention: Felix remains in a 2026-07-04/06 SCH ED/PICU surgical readmission after hematochezia and high-grade bowel obstruction from ileocolic intu...
- must mention: NOW.md
- must mention: PLAN.md
- must mention: CONTEXT.md
- must mention: context-index.js update
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
- progressive card expected: ctx-now-now
- progressive card expected: ctx-context-operating-constraints
