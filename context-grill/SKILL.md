---
name: context-grill
description: Stress-test a plan against context-harness docs, project language, and code reality; ask only high-leverage human-judgment questions and update context as decisions crystallize.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
---

# Context Grill

Use this when the user wants to pressure-test a plan, taxonomy, workflow, or
context model before implementation.

The mode is an interview with teeth, not a questionnaire. Clarify terms, expose
trade-offs, check claims against the repo, and write down resolved context while
it is fresh. Ask the user only where their judgment changes the agent's
direction.

## Operating Rules

1. Read `NOW.md`, then `CONTEXT.md`, before grilling.
2. Inspect files, code, docs, existing context, and cheap dry runs before
   asking; if inspection can answer the question, inspect instead of asking.
3. Ask one question at a time and wait for the user's answer.
4. For each question, include your recommended answer.
5. Challenge vague or overloaded terms against `CONTEXT.md` `## Language`.
6. Probe edge cases only when they reveal a real boundary, priority, or
   workflow decision.
7. When code contradicts the user's model, surface the contradiction plainly.
8. Update context inline when a term, invariant, workflow, constraint, or
   durable decision is resolved.

## Question Filter

Before asking, classify the uncertainty:

| Ask the user when the question needs... | Resolve yourself when the answer is... |
|---|---|
| Intent: what outcome or behavior they actually want | Inspectable in files, scripts, tests, docs, or deployed layout |
| Trade-off: which acceptable cost or constraint they prefer | Inferable from `CONTEXT.md`, `NOW.md`, `PLAN.md`, or prior decisions |
| Naming: what term should become canonical | Cheaply verifiable with a dry run, search, or small experiment |
| Boundary: what belongs inside vs outside a skill/workflow | A local implementation detail that does not change the user's goal |
| Priority: what matters enough to optimize for | An edge case that can be handled conservatively without user input |
| Durable decision: what should be recorded in context | A factual contradiction the agent can surface with evidence |

If a question does not pass this filter, do the agent work instead. Report the
finding only when it changes the recommendation, reveals a contradiction, or
should be written to context.

## What To Grill

- Is this a distinct invocation intent, or should it live inside an existing
  skill?
- What terms are overloaded, ambiguous, or drifting from `CONTEXT.md`?
- What assumption changes the plan if it is false, and can the agent verify it
  before asking?
- What edge case reveals a boundary the user must choose, rather than a detail
  the agent can handle conservatively?
- What should be written to `CONTEXT.md`, and what should stay task-local in
  `PLAN.md`?
- What can be verified with tests or a dry run?

Avoid low-value questions about formatting, obvious implementation mechanics,
file locations, or exhaustive hypotheticals unless the answer would alter the
skill's public behavior or durable context.

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

Use this shape for each user-facing question:

```markdown
Question: [one sharp question]
Recommended answer: [your default, with rationale]
Why this needs you: [the human judgment, trade-off, or durable decision involved]
```

Do not ask a question just because it is possible to ask. Keep the interview
moving. Once the core uncertainties are resolved, summarize the decisions,
update the relevant context files, and name the next concrete checkpoint.
