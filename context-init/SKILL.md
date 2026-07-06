---
name: context-init
description: Initialize context-harness in a new repository by creating AGENTS.md, CONTEXT.md, NOW.md, and optional PLAN.md.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
---

# Context Init

Use this only when a repository has no context-harness layout and should get a
fresh `AGENTS.md`, `CONTEXT.md`, `NOW.md`, and optional `PLAN.md`.

If a repository already has partial, stale, or custom context-harness files, use
explicit `context-upgrade` instead. Init does not repair existing layouts.

## Goal

Create the smallest durable context layer that lets future agents catch up:

- `AGENTS.md` as the automatic Context Contract
- `CONTEXT.md` for project facts, operating constraints, language, relationships, and lessons
- `NOW.md` for the current focus
- `PLAN.md` only when there is an active multi-step task

Generated `AGENTS.md` and `CONTEXT.md` must include
`<!-- context-harness:schema v3 -->` so future skill versions can detect the
layout.

## Init Flow

1. Run the generator:

   ```bash
   node scripts/context-gen.js
   ```

   If running from an installed companion skill directory, use:

   ```bash
   node ../scripts/context-gen.js
   ```

2. Present the generated `## Suggested Operating Constraints` and `## Suggested Workflow` as a starting point.
3. Ask the user to keep only project-specific constraints a future agent would not infer from code or docs, and confirm workflow verification commands.
4. Write `CONTEXT.md`, `NOW.md`, and `AGENTS.md` from the templates in the root
   `context-harness` skill.
5. Install context-harness runtime scripts into the target repo:

   ```bash
   node <context-harness-skill-dir>/scripts/install-project.js
   ```

6. Run `node scripts/context-index.js update` so `AGENTS.md` has a generated
   high-level index and `.context-harness/` has retrieval cards.
7. Ask whether there is a multi-step task. If yes, create `PLAN.md`.

## Guardrails

- Use `PLAN.md` Done Criteria and `CONTEXT.md` Workflow Verification instead of
  durable project-wide objectives.
- Do not repair existing layouts here; route partial, stale, or custom
  context-harness files to explicit `context-upgrade`.
- Keep generated files short enough to be read every session.
- Keep `AGENTS.md` small: contract plus generated `CONTEXT.md` index and a
  pointer to `hydrate`.
- Runtime scripts are project-local after init, so `AGENTS.md` can refer to
  `node scripts/context-index.js update` and `hydrate`.
- Do not create ADRs unless the target project already has an ADR workflow.
