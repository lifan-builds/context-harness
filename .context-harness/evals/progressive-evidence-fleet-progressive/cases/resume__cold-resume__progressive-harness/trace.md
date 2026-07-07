# Trace

- Read eval prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/resume__cold-resume__progressive-harness/prompt.md`.
- Used repo root: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/resume__cold-resume__progressive-harness/repo`.
- Read context in required order:
  1. `NOW.md` — current OpenAI recruiter-prep focus, blockers, immediate next step, touched files.
  2. `CONTEXT.md` — concise always-read durable context and constraints.
  3. `AGENTS.md` — Context Contract and generated Context Index.
- Ran hydrate from repo root:
  - `node scripts/context-index.js hydrate "resume current task"`
  - Hydrate selected 7 cards: `ctx-context-key-conventions`, `ctx-context-agent-workflows`, `ctx-context-project`, `ctx-context-project-structure`, `ctx-now-now`, `ctx-context-operating-constraints`, `ctx-context-durable-facts`.
- Opened selected cards before bulky context:
  - `.context-harness/cards/ctx-now-now.md`
  - `.context-harness/cards/ctx-context-operating-constraints.md`
  - `.context-harness/cards/ctx-context-key-conventions.md`
  - `.context-harness/cards/ctx-context-agent-workflows.md`
  - `.context-harness/cards/ctx-context-project-structure.md`
- No raw chunks opened; card summaries plus concise `CONTEXT.md` were sufficient.
- Listed repo root to identify `PLANS.md` versus `PLAN.md`, then read `PLANS.md` after hydrate.
- Read task-relevant files:
  - `interview-prep/openai-recruiter-round-statsig-infrastructure.md`
  - `interview-prep/openai-seen-questions.md`
  - `interview-prep/README.md`
  - `job-search/openings.md` excerpt around OpenAI Infrastructure
  - `job-search/applications/openai-senior-software-engineer-infrastructure-seattle-2026-06-30/manifest.md`
- Ran read-only verification command checking prep files and grepping role/application/checklist evidence:
  - confirmed `job-search/openings.md:39`
  - confirmed application manifest submitted date at line 10
  - confirmed recruiter guide checklist heading at line 337
- Non-blocking harness note: `ctx-now-now` card displayed screenshot path as `oaiimages`; source `NOW.md` has `/Users/lfan/Desktop/oai_images`, so source file should be preferred if this path matters.
- Save/update routing if this were not a read-only eval:
  - Update `NOW.md` at closeout with current focus/blockers/next step/touched files.
  - Keep task-local interview prep in `interview-prep/openai-recruiter-round-statsig-infrastructure.md` or `PLANS.md`.
  - Route durable constraints/terms/corrections to `CONTEXT.md`, then run `node scripts/context-index.js update`.
- Wrote final answer to `../result.md` and this trace to `../trace.md` only. No files inside `repo/` were modified.