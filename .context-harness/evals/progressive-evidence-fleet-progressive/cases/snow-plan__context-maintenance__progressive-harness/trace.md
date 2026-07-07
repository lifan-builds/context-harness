# Trace

- Read `prompt.md` and followed the eval constraint to work only in the case directory and use `repo/` as the project root.
- Listed `repo/` to locate `NOW.md`, `CONTEXT.md`, `FINDINGS.md`, `PLANS.md`, and scripts.
- Read `NOW.md` first for project state: flight tracking automation stopped; manual Jan-Mar 2027 ski-air pricing is next; no blockers.
- Read concise `CONTEXT.md` as always-read layer: project purpose, constraints, workflow, language, relationships, flagged ambiguities, learned patterns.
- Ran hydrate from the eval repo root:
  `cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/snow-plan__context-maintenance__progressive-harness/repo && node scripts/context-index.js hydrate "update context after completed task"`
- Hydrate selected cards: `ctx-now-now`, `ctx-context-development-workflow`, `ctx-context-operating-constraints`, `ctx-context-language`, `ctx-context-relationships`, `ctx-context-learned-patterns`, `ctx-context-learned-patterns-1`.
- Opened selected cards before any bulky/raw context: `ctx-now-now`, `ctx-context-development-workflow`, `ctx-context-operating-constraints`, `ctx-context-relationships`, `ctx-context-learned-patterns`.
- Read `FINDINGS.md` for detailed manual flight-watch evidence: seed baselines, route/date details, reward scan, Hermes archive and Discord/Wi-Fi note.
- Read `AGENTS.md` for context routing: durable lessons to `CONTEXT.md`, task-local findings/decisions to `PLAN.md`, update index after `CONTEXT.md`, update `NOW.md` before ending. Noted ambiguity because repo has `PLANS.md` not `PLAN.md`.
- Read `README.md`, `PLANS.md`, `package.json`, and listed `scripts/` to confirm repo structure and available verification commands.
- Read-only inspection only; no files in `repo/` were modified.

Save/update routing I would perform:
- `NOW.md`: post-task focus, blockers, next step, touched files.
- `CONTEXT.md`: durable rules/lessons only: manual watch status, stale-price constraint, Alaska-affiliated meaning, required flight-finding fields, Seats.aero API detail, removed Hermes job reference if useful.
- `FINDINGS.md`: detailed price/award evidence, seed baselines, buy/hold triggers, sources, Hermes/Discord diagnostic notes.
- `PLANS.md`: optional completed-progress/outcome note, pending cleanup for `PLAN.md` vs `PLANS.md` wording.
- After actual `CONTEXT.md` edits: `node scripts/context-index.js update`, then hydrate to sanity-check cards. If scripts changed, also run `python3 -m py_compile scripts/*.py`.
