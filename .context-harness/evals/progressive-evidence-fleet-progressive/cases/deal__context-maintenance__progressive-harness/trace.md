Evidence notes for eval case `deal__context-maintenance__progressive-harness`.

Files/commands used, in order:
1. Read `prompt.md`.
2. Listed `repo/` root to confirm project files.
3. Read root `NOW.md` first.
4. Read concise root `CONTEXT.md` as always-read context.
5. Ran from `repo/`: `node scripts/context-index.js hydrate "update context after completed task"`.
   - Hydrate selected cards: `ctx-now-now`, `ctx-context-operating-constraints`, `ctx-plan-archive`, `ctx-plan-decisions`, `ctx-plan-findings`, `ctx-plan-goal`, `ctx-plan-progress`.
6. Read selected cards from `.context-harness/cards/` before opening raw `PLAN.md`.
7. Read root `PLAN.md`; key evidence was completed progress line: stale/out-of-stock parser fixes landed; next step is scrape verification.
8. Read root `AGENTS.md`; routing contract says durable facts/corrections to `CONTEXT.md`, task-local findings/decisions to `PLAN.md`, session state to `NOW.md`, and run `node scripts/context-index.js update` after `CONTEXT.md` edits.
9. Read `package.json` only to confirm Node engine/private metadata.
10. Ran read-only `rg`/`find` commands to locate nested context and stock/freshness code.
11. Read nested `aggregator/NOW.md`, `aggregator/AGENTS.md`, `aggregator/CONTEXT.md`, and `aggregator/PLANS.md`.
12. Read snippets from `aggregator/aggregator/browser.py`, `aggregator/aggregator/parsers/sacredride.py`, and `aggregator/aggregator/db.py` for stock-status and stale-result behavior.
13. Checked nested aggregator harness availability; found `aggregator/AGENTS.md` references `.context-harness/index.json`, but no `aggregator/.context-harness/` directory was found.

Save/update routing I would perform:
- `NOW.md`: update current focus, blockers, immediate next step, and files touched for the completed parser-fix task and pending/completed verification.
- `PLAN.md`: record verification outcome for the 2026-04-26 stale/out-of-stock parser-fix item; add task-local findings only if verification reveals a store-specific surprise.
- `CONTEXT.md`: do not update for mere task completion. Add/update `Learned Patterns` only for a durable stock/freshness invariant not already covered by existing constraints. If changed, run `node scripts/context-index.js update`.
- `aggregator/PLANS.md`: optionally mirror subproject outcome if nested plans remain authoritative; first resolve stale nested context/index issue.

Verification I would run outside this read-only eval:
- `python -m pytest aggregator/tests/ -x -q`
- From `aggregator/`: `python -m aggregator.cli scrape` or `snow-deals-agg refresh`
- Spot-check Level Nine, MEC, Sacred Ride out-of-stock exclusion and latest-per-store freshness behavior.

No `expected.json`, `score.json`, run `manifest.json`, or eval reports were read. No files inside `repo/` were modified.