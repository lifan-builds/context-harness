# Trace notes

- Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/credit-card-tracker__context-maintenance__progressive-harness/prompt.md`.
- Listed the case repo root to confirm available files.
- Read `repo/NOW.md` first.
- Checked `repo/CONTEXT.md` size/headings; read selected always-read sections (`Project`, `Structure`, `Operating Constraints`, `Workflow`, `Language`, `Relationships`, `Learned Patterns`, `Context Contract`) and `Recent Updates` instead of the whole large file.
- Ran the required hydrate command from the eval repo root: `cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/credit-card-tracker__context-maintenance__progressive-harness/repo && node scripts/context-index.js hydrate "update context after completed task"`.
- Repo hydrate selected cards: `ctx-context-recent-updates`, `ctx-plan-progress`, `ctx-plan-progress-1`, `ctx-plan-punted-ideas`, `ctx-now-now`, `ctx-plan-recommended-plan`, `ctx-context-learned-patterns`.
- Opened selected cards before raw plan context: `ctx-context-recent-updates`, `ctx-plan-progress`, `ctx-plan-progress-1`, `ctx-now-now`, `ctx-plan-recommended-plan`, `ctx-context-learned-patterns`.
- Opened `repo/PLAN.md` after hydrate/cards to confirm active/completed slices and plan-local progress.
- Read `repo/package.json` scripts to confirm verification commands.
- Routing concluded: update `NOW.md` for current handoff, `PLAN.md` for completed redesign progress/decisions/verification, `CONTEXT.md` only for durable PWA caching/schema/recent-update facts, then run `node scripts/context-index.js update` to regenerate cards/index.
- Verification recommended: context index update plus `git diff --check` for context files; for redesign pre-commit/deploy rerun `npm run check:public-db`, `npx tsc --noEmit --pretty false`, `npm test -- --runInBand`, `npx next build`, `git diff --check`, and browser smoke checks.
- Note: an initial hydrate/status attempt outside the eval repo was not used as project evidence; the repo-scoped hydrate output above is the evidence used.
