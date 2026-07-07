# Trace Notes

- Eval prompt read: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/nitan-pod__cold-resume__progressive-harness/prompt.md`.
- Worked from case repo only for project evidence: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/nitan-pod__cold-resume__progressive-harness/repo`.
- Read order:
  1. `repo/NOW.md` first.
  2. `repo/AGENTS.md` for Context Contract and Context Index.
  3. `repo/CONTEXT.md` for concise project/constraints/workflow context.
- Hydrate commands used from case repo:
  - `node scripts/context-index.js hydrate "resume current task"`
    - selected cards: `ctx-context-context-contract`, `ctx-now-now`.
  - `node scripts/context-index.js hydrate "weekly workflow GitHub Actions failure current focus verification"`
    - selected cards: `ctx-plan-current-focus`, `ctx-now-now`, `ctx-context-development-workflow`, `ctx-context-workflow`, `ctx-plan-active-blockers`, `ctx-plan-session-state`, `ctx-plan-verification`.
- Cards read:
  - `.context-harness/cards/ctx-context-context-contract.md`
  - `.context-harness/cards/ctx-now-now.md`
  - `.context-harness/cards/ctx-plan-current-focus.md`
  - `.context-harness/cards/ctx-plan-active-blockers.md`
  - `.context-harness/cards/ctx-plan-verification.md`
  - `.context-harness/cards/ctx-context-workflow.md`
  - `.context-harness/cards/ctx-context-development-workflow.md`
  - `.context-harness/cards/ctx-plan-session-state.md`
- Raw task-specific context opened after hydrate/cards:
  - `repo/PLAN.md`
- Inspection commands:
  - `node scripts/context-index.js check` from case repo: failed with `FAIL AGENTS.md Context Index is stale; run node scripts/context-index.js update`.
  - `ls -la <case repo>` to confirm top-level project files.
- Save/update routing I would perform outside this read-only eval:
  - Do not update `repo/` during this eval.
  - If maintaining context for the real repo, run `node scripts/context-index.js update`, then `node scripts/context-index.js check`, and decide whether to commit the context-harness refresh files.
