# Tool / evidence trace

1. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/flyingpig__cold-resume__progressive-harness/prompt.md` to load the eval instructions and repo/output paths.
2. Invoked `context-catch-up` skill with the eval constraints: read-only, `NOW.md` first, concise `CONTEXT.md`, hydrate before `PLAN.md`/chunks, write `../result.md` and `../trace.md`.
3. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/flyingpig__cold-resume__progressive-harness/repo/NOW.md` first.
4. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/flyingpig__cold-resume__progressive-harness/repo/AGENTS.md` for v3 schema/context index.
5. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/flyingpig__cold-resume__progressive-harness/repo/CONTEXT.md` as the concise always-read layer.
6. Ran command in repo copy: `node scripts/context-index.js hydrate "resume current task"`.
   - Output selected cards: `ctx-context-context-contract` and `ctx-now-now`.
7. Read selected card `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/flyingpig__cold-resume__progressive-harness/repo/.context-harness/cards/ctx-context-context-contract.md`.
8. Read selected card `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/flyingpig__cold-resume__progressive-harness/repo/.context-harness/cards/ctx-now-now.md`.
9. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/flyingpig__cold-resume__progressive-harness/repo/PLAN.md` lines 1-250.
10. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/flyingpig__cold-resume__progressive-harness/repo/PLAN.md` lines 251-370.
11. Ran read-only sanity command: `git -C <repo> status --short && ls <case-dir>`.
    - Observed the nested repo copy resolves to the outer context-harness git repo for status.
    - Status showed generated/outer harness artifacts modified or untracked after required context tooling; no repository source files in the eval copy were intentionally edited.
    - Confirmed `result.md` and `trace.md` existed as placeholders.
12. Read existing `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/flyingpig__cold-resume__progressive-harness/result.md`; it was effectively empty.
13. Read existing `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/flyingpig__cold-resume__progressive-harness/trace.md`; it was effectively empty.
14. Wrote final answer to `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/flyingpig__cold-resume__progressive-harness/result.md`.
15. Wrote this trace to `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/flyingpig__cold-resume__progressive-harness/trace.md`.
