## Current understanding

The active work is at closeout/release-gating stage, not broad feature implementation. `NOW.md` says the project has replaced the `Rules` / `Never` / `Always` taxonomy with `Operating Constraints`, and `PLAN.md` records that the second 10-pair real-world eval under `.context-harness/evals/operating-constraints-10` improved all 10 progressive-harness pairs, averaging 9.1/10 vs 6.9/10 for no-harness. The immediate recorded next step is to review the Operating Constraints diff, then decide whether a one-time local fleet migration from legacy `Rules` to `Operating Constraints` should happen before commit/push and local deployment.

Relevant constraints from the harness itself: keep context-harness lightweight, keep the user-facing skill set small, split workflows only when invocation intent is genuinely different, and route migration/layout repair through explicit `context-upgrade`, not ordinary `context-catch-up`.

## Active blockers or uncertainty

No hard blocker is recorded in `NOW.md`. The main uncertainty is scope: whether this release should include a fleet migration now, or ship the source/doc/test changes and leave fleet migration as an explicit follow-up.

A quick repo-copy search shows intentional legacy terminology still exists in compatibility paths and tests, but there are also user-facing headings such as `SKILL.md` `## Core Rules` and `## Context Rules` that should be reviewed to confirm they are intentionally generic rather than stale taxonomy. `scripts/migrate-project.js` currently migrates schema v2 markers and legacy Objectives, but I did not see direct `Rules` -> `Operating Constraints` rewrite logic, so if a fleet migration is desired the next step may need either model-led per-repo edits or a targeted migration-script enhancement.

## Immediate next step

Do a closeout review focused on the Operating Constraints migration before any commit/push/deploy:

1. Inspect all remaining `Rules`, `Never`, and `Always` references in the source repo and classify each as one of:
   - intentional compatibility/legacy test fixture,
   - acceptable generic prose,
   - stale user-facing taxonomy that should be renamed before release.
2. Specifically decide whether `SKILL.md` headings `Core Rules` and `Context Rules` should remain or be renamed to avoid contradicting the new Operating Constraints framing.
3. Decide whether fleet migration is in-scope for this release:
   - If yes, first add/verify a safe explicit `context-upgrade` migration path for legacy `## Rules` sections, then run dry-run inventory across the local fleet and migrate only understood clean targets.
   - If no, record fleet migration as a `PLAN.md` follow-up and proceed to normal release verification/deployment.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__next-step__progressive-harness/repo/NOW.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__next-step__progressive-harness/repo/PLAN.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__next-step__progressive-harness/repo/CONTEXT.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__next-step__progressive-harness/repo/SKILL.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__next-step__progressive-harness/repo/context-catch-up/SKILL.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__next-step__progressive-harness/repo/context-upgrade/SKILL.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__next-step__progressive-harness/repo/scripts/context-index.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__next-step__progressive-harness/repo/scripts/migrate-project.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__next-step__progressive-harness/repo/scripts/eval-agent-problem-solving.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/context-harness__next-step__progressive-harness/repo/tests/run-all.sh`

## Verification command/check

For the source release path:

```bash
tests/run-all.sh
node scripts/context-index.js check
node scripts/eval-context-library.js /Users/lfan/Project .context-harness/shadow-context-library-report.md
node scripts/eval-agent-problem-solving.js score .context-harness/evals/operating-constraints-10
```

If fleet migration is included, start with dry-run inventory and do not include dirty repos unless explicitly approved:

```bash
node scripts/migrate-project.js --root /Users/lfan/Project
node scripts/migrate-project.js --root /Users/lfan/Project --include-dirty
```

After deployment through Agent Nexus, verify with:

```bash
nexus sync --dry-run
nexus sync --yes
nexus doctor
```

## Confidence and why

Confidence: medium-high. The context files are current and consistent: `NOW.md`, `PLAN.md`, hydrated cards, and the Operating Constraints card all point to the same release-gating next step. The remaining uncertainty is not project state but release scope: whether to include the one-time fleet migration now, especially because the existing migration script appears focused on schema/Objectives migration rather than direct `Rules` taxonomy rewriting.