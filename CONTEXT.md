# Context
<!-- context-harness:schema v2 -->

## Project
context-harness is a portable context framework for AI coding agents. It ships a root skill, companion skills, markdown context files, and Node.js scripts for keeping project memory lightweight and durable.

## Structure
```
.
context-catch-up/
context-grill/
context-handoff/ (deprecated compatibility stub)
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
3. Agents can improve durable context through maintenance, reflection, plan grilling, and long-running task launch briefs.

## Workflow
- Setup: n/a
- Run: n/a
- Test: tests/run-all.sh
- Lint: n/a
- Local deploy: After every repo update, use agent access to deploy it locally.

## Language
- **context-maintain**: The ongoing context skill for maintaining context after or during work: updates, lesson capture, plan state, session closeout, and Reflect Mode after corrections or failed attempts. Avoid: context-update.
- **context-grill**: A focused interrogation mode for stress-testing plans, taxonomies, workflows, or context models against `CONTEXT.md`, task docs, and code reality.
- **context-launch**: The skill for converting the current conversation and project context into a long-running Codex task brief or `/goal` for a fresh agent. Avoid: context-handoff.
- **context-handoff**: Deprecated compatibility stub. Avoid for new work; use `context-maintain` for closeout, transfer notes, next steps, and durable context updates.

## Relationships
- The preferred companion skill set is `context-init`, `context-catch-up`, `context-grill`, `context-launch`, and `context-maintain`.
- `context-maintain` includes the old standalone reflection workflow as Reflect Mode.
- `context-launch` is separate from `context-maintain` because its output is a ready-to-run task prompt for another agent, not ordinary context preservation.
- Local agent-nexus deployment should use `context-grill` instead of Matt Pocock's `grill-with-docs`.
- `AGENTS.md` is the small activation layer; `CONTEXT.md` is the durable source of truth, indexed into `AGENTS.md` by `scripts/context-index.js`.

## Flagged Ambiguities
- Update/capture/plan/end are not separate skills; they belong under `context-maintain`.
- Handoff is deprecated because it was not useful enough as a separate workflow; use `context-maintain` for closeout and next-step context.
- Launch is not handoff revival; use `context-launch` only when the desired artifact is a long-running agent task brief.

## Learned Patterns
- When splitting context-harness into companion skills, keep the split based on invocation intent because too many maintenance-like skills make the harness harder to choose.
- When learning from external skill systems like Superpowers or metaprompting skills, treat them as reusable patterns to adapt through our own agent workflow, not templates to copy directly.
- When writing skill frontmatter, use quoted or block scalar descriptions if the text contains colon-space because Codex may skip skills whose YAML metadata fails to parse.
- `context-grill` should ask the user only high-leverage questions where human judgment materially helps the agent; details that can be inferred from context, inspected in files, or verified by dry run should be handled by the agent instead of pushed to the user.
- When adapting context-harness to Codex, treat hooks as the active lifecycle path for enforcing context habits; keep plugin hooks optional until `plugin_hooks` support is stable and trusted.
- When `context-maintain` changes durable project context, refresh the generated `AGENTS.md` index so future agents can navigate `CONTEXT.md` selectively instead of loading the full file by default.
- Codex hooks should stay simple lifecycle nudges: session start points to `context-catch-up`, missing project context points to `context-init`, and substantial task completion points to `context-maintain`.
- When migrating existing projects to a new context-harness contract, prefer model-led edits over bulk migration scripts because each repo may have local AGENTS.md conventions that need judgment.
- For backward compatibility, generated context files should carry a lightweight schema/version marker and new skills should model-led upgrade older or partial context files instead of assuming the latest AGENTS.md contract is already present.
- When a workflow feels like low-value process, deprecate it instead of keeping it in the preferred skill path; `context-handoff` now remains only as a compatibility stub.
