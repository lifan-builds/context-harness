# Context Harness Engineering Specs

Context Harness is a documentation-led Node/CommonJS CLI and skill package. It is not a frontend/backend application: there is no HTTP service, database, browser UI, or package build layer.

## Source-of-Truth Order

When instructions conflict, use this order:

1. `CONTEXT.md` for durable project constraints, terminology, and workflow.
2. `AGENTS.md` for the activation contract and generated context index.
3. The relevant root or companion `SKILL.md` for workflow behavior.
4. Product scripts and `tests/run-all.sh` for executable contracts.
5. `README.md` for user-facing explanation; treat numerical size targets there as guidance unless scripts enforce them.

Repository-local `.trellis/`, `.claude/`, `.cursor/`, `.codex/`, `.agent/`, and `.agents/` are trial/platform scaffolding, not distributable Context Harness modules.

## Guides

| Guide | Use it when |
|---|---|
| [Architecture](architecture.md) | Changing skill boundaries, runtime flows, installation, or generated state |
| [Context contracts](context-contracts.md) | Changing Markdown schemas, indexing, hydration, or context ownership |
| [Scripts and hooks](scripts-and-hooks.md) | Editing Node CLIs, hooks, installer behavior, diagnostics, or exit codes |
| [Testing](testing.md) | Planning validation or changing retrieval behavior |
| [Anti-patterns](anti-patterns.md) | Reviewing a design for scope creep, unsafe migration, or generated-file mistakes |

## Pre-Development Checklist

- Read `NOW.md`, then the relevant sections of `CONTEXT.md`.
- Hydrate task-specific context before opening bulky sources: `node scripts/context-index.js hydrate "<task>"`.
- Identify whether the change belongs to a skill, mechanical script, generated artifact, hook adapter, or evaluation tool.
- Search for the value, field, schema version, managed marker, or file list before changing it.
- Preserve the `AGENTS.md` Context Contract and edit only the managed index block programmatically.
- For retrieval changes, plan both narrow mechanics coverage and real-project shadow evaluation.

## Quality Check

- Run `tests/run-all.sh` for every product change.
- Run `node scripts/context-index.js check` after changing source context or indexing behavior.
- Regenerate derived `.context-harness/` state instead of hand-editing it.
- Verify user-facing docs, skill instructions, installer copies, and tests remain consistent.
- Do not commit or deploy unless the user requests it.
