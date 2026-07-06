## Current understanding

The active work is a private Python CLI for family travel planning. The basic CLI can parse `TIMELINE.md`, check visa-duration limits, verify Seats.aero connectivity, and query cash fares through `fast_flights`. The completed sprint fixed the Seats.aero parameter bug by using `destination_airport`; the remaining unchecked implementation item is automated caching/evaluation of cents-per-point (cpp) for award options against cash fares.

The immediate travel use case is CFH returning from Seattle to China between 2026-04-18 and 2026-05-10, preferably with a Japan stopover, prioritizing business class and only accepting economy awards above 1.5 c/p.

## Active blockers or uncertainty

- Seats.aero `/partnerapi/search` only returns direct award segments, so SEA -> Japan and Japan -> China must be modeled as separate legs rather than expecting connected itineraries.
- The cash wrapper in `google_flights.py` currently searches only economy and returns raw `fast_flights` objects; cpp evaluation needs normalized price, cabin, stops, date, and route fields.
- There is no parser/data model for `ACTIVE_SEARCH.md`; active searches are human-readable only.
- API-backed verification depends on `SEATS_AERO_API_KEY` in `.env` or the environment.
- README says Python 3.10+, but `pyproject.toml` requires `>=3.13`; resolve before documenting or verifying on a fresh machine.
- README references `.env.example`, but the inspected repo copy only contains `.env` and `.gitignore` ignores `.env`; add/verify an example file in implementation work if missing.

## Immediate next step

Implement a small, explicit award-evaluation path before adding automation:

1. Add a reusable Seats.aero search function in `seats_aero.py`, e.g. `search_awards(origin, destination, source=None)`, preserving the required `destination_airport` parameter and returning normalized award records.
2. Add normalization helpers for cash results in `google_flights.py` so price can be converted to a numeric USD amount.
3. Add an `evaluate-cpp` CLI command in `main.py` that accepts explicit arguments first, for example:
   - `--origin SEA --dest HND --date 2026-05-01 --source alaska`
   - optional `--cash-dest` or second-leg support can come after the first route works.
4. Compute `cpp = (cash_price_usd - award_taxes_usd) / miles * 100`, flag economy awards only when `cpp > 1.5`, and print a Rich table with route, date, program/source, miles, taxes, cash fare, cpp, and recommendation.
5. Only after the explicit command works, add parsing of `ACTIVE_SEARCH.md` and caching/daily checks.

Do not start with background automation; the useful next milestone is a deterministic, manually invokable cpp report for the CFH SEA -> Japan / SEA -> PVG decision.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__no-harness/repo/PLANS.md` — unchecked item: automated caching and cpp evaluation.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__no-harness/repo/ACTIVE_SEARCH.md` — active CFH search, booking threshold, known cash/award options.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__no-harness/repo/FINDINGS.md` — Seats.aero API constraints and `destination_airport` bug history.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__no-harness/repo/EVALUATION.md` — current verification contract for Seats.aero query accuracy.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__no-harness/repo/main.py` — CLI commands; add `evaluate-cpp` here.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__no-harness/repo/seats_aero.py` — API client; factor `ping()` into reusable award search.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__no-harness/repo/google_flights.py` — cash-fare lookup; normalize prices for cpp.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__no-harness/repo/pyproject.toml` — dependency and Python-version source of truth.

## Verification command/check

For the current repo before editing:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__no-harness/repo
PYTHONDONTWRITEBYTECODE=1 uv run main.py get-timeline
PYTHONDONTWRITEBYTECODE=1 uv run main.py visa-check
PYTHONDONTWRITEBYTECODE=1 uv run main.py check-flights
PYTHONDONTWRITEBYTECODE=1 uv run main.py search-cash SEA HND 2026-05-01
```

After implementing the next step, verify with a manual cpp run such as:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__next-step__no-harness/repo
PYTHONDONTWRITEBYTECODE=1 uv run main.py evaluate-cpp --origin SEA --dest HND --date 2026-05-01 --source alaska
PYTHONDONTWRITEBYTECODE=1 uv run main.py evaluate-cpp --origin SEA --dest PVG --date 2026-04-20 --source flyingblue
```

Acceptance check: results should return non-empty award data for known active routes, no HTTP 400 or silent empty result caused by wrong destination parameter, numeric cash fare, numeric cpp, and an explicit recommendation that respects the 1.5 c/p economy threshold.

## Confidence and why

Confidence: medium-high. The repo documents a clear completed bugfix and a single remaining implementation item, and the CLI/API wrapper files show where the work belongs. Confidence is not higher because live Seats.aero and Google Flights results require credentials/network access, `fast_flights` price object shape must be confirmed at runtime, and Seats.aero direct-only behavior complicates the preferred Japan stopover itinerary.