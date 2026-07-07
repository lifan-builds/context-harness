# Fresh Agent Eval: moonshot / cold-resume / progressive-harness

You are a fresh coding agent evaluating this repository in an isolated copy.
Work from: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/moonshot__cold-resume__progressive-harness/repo`
Write your final answer to: `../result.md`

## Task
Catch up on the project and report the current focus, blockers, immediate next step, relevant files, and verification command. Do not edit files.

## Constraints
- Do not modify repository source files for this read-only eval.
- If you need to run commands, use read-only inspection commands only.
- Be concrete: cite files, next actions, blockers, and verification commands.
- Use context-harness progressively: read `NOW.md` first and concise `CONTEXT.md` as the always-read layer.
- Run `node scripts/context-index.js hydrate "resume current task"` before opening `PLAN.md`, chunks, or bulky/task-specific context.
- Use selected cards before raw bulky sections; open raw chunks only when a selected card says they are needed.
- If `CONTEXT.md` is small, direct `CONTEXT.md` use is expected; if it is large, use hydrate-selected cards/sections instead of reading it wholesale.
- If context-harness files, generated indexes, or commands look stale or broken, mention that as a follow-up unless it blocks this read-only task; do not let harness maintenance replace the requested project understanding or planning task.
- Include a `Context Evidence` section listing files/commands used in order, including hydrate output or selected card IDs. Also copy tool trace notes to `../trace.md` if possible.

## Required answer shape
- Current understanding
- Active blockers or uncertainty
- Immediate next step
- Relevant files
- Verification command/check
- Context Evidence
- Confidence and why

