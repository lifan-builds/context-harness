# Architecture

## Product Shape

Context Harness is a portable filesystem-memory contract for coding agents. The product consists of:

- root and companion skills that apply model judgment;
- `CONTEXT.md`, `NOW.md`, optional `PLAN.md`, and `AGENTS.md` as durable Markdown state;
- synchronous Node scripts for deterministic mechanics;
- lifecycle hook adapters;
- evaluation CLIs for real-project retrieval and problem-solving checks.

Evidence: `README.md`, root `SKILL.md`, companion skill directories, `scripts/`, `hooks/hooks-codex.json`, and `tests/run-all.sh`.

## Skill Boundaries

Keep the root `SKILL.md` as a router. Split a companion skill only when invocation intent is genuinely different:

| Skill | Ownership |
|---|---|
| `context-init` | Fresh repositories only |
| `context-catch-up` | Fresh session or genuine resume recovery |
| `set-goal` | Produce a directly usable long-running goal prompt |
| `context-maintain` | Context updates, lesson capture, plan state, session closeout, reflection |
| `context-upgrade` | Explicit-only schema migration, repair, source upgrade, and fleet rollout |

Do not create separate update, capture, plan, end, or reflection skills. `CONTEXT.md` Relationships records this supported split.

## Judgment Versus Mechanics

Skills decide what is important, classify knowledge, resolve ambiguity, and choose where information belongs. Scripts should handle reproducible operations such as parsing, indexing, installation, file formatting, state stamping, and hook normalization.

Do not move semantic judgment into hard counters merely because it is easier to script. Conversely, do not ask a model to perform deterministic file transforms already owned by a script.

## Runtime Script Boundaries

- `scripts/lib.js`: shared hook I/O, safe reads, project-root detection, Markdown helpers, command execution, and configuration discovery.
- Installed runtime: `context-gen.js`, `context-index.js`, `install-project.js`, `codex-context-hook.js`, `guard.js`, `format-on-edit.js`, `session-end.js`, and `task.js`.
- Evaluation only: `eval-context-library.js` and `eval-agent-problem-solving.js`; these are not installed into target projects.
- Host adapter: `hooks/hooks-codex.json` wires the canonical Context Harness lifecycle hook.

`scripts/install-project.js` contains the authoritative installed-runtime file list. Its local helper duplication is a self-contained installer exception, not a pattern to copy.

## Core Flows

### Initialize

`context-init` detects metadata with `context-gen`, lets the agent curate it, writes schema-v3 source Markdown, installs runtime scripts, updates the index, and optionally creates a plan. It must reject existing, partial, or legacy layouts; those belong to `context-upgrade`.

### Recover

`context-catch-up` reads `NOW.md` first, derives a hydrate query from the objective, reconciles state with the repository, hydrates before opening `PLAN.md` or bulky detail, and reports only actionable context.

### Maintain

`context-maintain` routes task-local state to `PLAN.md`, durable knowledge to `CONTEXT.md`, and the resume packet to `NOW.md` last. Changes to source context are followed by index regeneration.

### Upgrade and Install

Install/upgrade logic classifies canonical, missing, known-clean, and locally modified files. Refresh safe files and report local modifications as conflicts; never blanket-overwrite a project fleet.

## Repository Workflow and Platform Scaffolding

This checkout uses Trellis for its repository workflow. `.trellis/`, `.claude/`, `.codex/`, and shared `.agents/` skills are local workflow scaffolding, not Context Harness source and must never enter `scripts/install-project.js`. Canonical Context Harness product adapters remain under `hooks/` and `scripts/`. Trellis-generated Cursor and Antigravity adapters are intentionally absent from this checkout.
