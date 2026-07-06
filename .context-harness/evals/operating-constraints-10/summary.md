# Operating Constraints Eval Summary

Run: `.context-harness/evals/operating-constraints-10`  
Scope: 5 real repos × 2 scenarios × 2 modes = 10 paired evaluations / 20 fresh-agent runs.

## Result

| Metric | No harness | Progressive harness | Delta |
|---|---:|---:|---:|
| Average score | 6.9/10 | 9.1/10 | +2.2 |

Pair outcomes:

- Improved: 10/10
- Tied: 0/10
- Regressed: 0/10

| Repo | Scenario | No harness | Progressive | Delta |
|---|---|---:|---:|---:|
| `agent-nexus` | cold-resume | 9 | 10 | +1 |
| `agent-nexus` | next-step | 7 | 9 | +2 |
| `context-harness` | cold-resume | 7 | 10 | +3 |
| `context-harness` | next-step | 7 | 9 | +2 |
| `credit-card-tracker` | cold-resume | 6 | 9 | +3 |
| `credit-card-tracker` | next-step | 5 | 9 | +4 |
| `flight-plan` | cold-resume | 7 | 9 | +2 |
| `flight-plan` | next-step | 6 | 7 | +1 |
| `flyingpig` | cold-resume | 9 | 10 | +1 |
| `flyingpig` | next-step | 6 | 9 | +3 |

## Interpretation

The `Operating Constraints` change did not harm the real-world eval loop. It improved the measured context-harness delta versus the tightened-score baseline: progressive-harness won every pair and averaged +2.2 over no-harness.

The remaining misses are mostly ordinary task-quality misses: setup/test details, long active-state facts in domain repos, or project-specific constraints from legacy `## Rules` sections in repos that have not yet been migrated. Those should be handled by the planned one-time fleet migration and by cleaning stale project docs where they compete with active context.

## Follow-up

- Keep backward compatibility with legacy `## Rules` until the fleet migration is complete.
- In the fleet migration, convert `## Rules` + `### Never`/`### Always` into `## Operating Constraints` bullets, preserving only decision-shaping project-specific constraints.
- Continue treating workflow/setup salience as lower priority than task-quality and context-quality gaps.
