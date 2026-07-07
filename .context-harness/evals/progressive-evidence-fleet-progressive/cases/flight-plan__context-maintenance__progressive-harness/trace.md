Evidence notes for fresh-agent eval:

- Read `prompt.md` in the case directory.
- Read repo `NOW.md` first: current focus is “Context-harness v3 migration completed for flight-plan”; blockers none; immediate next step says use generated `AGENTS.md` Context Index.
- Read concise repo `CONTEXT.md`: project identity, operating constraints, workflow placeholders, AGENTS/CONTEXT relationship, verification ambiguity, imported project notes.
- Ran from repo root: `node scripts/context-index.js hydrate "update context after completed task"`.
  - Hydrate output selected cards: `ctx-now-now`, `ctx-context-operating-constraints`, `ctx-context-language`, `ctx-context-relationships`, `ctx-context-learned-patterns`.
- Opened selected cards before broader/bulkier context: confirmed no-secrets constraint, durable-source relationship, migration-complete state, and no learned-pattern content.
- Listed repo/context files with read-only `ls`/`find` to identify context artifacts and project files.
- Read `AGENTS.md`: context contract, generated Context Index, update/hydrate instructions, and routing instruction to `PLAN.md`.
- Read `README.md`, `pyproject.toml`, `EVALUATION.md`: found `uv sync`, CLI commands, `.env` API-key requirement, `check-flights`, and ruff expectation.
- Read `PLANS.md`, `FINDINGS.md`: found ongoing project progress and durable Seats.aero/API findings.
- Opened extra relevant cards: `ctx-context-flagged-ambiguities`, `ctx-context-development-workflow`, `ctx-context-project-overview`.

Save/update routing I would perform after the completed task:

- `NOW.md`: refresh current focus, blockers, immediate next step, last modified time, and touched context files.
- `CONTEXT.md`: update Workflow with concrete `uv`/CLI verification commands; update Structure with main project files; resolve/narrow the verification-command ambiguity; keep secrets out.
- `AGENTS.md` / generated index: regenerate after `CONTEXT.md` updates using `node scripts/context-index.js update`; do not hand-edit generated cards/index.
- `PLANS.md` vs `PLAN.md`: resolve naming mismatch because `AGENTS.md` says task-local notes go to `PLAN.md`, but repo contains `PLANS.md`.
- `.context-harness/cards/*.md` and `.context-harness/index.json`: generated only via `node scripts/context-index.js update`.

Verification to run after updates:

- `node scripts/context-index.js update`
- `node scripts/context-index.js hydrate "update context after completed task"`
- `uv sync`
- `uv run main.py get-timeline`
- `uv run main.py visa-check`
- `uv run main.py check-flights` only if `SEATS_AERO_API_KEY` is present in `.env`
- `uvx ruff check .` if ruff is intended/available
