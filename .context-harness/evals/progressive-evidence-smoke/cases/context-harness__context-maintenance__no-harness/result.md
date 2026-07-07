## Current understanding

This isolated eval copy has repository source files but intentionally lacks operational context-harness files: no `AGENTS.md`, `CONTEXT.md`, `NOW.md`, `PLAN.md`, or `.context-harness/` at the copy root. Therefore ordinary `context-maintain` cannot safely update existing context in this copy; if this were the real working repository, initialize or restore the harness layout first, then close out the completed task.

The completed task appears to be the release cleanup where legacy migration/eval/ADR tooling has been removed from context-harness now that the local project fleet is on current schema v3 with Operating Constraints. Repository evidence supports this: `README.md` says context-harness no longer ships a legacy schema migration script; `tests/run-all.sh` proves obsolete legacy scripts and deprecated skill stubs are absent; `context-upgrade/SKILL.md` owns explicit local fleet/v3 layout repair; and `context-init/SKILL.md` says init does not repair existing layouts or create ADRs unless the target project already uses ADRs.

Context updates that should happen in the real context-enabled checkout:

- `PLAN.md`: record task-local closeout for the cleanup: removed legacy migration/eval/ADR paths, no compatibility stubs, explicit-only `context-upgrade`, proof suites run, remaining review/deploy follow-up. Put ordinary decisions and verification evidence here, including the next action: Review the cleanup diff, then commit/push and redeploy with Agent Nexus if accepted.
- `NOW.md`: rewrite last with concise resume state: cleanup complete or awaiting review, active blocker is human acceptance of the diff/deploy, immediate next step is to review the cleanup diff then commit/push and redeploy with Agent Nexus if accepted, and touched files from the actual diff.
- `CONTEXT.md`: update only for durable rules/terms not already present, such as `Operating Constraints` being the canonical durable constraints section, `context-upgrade` being explicit-only for local project fleet refresh/layout repair, and legacy migration compatibility not being carried forward. Do not duplicate task-local release details here.
- `AGENTS.md` / `.context-harness/`: do not hand-edit durable details into `AGENTS.md`; after `CONTEXT.md`, `PLAN.md`, or `NOW.md` changes that future retrieval should see, run `node scripts/context-index.js update` so the generated index and cards are refreshed.
- `.context-harness/DREAM.md`: do not create or read it for normal catch-up. It is not instructions; create it only if an actual Dream/Compact pass edits context files.

## Active blockers or uncertainty

- The isolated eval repo has no context files to update, so this answer is a routing decision, not an edit plan applied to source.
- The exact cleanup diff is unavailable from this no-harness copy; use the canonical checkout’s `git diff` before committing.
- Running `node scripts/context-index.js check` from this nested eval copy can falsely validate the parent `/Users/lfan/Project/context-harness` checkout because `scripts/lib.js` walks upward to the first project marker. Run index checks only from the true target repo root after context files exist.

## Immediate next step

In the real context-enabled checkout: Review the cleanup diff, then commit/push and redeploy with Agent Nexus if accepted. Before ending the agent session, update `PLAN.md` and `NOW.md`, promote only durable cleanup rules to `CONTEXT.md`, and run `node scripts/context-index.js update` if any context source changed.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__no-harness/repo/README.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__no-harness/repo/RELEASE_GOAL.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__no-harness/repo/SKILL.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__no-harness/repo/context-maintain/SKILL.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__no-harness/repo/context-init/SKILL.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__no-harness/repo/context-upgrade/SKILL.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__no-harness/repo/context-upgrade/agents/openai.yaml`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__no-harness/repo/tests/run-all.sh`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__context-maintenance__no-harness/repo/examples/cold-resume-demo.md`
- Context targets in the real checkout: `PLAN.md`, `NOW.md`, `CONTEXT.md`, generated `AGENTS.md` index, and generated `.context-harness/` retrieval library.

## Verification command/check

From the correct context-enabled repository root, run:

```bash
tests/run-all.sh
node scripts/context-index.js check
```

After accepted deployment through the normal local layer, run:

```bash
nexus sync --yes
nexus doctor
```

Targeted read-only checks I ran in this eval copy passed:

```bash
tests/run-all.sh release-proof   # 30 pass, 0 fail
tests/run-all.sh skill-packaging # 35 pass, 0 fail
```

The required broad release verification remains: Test: tests/run-all.sh.

## Context Evidence

No context cards were used because this is the no-harness mode and the prompt explicitly omits `AGENTS.md`, `CONTEXT.md`, `NOW.md`, `PLAN.md`, and `.context-harness`. Evidence came from source files and read-only commands only:

- Root listing showed the eval copy contains docs, skills, scripts, examples, hooks, and tests, but no context-harness operational files at the copy root.
- `README.md` documents the four-file model, Operating Constraints, verification, explicit-only upgrade, local fleet refresh, and removal of the legacy schema migration script.
- `RELEASE_GOAL.md` says schema v3 is implemented, removed skill stubs are gone, `context-upgrade` is explicit-only, and verification is `tests/run-all.sh` plus `node scripts/context-index.js check`.
- `context-maintain/SKILL.md` routes task-local findings/progress/decisions to `PLAN.md`, durable lessons/terms/invariants to `CONTEXT.md`, and closeout state to `NOW.md`, with `context-index.js update` after context changes that affect retrieval.
- `context-init/SKILL.md` says repos with no harness layout get fresh `AGENTS.md`, `CONTEXT.md`, `NOW.md`, and optional `PLAN.md`; partial/stale repairs belong to explicit `context-upgrade`.
- `context-upgrade/SKILL.md` and `context-upgrade/agents/openai.yaml` show fleet/current-v3 repair is explicit-only (`disable-model-invocation: true`, `allow_implicit_invocation: false`).
- `tests/run-all.sh` contains release-proof checks for removed legacy scripts, absent deprecated skill stubs, maintain routing, set-goal shape, and explicit-only upgrade behavior.

## Confidence and why

High confidence on context-routing and verification because the relevant skill files, README, release goal, and targeted test suites agree. Medium confidence on the exact wording of the completed cleanup state because this no-harness eval copy does not expose the original git diff; the next real action must still review the cleanup diff before commit/push/deploy.