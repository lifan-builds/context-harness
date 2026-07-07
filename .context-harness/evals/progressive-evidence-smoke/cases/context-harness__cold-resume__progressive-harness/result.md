# Current understanding

context-harness is a lightweight project-memory layer for AI coding agents. The active project state is post-cleanup: legacy migration/eval/ADR tooling has been removed now that the local project fleet is on current schema v3 with Operating Constraints. The active plan goal is to make Context Harness release-ready with small visible context files, clear skill invocation timing, explicit upgrades, and evidence that a fresh agent can resume without a long prompt dump.

# Active blockers or uncertainty

- No code or verification blockers are recorded in `NOW.md`.
- Working-copy inspection from the eval copy reports an existing cleanup diff in the parent worktree plus an untracked eval directory, so commit/push/deploy should only happen after reviewing that diff in the real worktree, not from this read-only eval.
- Harness follow-up: `CONTEXT.md` is still readable, but `hydrate` reports it is beyond the always-read budget, so future maintenance may need to compact it or rely more strictly on selected cards/sections.

# Immediate next step

Review the cleanup diff, especially the changed skill docs and Node scripts, then if accepted commit/push and redeploy locally with Agent Nexus.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__cold-resume__progressive-harness/repo/NOW.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__cold-resume__progressive-harness/repo/CONTEXT.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__cold-resume__progressive-harness/repo/PLAN.md` via selected cards `ctx-plan-goal` and `ctx-plan-progress`
- Source areas called out by `NOW.md`: `README.md`, `SKILL.md`, `context-catch-up/SKILL.md`, `context-init/SKILL.md`, `context-upgrade/SKILL.md`, `scripts/install-project.js`, `scripts/context-index.js`, `scripts/codex-context-hook.js`, `scripts/eval-agent-problem-solving.js`, `tests/run-all.sh`, `CONTEXT.md`, `PLAN.md`, `NOW.md`; removed legacy files include `scripts/adr.js`, `scripts/eval-loop.js`, and `scripts/migrate-project.js`.

# Verification command/check

Last recorded verification in `NOW.md`: syntax checks for `tests/run-all.sh` and changed Node scripts; targeted suites `tests/run-all.sh install-project`, `context-index`, `codex-context-hook`, `skill`, `skill-packaging`; full `tests/run-all.sh` with 185 passed and 0 failed; `node scripts/context-index.js check`.

Recommended pre-completion check before shipping the cleanup: from the repository root, run `tests/run-all.sh && node scripts/context-index.js check`, then perform the required local Agent Nexus deploy check.

# Context Evidence

1. Read eval prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/context-harness__cold-resume__progressive-harness/prompt.md`.
2. Loaded `context-catch-up` skill guidance for resume/catch-up order.
3. Read `NOW.md` first from the eval repo copy.
4. Read concise `CONTEXT.md` as the always-read project layer.
5. Ran `node scripts/context-index.js hydrate "resume current task"` from the eval repo copy. Hydrate selected cards: `ctx-context-language`, `ctx-now-now`, `ctx-plan-goal`, `ctx-plan-progress`, `ctx-context-relationships`; raw sources were deferred.
6. Read selected cards: `.context-harness/cards/ctx-context-language.md`, `.context-harness/cards/ctx-now-now.md`, `.context-harness/cards/ctx-plan-goal.md`, `.context-harness/cards/ctx-plan-progress.md`, `.context-harness/cards/ctx-context-relationships.md`.
7. Read `AGENTS.md` to confirm schema v3 Context Contract and generated Context Index.
8. Ran read-only checks: `git status --short`, `git log --oneline -5`, and `git diff --stat` using `git -C` against the eval repo copy.

# Confidence and why

High. The answer follows the required progressive context path, uses the hydrate-selected cards before raw plan/chunk detail, and cross-checks current context against read-only git status/diff evidence. The main uncertainty is operational rather than conceptual: the eval copy sits under a parent git worktree, so the pending diff should be reviewed in the real worktree before any commit/push/deploy action.