# Trace Notes

- Read eval prompt: `prompt.md`.
- Followed progressive context order in case repo `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/baby__next-step__progressive-harness/repo`.
- Read `NOW.md` first. Key evidence: active focus is 2026-07-04/06 SCH ED/PICU surgical readmission; next step is next MyChart update and refresh of `growth/medical.md`, `growth/feeding.md`, `growth/formula-history.md`, `growth/episode-pattern-investigation.md`, and `home-care/discharge-checklist.md`.
- Read `AGENTS.md` and `CONTEXT.md`. Schema marker present; loaded routing constraints: no archive reads during normal work, no bulk raw `mychart-imports/`, source-boundary preservation, active updates to `growth/` and `home-care/`, update `NOW.md` after source files.
- Ran hydrate from the case repo: `node scripts/context-index.js hydrate "plan next implementation step"`.
  - Selected card IDs: `ctx-plan-active-maintenance-rules`, `ctx-plan-active-objective`, `ctx-plan-current-done-criteria`, `ctx-plan-verification`, `ctx-now-now`, `ctx-context-structure`, `ctx-context-learned-patterns`.
  - Used selected cards before raw `PLAN.md`; raw `PLAN.md`/chunks were not needed.
- Read selected cards:
  - `.context-harness/cards/ctx-plan-active-maintenance-rules.md`
  - `.context-harness/cards/ctx-plan-active-objective.md`
  - `.context-harness/cards/ctx-plan-current-done-criteria.md`
  - `.context-harness/cards/ctx-plan-verification.md`
  - `.context-harness/cards/ctx-context-structure.md`
  - `.context-harness/cards/ctx-context-learned-patterns.md`
- Read `INDEX.md`. It gave routing tables but the generated content map appears stale: it summarizes `NOW.md` as an old repo-indexing focus and lists an older latest-looking export, conflicting with current `NOW.md`.
- Read domain/source files:
  - `home-care/README.md`
  - `growth/README.md`
  - `home-care/discharge-checklist.md`
  - `growth/medical.md`
  - `growth/feeding.md`
  - `growth/formula-history.md`
  - `growth/episode-pattern-investigation.md`
  - `skills/sync-latest-baby-results/SKILL.md`
- Ran a targeted `rg` over active files for readmission terms; output was too large but preview confirmed current blocker content in `home-care/discharge-checklist.md`.
- Ran `node scripts/context-index.js check` from the case repo. Result: exit 1; warning `NOW.md has 21 lines`; failure `AGENTS.md Context Index is stale; run node scripts/context-index.js update`.
- Did not read `expected.json`, `score.json`, manifest, eval reports, `archive/`, or raw MyChart export bodies.
- Did not modify files under `repo/`.

# Save/update routing I would perform when edits are allowed

1. Pull latest SCH MyChart via `skills/sync-latest-baby-results/SKILL.md` commands, using explicit SCH URL and `/Users/lfan/Project/mychart-cli/.env`; no `--allow-llm`, `--ask-ai`, or `--summarize`.
2. Distill chart facts first into `growth/medical.md` for surgery/PICU, labs, cultures, meds/rhythm, discharge status.
3. Update `growth/feeding.md` for NPO/Replogle, PN/TPN, enteral restart, route/formula/oral-practice/GJ changes.
4. Update `growth/formula-history.md` for nutrition-support/formula timeline changes.
5. Update `growth/episode-pattern-investigation.md` only if new evidence changes episode interpretation, hypothesis ranking, or missing-result priorities.
6. Update `home-care/discharge-checklist.md` for new future-discharge blockers and to keep old home plan superseded until discharge plan returns.
7. Update `NOW.md` last with safe sync metadata, touched files, blockers, and immediate next step.
8. Run `node scripts/context-index.js update-all`, `node scripts/context-index.js check`, and `git diff --check`.
