## Current understanding

The completed task was OpenAI interview-prep maintenance for the applied `Senior Software Engineer, Infrastructure` role in Bellevue, likely Statsig infrastructure. The repo now has:

- `interview-prep/openai-seen-questions.md`: extracted visible OpenAI interview questions plus lower-confidence online enrichment.
- `interview-prep/openai-recruiter-round-statsig-infrastructure.md`: focused recruiter-screen guide.
- `interview-prep/README.md`: lists both OpenAI prep files.
- `NOW.md`: already records the completed work and the next prep step.

The key framing to preserve is: this OpenAI role should be treated as Statsig / experimentation / rollout / dynamic config / analytics / observability infrastructure, not primarily an LLM eval role.

## Active blockers or uncertainty

- No blocker for continuing recruiter-round prep.
- Source screenshots were incomplete: pages `1/13` and `13/13` were missing; keep this caveat with the extracted-question artifact.
- Harness drift exists: `node scripts/context-index.js check` currently fails because `AGENTS.md` Context Index is stale. It also warns `NOW.md` is 32 lines and should be compacted.
- File-name convention is inconsistent: the repo has `PLANS.md`, while `AGENTS.md`, the prompt, and `scripts/context-index.js check` refer to `PLAN.md`. For this repo, use `PLANS.md` unless/until the project explicitly migrates.

## Immediate next step

Update context in the smallest places:

1. Compact/update `NOW.md` to a short resume packet:
   - current focus: OpenAI recruiter-screen prep for Senior SWE Infrastructure / Statsig infra;
   - next action: rehearse 30-second pitch, Why OpenAI, Why Statsig infra, and three stories;
   - blocker/caveat: missing screenshot pages `1/13` and `13/13`;
   - touched files: the two OpenAI prep docs, `interview-prep/README.md`, and `NOW.md`;
   - current timestamp.
2. Update `PLANS.md` with task-local history:
   - `Progress`: completed OpenAI screenshot question extraction and recruiter-round guide on 2026-07-06;
   - `Surprises & Discoveries`: screenshot set was missing first/last pages; online interview-question enrichment is lower confidence than extracted screenshots;
   - `Decision Log`: frame this role as Statsig/experimentation/rollout infrastructure rather than LLM eval;
   - optionally `Outcomes & Retrospective`: recruiter-round prep is ready for rehearsal.
3. Do not update `CONTEXT.md` for this task unless the user wants the OpenAI/Statsig framing promoted as a durable repo-wide rule. The concrete evidence already belongs in `job-search/openings.md`, the application manifest, and the interview-prep files.
4. After any context edit, repair generated context metadata with `node scripts/context-index.js update`.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/resume__context-maintenance__progressive-harness/repo/NOW.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/resume__context-maintenance__progressive-harness/repo/CONTEXT.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/resume__context-maintenance__progressive-harness/repo/AGENTS.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/resume__context-maintenance__progressive-harness/repo/PLANS.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/resume__context-maintenance__progressive-harness/repo/interview-prep/openai-seen-questions.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/resume__context-maintenance__progressive-harness/repo/interview-prep/openai-recruiter-round-statsig-infrastructure.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/resume__context-maintenance__progressive-harness/repo/interview-prep/README.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/resume__context-maintenance__progressive-harness/repo/job-search/openings.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/resume__context-maintenance__progressive-harness/repo/job-search/applications/openai-senior-software-engineer-infrastructure-seattle-2026-06-30/manifest.md`

## Verification command/check

After making the context updates, run:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/resume__context-maintenance__progressive-harness/repo
node scripts/context-index.js update
node scripts/context-index.js check
node scripts/context-index.js hydrate "resume OpenAI recruiter prep"
node scripts/context-index.js hydrate "update context after completed task"
```

Expected result: `check` should no longer fail on stale `AGENTS.md`; hydrate should surface `NOW.md` and the relevant operating/agent-workflow cards without needing raw bulky sections. If `NOW.md` remains over the warning threshold, compact it further.

Manual checks:

- Confirm `interview-prep/README.md` lists both OpenAI files.
- Confirm `job-search/openings.md` and the application manifest still support the OpenAI role facts used by the recruiter guide.
- Confirm `NOW.md` points the next agent to rehearsal, not back to completed extraction work.

## Context Evidence

Used in order:

1. Read `prompt.md` for the eval instructions.
2. Invoked `context-catch-up` because this is a fresh-agent resume/catch-up task.
3. Read `NOW.md` first.
4. Read concise `CONTEXT.md` as the always-read layer.
5. Read `AGENTS.md` Context Contract and Context Index.
6. Ran `node scripts/context-index.js hydrate "update context after completed task"`.
7. Hydrate selected cards: `ctx-now-now`, `ctx-context-agent-workflows`, `ctx-context-operating-constraints`, `ctx-context-language`, `ctx-context-relationships`, `ctx-context-learned-patterns`.
8. Opened selected card files before raw bulky context.
9. Listed repo root to confirm the actual plan file is `PLANS.md`.
10. Read `PLANS.md`.
11. Read relevant artifacts: `interview-prep/README.md`, `interview-prep/openai-recruiter-round-statsig-infrastructure.md`, `interview-prep/openai-seen-questions.md`, `job-search/openings.md`, and the OpenAI application manifest.
12. Inspected `scripts/context-index.js` around `checkHarness` after observing plan-file naming inconsistency.
13. Ran `node scripts/context-index.js check`; result: warning for bulky `NOW.md`, failure for stale `AGENTS.md` Context Index.
14. Invoked `context-maintain` to classify routing, but did not edit repo files because this eval is read-only.

## Confidence and why

High. `NOW.md`, the OpenAI prep files, `job-search/openings.md`, and the application manifest agree on the active OpenAI recruiter-prep state and role evidence. The context-routing recommendation follows the repo’s own contract: active resume packet to `NOW.md`, task-local findings/decisions to the plan file, durable rules only to `CONTEXT.md`, then regenerate/check the context index.
