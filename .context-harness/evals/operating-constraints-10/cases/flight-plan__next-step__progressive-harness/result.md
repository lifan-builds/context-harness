# Current understanding

- I loaded context in the requested order from `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__progressive-harness/repo/NOW.md` and `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__progressive-harness/repo/AGENTS.md`.
- `NOW.md` says the context-harness v3 migration is complete and there are no recorded blockers; the next session should use the generated Context Index before planning or editing.
- The required command `node scripts/context-index.js hydrate "plan next implementation step"` is stale/broken in this repo: `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__progressive-harness/repo/scripts/context-index.js` only supports `update|list|query|section|check`. I used `list` and selected `CONTEXT.md` sections as a read-only fallback.
- The project is a local Python CLI for family flight scheduling, visa-day checks, Seats.aero award searches, and Google Flights cash-fare comparison.
- The basic CLI and API wrappers exist in `main.py`, `seats_aero.py`, and `google_flights.py`; the unfinished item in `PLANS.md` is automated caching and cents-per-point evaluation.
- The active travel-planning need in `ACTIVE_SEARCH.md` is CFH return travel from Seattle to China in April-May 2026, preferably via Japan, with Business Class prioritized and Economy awards only acceptable above 1.5 cents per point.

# Active blockers or uncertainty

- Points balances are not recorded in the repo, so the tool can compute value but cannot choose the best transferable currency or program without user-provided balances.
- Seats.aero Partner API returns direct award segments only, so Japan stopover routing must be modeled as separate searches/legs rather than expecting one connected itinerary.
- Cash fare data from `fast_flights` may be live/unstable; verification should allow for changing fares while checking that parsing and cpp math are correct.
- Harness follow-up: either restore a `hydrate` command or update `AGENTS.md` so fresh agents are not instructed to run a missing command. This does not block the product planning step.
- Secondary product risk: `visa_check` in `main.py` parses dates as exact `%Y-%m-%d`, while `TIMELINE.md` contains date ranges such as `2027-03-27 ~ 2027-04-01`; this should be fixed before relying on visa-check output, but it is separate from cpp evaluation.

# Immediate next step

Implement the smallest useful cpp evaluation path before attempting daily automation:

1. Inspect live return shapes from the existing wrappers without changing their public behavior:
   - Seats.aero award fields from `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__progressive-harness/repo/seats_aero.py`.
   - Cash fare objects from `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__progressive-harness/repo/google_flights.py`.
2. Add a pure cpp calculation helper, keeping the formula testable and independent of network calls:
   - `cpp = ((cash_price_usd - award_taxes_fees_usd) / points) * 100`
   - Economy passes only if `cpp > 1.5`; Business should be surfaced as priority inventory even when cpp comparison is incomplete.
3. Expose a CLI command in `main.py` for one route/date first, using explicit inputs or wrapper results, for example:
   - SEA to TYO on 2026-05-01, comparing the documented `$491` cash fare against `30,000 + $5.60` Alaska availability.
   - Expected cpp for that example is about `1.62`, so it passes the Economy threshold.
4. Only after the manual single-route command works, add lightweight caching under a data file and then parse `ACTIVE_SEARCH.md` for repeated/daily checks.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__progressive-harness/repo/NOW.md` — current focus and no recorded blockers.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__progressive-harness/repo/AGENTS.md` — context contract and generated index.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__progressive-harness/repo/CONTEXT.md` — rules, project overview, workflow, architecture, booking principles.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__progressive-harness/repo/PLANS.md` — marks cpp evaluation/caching as the remaining unchecked implementation item.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__progressive-harness/repo/ACTIVE_SEARCH.md` — current CFH search, documented fares/awards, and cpp threshold.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__progressive-harness/repo/main.py` — CLI entry point where the cpp comparison command should be exposed.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__progressive-harness/repo/seats_aero.py` — award-search API wrapper; keep using `destination_airport`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__progressive-harness/repo/google_flights.py` — cash-fare wrapper.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__progressive-harness/repo/EVALUATION.md` — existing verification expectations.

# Verification command/check

After implementing the cpp command, verify both the new value calculation and existing CLI behavior from the repo root:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__progressive-harness/repo
uv run main.py get-timeline
uv run main.py visa-check
uv run main.py check-flights
uv run main.py search-cash SEA TYO 2026-05-01
uv run main.py evaluate-cpp --origin SEA --dest TYO --date 2026-05-01 --cash-price 491 --points 30000 --fees 5.60 --cabin economy
uv run ruff check .
```

Expected cpp check for the documented Alaska/SEA-TYO example: `(491 - 5.60) / 30000 * 100 = 1.62 cpp`, which should be marked as passing the `> 1.5 cpp` Economy threshold. If `visa-check` fails on range dates, file that as a prerequisite bugfix before using visa results for decisions.

# Confidence and why

Confidence: medium-high.

The next implementation step is strongly supported by `PLANS.md` and `ACTIVE_SEARCH.md`, and the existing code already has the two needed data sources. Confidence is not higher because the required `hydrate` command is absent, live flight/cash APIs may return different shapes or values, and some timeline date formats appear incompatible with the current `visa_check` parser.
