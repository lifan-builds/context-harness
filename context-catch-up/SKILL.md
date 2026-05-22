---
name: context-catch-up
description: Catch up a new agent or resumed session from context-harness files before planning or editing.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
---

# Context Catch-Up

Use this when starting or resuming work in a repository that already has
context-harness files.

## Compatibility Check

Before ordinary catch-up, inspect `AGENTS.md`, `CONTEXT.md`, and `NOW.md` for:

- `<!-- context-harness:schema v2 -->` in generated context files.
- A small `AGENTS.md` Context Contract plus generated Context Index.
- Required `CONTEXT.md` sections: Project, Structure, Rules, Workflow,
  Language, Relationships, Flagged Ambiguities, Learned Patterns.
- A non-empty `NOW.md` with current focus, blockers, immediate next step, and
  touched files.

If files are old, empty, partial, or missing the schema marker, run
Compatibility Upgrade before the normal catch-up summary.

## Compatibility Upgrade

Upgrade through model-led edits, not bulk rewrite:

1. Preserve project-specific instructions and durable context.
2. Replace only old context-harness boilerplate in `AGENTS.md` with the current
   Context Contract and schema marker.
3. Add missing `CONTEXT.md` sections with concise placeholders only when the
   repo lacks them; do not invent project-specific rules or Objectives.
4. If `NOW.md` is empty or missing, create a minimal resume state from visible
   repo/task context and mark unknowns explicitly.
5. Install or refresh runtime scripts:

   ```bash
   node <context-harness-skill-dir>/scripts/install-project.js
   ```

6. Run `node scripts/context-index.js update`.
7. Show the user a short upgrade summary before continuing.

Ask only when project intent, durable rules, or Objectives cannot be inferred.

## Read Order

1. Read `NOW.md` first.
2. Use `AGENTS.md` Context Index to choose relevant `CONTEXT.md` sections.
3. If there is no index yet, read `CONTEXT.md` enough to run Compatibility
   Upgrade.
4. If present, skim active `PLAN.md` sections.
5. If the project already uses ADRs, skim only the ADR titles/dates relevant to
   the current task.

## Output

Give the user a short catch-up summary:

- Current focus
- Active blockers
- Immediate next step
- Rules or terms that matter for the requested task
- Any uncertainty that should be resolved before editing

## Guardrails

- Do not rewrite context files during catch-up unless running Compatibility
  Upgrade or capturing a durable correction from the user.
- Do not summarize raw external content into `CONTEXT.md`; route task-local
  discoveries to `PLAN.md` when work begins.
- Keep the summary short enough that it helps the next action, not replaces it.
