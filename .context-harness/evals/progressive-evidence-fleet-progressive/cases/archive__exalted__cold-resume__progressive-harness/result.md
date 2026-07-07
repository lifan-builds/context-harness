# Current understanding

The isolated repo copy is the `exalted` project, a Path of Exile 2 currency arbitrage calculator. The current recorded focus is that the context-harness v3 migration for `exalted` is complete. The app is described as a Next.js/React/TypeScript frontend with Tailwind styling, static JSON market data under `api/data/` and `public/api/data/`, GitHub Actions scraping POE2Scout every 5 minutes, and legacy/reference Python backend code under `backend/`.

# Active blockers or uncertainty

- No active blockers are recorded in `NOW.md`.
- `PLAN.md` is absent, so there is no active implementation plan beyond the catch-up instruction.
- `CONTEXT.md` includes the required v3 sections and schema marker, but also contains a large imported legacy AGENTS section; hydrate worked, so this is not blocking, but future maintenance may want to compact or card-select bulky detail.
- `CONTEXT.md#flagged-ambiguities` says project-specific verification commands are not yet documented. `package.json` provides usable scripts, but the canonical project check is not explicitly recorded in context.

# Immediate next step

For any next coding task, first use the `AGENTS.md` Context Index and `node scripts/context-index.js hydrate "<task>"` to select relevant context sections/cards, then create or update a task-local `PLAN.md` before editing. For the current cold-resume state specifically, the next action is to wait for a concrete project task and use the index-driven context selection before planning or source changes.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/archive__exalted__cold-resume__progressive-harness/repo/NOW.md` — current focus, blockers, next step.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/archive__exalted__cold-resume__progressive-harness/repo/AGENTS.md` — v3 Context Contract and Context Index.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/archive__exalted__cold-resume__progressive-harness/repo/CONTEXT.md` — durable project context, operating constraints, imported legacy project notes.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/archive__exalted__cold-resume__progressive-harness/repo/.context-harness/cards/ctx-now-now.md` — hydrate-selected resume card.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/archive__exalted__cold-resume__progressive-harness/repo/package.json` — available scripts: `dev`, `build`, `start`, `lint`, `dev:old`.
- Project implementation areas identified from context: `src/app/`, `src/components/`, `src/lib/`, `api/data/`, `public/api/data/`, `.github/workflows/`, `scripts/`, and legacy/reference `backend/`.

# Verification command/check

Use a read-only/source-preserving verification appropriate to the task. For a general Next.js app sanity check after source changes, run:

```bash
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/archive__exalted__cold-resume__progressive-harness/repo" && npm run build
```

For lint-only validation, `npm run lint` is also available. I did not run build or lint in this eval because the prompt requested read-only inspection and build commands may create generated output.

# Context Evidence

1. Read eval prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/archive__exalted__cold-resume__progressive-harness/prompt.md`.
2. Invoked `context-catch-up` skill for the isolated repo path; it confirmed the expected v3 catch-up read order.
3. Read `NOW.md` first. Evidence: current focus is v3 migration completed; blockers none; immediate next step is to use generated `AGENTS.md` Context Index before planning/editing.
4. Read `CONTEXT.md` as the always-read layer. Evidence: v3 schema marker present; operating constraints prohibit secrets in context and require preserving project-specific instructions; flagged ambiguity says verification commands are not yet documented; imported notes describe the PoE2 arbitrage app.
5. Read `AGENTS.md`. Evidence: v3 schema marker present; Context Contract says read `NOW.md` first, use Context Index, run `node scripts/context-index.js hydrate "<task>"` before bulky context/plan; index lists relevant `CONTEXT.md` sections and generated cards.
6. Ran `node scripts/context-index.js hydrate "resume current task"` from the repo. Hydrate output selected one card: `ctx-now-now` with source `NOW.md#now`, estimated raw tokens `~91`, open path `.context-harness/cards/ctx-now-now.md`.
7. Read hydrate-selected card `.context-harness/cards/ctx-now-now.md`. Evidence: it repeated the v3 migration-complete focus, no recorded blockers, and the index-first next step.
8. Listed repo root. Evidence: `PLAN.md` was not among root files; implementation/source areas include `src/`, `api/`, `backend/`, `scripts/`, `.github/`, `public/`, plus context files.
9. Checked for `PLAN.md` with a read-only shell test. Output: `PLAN.md missing`.
10. Read `package.json`. Evidence: scripts are `dev`, `build`, `start`, `lint`, and `dev:old`; dependencies include Next.js 16, React 19, TypeScript, Tailwind.

# Confidence and why

Confidence: high for the current focus, blockers, immediate next step, and context-harness state because they are directly recorded in `NOW.md`, `AGENTS.md`, the hydrate-selected card, and `CONTEXT.md`. Confidence: medium for the best verification command because `CONTEXT.md` explicitly says project-specific verification commands are not documented; `package.json` provides practical scripts, but no canonical check is declared in the harness context.
