# Trace

1. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/prompt.md` to get the eval instructions, repo copy, output paths, and required answer shape.
2. Loaded the `context-harness` skill instructions to follow the progressive context workflow.
3. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/repo/NOW.md` first, per the eval.
4. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/repo/CONTEXT.md` as the always-read project layer.
5. Ran hydrate before PLAN/chunks: `cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/repo" && node scripts/context-index.js hydrate "update context after completed task"`.
   - Hydrate selected cards: `ctx-plan-progress`, `ctx-plan-verification`, `ctx-context-language`, `ctx-now-now`, `ctx-plan-follow-ups`, `ctx-context-flagged-ambiguities`, `ctx-context-operating-constraints`.
   - Hydrate noted raw sources were deferred and listed `PLAN.md#progress` and `PLAN.md#verification` chunks as raw detail on demand.
6. Read selected cards before opening raw chunks:
   - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/repo/.context-harness/cards/ctx-plan-progress.md`
   - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/repo/.context-harness/cards/ctx-plan-verification.md`
   - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/repo/.context-harness/cards/ctx-plan-follow-ups.md`
   - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/repo/.context-harness/cards/ctx-context-operating-constraints.md`
   - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/repo/.context-harness/cards/ctx-context-flagged-ambiguities.md`
   - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/repo/.context-harness/cards/ctx-context-language.md`
   - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/repo/.context-harness/cards/ctx-now-now.md`
7. Opened selected raw chunks because card facts were truncated and the answer needed concrete completed-task and verification detail:
   - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/repo/.context-harness/chunks/ctx-plan-progress.md`
   - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/repo/.context-harness/chunks/ctx-plan-verification.md`
8. Ran read-only repo inspection commands:
   - `git -C "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/repo" status --short`
   - `git -C "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/repo" diff --stat`
   - Note: output was parent-worktree-relative, so it was not used as authoritative evidence for the eval repo task state.
9. Read existing `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/result.md` and `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/trace.md` placeholders before overwriting.
10. Wrote `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/result.md` with the final eval answer.
11. Wrote this `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__progressive-harness/trace.md` file.
