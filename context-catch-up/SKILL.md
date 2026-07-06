---
name: context-catch-up
description: Catch up a fresh agent session or true resumed session from context-harness files before planning or editing; do not use for ordinary mid-session follow-up turns after context is already loaded.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
---

# Context Catch-Up

Use this only at a fresh-session or true-resume boundary in a repository that
already has context-harness files.

Do not invoke during ordinary mid-session follow-up turns once project context
has already been loaded. Use the already-loaded context, and use
`context-maintain` only when context needs updating, closeout, lesson capture,
or plan stress-testing.

## Compatibility Check

Before ordinary catch-up, quickly inspect `AGENTS.md`, `CONTEXT.md`, and
`NOW.md` for:

- `<!-- context-harness:schema v2 -->` or
  `<!-- context-harness:schema v3 -->` in generated context files.
- A small `AGENTS.md` Context Contract plus generated Context Index.
- Required `CONTEXT.md` sections: Project, Structure, Operating Constraints,
  Workflow, Language, Relationships, Flagged Ambiguities, Learned Patterns.
  Legacy `Rules` is acceptable during migration but should be renamed by
  explicit `context-upgrade`.
- A non-empty `NOW.md` with current focus, blockers, immediate next step, and
  touched files.

If files are old, empty, partial, or missing the schema marker, report the
drift in the catch-up summary and route migration or repair work to explicit
`context-upgrade`. Do not rewrite old, partial, or schema-drifted layouts from
catch-up, and do not let non-blocking harness drift replace the user's requested
project task.

## Read Order

1. Read `NOW.md` first.
2. Use `AGENTS.md` Context Index and, when available,
   `node scripts/context-index.js hydrate "<task>"` to choose relevant cards or
   `CONTEXT.md` sections.
3. If there is no index yet, read `CONTEXT.md` enough to summarize the drift
   and recommend explicit `context-upgrade`.
4. If present, skim active `PLAN.md` sections.
5. If the project already uses ADRs, skim only the ADR titles/dates relevant to
   the current task.

## Output

Give the user a short catch-up summary:

- Current focus
- Active blockers
- Immediate next step
- Operating constraints or terms that matter for the requested task
- Any uncertainty that should be resolved before editing

## Guardrails

- Do not rewrite context files during catch-up except to capture a durable
  correction from the user; route layout migration to `context-upgrade`.
- If `hydrate`, `check`, or generated indexes fail, mention the drift and use the
  best available fallback context, then continue the requested catch-up unless
  the drift blocks correctness or safety.
- Do not summarize raw external content into `CONTEXT.md`; route task-local
  discoveries to `PLAN.md` when work begins.
- Keep the summary short enough that it helps the next action, not replaces it.
