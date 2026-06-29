# Goal: Release-Ready Context Harness

Make Context Harness release-ready as the lightweight, portable project-memory
layer for coding agents. A skeptical developer should be able to understand the
value in one screen, install or copy it into a repo, see exactly when each skill
should invoke, run the verification suite, and inspect proof that a fresh agent
can resume real work without a long prompt dump.

## Done Means

- The README explains the product clearly: four visible files, progressive
  disclosure, companion skills, lifecycle scripts, and why this is not another
  large methodology framework.
- Skill invocation timing is explicit:
  - `context-catch-up` is only for fresh-session or true-resume boundaries.
  - `context-maintain` handles ongoing context updates, closeout, lessons, plan
    stress-tests, and Dream/Compact consolidation.
  - `set-goal` creates directly usable long-running goals for Codex goal mode,
    loop mode, or fresh agent runs.
  - `context-upgrade` is explicit-only and must not be implicitly invoked.
- Removed legacy skills are not shipped as compatibility stubs.
- `context-init` is fresh-repo initialization only; all migration belongs to
  explicit `context-upgrade`.
- Context Harness includes proof fixtures or tests for at least
  `context-catch-up`, `context-maintain`, `context-upgrade`, and `set-goal`.
- Goal-writing guidance in `set-goal` follows current agent best practice:
  goal, context, constraints, done-when, milestones, verification, loop rules,
  and closeout.
- A short cold-resume demo artifact exists and shows a fresh agent reading
  `NOW.md` plus the `AGENTS.md` context index, choosing relevant `CONTEXT.md`
  sections, and identifying the correct next action.
- Local verification passes.

## Context To Read First

- `NOW.md`
- `AGENTS.md`
- `CONTEXT.md`
- `PLAN.md`
- `README.md`
- `SKILL.md`
- `context-catch-up/SKILL.md`
- `context-maintain/SKILL.md`
- `context-upgrade/SKILL.md`
- `set-goal/SKILL.md`
- `tests/run-all.sh`

## Current State

- Schema v3 is implemented.
- `context-maintain` owns ongoing maintenance and Dream/Compact behavior.
- Removed skill stubs are gone from the offered skill set.
- `set-goal` is the long-running goal workflow.
- `context-upgrade` is now explicit-only in skill frontmatter and Codex
  `agents/openai.yaml`.
- Remaining release gaps are proof, examples, demo artifact, and final README
  positioning.

## Constraints And Non-Goals

- Do not turn Context Harness into a heavy process framework.
- Keep `AGENTS.md` small: activation contract plus generated context index.
- Do not add new companion skills unless the invocation intent is genuinely
  different.
- Do not make `context-upgrade` automatic or implicitly invoked.
- Do not keep removed workflows as hidden compatibility stubs.

## Milestones

1. Finish invocation timing hardening.
   Verify all skill descriptions, README references, tests, and durable context
   agree on when `context-catch-up`, `context-maintain`, `set-goal`, and
   `context-upgrade` should run.

2. Add proof-backed behavior checks.
   Add lightweight fixtures or tests for catch-up timing, set-goal output shape,
   explicit-only upgrade behavior, and maintain routing. Keep them simple enough
   to run inside `tests/run-all.sh`.

3. Add release proof and README polish.
   Add a cold-resume demo transcript or short artifact, then revise the README
   opening to show the problem, the generated files, the skill model, and the
   demo proof before deep philosophy.

4. Verify and close out.
   Run tests, update plan/current-state files, and record any release blockers.

## Verification

Run from `/Users/lfan/Project/context-harness`:

```bash
tests/run-all.sh
node scripts/context-index.js check
```

Manual checks:

- `context-upgrade/SKILL.md` includes `disable-model-invocation: true`.
- `context-upgrade/agents/openai.yaml` includes
  `allow_implicit_invocation: false`.
- Removed skill stubs are absent.
- `set-goal/SKILL.md` contains `Done Means`, `Milestones`,
  `Verification`, `Loop Rules`, and `Closeout`.

## Loop Rules

- Continue autonomously through the next milestone when the next action is
  clear and safe.
- Ask only for human-judgment blockers, cross-repo publishing, destructive
  operations, or permission-gated actions.
- Keep `PLAN.md` and `NOW.md` current after meaningful progress.

## Closeout

- Update `PLAN.md` with release findings, decisions, and verification.
- Update `CONTEXT.md` only for durable terms, rules, or lessons.
- If `CONTEXT.md` changes, run `node scripts/context-index.js update`.
- Rewrite `NOW.md` with current focus, blockers, next step, and touched files.
