# Context

## Project
context-harness is a portable context framework for AI coding agents. It ships a root skill, companion skills, markdown context files, and Node.js scripts for keeping project memory lightweight and durable.

## Structure
```
.
context-catch-up/
context-grill/
context-init/
context-maintain/
scripts/
```

## Rules

### Never
1. Never turn context-harness into a large process framework.
2. Never split workflows into separate skills unless the agent's intent at invocation is genuinely different.
3. Never make ADRs required for ordinary context capture.

### Always
1. Always keep the user-facing skill set small and easy to choose from.
2. Always route durable corrections into project context before they scroll away.
3. Always preserve the AGENTS.md Context Contract.

### Objectives
1. Agents can initialize lightweight project context in a new repo.
2. Agents can catch up quickly from durable context files.
3. Agents can improve durable context through maintenance, reflection, and plan grilling.

## Workflow
- Setup: n/a
- Run: n/a
- Test: tests/run-all.sh
- Lint: n/a

## Language
- **context-maintain**: The ongoing context skill for updates, lesson capture, plan state, session closeout, and Reflect Mode after corrections or failed attempts. Avoid: context-update.
- **context-grill**: A focused interrogation mode for stress-testing plans, taxonomies, workflows, or context models against `CONTEXT.md`, task docs, and code reality.

## Relationships
- The preferred companion skill set is `context-init`, `context-catch-up`, `context-grill`, and `context-maintain`.
- `context-maintain` includes the old standalone reflection workflow as Reflect Mode.
- Local agent-nexus deployment should use `context-grill` instead of Matt Pocock's `grill-with-docs`.

## Flagged Ambiguities
- Update/capture/plan/end are not separate skills; they belong under `context-maintain`.

## Learned Patterns
- When splitting context-harness into companion skills, keep the split based on invocation intent because too many maintenance-like skills make the harness harder to choose.
- When learning from external skill systems like Superpowers or metaprompting skills, treat them as reusable patterns to adapt through our own agent workflow, not templates to copy directly.
