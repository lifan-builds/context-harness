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

- `<!-- context-harness:schema v3 -->` in generated context files.
- A small `AGENTS.md` Context Contract plus generated Context Index.
- Required `CONTEXT.md` sections: Project, Structure, Operating Constraints,
  Workflow, Language, Relationships, Flagged Ambiguities, Learned Patterns.
- A non-empty `NOW.md` with current focus, blockers, immediate next step, and
  touched files.

If files are empty, partial, stale, or missing the v3 schema marker, report the
drift in the catch-up summary and route inspection or repair work to explicit
`context-upgrade`. Do not rewrite partial or schema-drifted layouts from
catch-up, and do not let non-blocking harness drift replace the user's requested
project task.

## Read Order

1. Read `NOW.md` first.
2. Read concise `CONTEXT.md` as the always-read project layer; this is expected
   while it remains small enough to fit startup context.
3. Use `node scripts/context-index.js hydrate "<task>"` when available before
   opening `PLAN.md`, chunks, or bulky/task-specific context.
4. Use selected cards before opening large `PLAN.md` sections, chunks, or bulky
   raw source sections.
5. If `CONTEXT.md` has grown large, use hydrate-selected cards or sections
   instead of reading it wholesale and flag Dream/Compact as a follow-up.
6. If there is no index yet, use concise `CONTEXT.md` and `AGENTS.md` fallback
   context enough to summarize drift and recommend explicit `context-upgrade`.
7. If the project already uses ADRs, skim only the ADR titles/dates relevant to
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
  correction from the user; route layout repair to explicit `context-upgrade`.
- If `hydrate`, `check`, or generated indexes fail or warn about stale generated
  files, mention the drift and use current markdown fallback context. Keep index
  repair as a follow-up unless the drift blocks correctness or safety.
- Do not summarize raw external content into `CONTEXT.md`; route task-local
  discoveries to `PLAN.md` when work begins.
- Keep the summary short enough that it helps the next action, not replaces it.
