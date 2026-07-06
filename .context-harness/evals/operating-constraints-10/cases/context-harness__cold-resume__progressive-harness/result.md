# Current understanding

Context Harness is being readied as a lightweight project-memory layer for coding agents: visible markdown files, progressive disclosure via generated cards/chunks, small companion skill set, explicit upgrades, and proof that fresh agents can resume without a long prompt dump.

The active focus is the already-applied gap-fix work from the recent fresh-agent evals: keep harness-health drift as a follow-up instead of letting it hijack product tasks, tighten eval scoring to avoid key lexical false positives, and guide cleanup/archive of stale competing project docs. The immediate release state appears to be pre-commit review/verification of this focused diff.

# Active blockers or uncertainty

No known code or context-health blockers are recorded in `NOW.md`.

Non-blocking uncertainty/follow-up: `PLAN.md` references `.context-harness/evals/manual-realworld-10/top-gaps.md`, but that eval artifact was not present in this case repo copy. The summarized findings are still captured in `PLAN.md`/`NOW.md`, so this does not block the requested read-only catch-up.

# Immediate next step

Review the focused gap-fix diff, then run any desired follow-up real-world eval batch before commit/push and local deployment.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/context-harness__cold-resume__progressive-harness/repo/NOW.md` — current focus, blockers, next step, last verification.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/context-harness__cold-resume__progressive-harness/repo/AGENTS.md` — context contract and hydrate workflow.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/context-harness__cold-resume__progressive-harness/repo/PLAN.md` — release goal, progress, decisions, verification history.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/context-harness__cold-resume__progressive-harness/repo/CONTEXT.md` — durable project identity, constraints, workflow, skill relationships, learned patterns.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/context-harness__cold-resume__progressive-harness/repo/scripts/context-index.js` — progressive card/chunk hydrate support and index checks.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/context-harness__cold-resume__progressive-harness/repo/scripts/eval-agent-problem-solving.js` — fresh-agent paired eval prepare/score harness.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/context-harness__cold-resume__progressive-harness/repo/scripts/eval-context-library.js` — real-project shadow context-library eval.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/context-harness__cold-resume__progressive-harness/repo/tests/run-all.sh` — project verification entrypoint and targeted suites.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/context-harness__cold-resume__progressive-harness/repo/context-catch-up/SKILL.md`, `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/context-harness__cold-resume__progressive-harness/repo/context-init/SKILL.md`, `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/context-harness__cold-resume__progressive-harness/repo/context-maintain/SKILL.md`, `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/context-harness__cold-resume__progressive-harness/repo/context-upgrade/SKILL.md`, `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/context-harness__cold-resume__progressive-harness/repo/set-goal/SKILL.md` — companion skill behavior and routing.

# Verification command/check

Primary check before completing code changes: `tests/run-all.sh`.

Focused checks already recorded as passing: `tests/run-all.sh eval-agent-problem-solving`, `tests/run-all.sh skill-packaging`, `node scripts/context-index.js check`, and rescoring the manual real-world eval after tightening scoring.

If doing the optional next eval step, prepare/score a fresh-agent batch with `node scripts/eval-agent-problem-solving.js prepare ...` followed by `node scripts/eval-agent-problem-solving.js score <eval-dir>`.

# Confidence and why

High for the current focus, blockers, immediate next step, and verification commands because they are stated directly in `NOW.md` and reinforced by `PLAN.md`. Medium for the exact working diff scope because this was a read-only catch-up and the referenced manual eval artifact was absent from the case repo copy.
