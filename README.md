# context-harness

3 files, 9 rules, zero ceremony.

A portable context framework for AI coding agents. Generates `CONTEXT.md`,
`NOW.md`, `PLAN.md` and ships Node.js scripts that do the mechanical work:
stack detection, session stamping, eval loops. Inspired by
[Karpathy's coding principles](https://github.com/forrestchang/andrej-karpathy-skills):
behavioral guardrails beat heavy infrastructure.

## Philosophy

- Context window = volatile RAM. Filesystem = persistent storage.
- 4 behavioral principles > 50 process rules
- User-defined constraints (3 Never + 3 Always + 3 Objectives) keep the agent aligned
- Scripts do real work; markdown sets direction

## Harness Compatibility

The core (SKILL.md body + `scripts/`) is harness-agnostic — pure Node.js 18+,
POSIX bash, no SDK dependencies. The `hooks:` block in SKILL.md frontmatter
is Claude Code's native integration layer; other harnesses ignore unknown
frontmatter keys.

| Harness | Skill body | Scripts (manual or scheduled) | Automatic hooks |
|---|---|---|---|
| **Claude Code** | ✓ | ✓ | ✓ (via SKILL.md frontmatter) |
| **Cursor** | ✓ | ✓ | Requires `hooks/hooks-cursor.json` (not included) |
| **Google Antigravity** | ✓ | ✓ | Not supported by the harness |
| **Anywhere with Node 18+** | — | ✓ | Wire up your own trigger |

Scripts are invoked the same way on every platform: `node <skill-dir>/scripts/<name>.js`.

## What It Generates

| File | Purpose | Max Lines |
|------|---------|-----------|
| `CONTEXT.md` | Project info + your 9 rules + learned patterns | 80 |
| `NOW.md` | Working memory: current focus, blockers, next step | 20 |
| `PLAN.md` | On-demand living plan for multi-step work | 150 |

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
env var (Claude Code) **or** from stdin (pipe-friendly for Cursor and custom
harnesses).

## The 9 Rules Framework

You define up to 9 rules across 3 categories:

**Never** (hard constraints the agent must not violate)
```
1. Never commit directly to main without a PR
2. Never disable or weaken type checking
3. Never ignore failing tests
```

**Always** (habits the agent must follow)
```
1. Always write tests for new public functions
2. Always handle errors explicitly
3. Always run the linter before committing
```

**Objectives** (testable pass/fail criteria for the eval-loop)
```
1. All tests pass (npm test exits 0)
2. No type errors (tsc --noEmit exits 0)
3. Code follows existing patterns in the codebase
```

`context-gen.js` prefills stack-specific defaults (TypeScript gets
`tsc --noEmit`, Python gets `ruff check`, Go gets `go vet`, etc.) — you
confirm or edit.

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

**Initialize** — scaffolds CONTEXT.md + NOW.md for your project:
```
/context-harness             # Claude Code
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

## Hooks (Claude Code)

SKILL.md frontmatter wires these into Claude Code automatically:

| Hook | Trigger | What it does |
|------|---------|-------------|
| UserPromptSubmit | Every prompt | Injects NOW.md + reminder to check rules |
| PreToolUse (Bash) | Git commands | Blocks `--no-verify`, detects secrets |
| PostToolUse (Write/Edit) | After edits | Auto-formats the edited file |
| Stop | End of session | Stamps NOW.md timestamp, prunes PLAN.md if >150 lines |

Other harnesses can wire the same scripts into their own hook systems —
`guard.js` and `format-on-edit.js` accept payloads from either `TOOL_INPUT`
or stdin.

## Migration from v1

If you have existing v1 files (AGENTS.md, PLANS.md, FINDINGS.md, EVALUATION.md),
invoke the skill and it will offer to migrate — pulling learned patterns,
active tasks, and conventions into the new 3-file structure.

## Token Budget

| | v1 | v2 | Reduction |
|---|---|---|---|
| Instruction footprint | ~813 lines | ~300 lines | **63%** |
| Files generated | 6 | 2–3 | **50–67%** |
| Per-prompt hook injection | ~30 lines + noise | ~25 lines, silent scripts | **cleaner** |
