# Context and Data Contracts

## Durable Markdown Ownership

`CONTEXT.md`, `NOW.md`, and optional `PLAN.md` are human/agent-owned sources.

- `CONTEXT.md`: durable project identity, structure, operating constraints, workflow, language, relationships, ambiguities, and learned patterns.
- `NOW.md`: current focus, active blockers, immediate next step, and session state.
- `PLAN.md`: task-local requirements, decisions, progress, and verification state.
- `AGENTS.md`: mixed ownership. Preserve the hand-maintained Context Contract; only the marker-delimited Context Index is generated.

The executable schema-v3 validation lives in `scripts/context-index.js` (`validateContext`, `validateNow`). Missing required sections, placeholder values, or stale generated state must fail `check`.

## Knowledge Routing

- Put stable terms, invariants, workflow constraints, relationships, and reusable lessons in `CONTEXT.md`.
- Put task-specific findings, decisions, acceptance criteria, and progress in `PLAN.md`.
- Write the minimal resume packet to `NOW.md` after other maintenance work.
- Keep `.context-harness/DREAM.md` as an exceptional consolidation audit log. Create it only after a real Dream edit and never read it during normal catch-up.

## Generated Retrieval State

`.context-harness/index.json`, `cards/`, and `chunks/` are generated outputs. Never hand-edit them. `scripts/context-index.js update` reads source Markdown, creates deterministic cards/chunks, prunes obsolete outputs, and replaces only the managed `AGENTS.md` index block.

Generated text and JSON are deterministic: sorted entries where order is not semantic, two-space JSON indentation, stable identities, and trailing newlines.

## Context Library Manifest

The index manifest uses schema 2. It records source hashes and line counts plus deterministic card identities (`ctx-<source>-<anchor>`). Card fields include source, kind, scope, importance, confidence, token estimate, tags, read cues, generated paths, content hash, facts, and optional chunk metadata.

Do not change a schema version or field in isolation. Search readers, writers, tests, evaluators, docs, and installed copies first.

## Hydration Contract

Hydrate output is a separate schema-1 retrieval packet, not the index manifest. It includes:

- query and normalized selection evidence;
- stale-state and context-size policy;
- selected card summaries and generated paths;
- whether raw source files remain deferred.

Hydration is lexical, bounded, and progressive. `scripts/context-index.js` scores titles, tags, cues, summaries, facts, and source fields, selecting at most seven cards. Preserve that bounded behavior unless real-repository evaluation supports a change.

## Context Size Policy

Distinguish guidance from enforcement. README size recommendations are hygiene targets. Runtime thresholds in `scripts/context-index.js` define actual warnings and direct-read policy. Do not turn documentation guidance into a new hard failure without an explicit product decision and tests.

## Other Versioned Contracts

Evaluation and fleet artifacts have independent schemas. `eval-agent-problem-solving.js` currently uses run manifest schema 3 and score schema 2. Installation/fleet reports record revision, dirty state, candidate hashes, changed paths, conflicts, preserved dirty paths, command results, and errors.

Treat each schema as independently versioned; never infer compatibility from another artifact's version.
