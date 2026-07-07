# Current understanding

`mychart-cli` is now an agent-facing local Node/Puppeteer CLI for MyChart sync, local JSON storage, and export. The active work is not another feature implementation; it is deciding and executing a safe public-release/closeout path. The repo must not be made public as-is: current fixtures and historical commits are reported to contain patient/family-like identifiers and live-run medical-context notes.

# Active blockers or uncertainty

- Blocker: existing GitHub history is not public-safe. Changing `lifan-builds/mychart-cli` visibility before sanitization would expose sensitive historical content.
- Blocker: current fixtures/tests still need sanitization or replacement with synthetic-only data.
- Operational constraint: credentials, browser profiles, `.awesome-mychart/`, raw exports, Baby `mychart-imports/`, and any patient data must remain local and gitignored.
- Product constraint: do not reintroduce built-in Ask AI or LLM provider wiring; keep the project scoped to local sync/storage/export.
- Uncertainty to resolve before release: choose between a sanitized no-history public snapshot and a full history rewrite. Given the current blocker, the safer immediate path is a sanitized no-history snapshot.

# Immediate next step

Plan and prepare a sanitized no-history public snapshot as the default closeout path, without changing visibility of the existing private repo.

Concrete next actions:
1. Create a separate clean release candidate from the current working tree, excluding `.git`, local profiles, `.awesome-mychart/`, raw exports, and any ignored local medical data.
2. Replace or remove all current fixture/test content that contains patient/family-like identifiers; use synthetic names, dates, IDs, and clinical text only.
3. Inspect package/release metadata and docs for public-facing readiness, especially `package.json`, `README.md`, `PRIVACY.md`, `EVALUATION.md`, `.env.example`, `.gitignore`, `docs/live-harness.md`, and tests.
4. Keep `package.json` private until the sanitized snapshot and public repo path are verified; only then decide whether `"private": true` should remain or be changed.
5. Make the first public commit only after the snapshot passes content and behavior checks.

# Relevant files

- `NOW.md` — active blocker and immediate release-path decision.
- `CONTEXT.md` — project purpose, constraints, workflow, and public-release warning.
- `PLAN.md` — completed CLI migration and remaining release blocker.
- `package.json` — CLI/test scripts and current `"private": true` setting.
- `.gitignore`, `.env.example`, `PRIVACY.md`, `README.md`, `EVALUATION.md`, `docs/live-harness.md` — public-release and sensitive-data boundary review.
- `tests/*.test.mjs` — likely fixture locations to sanitize while preserving regression coverage.
- `src/cli.mjs`, `src/browser/`, `src/core/`, `src/storage/`, `src/extraction/` — behavior should stay scoped to local sync/storage/export.

# Verification command/check

For the sanitized snapshot candidate:

```bash
npm run mychart -- --help
node --test tests/*.test.mjs
npm pack --dry-run
rg -n -i "(<known patient/family names>|mrn|dob|patient id|access token|api[_-]?key|password|bearer|mychart-imports|\.awesome-mychart|browser_profiles)" --glob '!package-lock.json'
git log --all --name-only --oneline
```

Expected checks:
- CLI help works and tests pass.
- `npm pack --dry-run` contains only intended public files.
- Content scan finds no real patient/family identifiers, credentials, raw exports, browser profiles, or local store paths beyond documentation/gitignore examples.
- Git history in the public candidate contains only the sanitized initial history. If choosing the history-rewrite path instead, run equivalent full-history scanning on every rewritten commit before changing GitHub visibility.

# Context Evidence

Used in order:
1. `prompt.md` from the eval case.
2. `repo/NOW.md` — current focus, blockers, immediate next step.
3. `repo/CONTEXT.md` — project structure, operating constraints, workflow, relationships, release ambiguity.
4. `repo/AGENTS.md` — context contract and Context Index.
5. `cd repo && node scripts/context-index.js hydrate "plan next implementation step"` — selected cards: `ctx-plan-completed`, `ctx-plan-current-direction`, `ctx-plan-remaining`, `ctx-now-now`, `ctx-context-operating-constraints`, `ctx-context-relationships`, `ctx-context-context-contract`.
6. Selected cards opened before raw plan: `.context-harness/cards/ctx-plan-current-direction.md`, `.context-harness/cards/ctx-plan-remaining.md`, `.context-harness/cards/ctx-plan-completed.md`, `.context-harness/cards/ctx-context-operating-constraints.md`.
7. `repo/PLAN.md` — confirmed completed CLI migration and remaining public-release blocker.
8. `repo/FINDINGS.md`, `repo/package.json`, and read-only listing/search commands for supporting release-planning context.

No context save/update routing performed because this is a read-only eval. In a normal session, after the user chooses the release path I would route task-local decisions/progress to `PLAN.md` and update `NOW.md` before closeout.

# Confidence and why

Confidence: high for the next step. `NOW.md`, `CONTEXT.md`, selected plan cards, and `PLAN.md` all point to the same active blocker: do not publish the existing repo/history; choose a sanitized snapshot or verified history rewrite. Confidence is lower on exact fixture locations because this read-only eval did not inspect sensitive fixture contents; the next implementation step should deliberately inventory and sanitize them without copying sensitive values into context.