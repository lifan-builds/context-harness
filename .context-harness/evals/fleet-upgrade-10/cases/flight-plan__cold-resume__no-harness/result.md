- Current understanding
  - This is a private/local `flight-plan` Python CLI for family travel planning, visa-day tracking, Seats.aero award searches, and Google Flights cash-fare comparisons.
  - Durable operational state is in Markdown, mainly `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/TIMELINE.md` and `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/ACTIVE_SEARCH.md`; code helpers are `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/main.py`, `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/seats_aero.py`, and `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/google_flights.py`.
  - The documented active search is CFH returning from Seattle to China between 2026-04-18 and 2026-05-10, preferably with a Japan stopover, prioritizing business class and only accepting economy awards above 1.5 cpp.
  - The CLI can parse/show the travel timeline, check stay durations, ping Seats.aero, and search cash fares. Prior work fixed the Seats.aero query parameter from `dest_airport` to `destination_airport`, which unblocked award results.
  - The next development theme in `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/PLANS.md` is automated caching and cpp evaluation for award-vs-cash decisions.

- Active blockers or uncertainty
  - Source-of-truth conflict: `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/ACTIVE_SEARCH.md` still marks the CFH Spring 2026 return search as active, but `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/TIMELINE.md` says CFH's 2026-04-18 SEA→PVG return on DL281 is already booked. First clarify whether that search is closed/stale or still needs optimization.
  - Live verification depends on a valid `SEATS_AERO_API_KEY` in `.env`; do not expose or commit it.
  - Seats.aero Partner API only returns direct award segments, so Japan-stopover itineraries must be composed from separate SEA→TYO and TYO→China searches/cash checks.
  - Seats.aero web UI scraping is blocked by Cloudflare; use the API only.
  - `main.py visa-check` appears to expect exact `YYYY-MM-DD` dates or literal `TBD`, while `TIMELINE.md` contains ranges such as `2027-03-27 ~ 2027-04-01`, so the visa check may fail until range/TBD parsing is hardened.
  - Environment docs are inconsistent: `README.md` says Python 3.10+, while `.python-version` and `pyproject.toml` require Python 3.13.

- Immediate next step
  - Reconcile `ACTIVE_SEARCH.md` with `TIMELINE.md`: if CFH's 2026-04-18 DL281 return is final, mark the Spring 2026 CFH search closed and identify the next open travel problem, likely MGQ's 2027-03-27 to 2027-04-01 return or the CLF+WXY+BB May 2027 China trip.
  - If the CFH search is still active, rerun live award/cash checks for SEA→TYO and TYO→PVG/HGH, check point balances, then compute cpp against cash fares before booking any economy redemption.
  - For code work, the next implementation step is a small cpp/cash comparison command or helper that records live fare/award snapshots and flags whether options clear the 1.5 cpp economy threshold.

- Relevant files
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/README.md` — project purpose, setup, command overview.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/TIMELINE.md` — current family travel timeline, booked/planned trips, visa strategy.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/ACTIVE_SEARCH.md` — open flight-search goals, booking principles, current award/cash findings.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/PLANS.md` — development plan and pending cpp automation work.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/FINDINGS.md` — Seats.aero API quirks and constraints.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/EVALUATION.md` — current verification contract for Seats.aero query accuracy.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/main.py` — Click CLI commands.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/seats_aero.py` — Seats.aero Partner API wrapper.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/google_flights.py` — cash-fare wrapper.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo/verify_fb.py` — ad hoc Flying Blue SEA→PVG verification script.

- Verification command/check
  - From `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flight-plan__cold-resume__no-harness/repo`, use `uv run main.py get-timeline` to confirm timeline parsing/display.
  - Use `uv run main.py check-flights` to verify the Seats.aero API key and query path return live data.
  - Use `uv run verify_fb.py` for the documented Flying Blue SEA→PVG award check.
  - Use `uv run main.py search-cash TYO PVG 2026-04-20` or an exact chosen Japan→China date to price the second leg for cpp comparison.
  - After hardening date-range parsing, use `uv run main.py visa-check` to validate stay-duration logic.

- Confidence and why
  - Medium-high. README, PLANS, FINDINGS, EVALUATION, and code agree on the CLI architecture and Seats.aero/API constraints. Confidence is reduced by the unresolved conflict between ACTIVE_SEARCH's active CFH Spring 2026 search and TIMELINE's booked CFH 2026-04-18 return, plus live fare/award availability being time-sensitive and API-key dependent.
