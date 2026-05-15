---
name: context-reflect
description: Reflect after corrections, failed attempts, loops, or context drift; preserve durable lessons and close out NOW.md/PLAN.md.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
---

# Context Reflect

Use this for everything after init and catch-up: corrections, repeated failure,
lesson capture, plan updates, task-local findings, and session closeout.

## Trigger

Use this skill when any of these happen:

- The human corrects the same behavior more than once.
- You have made two failed attempts at the same task.
- Tool output contradicts your expectation.
- You realize you ignored `CONTEXT.md`, `NOW.md`, `PLAN.md`, or an explicit user
  instruction.
- The user says "remember this", "don't do that again", "always", "never",
  "use X instead", or "that's wrong."
- You are ending a session and need to update `NOW.md`.

For ordinary uncertainty before the first attempt, inspect or ask instead.

## Confidence

| Signal | Confidence |
|---|---:|
| Explicit rule or direct correction | High |
| Repeated pattern or strong approval | Medium |
| Inferred preference | Low |

Only high and repeated medium signals are durable-memory candidates.

## Reflection Loop

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
