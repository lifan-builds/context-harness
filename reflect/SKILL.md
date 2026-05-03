---
name: reflect
description: Use when an agent repeats mistakes, loops, ignores corrections, contradicts project context, or needs to recover after failed attempts or human feedback.
---

# Reflect

Use reflection to turn mistakes into a corrected next action, not a monologue.
Stop repeated failure, name the wrong assumption, and preserve only lessons
that should survive this session.

## Trigger

Use this skill when any of these happen:

- The human corrects the same behavior more than once.
- You have made two failed attempts at the same task.
- You feel tempted to retry the same command, edit, or explanation without new evidence.
- Tool output contradicts your expectation.
- You realize you ignored `CONTEXT.md`, `NOW.md`, `PLAN.md`, or an explicit user instruction.
- The conversation is circling around blame, apology, or confusion instead of progress.
- The user says "remember this", "don't do that again", "always", "never",
  "use X instead", or "that's wrong."

For ordinary uncertainty before the first attempt, ask or inspect instead.

## Learning Signals

Treat corrections as evidence, not embarrassment.

| Signal | Confidence | Example |
|---|---:|---|
| Explicit rule | High | "Always run tests before deploys." |
| Direct correction | High | "No, use pnpm, not npm." |
| Repeated pattern | Medium | Same preference appears twice. |
| Strong approval | Medium | "Yes, exactly, that format." |
| Inferred preference | Low | User edits wording without explaining why. |

Only high and repeated medium signals are durable-memory candidates. Low
confidence may change your next action, but ask before storing it.

## Reflection Loop

1. **Stop the automatic retry.** Do not run another command or patch another file
   until you can state what changed in your understanding.
2. **Reconstruct the trace.** Identify the last human correction, failed output,
   or contradiction. Use facts from files, tests, or tool output.
3. **Name the bad assumption.** Write one sentence: "I assumed X, but Y is true."
4. **Classify the signal.** Decide whether it is an explicit rule, correction,
   repeated pattern, approval, or low-confidence observation.
5. **Route the lesson.** Choose current plan, project memory, a specific skill,
   or nowhere durable.
6. **Choose the smallest correction.** Decide whether to inspect, ask, revert your
   own last change, add a test, or change the plan.
7. **State the new checkpoint.** Define what evidence will show the next attempt
   worked.
8. **Resume with the correction.** Keep the user update short and action-oriented.

If you cannot identify the bad assumption, do not guess. Ask the human what
constraint you are missing.

## Routing

| Signal | Destination |
|---|---|
| Current-task discovery | `PLAN.md` findings, or no durable write |
| Project convention | `CONTEXT.md` Always, Language, Relationships, or Learned Patterns |
| Correction to a skill workflow | That skill's `SKILL.md` |
| Architectural trade-off | ADR |
| Personal/global preference | Ask; this repo has no global memory target |
| Ambiguous or conflicting signal | Ask before storing |

## What To Say

> I assumed the loop was caused by stale state, but the failing output points to
> the parser rejecting valid input. I'm going to add a focused parser test first,
> then patch only that path.

Avoid:

- Generic apologies without a changed plan.
- Explaining intentions instead of evidence.
- Retrying because the next attempt "might work."
- Replacing tests or source inspection with reflection.
- Logging secrets, full transcripts, or raw private config as "memory."

## Durable Lessons

Write a lesson down only when it is likely to matter later:

- Missed project convention.
- Repeated failure pattern.
- New human preference or constraint.
- Surprising tool, framework, or domain behavior.
- Skill workflow correction.

For projects using context-harness:

- Add process lessons to `CONTEXT.md` `## Learned Patterns`.
- Add domain terms to `## Language`.
- Add invariants to `## Relationships`.
- If the correction applies to a specific skill, update that skill's `SKILL.md`
  instead of burying the rule in general project context.
- Keep `NOW.md` focused on the current next step, not the whole postmortem.

Before writing, check the target for duplicates or contradictions. If a new
lesson conflicts with an old one, ask the user which rule wins. Prefer this
format:

```markdown
- When [context], [do/avoid action] because [evidence or failure prevented].
```

Do not record routine mistakes, temporary errors, secrets, private emotional
color, or unredacted command output.

Before writing durable memory, show the proposed sentence and target location
when the user has not already asked you to remember or update it. If the user
explicitly says "don't remember this," record nothing.

## Red Flags

| Thought | Better Move |
|---|---|
| "I'll just try again." | Stop and identify what new evidence justifies the retry. |
| "The user is annoyed, so I should move faster." | Slow down enough to name the bad assumption. |
| "I know the fix now." | State the checkpoint that will prove it. |
| "This is embarrassing." | Convert it into one actionable lesson. |
| "I'll remember next time." | Store durable lessons on disk when they matter later. |
| "This might be a preference." | Treat it as low confidence and ask before storing. |
| "No need to check existing memory." | Dedupe first; stale or conflicting rules make agents worse. |
