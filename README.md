# context-harness

4 files, lean rules, zero ceremony.

A portable context framework for AI coding agents. Generates `AGENTS.md`,
`CONTEXT.md`, `NOW.md`, `PLAN.md` and ships Node.js scripts that do the
mechanical work: stack detection, decision capture, session stamping, checks,
and migration.

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
`<!-- context-harness:schema v3 -->`. Newer context-harness skills use that
marker to detect older or partial layouts and run a model-led Compatibility
Upgrade on first catch-up.

## Philosophy

- Context window = volatile RAM. Filesystem = persistent storage.
- Skills are reusable patterns, not templates you have to copy.
- Your harness should teach your own agent to self-iterate inside your workflow.
- 4 behavioral principles > 50 process rules
- Core rules apply everywhere before project-specific rules
- User-defined Never/Always rules keep the agent aligned
- Verification belongs in Workflow and task-local PLAN.md Done Criteria
- Durable human input and agent discoveries belong on disk before they scroll away
- `AGENTS.md` activates the contract and indexes `CONTEXT.md`; scripts do real work

## Recent Updates

context-harness now ships as a small companion-skill set instead of one broad
catch-all skill:

| Skill | Intent |
|---|---|
| `context-init` | Initialize a new repo or migrate legacy v1 context files |
| `context-catch-up` | Let a fresh or resumed agent recover current project state |
| `context-launch` | Convert the current conversation into a long-running Codex task brief |
| `context-maintain` | Maintain context during active work, including plan stress-tests, Reflect Mode, and automatic Dream/Compact consideration |
| `context-upgrade` | Plan, validate, and deploy context-harness upgrades or project migrations |

`context-grill` is deprecated. Its useful pressure-testing behavior now lives in
`context-maintain`, and the old skill remains only as a compatibility stub.

The important change is the shape: split by the agent's intent at invocation,
not by every tiny maintenance action. Update, capture, plan, closeout, and
reflection all live under `context-maintain` because they are part of the same
ongoing memory workflow.

## Core Rules

These rules apply to every project using context-harness. Project-specific
Never / Always rules add local constraints on top.

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

| File | Purpose | Hygiene Target |
|------|---------|-----------|
| `AGENTS.md` | Always-read contract plus generated `CONTEXT.md` index | 40 |
| `CONTEXT.md` | Project info, rules, workflow, terms, learned patterns | 80 |
| `NOW.md` | Working memory: current focus, blockers, next step | concise |
| `PLAN.md` | On-demand living plan for multi-step work | active state only |
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
| `scripts/install-project.js` | Copy default runtime scripts; `--profile legacy` includes ADR/eval tools |
| `scripts/codex-context-hook.js` | Codex lifecycle hook dispatcher for catch-up, init, and maintain nudges |
| `scripts/context-gen.js` | Auto-detect project metadata + emit stack-aware rule defaults |
| `scripts/context-index.js` | Refresh AGENTS.md index; list/query/print/check CONTEXT.md sections |
| `scripts/migrate-project.js` | Batch migrate schema v2 projects to v3; not installed into target repos |
| `scripts/guard.js` | Security: block `--no-verify`, detect secrets, protect linter configs |
| `scripts/format-on-edit.js` | Auto-format files after edits (Biome, Prettier, Ruff, gofmt) |
| `scripts/session-end.js` | Stamp NOW.md; best-effort prune of completed PLAN.md items when very long |
| `scripts/task.js` | Task switcher — rewrites NOW.md; logs to PLAN.md Progress |
| `scripts/eval-loop.js` | Deprecated legacy v2 evaluator; install with `--profile legacy` |

Hook scripts read their payload from the `TOOL_INPUT` env var or from stdin
(pipe-friendly for Codex hooks, Cursor, Claude Code, and custom harnesses).

## Rules And Verification

You define project-specific rules across two durable categories. Suggested
Always rules include the Core Rules, so generated contexts may start with more
than six total rules when the global layer is counted.

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

**Workflow Verification** (commands or checks the agent should run when
relevant)
```
- Test command exits 0
- Lint/typecheck command exits 0
- Changed UI or CLI workflow is manually smoke checked when automation is absent
```

Task-specific outcomes live in `PLAN.md` `## Done Criteria`, not in durable
project-wide Objectives. Schema v2 Objectives are preserved as legacy context
during migration; command-based Objectives are moved into Workflow
Verification.

`context-gen.js` prefills stack-specific Never/Always defaults (TypeScript
gets `tsc --noEmit`, Python gets `ruff check`, Go gets `go vet`, etc.).
It also suggests verification commands for `CONTEXT.md` `## Workflow`.

## Companion Skills

The root `context-harness` skill is the front door. The actual workflows are
split by invocation intent:

| Skill | Use when |
|---|---|
| `context-init` | A repo is new to context-harness or needs v1 migration |
| `context-catch-up` | A new agent or resumed session needs to read durable context |
| `context-launch` | The current conversation should become a long-running Codex goal for a fresh agent |
| `context-maintain` | Work is underway and the agent needs to update context, capture lessons, stress-test a plan, maintain plan state, close out, or reflect after a correction |
| `context-upgrade` | context-harness itself or a fleet of project contexts needs a version upgrade, schema migration, deployment, or migration lesson packaged for repeat use |

`context-grill` is deprecated. It remains only as a non-invocable compatibility
stub for explicit legacy requests. Its useful behavior moved into
`context-maintain`: inspect first, ask only where human judgment changes the
agent's direction, then route resolved terms, constraints, and decisions to the
right context file.

`context-maintain` includes Reflect Mode for repeated mistakes and automatic
Dream/Compact consideration after maintenance events. Every maintain run asks
whether future catch-up would be materially easier after consolidation. If yes,
the agent edits context files directly, compacts active state, promotes only
durable lessons, and writes an audit entry to `.context-harness/DREAM.md`.
Skipped checks are not logged. Maintenance-like actions such as update,
capture, plan, and end are intentionally not separate skills.

### Dream Log

`.context-harness/DREAM.md` is created lazily only after a Dream/Compact pass
actually edits context files. It is an intent log, not a patch transcript:
trigger, changed files, what was compacted, what was promoted, what was removed
or archived, and uncertainty.

Dream logs are intended to be git-tracked unless the project explicitly treats
operational logs as private. They must not contain secrets, raw transcripts,
raw web/API output, or large copied sections.

Agents must not read `.context-harness/DREAM.md` during normal catch-up or task
work. Use it only for debugging context drift or later human review.

`context-catch-up` includes Compatibility Upgrade for existing repos. It
preserves project-specific context, replaces only old harness boilerplate,
installs project-local runtime scripts, and refreshes the generated
`AGENTS.md` index.

`context-upgrade` is the operator workflow for changing the harness itself or
repeating a local migration. It captures the conservative upgrade habits:
dry-run first, preserve local context, skip dirty repos by default, verify
source changes, deploy through the normal local layer, and record skipped
targets for follow-up.

`context-launch` produces a model-led launch brief for long-running Codex work:
goal, done criteria, files to read, constraints, checkpoints, verification, and
closeout. It is separate from closeout because the output is an execution prompt
for a fresh agent, not a memory artifact.

`context-handoff` is deprecated. It remains only as a compatibility stub for
explicit requests; new session closeout and transfer notes should use
`context-maintain`.

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
node scripts/context-index.js check
```

**Legacy eval loop** — only for schema v2 repos that still use Objectives:
```bash
node <skill-dir>/context-harness/scripts/install-project.js --profile legacy
node scripts/eval-loop.js
```

**Batch migrate** — dry-run first, then apply:
```bash
node <skill-dir>/context-harness/scripts/migrate-project.js --root /Users/lfan/Project
node <skill-dir>/context-harness/scripts/migrate-project.js --root /Users/lfan/Project --write
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

## Migration

If you have existing v1 files (AGENTS.md, PLANS.md, FINDINGS.md, EVALUATION.md),
invoke the skill and it will offer to migrate — pulling learned patterns,
active tasks, and conventions into the new 3-file structure.

For schema v2 repos, `migrate-project.js` upgrades schema markers, moves
command Objectives into Workflow Verification, preserves manual Objectives as
Legacy Objectives, refreshes `AGENTS.md`, and installs the default lean script
profile. Dirty git worktrees are skipped unless `--include-dirty` is passed.

## Token Budget

| | v1 | v3 | Reduction |
|---|---|---|---|
| Instruction footprint | ~813 lines | ~300 lines | **63%** |
| Files generated | 6 | 3–4 | **33–50%** |
| Per-prompt instruction load | ~30 lines + noise | AGENTS.md contract + tiny context files | **cleaner** |
| Default installed scripts | — | 9 | **lean default** |
