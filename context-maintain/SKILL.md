---
name: context-maintain
description: >
  Maintain context-harness during active work: update context, capture lessons,
  stress-test plans, keep PLAN.md/NOW.md current, and reflect after corrections
  or failed attempts.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
---

# Context Maintain

Use this after init and catch-up to update context, capture lessons,
stress-test plans, maintain `PLAN.md`, close `NOW.md`, or reflect after
corrections/failures.

## Trigger

Use this when structure, workflow, dependencies, rules, progress, findings,
decisions, or closeout state changed; the user teaches durable context; repeated
correction/failure happens; tool output contradicts expectations; you ignored
context or instructions; the user says "remember", "always", "never", "use X",
or "that's wrong"; or you are ending and need to update `NOW.md`.

For ordinary uncertainty before the first attempt, inspect or ask instead.

## Maintain Loop

1. Read `NOW.md`, then `CONTEXT.md`.
2. Classify information as durable context or task-local state.
3. Update the smallest appropriate section.
4. If `CONTEXT.md` changed, run `node scripts/context-index.js update`.
5. Prune stale or duplicate entries instead of appending forever.
6. Run the project's verification command when the change affects behavior.

## Confidence

| Signal | Confidence |
|---|---:|
| Explicit rule or direct correction | High |
| Repeated pattern or strong approval | Medium |
| Inferred preference | Low |

Only high and repeated medium signals are durable-memory candidates.

## Plan Stress-Test

Use when a plan, taxonomy, workflow, or context model needs pressure-testing
before implementation.

1. Read `NOW.md`, then `CONTEXT.md`, and `PLAN.md` if it exists.
2. Check vague terms against `CONTEXT.md` `## Language`.
3. Inspect files, docs, tests, and cheap dry runs before asking questions.
4. Ask only where human judgment changes the agent's direction.
5. If you ask, ask one question at a time and include a recommended answer.
6. Route task-local uncertainty to `PLAN.md`; route durable terms, invariants,
   and workflow constraints to `CONTEXT.md`.
7. Name the next concrete checkpoint and verification command.

## Reflect Mode

1. Stop the automatic retry.
2. Reconstruct the trace from files, tests, tools, or the correction.
3. Name the bad assumption in one sentence.
4. Classify the signal: explicit rule, direct correction, repeated pattern,
   strong approval, or low-confidence observation.
5. Route the lesson.
6. Choose the smallest correction.
7. State the checkpoint that will prove the next attempt worked.
8. Resume with the correction.

## Dream/Compact Mode

Use after substantial work, research, or migration when the session state needs
consolidation rather than more execution.

1. Review `PLAN.md`, recent findings, verification output, and touched files.
2. Prune stale task notes; archive completed progress when the plan is long.
3. Propose durable `CONTEXT.md` deltas only for terms, rules, invariants, or
   repeated lessons that will help future agents.
4. Record verification evidence in `PLAN.md` or closeout notes.
5. Do not store secrets, raw transcripts, raw web/API output, or personal data.
6. Refresh `AGENTS.md` if `CONTEXT.md` changed, then rewrite `NOW.md`.

## Routing

| Signal | Destination |
|---|---|
| Current-task discovery, failed attempt, or low-confidence lesson | `PLAN.md` `## Findings` |
| Active task progress or next checkpoint | `PLAN.md` `## Progress` |
| Non-trivial but ordinary decision | `PLAN.md` `## Decisions` |
| Durable process lesson | `CONTEXT.md` `## Learned Patterns` |
| New term or naming correction | `CONTEXT.md` `## Language` |
| Domain invariant or relationship | `CONTEXT.md` `## Relationships` |
| Correction to a specific skill workflow | `PLAN.md` skill patch candidate first; after approval, that skill's `SKILL.md` |
| Personal/global preference | Ask; this repo has no global memory target |

Only use ADR files when the target project already has an ADR convention.

## Durable Lessons

Write lessons only for missed conventions, repeated failures, new preferences
or constraints, surprising tool/framework/domain behavior, or skill workflow
corrections.

Do not record routine mistakes, temporary errors, secrets, private emotional
color, or unredacted command output.

Before writing, check for duplicates or contradictions. If a new lesson
conflicts with an old one, ask the user which rule wins.

Preferred format:

```markdown
- When [context], [do/avoid action] because [evidence or failure prevented].
```

## Skill Improvement Mode

Use only when evidence points at the skill workflow itself: repeated confusion,
direct correction, two failed attempts, or validation showing skill-caused bad
behavior.

1. Do not edit `SKILL.md` directly from reflection.
2. Write a `PLAN.md` skill patch candidate: target skill, problem, evidence,
   edit operations (`append`, `insert_after`, `replace`, `delete`), checks,
   status.
3. Validate with the narrowest checks. In this repo include `tests/run-all.sh`
   and skill packaging checks.
4. Ask the user for explicit approval before mutating any skill file.
5. If approved upstream, update the canonical skill source in this repository.
   Edit an installed/local copy only when the user explicitly asks for a local
   override.
6. Record accepted or rejected candidates in `PLAN.md` so future attempts do
   not repeat bad patches.

## Session Closeout

Before ending: rewrite `NOW.md` with focus, blockers, next step, ISO timestamp,
and touched files; refresh the `AGENTS.md` index if `CONTEXT.md` changed; prune
completed `PLAN.md` progress into `## Archive` when over 150 lines; keep
`NOW.md` under 20 lines.

```bash
node scripts/session-end.js
```
