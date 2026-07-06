# Fresh Agent Eval Result

## Current understanding
- The active work in `NOW.md` says the context-harness v3 migration for `flight-plan` is completed, with no recorded blockers, and the next step is to use `AGENTS.md`/`CONTEXT.md` before planning or editing.
- The repository itself is a small Python CLI (`main.py`) for timeline parsing, visa checks, Seats.aero award checks, and Google Flights cash fare lookup. `PLANS.md` marks the basic CLI and Seats.aero bug fix complete, with the remaining product backlog item: automated caching and cents-per-point evaluation.
- The active travel workflow in `ACTIVE_SEARCH.md` is CFH SEA to PVG/SHA/HGH in Apr-May 2026, preferably via Japan, with next research steps to evaluate point balances, check TYO -> China cash fares, and calculate c/p against the >1.5 c/p economy threshold.

## Active blockers or uncertainty
- Context-harness closeout is not fully clean: the required command `node scripts/context-index.js hydrate "plan next implementation step"` fails because this repo's `scripts/context-index.js` only supports `update|list|query|section|check`.
- `node scripts/context-index.js check` also fails with `FAIL AGENTS.md Context Index is stale; run `node scripts/context-index.js update`.` This should be resolved before treating the v3 migration as fully closed.
- For the product feature, implementation details are still uncertain around where cached award/cash search results should live, how stale they may be, and whether c/p should compare against direct-to-China cash fares, Japan-positioning cash fares, or both.

## Immediate next step
- Close out the context-harness migration first, before product work:
  1. Inspect `scripts/context-index.js`, `scripts/lib.js`, `AGENTS.md`, and `CONTEXT.md` to determine whether this repo should add `hydrate` support or update the instructions to the supported `query`/`section` workflow.
  2. Regenerate/fix the AGENTS Context Index so `node scripts/context-index.js check` passes.
  3. Only after the harness is internally consistent, plan the product backlog item: add a CLI flow that combines Seats.aero award results and Google Flights cash fares into a cached c/p evaluation for the active CFH search.

## Relevant files
- `NOW.md` — says the migration is completed and points future agents to the Context Index.
- `AGENTS.md` — contains the context contract and the generated Context Index, but currently references `hydrate`.
- `CONTEXT.md` — source of durable project rules, workflow, booking principles, and project overview.
- `scripts/context-index.js` — current CLI lacks `hydrate` support and reports stale index state via `check`.
- `scripts/lib.js` — likely shared helper surface to inspect if implementing or aligning context-index behavior.
- `PLANS.md` — product backlog says the next implementation item is automated caching and c/p evaluation.
- `ACTIVE_SEARCH.md` — contains the concrete CFH route/date criteria and c/p research requirements.
- `main.py`, `seats_aero.py`, `google_flights.py` — likely files to inspect/edit for the eventual c/p CLI implementation.

## Verification command/check
- Harness closeout verification:
  - `node scripts/context-index.js check`
  - If `hydrate` remains in the contract, also verify: `node scripts/context-index.js hydrate "plan next implementation step"`
- Product implementation verification after the harness is clean:
  - `uv run python main.py check-flights`
  - `uv run python main.py search-cash SEA TYO 2026-05-01`
  - Add/run the eventual c/p command against one known active CFH route/date and confirm it reports cash fare, award miles/taxes, calculated c/p, cache hit/miss status, and whether economy clears the >1.5 c/p threshold.

## Confidence and why
- Confidence: medium-high. The next closeout step is strongly supported by the failed required hydrate command and failed `context-index.js check`; the product next step is also clearly listed in `PLANS.md` and `ACTIVE_SEARCH.md`.
- The main uncertainty is whether the preferred fix is to add `hydrate` to this repo's `scripts/context-index.js` or to update the context contract to the older supported commands; that choice requires an implementation pass and comparison with the current context-harness standard.
