---
name: context-handoff
description: Prepare a long-run handoff brief for a fresh agent to start the next substantial goal with full context, quality expectations, checkpoints, and suggested skills.
user-invocable: true
allowed-tools: "Read, Write, Bash, Glob, Grep"
---

# Context Handoff

Use this after current work completes and the user wants a fresh agent to take
on the next big goal. The handoff is a launch brief for a long-running task, not
a maintenance note and not a new durable memory store.

## Operating Rules

1. Read `NOW.md`, then `CONTEXT.md`, and `PLAN.md` if it exists.
2. Inspect relevant files, diffs, tests, and command output instead of relying
   only on conversation memory.
3. Output the handoff directly in the chat as a fenced `markdown` block by
   default; do not create a temp file.
4. Keep the fenced handoff at or below 4,000 characters.
5. Be concise: prefer tight bullets, omit routine chronology, and link to
   source artifacts instead of summarizing everything.
6. Create a workspace artifact only when the user explicitly asks for a file.
7. Reference existing artifacts by path or URL instead of duplicating them.
8. Redact secrets, credentials, private raw data, and unnecessary personal
   detail.
9. Ask only for missing goal, scope, or quality-bar decisions that the next
   agent cannot infer.

## Handoff Shape

Write a compact launch brief that gives the next agent enough context to start
autonomously:

```markdown
# Handoff: [next big goal]

## Goal
[High-level outcome and why it matters.]

## Done Means
[Concrete completion criteria, expected user-visible result, and quality bar.]

## Current State
[What has already been done, touched files, verification status, and known gaps.]

## Context To Read
[Links to `CONTEXT.md`, `NOW.md`, `PLAN.md`, PRDs, issues, commits, diffs, or
other source-of-truth artifacts.]

## Execution Plan
[Suggested phases, checkpoints, commands to run, and where to inspect first.]

## Quality Bar
[Expected autonomy, depth, tests, review standard, edge cases, and polish.]

## Risks And Watchouts
[Likely failure modes, ambiguous boundaries, and constraints.]

## Open Questions
[Only human-judgment questions; omit details the agent can discover.]

## Suggested Skills
[Which context-harness or external skills the next agent should invoke, and why.]
```

If the user gives a next-session focus, organize the handoff around that goal
rather than around the current conversation chronology. At the end, briefly name
the most important next checkpoint outside the fenced block.
