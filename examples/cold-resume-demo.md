# Cold Resume Demo

This artifact shows the intended recovery path for a fresh agent entering an
existing context-harness project without a long prompt dump.

## Fixture

The repository contains:

- `AGENTS.md` with the Context Contract and generated Context Index.
- `NOW.md` with current focus, active blockers, immediate next step, and touched
  files.
- `CONTEXT.md` with durable project rules, workflow, language, relationships,
  ambiguities, and learned patterns.
- `PLAN.md` with task-local findings, decisions, progress, follow-ups, and
  verification evidence.

## Fresh Agent Trace

1. Read `NOW.md`.

   Current focus: Context Harness release-readiness hardening around invocation
   timing, explicit upgrades, and the `set-goal` rename.

   Immediate next step: run the release verification commands after completing
   proof and README work.

2. Read `AGENTS.md`.

   The Context Contract says to read `NOW.md` first, use the Context Index to
   choose relevant `CONTEXT.md` sections, route task-local findings to
   `PLAN.md`, and update `NOW.md` before ending.

3. Choose relevant `CONTEXT.md` sections from the index.

   For release readiness, the relevant sections are `## Rules`, `## Workflow`,
   `## Language`, `## Relationships`, and `## Learned Patterns`.

4. Extract the durable rules that matter.

   Keep context-harness lightweight, preserve the small generated `AGENTS.md`
   contract, split skills only by genuinely different invocation intent, and
   keep `context-upgrade` explicit-only.

5. Inspect task-local state.

   `PLAN.md` shows the current release work: `context-catch-up` timing was
   tightened, `set-goal` replaced `context-launch`, `context-upgrade` became
   explicit-only, and remaining release gaps are proof fixtures, a cold-resume
   demo, README polish, local verification, and deployment follow-up.

## Correct Next Action

Implement the remaining release-proof work in this repository, then run:

```bash
tests/run-all.sh
node scripts/context-index.js check
```

After verification passes, update `PLAN.md` and `NOW.md`. Deploy through the
normal local layer only when the user wants the local installed copies updated.
