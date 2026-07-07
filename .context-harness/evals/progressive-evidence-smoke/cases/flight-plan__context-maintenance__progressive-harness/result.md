# Context Maintenance Recommendation

## Current understanding
- The just-completed task was a context-harness v3 migration for the `flight-plan` repo copy at `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo`.
- `NOW.md` records the migration as complete, with no blocker recorded and touched files `AGENTS.md`, `CONTEXT.md`, `NOW.md`, and `scripts/`.
- `CONTEXT.md` is still concise enough to be an always-read layer, but it contains placeholder workflow entries and a broad `Imported Agent Notes` section that should be compacted into normal v3 sections.
- The generated context index is stale: `node scripts/context-index.js check` failed with `FAIL AGENTS.md Context Index is stale; run node scripts/context-index.js update`.
- The repo is a private Python Click CLI for family travel operations. README and source show durable project facts that should be reflected in context: `TIMELINE.md` is the schedule source, `ACTIVE_SEARCH.md` tracks ongoing searches/booking rules, `main.py` is the CLI entry point, and API secrets belong only in `.env` / environment variables.

## Active blockers or uncertainty
- Follow-up blocker for context health: `AGENTS.md` / generated index is stale and needs `node scripts/context-index.js update`, then `node scripts/context-index.js check`.
- Workflow ambiguity: `CONTEXT.md` says setup/run/test/lint are project-specific placeholders; README and `main.py` reveal useful commands, but no explicit lint or unit-test command is documented.
- Version ambiguity: README says Python 3.10+, while `pyproject.toml` requires `>=3.13`.
- README references `.env.example`, but the shallow file listing showed `.env` and no `.env.example`.
- Context-task naming ambiguity: `AGENTS.md` says task-local findings go to `PLAN.md`, but this repo has `PLANS.md`; do not hijack domain/travel planning files for harness task state without deciding whether to create a singular `PLAN.md` or update the contract.

## Immediate next step
Update context files, not repository source files:

1. Rewrite `NOW.md` for closeout/resume state:
   - Current focus: context-harness v3 migration complete; context cleanup/index refresh remains.
   - Active blockers: stale generated index; verification-command ambiguity; Python version mismatch.
   - Immediate next step: update `CONTEXT.md` workflow/constraints, run `node scripts/context-index.js update`, then `node scripts/context-index.js check`.
   - Files touched: `AGENTS.md`, `CONTEXT.md`, `NOW.md`, `scripts/`, generated `.context-harness/` files.

2. Update `CONTEXT.md` durable content:
   - `Project`: describe `flight-plan` as a private local Python CLI for family schedule, visa-day, award-flight, and cash-fare planning.
   - `Structure`: include `TIMELINE.md`, `ACTIVE_SEARCH.md`, `main.py`, `README.md`, `pyproject.toml`, `scripts/`, and `.context-harness/`; remove or de-emphasize stale `data/`-only structure if no longer representative.
   - `Operating Constraints`: keep secrets out of context; keep API keys in `.env`/environment only; treat family schedule/passenger details as private; preserve project-specific instructions during harness changes.
   - `Workflow`: Setup `uv sync`; run/help `uv run main.py --help`; local schedule checks `uv run main.py get-timeline` and `uv run main.py visa-check`; API checks require `SEATS_AERO_API_KEY` and include `uv run main.py verify-api` / `uv run main.py check-flights`; note lint/test are not documented unless discovered later.
   - `Relationships`: `AGENTS.md` is the small activation layer; `CONTEXT.md` is durable source of truth; `TIMELINE.md` is the travel timeline source; `ACTIVE_SEARCH.md` is the active search/booking-rules source; generated `.context-harness/index.json` and cards are rebuilt, not hand-edited.
   - `Flagged Ambiguities`: Python 3.10+ vs `>=3.13`; missing/undocumented `.env.example`; no documented lint/test command; `PLAN.md` vs `PLANS.md` naming.
   - Compact `Imported Agent Notes` into the standard sections above so future agents do not have to read bulky migrated prose.

3. Treat generated files as generated:
   - Do not manually edit `.context-harness/index.json`, cards, or chunks.
   - After any `CONTEXT.md` update, run `node scripts/context-index.js update` to refresh `AGENTS.md` index and generated retrieval files.

4. Task-local closeout:
   - If the migration needs a task record, use a singular `PLAN.md` per the v3 contract or explicitly reconcile `AGENTS.md` with the existing `PLANS.md`; do not put transient migration progress into durable `CONTEXT.md` except durable lessons, constraints, relationships, or workflow facts.

## Relevant files
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo/NOW.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo/CONTEXT.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo/AGENTS.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo/.context-harness/index.json`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo/.context-harness/cards/`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo/README.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo/pyproject.toml`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo/main.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo/TIMELINE.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo/ACTIVE_SEARCH.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo/PLANS.md`

## Verification command/check
Run these after applying the context maintenance updates:

```bash
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo" && node scripts/context-index.js update
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo" && node scripts/context-index.js check
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo" && node scripts/context-index.js hydrate "update context after completed task"
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo" && uv run main.py --help
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo" && uv run main.py get-timeline
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo" && uv run main.py visa-check
```

Optional API-dependent checks only when `SEATS_AERO_API_KEY` is configured:

```bash
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo" && uv run main.py verify-api
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/repo" && uv run main.py check-flights
```

Expected context-health result after maintenance: `node scripts/context-index.js check` should pass, and hydrate should select updated NOW/CONTEXT cards without requiring raw chunks for this task.

## Context Evidence
1. Read eval prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__context-maintenance__progressive-harness/prompt.md`.
2. Read always-first state: `repo/NOW.md`.
3. Read concise always-read layer: `repo/CONTEXT.md`.
4. Ran required hydrate command: `node scripts/context-index.js hydrate "update context after completed task"` from the repo root. Selected cards: `ctx-now-now`, `ctx-context-operating-constraints`, `ctx-context-language`, `ctx-context-relationships`, `ctx-context-learned-patterns`; no raw chunks were indicated as needed.
5. Read selected cards: `.context-harness/cards/ctx-now-now.md`, `.context-harness/cards/ctx-context-operating-constraints.md`, `.context-harness/cards/ctx-context-language.md`, `.context-harness/cards/ctx-context-relationships.md`, `.context-harness/cards/ctx-context-learned-patterns.md`.
6. Listed repo files with `find ... -maxdepth 2 -type f | sort` to identify v3 files, legacy context files, project files, and generated artifacts.
7. Read `AGENTS.md`; it confirmed the v3 contract and generated index guidance.
8. Read `pyproject.toml`; it confirmed Python dependency metadata and `requires-python = ">=3.13"`.
9. Read `README.md`; it confirmed project purpose, setup, CLI usage, privacy rules, and durable Markdown sources.
10. Ran `node scripts/context-index.js check`; it failed because `AGENTS.md` Context Index is stale.
11. Read `main.py`; it confirmed Click commands and which checks are local versus API-dependent.
12. Listed the eval case directory and read empty `result.md` / `trace.md` before writing outputs.

## Confidence and why
High confidence on which context files should be updated and on the stale-index follow-up, because `NOW.md`, `CONTEXT.md`, `AGENTS.md`, hydrate cards, and `context-index.js check` all point to the same maintenance path. Medium confidence on project verification commands because README and `main.py` agree on the main local CLI checks, but lint/test commands are undocumented and API checks depend on a private secret that should not be inspected or exposed.
