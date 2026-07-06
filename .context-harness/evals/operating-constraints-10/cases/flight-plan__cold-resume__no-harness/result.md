## Current understanding

This is a private local Python CLI, `flight-plan`, for managing family travel timelines, B1/B2 stay-duration checks, award-flight searches through Seats.aero, and cash fare comparisons through Google Flights. The durable project state is in Markdown plus small Python wrappers rather than a hosted app.

The current active focus appears to be CFH's return flight to China in spring 2026: SEA to Shanghai/Hangzhou, preferably with a Japan stopover, between 2026-04-18 and 2026-05-10. Award availability to Tokyo and Shanghai has already been researched, and the next product/workflow focus is automated cents-per-point evaluation and caching of award options against cash fares.

## Active blockers or uncertainty

- Booking decision inputs are still missing: point balances/transferable-currency availability, exact Tokyo-to-China dates, and cash prices for TYO to PVG/HGH.
- Economy awards should only be booked if redemption value is greater than 1.5 cents per point; the repo does not yet automate that cpp calculation.
- Seats.aero web UI scraping is blocked by Cloudflare, so automation must use the Partner API only.
- Seats.aero `/search` only returns direct award segments, so connecting itineraries must be composed/evaluated outside the API.
- The CLI's `visa-check` parser looks fragile for current timeline rows that contain ranges or localized TBD text, such as `2027-03-27 ~ 2027-04-01` and `待定 (TBD)`, because `main.py` parses only exact `%Y-%m-%d` strings and only skips exact `TBD`.
- Environment uncertainty: `README.md` says Python 3.10+, while `pyproject.toml` requires Python `>=3.13`.

## Immediate next step

Add or run a manual cpp evaluation for the active CFH options before booking: compare the SEA-to-TYO or SEA-to-PVG award mileage/taxes against current cash fares, then filter out Economy redemptions at or below 1.5 cpp and separately identify any Business inventory. If making a code change later, the likely next feature is a CLI command that combines Seats.aero award results with cash fare data and records cpp-ranked candidates.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__no-harness/repo/ACTIVE_SEARCH.md` - active CFH search, date window, booking principles, current award/cash findings, next steps.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__no-harness/repo/PLANS.md` - project execution plan; the remaining unchecked item is automated caching and cpp evaluation.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__no-harness/repo/FINDINGS.md` - Seats.aero API discoveries, including `destination_airport` requirement and Cloudflare/web-scraping limitation.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__no-harness/repo/EVALUATION.md` - active verification contract for Seats.aero query accuracy.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__no-harness/repo/TIMELINE.md` - current family travel schedule and visa-planning constraints.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__no-harness/repo/main.py` - Click CLI commands for timeline display, visa checks, API verification, flight checks, and cash searches.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__no-harness/repo/seats_aero.py` - Seats.aero Partner API wrapper using `destination_airport`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__no-harness/repo/google_flights.py` - cash fare wrapper using `fast_flights`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__no-harness/repo/verify_fb.py` - targeted SEA to PVG Flying Blue Seats.aero check.

## Verification command/check

Primary active contract check, assuming dependencies are synced and `SEATS_AERO_API_KEY` is available:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__no-harness/repo && uv run main.py check-flights
```

Targeted route check for the current CFH search:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__no-harness/repo && uv run python verify_fb.py
```

Basic local timeline checks:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__no-harness/repo && uv run main.py get-timeline
cd /Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flight-plan__cold-resume__no-harness/repo && uv run main.py visa-check
```

## Confidence and why

Medium-high. The repo's own Markdown files consistently identify the active search, completed work, known Seats.aero API issue, and next development item. I did not run network/API commands in this read-only eval, and some uncertainty remains because booking inputs such as point balances and exact Tokyo-to-China cash fares are external to the repository.