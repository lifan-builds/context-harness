## Current understanding

The project is Context Harness, a lightweight project-memory layer for coding agents built around visible markdown context files, companion skills, and Node.js scripts. The current focus is reviewing the working-tree shift from the legacy `Rules` / `Never` / `Always` taxonomy to compact `Operating Constraints`, after a second 10-pair real-world fresh-agent eval showed progressive-harness improving all 10 pairs with a 9.1/10 average versus 6.9/10 for no-harness.

## Active blockers or uncertainty

No code or context-health blockers are recorded. Main uncertainty is whether to run the one-time fleet migration from legacy Rules/Never/Always to Operating Constraints before commit/push and local deployment. A read-only `git status` from the case repo appears to resolve to the outer eval repository rather than a self-contained repo copy, so I relied on the repo copy's harness files rather than treating that status as source-of-truth for the active diff.

## Immediate next step

Review the Operating Constraints diff, then decide whether to run the one-time fleet migration before commit/push and local deployment.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__cold-resume__progressive-harness/repo/NOW.md` — current focus, blockers, next step, latest verification.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__cold-resume__progressive-harness/repo/AGENTS.md` — Context Contract and generated context index.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__cold-resume__progressive-harness/repo/CONTEXT.md` — project identity, Operating Constraints, workflow, terminology, invariants.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__cold-resume__progressive-harness/repo/PLAN.md` — release goal, decisions, progress, follow-ups, verification history.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__cold-resume__progressive-harness/repo/scripts/context-index.js` — progressive context library generation/hydration/checks.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__cold-resume__progressive-harness/repo/scripts/eval-context-library.js` and `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__cold-resume__progressive-harness/repo/scripts/eval-agent-problem-solving.js` — shadow and fresh-agent eval tooling.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__cold-resume__progressive-harness/repo/tests/run-all.sh` — main verification entry point.

## Verification command/check

Primary check before completing code changes: `tests/run-all.sh` from the repo copy. Recent recorded checks also include `node scripts/context-index.js check`, `node scripts/eval-context-library.js /Users/lfan/Project .context-harness/shadow-context-library-report.md`, and `node scripts/eval-agent-problem-solving.js score .context-harness/evals/operating-constraints-10`.

## Confidence and why

High. I followed the harness startup path in the case repo: read `NOW.md`, then `AGENTS.md`, ran `node scripts/context-index.js hydrate "resume current task"`, opened the selected context cards, and then consulted the relevant raw `PLAN.md` and `CONTEXT.md` sections needed to answer the requested planning questions. The only caveat is the git-status uncertainty noted above.