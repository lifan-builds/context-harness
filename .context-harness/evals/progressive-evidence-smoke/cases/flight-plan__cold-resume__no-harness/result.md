## Current understanding

This repository is `flight-plan`, a private local Python CLI workspace for family travel planning, visa-duration tracking, award-flight searches, and cash-fare comparison. The durable project state is Markdown, especially `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/TIMELINE.md` and `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/ACTIVE_SEARCH.md`; Python helpers provide CLI parsing and API checks.

The current active search focus appears to be CFH returning from Seattle to China in spring 2026, preferably via a Japan stopover, with travel dates between 2026-04-18 and 2026-05-10. Booking principles are to prioritize business class and only book economy awards if value is strictly greater than 1.5 cents per point. The strongest recorded next work is to compare point balances and cpp against cash fares, then price the Tokyo-to-PVG/HGH leg for the exact selected stopover date.

Development-wise, the basic CLI is functional: it can parse the timeline, check visa durations, verify the Seats.aero API, and search cash fares. The Seats.aero `destination_airport` parameter bug has already been fixed. The remaining planned product work is automated caching and cpp evaluation, plus possibly parsing `ACTIVE_SEARCH.md` into daily checks.

## Active blockers or uncertainty

- Live award checks require a valid `SEATS_AERO_API_KEY` in `.env` or the environment.
- Exact transferable/airline point balances are not recorded, so the best redemption cannot be selected yet.
- Tokyo-to-China cash fares for the exact stopover date still need to be checked.
- Business-class availability is not isolated in the recorded findings; economy awards must be validated against the >1.5 cpp threshold before booking.
- There is possible stale-state uncertainty: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/TIMELINE.md` marks CFH's 2026-04-18 return flight as booked, while `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/ACTIVE_SEARCH.md` still lists CFH's spring 2026 return-to-China search as active.

## Immediate next step

Reconcile whether CFH's spring 2026 return is already booked or still being optimized. If it is still open, choose candidate SEA-to-Tokyo award dates from the recorded availability, check current point balances, price the matching Tokyo-to-PVG/HGH cash leg, and compute cpp before booking any economy award.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/README.md` — project purpose, setup, CLI usage, and source-of-truth statement.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/TIMELINE.md` — family schedule, hubs, visa strategy, and booked/planned trip rows.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/ACTIVE_SEARCH.md` — current CFH search, booking rules, award/cash findings, and next steps.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/PLANS.md` — progress checklist, decision log, and remaining automation work.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/FINDINGS.md` — Seats.aero API discoveries, including `destination_airport` and Cloudflare constraints.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/EVALUATION.md` — verification contract for Seats.aero query accuracy.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/main.py` — Click CLI commands: `get-timeline`, `visa-check`, `verify-api`, `check-flights`, and `search-cash`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/seats_aero.py` — Seats.aero Partner API wrapper using `destination_airport`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/google_flights.py` — `fast_flights` cash fare wrapper.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/pyproject.toml` — Python requirement and dependencies.

## Verification command/check

From `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo`, run:

```bash
uv run main.py check-flights
```

That is the repository's stated active sprint verification for Seats.aero query accuracy and should return more than zero flights for a known active route without HTTP 400 or silent empty results. For the immediate booking decision, follow with a cash-leg check such as:

```bash
uv run main.py search-cash TYO PVG 2026-05-01
```

I also ran this read-only sanity check successfully:

```bash
python3 /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/main.py --help
```

It confirmed the expected CLI commands are available.

## Context Evidence

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/README.md:7-11` says this is an internal planning tool and Markdown is the durable source of truth.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/README.md:31-38` documents the `main.py` CLI commands.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/ACTIVE_SEARCH.md:3-15` defines the active CFH search, SEA-to-China destination set, Japan stopover preference, date window, and booking principles.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/ACTIVE_SEARCH.md:43-46` lists next steps: evaluate point balances, check Tokyo-to-China cash prices, and calculate cpp.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/PLANS.md:8-15` shows completed CLI/API work and the remaining cpp automation item.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/FINDINGS.md:10-13` records the Seats.aero `destination_airport` requirement, direct-segment limitation, and Cloudflare web UI block.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/EVALUATION.md:11-14` defines the active verification contract.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__no-harness/repo/main.py:52-188` implements the relevant CLI commands.

## Confidence and why

Confidence is medium-high. The main conclusions are directly supported by repository Markdown and CLI source, and the read-only help command confirmed command availability. Confidence is not higher because live award/cash data was not re-queried, `.env` was intentionally not inspected, and the active search appears potentially stale relative to the booked CFH row in the timeline.