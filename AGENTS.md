# Agent Instructions

## Context Contract
- At session start/resume, read `NOW.md` first, then use the Context Index
  below to choose relevant `CONTEXT.md` sections.
- Before planning or editing, respect `CONTEXT.md` `## Rules`.
- If the user teaches a durable term, invariant, workflow, constraint, or
  correction, update `CONTEXT.md` before it scrolls away.
- Route task-local findings and decisions to `PLAN.md`; durable lessons to
  `CONTEXT.md`.
- After updating `CONTEXT.md`, run `node scripts/context-index.js update`.
- Before ending, update `NOW.md` with current focus, blockers, next step, and
  touched files.

## Context Index
<!-- context-harness:index:start -->
Generated from `CONTEXT.md` by `node scripts/context-index.js update`.
Use this index to open only the `CONTEXT.md` sections relevant to the task.

- `NOW.md` - current focus, blockers, and next step. Read first on start/resume.
- `CONTEXT.md#project` - project identity and purpose.
- `CONTEXT.md#structure` - repo map and important directories.
- `CONTEXT.md#rules` - hard constraints, habits, and objectives. Subsections: Never, Always, Objectives.
- `CONTEXT.md#workflow` - setup, run, test, lint, and deploy commands.
- `CONTEXT.md#language` - canonical terms and avoided names.
- `CONTEXT.md#relationships` - durable invariants and domain relationships.
- `CONTEXT.md#flagged-ambiguities` - resolved naming or meaning conflicts.
- `CONTEXT.md#learned-patterns` - durable lessons from corrections or failed attempts.
<!-- context-harness:index:end -->
