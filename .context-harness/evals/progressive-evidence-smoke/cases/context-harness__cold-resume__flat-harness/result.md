# Current understanding

context-harness is a lightweight AI coding-agent project-memory layer made of visible markdown context files, companion skills, and Node.js helper scripts. The current focus is post-migration cleanup: legacy migration/eval/ADR tooling was removed after the local fleet reached current schema v3 with Operating Constraints, and the next project action is to review that cleanup diff, then commit/push and redeploy with Agent Nexus if accepted.

# Active blockers or uncertainty

- No current code or verification blockers are known.
- The only uncertainty is review/release acceptance: the cleanup diff still needs review before commit, push, and local redeploy.
- There is minor historical verification-count drift across PLAN.md entries, but the latest NOW.md and PLAN.md cleanup verification agree on the current post-cleanup result: full `tests/run-all.sh` passed with 185 passed, 0 failed, and `node scripts/context-index.js check` passed.

# Immediate next step

Review the cleanup diff for the files listed in NOW.md, then if accepted commit/push and redeploy locally with Agent Nexus. After deployment, verify Agent Nexus health with `nexus doctor` or the repository's current Agent Nexus doctor command.

# Relevant files

- `NOW.md` — current focus, blockers, immediate next step, touched files, and latest verification summary.
- `AGENTS.md` — schema v3 Context Contract and generated Context Index; preserves startup/resume workflow and update rules.
- `CONTEXT.md` — durable project source of truth: purpose, repo structure, operating constraints, workflow, terms, relationships, and learned patterns.
- `PLAN.md` — active release plan, cleanup progress, follow-ups, and verification history.
- Source/doc files touched by the active cleanup per NOW.md: `README.md`, `SKILL.md`, `context-catch-up/SKILL.md`, `context-init/SKILL.md`, `context-upgrade/SKILL.md`, `scripts/install-project.js`, `scripts/context-index.js`, `scripts/codex-context-hook.js`, `scripts/eval-agent-problem-solving.js`, `tests/run-all.sh`, `CONTEXT.md`, `PLAN.md`, `NOW.md`.
- Removed legacy tooling per NOW.md/PLAN.md: `scripts/adr.js`, `scripts/eval-loop.js`, `scripts/migrate-project.js`.

# Verification command/check

From the repo root, the current verification check for code changes is:

```sh
tests/run-all.sh && node scripts/context-index.js check
```

For the specific cleanup already described, NOW.md also records targeted suites: `tests/run-all.sh install-project`, `context-index`, `codex-context-hook`, `skill`, and `skill-packaging`, followed by full `tests/run-all.sh` and `node scripts/context-index.js check`.

# Context Evidence

- `NOW.md` lines 3-15: current focus is legacy migration/eval/ADR tooling removal; no known blockers; next step is review cleanup diff, then commit/push/redeploy; latest touched files and verification are listed.
- `AGENTS.md` lines 1-23: schema v3 Context Contract says read `NOW.md` first, use `CONTEXT.md` as the always-read project layer, respect Operating Constraints, and update `NOW.md` before ending normal work.
- `AGENTS.md` lines 25-42: generated Context Index identifies `NOW.md`, `CONTEXT.md`, and relevant `CONTEXT.md` sections as the flat navigation layer.
- `CONTEXT.md` lines 4-16: project purpose and repo structure.
- `CONTEXT.md` lines 18-26: operating constraints keep the harness lightweight, keep skills small, avoid ADR requirements for ordinary capture, and preserve the AGENTS.md Context Contract.
- `CONTEXT.md` lines 33-40: workflow says tests use `tests/run-all.sh`, verification requires it before completing code changes, and local deploy follows repo updates.
- `CONTEXT.md` lines 49-64: relationships define the preferred companion skill set, removed stubs, explicit-only context-upgrade, and canonical source/deployment-target distinction.
- `CONTEXT.md` lines 69-89: learned patterns emphasize intent-based skill splits, explicit upgrade routing, current-v3 support, and real-project shadow evaluation.
- `PLAN.md` lines 3-8: release goal is a lightweight project-memory layer with proof a fresh agent can resume without a long prompt dump.
- `PLAN.md` lines 9-22 and 84-87: current findings/progress include removed deprecated stubs, explicit upgrade routing, and obsolete legacy tooling deletion.
- `PLAN.md` lines 89-93: follow-up is restarting AI IDEs/agent hosts after Agent Nexus deployment; optional packaging/eval prompt improvements are non-blocking.
- `PLAN.md` lines 116-118: latest cleanup verification lists targeted suites, full test pass with 185 passed/0 failed, and context-index check pass.

# Confidence and why

High. The answer is based only on the flat required files (`NOW.md`, `AGENTS.md`, `CONTEXT.md`, and `PLAN.md`) in the isolated eval repo copy. The files are schema v3, non-empty, and mutually consistent on the active focus, absence of blockers, next action, and verification command. Confidence is slightly reduced only by historical verification-count entries in PLAN.md, which are superseded by the latest NOW.md and final PLAN.md cleanup verification.
