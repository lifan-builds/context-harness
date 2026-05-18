---
name: context-maintain
description: >
  Maintain context-harness during active work: update context, capture lessons,
  keep PLAN.md/NOW.md current, and reflect after corrections or failed
  attempts.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
---

# Context Maintain

Use this for everything after init, catch-up, and grill: update context, capture
lessons, maintain `PLAN.md`, close out `NOW.md`, and run Reflect Mode after
corrections or failed attempts.

## Trigger

Use this skill when any of these happen:

- The repo structure, workflow, dependency stack, or project rules changed.
- The user teaches a durable term, invariant, workflow, or constraint.
- You need to update task progress, findings, decisions, or closeout state.
- The human corrects the same behavior more than once.
- You have made two failed attempts at the same task.
- Tool output contradicts your expectation.
- You realize you ignored `CONTEXT.md`, `NOW.md`, `PLAN.md`, or an explicit user
  instruction.
- The user says "remember this", "don't do that again", "always", "never",
  "use X instead", or "that's wrong."
- You are ending a session and need to update `NOW.md`.

For ordinary uncertainty before the first attempt, inspect or ask instead.

## Maintain Loop

1. Read `NOW.md`, then `CONTEXT.md`.
2. Decide whether the information is durable project context or task-local
   working state.
3. Update the smallest appropriate section.
4. Prune stale or duplicate entries instead of appending forever.
5. Run the project's verification command when the change affects behavior.

## Confidence

| Signal | Confidence |
|---|---:|
| Explicit rule or direct correction | High |
| Repeated pattern or strong approval | Medium |
| Inferred preference | Low |

Only high and repeated medium signals are durable-memory candidates.

## Reflect Mode

1. Stop the automatic retry.
2. Reconstruct the trace from files, tests, tool output, or the human
   correction.
3. Name the bad assumption in one sentence.
4. Classify the signal: explicit rule, direct correction, repeated pattern,
   strong approval, or low-confidence observation.
5. Route the lesson.
6. Choose the smallest correction.
7. State the checkpoint that will prove the next attempt worked.
8. Resume with the correction.

## Routing

| Signal | Destination |
|---|---|
| Current-task discovery, failed attempt, or low-confidence lesson | `PLAN.md` `## Findings` |
| Active task progress or next checkpoint | `PLAN.md` `## Progress` |
| Non-trivial but ordinary decision | `PLAN.md` `## Decisions` |
| Durable process lesson | `CONTEXT.md` `## Learned Patterns` |
| New term or naming correction | `CONTEXT.md` `## Language` |
| Domain invariant or relationship | `CONTEXT.md` `## Relationships` |
| Correction to a specific skill workflow | That skill's `SKILL.md` |
| Personal/global preference | Ask; this repo has no global memory target |

Only use ADR files when the target project already has an ADR convention.

## Durable Lessons

Write a lesson down only when it is likely to matter later:

- Missed project convention
- Repeated failure pattern
- New human preference or constraint
- Surprising tool, framework, or domain behavior
- Skill workflow correction

Do not record routine mistakes, temporary errors, secrets, private emotional
color, or unredacted command output.

Before writing, check for duplicates or contradictions. If a new lesson
conflicts with an old one, ask the user which rule wins.

Preferred format:

```markdown
- When [context], [do/avoid action] because [evidence or failure prevented].
```

## Session Closeout

Before ending work in a context-harness repo:

1. Rewrite `NOW.md` with current focus, blockers, immediate next step, ISO
   timestamp, and touched files.
2. If `PLAN.md` exists and exceeds 150 lines, summarize completed items into
   `## Archive` and remove them from `## Progress`.
3. Keep `NOW.md` under 20 lines.

You may use:

```bash
node scripts/session-end.js
```

or, from an installed companion skill directory:

```bash
node ../scripts/session-end.js
```
