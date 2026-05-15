---
name: context-catch-up
description: Catch up a new agent or resumed session from context-harness files before planning or editing.
user-invocable: true
allowed-tools: "Read, Bash, Glob, Grep"
---

# Context Catch-Up

Use this when starting or resuming work in a repository that already has
context-harness files.

## Read Order

1. Read `NOW.md` first.
2. Read `CONTEXT.md` second.
3. If present, skim active `PLAN.md` sections.
4. If the project already uses ADRs, skim only the ADR titles/dates relevant to
   the current task.

## Output

Give the user a short catch-up summary:

- Current focus
- Active blockers
- Immediate next step
- Rules or terms that matter for the requested task
- Any uncertainty that should be resolved before editing

## Guardrails

- Do not rewrite context files during catch-up unless the user teaches a durable
  correction while you are catching up.
- Do not summarize raw external content into `CONTEXT.md`; route task-local
  discoveries to `PLAN.md` when work begins.
- Keep the summary short enough that it helps the next action, not replaces it.

