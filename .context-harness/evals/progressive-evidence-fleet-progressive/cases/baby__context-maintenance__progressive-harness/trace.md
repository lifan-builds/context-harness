Evidence notes for fresh-agent eval:

- Read eval prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/baby__context-maintenance__progressive-harness/prompt.md`.
- Loaded progressive context from repo root in required order:
  1. `NOW.md`
  2. `CONTEXT.md`
  3. `node scripts/context-index.js hydrate "update context after completed task"`
- Hydrate selected cards:
  - `ctx-now-now` (`NOW.md#now`)
  - `ctx-plan-active-maintenance-rules` (`PLAN.md#active-maintenance-rules`)
  - `ctx-plan-verification` (`PLAN.md#verification`)
  - `ctx-context-relationships` (`CONTEXT.md#relationships`)
  - `ctx-context-workflow` (`CONTEXT.md#workflow`)
  - `ctx-context-learned-patterns` (`CONTEXT.md#learned-patterns`)
  - `ctx-context-operating-constraints` (`CONTEXT.md#operating-constraints`)
- Opened selected cards before raw plan detail:
  - `.context-harness/cards/ctx-plan-active-maintenance-rules.md`
  - `.context-harness/cards/ctx-plan-verification.md`
  - `.context-harness/cards/ctx-context-workflow.md`
  - `.context-harness/cards/ctx-context-operating-constraints.md`
- Opened `PLAN.md` after selected cards; no raw chunks were needed.
- Read-only checks run:
  - `node scripts/context-index.js check` -> failed: `AGENTS.md Context Index is stale; run node scripts/context-index.js update`; warning: `NOW.md has 21 lines; consider a Dream/Compact pass`.
  - `git diff --check -- .` -> no output.
  - `rg -n "archive/" AGENTS.md CONTEXT.md INDEX.md README.md NOW.md PLAN.md home-care growth education` -> archive references were routing/boundary references.

Save/update routing I would perform for the completed task:

- `growth/medical.md`: surgical/PICU clinical facts, pathology/lead point, cultures/antibiotics, respiratory/hemodynamic/lab/medication/rhythm course.
- `growth/feeding.md`: NPO/Replogle/ileus status, enteral restart, route/formula, oral practice, ND/NDT/GJ implications.
- `growth/formula-history.md`: dated PPN/SMOF/TPN and formula/milk-source timeline.
- `growth/episode-pattern-investigation.md`: add obstruction/intussusception episode and remaining unresolved hypotheses/results.
- `home-care/discharge-checklist.md`: mark prior 2026-06-30 discharge checklist superseded and track new discharge blockers.
- `NOW.md`: update last after durable files, with current focus/blockers/next step/export metadata/touched files.
- `PLAN.md`: only if active objective/done criteria changed.
- `CONTEXT.md`/`INDEX.md`/`AGENTS.md`/`README.md`: only if routing/workflow changed; then run `node scripts/context-index.js update-all`.

Verification to run after actual updates:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/baby__context-maintenance__progressive-harness/repo
node scripts/context-index.js update-all
node scripts/context-index.js check
git diff --check -- .
rg -n "archive/" AGENTS.md CONTEXT.md INDEX.md README.md NOW.md PLAN.md home-care growth education
```
