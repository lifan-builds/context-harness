Evidence/trace notes:

- Read prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/hoa-assessment-challenge__context-maintenance__progressive-harness/prompt.md`.
- Read first: `repo/NOW.md`. Key evidence: active focus is post-board-exit HOA roofing/lender context; Building 17 correction; VIS lender-packet limitation; likely second-assessment risk; Basecamp unavailable; NOW has schema v2 drift.
- Read always-read layer: `repo/CONTEXT.md`. Key evidence: schema v3; privacy/legal constraints; Gmail/AppFolio default workflow; durable HOA state, construction/budget facts, communication guidance, ambiguities, learned patterns.
- Ran hydrate before opening PLAN/cards: `cd repo && node scripts/context-index.js hydrate "update context after completed task"`.
  - Hydrate selected: `ctx-now-now`, `ctx-plan-archive`, `ctx-plan-progress`, `ctx-context-language`, `ctx-context-operating-constraints`, `ctx-context-workflow`, `ctx-plan-decisions`.
- Read `repo/AGENTS.md`. Key evidence: schema v3 Context Contract; durable lessons to `CONTEXT.md`; task-local findings/decisions to `PLAN.md`; update `NOW.md` before ending; run `node scripts/context-index.js update` after `CONTEXT.md` edits.
- Read selected cards:
  - `repo/.context-harness/cards/ctx-plan-progress.md`
  - `repo/.context-harness/cards/ctx-plan-archive.md`
  - `repo/.context-harness/cards/ctx-plan-decisions.md`
  - `repo/.context-harness/cards/ctx-context-operating-constraints.md`
  - `repo/.context-harness/cards/ctx-context-workflow.md`
- Read raw `repo/PLAN.md` only after hydrate/cards. Key evidence: progress includes June 26 AppFolio/J2 update, Building 17 correction, late-June second-assessment/lender risk; open follow-ups remain lender language, board/counsel/J2 clarity, Building 17 status, Gmail-only pulls, cost clarification, annual meeting outcome.
- Ran read-only checks:
  - `cd repo && node scripts/context-index.js check` -> failed: `FAIL AGENTS.md Context Index is stale; run node scripts/context-index.js update`.
  - `cd repo && git diff --check -- AGENTS.md CONTEXT.md NOW.md PLAN.md README.md project/archive/communication_logs.md project/archive/timeline.md` -> no output.

Save/update routing I would perform after the completed task:
- `NOW.md`: end-of-session focus/blockers/next step/touched files.
- `PLAN.md`: completed-task progress, task-local findings/decisions, remaining follow-ups.
- `CONTEXT.md`: only concise durable facts/constraints/terms/learned patterns; no raw private communications.
- `project/archive/communication_logs.md` and `project/archive/timeline.md`: summary-only entries only for material new communications/milestones.
- Generated context index/cards/`AGENTS.md`: refresh via `node scripts/context-index.js update`, then verify with `node scripts/context-index.js check`.
- Verification: `git diff --check -- AGENTS.md CONTEXT.md NOW.md PLAN.md README.md project/archive/communication_logs.md project/archive/timeline.md`; architecture test only if architecture/workflow files changed.