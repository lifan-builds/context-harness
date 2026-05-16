# context-harness

4 files, 9 rules, zero ceremony.

A portable context framework for AI coding agents. Generates `AGENTS.md`,
`CONTEXT.md`, `NOW.md`, `PLAN.md` and ships Node.js scripts that do the
mechanical work: stack detection, decision capture, session stamping, eval loops. Inspired by
[Karpathy's coding principles](https://github.com/forrestchang/andrej-karpathy-skills):
behavioral guardrails beat heavy infrastructure.

## Philosophy

- Context window = volatile RAM. Filesystem = persistent storage.
- 4 behavioral principles > 50 process rules
- Core rules apply everywhere before project-specific rules
- User-defined constraints (3 Never + 3 Always + 3 Objectives) keep the agent aligned
- Durable human input and agent discoveries belong on disk before they scroll away
- `AGENTS.md` activates the contract; scripts do real work; markdown sets direction

## Core Rules

These rules apply to every project using context-harness. Project-specific
Never / Always / Objectives add local constraints on top.

1. **Tool-native first** — Prefer CLI, MCP tools, or skills over browser
   automation whenever they can accomplish the task. Reserve browser automation
   for browser-specific workflows, visual verification, and web UIs with no
   better interface.

## Harness Compatibility

The core (`AGENTS.md` contract + SKILL.md body + `scripts/`) is
harness-agnostic — Markdown, pure Node.js 18+, POSIX bash, no SDK dependencies.
Codex uses `AGENTS.md` as the automatic activation layer; other harnesses can
read the same file or wire scripts into their own hook systems.

| Harness | Context contract | Skill body | Scripts | Automatic layer |
|---|---|---|---|---|
| **Codex** | `AGENTS.md` | ✓ | ✓ | `AGENTS.md` |
| **Claude Code** | CLAUDE.md/AGENTS.md adapter | ✓ | ✓ | Optional hooks |
| **Cursor** | rules/AGENTS.md adapter | ✓ | ✓ | Optional hooks |
| **Anywhere with Node 18+** | Markdown contract | — | ✓ | Wire up your own trigger |

Scripts are invoked the same way on every platform: `node <skill-dir>/scripts/<name>.js`.

## What It Generates

| File | Purpose | Max Lines |
|------|---------|-----------|
| `AGENTS.md` | Always-read context contract for Codex and compatible agents | 30 |
| `CONTEXT.md` | Project info + your 9 rules + learned patterns | 80 |
| `NOW.md` | Working memory: current focus, blockers, next step | 20 |
| `PLAN.md` | On-demand living plan for multi-step work | 150 |
| `CONTEXT-MAP.md` | Optional map for multi-context repos | — |

`CONTEXT.md` also includes optional durable memory sections:

- `## Language` — canonical project terms, avoided aliases, and short definitions
- `## Relationships` — domain invariants worth preserving
- `## Flagged Ambiguities` — naming or meaning conflicts the agent/user resolved
- `## Learned Patterns` — process lessons learned after struggle, capped at 10

Reflection and correction memory is the highest-value context to carry over, but
it has to land in the right place:

| Learning | Destination |
|---|---|
| Task-local discovery, failed attempt, or low-confidence lesson | `PLAN.md` `## Findings` |
| Durable process lesson after a loop, correction, or repeated mistake | `CONTEXT.md` `## Learned Patterns` |
| New term or naming correction | `CONTEXT.md` `## Language` |
| Domain invariant or relationship | `CONTEXT.md` `## Relationships` |
| Decision or trade-off | `PLAN.md` `## Decisions` |
| Correction to a skill workflow | That skill's `SKILL.md` |

Keep ordinary decisions in `PLAN.md`. Promote only durable terms,
relationships, and repeated lessons into `CONTEXT.md`.

## Companion Scripts

All scripts are Node.js and share helpers in `scripts/lib.js` (hook I/O,
project-root walk, stack detection, markdown section parsing, command runner).

| Script | Purpose |
|--------|---------|
| `scripts/lib.js` | Shared helpers imported by everything else |
| `scripts/context-gen.js` | Auto-detect project metadata + emit stack-aware rule defaults |
| `scripts/guard.js` | Security: block `--no-verify`, detect secrets, protect linter configs |
| `scripts/format-on-edit.js` | Auto-format files after edits (Biome, Prettier, Ruff, gofmt) |
| `scripts/session-end.js` | Stamp NOW.md, prune PLAN.md when >150 lines |
| `scripts/task.js` | Task switcher — rewrites NOW.md; logs to PLAN.md Progress |
| `scripts/eval-loop.js` | GAN-style evaluator: check work against your 3 Objectives |

`guard.js` and `format-on-edit.js` read their payload from the `TOOL_INPUT`
env var or from stdin (pipe-friendly for Codex hooks, Cursor, Claude Code, and custom
harnesses).

## The 9 Rules Framework

You define project-specific rules across 3 categories. Suggested Always rules
include the Core Rules, so some generated contexts may start with more than 9
total rules when the global layer is counted.

**Never** (hard constraints the agent must not violate)
```
1. Never store secrets or credentials in the repo
2. Never disable or weaken type checking
3. Never ignore failing tests
```

**Always** (habits the agent must follow)
```
1. Always write tests for new public functions
2. Always handle errors explicitly
3. Always run the linter before committing
```

**Objectives** (mid-to-high level outcomes — what "done" means for the project)
```
1. CLI users complete the core workflow on a fresh install (tests/smoke.sh exits 0)
2. API p95 latency stays under 200ms at expected load (scripts/perf-check.js exits 0)
3. Docs cover every public entry point (scripts/doc-coverage.js exits 0)
```

Objectives are **outcome-level**, not dev hygiene. "All tests pass" or
"no type errors" belong in **Always** (process habits). An Objective should
answer: "if all of these hold, has the project succeeded at its purpose?"
Push for verifiable form (a command, metric, or check) whenever feasible —
observable-only is OK if automation isn't.

`context-gen.js` prefills stack-specific Never/Always defaults (TypeScript
gets `tsc --noEmit`, Python gets `ruff check`, Go gets `go vet`, etc.).
Objectives are project-specific and are not auto-filled — you write them.

## Companion Skills

The root `context-harness` skill is the front door. The actual workflows are
split by invocation intent:

| Skill | Use when |
|---|---|
| `context-init` | A repo is new to context-harness or needs v1 migration |
| `context-catch-up` | A new agent or resumed session needs to read durable context |
| `context-grill` | A plan, taxonomy, workflow, or context model needs to be stress-tested against docs and code |
| `context-maintain` | Work is underway and the agent needs to update context, capture lessons, maintain plan state, close out, or reflect after a correction |

`context-grill` borrows the strongest idea from Matt Pocock's
`grill-with-docs`: ask one sharp question at a time, include a recommended
answer, inspect the code when the answer is discoverable, challenge fuzzy terms
against `CONTEXT.md`, and update context as decisions crystallize.

`context-maintain` includes Reflect Mode for repeated mistakes, loops, failed
attempts, and human corrections. Maintenance-like actions such as update,
capture, plan, and end are intentionally not separate skills.

## Installation

Let `<skill-dir>` be wherever your harness loads skills from. Common paths:

| Harness | Default skill dir |
|---|---|
| Claude Code | `~/.claude/skills/` |
| Cursor | `~/.cursor/skills/` |
| Antigravity | `~/.gemini/antigravity/skills/` |
| [agent-nexus](https://github.com/lifan-builds/agent-nexus) | manages all three via `nexus sync` |

**Option 1: agent-nexus (multi-IDE)**
```yaml
# nexus.yml
packages:
  - repo: fantasy-cc/context-harness
    ref: main
```
Then `nexus sync` deploys to every configured target.

**Option 2: Claude Code plugin**
```
/plugin marketplace add https://github.com/fantasy-cc/context-harness
```

**Option 3: Direct clone**
```bash
git clone https://github.com/fantasy-cc/context-harness <skill-dir>/context-harness
```

## Usage

**Initialize** — scaffolds AGENTS.md + CONTEXT.md + NOW.md for your project:
```
/context-harness
```
On harnesses without slash commands, ask the agent to read `SKILL.md` and
follow the Init mode workflow.

**Evaluate** — run the eval loop against your Objectives:
```bash
node <skill-dir>/context-harness/scripts/eval-loop.js
```

**Switch tasks** — rewrites NOW.md atomically:
```bash
node <skill-dir>/context-harness/scripts/task.js start "New focus"
node <skill-dir>/context-harness/scripts/task.js done
```

## Optional Hooks

The portable baseline is the `AGENTS.md` Context Contract. Hooks are optional
adapters for harnesses that can run scripts on prompt submit, tool use, stop, or
compaction events.

| Hook | Trigger | What it does |
|------|---------|-------------|
| Prompt submit / session start | Every prompt or resume | Injects NOW.md + reminder to check rules |
| PreToolUse (Bash) | Git commands | Blocks `--no-verify`, detects secrets |
| PostToolUse (Write/Edit) | After edits | Auto-formats the edited file |
| Stop / compact | End of session or compaction | Stamps NOW.md, prunes PLAN.md, reminds memory routing |

Each harness should wire these scripts through its native plugin/config layer
rather than depending on SKILL.md frontmatter.

## Migration from v1

If you have existing v1 files (AGENTS.md, PLANS.md, FINDINGS.md, EVALUATION.md),
invoke the skill and it will offer to migrate — pulling learned patterns,
active tasks, and conventions into the new 3-file structure.

## Token Budget

| | v1 | v2 | Reduction |
|---|---|---|---|
| Instruction footprint | ~813 lines | ~300 lines | **63%** |
| Files generated | 6 | 3–4 | **33–50%** |
| Per-prompt instruction load | ~30 lines + noise | AGENTS.md contract + tiny context files | **cleaner** |
