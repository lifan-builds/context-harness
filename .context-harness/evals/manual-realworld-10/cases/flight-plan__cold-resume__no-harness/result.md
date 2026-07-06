## Current understanding

This is a private local Python CLI workspace for family travel planning, visa-day tracking, cash-fare checks, and Seats.aero award-flight searches. The durable project state appears to live in Markdown files, especially `TIMELINE.md` and `ACTIVE_SEARCH.md`, with CLI/API helpers in `main.py`, `seats_aero.py`, and `google_flights.py`.

The active travel/research thread is CFH returning from Seattle to China in spring 2026, preferably with a Japan stopover before PVG/SHA/HGH. `ACTIVE_SEARCH.md` lists active research for SEA -> Tokyo and SEA -> PVG award options between 2026-04-18 and 2026-05-10, with business class preferred and economy only if redemption value is strictly above 1.5 c/p. Prior findings show good SEA -> Tokyo award availability and direct SEA -> PVG award availability after fixing the Seats.aero `destination_airport` parameter.

The active development thread is a mostly functional CLI whose next enhancement is automated caching/evaluation of cents-per-point against cash fares and possibly daily checks driven from `ACTIVE_SEARCH.md`.

## Active blockers or uncertainty

- `TIMELINE.md` and `ACTIVE_SEARCH.md` may conflict: `TIMELINE.md` says CFH's 2026-04-18 SEA -> PVG return on DL281 is already booked, while `ACTIVE_SEARCH.md` still marks the CFH spring 2026 SEA -> China search as active. First uncertainty is whether the search is stale or still needed for an alternate/replacement itinerary.
- `main.py`'s `visa-check` parser expects exact `YYYY-MM-DD` dates unless the field is exactly `TBD`, but `TIMELINE.md` contains ranges and localized TBD text such as `2026-11-15 ~ 2026-11-20`, `2027-03-27 ~ 2027-04-01`, and `待定 (TBD)`. That likely makes `uv run main.py visa-check` crash once it reaches planned rows.
- Seats.aero checks require `SEATS_AERO_API_KEY` in the environment or `.env`; I did not inspect secret values. Seats.aero web scraping is blocked by Cloudflare, so the Partner API is the only viable automated path.
- Seats.aero `/search` only returns direct award segments, so Japan-stopover evaluation must combine separate SEA -> TYO and TYO -> China/cash legs rather than expecting a single connecting search result.

## Immediate next step

First reconcile the state of the CFH spring 2026 search: confirm whether the booked DL281 SEA -> PVG itinerary in `TIMELINE.md` closes the active search in `ACTIVE_SEARCH.md`, or whether the project still needs comparison/alternate booking work. If it remains active, the next concrete work is to evaluate point balances and calculate c/p for the listed SEA -> Tokyo and SEA -> PVG awards, then check cash fares for the exact Tokyo -> PVG/HGH continuation dates.

On the code side, the next safe fix would be to make `visa-check` tolerate date ranges and non-English/TBD fields before relying on it as a verification command for the current timeline.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__cold-resume__no-harness/repo/README.md` — project purpose, setup, CLI commands, source-of-truth notes.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__cold-resume__no-harness/repo/TIMELINE.md` — family schedule, visa strategy, booked/planned travel rows.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__cold-resume__no-harness/repo/ACTIVE_SEARCH.md` — current/possibly stale CFH spring 2026 award/cash search, booking principles, next steps.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__cold-resume__no-harness/repo/PLANS.md` — development progress and planned automation/cpp work.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__cold-resume__no-harness/repo/FINDINGS.md` — Seats.aero API discoveries and known endpoint limitations.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__cold-resume__no-harness/repo/EVALUATION.md` — current verification contract for Seats.aero query accuracy.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__cold-resume__no-harness/repo/main.py` — Click CLI, timeline parser, visa check, Seats.aero and cash-fare commands.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__cold-resume__no-harness/repo/seats_aero.py` — Partner API wrapper using `destination_airport`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__cold-resume__no-harness/repo/google_flights.py` — `fast_flights` wrapper for cash one-way fare searches.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flight-plan__cold-resume__no-harness/repo/verify_fb.py` — direct Flying Blue SEA -> PVG Seats.aero verification script.

## Verification command/check

From the case repo:

```bash
uv run main.py check-flights
```

This is the active sprint contract in `EVALUATION.md`: it should return more than zero flights for a known active route without HTTP 400 or silent empty results, proving the Seats.aero `destination_airport` query path still works.

Additional local checks after the timeline parser is hardened:

```bash
uv run main.py get-timeline
uv run main.py visa-check
```

For CFH SEA -> PVG Flying Blue-specific validation:

```bash
uv run python verify_fb.py
```

## Confidence and why

Medium-high. The repository's own Markdown files are explicit about purpose, active searches, API discoveries, and development next steps. Confidence is reduced because the active search status appears stale relative to the booked CFH return in `TIMELINE.md`, and I did not execute API/network commands or inspect secret `.env` contents during this read-only evaluation.
