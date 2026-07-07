## Current understanding

This isolated repo is a private `flight-plan` Python CLI for family travel planning. The durable operational state is currently in Markdown (`TIMELINE.md`, `ACTIVE_SEARCH.md`, plus supporting `PLANS.md`, `FINDINGS.md`, and `EVALUATION.md`), while Python helpers provide parsing and API checks. The recently completed task appears to be the Seats.aero query fix: the API wrapper now uses `destination_airport`, and the repo notes record that this changed empty-result searches into usable SEA/PVG and SEA/TYO award results.

Context files to update if/when context-harness files are present or recreated:

- `CONTEXT.md`: capture the stable project facts: private family travel CLI; Markdown is the source of truth; `main.py` is the Click entry point; `TIMELINE.md` drives schedule/visa checks; `ACTIVE_SEARCH.md` tracks current searches; API wrappers are `seats_aero.py` and `google_flights.py`; Seats.aero automation must use the Partner API rather than browser scraping; `/search` only returns direct award segments; secrets stay in `.env` and should not be copied into context.
- `NOW.md`: capture the current working state after the completed task: Seats.aero `destination_airport` issue is fixed; `uv run main.py get-timeline` renders the timeline; active workflow is CFH return-to-China Spring 2026; immediate next work is checking point balances, pricing TYO -> PVG/HGH cash legs, and computing c/p before an Economy redemption; API/network verification remains gated by valid credentials.
- `PLAN.md`: update progress, decisions, follow-ups, and validation: mark the Seats.aero parameter bug fix as complete; retain the decision to use a local Python CLI and API-based Seats.aero checks; next milestones are c/p automation/caching and parsing `ACTIVE_SEARCH.md` into repeatable checks; validation should include lint/format, timeline parse, visa check, and API searches.
- `AGENTS.md`: no task-specific update is required unless the project is intentionally adding agent operating instructions. If added, it should be limited to privacy/secrets guidance and read-only-safe verification commands, not duplicate project state already suited for `CONTEXT.md`/`NOW.md`/`PLAN.md`.

## Active blockers or uncertainty

- Seats.aero verification requires a valid `SEATS_AERO_API_KEY` and network access; `.env` exists in the isolated repo but its contents should not be read or copied into context.
- The repo has a documentation/runtime mismatch: `README.md` says Python 3.10+, while `pyproject.toml` requires `>=3.13`.
- `TIMELINE.md` contains approximate/range dates such as `2027-03-27 ~ 2027-04-01` and `待定 (TBD)`. `main.py visa-check` currently parses dates with `datetime.strptime(..., "%Y-%m-%d")`, so visa-check may fail or need normalization before it can validate all timeline rows.
- I did not run live Seats.aero or Google Flights searches because the eval is read-only and live API checks depend on credentials/network behavior.

## Immediate next step

Update context metadata, not repository source: write `NOW.md` with the completed Seats.aero fix, active CFH search, blockers above, and the next action to calculate c/p for candidate awards versus cash fares. Then update `PLAN.md` to make c/p automation and `ACTIVE_SEARCH.md` parsing the next planned work, and update `CONTEXT.md` with the stable API constraints and privacy rules.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__no-harness/repo/README.md` — project purpose, CLI usage, Markdown source-of-truth statement, privacy note.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__no-harness/repo/TIMELINE.md` — current family travel schedule and visa strategy.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__no-harness/repo/ACTIVE_SEARCH.md` — active CFH Spring 2026 search, booking principles, next steps.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__no-harness/repo/PLANS.md` — progress, decisions, follow-ups, validation state.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__no-harness/repo/FINDINGS.md` — Seats.aero bug/discovery log and scraper limitation.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__no-harness/repo/EVALUATION.md` — acceptance criteria and active verification contract.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__no-harness/repo/main.py` — Click CLI, timeline parser, visa check, Seats.aero and cash-search commands.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__no-harness/repo/seats_aero.py` — Seats.aero Partner API wrapper using `destination_airport`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__no-harness/repo/google_flights.py` — cash fare wrapper.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__no-harness/repo/pyproject.toml` — dependency and Python-version contract.

## Verification command/check

Recommended verification after context updates and before marking the completed task fully settled:

1. `uv run main.py get-timeline` — confirms Markdown timeline parsing still renders. I ran this in the isolated repo and it rendered the table successfully.
2. `uv run main.py visa-check` — should validate 180-day/165-day stay logic, but first account for range/TBD dates in `TIMELINE.md` or expect a parsing failure.
3. `uv run main.py check-flights` — confirms Seats.aero credentials and `/search` behavior; acceptance is >0 data for known active routes and no HTTP 400/silent-empty regression.
4. `uv run python verify_fb.py` — checks SEA -> PVG Flying Blue availability using `destination_airport`; requires API credentials/network.
5. `uv run main.py search-cash TYO PVG 2026-05-01` and/or `uv run main.py search-cash TYO HGH 2026-05-01` — supports the immediate c/p decision for the Japan-to-China leg.
6. `uv run ruff check .` and `uv run ruff format --check .` — aligns with `EVALUATION.md`; if Ruff is not configured as a dependency, add/use the project’s chosen lint runner before relying on these.

## Context Evidence

- `README.md` says this is an internal planning tool whose durable source of truth is Markdown and lists CLI commands for timeline, visa, Seats.aero, and cash search.
- `TIMELINE.md` lists the SEA/HGH/PVG/SHA hubs, 5.5-month visa strategy, booked CFH/WJZ/NQJ/MGQ travel, and planned 2027 CFH/CLF+WXY+BB travel.
- `ACTIVE_SEARCH.md` identifies the active CFH Spring 2026 return-to-China search, business-class preference, Economy c/p > 1.5 rule, award/cash findings, and next steps.
- `FINDINGS.md` records the Seats.aero `/search` parameter bug (`destination_airport` required), direct-only API limitation, and Cloudflare block on web scraping.
- `PLANS.md` marks the API client, CLI commands, and `destination_airport` bug fix complete, with c/p automation and `ACTIVE_SEARCH.md` parsing still open.
- `EVALUATION.md` defines the active contract to validate Seats.aero query accuracy via `python main.py check-flights` or custom SEA -> TYO queries.
- `seats_aero.py` currently calls `/partnerapi/search` with `origin_airport` and `destination_airport`, matching the documented fix.
- `main.py` uses `datetime.strptime` with strict `%Y-%m-%d`, which explains the visa-check uncertainty for approximate/range dates in `TIMELINE.md`.

## Confidence and why

High for which context files should be updated and what should go in them, because multiple repo documents agree on project purpose, current state, completed Seats.aero fix, active search, and next steps. Medium for live verification readiness, because I only performed a read-only timeline-render check; API and fare checks depend on credentials/network, and visa-check likely needs date normalization for range/TBD rows.