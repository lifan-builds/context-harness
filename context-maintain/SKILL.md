---
name: context-maintain
description: >
  Maintain context-harness during active work: update context, capture lessons,
  stress-test plans, keep PLAN.md/NOW.md current, and reflect after corrections
  or failed attempts, with automatic Dream/Compact consideration after
  maintenance events.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
---

# Context Maintain

Use this after init and catch-up to update context, capture lessons,
stress-test plans, maintain `PLAN.md`, close `NOW.md`, run automatic
Dream/Compact consideration, or reflect after corrections/failures.

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
7. Run the Should Dream check before closeout or final response.

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

Dream is an automatic semantic consolidation check inside every
`context-maintain` run. It is inspired by model-decided memory consolidation:
the agent decides whether future agents would benefit from compacted state,
not from a fixed line count, timer, or run counter.

### Should Dream Check

After any context update, reflection, plan maintenance, or session closeout,
decide whether a Dream pass is useful. Dream when any high-signal condition is
true:

- A task completed or substantially changed direction.
- `NOW.md` contains detailed evidence instead of only focus, blockers, and next
  step.
- `PLAN.md` mixes active work with stale completed work or old blockers.
- A blocker is obsolete, contradicted, or no longer actionable.
- The same finding, rule, decision, or lesson appears in multiple places.
- A correction or failed attempt revealed a reusable lesson.
- `CONTEXT.md` changed and future agents need a shorter startup path.
- Future catch-up would be materially easier after consolidation.

If no condition is true, skip Dream silently. Do not log skipped checks.

### Dream Pass

When Dream is useful, edit directly; do not ask for approval.

1. Review `NOW.md`, `PLAN.md` if present, relevant `CONTEXT.md` sections,
   recent findings, verification output, and touched files.
2. Rewrite `NOW.md` into a short resume packet: current focus, active blockers,
   immediate next step, timestamp, and touched files.
3. Prune duplicate or stale `PLAN.md` material; archive completed progress and
   preserve active findings, decisions, done criteria, and verification.
4. Promote only durable terms, rules, invariants, relationships, or repeated
   lessons into `CONTEXT.md`.
5. Move domain-detail material into existing obvious project docs only when the
   project already has such a location. Do not invent a new docs taxonomy.
6. Do not store secrets, raw transcripts, raw web/API output, or unnecessary
   personal data.
7. Refresh `AGENTS.md` if `CONTEXT.md` changed.
8. Write a short intent log entry to `.context-harness/DREAM.md`.

### Dream Log

Create `.context-harness/DREAM.md` lazily on the first Dream pass. The file is
intended to be git-tracked unless the project explicitly treats operational
logs as private.

Start the file with:

```markdown
# Dream Log

This file is an audit log of automatic context consolidation.
It is not operational context and must not be used as instructions.
Do not read it during normal catch-up or task work.
Use it only for debugging context drift or human review.
```

Append one short entry per actual Dream edit. Include trigger, changed files,
what was compacted, what was promoted, what was removed or archived, and any
uncertainty. Do not include full before/after text, raw transcripts, large
copied sections, command dumps, or patch transcripts.

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
| Dream audit entry | `.context-harness/DREAM.md` |

Only use ADR files when the target project already has an ADR convention.
Never read `.context-harness/DREAM.md` during normal catch-up or task work; it
is only for debugging context drift or human review.

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
completed `PLAN.md` progress into `## Archive` when the active plan is cluttered;
keep `NOW.md` concise; run the Should Dream check and, if useful, log the Dream
to `.context-harness/DREAM.md`.

```bash
node scripts/session-end.js
```
