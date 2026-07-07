# Current understanding

The completed work is the legacy-tooling cleanup for Context Harness after the local fleet reached current schema v3 with Operating Constraints. The cleanup removed obsolete legacy migration/eval/ADR paths, tightened checks to v3-only, updated docs/skills/tests, and already has recorded verification evidence: targeted suites, full `tests/run-all.sh` with 185 passed / 0 failed, and `node scripts/context-index.js check` passing.

Context maintenance should not become a new source-change task. It should close out the completed cleanup and make the next release/deploy step obvious to a fresh agent.

# Active blockers or uncertainty

- No code or verification blockers are known.
- Uncertainty: `NOW.md` still says the next step is to review the cleanup diff, then commit/push/redeploy if accepted. If that review/deploy has since happened, `NOW.md` and `PLAN.md#Verification` should be updated with the actual commit/deploy evidence.
- No new durable rule is clearly missing from `CONTEXT.md`; most durable outcomes are already captured there, including v3-only runtime, removed compatibility stubs, explicit-only `context-upgrade`, and Operating Constraints.

# Immediate next step

Perform a `context-maintain` closeout pass:

1. Rewrite `NOW.md` to a short resume packet: current focus = legacy cleanup ready for review/commit/deploy or completed if that happened; blockers = none known; immediate next step = review/commit/push and Agent Nexus deploy/doctor, or restart agent hosts after deployment; touched files = docs, skills, runtime scripts, tests, generated context files, and removed legacy scripts.
2. Update `PLAN.md` only where needed:
   - `## Progress`: ensure the legacy cleanup line remains checked and current.
   - `## Verification`: keep the targeted suites, full suite, and `context-index check` results; add Agent Nexus deploy/doctor evidence only after it actually runs.
   - `## Follow-Ups`: keep restart-AI-hosts after deployment; keep optional plugin/richer eval work as non-blocking.
   - `## Archive`: compact older completed eval/release history if the active plan is too bulky for future resume.
3. Leave `CONTEXT.md` unchanged unless the actual completed task introduced a new durable invariant. If edited, use the smallest section (`Workflow`, `Relationships`, or `Learned Patterns`) and avoid duplicating existing entries.
4. Run `node scripts/context-index.js update` after any `NOW.md`, `PLAN.md`, or `CONTEXT.md` update that should affect future retrieval; this should refresh `AGENTS.md` generated index plus `.context-harness/cards/` and chunks.
5. Run the Dream/Compact check because this is a completed task and `PLAN.md` contains a long release/eval history. If compacting happens, write only the audit entry to `.context-harness/DREAM.md`; do not use DREAM as operational context.

# Relevant files

- `NOW.md` — primary closeout/resume update.
- `PLAN.md` — task-local progress, verification, decisions/follow-ups, and possible archive compaction.
- `CONTEXT.md` — durable project facts only if a new invariant is not already captured.
- `AGENTS.md` and `.context-harness/cards/*` / `.context-harness/chunks/*` — generated retrieval/index outputs after `context-index update`.
- Source/docs touched by the completed cleanup, per `NOW.md`: `README.md`, `SKILL.md`, `context-catch-up/SKILL.md`, `context-init/SKILL.md`, `context-upgrade/SKILL.md`, `scripts/install-project.js`, `scripts/context-index.js`, `scripts/codex-context-hook.js`, `scripts/eval-agent-problem-solving.js`, `tests/run-all.sh`; removed legacy scripts were `scripts/adr.js`, `scripts/eval-loop.js`, and `scripts/migrate-project.js`.

# Verification command/check

For context updates:

```bash
node scripts/context-index.js update
node scripts/context-index.js check
node scripts/context-index.js hydrate "resume current task"
node scripts/context-index.js hydrate "update context after completed task"
```

For the completed cleanup before release:

```bash
tests/run-all.sh install-project context-index codex-context-hook skill skill-packaging
tests/run-all.sh
```

For deployment, only after the reviewed cleanup is accepted:

```bash
# Agent Nexus local deployment / dry-run according to the repo workflow
nexus doctor
```

# Context Evidence

Used in order:

1. `prompt.md` — task requirements and read-only eval constraints.
2. `NOW.md` — current focus, blockers, next step, touched files, and recorded verification.
3. `AGENTS.md` — schema v3 Context Contract and generated Context Index.
4. `CONTEXT.md` — project identity, constraints, workflow, language, relationships, and learned patterns. It is 89 lines / ~9396 chars, so hydrate-selected cards should be preferred for later detail.
5. Command: `node scripts/context-index.js hydrate "update context after completed task"`.
   - Selected cards: `ctx-plan-progress`, `ctx-plan-verification`, `ctx-context-language`, `ctx-now-now`, `ctx-plan-follow-ups`, `ctx-context-flagged-ambiguities`, `ctx-context-operating-constraints`.
   - Hydrate reported raw sources deferred and `CONTEXT.md` beyond the always-read budget.
6. Cards opened: `ctx-plan-progress`, `ctx-plan-verification`, `ctx-plan-follow-ups`, `ctx-context-operating-constraints`.
7. Raw chunks opened because the selected plan cards were truncated: `.context-harness/chunks/ctx-plan-progress.md` and `.context-harness/chunks/ctx-plan-verification.md`.
8. `PLAN.md` opened to confirm headings, current findings, decisions, progress, follow-ups, verification, and archive.
9. `git -C repo status --short` and `git -C repo diff --stat` were read-only but non-authoritative for this eval copy because the case is nested under the outer repository; I did not rely on them for case-local source state.

# Confidence and why

High for context routing: `NOW.md`, `PLAN.md`, the Context Contract, `context-maintain` routing rules, and hydrate-selected cards all point to `NOW.md` closeout plus `PLAN.md` progress/verification/follow-up updates, with `CONTEXT.md` only for genuinely durable new facts. Medium for final deploy state because the context says deploy is the next step if accepted, not that it has already completed after the cleanup.