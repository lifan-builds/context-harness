# Current understanding

- `NOW.md` says the context-harness v3 migration for `flight-plan` is complete, with no recorded blockers. The requested planning flow was followed by reading `NOW.md`, `AGENTS.md`, hydrating context with `node scripts/context-index.js hydrate "plan next implementation step"`, then opening only the selected cards/sections.
- The repo is a private Python CLI for family travel planning: timeline parsing, visa-duration checks, Seats.aero award searches, and Google Flights cash-fare comparisons.
- The basic CLI is already functional. `PLANS.md` marks the next unchecked product work as automated caching and cpp/cents-per-point evaluation. `ACTIVE_SEARCH.md` gives a concrete active case: CFH SEA to PVG/SHA/HGH, preferably via Japan, Apr 18-May 10 2026, with Business preferred and Economy only if cpp is strictly greater than 1.5.
- `FINDINGS.md` and `EVALUATION.md` confirm the Seats.aero `destination_airport` bug was fixed and that the API only returns direct award segments, so the next implementation should not depend on scraping or automatic connection-building.

# Active blockers or uncertainty

- Do not open or copy secrets: `.env` exists and should remain unread; Seats.aero checks require `SEATS_AERO_API_KEY` to be present in the environment.
- External-data verification may be flaky: Seats.aero availability and Google Flights cash fares can change, and Cloudflare blocks web scraping of Seats.aero.
- The context/harness metadata has small follow-up inconsistencies that do not block product planning: `AGENTS.md` refers to `PLAN.md`, but this repo has `PLANS.md`; `README.md` references `.env.example`, but the file was not present in the inspected file listing.
- It is unclear whether cpp evaluation should be fully automated from `ACTIVE_SEARCH.md` immediately or first exposed as a manual CLI command that accepts points/taxes/cash fare inputs. Start manual and pure, then automate parsing/caching.

# Immediate next step

Implement the smallest cpp evaluation slice before building scheduling/caching:

1. Inspect `ACTIVE_SEARCH.md` and encode the current booking rule as CLI behavior: Business is preferred; Economy redemptions pass only when cpp > 1.5.
2. Add a pure cpp calculation path, ideally as a small helper function/module used by `main.py`: `cpp = ((cash_price - taxes_fees) / points) * 100`.
3. Add a CLI command such as `evaluate-award`/`cpp-eval` that accepts route/date/program/cabin/points/taxes/cash-price and prints pass/fail against the threshold. Keep it independent of Seats.aero and Google Flights at first so it is deterministic and easy to verify.
4. After that works, wire it to existing `search-cash` and `seats_aero.py` results, then add caching for fetched cash/award data.
5. Close the harness follow-ups separately after the product slice: align `AGENTS.md` with `PLANS.md` or add `PLAN.md`, and either add `.env.example` or update `README.md`.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__progressive-harness/repo/NOW.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__progressive-harness/repo/AGENTS.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__progressive-harness/repo/CONTEXT.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__progressive-harness/repo/PLANS.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__progressive-harness/repo/ACTIVE_SEARCH.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__progressive-harness/repo/EVALUATION.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__progressive-harness/repo/FINDINGS.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__progressive-harness/repo/main.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__progressive-harness/repo/seats_aero.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__progressive-harness/repo/google_flights.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__progressive-harness/repo/pyproject.toml`

# Verification command/check

For the immediate pure cpp slice, verify without network access first:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__progressive-harness/repo
PYTHONDONTWRITEBYTECODE=1 uv run main.py evaluate-award --cash-price 491 --points 30000 --taxes 5.60 --cabin economy --threshold-cpp 1.5
PYTHONDONTWRITEBYTECODE=1 uv run main.py evaluate-award --cash-price 423 --points 36000 --taxes 33.50 --cabin economy --threshold-cpp 1.5
```

Expected checks:
- Output includes computed cpp.
- Economy awards below or equal to 1.5 cpp fail; awards above 1.5 cpp pass.
- Business awards are clearly labeled as preferred rather than judged only by the Economy threshold.

After integration with external APIs, run:

```bash
PYTHONDONTWRITEBYTECODE=1 uv run main.py check-flights
PYTHONDONTWRITEBYTECODE=1 uv run main.py search-cash SEA TYO 2026-05-01
```

Use these only with valid local credentials and expect live-data variance.

# Confidence and why

Confidence: medium-high. The context files, plan, active search, and CLI code all point to cpp evaluation/caching as the next product step, and a pure CLI calculation is the safest incremental implementation. Confidence is not higher because external flight data changes over time and the repo has minor context/documentation drift (`PLAN.md` vs `PLANS.md`, missing `.env.example`) that should be cleaned up but does not change the implementation priority.
