# Current understanding

- The repository at `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__progressive-harness/repo` is `flight-plan`, a private Python CLI for family travel operations: parsing `TIMELINE.md`, checking visa-duration constraints, querying Seats.aero award availability, and comparing cash fares.
- `NOW.md` says the current focus is complete context-harness v3 migration, with no recorded blockers, and the immediate harness instruction is to use the AGENTS.md Context Index before planning/editing.
- The project-level work item in `PLANS.md` is not the migration itself; the remaining product focus is implementing automated caching and cents-per-point evaluation for award tickets against cash fares.
- `ACTIVE_SEARCH.md` contains the active travel search: CFH return to China in spring 2026, SEA to PVG/SHA/HGH, preferably with a Japan stopover, between 2026-04-18 and 2026-05-10. Current next actions there are to evaluate point balances, check exact TYO -> PVG/HGH cash prices, and calculate c/p or isolate Business inventory.
- Existing code shape: `main.py` defines Click commands for timeline display, visa checks, Seats.aero connectivity, and Google Flights cash search; `seats_aero.py` wraps the Seats.aero Partner API; `google_flights.py` wraps `fast_flights`.

# Active blockers or uncertainty

- No active product blocker is recorded in `NOW.md`.
- Harness issue: the required command `node scripts/context-index.js hydrate "resume current task"` is not supported by this repo's `scripts/context-index.js`; it exits with usage for `[update|list|query|section|check]`. This looks like a stale prompt/index expectation and should be followed up, but it did not prevent read-only orientation.
- Harness issue: `node scripts/context-index.js check` fails with `FAIL AGENTS.md Context Index is stale; run \`node scripts/context-index.js update\`.` I did not run `update` because this eval is read-only.
- Harness/project naming mismatch: `AGENTS.md` refers to `PLAN.md`, but the repo has `PLANS.md`; `PLAN.md` is absent.
- Version uncertainty: `pyproject.toml` requires Python `>=3.13`, while `README.md` says Python 3.10+.

# Immediate next step

- For project work: implement or design the automated c/p evaluation and caching path, starting from `ACTIVE_SEARCH.md` and existing `main.py` commands. A concrete first coding step would be to add a CLI command that combines award search output with cash-fare data for the active SEA -> PVG/SHA/HGH or SEA -> TYO -> PVG/HGH routes, then reports whether Economy redemptions exceed the 1.5 c/p threshold or filters for Business inventory.
- For harness maintenance before future editing: update/fix the context index workflow so `AGENTS.md` is fresh and either restore `hydrate` support or update the instructions to the supported `list/query/section/check` commands.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__progressive-harness/repo/NOW.md` — current focus, blockers, next step.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__progressive-harness/repo/AGENTS.md` — context contract and generated Context Index, currently stale per check.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__progressive-harness/repo/CONTEXT.md` — durable project overview, rules, workflow, architecture, and booking principles.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__progressive-harness/repo/PLANS.md` — living execution plan; identifies remaining c/p caching/evaluation work.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__progressive-harness/repo/ACTIVE_SEARCH.md` — active CFH spring 2026 search and concrete next travel-planning actions.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__progressive-harness/repo/TIMELINE.md` — family schedule and visa timeline parsed by the CLI.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__progressive-harness/repo/main.py` — Click CLI entry point.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__progressive-harness/repo/seats_aero.py` — Seats.aero Partner API wrapper; uses `destination_airport`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__progressive-harness/repo/google_flights.py` — cash fare search wrapper.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__progressive-harness/repo/pyproject.toml` — Python/dependency definition.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__progressive-harness/repo/scripts/context-index.js` — context index tool; lacks `hydrate` command.

# Verification command/check

- Harness check observed in this read-only pass: `node scripts/context-index.js check` currently fails because `AGENTS.md` Context Index is stale.
- After harness maintenance, verify with: `node scripts/context-index.js update && node scripts/context-index.js check`.
- For baseline CLI behavior, verify locally from the repo root with: `uv run main.py get-timeline && uv run main.py visa-check`.
- For API/cash-search behavior, with `SEATS_AERO_API_KEY` configured, verify with: `uv run main.py check-flights` and `uv run main.py search-cash SEA PVG 2026-04-20`.

# Confidence and why

- Confidence: medium-high.
- Why: I followed the required resume order (`NOW.md`, `AGENTS.md`, then attempted the required hydrate command), used the Context Index to open relevant `CONTEXT.md` sections, and cross-checked the stated focus against `PLANS.md`, `ACTIVE_SEARCH.md`, README, pyproject, and the main Python modules. Confidence is not higher because the required `hydrate` command is missing, `AGENTS.md` is stale, and repo planning file naming is inconsistent (`PLAN.md` vs `PLANS.md`).
