# Now

## Current Focus
Legacy migration/eval/ADR tooling has been removed from context-harness now that the local project fleet is on current schema v3 with Operating Constraints.

## Active Blockers
- No code or verification blockers are known.

## Immediate Next Step
Review the cleanup diff, then commit/push and redeploy with Agent Nexus if accepted.

## Session State
- Last modified: 2026-07-06T21:54:00-0700
- Files touched: README.md, SKILL.md, context-catch-up/SKILL.md, context-init/SKILL.md, context-upgrade/SKILL.md, scripts/install-project.js, scripts/context-index.js, scripts/codex-context-hook.js, scripts/eval-agent-problem-solving.js, tests/run-all.sh, CONTEXT.md, PLAN.md, NOW.md; removed scripts/adr.js, scripts/eval-loop.js, scripts/migrate-project.js.
- Verification: syntax checks for `tests/run-all.sh` and changed Node scripts; targeted suites `tests/run-all.sh install-project`, `context-index`, `codex-context-hook`, `skill`, `skill-packaging`; full `tests/run-all.sh` (185 passed, 0 failed); `node scripts/context-index.js check`.
