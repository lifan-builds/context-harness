# Fleet Upgrade Eval Summary

Run: `.context-harness/evals/fleet-upgrade-10`  
Scope: after pushing Context Harness `ed7e2f9`, deploying with Agent Nexus locally, and one-time upgrading applicable repos under `/Users/lfan/Project` to `## Operating Constraints` plus latest runtime scripts.

## Fleet Upgrade Result

- Context Harness pushed: `ed7e2f9 Add progressive context eval loop` to `origin/main`.
- Agent Nexus local deploy: `nexus sync --yes` deployed `lifan-builds/context-harness@ed7e2f9`; `nexus doctor` passed.
- Fleet migration: 32 context-harness projects processed; 31 converted from `## Rules` to `## Operating Constraints`; 32 installed/refreshed latest runtime scripts; 0 failures.
- Post-migration structural check: 32/32 applicable projects have `## Operating Constraints`, no remaining `## Rules`, and schema v3.

## Shadow Retrieval Eval

`node scripts/eval-context-library.js /Users/lfan/Project .context-harness/shadow-context-library-report.md`

- Repos found: 25
- Pass: 19
- Warn: 0
- Fail: 0
- Skip: 6 missing `CONTEXT.md`
- Actionable gaps: none identified by the shadow run.

## Fresh-Agent Problem-Solving Eval

| Metric | No harness | Progressive harness | Delta |
|---|---:|---:|---:|
| Average score | 7.0/10 | 9.1/10 | +2.1 |

Pair outcomes:

- Improved: 8/10
- Tied: 2/10
- Regressed: 0/10

| Repo | Scenario | No harness | Progressive | Delta |
|---|---|---:|---:|---:|
| `agent-nexus` | cold-resume | 9 | 10 | +1 |
| `agent-nexus` | next-step | 7 | 9 | +2 |
| `context-harness` | cold-resume | 7 | 10 | +3 |
| `context-harness` | next-step | 7 | 9 | +2 |
| `credit-card-tracker` | cold-resume | 6 | 9 | +3 |
| `credit-card-tracker` | next-step | 5 | 9 | +4 |
| `flight-plan` | cold-resume | 7 | 7 | 0 |
| `flight-plan` | next-step | 9 | 9 | 0 |
| `flyingpig` | cold-resume | 7 | 10 | +3 |
| `flyingpig` | next-step | 6 | 9 | +3 |

## Interpretation

The one-time fleet migration preserved the previous 9.1/10 progressive-harness average while improving the no-harness baseline from 6.9 to 7.0. Progressive still wins strongly: +2.1 average, 8 improved pairs, 2 ties, and no regressions.

The two ties are both `flight-plan`, where normal repository docs already carry enough current task context for no-harness agents to do well. This is a healthy result: context-harness should complement good natural docs, not replace them.

Remaining misses are mostly evaluation quality and optional-salience issues rather than retrieval failures:

- Setup/test details such as `Setup: npm install` or `Test: project-specific` remain easy for agents to omit when the task is read-only.
- Some operating constraints are useful background but not always necessary to mention for a given next-step answer.
- Long active-state facts still benefit from qualitative judging instead of exact deterministic scoring.

## Promotion-Relevant Takeaway

The latest proof point is now stronger and easier to explain publicly:

> After upgrading the local project fleet to the latest Context Harness, fresh-agent evals across five real repos scored 9.1/10 with progressive context vs 7.0/10 without it, improving 8/10 paired tasks with no regressions; retrieval shadow tests passed 19/19 context-enabled repos with no warnings or failures.
