# Context
<!-- context-harness:schema v3 -->

## Project
context-harness is a portable context framework for AI coding agents. It ships a root skill, companion skills, markdown context files, and Node.js scripts for keeping project memory lightweight and durable.

## Structure
```
.
context-catch-up/
context-init/
context-maintain/
context-upgrade/
set-goal/
scripts/
```

## Operating Constraints

- Keep context-harness lightweight; do not turn it into a large process framework.
- Split workflows into separate skills only when the agent's invocation intent is genuinely different.
- Do not require ADRs for ordinary context capture.
- Keep the user-facing skill set small and easy to choose from.
- Route durable corrections into project context before they scroll away.
- Preserve the AGENTS.md Context Contract.

## Legacy Objectives
<!-- Deprecated in schema v3. Preserve as project intent; use PLAN.md Done Criteria and Workflow Verification for active checks. -->
1. Agents can initialize lightweight project context in a new repo.
2. Agents can catch up quickly from durable context files.
3. Agents can improve durable context through maintenance, reflection, plan stress-tests, and long-running goal prompts.

## Workflow
- Setup: n/a
- Run: n/a
- Test: tests/run-all.sh
- Lint: n/a
- Verification: `tests/run-all.sh` exits 0 before completing code changes.
- Local deploy: After every repo update, use agent access to deploy it locally.

## Language
- **context-catch-up**: The startup/resume skill for a freshly started agent session or genuinely resumed session that needs to recover project state before planning or editing. Avoid invoking it during ordinary mid-session turns after context has already been loaded.
- **context-init**: The fresh-repository initialization skill. It creates a new context-harness layout only; avoid using it for legacy, partial, or schema migration.
- **context-maintain**: The ongoing context skill for maintaining context after or during work: updates, lesson capture, plan state, session closeout, and Reflect Mode after corrections or failed attempts. Avoid: context-update.
- **set-goal**: The skill for converting the current conversation and project context into a directly usable long-running goal for Codex goal mode, loop mode, or a fresh agent.
- **context-upgrade**: Explicit-only operator skill for context-harness source upgrades, legacy v1 migration, schema migrations, partial/custom layout repair, local fleet migrations, deployment checks, and packaging migration lessons for repeat use. Avoid implicit invocation.
- **Legacy Objectives**: Preserved schema v2 project outcomes. Avoid using them for new work; use `PLAN.md` Done Criteria and `CONTEXT.md` Workflow Verification.

## Relationships
- The preferred companion skill set is `context-init`, `context-catch-up`, `set-goal`, `context-maintain`, and explicit-only `context-upgrade`.
- Deprecated compatibility stub skills are removed completely, not shipped as hidden/non-invocable skills.
- `context-init` is only for fresh repositories; all migration and layout repair belongs to explicit `context-upgrade`.
- `context-catch-up` is only for whole fresh session or true resume boundaries; ordinary follow-up turns should rely on already-loaded context and use `context-maintain` only when context needs updating.
- `context-maintain` includes the old standalone reflection workflow as Reflect Mode.
- `set-goal` is separate from `context-maintain` because its output is a ready-to-run goal/loop prompt for another agent or mode, not ordinary context preservation.
- `context-upgrade` must not be implicitly invoked; it is reserved for explicit user requests when the harness, schema, deployed skill copies, or local project fleet need an update.
- `context-maintain` owns automatic Dream/Compact consideration after maintenance events; Dream edits context directly when useful and logs intent to `.context-harness/DREAM.md`.
- `.context-harness/DREAM.md` is a non-operational audit log for debugging context drift or human review; agents must not read it during normal catch-up or task work.
- Local agent-nexus deployment should use this repository's canonical source and `context-maintain` instead of Matt Pocock's `grill-with-docs`.
- `AGENTS.md` is the small activation layer; `CONTEXT.md` is the durable source of truth, indexed into `AGENTS.md` and `.context-harness/` cards/chunks by `scripts/context-index.js`.
- Skill self-improvement may propose and validate candidate patches, but modifying a skill requires explicit user approval.
- The source copy in this repository is canonical for context-harness skills; installed/local copies are deployment targets or user-private forks, not the default place for accepted upstream improvements.
- Schema v3 removes durable project-wide Objectives from the default path; verification belongs in `CONTEXT.md` Workflow and task-specific outcomes belong in `PLAN.md` Done Criteria.

## Flagged Ambiguities
- Update/capture/plan/end are not separate skills; they belong under `context-maintain`.
- Removed skills are not compatibility shims; `set-goal`, `context-maintain`, and `context-upgrade` own their replacement behaviors directly.

## Learned Patterns
- When splitting context-harness into companion skills, keep the split based on invocation intent because too many maintenance-like skills make the harness harder to choose.
- When learning from external skill systems like Superpowers or metaprompting skills, treat them as reusable patterns to adapt through our own agent workflow, not templates to copy directly.
- When writing skill frontmatter, use quoted or block scalar descriptions if the text contains colon-space because Codex may skip skills whose YAML metadata fails to parse.
- Plan stress-tests should ask the user only high-leverage questions where human judgment materially helps the agent; details that can be inferred from context, inspected in files, or verified by dry run should be handled by the agent instead of pushed to the user.
- When adapting context-harness to Codex, treat hooks as the active lifecycle path for enforcing context habits; keep plugin hooks optional until `plugin_hooks` support is stable and trusted.
- When `context-maintain` changes durable project context, refresh the generated `AGENTS.md` index so future agents can navigate `CONTEXT.md` selectively instead of loading the full file by default.
- Codex hooks should stay simple lifecycle nudges: session start points to `context-catch-up`, missing project context points to `context-init`, and substantial task completion points to `context-maintain`.
- When migrating existing projects to a new context-harness contract, prefer model-led edits over bulk migration scripts because each repo may have local AGENTS.md conventions that need judgment.
- For backward compatibility, generated context files should carry a lightweight schema/version marker and new skills should model-led upgrade older or partial context files instead of assuming the latest AGENTS.md contract is already present.
- When a workflow is removed from the preferred skill path, remove the stub completely once the replacement behavior is covered by an active skill and tests.
- When using SkillOpt-style self-improvement, separate proposal from mutation: collect evidence and validation, ask the user for approval, then update the canonical skill source rather than silently editing installed copies.
- When adapting Claude Code-style auto memory, use semantic model judgment inside `context-maintain` instead of hard counters or line limits; route lengthy durable detail through cards/chunks, keep concise facts visible in markdown, and keep audit history separate from operational context.
- When installing CommonJS runtime scripts into JavaScript projects, add a `scripts/package.json` with `"type": "commonjs"` because parent packages may set `"type": "module"` and break `require()`.
- When supporting nested context roots, detect `CONTEXT.md` before parent package/git markers because nested project folders can otherwise read and update the parent repo's context files.
- When changing context-harness retrieval behavior, keep unit tests minimal for mechanics and validate usefulness through shadow tests across real project copies because retrieval quality depends on real context shapes.
- When evaluating context-harness value, compare fresh-agent problem-solving in isolated real-repo copies with and without context-harness because the core goal is improved task understanding and next-step quality, not just retrieval correctness.
- When adding progressive context commands such as `hydrate`, account for real-fleet version skew: agents need capability-aware fallback instructions when installed project scripts only support older commands.
- When harness health issues appear during a real project task, treat them as follow-ups unless they block correctness or safety because context-harness should improve task solving rather than become the task.
- When old project docs compete with active context, clean, mark, or archive those docs in their natural location when suitable instead of only adding more context-harness state.
- Prefer `Operating Constraints` over `Rules` with `Never`/`Always` because Karpathy-style agent guidance works better as compact behavioral principles plus project-specific constraints that change decisions.
