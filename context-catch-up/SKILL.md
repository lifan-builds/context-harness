---
name: context-catch-up
description: Catch up a fresh agent session or true resumed session from context-harness files before planning or editing; do not use for ordinary mid-session follow-up turns after context is already loaded.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
---

# Context Catch-Up

Use this only at a fresh-session or true-resume boundary in a repository that
already has context-harness files.

Repeat catch-up only after a real resume/compaction boundary, a materially
changed user objective, or an external context change. Otherwise use loaded
context, and use `context-maintain` only for updates, closeout, lesson capture,
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

1. Read the small `NOW.md` recovery packet first.
2. If the user supplied an objective, task, question, or relevant context, use
   that as the hydrate query. If not, derive the query from `NOW.md` focus and
   immediate next step.
3. Reconcile the user's context with `NOW.md`: prefer the current user objective
   when scope changed, but surface material conflicts with repository state.
4. Run `node scripts/context-index.js hydrate "<query>"` before opening
   `PLAN.md`, chunks, or bulky/task-specific context.
5. Read concise `CONTEXT.md` directly only while it fits the startup budget;
   otherwise read hydrate-selected cards/sections. Even when it fits, keep the
   catch-up selective and do not load unrelated project history.
6. Use selected cards before large `PLAN.md` sections, chunks, or raw sources.
7. If there is no index, use only enough `CONTEXT.md` and `AGENTS.md` fallback
   context for the current objective and route repair to `context-upgrade`.
8. If the project uses ADRs, skim only titles/dates relevant to the current task.

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
