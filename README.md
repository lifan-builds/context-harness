# context-harness

**Small visible context. Progressive retrieval. Agent judgment over process.**

context-harness is a portable project-memory layer for coding agents. Its core
idea is simple: keep the always-read contract tiny, store durable project truth
in normal markdown, and let the agent retrieve deeper context only when the task
needs it.

It is intentionally not a large agent framework, workflow methodology, or prompt
pile. It is a filesystem memory contract plus a few scripts and companion skills
that help a fresh agent answer: **What is this project, what matters right now,
and what should I do next?**

## Core Design Principles

1. **Always-read stays small** — `AGENTS.md` is only the activation contract and
   generated index; `NOW.md` plus concise `CONTEXT.md` are the startup layer.
2. **Durable truth lives on disk** — `CONTEXT.md`, `NOW.md`, and `PLAN.md` are
   visible markdown files that humans and agents can inspect, edit, diff, and
   commit.
3. **Retrieve progressively** — agents read small `CONTEXT.md` directly, then use
   `hydrate "<task>"` before opening `PLAN.md`, chunks, or bulky sections.
4. **Constraints beat rulebooks** — projects keep short `Operating Constraints`
   only when they change future agent decisions. Generic coding-agent behavior
   belongs in the skill, not repeated in every repo.
5. **Scripts do mechanics; agents do judgment** — Node scripts handle indexing,
   checks, installation, migration, and session stamping. Skills guide when to
   catch up, maintain context, set a goal, or run an explicit upgrade.

## The Four Files

```text
AGENTS.md   # tiny startup contract + generated context index
CONTEXT.md  # durable project facts, terms, constraints, learned patterns
NOW.md      # current focus, blockers, next step
PLAN.md     # optional active plan, findings, decisions, verification
```

The default flow is:

```text
fresh agent starts
  → read NOW.md
  → read concise CONTEXT.md
  → read AGENTS.md contract/index
  → hydrate the current task before PLAN.md, chunks, or bulky context
  → open only relevant progressive detail
  → update PLAN/CONTEXT/NOW in the right layer when work changes state
```

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

Generated `AGENTS.md` and `CONTEXT.md` include
`<!-- context-harness:schema v3 -->`. Newer context-harness skills use that
marker to detect older or partial layouts. Migration and repair belong in
explicit `context-upgrade`, not `context-init` or ordinary catch-up.

## Proof

- Cold-resume demo: [`examples/cold-resume-demo.md`](examples/cold-resume-demo.md)
- Verification suite: `tests/run-all.sh`
- Context health check: `node scripts/context-index.js check`

The release proof covers catch-up timing, maintain routing, explicit-only
upgrade behavior, set-goal output shape, and the cold-resume path where a fresh
agent reads `NOW.md` and concise `CONTEXT.md`, uses hydrate before bulky detail,
and names the next action.

## Philosophy

- Context window = volatile RAM. Filesystem = persistent storage.
- Skills are reusable patterns, not templates you have to copy.
- Your harness should teach your own agent to self-iterate inside your workflow.
- 4 behavioral principles > 50 process rules
- Generic agent behavior belongs in the skill, not every project context
- Project-specific operating constraints preserve intent agents would not infer
- Verification belongs in Workflow and task-local PLAN.md Done Criteria
- Durable human input and agent discoveries belong on disk before they scroll away
- `AGENTS.md` activates the contract and indexes `CONTEXT.md`; scripts do real work

## Recent Updates

context-harness now ships as a small companion-skill set instead of one broad
catch-all skill:

| Skill | Intent |
|---|---|
| `context-init` | Initialize a new repo |
| `context-catch-up` | Let a fresh or resumed agent recover current project state |
| `set-goal` | Convert the current conversation into a directly usable long-running goal for Codex goal mode, loop mode, or a fresh agent |
| `context-maintain` | Maintain context during active work, including plan stress-tests, Reflect Mode, and automatic Dream/Compact consideration |
| `context-upgrade` | Explicit-only operator workflow for context-harness upgrades or project migrations |

The important change is the shape: split by the agent's intent at invocation,
not by every tiny maintenance action. Update, capture, plan, closeout, and
reflection all live under `context-maintain` because they are part of the same
ongoing memory workflow.

## Core Behavior

Generic agent behavior lives in the root skill so projects do not need to copy a
large rulebook. Project-specific operating constraints should be rare: keep only
constraints that change agent decisions and are not reliably inferable from code
or ordinary docs.

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
| `CONTEXT.md` | Project info, operating constraints, workflow, terms, learned patterns | 80 |
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
| `scripts/install-project.js` | Copy current v3 runtime scripts into a target repo |
| `scripts/codex-context-hook.js` | Codex lifecycle hook dispatcher for catch-up, init, and maintain nudges |
| `scripts/context-gen.js` | Auto-detect project metadata + emit stack-aware operating constraint defaults |
| `scripts/context-index.js` | Refresh AGENTS.md index; list/query/print/check CONTEXT.md sections |
| `scripts/guard.js` | Security: block `--no-verify`, detect secrets, protect linter configs |
| `scripts/format-on-edit.js` | Auto-format files after edits (Biome, Prettier, Ruff, gofmt) |
| `scripts/session-end.js` | Stamp NOW.md; best-effort prune of completed PLAN.md items when very long |
| `scripts/task.js` | Task switcher — rewrites NOW.md; logs to PLAN.md Progress |

Hook scripts read their payload from the `TOOL_INPUT` env var or from stdin
(pipe-friendly for Codex hooks, Cursor, Claude Code, and custom harnesses).

## Operating Constraints And Verification

You define project-specific operating constraints only when they change future
agent decisions and would not be reliably inferred from code, tests, or ordinary
docs. Generic behavior belongs in the skill-level behavioral principles instead
of each project's `CONTEXT.md`.

**Operating Constraints**
```
- Do not store secrets or credentials in the repo.
- Preserve strict type checking unless the user explicitly approves weakening it.
- Treat failing tests as blocking unless the user explicitly accepts the risk.
```

**Workflow Verification** (commands or checks the agent should run when
relevant)
```
- Test command exits 0
- Lint/typecheck command exits 0
- Changed UI or CLI workflow is manually smoke checked when automation is absent
```

Task-specific outcomes live in `PLAN.md` `## Done Criteria`, not in durable
project-wide objectives. Workflow commands and manual checks belong in
`CONTEXT.md` `## Workflow` and task-local verification notes.

`context-gen.js` suggests stack-specific operating constraints plus verification
commands (TypeScript gets `tsc --noEmit`, Python gets `ruff check`, Go gets
`go vet`, etc.) for `CONTEXT.md` `## Workflow`.

## Companion Skills

The root `context-harness` skill is the front door. The actual workflows are
split by invocation intent:

| Skill | Use when |
|---|---|
| `context-init` | A repo is new to context-harness |
| `context-catch-up` | A fresh agent session or true resumed session needs to read durable context |
| `set-goal` | The current conversation should become a directly usable long-running goal for Codex goal mode, loop mode, or a fresh agent |
| `context-maintain` | Work is underway and the agent needs to update context, capture lessons, stress-test a plan, maintain plan state, close out, or reflect after a correction |
| `context-upgrade` | The user explicitly asks to upgrade context-harness itself or migrate legacy/partial/project/fleet context; this skill should not be implicitly invoked |

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

`context-catch-up` is for fresh sessions, true resumes, materially changed user
objectives, or externally changed context. It reads `NOW.md` first, then uses an
explicit user objective as the hydrate query and loads only relevant durable
context; when no objective is supplied it derives the minimum recovery query
from `NOW.md`. User context is reconciled with repository state rather than
silently replaced by stale handoff state. Catch-up reports partial or
schema-drifted layouts but does not repair them; repair moves through explicit
`context-upgrade`.

`context-upgrade` is the operator workflow for changing the harness itself,
refreshing a local fleet, validating installed skill copies, or repairing a
current v3 layout. It captures the conservative upgrade habits: inspect first,
preserve local context, verify source changes, deploy through the normal local
layer, and record skipped targets for follow-up. It is explicit-only because
upgrades should happen when the skill or schema has an update, not during
ordinary context use.

`set-goal` produces a model-led goal prompt for long-running Codex work: goal,
done criteria, files to read, constraints, milestones, verification, loop
rules, and closeout. It is separate from closeout because the output is an
execution prompt for goal mode, loop mode, or a fresh agent, not a memory
artifact.

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
  - repo: lifan-builds/context-harness
    ref: main
```
Then `nexus sync` deploys to every configured target.

**Option 2: Claude Code plugin**
```
/plugin marketplace add https://github.com/lifan-builds/context-harness
```

**Option 3: Direct clone**
```bash
git clone https://github.com/lifan-builds/context-harness <skill-dir>/context-harness
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

**Refresh generated retrieval** — after changing `CONTEXT.md`, `PLAN.md`, or `NOW.md`:
```bash
node scripts/context-index.js update
node scripts/context-index.js query "term"
node scripts/context-index.js section "Operating Constraints"
node scripts/context-index.js check
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

## Layout Repair

`context-init` is for fresh repositories with no context-harness layout. If a
project already has partial, stale, or custom context-harness files, use explicit
`context-upgrade` to inspect and repair the current v3 layout with user approval.
context-harness no longer ships a legacy schema migration script.

## Token Budget

| | v1 | v3 | Reduction |
|---|---|---|---|
| Instruction footprint | ~813 lines | ~300 lines | **63%** |
| Files generated | 6 | 3–4 | **33–50%** |
| Per-prompt instruction load | ~30 lines + noise | AGENTS.md contract + tiny context files | **cleaner** |
| Default installed scripts | — | 9 | **lean default** |
