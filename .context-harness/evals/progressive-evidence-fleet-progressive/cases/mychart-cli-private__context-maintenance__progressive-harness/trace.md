Read/command trace for eval case:

1. Read `repo/NOW.md` first.
   - Found schema v3.
   - Current focus: auditing whether `mychart-cli` can be made public.
   - Blockers: do not make existing repo public as-is; fixtures/history contain patient/family identifiers and live-run medical-context notes; sensitive local paths must remain gitignored.
   - Immediate next step: choose sanitized no-history snapshot vs full history rewrite plus verification.

2. Read concise always-read `repo/CONTEXT.md`.
   - Found schema v3 and required durable sections: Project, Structure, Operating Constraints, Workflow, Language, Relationships, Flagged Ambiguities, Learned Patterns.
   - Key constraints: no mixed patient profiles, no swallowed extraction/storage/sync/export errors, no hardcoded secrets/patient data, no public release from current history, run `node --test tests/*.test.mjs` before behavior-complete claims.
   - Noted non-blocking drift: imported legacy Agent Guide and awkwardly wrapped constraint bullets.

3. Read `repo/AGENTS.md`.
   - Found schema v3 Context Contract and generated Context Index.
   - Routing rules: durable lessons/invariants to `CONTEXT.md`; task-local findings/decisions to `PLAN.md`; update index with `node scripts/context-index.js update` after context edits; update `NOW.md` before ending.

4. Ran from `repo/`:
   - `node scripts/context-index.js hydrate "update context after completed task"`
   - Hydrate selected 7 cards: `ctx-plan-completed`, `ctx-now-now`, `ctx-context-operating-constraints`, `ctx-plan-current-direction`, `ctx-plan-remaining`, `ctx-context-language`, `ctx-context-relationships`.

5. Opened selected cards:
   - `.context-harness/cards/ctx-plan-completed.md`: completed CLI/storage/live-harness/export migration work.
   - `.context-harness/cards/ctx-plan-current-direction.md`: AwesomeMyChart is now an agent CLI, not Chrome extension.
   - `.context-harness/cards/ctx-plan-remaining.md`: public release blocked until sanitized snapshot or verified history rewrite.
   - `.context-harness/cards/ctx-context-operating-constraints.md`: durable safety constraints.
   - `.context-harness/cards/ctx-context-relationships.md`: AGENTS small activation layer, CONTEXT durable source, Baby compatibility boundary.

6. Read `repo/PLAN.md` after hydrate/cards.
   - Confirmed completed migration bullets and remaining public-release blocker.

Save/update routing I would perform, without editing repo files in this eval:
- `NOW.md`: current focus/blockers/next step/touched files for post-audit release decision.
- `PLAN.md`: task-local completed audit scope/results and remaining release blocker.
- `CONTEXT.md`: durable invariant only: existing repo/history not public-safe; sensitive MyChart data/credentials/profiles/raw exports stay local; CLI/no-built-in-AI direction remains.
- Generated index/cards/`AGENTS.md`: refresh via `node scripts/context-index.js update`, not manual edits.

Verification to recommend:
- Context maintenance: `node scripts/context-index.js update`; `node scripts/context-index.js hydrate "update context after completed task"`; inspect `git diff -- NOW.md CONTEXT.md PLAN.md AGENTS.md .context-harness/cards`.
- Product behavior for future code changes: `node --test tests/*.test.mjs`.
- Public release: separate privacy scan over current tree and intended published history before changing visibility.
