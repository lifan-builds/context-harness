# Trace Notes

- Read eval prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/hoa-assessment-challenge__next-step__progressive-harness/prompt.md`.
- Used repo root: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/hoa-assessment-challenge__next-step__progressive-harness/repo`.
- Read `NOW.md` first. Key evidence: Lifan has exited board; Basecamp unavailable; VIS will not provide lender-facing underwriting packet; second assessment likely but not adopted; Building 17 correction; June 26 look-ahead excludes Building 17.
- Checked `CONTEXT.md` size with `wc -l`; 102 lines, so read directly. Key evidence: privacy/legal constraints, Gmail-only default, verification commands, lender/refi terminology, current HOA state, budget/construction facts, communication guidance.
- Ran hydrate before PLAN/chunks: `cd <repo> && node scripts/context-index.js hydrate "plan next implementation step"`.
- Hydrate selected cards: `ctx-plan-archive`, `ctx-plan-decisions`, `ctx-plan-progress`, `ctx-plan-findings`, `ctx-plan-goal`, `ctx-now-now`, `ctx-context-operating-constraints`.
- Opened selected cards: `.context-harness/cards/ctx-plan-goal.md`, `ctx-plan-findings.md`, `ctx-plan-progress.md`, `ctx-plan-decisions.md`, `ctx-now-now.md`, `ctx-context-operating-constraints.md`.
- Opened raw selected chunks only after card summaries were insufficient for concrete next-step planning: `.context-harness/chunks/ctx-plan-findings.md`, `.context-harness/chunks/ctx-plan-progress.md`.
- Ran read-only harness check: `cd <repo> && node scripts/context-index.js check`; result failed: `AGENTS.md Context Index is stale; run node scripts/context-index.js update`. Logged as follow-up, not fixed due read-only eval.
- Did not read `expected.json`, `score.json` contents, manifest, or eval reports. Did not modify files inside `repo/`.

Save/update routing for a real session:
- Drafts: `project/archive/drafts/` only, for user review before sending/posting.
- Context after action: update `NOW.md` and `PLAN.md` open tasks/progress.
- Durable history: add summary-only implications to `project/archive/communication_logs.md` and, if milestone-worthy, `project/archive/timeline.md`.
- Harness maintenance: after read-only constraints lift, run `node scripts/context-index.js update` then `node scripts/context-index.js check` before relying on `AGENTS.md` Context Index.