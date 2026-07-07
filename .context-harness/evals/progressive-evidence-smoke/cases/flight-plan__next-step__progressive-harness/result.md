# Current understanding

The active repository state is post context-harness v3 migration: `NOW.md` says the migration is complete, no blockers are recorded, and future work should use the generated `AGENTS.md` Context Index. The project work itself is a private Python CLI for family travel scheduling, visa-duration checks, seats.aero award searches, and Google Flights cash-fare lookup. The functional CLI exists, and `PLANS.md` shows the remaining unchecked project implementation item is automated caching and cents-per-point (cpp) evaluation. `ACTIVE_SEARCH.md` makes that item concrete: for CFH's Spring 2026 return-to-China search, the next booking decision requires checking point balances, exact Tokyo-to-China cash fares, and cpp against the >1.5 c/p economy threshold.

# Active blockers or uncertainty

- No active blocker is recorded in `NOW.md`.
- `PLAN.md` is absent; the live planning document appears to be `PLANS.md`.
- Verification commands are only partially documented: `CONTEXT.md` flags project-specific verification commands as ambiguous, while `README.md` and `EVALUATION.md` provide usable CLI checks.
- `README.md` says Python 3.10+ but `pyproject.toml` requires Python >=3.13; reconcile this before onboarding or CI work.
- Do not read or copy `.env`; it exists and may contain the Seats.aero API key.

# Immediate next step

Plan and implement a small, testable cpp-evaluation slice rather than more context migration work:

1. Define the cpp data contract from existing inputs: award mileage/taxes from `seats_aero.py` results, cash fare prices from `google_flights.py`, and the booking threshold from `ACTIVE_SEARCH.md`.
2. Add a pure helper first, e.g. `calculate_cpp(cash_price_usd, taxes_usd, miles) -> float`, so the core math is verifiable without network calls.
3. Add a CLI command that evaluates a single route/date/source pair, reusing the existing cash and award wrappers; keep the initial scope to one-way economy because current wrappers expose one-way economy cash fares and economy award fields.
4. Add a minimal local JSON cache for raw API responses or computed comparisons only after the pure cpp path works; keep cache files out of secrets and avoid storing API keys.
5. Update `PLANS.md`/`NOW.md` after implementation to mark what changed and what remains.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__progressive-harness/repo/NOW.md` — says v3 migration is complete and no blockers are recorded.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__progressive-harness/repo/CONTEXT.md` — durable project overview, constraints, workflow placeholders, and booking principle.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__progressive-harness/repo/AGENTS.md` — generated Context Index and retrieval rules.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__progressive-harness/repo/PLANS.md` — active plan with unchecked cpp/caching work.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__progressive-harness/repo/ACTIVE_SEARCH.md` — concrete CFH search, cpp threshold, and next booking questions.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__progressive-harness/repo/EVALUATION.md` — current verification contracts for API accuracy and CLI behavior.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__progressive-harness/repo/main.py` — CLI entry point; add the cpp-evaluation command here or route to a small helper module from here.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__progressive-harness/repo/seats_aero.py` — award API wrapper and known `destination_airport` behavior.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__progressive-harness/repo/google_flights.py` — cash-fare wrapper.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__progressive-harness/repo/README.md` and `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__progressive-harness/repo/pyproject.toml` — setup and runtime-version constraints.

# Verification command/check

For the planned implementation, verify in layers:

1. Pure math check for cpp helper with known numbers, e.g. cash fare $491, taxes $5.60, 30,000 miles should report about 1.62 c/p: `(491 - 5.60) / 30000 * 100`.
2. Existing non-network/local CLI smoke checks from the repo root:
   - `uv run main.py get-timeline`
   - `uv run main.py visa-check`
3. API/cash wrapper checks when credentials/network are available:
   - `uv run main.py check-flights`
   - `uv run main.py search-cash SEA TYO 2026-05-01`
4. If ruff is installed or added as a dev dependency, run `uv run ruff check .` because `EVALUATION.md` names ruff as the code-quality gate.

# Context Evidence

1. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__progressive-harness/prompt.md` for eval instructions.
2. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__progressive-harness/repo/NOW.md` first as the required always-read session layer.
3. Read concise `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__progressive-harness/repo/CONTEXT.md` directly as the always-read durable layer.
4. Ran `node scripts/context-index.js hydrate "plan next implementation step"` from the repo copy. Hydrate selected cards: `ctx-now-now`, `ctx-context-project`, `ctx-context-project-overview`, `ctx-context-operating-constraints`, `ctx-context-project-structure`.
5. Read selected card files before raw bulky/project-specific context: `.context-harness/cards/ctx-now-now.md`, `ctx-context-project.md`, `ctx-context-project-overview.md`, `ctx-context-operating-constraints.md`, `ctx-context-project-structure.md`.
6. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__progressive-harness/repo/AGENTS.md` for the generated Context Index.
7. Attempted to read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__next-step__progressive-harness/repo/PLAN.md`; it does not exist.
8. Ran read-only file listing with `find .../repo -maxdepth 3 -type f | sort` to locate actual planning and source files.
9. Ran `git -C .../repo status --short`; it reported parent-worktree changes outside this repo copy, so I did not treat it as project-source evidence.
10. Read `PLANS.md`, `ACTIVE_SEARCH.md`, `FINDINGS.md`, `EVALUATION.md`, `TIMELINE.md`, `pyproject.toml`, `README.md`.
11. Read `main.py`, `seats_aero.py`, `google_flights.py`, and `verify_fb.py` to identify integration and verification points.

# Confidence and why

Confidence: high for the next-step recommendation. The evidence is consistent across `NOW.md`, `PLANS.md`, and `ACTIVE_SEARCH.md`: migration is complete, no blockers are recorded, the CLI already has award and cash-search building blocks, and cpp/caching is the remaining unchecked implementation item. Confidence is medium on exact verification commands because the repo itself flags verification ambiguity and the Python version documentation conflicts with `pyproject.toml`.
