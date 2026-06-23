---
name: context-init
description: Initialize context-harness in a new repository or migrate a legacy v1 context setup into AGENTS.md, CONTEXT.md, NOW.md, and optional PLAN.md.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
---

# Context Init

Use this when a repository has no `CONTEXT.md`, or when legacy v1 files exist
without the current context-harness layout.

## Goal

Create the smallest durable context layer that lets future agents catch up:

- `AGENTS.md` as the automatic Context Contract
- `CONTEXT.md` for project facts, rules, language, relationships, and lessons
- `NOW.md` for the current focus
- `PLAN.md` only when there is an active multi-step task

Generated `AGENTS.md` and `CONTEXT.md` must include
`<!-- context-harness:schema v3 -->` so future skill versions can detect and
upgrade older layouts.

## Init Flow

1. Run the generator:

   ```bash
   node scripts/context-gen.js
   ```

   If running from an installed companion skill directory, use:

   ```bash
   node ../scripts/context-gen.js
   ```

2. Present the generated `## Suggested Rules` and `## Suggested Workflow` as a
   starting point.
3. Ask the user to confirm or edit `Never`, `Always`, and workflow
   verification commands.
4. Write `CONTEXT.md`, `NOW.md`, and `AGENTS.md` from the templates in the root
   `context-harness` skill.
5. Install context-harness runtime scripts into the target repo:

   ```bash
   node <context-harness-skill-dir>/scripts/install-project.js
   ```

6. Run `node scripts/context-index.js update` so `AGENTS.md` has a generated
   high-level index into `CONTEXT.md`.
7. Ask whether there is a multi-step task. If yes, create `PLAN.md`.

## Migration Flow

If legacy v1 files exist but `CONTEXT.md` does not:

1. Run `context-gen.js` for fresh `Project` and `Structure`.
2. Copy durable learned patterns into `CONTEXT.md`.
3. Ask the user to distill conventions into concise `Never` and `Always`
   rules plus workflow verification commands.
4. Merge active items from `PLANS.md` and `FINDINGS.md` into `PLAN.md`.
5. Replace old agent instructions with the `AGENTS.md` Context Contract.

If context-harness files exist but are old, empty, partial, or missing the
schema marker, use `context-catch-up` Compatibility Upgrade instead of init.

## Guardrails

- Do not create durable Objectives for new schema v3 projects; use `PLAN.md`
  Done Criteria and `CONTEXT.md` Workflow Verification instead.
- Keep generated files short enough to be read every session.
- Keep `AGENTS.md` small: contract plus generated `CONTEXT.md` index.
- Runtime scripts are project-local after init, so `AGENTS.md` can refer to
  `node scripts/context-index.js update`.
- Do not create ADRs unless the target project already has an ADR workflow.
