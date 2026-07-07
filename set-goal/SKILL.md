---
name: set-goal
description: >
  Turn the current conversation and repository state into a directly usable
  long-running goal for Codex goal mode, loop mode, or a fresh agent run,
  including purpose, context, constraints, milestones, verification, stop
  conditions, and closeout instructions.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
---

# Set Goal

Use this when the user wants a substantial goal that an agent can execute
directly in goal mode, loop mode, or a fresh long-running task.

This is not ordinary planning and not session closeout. Use `context-maintain`
for preserving current state, plan stress-tests, lessons, and closeout. Use
`set-goal` only when the desired output is an execution-ready goal prompt that
can guide sustained autonomous work.

## Goal-Writing Principles

Good long-running goals follow the current Codex guidance: give the agent the
task context, constraints, and a clear definition of done. For multi-hour work,
make the goal self-contained, observable, and safe to resume from.

1. Start with the user-visible outcome: what will be possible after completion.
2. Name the exact files, docs, commands, errors, and examples to inspect first.
3. State constraints and non-goals so the agent does not widen scope.
4. Define done as observable behavior, verification output, or reviewable
   artifacts.
5. Break work into independently verifiable milestones.
6. Include stop conditions: when to continue autonomously, when to ask, and
   when the goal is complete.
7. Require progress updates in the goal file or active plan so a later agent can
   resume from the artifact alone.

## Workflow

1. Read `NOW.md` and concise `CONTEXT.md`; use `node scripts/context-index.js
   hydrate "<task>"` before opening `PLAN.md`, chunks, or bulky/task-specific
   context. Read active `PLAN.md` sections only when the goal needs task-local
   state.
2. Inspect source-of-truth artifacts instead of relying only on conversation:
   diffs, commits, tests, docs, issues, failing commands, or relevant files.
3. Distill one primary outcome. If multiple unrelated outcomes remain, split
   them into separate goals.
4. Ask only when goal, scope, or done criteria require human judgment.
5. Output a ready-to-paste goal block unless the user explicitly asks for a
   file. If writing a file, make it self-contained and executable by a fresh
   agent.

## Goal Template

Use this shape for goal/loop mode:

```markdown
# Goal
[One outcome the agent should accomplish. State why it matters from the user's
perspective and how success will be visible.]

## Done Means
- [Observable or testable completion criterion.]
- [Required verification command or manual check.]
- [Closeout artifact or status update that must exist.]

## Context To Read First
- `NOW.md`
- concise `CONTEXT.md`
- `node scripts/context-index.js hydrate "<task>"` before `PLAN.md`, chunks, or bulky task-specific context
- [Task-specific files, docs, issues, commits, tests]

## Current State
- [What is already done.]
- [Known failures, open work, or uncertainty.]

## Constraints And Non-Goals
- [Rules, user preferences, safety limits, preserved behavior.]
- [Explicitly out-of-scope work.]

## Milestones
1. [Independently verifiable checkpoint.]
2. [Independently verifiable checkpoint.]
3. [Final integration/checkpoint.]

## Verification
- [Command/check to run.]
- [Expected result.]

## Loop Rules
- Continue through the next milestone without asking when the next action is
  clear and safe.
- Ask only for human-judgment blockers, permission-gated operations, secrets,
  external publishing, or destructive actions.
- At each stopping point, update progress, discoveries, decisions, and next
  step in the goal file or active plan.
- Stop only when Done Means is satisfied or a blocker requires the user.

## Closeout
- Update `PLAN.md` with task-local findings and decisions if it exists.
- Update `CONTEXT.md` for durable terms, rules, invariants, or lessons.
- If `CONTEXT.md`, `PLAN.md`, or `NOW.md` changed in a way future retrieval should see, run `node scripts/context-index.js update`.
- Rewrite `NOW.md` with focus, blockers, next step, and touched files.
```

## Quality Bar

- Prefer concrete filenames and commands over vague instructions.
- Keep the goal self-contained enough for a fresh agent to start without the
  prior conversation.
- Preserve uncertainty explicitly; do not invent resolved facts.
- Make every milestone prove something observable.
- Keep private raw data, secrets, and unnecessary personal details out of the
  goal.
