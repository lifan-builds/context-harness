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

Before ordinary catch-up, quickly inspect `AGENTS.md`, `CONTEXT.md`, and
`NOW.md` for:

- `<!-- context-harness:schema v2 -->` or
  `<!-- context-harness:schema v3 -->` in generated context files.
- A small `AGENTS.md` Context Contract plus generated Context Index.
- Required `CONTEXT.md` sections: Project, Structure, Rules, Workflow,
  Language, Relationships, Flagged Ambiguities, Learned Patterns.
- A non-empty `NOW.md` with current focus, blockers, immediate next step, and
  touched files.

If files are old, empty, partial, or missing the schema marker, report the
drift in the catch-up summary. Repair it only when the user asks, when the
current task requires reliable project context, or when the edit is a narrow
index/script refresh. Prefer model-led edits that preserve local instructions
over broad rewrites. If repairing, refresh runtime scripts, run
`node scripts/context-index.js update`, and continue with the normal catch-up.

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
