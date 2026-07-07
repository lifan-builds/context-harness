# Tool / Evidence Trace

1. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/prompt.md`.
2. Ran `ls -la /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/repo`.
3. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/repo/NOW.md`.
4. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/repo/CONTEXT.md`.
5. Ran `cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/repo && node scripts/context-index.js hydrate "update context after completed task"`.
   - Hydrate output selected 7 cards: `ctx-now-now`, `ctx-plan-archive`, `ctx-plan-follow-ups`, `ctx-context-operating-constraints`, `ctx-context-workflow`, `ctx-plan-current-findings`, `ctx-plan-decisions`.
6. Read selected card `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/repo/.context-harness/cards/ctx-plan-follow-ups.md`.
7. Read selected card `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/repo/.context-harness/cards/ctx-plan-current-findings.md`.
8. Read selected card `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/repo/.context-harness/cards/ctx-plan-decisions.md`.
9. Read selected card `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/repo/.context-harness/cards/ctx-plan-archive.md`.
10. Read selected card `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/repo/.context-harness/cards/ctx-context-operating-constraints.md`.
11. Read selected card `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/repo/.context-harness/cards/ctx-context-workflow.md`.
12. Read raw `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/repo/PLAN.md` after selected cards because the cards truncated needed details.
13. Ran `git -C /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/repo status --short`; output reflected the enclosing parent worktree, so it was not used as eval-repo source-cleanliness evidence.
14. Read existing `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/result.md` and `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/trace.md`; both were effectively empty.
15. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/repo/nexus.personal.yml` to check whether the `../context-harness` follow-up remained active; secret env values were intentionally not copied.
16. Ran `cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/repo && node scripts/context-index.js check`.
   - Result: exit 1, `FAIL AGENTS.md Context Index is stale; run node scripts/context-index.js update`.
17. Wrote `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/result.md`.
18. Wrote `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__context-maintenance__progressive-harness/trace.md`.
