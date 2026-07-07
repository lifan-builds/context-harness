# Current understanding

FreshPowder (`snow-deal`) is a ski/snowboard deal aggregator. The primary product is the FastAPI/htmx web app in `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/aggregator`, backed by SQLite deal data and Turso auth/session/event data, with scraping on a 6-hour GitHub Actions cron.

`NOW.md` says there is no active in-progress task: current focus is `(none)`, blockers are `None`, and the immediate next step is to pick a task or review `PLAN.md`. `PLAN.md` gives the standing project focus as launch and growth: seed 100 users, measure viral coefficient, monitor analytics/feedback, implement a viral invite loop, join affiliate programs, replace retailer links with affiliate links, and run social/content growth experiments.

# Active blockers or uncertainty

- No active blocker is recorded in `NOW.md`.
- Minor context drift/uncertainty: `CONTEXT.md` says the repo is public as of 2026-05-17, while `PLAN.md` still says the repo is private. Treat `CONTEXT.md` as newer durable guidance unless confirmed otherwise.
- Minor harness note: `CONTEXT.md` and `AGENTS.md` have `context-harness:schema v3`; `NOW.md` is non-empty but does not show a schema marker. This does not block the read-only catch-up.
- `git status` from inside the eval repo copy reflected the surrounding parent git worktree/eval harness, not a clean standalone project status, because the repo copy is nested inside `/Users/lfan/Project/context-harness`.

# Immediate next step

Pick a concrete growth task from `PLAN.md`. If choosing the highest-leverage product task, start with the viral invite loop: auto-generate 3 invite codes on signup and add a `/my-codes` page, while preserving invite-gated access and Turso-backed auth/session/event behavior.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/NOW.md` — current session state; no active task/blocker.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/CONTEXT.md` — durable project overview, constraints, workflows, and learned patterns.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/AGENTS.md` — context contract and generated context index.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/PLAN.md` — launch/growth plan and backlog.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/aggregator/aggregator/web/app.py` — FastAPI app factory.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/aggregator/aggregator/web/invite_routes.py` — invite/landing/waitlist routes likely relevant to viral invites.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/aggregator/aggregator/web/routes.py` — main deal routes.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/aggregator/aggregator/config.py` — stores, categories, keywords, model names, brand rules.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/aggregator/aggregator/scraper.py` — multi-store scraper orchestration.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/aggregator/tests` — primary test suite.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/.github/workflows/scrape.yml` — 6-hour cron scraper workflow.

# Verification command/check

Primary project verification from `CONTEXT.md`:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo && python -m pytest aggregator/tests/ -x -q
```

For scraper/parser work, also use the documented manual scrape check after categorization/selector validation:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/aggregator && python -m aggregator.cli scrape
```

# Context Evidence

1. Read eval prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/prompt.md`.
2. Attempted to read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/.context-harness/NOW.md`; it did not exist, so I located the actual root context files.
3. Loaded the `context-catch-up` skill instructions for the read-only eval workflow.
4. Ran read-only file discovery: `find /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo -maxdepth 4 ...`; found root `NOW.md`, `CONTEXT.md`, `AGENTS.md`, `PLAN.md`, and `scripts/context-index.js`.
5. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/NOW.md` first among actual context files.
6. Read concise `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/CONTEXT.md` directly.
7. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/AGENTS.md` for the Context Contract and Context Index.
8. Ran required hydrate command: `cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo && node scripts/context-index.js hydrate "resume current task"`.
9. Hydrate output selected card `ctx-now-now` (`NOW.md#now`), with `open: .context-harness/cards/ctx-now-now.md`.
10. Read selected card `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/.context-harness/cards/ctx-now-now.md` before opening PLAN.
11. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo/PLAN.md`.
12. Ran read-only structure check for key project files/tests/workflow under the eval repo copy.
13. Ran read-only structure check for web app route files under `aggregator/aggregator/web`.
14. Ran `git -C /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__cold-resume__progressive-harness/repo status --short`; noted it reflected the surrounding parent git worktree/eval harness rather than an isolated repo status.

# Confidence and why

Confidence: high for current focus/blockers/next step because `NOW.md`, selected hydrate card `ctx-now-now`, and `PLAN.md` all point to no active task plus a standing launch/growth plan. Confidence is medium-high overall because of the minor public/private repo-state conflict between `CONTEXT.md` and `PLAN.md`, and because the nested eval copy made `git status` noisy rather than a clean standalone status check.
