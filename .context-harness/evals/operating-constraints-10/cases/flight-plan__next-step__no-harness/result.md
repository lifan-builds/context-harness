## Current understanding

This is a private local Python CLI for family travel planning. The durable state is in Markdown (`README.md`, `TIMELINE.md`, `ACTIVE_SEARCH.md`, `PLANS.md`, `FINDINGS.md`, `EVALUATION.md`) plus small Python helpers. The basic CLI exists in `main.py` for timeline parsing, visa-duration checking, Seats.aero connectivity, and Google Flights cash searches. Seats.aero direct-search integration in `seats_aero.py` has already been corrected to use `destination_airport`; `FINDINGS.md` and `EVALUATION.md` mark that as the key resolved bug.

The active unfinished work is the unchecked item in `PLANS.md`: implement automated caching and cpp/cents-per-point evaluation. This matches `ACTIVE_SEARCH.md`, whose next steps are to compare award inventory against cash fares, enforce the Economy threshold of strictly greater than 1.5 c/p, and fill the remaining Japan-to-China cash-fare gap for the CFH Spring 2026 return search.

## Active blockers or uncertainty

- Live validation depends on `SEATS_AERO_API_KEY` and the behavior/rate limits of the Seats.aero Partner API; `.env` should be present locally but should not be exposed.
- Seats.aero `/search` only returns direct award segments, so any SEA -> TYO -> PVG/HGH itinerary must be evaluated as separate legs rather than as a constructed connection.
- `google_flights.py` currently searches economy only, so Business-class award comparison may need either a cash-business fare source or explicit logic that only applies cpp filtering to Economy awards.
- `ACTIVE_SEARCH.md` says to check TYO -> PVG/HGH cash prices, but the exact Tokyo airport/date pairing is still a planning choice after choosing the SEA -> TYO award date.
- `pyproject.toml` requires Python `>=3.13`, while `README.md` says Python 3.10+; clarify before treating environment setup failures as product bugs.

## Immediate next step

Implement a small, explicit cpp-evaluation flow rather than another manual one-off search:

1. Inspect the shapes returned by `seats_aero.ping()` / `verify_fb.py` and `google_flights.search_cash_flight()` for the target routes.
2. Add a reusable award-search helper around `seats_aero.py` that accepts origin, destination, date range/source, and returns normalized fields: date, program/source, cabin if available, mileage cost, taxes/fees, airline, and direct flag.
3. Add a cash-fare normalization helper around `google_flights.py` that extracts the comparable cash price for the same route/date and records currency/price.
4. Add cpp calculation: `(cash_price_usd - taxes_usd) / miles * 100`, then mark Economy awards bookable only if cpp > 1.5; keep Business awards prioritized separately.
5. Add a CLI command in `main.py`, e.g. `evaluate-awards`, scoped first to the current CFH Spring 2026 search: SEA -> HND/NRT, SEA -> PVG, and later TYO -> PVG/HGH.
6. Cache raw API responses or normalized snapshots locally before updating `ACTIVE_SEARCH.md`, so repeat checks do not depend on live APIs for every review.
7. Close out by updating `ACTIVE_SEARCH.md` with the chosen best candidates and `PLANS.md` by checking off automated cpp/caching once the command works.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__no-harness/repo/PLANS.md` — identifies the active unfinished implementation item: automated caching and cpp evaluation.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__no-harness/repo/ACTIVE_SEARCH.md` — current CFH search, booking principles, manual findings, and concrete next actions.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__no-harness/repo/FINDINGS.md` — Seats.aero API constraints and resolved `destination_airport` issue.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__no-harness/repo/EVALUATION.md` — current acceptance contract for Seats.aero query accuracy.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__no-harness/repo/main.py` — CLI command surface to extend.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__no-harness/repo/seats_aero.py` — award API wrapper to normalize and extend.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__no-harness/repo/google_flights.py` — cash-fare wrapper needed for cpp comparisons.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__no-harness/repo/verify_fb.py` — useful one-off reference for SEA -> PVG Flying Blue filtering, but should be folded into reusable CLI logic.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__next-step__no-harness/repo/TIMELINE.md` — schedule constraints and target date ranges.

## Verification command/check

For this read-only eval I did not run mutating setup or API commands. After implementing the next step, verify from the case repo with:

```bash
uv run main.py check-flights
uv run python verify_fb.py
uv run main.py search-cash SEA TYO 2026-05-01
uv run main.py search-cash TYO PVG 2026-05-03
uv run main.py evaluate-awards --search cfh-spring-2026
```

Expected checks:

- Seats.aero commands return non-empty data for known active routes without HTTP 400 or silent empty results caused by a destination parameter bug.
- Cash-fare commands return parseable prices for the same route/date combinations used in award comparisons.
- The new evaluation command prints or records mileage, taxes, cash price, computed c/p, cabin/program, and a clear pass/fail against the 1.5 c/p Economy threshold.
- Re-running the evaluation can use cached data or refresh intentionally, without corrupting the Markdown source of truth.

## Confidence and why

Confidence: medium-high. The repository documents the active implementation gap consistently in `PLANS.md` and `ACTIVE_SEARCH.md`, and the existing Python files show exactly where the Seats.aero and Google Flights integrations live. Confidence is not higher because I did not call the live APIs in this read-only eval, and the actual response schemas/cabin fields may require inspection during implementation.