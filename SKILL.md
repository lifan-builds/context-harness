---
name: context-harness
description: >
  Initialize and maintain lightweight project context (CONTEXT.md, NOW.md,
  PLAN.md) with behavioral principles for effective AI coding agents.
  3 files, 9 rules, zero ceremony.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
hooks:
  UserPromptSubmit:
    - hooks:
        - type: command
          command: >
            if [ -f CONTEXT.md ]; then
              echo '[context-harness] Project context active.';
              if [ -f NOW.md ]; then
                echo '';
                echo '=== NOW.md ===';
                cat NOW.md;
              fi;
              echo '';
              echo 'Read CONTEXT.md § Rules before proceeding. Respect Never/Always/Objectives.';
            fi
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: >
            GUARD="$HOME/.claude/skills/context-harness/scripts/guard.js";
            if [ -f "$GUARD" ]; then node "$GUARD" 2>/dev/null; fi
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: >
            FMT="$HOME/.claude/skills/context-harness/scripts/format-on-edit.js";
            if [ -f "$FMT" ]; then node "$FMT" 2>/dev/null; fi
  Stop:
    - hooks:
        - type: command
          command: >
            END="$HOME/.claude/skills/context-harness/scripts/session-end.js";
            if [ -f "$END" ] && [ -f CONTEXT.md ]; then node "$END" 2>/dev/null; fi
---

# Context Harness

3 files, 9 rules, zero ceremony.
Context window = volatile RAM. Filesystem = persistent storage.
Write anything important to disk before it scrolls away.

---

## Behavioral Principles

Follow these on every task. They are non-negotiable.

1. **Think before coding** — State assumptions explicitly. If ambiguous, ask.
   Don't guess scope, format, or intent.
2. **Simplicity first** — If 200 lines could be 50, rewrite. No speculative
   abstractions, premature error handling, or unnecessary indirection.
3. **Surgical changes** — Every changed line traces directly to the user's
   request. Don't refactor adjacent code, change formatting, or "improve"
   unrelated things.
4. **Goal-driven loops** — Transform vague goals into testable checkpoints.
   Write failing test, implement, verify, check regressions. Loop until done.

---

## Determine Mode

| Condition | Mode |
|-----------|------|
| No `CONTEXT.md` at project root | **Init** |
| `CONTEXT.md` exists | **Update** |
| v1 files exist (`AGENTS.md` without `CONTEXT.md`) | **Migrate** |

---

## Init Mode

### Step 1: Detect project info

Run `node scripts/context-gen.js` to auto-detect project name, tech stack,
directory structure, and stack-specific Suggested Rules. Output has three
sections: `## Project`, `## Structure`, `## Suggested Rules`.

Fallback: scan package.json/pyproject.toml/Cargo.toml/go.mod manually.

### Step 2: Confirm user's 9 rules

Present the `## Suggested Rules` block as a starting point; user confirms
or edits. Never/Always defaults are stack-tailored. Fewer than 3 per
category is fine.

**Objectives are not auto-filled** — too project-specific. They are
**outcome-level success criteria**: "if every Objective holds, has the
project achieved what it exists to achieve?" Hygiene (tests pass,
type-check clean, lint clean) belongs in **Always**, not Objectives.
Push for verifiable form (command / metric / scripted check) when feasible;
observable-only is OK if automation isn't.

- Right: `CLI users complete core workflow on fresh install (tests/smoke.sh exits 0)`
- Right: `API p95 latency <200ms at expected load (scripts/perf.js exits 0)`
- Wrong (move to Always): `All tests pass`, `No type errors`

### Step 3: Generate CONTEXT.md + NOW.md

Write both files to the project root using the templates below.

### Step 4: Optionally create PLAN.md

Ask: "Do you have a multi-step task to plan?" If yes, create PLAN.md.

---

## Update Mode

1. Re-scan project for changes (new deps, new directories, tech stack shifts)
2. Update CONTEXT.md `## Project` and `## Structure` sections
3. Append new Learned Patterns if the agent discovered any during work
4. Prune Learned Patterns to max 10 entries (remove oldest)
5. Update NOW.md with current state
6. If PLAN.md exists and exceeds 150 lines: summarize completed items into
   `## Archive`, remove them from `## Progress`

---

## Migrate from v1

If `AGENTS.md` exists but `CONTEXT.md` does not:

1. Run context-gen.js for fresh Project/Structure
2. Copy Learned Patterns from AGENTS.md into CONTEXT.md
3. Ask user to distill conventions into 3 Never + 3 Always + 3 Objectives
4. Merge active items from PLANS.md + FINDINGS.md into new PLAN.md
5. Offer to remove old files (AGENTS.md, PLANS.md, FINDINGS.md, EVALUATION.md)

---

## Templates

### CONTEXT.md

```markdown
# Context

## Project
[Auto-generated: name, tech stack, description. One paragraph.]

## Structure
[Auto-generated: directory tree, 5-10 lines.]

## Rules

### Never
1. [User-defined]
2. [User-defined]
3. [User-defined]

### Always
1. [User-defined]
2. [User-defined]
3. [User-defined]

### Objectives
<!-- Outcome-level project success. Prefer `<outcome> (<cmd> exits 0)`. Not hygiene. -->
1. [Outcome-level success criterion]
2. [Outcome-level success criterion]
3. [Outcome-level success criterion]

## Workflow
- Setup: [install command]
- Run: [dev command]
- Test: [test command]
- Lint: [lint command]

## Learned Patterns
[Max 10 entries. Prune oldest when full.]
```

### NOW.md

```markdown
# Now

## Current Focus
[One sentence: what you are actively working on.]

## Active Blockers
- [Any blocking issues, or "None."]

## Immediate Next Step
[The very next action to take when resuming.]

## Session State
- Last modified: [ISO timestamp]
- Files touched: [comma-separated list]
```

**NOW.md rules:** Max 20 lines. Rewrite entirely on task switch (never
append). First file read on recovery, last file written before session end.

### PLAN.md (on-demand)

```markdown
# [Task Title]

## Goal
[What the user can do after this is complete. 1-2 sentences.]

## Progress
- [ ] Step 1
- [ ] Step 2

## Findings
[Inline research, discoveries, errors. Replaces separate FINDINGS.md.]

## Decisions
[Non-trivial decisions with rationale.]

## Archive
[Summarized completed phases. Used when file exceeds 150 lines.]
```

---

## Context Rules

| Rule | Detail |
|------|--------|
| **NOW.md contract** | Update before session end. Rewrite on task switch. Max 20 lines. First read, last write. |
| **Learn after struggle** | >2 attempts on a problem → distill lesson to CONTEXT.md § Learned Patterns |
| **Prune patterns** | Max 10 Learned Patterns. When full, remove the oldest entry. |
| **PLAN.md pruning** | When >150 lines, summarize completed Progress into Archive and remove originals. |
| **No raw external content** | Don't paste raw URLs, API responses, or web content into CONTEXT.md. Summarize findings in PLAN.md § Findings. |

---

## Eval Loop

Run the evaluator to check your work against the 3 Objectives:

```bash
node scripts/eval-loop.js
```

The script parses Objectives from CONTEXT.md, extracts testable commands
(pattern: `(command exits N)`), and runs them. Loop until all pass or
max iterations (default 5) exhausted.

For autonomous execution: make changes, run eval-loop, read failures,
fix, re-run. This is the generator-evaluator pattern — you generate code,
the script evaluates it.

Environment variables: `MAX_ITERATIONS=5`, `PASS_THRESHOLD=all`,
`CONTEXT_FILE=CONTEXT.md`.

---

## Companion Scripts

All scripts are Node.js and share helpers in `scripts/lib.js` (hook I/O,
project-root walk, stack detection, markdown section parsing, command
runner). Adding a new script? Import from `lib.js` — don't duplicate.

| Script | Purpose | When to use |
|--------|---------|-------------|
| `scripts/lib.js` | Shared helpers (hook input, stack detect, section read, runCheck) | Imported by every other script |
| `scripts/context-gen.js` | Auto-detect project metadata + emit stack-aware rule defaults | Init mode, Update mode |
| `scripts/guard.js` | Block --no-verify, detect secrets, protect linter configs | Runs automatically via PreToolUse hook |
| `scripts/format-on-edit.js` | Auto-format files after edits | Runs automatically via PostToolUse hook |
| `scripts/session-end.js` | Stamp NOW.md, prune PLAN.md when >150 lines | Runs automatically via Stop hook |
| `scripts/task.js` | Task switcher — rewrites NOW.md; logs to PLAN.md Progress | Run on task start / done |
| `scripts/eval-loop.js` | Evaluate against 3 Objectives | After completing a task or before committing |

### `task.js` usage

```bash
node scripts/task.js start "Implement auth middleware"
node scripts/task.js done
```

`start` rewrites NOW.md with the new focus; prior focus, if any, is logged
to PLAN.md as `- [~] <prior> (switched away <date>)`. `done` marks NOW.md
idle and appends `- [x] <focus> (done <date>)` to PLAN.md Progress.

---

## Non-Goals

Decisions made so we don't re-litigate them:

- **One skill, one agent, one harness.** No skill composition / subagent
  dispatch / multi-platform portability (SuperPowers / Trellis territory).
- **Solo-dev, single-repo.** No per-developer journals.
- **FIFO patterns, max 10.** No confidence scoring; if quality matters, add
  a 1-line *why* per pattern.
- **No worktree enforcement.** Users opt in via their own hooks if needed.
