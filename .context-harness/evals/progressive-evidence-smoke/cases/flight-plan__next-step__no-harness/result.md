# Current understanding

This is a private local Python CLI for family travel planning. The durable project state is in `TIMELINE.md` and `ACTIVE_SEARCH.md`, while `main.py`, `seats_aero.py`, and `google_flights.py` provide CLI/API helpers. The basic CLI exists for timeline display, visa checks, Seats.aero connectivity, and Google Flights cash search. The active unfinished implementation item is automated caching and cents-per-point evaluation for award options against cash fares, especially the active CFH Spring 2026 SEA to Japan/China return search.

# Active blockers or uncertainty

- Funding inputs are missing from the repo: point balances for Alaska, American, Flying Blue, transferable currencies, and any preferred transfer rules are needed before making a booking recommendation.
- Business-vs-economy inventory is not yet isolated in the current API wrapper output, but `ACTIVE_SEARCH.md` says Business should be prioritized and Economy should only be booked above 1.5 c/p.
- The Seats.aero API only returns direct award segments, so Japan stopover routing likely needs separate leg evaluation rather than a single connecting-award search.
- `visa-check` currently crashes on date ranges in `TIMELINE.md` such as `2027-03-27 ~ 2027-04-01`; this is not the cpp feature itself, but it is a verification caveat for the current CLI.

# Immediate next step

Plan and then implement a new cpp evaluation path without changing the Markdown source-of-truth format first: add a small evaluation module and CLI command that reads a manually specified candidate route/date from the active search, fetches award data from Seats.aero, fetches comparable cash fares from Google Flights, caches raw responses under `data/`, and prints cpp plus pass/fail against the 1.5 c/p Economy threshold. Start with the CFH active search: SEA to TYO/HND/NRT during 2026-04-18 through 2026-05-10, then separately check TYO to PVG/HGH cash positioning dates.

Suggested implementation sequence:
1. Inspect the Seats.aero response fields returned by `verify_fb.py`/`seats_aero.py` and decide the normalized award fields: date, origin, destination, program/source, cabin, miles, taxes, airline, direct flag.
2. Add a pure cpp calculation helper: `(cash_price_usd - taxes_usd) / miles * 100`, with explicit handling for missing taxes or missing cash fare.
3. Add response caching under `data/` keyed by source, route, date/date-range, cabin, and retrieval timestamp, so API calls can be audited and repeated less often.
4. Add a CLI command such as `evaluate-cpp ORIGIN DEST DATE_OR_RANGE --source ... --cabin ... --cash-origin ... --cash-dest ...` or a narrower first command for the active CFH search.
5. After cpp evaluation works for one route, optionally parse `ACTIVE_SEARCH.md` into structured searches for daily checks.
6. Separately fix `visa-check` date-range parsing before using it as a general regression check.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__no-harness/repo/PLANS.md` — marks automated caching and cpp evaluation as the remaining unchecked progress item.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__no-harness/repo/ACTIVE_SEARCH.md` — contains the active CFH search, booking principles, candidate award options, and next steps.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__no-harness/repo/TIMELINE.md` — current family schedule and route constraints.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__no-harness/repo/main.py` — CLI entry point and place to add an evaluation command.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__no-harness/repo/seats_aero.py` — Seats.aero API wrapper using the required `destination_airport` parameter.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__no-harness/repo/google_flights.py` — cash fare lookup wrapper.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__no-harness/repo/verify_fb.py` — existing route-specific Seats.aero probe for SEA to PVG on Flying Blue.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__no-harness/repo/EVALUATION.md` — current acceptance contract for Seats.aero query accuracy.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__no-harness/repo/FINDINGS.md` — documents API constraints and the direct-segment limitation.

# Verification command/check

Before implementation, the current command surface can be checked with:

```bash
python3 "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__no-harness/repo/main.py" --help
python3 "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__no-harness/repo/main.py" get-timeline --file "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__no-harness/repo/TIMELINE.md"
```

For the next implementation, acceptance should include:

```bash
python3 "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__no-harness/repo/main.py" check-flights
python3 "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__no-harness/repo/main.py" search-cash SEA TYO 2026-05-01
python3 "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__no-harness/repo/main.py" evaluate-cpp SEA TYO 2026-05-01 --threshold 1.5
```

Expected verification behavior: Seats.aero returns non-empty award candidates for known active routes, Google Flights returns comparable cash fares, cached raw data is written under `data/`, and the new evaluation prints cpp and a clear pass/fail decision for Economy awards. Also run `visa-check` after date-range parsing is fixed, because it currently fails on range-formatted dates.

# Context Evidence

- `PLANS.md` says the basic CLI, timeline parsing, Seats.aero client, and flight-check commands are complete, with only “Implement automated caching and evaluation of cpp” left unchecked.
- `ACTIVE_SEARCH.md` names the active CFH return-to-China Spring 2026 search and explicitly lists the next steps: evaluate point balances, check exact TYO to PVG/HGH cash prices, and calculate cpp against the 1.5 threshold.
- `FINDINGS.md` and `PLANS.md` both document the Seats.aero `destination_airport` fix and note that the Partner API should be used instead of web scraping.
- `FINDINGS.md` states the Seats.aero API returns only direct award segments, so the Japan stopover preference should be modeled as separate evaluated legs.
- `main.py` currently exposes `check-flights` and `search-cash`, but no command that joins award and cash data into cpp.
- A read-only CLI check showed `get-timeline` can parse/display `TIMELINE.md`; a read-only `visa-check` run failed on a departure date range, confirming a known verification caveat to address separately.

# Confidence and why

Medium-high. The next implementation step is strongly supported by `PLANS.md` and `ACTIVE_SEARCH.md`, and the code has the two required data sources already separated into Seats.aero and Google Flights wrappers. Confidence is not higher because real booking recommendation quality still depends on external API responses, point balances not present in the repo, cabin normalization in Seats.aero responses, and the current `visa-check` date-range parsing bug.
