---
name: context-harness
description: >
  Route lightweight project context work to the right companion skill:
  context-init for new repositories, context-catch-up for session resume, and
  context-grill for stress-testing plans, context-handoff for next-goal
  handoffs, and context-maintain for updates, lessons, plans, closeout, and
  reflection.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
---

# Context Harness

4 files, 9 rules, zero ceremony.
Context window = volatile RAM. Filesystem = persistent storage.
Write anything important to disk before it scrolls away.

---

## Companion Skills

Use the smallest skill that matches the agent's intent:

| Intent | Skill |
|--------|-------|
| New repo or missing context files | `context-init` |
| New agent, resume, or "catch me up" | `context-catch-up` |
| Stress-test a plan, taxonomy, workflow, or context model | `context-grill` |
| Prepare a fresh agent for the next substantial goal | `context-handoff` |
| Context updates, lesson capture, plan/NOW updates, closeout, reflection | `context-maintain` |

This root skill is the front door and reference. Prefer invoking a companion
skill directly when the mode is obvious.

## Behavioral Principles

1. **Think before coding** — State assumptions explicitly. If ambiguous, ask.
   Don't guess scope, format, or intent.
2. **Simplicity first** — If 200 lines could be 50, rewrite. No speculative
   abstractions, premature error handling, or unnecessary indirection.
3. **Surgical changes** — Every changed line traces directly to the user's
   request. Don't refactor adjacent code, change formatting, or "improve"
   unrelated things.
4. **Goal-driven loops** — Transform vague goals into testable checkpoints.
   Write failing test, implement, verify, check regressions. Loop until done.

## Core Rules

1. **Tool-native first** — Prefer CLI, MCP tools, or skills over browser automation when they can do the job. Reserve browser automation for browser-specific workflows, visual verification, and web UIs with no better interface.

---

## Determine Mode

| Condition | Mode |
|-----------|------|
| No `CONTEXT.md` at project root | Use `context-init` |
| `CONTEXT.md` exists and the agent is starting/resuming | Use `context-catch-up` |
| The user wants a plan challenged against docs, terms, and code | Use `context-grill` |
| The user wants a long-run brief for the next big goal | Use `context-handoff` |
| The agent needs to update context, preserve a lesson, correction, plan, or session state | Use `context-maintain` |
| Legacy v1 files exist without `CONTEXT.md` | Use `context-init` migration flow |

---

## Init Mode

Run `node scripts/context-gen.js` to auto-detect project info, structure,
stack-specific Suggested Rules, and Memory Prompts.

Fallback: scan package.json/pyproject.toml/Cargo.toml/go.mod manually.

Present the `## Suggested Rules` block as a starting point; user confirms
or edits. Always defaults include Core Rules plus stack-tailored habits.

**Objectives are not auto-filled** — too project-specific. They are
outcome-level success criteria: "if every Objective holds, has the project
achieved what it exists to achieve?" Hygiene belongs in **Always**. Prefer
verifiable form; observable-only is OK if automation isn't.

### Step 3: Generate CONTEXT.md + NOW.md + AGENTS.md

Write the context files to the project root using the templates below, then run
`node <context-harness-skill-dir>/scripts/install-project.js`. For Codex,
`AGENTS.md` is the automatic activation layer. Keep it small: after writing or
changing `CONTEXT.md`, run `node scripts/context-index.js update` so
`AGENTS.md` contains only the contract plus a generated index.

### Step 4: Optional PLAN.md
Ask: "Do you have a multi-step task to plan?" If yes, create PLAN.md.

---

## Migrate from v1

If legacy files exist but `CONTEXT.md` does not:

1. Run context-gen.js for fresh Project/Structure
2. Copy durable Learned Patterns into CONTEXT.md
3. Ask user to distill conventions into 3 Never + 3 Always + 3 Objectives
4. Merge active items from PLANS.md + FINDINGS.md into new PLAN.md
5. Replace old agent instructions with the AGENTS.md Context Contract

---

## Templates

### CONTEXT.md

```markdown
# Context
<!-- context-harness:schema v2 -->

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

## Language
<!-- Durable human input + agent discoveries. Keep concise. -->
- **[Canonical term]**: [Definition]. Avoid: [ambiguous synonym].

## Relationships
- [Invariant or domain relationship worth preserving.]

## Flagged Ambiguities
- [Resolved naming or meaning conflict.]

## Learned Patterns
<!-- Reflection memory: lessons after corrections, loops, or failed attempts. -->
[Max 10 entries. Use `- When [context], [do/avoid] because [evidence].`]
```

Optional: add `CONTEXT-MAP.md` only when one root context becomes ambiguous.

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

### AGENTS.md

```markdown
# Agent Instructions
<!-- context-harness:schema v2 -->

## Context Contract
- At session start/resume, read `NOW.md` first, then use the Context Index
  below to choose relevant `CONTEXT.md` sections.
- Before planning or editing, respect `CONTEXT.md` `## Rules`.
- If the user teaches a durable term, invariant, workflow, constraint, or
  correction, update `CONTEXT.md` before it scrolls away.
- Route task-local findings and decisions to `PLAN.md`; durable lessons to
  `CONTEXT.md`.
- After updating `CONTEXT.md`, run `node scripts/context-index.js update`.
- Before ending, update `NOW.md` with current focus, blockers, next step, and
  touched files.

## Context Index
<!-- context-harness:index:start -->
Generated from `CONTEXT.md`; open only task-relevant sections.
<!-- context-harness:index:end -->
```

### PLAN.md (on-demand)

```markdown
# [Task Title]

## Goal
[What the user can do after this is complete. 1-2 sentences.]

## Progress
- [ ] Step 1
- [ ] Step 2

## Findings
[Task-local research, discoveries, errors, and low-confidence lessons.]

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
| **Capture human input** | If the user teaches a term, invariant, workflow, or constraint, write it to CONTEXT.md before it scrolls away. |
| **Reflection routing** | Task-local → PLAN.md Findings; durable process lesson → CONTEXT.md Learned Patterns; term → Language; invariant → Relationships; decision → PLAN.md Decisions unless the project already uses ADRs; skill correction → that skill's SKILL.md. |
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
| `scripts/install-project.js` | Copy context-harness runtime scripts into a target repo | Init mode |
| `scripts/codex-context-hook.js` | Codex lifecycle hook dispatcher for catch-up, init, and maintain nudges | Codex hooks |
| `scripts/context-gen.js` | Auto-detect project metadata + emit stack-aware rule defaults | Init mode, Update mode |
| `scripts/context-index.js` | Update AGENTS.md index; list/query/print CONTEXT.md sections | After CONTEXT.md changes |
| `scripts/guard.js` | Block --no-verify, detect secrets, protect linter configs | Runs automatically via PreToolUse hook |
| `scripts/format-on-edit.js` | Auto-format files after edits | Runs automatically via PostToolUse hook |
| `scripts/session-end.js` | Stamp NOW.md, prune PLAN.md when >150 lines | Runs automatically via Stop hook |
| `scripts/task.js` | Task switcher — rewrites NOW.md; logs to PLAN.md Progress | Run on task start / done |
| `scripts/eval-loop.js` | Evaluate against 3 Objectives | After completing a task or before committing |

```bash
node scripts/task.js start "Implement auth middleware"
node scripts/task.js done
```

`start` rewrites NOW.md and logs prior focus to PLAN.md. `done` marks NOW.md
idle and logs completion to PLAN.md Progress.

---

## Non-Goals

No skill composition, subagent dispatch, mandatory worktrees, per-developer
journals, or heavyweight knowledge base. Keep memory durable but small.
