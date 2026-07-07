## Current understanding

This repository is the canonical source for `context-harness`, a lightweight project-memory layer built around four generated files (`AGENTS.md`, `CONTEXT.md`, `NOW.md`, `PLAN.md`), companion skills, and Node-based lifecycle scripts. In this no-harness eval copy, the context files are intentionally absent, so the active state has to be inferred from remaining repository files.

The active work appears to be release-readiness closeout rather than a new implementation milestone. `RELEASE_GOAL.md` says the release goal is to make Context Harness understandable, installable/copyable, verifiable, and backed by proof that a fresh agent can resume work. It lists remaining release gaps as proof, examples, demo artifact, and README positioning. The current checked-in repo evidence suggests those gaps have largely been implemented: `README.md` has a Proof section linking `examples/cold-resume-demo.md`, `tests/run-all.sh` contains release-proof tests for companion skill behavior and packaging, and the cold-resume demo artifact exists.

## Active blockers or uncertainty

- `NOW.md`, `PLAN.md`, `CONTEXT.md`, `AGENTS.md`, and `.context-harness/` are intentionally omitted, so there is no authoritative current focus or plan beyond `RELEASE_GOAL.md`, README, tests, and skill files.
- `RELEASE_GOAL.md` may be stale: its Current State says proof/demo/README polish remain, but `README.md`, `examples/cold-resume-demo.md`, and `tests/run-all.sh` show those items are now present and verified.
- `node scripts/context-index.js check` should be run in the real source checkout that has context files, not in this no-harness eval copy, because this copy intentionally omits the files that command validates.

## Immediate next step

Do a release closeout pass instead of starting new implementation work:

1. In the real repository checkout, run the release verification commands:
   - `tests/run-all.sh`
   - `node scripts/context-index.js check`
2. If both pass, reconcile the release-tracking state so it no longer claims proof/demo/README work is still missing. Inspect and update the active plan/current-state files in the real repo (`PLAN.md`, `NOW.md`, and possibly `RELEASE_GOAL.md`) to record that release proof, demo artifact, README proof positioning, explicit-only upgrade behavior, set-goal shape, and deprecated-stub removal are complete.
3. If `node scripts/context-index.js check` reports stale generated context, run `node scripts/context-index.js update` in the real repo and rerun the check.
4. Leave deployment/fleet refresh as a separate explicit follow-up, because `context-upgrade/SKILL.md` treats deployment and installed-copy refresh as explicit operator work.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__next-step__no-harness/repo/RELEASE_GOAL.md` — release objective, Done Means, milestones, and stale-looking remaining-gap statement.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__next-step__no-harness/repo/README.md` — current product positioning and Proof section.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__next-step__no-harness/repo/examples/cold-resume-demo.md` — cold-resume demo artifact named by the release goal.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__next-step__no-harness/repo/tests/run-all.sh` — verification suite, including release-proof and skill-packaging checks.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__next-step__no-harness/repo/context-catch-up/SKILL.md` — proves catch-up is fresh-session/true-resume only.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__next-step__no-harness/repo/context-maintain/SKILL.md` — owns ongoing updates, closeout, plan stress-test, Dream/Compact.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__next-step__no-harness/repo/context-upgrade/SKILL.md` and `context-upgrade/agents/openai.yaml` — explicit-only upgrade/deployment workflow.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__next-step__no-harness/repo/set-goal/SKILL.md` — long-running goal shape and closeout requirements.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__next-step__no-harness/repo/context-init/SKILL.md` — confirms init does not repair existing layouts.

## Verification command/check

Run from the real source checkout:

```bash
tests/run-all.sh
node scripts/context-index.js check
```

For this eval copy, I ran the read-only suite from the isolated repo and observed `Total: 201 | Pass: 201 | Fail: 0 | Skip: 0`. That supports closeout readiness for the source files present here. The context-index check is still needed in the real checkout because this no-harness copy intentionally omits context files.

## Context Evidence

- `RELEASE_GOAL.md` lines 1-7 define the release-readiness goal; lines 24-32 require proof fixtures/tests and a cold-resume demo; lines 56-57 still say proof/examples/demo/README positioning are remaining gaps; lines 88-105 list the intended verification and manual checks.
- `README.md` lines 74-83 now includes a Proof section pointing to the cold-resume demo, `tests/run-all.sh`, `node scripts/context-index.js check`, and the proof areas covered.
- `examples/cold-resume-demo.md` lines 18-62 shows the intended fresh-agent trace and says the correct next action is to implement remaining release-proof work, run verification, then update `PLAN.md` and `NOW.md`; this may also be slightly stale now that tests pass.
- `tests/run-all.sh` lines 826-892 define release-proof artifact tests for catch-up timing, maintain routing, Dream/plan stress-test ownership, explicit-only upgrade, set-goal shape, removed stubs, context-init behavior, obsolete script removal, and cold-resume demo presence.
- `tests/run-all.sh` lines 898-992 define skill-packaging checks for shipped/removed skills and explicit-only upgrade metadata.
- `context-catch-up/SKILL.md` lines 10-17 restrict catch-up to fresh-session or true-resume boundaries and route ongoing updates to maintain.
- `context-maintain/SKILL.md` lines 14-45 and 198-209 define ongoing maintenance and closeout, including rewriting `NOW.md` and refreshing indexes after context changes.
- `context-upgrade/SKILL.md` lines 1-10 and `context-upgrade/agents/openai.yaml` lines 5-6 make upgrade explicit-only; `context-upgrade/SKILL.md` lines 75-80 list source-change verification commands.
- `set-goal/SKILL.md` lines 22-105 contains goal, Done Means, context, constraints, milestones, verification, loop rules, and closeout shape.
- `tests/run-all.sh` completed successfully in this isolated copy with 201 passing checks.

## Confidence and why

High confidence that the next step is closeout verification, not new proof implementation, because the files that `RELEASE_GOAL.md` calls for are present, the README already advertises them, the release-proof tests cover them, and the full test suite passes in the isolated copy. Confidence is not absolute because the no-harness eval intentionally omits `NOW.md` and `PLAN.md`, so the real checkout may contain newer active-state context or deployment blockers that are not visible here.
