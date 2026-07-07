# Tool / Evidence Trace

1. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/prompt.md`.
2. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/NOW.md` first.
3. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/AGENTS.md`.
4. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/CONTEXT.md`.
5. Ran `node scripts/context-index.js hydrate "resume current task"` from the default session repo accidentally; discarded because it was not the eval repo copy.
6. Ran corrected hydrate in the eval repo: `cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo" && node scripts/context-index.js hydrate "resume current task"`.
   - Hydrate output: `Cards: 2; estimated raw tokens if fully opened: ~402`.
   - Selected cards: `ctx-context-context-contract` from `CONTEXT.md#context-contract`; `ctx-now-now` from `NOW.md#now`.
7. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/.context-harness/cards/ctx-context-context-contract.md`.
8. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/.context-harness/cards/ctx-now-now.md`.
9. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/PLAN.md`.
10. Ran `cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo" && node scripts/context-index.js check && git status --short`.
    - Result: `node scripts/context-index.js check` failed with `FAIL AGENTS.md Context Index is stale; run \`node scripts/context-index.js update\``.
    - Because the command used `&&`, `git status --short` did not run in that step.
11. Wrote `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/result.md`.
12. Wrote `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/trace.md`.
13. Ran `cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo" && git status --short`.
    - Result: status resolved to the parent `/Users/lfan/Project/context-harness` git repository and showed parent-repo changes, so it is not a clean source-edit check for the eval copy.
14. Ran `git -C "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo" rev-parse --show-toplevel`.
    - Result: `/Users/lfan/Project/context-harness`.
15. Ran `if [ -e "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/.git" ]; then printf 'eval repo has .git\\n'; else printf 'eval repo has no .git\\n'; fi`.
    - Result: `eval repo has no .git`.
