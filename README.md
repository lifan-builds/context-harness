# context-harness

3 files, 9 rules, zero ceremony.

A lightweight Claude Code skill that gives AI agents the context they need — and nothing more. Inspired by [Karpathy's coding principles](https://github.com/forrestchang/andrej-karpathy-skills): behavioral guardrails beat heavy infrastructure.

## Philosophy

- Context window = volatile RAM. Filesystem = persistent storage.
- 4 behavioral principles > 50 process rules
- User-defined constraints (3 Never + 3 Always + 3 Objectives) keep the agent aligned
- Scripts do real work; markdown sets direction

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
| `scripts/session-end.js` | Stamp NOW.md, prune PLAN.md when >150 lines (Stop hook) |
| `scripts/task.js` | Task switcher — rewrites NOW.md; logs to PLAN.md Progress |
| `scripts/eval-loop.js` | GAN-style evaluator: check work against your 3 Objectives |

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

## Installation

**Option 1: Plugin marketplace**
```
/plugin marketplace add https://github.com/anthropics/context-harness
```

**Option 2: Local symlink**
```bash
git clone https://github.com/anthropics/context-harness ~/.claude/skills/context-harness
```

## Usage

**Initialize** — scaffolds CONTEXT.md + NOW.md for your project:
```
/context-harness
```

**Update** — re-syncs docs with codebase changes:
```
/context-harness update
```

**Evaluate** — run the GAN-style eval loop against your Objectives:
```bash
node ~/.claude/skills/context-harness/scripts/eval-loop.js
```

**Switch tasks** — rewrites NOW.md atomically:
```bash
node ~/.claude/skills/context-harness/scripts/task.js start "New focus"
node ~/.claude/skills/context-harness/scripts/task.js done
```

## Hooks

| Hook | Trigger | What it does |
|------|---------|-------------|
| UserPromptSubmit | Every prompt | Injects NOW.md + reminder to check rules |
| PreToolUse (Bash) | Git commands | Blocks `--no-verify`, detects secrets |
| PostToolUse (Write/Edit) | After edits | Auto-formats the edited file |
| Stop | End of session | Stamps NOW.md timestamp, prunes PLAN.md if >150 lines |

## Migration from v1

If you have existing v1 files (AGENTS.md, PLANS.md, FINDINGS.md, EVALUATION.md), invoke `/context-harness` and it will offer to migrate — pulling learned patterns, active tasks, and conventions into the new 3-file structure.

## Token Budget

| | v1 | v2 | Reduction |
|---|---|---|---|
| Instruction footprint | ~813 lines | ~200 lines | **75%** |
| Files generated | 6 | 2-3 | **50-67%** |
| Per-prompt hook injection | ~30 lines + noise | ~25 lines, silent scripts | **cleaner** |
