## Current understanding

Context Harness is being prepared as a release-ready, lightweight project-memory layer for coding agents: four visible files (`AGENTS.md`, `CONTEXT.md`, `NOW.md`, optional `PLAN.md`), progressive retrieval via `scripts/context-index.js hydrate`, Node.js runtime scripts, and companion skills split by invocation intent. The active release focus appears to be release-readiness hardening around skill invocation timing, explicit-only upgrades, proof artifacts, README positioning, and local verification. `RELEASE_GOAL.md` still says remaining release gaps are proof, examples, demo artifact, and final README positioning, but the current repository copy now contains a README Proof section, a cold-resume demo artifact, and tests that explicitly cover catch-up timing, maintain routing, explicit-only upgrade behavior, set-goal shape, removed legacy stubs, and packaging.

## Active blockers or uncertainty

- No source blocker is visible from the remaining files.
- Uncertainty: this no-harness eval intentionally omits `AGENTS.md`, `CONTEXT.md`, `NOW.md`, `PLAN.md`, and `.context-harness`, so the exact current `NOW.md` state cannot be read.
- `RELEASE_GOAL.md` may be stale: it lists proof/demo/README as remaining gaps, while `README.md`, `examples/cold-resume-demo.md`, and `tests/run-all.sh` indicate those artifacts now exist.
- Verification status is unknown because I did not run the suite; the eval prompt asked for read-only inspection commands only.

## Immediate next step

Run the release verification commands, then close out any stale release state: if checks pass, update the real project `PLAN.md`/`NOW.md` to reflect that proof, demo, and README polish are complete; if checks fail, fix the failing proof or packaging case first.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__cold-resume__no-harness/repo/RELEASE_GOAL.md` — release goal, done means, current state, milestones, verification commands.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__cold-resume__no-harness/repo/README.md` — product positioning, four-file model, proof section, installation/usage, companion skill model.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__cold-resume__no-harness/repo/SKILL.md` — root routing skill, v3 templates, context contract, script inventory.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__cold-resume__no-harness/repo/context-catch-up/SKILL.md` — fresh-session/true-resume-only catch-up workflow.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__cold-resume__no-harness/repo/context-maintain/SKILL.md` — ongoing updates, closeout, plan stress-test, Reflect, Dream/Compact routing.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__cold-resume__no-harness/repo/context-upgrade/SKILL.md` and `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__cold-resume__no-harness/repo/context-upgrade/agents/openai.yaml` — explicit-only upgrade behavior.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__cold-resume__no-harness/repo/set-goal/SKILL.md` — long-running goal prompt shape.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__cold-resume__no-harness/repo/examples/cold-resume-demo.md` — proof artifact showing intended fresh-agent recovery and next action.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__cold-resume__no-harness/repo/tests/run-all.sh` — local verification suite and release-proof assertions.

## Verification command/check

From the real repository root when context files are present:

```bash
tests/run-all.sh
node scripts/context-index.js check
```

In this no-harness isolated copy, `tests/run-all.sh` is the concrete verification suite visible from source; `node scripts/context-index.js check` is still the documented health check but likely requires the omitted real harness files to be meaningful.

## Context Evidence

- `RELEASE_GOAL.md` says the release target is a skeptical-developer-ready Context Harness with clear README, explicit skill invocation timing, proof/tests for `context-catch-up`, `context-maintain`, `context-upgrade`, and `set-goal`, a cold-resume demo, and local verification.
- `RELEASE_GOAL.md` current state says schema v3 is implemented, `context-maintain` owns ongoing maintenance and Dream/Compact, removed stubs are gone, `set-goal` is the long-running workflow, and `context-upgrade` is explicit-only.
- `README.md` now has a Proof section listing `examples/cold-resume-demo.md`, `tests/run-all.sh`, and `node scripts/context-index.js check`, and says proof covers catch-up timing, maintain routing, explicit-only upgrade behavior, set-goal shape, and cold-resume path.
- `tests/run-all.sh` contains release-proof and packaging assertions for the same skill routing and artifact claims.
- `examples/cold-resume-demo.md` names the release-readiness focus and says the correct next action is to run `tests/run-all.sh` and `node scripts/context-index.js check`, then update `PLAN.md` and `NOW.md`.
- `context-upgrade/SKILL.md` includes `disable-model-invocation: true`, and `context-upgrade/agents/openai.yaml` has `allow_implicit_invocation: false`.

## Confidence and why

Medium-high. The main release focus and next verification step are corroborated by `RELEASE_GOAL.md`, `README.md`, `tests/run-all.sh`, and `examples/cold-resume-demo.md`. Confidence is not higher because the eval intentionally removed the normal live context files (`NOW.md`/`PLAN.md`), and `RELEASE_GOAL.md` appears partly stale relative to the proof artifacts now present in the repo copy.
