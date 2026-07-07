Evidence notes for wishlist__context-maintenance__progressive-harness

- Read prompt.md in the case directory.
- Read repo/NOW.md first. Key evidence: Codex target runner, Tesla Model Y ski rack/cargo-box monitor smoke completed, query generation fixed, no execution blocker, next step is role/component metadata for set/basket tracking, verification listed as npm run build/typecheck/test, touched files/artifacts listed.
- Read repo/CONTEXT.md as the baseline context layer. Key evidence: Codex is target runner; monitor init/plan/ingest/report workflow; Google Shopping/Search-first discovery; source validation; component/basket concepts; durable monitor lessons including current lack of role-preserving basket aggregation from search results.
- Ran correct hydrate command from eval repo root: `node scripts/context-index.js hydrate "update context after completed task"`.
  - Hydrate output selected: ctx-plan-completed, ctx-now-now, ctx-context-operating-constraints, ctx-context-workflow, ctx-plan-active-task, ctx-plan-archive, ctx-plan-blockers.
  - Used hydrate output to avoid opening raw PLAN.md/chunks; raw detail not needed.
- Opened cards used for focused evidence:
  - .context-harness/cards/ctx-plan-completed.md: older completed work summary, evidence that PLAN completed section may be stale.
  - .context-harness/cards/ctx-now-now.md: current Codex monitor smoke, query-generation fix, blocker/gap.
  - .context-harness/cards/ctx-context-operating-constraints.md: safety and evidence constraints.
  - .context-harness/cards/ctx-context-workflow.md: build/test workflow.
  - .context-harness/cards/ctx-plan-active-task.md: MVP CLI/library active task.
  - .context-harness/cards/ctx-plan-blockers.md: no blocker.
  - .context-harness/cards/ctx-plan-current-focus.md: monitor workflow current focus.
  - .context-harness/cards/ctx-plan-next-step.md: older next step, evidence of mismatch with NOW.md.
  - .context-harness/cards/ctx-plan-touched-files.md: touched-file routing evidence.
  - .context-harness/cards/ctx-plan-verification.md: npm run typecheck, npm run build, npm test.
- Read repo/AGENTS.md. Routing rule evidence: durable terms/invariants/workflows to CONTEXT.md; task-local findings and decisions to PLAN.md; before ending update NOW.md; after CONTEXT.md update run `node scripts/context-index.js update`.
- Read-only command also used: `find .context-harness/cards -maxdepth 1 -type f -name '*.md' | sort` to identify available focused cards.
- A read-only `git status --short` from inside the nested eval repo resolved to the outer repository and was not used for task conclusions.

Save/update routing I would perform:
- NOW.md: current focus, blockers, next step, verification status, touched files/artifacts for the just-completed monitor smoke and query fix.
- PLAN.md: task-local current focus/progress/completed work/findings/blockers/next step/touched files/verification; reconcile stale completed and next-step cards with NOW.md.
- CONTEXT.md: only durable lessons/workflow/language/relationship changes, especially Codex-native monitor ingestion/search-results expectations, query-generation invariant, and component-role/basket aggregation limitation if not already captured.
- Generated context index/cards/chunks: regenerate with `node scripts/context-index.js update`; do not hand-edit generated cards.
- AGENTS.md: no update unless the context contract changes.

Verification to run after context edits:
- `node scripts/context-index.js update`
- `node scripts/context-index.js hydrate "update context after completed task"`
- Confirm hydrate returns fresh NOW/PLAN cards with monitor smoke, query fix, no blocker, verification, and basket-aggregation next step.
- For the underlying code task, keep/rerun `npm run build`, `npm run typecheck`, and `npm test`.