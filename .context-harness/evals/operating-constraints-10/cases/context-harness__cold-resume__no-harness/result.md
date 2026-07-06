## Current understanding

This repository is the `context-harness` source: a lightweight, portable project-memory layer for coding agents built around four visible generated files (`AGENTS.md`, `CONTEXT.md`, `NOW.md`, optional `PLAN.md`), companion skills, and Node/POSIX runtime scripts. From the source-only files in this no-harness eval copy, the active focus appears to be release-readiness and proof: hardening skill invocation timing, keeping `context-upgrade` explicit-only, proving cold-resume behavior, and adding/validating fresh-agent and progressive context-library evaluation tooling.

Concrete evidence:
- `README.md` positions the product, lists proof artifacts, and names `tests/run-all.sh` plus `node scripts/context-index.js check` as verification.
- `RELEASE_GOAL.md` defines the release-ready goal and says the remaining/recent gaps are proof fixtures, examples/demo artifact, README positioning, and local verification.
- `tests/run-all.sh` includes suites for release proof artifacts, skill packaging, progressive context library behavior, and fresh-agent problem-solving eval preparation/scoring.
- `scripts/eval-agent-problem-solving.js` prepares/scored no-harness vs progressive-harness fresh-agent eval cases.
- `scripts/eval-context-library.js` shadow-tests context library update/check/stats/hydrate behavior across real repos without mutating originals.

## Active blockers or uncertainty

- No concrete source-level blocker is visible in this source-only case.
- Main uncertainty: this eval intentionally omits `AGENTS.md`, `CONTEXT.md`, `NOW.md`, `PLAN.md`, and `.context-harness`, so I cannot read the real current working-memory state or active plan. The exact latest focus/blocker may differ from what `README.md`, `RELEASE_GOAL.md`, tests, and scripts imply.
- `node scripts/context-index.js check` requires a full context-harness project with `CONTEXT.md`/`AGENTS.md`/`NOW.md`; in this no-harness copy it is not expected to pass because those files are intentionally absent.

## Immediate next step

Run the release verification suite from this case repo, then in the full source repo run the context health check where the omitted context files exist:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/context-harness__cold-resume__no-harness/repo && tests/run-all.sh
```

If that passes, verify the full harness context outside this no-harness fixture with:

```bash
node scripts/context-index.js check
```

After verification, the likely project next action is to close out release-readiness work: update active state files in the real repo, record any verification findings, and proceed only if no release-proof or README positioning gaps remain.

## Relevant files

- `README.md` — product overview, proof section, current companion skill model, installation/usage, verification commands.
- `RELEASE_GOAL.md` — release-ready goal, done criteria, current state, constraints, milestones, verification and closeout instructions.
- `tests/run-all.sh` — master verification suite; includes release-proof, skill packaging, context-index, eval-agent, migration, hook, guard, and script tests.
- `scripts/context-index.js` — generated `AGENTS.md` index, progressive context library cards/chunks, hydrate/check/stats commands.
- `scripts/eval-agent-problem-solving.js` — prepares and scores fresh-agent no-harness vs progressive-harness eval cases.
- `scripts/eval-context-library.js` — shadow-tests progressive context library retrieval behavior on copied context files.
- `examples/cold-resume-demo.md` — release proof artifact showing the intended fresh-agent recovery path and correct next action.
- `context-catch-up/SKILL.md` — fresh-session/true-resume only catch-up workflow and compatibility check.
- `context-maintain/SKILL.md` — ongoing context update, plan stress-test, reflection, closeout, and Dream/Compact workflow.
- `context-upgrade/SKILL.md` and `context-upgrade/agents/openai.yaml` — explicit-only upgrade/migration workflow and implicit-invocation guard.
- `context-init/SKILL.md` — fresh-repo initialization only; routes migration to `context-upgrade`.
- `set-goal/SKILL.md` — execution-ready long-running goal prompt shape.

## Verification command/check

Primary source verification for this no-harness copy:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/context-harness__cold-resume__no-harness/repo && tests/run-all.sh
```

Full context-harness health check, only in a repo copy that includes context files:

```bash
node scripts/context-index.js check
```

Targeted checks if debugging release-readiness specifically:

```bash
tests/run-all.sh release-proof
tests/run-all.sh skill-packaging
tests/run-all.sh context-index
tests/run-all.sh eval-agent-problem-solving
```

## Confidence and why

Medium confidence. I have high confidence in the repository purpose, relevant files, and verification commands because they are stated directly in `README.md`, `RELEASE_GOAL.md`, script headers, and `tests/run-all.sh`. I have lower confidence in the exact live current focus and blockers because this eval deliberately removes the normal context-harness working-memory files (`NOW.md` and `PLAN.md`), so the active state had to be inferred from remaining source artifacts rather than read from the usual source of truth.
