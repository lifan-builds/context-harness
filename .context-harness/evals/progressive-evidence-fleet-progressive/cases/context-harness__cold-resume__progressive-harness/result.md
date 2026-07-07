# Eval Result: context-harness cold resume progressive harness

## Current understanding

context-harness is being prepared as a lightweight project-memory layer for coding agents: small visible context files, progressive disclosure through generated cards/chunks, clear companion skill invocation timing, explicit-only upgrades, and proof that fresh agents can resume without a long prompt dump.

The current focus is post-fleet-cleanup release readiness. Legacy migration/eval/ADR tooling has been removed now that the local project fleet is on schema v3 with Operating Constraints. The active cleanup includes updates to the root skill/docs, companion skill docs, progressive context retrieval, Codex hook nudges, eval harness support, and tests, plus removal of obsolete scripts.

## Active blockers or uncertainty

- No code or verification blockers are recorded in `NOW.md`.
- The immediate next step still depends on review/acceptance of the cleanup diff before commit/push and local redeployment.
- The eval copy at `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo` is nested inside the main git worktree; `git -C ... status` resolves to `/Users/lfan/Project/context-harness`, so git status/diff reflect the enclosing repository, not an independent eval-copy git root.
- Hydrate reported `CONTEXT.md` as beyond the always-read budget even though the eval prompt described concise `CONTEXT.md` as the always-read layer. This is non-blocking for the read-only task, but it is a follow-up signal that future catch-up should prefer selected cards if the budget policy is enforced.

## Immediate next step

Review the cleanup diff, then if accepted commit/push it and redeploy locally with Agent Nexus. After deployment, restart AI IDEs or agent hosts so updated skill frontmatter/metadata are reloaded.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo/NOW.md` — current focus, blockers, next step, touched files, latest verification summary.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo/CONTEXT.md` — durable project identity, Operating Constraints, workflow, terms, invariants, and learned patterns.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo/AGENTS.md` — schema v3 context contract and generated context index.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo/PLAN.md` — release plan, decisions, progress, follow-ups, and verification history.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo/scripts/context-index.js` — progressive retrieval/index/check support.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo/scripts/eval-agent-problem-solving.js` — fresh-agent paired eval harness.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo/scripts/codex-context-hook.js` — Codex hook nudges.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo/tests/run-all.sh` — main test runner and targeted suites.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo/README.md`, `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo/SKILL.md`, and companion skill docs under `context-catch-up/`, `context-init/`, `context-maintain/`, `context-upgrade/`, and `set-goal/` — user-facing release behavior and skill-routing rules.
- Removed obsolete scripts referenced by the plan/current state: `scripts/adr.js`, `scripts/eval-loop.js`, and `scripts/migrate-project.js`.

## Verification command/check

Use these checks before completing code changes:

```sh
tests/run-all.sh
node scripts/context-index.js check
```

For targeted review of this cleanup, `NOW.md` records passing targeted suites: `tests/run-all.sh install-project`, `context-index`, `codex-context-hook`, `skill`, and `skill-packaging`, plus full `tests/run-all.sh` with 185 passed and 0 failed. For local deployment verification after acceptance, use Agent Nexus sync/deploy checks and `nexus doctor` as recorded in `PLAN.md`.

## Context Evidence

1. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/prompt.md` to load the eval instructions, repo copy, and required answer shape.
2. Invoked `context-catch-up` with the eval repo path and the explicit progressive-read constraints.
3. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo/NOW.md` first.
4. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo/AGENTS.md` for the schema v3 Context Contract and generated Context Index.
5. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo/CONTEXT.md` as the always-read project layer requested by the eval prompt.
6. Ran `cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo" && node scripts/context-index.js hydrate "resume current task"`.
   - Hydrate selected card IDs: `ctx-context-language`, `ctx-now-now`, `ctx-plan-goal`, `ctx-plan-progress`, `ctx-context-relationships`.
   - Hydrate noted `CONTEXT.md` exceeded the always-read budget and recommended selected cards/sections before raw bulky context.
7. Read selected cards under `.context-harness/cards/`: `ctx-context-language.md`, `ctx-now-now.md`, `ctx-plan-goal.md`, `ctx-plan-progress.md`, and `ctx-context-relationships.md`.
8. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo/PLAN.md` after hydrate/cards to skim active plan sections.
9. Ran `git -C "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo" status --short` to inspect current diff state read-only.
10. Ran `git -C "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo" diff --stat` to inspect cleanup diff breadth read-only.
11. Ran `git -C "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo" log --oneline -5` to confirm recent commits.
12. Ran `git -C "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/context-harness__cold-resume__progressive-harness/repo" rev-parse --show-toplevel` and confirmed the git root is `/Users/lfan/Project/context-harness`.

## Confidence and why

High. The current focus, blockers, next step, touched files, and verification commands are stated directly in `NOW.md`, reinforced by `PLAN.md`, and consistent with the hydrate-selected cards. The only uncertainty is git-root scope: the eval repo path is nested inside the main worktree, so git status/diff are useful for the surrounding cleanup context but not proof of an isolated eval-copy repository state.
