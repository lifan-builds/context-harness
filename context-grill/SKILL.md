---
name: context-grill
description: Deprecated compatibility stub. Prefer context-maintain for plan stress-testing, context updates, and durable decisions.
user-invocable: false
allowed-tools: "Read, Write, Bash, Glob, Grep"
---

# Context Grill (Deprecated)

This skill is deprecated. Do not choose it for new work.

Use `context-maintain` instead when a plan, taxonomy, workflow, or context model
needs pressure-testing. Grill added another workflow choice without enough value;
the useful behavior now belongs in ordinary maintenance and reflection.

## Compatibility Path

If the user explicitly asks for context-grill anyway:

1. Read `NOW.md`, then `CONTEXT.md`, and `PLAN.md` if it exists.
2. Inspect files, docs, tests, and cheap dry runs before asking questions.
3. Ask only where human judgment changes the agent's direction.
4. Include a recommended answer for any question you ask.
5. Route durable terms, invariants, workflow constraints, and decisions through
   `context-maintain`.
6. Keep the response concise and name the next concrete checkpoint.
