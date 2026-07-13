# Context Harness Engineering Specs

Context Harness is a documentation-led Node/CommonJS CLI and skill package. It is not a frontend/backend application: there is no HTTP service, database, browser UI, or package build layer.

## Source-of-Truth Order

For work in this repository, use this order when instructions conflict:

1. `.trellis/spec/core/` for durable repository engineering constraints and terminology.
2. The active `.trellis/tasks/` artifact for task-specific requirements and decisions.
3. The relevant root or companion `SKILL.md` for Context Harness product workflow behavior.
4. Product scripts and `tests/run-all.sh` for executable contracts.
5. `README.md` for user-facing explanation; treat numerical size targets there as guidance unless scripts enforce them.

Root `AGENTS.md` is the Trellis activation layer for this checkout. References to Context Harness `AGENTS.md`, `CONTEXT.md`, `NOW.md`, and `PLAN.md` elsewhere in these specs describe product-generated target-project contracts, not this repository's local workflow state.

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

- Load the current Trellis task and relevant `.trellis/spec/core/` guidance.
- Identify whether the change belongs to a skill, mechanical script, generated artifact, hook adapter, or evaluation tool.
- Search for the value, field, schema version, managed marker, or file list before changing it.
- Preserve the `AGENTS.md` Context Contract and edit only the managed index block programmatically.
- For retrieval changes, plan both narrow mechanics coverage and real-project shadow evaluation.

## Quality Check

- Run `tests/run-all.sh` for every product change.
- Exercise `context-index.js update`/`check` through disposable target-project fixtures; this checkout does not keep local Context Harness source state.
- Regenerate target-project `.context-harness/` state instead of hand-editing it.
- Verify user-facing docs, skill instructions, installer copies, and tests remain consistent.
- Do not deploy Context Harness or Trellis through Agent Nexus; publication and product deployment require their own explicit scope.
