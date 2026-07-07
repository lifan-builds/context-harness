# Current understanding

- `flight-plan` is a private Python CLI for family travel timelines, visa-duration checks, Seats.aero award searches, and Google Flights cash-fare comparisons.
- Context-harness v3 migration is complete; `NOW.md` records no active blockers and says to use the generated Context Index before planning/editing.
- The product CLI is already functional at a basic level: `main.py` parses `TIMELINE.md`, checks visa durations, pings Seats.aero via `seats_aero.py`, and queries cash fares via `google_flights.py`.
- The active uncompleted implementation item in `PLANS.md` is automated caching and cents-per-point (`cpp`) evaluation. `ACTIVE_SEARCH.md` gives the immediate real use case: CFH SEA to PVG/SHA/HGH, preferably via Japan, Apr 18-May 10 2026, with Economy awards acceptable only if `cpp > 1.5`.

# Active blockers or uncertainty

- No blocker is recorded in `NOW.md`.
- `CONTEXT.md` flags that project-specific verification commands are not yet documented; this does not block planning, but it should be closed out after the next implementation pass.
- Award search constraints matter: Seats.aero Partner API must use `destination_airport`, not `dest_airport`; it returns direct award segments only; Cloudflare blocks automated scraping of the Seats.aero web UI.
- Do not read or expose `.env`; keep API keys and family schedule details private.

# Immediate next step

Implement the smallest useful `cpp` evaluation slice, centered on the current CFH active search:

1. Inspect the current data shapes returned by `seats_aero.ping()` / route-specific Seats.aero searches and `google_flights.search_cash_flight()` without committing secrets or raw dumps.
2. Add a reusable award-search function in `seats_aero.py` for origin, destination, source, optional date range, and cabin/source filtering. Preserve `destination_airport`.
3. Add a small fare/award normalization layer, likely in `main.py` initially unless it grows enough to deserve a helper module, that computes:
   - cash fare in cents,
   - award miles/points,
   - taxes/fees in cents,
   - `cpp = (cash_cents - taxes_cents) / points`.
4. Add a CLI command such as `evaluate-cpp ORIGIN DEST DATE --source flyingblue --cash-price <amount>` or a command that can use `search_cash` results when available. Keep the first version deterministic and easy to verify; caching can be a simple local JSON artifact only after the calculation path is correct.
5. Update closeout context after implementation: `PLANS.md` progress/decision, `EVALUATION.md` active sprint contract, `NOW.md` focus/next step, and possibly `CONTEXT.md#workflow` with concrete verification commands.

# Relevant files

- `NOW.md` — migration state and immediate context-harness instruction.
- `CONTEXT.md` — project overview, constraints, workflow ambiguity, imported project notes.
- `AGENTS.md` — v3 Context Contract and Context Index.
- `.context-harness/cards/ctx-now-now.md`
- `.context-harness/cards/ctx-context-project.md`
- `.context-harness/cards/ctx-context-project-overview.md`
- `.context-harness/cards/ctx-context-operating-constraints.md`
- `.context-harness/cards/ctx-context-project-structure.md`
- `PLANS.md` — active uncompleted task: automated caching and `cpp` evaluation.
- `ACTIVE_SEARCH.md` — concrete route/date/cabin/cpp threshold for the first implementation slice.
- `FINDINGS.md` — Seats.aero API pitfalls and direct-segment limitation.
- `EVALUATION.md` — current verification contract for Seats.aero query accuracy.
- `README.md` — available CLI commands and privacy constraints.
- `main.py` — CLI entrypoint and likely first place to add `evaluate-cpp`.
- `seats_aero.py` — Partner API wrapper to generalize beyond `ping()`.
- `google_flights.py` — cash fare wrapper used for the cash side of `cpp`.
- `pyproject.toml` — dependencies and Python version.

# Verification command/check

For the implementation pass, verify in layers:

```bash
uv run ruff check .
uv run main.py get-timeline
uv run main.py visa-check
uv run main.py check-flights
uv run main.py search-cash SEA TYO 2026-05-01
uv run main.py evaluate-cpp SEA PVG 2026-04-20 --source flyingblue --cash-price 423
```

Acceptance for the next slice: the new command should produce at least one deterministic `cpp` line for a known active route, avoid HTTP 400 or silent empty-results regressions from bad Seats.aero parameters, and clearly mark Economy awards below or above the `1.5 c/p` threshold.

# Context Evidence

Used, in order:

1. `prompt.md` from the eval case.
2. `NOW.md` — current focus: v3 migration completed; no blockers; use Context Index.
3. `CONTEXT.md` — concise always-read layer; includes project purpose, constraints, workflow ambiguity, and imported project notes.
4. `AGENTS.md` — confirmed schema v3 Context Contract and generated Context Index.
5. Command: `node scripts/context-index.js hydrate "plan next implementation step"`.
   - Selected cards: `ctx-now-now`, `ctx-context-project`, `ctx-context-project-overview`, `ctx-context-operating-constraints`, `ctx-context-project-structure`.
6. Opened selected cards before bulky planning/project files.
7. Read `PLANS.md`, `ACTIVE_SEARCH.md`, `FINDINGS.md`, `EVALUATION.md`, `README.md`, `pyproject.toml`, `main.py`, `seats_aero.py`, `google_flights.py`, `verify_fb.py`, and the start of `TIMELINE.md`.
8. Did not open raw chunks; selected cards plus concise `CONTEXT.md` were sufficient.
9. Did not read `.env`, `expected.json`, `score.json`, run `manifest.json`, or eval reports.

Save/update routing I would perform after a real implementation pass: task-local progress and decisions to `PLANS.md`; verification contract to `EVALUATION.md`; current focus/next step/touched files to `NOW.md`; durable workflow commands or API lessons to `CONTEXT.md` only if they become stable project facts, followed by `node scripts/context-index.js update`.

# Confidence and why

High for the next-step recommendation: `PLANS.md` explicitly marks automated caching and `cpp` evaluation as the remaining unchecked item, and `ACTIVE_SEARCH.md` supplies a concrete route, date range, and `cpp` threshold. Medium for exact command shape because the repository has no existing `evaluate-cpp` command yet, so the interface should be confirmed during implementation.