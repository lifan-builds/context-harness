# Trace notes

- Read eval prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/self-promoting__cold-resume__progressive-harness/prompt.md`.
- Read first in repo: `NOW.md`.
  - Focus: refreshed Context Harness promotion plan around July 2026 Operating Constraints, fleet migration, Agent Nexus deployment, and post-migration eval proof.
  - Blocker: none locally; external publishing needs concise screenshot/GIF of context cards, hydrate, or eval table.
  - Next: review `drafts/context-harness-twitter.md`, then adapt to DEV/Hashnode.
- Read concise always-read context: `CONTEXT.md`.
  - Confirmed schema v3, project purpose, structure, operating constraints, workflow, language, relationships, ambiguities, learned patterns.
  - Verification commands noted: `python scripts/reach_check.py`, `python scripts/chrome_reach_check.py`; context index update command after context edits: `node scripts/context-index.js update`.
- Read activation/index file: `AGENTS.md`.
  - Confirmed schema v3 Context Contract and generated Context Index.
- Ran hydrate from case repo root:
  - `cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/self-promoting__cold-resume__progressive-harness/repo" && node scripts/context-index.js hydrate "resume current task"`
  - Selected cards: `ctx-now-now`, `ctx-context-relationships`.
- Read selected cards before any bulky/task-specific context:
  - `.context-harness/cards/ctx-now-now.md`
  - `.context-harness/cards/ctx-context-relationships.md`
- Did not open raw chunks or bulky plan sections; selected cards plus `NOW.md`/`CONTEXT.md` were enough for the requested report.
- Did not read `expected.json`, `score.json`, run `manifest.json`, or eval reports.
- Did not modify files inside `repo/`.
- Wrote only case outputs: `result.md` and `trace.md`.

Save/update routing I would perform if continuing after this read-only eval:
- Promotion task-local findings/decisions -> `PLANS.md`.
- Durable project corrections, constraints, terms, or workflows -> `CONTEXT.md`, then run `node scripts/context-index.js update`.
- Session closeout/current focus changes -> `NOW.md`.
