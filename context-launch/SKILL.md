---
name: context-launch
description: >
  Convert the current conversation and project context into a long-running
  Codex task brief or goal prompt for a fresh agent, including done criteria,
  context to read, checkpoints, verification, and closeout instructions.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
---

# Context Launch

Use this when the user wants to turn the current conversation into a substantial
task for a new Codex run, a `/goal`, or a long-running agent assignment.

This is not session closeout. Use `context-maintain` for preserving current
state; use this skill to produce an execution-ready launch brief.

## Workflow

1. Read `NOW.md`, then use `AGENTS.md` Context Index to choose relevant
   `CONTEXT.md` sections. Read active `PLAN.md` if present.
2. Inspect source-of-truth artifacts instead of relying only on conversation:
   diffs, commits, tests, docs, issues, failing commands, or relevant files.
3. Distill one primary outcome. If multiple unrelated outcomes remain, split
   them into separate launch briefs.
4. Ask only when goal, scope, or done criteria require human judgment.
5. Output a ready-to-paste Codex goal block in chat unless the user explicitly
   asks for a file.

## Launch Brief

Use this shape:

```markdown
# Goal
[One outcome the agent should accomplish.]

## Done Means
- [Observable or testable completion criterion.]
- [Required verification command or manual check.]

## Context To Read First
- `NOW.md`
- `AGENTS.md` Context Index, then relevant `CONTEXT.md` sections
- [Task-specific files, docs, issues, commits, tests]

## Current State
- [What is already done.]
- [Known failures, open work, or uncertainty.]

## Constraints And Non-Goals
- [Rules, user preferences, safety limits, preserved behavior.]
- [Explicitly out-of-scope work.]

## Execution Plan
1. [First checkpoint.]
2. [Second checkpoint.]
3. [Final integration/checkpoint.]

## Verification
- [Command/check to run.]
- [Expected result.]

## Autonomy And Escalation
- Inspect before asking.
- Ask only for human-judgment blockers or permission-gated operations.
- Do not overwrite unrelated user changes or use destructive git commands.

## Closeout
- Update `PLAN.md` with task-local findings and decisions if it exists.
- Update `CONTEXT.md` for durable terms, rules, invariants, or lessons.
- If `CONTEXT.md` changed, run `node scripts/context-index.js update`.
- Rewrite `NOW.md` with focus, blockers, next step, and touched files.
```

## Quality Bar

- Prefer concrete filenames and commands over vague instructions.
- Keep the brief self-contained enough for a fresh agent to start.
- Preserve uncertainty explicitly; do not invent resolved facts.
- Include checkpoints that let a long-running agent make visible progress.
- Keep private raw data, secrets, and unnecessary personal details out of the
  launch brief.
