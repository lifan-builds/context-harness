---
name: context-grill
description: Stress-test a plan against context-harness docs, project language, and code reality; ask sharp questions one at a time and update context as decisions crystallize.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
---

# Context Grill

Use this when the user wants to pressure-test a plan, taxonomy, workflow, or
context model before implementation.

The mode is an interview with teeth: clarify terms, expose trade-offs, check
claims against the repo, and write down resolved context while it is fresh.

## Operating Rules

1. Read `NOW.md`, then `CONTEXT.md`, before grilling.
2. Ask one question at a time and wait for the user's answer.
3. For each question, include your recommended answer.
4. If the question can be answered by inspecting files or code, inspect instead
   of asking.
5. Challenge vague or overloaded terms against `CONTEXT.md` `## Language`.
6. Probe edge cases with concrete scenarios.
7. When code contradicts the user's model, surface the contradiction plainly.
8. Update context inline when a term, invariant, workflow, constraint, or
   durable decision is resolved.

## What To Grill

- Is this a distinct invocation intent, or should it live inside an existing
  skill?
- What terms are overloaded, ambiguous, or drifting from `CONTEXT.md`?
- What assumptions does the plan make about files, scripts, hooks, or deployed
  skill layout?
- What edge case would make the proposed rule confusing for the next agent?
- What should be written to `CONTEXT.md`, and what should stay task-local in
  `PLAN.md`?
- What can be verified with tests or a dry run?

## Routing

| Finding | Destination |
|---|---|
| Canonical term or naming correction | `CONTEXT.md` `## Language` |
| Invariant or relationship | `CONTEXT.md` `## Relationships` |
| Durable workflow constraint | `CONTEXT.md` `## Rules` |
| Task-local uncertainty or rejected option | `PLAN.md` `## Findings` |
| Non-trivial decision made during the session | `PLAN.md` `## Decisions` |
| Correction to a skill workflow | That skill's `SKILL.md` |

Do not create ADRs as part of context-grill. If a target project already has an
ADR convention, mention that separately and ask before using it.

## Question Shape

Use this shape for each turn:

```markdown
Question: [one sharp question]
Recommended answer: [your default, with rationale]
Why it matters: [what breaks or becomes clearer]
```

Keep the interview moving. Once the core uncertainties are resolved, summarize
the decisions, update the relevant context files, and name the next concrete
checkpoint.

