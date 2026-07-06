## Current understanding

This repository is a local Python CLI for family travel planning and award/cash flight research. The durable operational state is in `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/TIMELINE.md` and `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/ACTIVE_SEARCH.md`, with CLI/API code in `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/main.py`, `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/seats_aero.py`, and `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/google_flights.py`.

The active search is CFH returning from Seattle to China between 2026-04-18 and 2026-05-10, preferably with a Japan stopover. The API bug around `destination_airport` is already resolved and documented in `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/FINDINGS.md`. The open implementation item in `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/PLANS.md` is automated caching and cpp evaluation, matching the booking rule in `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/ACTIVE_SEARCH.md`: prioritize business class, and only book economy awards if redemption value is strictly greater than 1.5 cents per point.

## Active blockers or uncertainty

- Point balances and transferable-currency availability are not represented in the repo, so the tool can compute cpp but cannot yet decide fundability.
- Seats.aero `/search` only returns direct award segments; Japan stopover evaluation must be modeled as separate legs, not as a connecting itinerary.
- Cash fare searches depend on `fast_flights`/Google Flights behavior and may be volatile; caching should record quote time and inputs.
- `main.py` currently contains only generic `check-flights` and `search-cash` commands; there is no reusable award search function that accepts route/source/date filters.
- `verify_fb.py` has route-specific exploratory logic for SEA to PVG on Flying Blue that should either be folded into reusable code or treated as a manual verification script.

## Immediate next step

Implement the smallest useful cpp-evaluation path rather than daily automation first:

1. Add a reusable award-search function in `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/seats_aero.py` that accepts `origin_airport`, `destination_airport`, optional `source`, and date-range filters, and returns normalized rows with date, cabin mileage/taxes where available, source, airline, and directness.
2. Add a reusable cash-search normalization helper in `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/google_flights.py` or `main.py` that extracts a numeric cash price from `fast_flights` results.
3. Add a CLI command in `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/main.py`, for example `evaluate-cpp ORIGIN DEST START_DATE END_DATE --source flyingblue --cash-date DATE`, that computes:
   - `net_cash_value = cash_price - award_taxes`
   - `cpp = net_cash_value * 100 / miles`
   - pass/fail against the 1.5 cpp economy threshold
4. Keep initial caching simple and local: write generated quote/evaluation artifacts under a gitignored cache path only after confirming `.gitignore` covers it; otherwise first update `.gitignore` in the implementation pass. Cache entries should include route, date, source, raw-ish award fields, cash quote, timestamp, and cpp.
5. After the command works for one direct route, use it manually for the active CFH options: SEA to TYO/HND/NRT positioning awards, SEA to PVG direct fallback, and then separately cash-check TYO to PVG/HGH.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/ACTIVE_SEARCH.md` - active route, date range, booking threshold, known findings.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/PLANS.md` - explicit remaining implementation item: automated caching and cpp evaluation.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/EVALUATION.md` - current acceptance contract for Seats.aero query accuracy.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/FINDINGS.md` - API constraints, especially `destination_airport` and direct-segment behavior.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/main.py` - CLI commands to extend.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/seats_aero.py` - award API client to make route/date/source-aware.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/google_flights.py` - cash fare wrapper to normalize for cpp.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/verify_fb.py` - existing one-off Flying Blue verification logic that can guide expected award fields.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo/pyproject.toml` - dependency/runtime constraints.

## Verification command/check

For a read-only planning pass, I did not run API calls or modify source. The implementation pass should verify in this order from `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__next-step__no-harness/repo`:

```bash
uv run main.py get-timeline
uv run main.py visa-check
uv run main.py check-flights
uv run python verify_fb.py
uv run main.py search-cash SEA PVG 2026-04-20
uv run main.py evaluate-cpp SEA PVG 2026-04-18 2026-05-10 --source flyingblue
```

Expected checks: timeline parsing still works, visa-check does not regress on booked rows, Seats.aero returns more than zero known route results without silent `[]`, cash search returns parseable prices, and the new cpp command marks economy awards as pass only when cpp is strictly greater than 1.5.

## Confidence and why

Confidence: medium-high. The next step is directly supported by the repo's own active plan and booking rules, and the relevant implementation seams are small. The main uncertainty is not architectural but data/API-related: Seats.aero response fields vary by source/cabin, Google Flights prices are volatile, and point-balance/fundability data is not present in the repo.