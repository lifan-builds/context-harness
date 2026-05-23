# context-harness

4 files, 9 rules, zero ceremony.

A portable context framework for AI coding agents. Generates `AGENTS.md`,
`CONTEXT.md`, `NOW.md`, `PLAN.md` and ships Node.js scripts that do the
mechanical work: stack detection, decision capture, session stamping, eval loops.

context-harness is my answer to a simple lesson from studying serious agent
skill systems: skills are compressed patterns. The best move is not to copy a
big framework wholesale. It is to let your agent learn from those patterns,
adapt them to your workflow, and keep improving its own context loop.

Inspired by
[Karpathy's coding principles](https://github.com/forrestchang/andrej-karpathy-skills):
behavioral guardrails beat heavy infrastructure.

## Quick Start

Use `context-harness` when a repo needs durable agent memory without adopting a
large framework.

```bash
git clone https://github.com/lifan-builds/context-harness.git
```

Then ask your coding agent to initialize context in a target repository using
the `context-harness` skill. On harnesses without slash commands, have the agent
read `SKILL.md` and follow Init mode.

The generated repo-level contract is small:

```text
AGENTS.md   # small always-read contract + generated CONTEXT.md index
CONTEXT.md  # durable project facts, terms, constraints, learned patterns
NOW.md      # current focus, blockers, next step
PLAN.md     # optional living plan for multi-step work
```

Generated `AGENTS.md` and `CONTEXT.md` include
`<!-- context-harness:schema v2 -->`. Newer context-harness skills use that
marker to detect older or partial layouts and run a model-led Compatibility
Upgrade on first catch-up.

## Philosophy

- Context window = volatile RAM. Filesystem = persistent storage.
- Skills are reusable patterns, not templates you have to copy.
- Your harness should teach your own agent to self-iterate inside your workflow.
- 4 behavioral principles > 50 process rules
- Core rules apply everywhere before project-specific rules
- User-defined constraints (3 Never + 3 Always + 3 Objectives) keep the agent aligned
- Durable human input and agent discoveries belong on disk before they scroll away
- `AGENTS.md` activates the contract and indexes `CONTEXT.md`; scripts do real work

## Recent Updates

context-harness now ships as a small companion-skill set instead of one broad
catch-all skill:

| Skill | Intent |
|---|---|
| `context-init` | Initialize a new repo or migrate legacy v1 context files |
| `context-catch-up` | Let a fresh or resumed agent recover current project state |
| `context-grill` | Stress-test a plan, taxonomy, workflow, or context model against docs and code |
| `context-handoff` | Prepare a fresh agent to start the next substantial goal with context, quality bar, and checkpoints |
| `context-maintain` | Maintain context during active work, including Reflect Mode after corrections or failed attempts |

The important change is the shape: split by the agent's intent at invocation,
not by every tiny maintenance action. Update, capture, plan, closeout, and
reflection all live under `context-maintain` because they are part of the same
ongoing memory workflow. Handoff is separate because its purpose is to launch
the next big goal for a fresh long-running agent, not maintain completed work.

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
| `AGENTS.md` | Always-read contract plus generated `CONTEXT.md` index | 40 |
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
| `scripts/install-project.js` | Copy context-harness runtime scripts into a target repo |
| `scripts/codex-context-hook.js` | Codex lifecycle hook dispatcher for catch-up, init, and maintain nudges |
| `scripts/context-gen.js` | Auto-detect project metadata + emit stack-aware rule defaults |
| `scripts/context-index.js` | Refresh AGENTS.md index; list/query/print CONTEXT.md sections |
| `scripts/guard.js` | Security: block `--no-verify`, detect secrets, protect linter configs |
| `scripts/format-on-edit.js` | Auto-format files after edits (Biome, Prettier, Ruff, gofmt) |
| `scripts/session-end.js` | Stamp NOW.md, prune PLAN.md when >150 lines |
| `scripts/task.js` | Task switcher — rewrites NOW.md; logs to PLAN.md Progress |
| `scripts/eval-loop.js` | GAN-style evaluator: check work against your 3 Objectives |

Hook scripts read their payload from the `TOOL_INPUT` env var or from stdin
(pipe-friendly for Codex hooks, Cursor, Claude Code, and custom harnesses).

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
| `context-handoff` | A fresh agent needs a long-run brief for the next substantial goal |
| `context-maintain` | Work is underway and the agent needs to update context, capture lessons, maintain plan state, close out, or reflect after a correction |

`context-grill` borrows the strongest idea from Matt Pocock's `grill-me`: walk
the decision tree one sharp question at a time, include a recommended answer,
and inspect the code when the answer is discoverable. The context-harness
version adds a stricter filter: ask the user only where human judgment changes
the agent's direction, then route resolved terms, constraints, and decisions to
the right context file.

`context-maintain` includes Reflect Mode for repeated mistakes, loops, failed
attempts, and human corrections. Maintenance-like actions such as update,
capture, plan, and end are intentionally not separate skills.

`context-catch-up` includes Compatibility Upgrade for existing repos. It
preserves project-specific context, replaces only old harness boilerplate,
installs project-local runtime scripts, and refreshes the generated
`AGENTS.md` index.

`context-handoff` is different from maintenance: it produces an ephemeral launch
brief for the next substantial task. It should include the high-level goal,
definition of done, source-of-truth context links, quality bar, execution
checkpoints, risks, open human-judgment questions, and suggested skills. By
default, it prints the brief directly in chat as a fenced Markdown block instead
of writing a temp file. The chat handoff should stay at or below 4,000
characters and favor concise bullets over exhaustive chronology.

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
follow the Init mode workflow. Init also copies the runtime scripts into the
target repo so `AGENTS.md` can use project-local commands such as
`node scripts/context-index.js update`.

**Refresh the index** — after changing durable context:
```bash
node scripts/context-index.js update
node scripts/context-index.js query "term"
node scripts/context-index.js section "Rules"
```

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

The portable baseline is the `AGENTS.md` Context Contract. Codex hooks are
optional lifecycle nudges into the companion skills, not a replacement for the
skills.

| Hook | Trigger | What it does |
|------|---------|-------------|
| SessionStart | Existing context-harness project | Points the agent to `context-catch-up` and includes current `NOW.md` |
| UserPromptSubmit | Project without context-harness files | Points the agent to `context-init` before substantial project work |
| Stop | Existing context-harness project | Points the agent to `context-maintain` before ending substantial work |

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
