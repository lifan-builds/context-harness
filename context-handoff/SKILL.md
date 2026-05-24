---
name: context-handoff
description: Deprecated compatibility stub. Prefer context-maintain for session closeout, next-step context, and durable project state.
user-invocable: false
allowed-tools: "Read, Write, Bash, Glob, Grep"
---

# Context Handoff (Deprecated)

This skill is deprecated. Do not choose it for new work.

Use `context-maintain` instead when the user wants session closeout, transfer
notes, current state, next steps, plan updates, or durable context updates.
Handoff added another workflow choice without enough value.

## Compatibility Path

If the user explicitly asks for a handoff anyway:

1. Read `NOW.md`, then `CONTEXT.md`, and `PLAN.md` if it exists.
2. Inspect relevant files, diffs, tests, and command output instead of relying
   only on conversation memory.
3. Output directly in chat as a fenced `markdown` block; do not create a temp
   file unless the user explicitly asks for one.
4. Keep the fenced block at or below 4,000 characters.
5. Be concise: use tight bullets, omit routine chronology, and link to source
   artifacts instead of summarizing everything.
6. Redact secrets, credentials, private raw data, and unnecessary personal
   detail.

```markdown
# Brief: [next focus]

## Goal
[Outcome and why it matters.]

## Done Means
[Concrete completion criteria.]

## Current State
[Done, verification, known gaps.]

## Context To Read
[Source-of-truth paths, commits, issues, or docs.]

## Next Checkpoint
[First useful action and command/check.]

## Watchouts
[Constraints and likely failure modes.]

## Open Questions
[Only human-judgment questions.]
```
