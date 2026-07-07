# Trace notes

- Read eval prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__context-maintenance__progressive-harness/prompt.md`.
- Used repo root: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__context-maintenance__progressive-harness/repo`.
- Read order followed: `NOW.md` first, then `AGENTS.md` and concise `CONTEXT.md`.
- Hydrate command run from repo root: `node scripts/context-index.js hydrate "update context after completed task"`.
- Hydrate selected cards: `ctx-now-now`, `ctx-plan-done-criteria`, `ctx-plan-findings-device`, `ctx-context-operating-constraints`, `ctx-plan-discoveries-from-prep-2026-05-15`, `ctx-plan-execution-plan-when-device-is-connected`, `ctx-plan-open-questions-deferred-until-evidence-demands-an-answer`.
- Opened selected PLAN cards before raw `PLAN.md` sections.
- Searched non-sensitive repo files with `rg -n "Classes|classes|experience=9|workout_programs|Program Start|Start" ... --glob '!analysis/**' --glob '!network/**' --glob '!backups/**'`.
- Read relevant raw sections: `PLAN.md` lines 1-120 and 150-186; `FINDINGS.md` lines 190-269; `PLANS.md` lines 50-109.
- Ran `node scripts/context-index.js check`; result: `FAIL AGENTS.md Context Index is stale; run node scripts/context-index.js update`; warning: `PLAN.md has 186 lines; consider a Dream/Compact pass`.
- Listed `scripts/` and searched `verify_?catalog|verifycatalog|verify_chain_alive`; found `scripts/verify_chain_alive.sh`, but `scripts/verify_catalog_populated.sh` is referenced in `PLAN.md`/`PLANS.md` and absent.

Save/update routing I would perform:
- `FINDINGS.md`: ensure Discovery #16 remains the durable Classes audit record.
- `PLAN.md`: record Classes audit completion, remove/defer Classes local-cache path, keep Program Start as next active work, keep verification current.
- `NOW.md`: current focus/blockers/next step after completed audit.
- `PLANS.md`: top-level Track 7 checklist is stale; update Pulse fixed and Classes audited / missing source.
- `CONTEXT.md`: no required update; optional durable mapping only if future work needs `Class -> experience=9` in always-read context.
- After edits: run `node scripts/context-index.js update` then `node scripts/context-index.js check`.

Verification to run next:
- Context: `node scripts/context-index.js update && node scripts/context-index.js check`.
- Device/runtime: `./scripts/verify_chain_alive.sh`.
- Classes evidence if rechecking: live tablet sqlite counts for `experience=9` in `Workouts`, `PushProgramWorkouts`, `WorkoutHistory`, plus March snapshot sqlite counts.
- Track 7 shipping: create/update and run `scripts/verify_catalog_populated.sh` before considering done criteria satisfied.
