# Current understanding

The active work is in closeout, not a new implementation phase. `NOW.md` says legacy migration/eval/ADR tooling has been removed now that the local fleet is on schema v3 with Operating Constraints, with no known code or verification blockers. The selected PLAN cards and `RELEASE_GOAL.md` show the release target: keep Context Harness lightweight, remove compatibility stubs rather than hiding them, keep the public companion skill set small, make `context-upgrade` explicit-only, and prove fresh-agent resume/retrieval behavior with local tests and eval artifacts.

# Active blockers or uncertainty

- No functional blockers are recorded in `NOW.md`.
- Human/reviewer acceptance of the cleanup diff is the remaining release gate before commit/push/deploy.
- Non-blocking harness/eval caveat: the eval repo copy is nested inside the parent Git repository, so `git status`/`git diff` from the copy walked up to the parent repo rather than proving the copy's own state. The required `hydrate` command also appears capable of refreshing generated card text in the parent context root in this nested setup; treat that as a follow-up for eval isolation/root detection, not as a blocker for this planning answer.
- `CONTEXT.md` is 89 lines/~9.4k characters; the hydrate output says it exceeds the always-read budget even though the contract still calls it concise. Follow up by compacting or relying more strictly on selected cards if this continues to grow.

# Immediate next step

Perform a closeout review of the cleanup diff against `RELEASE_GOAL.md`, then if accepted commit/push and redeploy through Agent Nexus. The review should specifically check that the source changes preserve the small-skill-set design and that removed workflows are fully absent rather than retained as hidden compatibility stubs. After deployment, restart AI IDEs/agent hosts so updated frontmatter and skill metadata are loaded.

Concrete review pass:

1. Compare changed README/skill text against the release goal and Operating Constraints.
2. Confirm `context-upgrade` remains explicit-only and all migration/layout repair language routes there, not to ordinary catch-up.
3. Confirm `context-init` is fresh-repo initialization only.
4. Confirm removed legacy workflows (`context-launch`, `context-handoff`, `context-grill`, ADR/eval/migration scripts) are not shipped as compatibility stubs.
5. Confirm tests and proof fixtures cover the intended behavior and that generated context cards/index are current.
6. If review passes, commit/push, deploy locally with Agent Nexus, then restart hosts.

# Relevant files

- `NOW.md` — current focus, blockers, immediate next step.
- `CONTEXT.md` — Operating Constraints, Workflow, Relationships, Learned Patterns.
- `RELEASE_GOAL.md` — release checklist, done means, manual verification.
- `AGENTS.md` — Context Contract and generated index contract.
- `PLAN.md` via selected cards: `ctx-plan-progress`, `ctx-plan-current-findings`, `ctx-plan-verification`, `ctx-plan-decisions`, `ctx-plan-follow-ups`, `ctx-plan-goal`, `ctx-plan-archive`.
- `README.md` and `SKILL.md` — public positioning and root skill routing.
- `context-catch-up/SKILL.md`, `context-init/SKILL.md`, `context-maintain/SKILL.md`, `context-upgrade/SKILL.md`, `set-goal/SKILL.md` — companion skill invocation timing and constraints.
- `context-upgrade/agents/openai.yaml` — manual check for `allow_implicit_invocation: false`.
- `scripts/context-index.js`, `scripts/codex-context-hook.js`, `scripts/eval-agent-problem-solving.js`, `scripts/eval-context-library.js`, `tests/run-all.sh` — retrieval/index behavior, lifecycle hooks, eval proof, test runner.
- Removed/absent legacy files to verify: `scripts/adr.js`, `scripts/eval-loop.js`, `scripts/migrate-project.js`, and legacy skill stubs such as `context-launch`, `context-handoff`, `context-grill` if they are meant to be gone from the shipped set.

# Verification command/check

Run from the canonical repository root before release closeout:

```bash
tests/run-all.sh
node scripts/context-index.js check
```

Manual checks from `RELEASE_GOAL.md`:

- `context-upgrade/SKILL.md` includes `disable-model-invocation: true`.
- `context-upgrade/agents/openai.yaml` includes `allow_implicit_invocation: false`.
- Removed skill stubs are absent from the shipped skill set.
- `set-goal/SKILL.md` contains `Done Means`, `Milestones`, `Verification`, `Loop Rules`, and `Closeout` guidance.
- Generated context cards/index are refreshed after any context changes.

# Context Evidence

1. Read eval prompt: `.context-harness/evals/progressive-evidence-smoke/cases/context-harness__next-step__progressive-harness/prompt.md`.
2. Listed eval copy `.context-harness`; it contained generated `cards/`, `chunks/`, and `index.json`, not root `NOW.md`/`CONTEXT.md`.
3. Attempted line count for `.context-harness/CONTEXT.md` and `.context-harness/NOW.md`; both were absent there.
4. Listed repo copy root and found `NOW.md`, `CONTEXT.md`, `PLAN.md`, `RELEASE_GOAL.md`, skills, scripts, and tests.
5. Read `NOW.md` first.
6. Read root `CONTEXT.md` as the concise always-read layer requested by the case.
7. Ran `node scripts/context-index.js hydrate "plan next implementation step"`; selected cards: `ctx-plan-archive`, `ctx-plan-progress`, `ctx-plan-verification`, `ctx-plan-current-findings`, `ctx-plan-decisions`, `ctx-plan-follow-ups`, `ctx-plan-goal`; raw sources deferred.
8. Read selected cards: `ctx-plan-progress`, `ctx-plan-current-findings`, `ctx-plan-verification`, `ctx-plan-follow-ups`, `ctx-plan-decisions`, `ctx-plan-goal`, `ctx-plan-archive`.
9. Ran `git status --short` and `git diff --stat` from the eval copy; caveat: commands walked up to the parent Git repo, so they are not reliable evidence of the copy's own independent diff.
10. Ran `node scripts/context-index.js hydrate "done criteria release readiness verification deploy"`; selected cards: `ctx-plan-verification`, `ctx-plan-follow-ups`, `ctx-plan-goal`, `ctx-plan-progress`, `ctx-now-now`, `ctx-context-workflow`, `ctx-plan-archive`; raw sources deferred.
11. Read `RELEASE_GOAL.md` for done means, milestones, and verification.
12. Read `AGENTS.md` for the Context Contract.
13. Inspected parent generated-card diff for `ctx-now-now.md`; noted non-blocking hydrate/root-detection side-effect caveat.

# Confidence and why

High. `NOW.md`, `CONTEXT.md`, selected PLAN cards, and `RELEASE_GOAL.md` all point to the same next action: closeout review, then commit/push/deploy if accepted. The only uncertainty is not about the project direction but about nested eval Git/root behavior, which should be treated as a harness follow-up rather than a blocker to the planned closeout step.
