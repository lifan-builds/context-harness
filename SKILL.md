---
name: context-harness
description: >
  Route lightweight project context work to the right companion skill:
  context-init for new repositories, context-catch-up for session resume, and
  set-goal for long-running goal/loop prompts, and context-maintain for updates,
  lessons, plan stress-tests, closeout, reflection, and automatic Dream/Compact
  consolidation, and context-upgrade for upgrades/migrations.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
---

# Context Harness

4 files, lean rules, zero ceremony.
Context window = volatile RAM. Filesystem = persistent storage.
Write anything important to disk before it scrolls away.

---

## Companion Skills

Use the smallest skill that matches the agent's intent:

| Intent | Skill |
|--------|-------|
| New repo or missing context files | `context-init` |
| Fresh agent session, true resume, or "catch me up" | `context-catch-up` |
| Convert conversation into a long-running goal or loop-mode prompt | `set-goal` |
| Context updates, lesson capture, plan stress-tests, plan/NOW updates, closeout, reflection, Dream/Compact consolidation | `context-maintain` |
| Explicitly requested context-harness update or project-context migration | `context-upgrade` |

`context-upgrade` is explicit-only and should not be implicitly invoked.

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
| `CONTEXT.md` exists and the agent is at a fresh-session or true-resume boundary | Use `context-catch-up` |
| The user wants a plan challenged against docs, terms, and code | Use `context-maintain` Plan Stress-Test |
| The user wants a long-running goal for goal mode, loop mode, or a fresh agent | Use `set-goal` |
| The agent needs to update context, preserve a lesson, correction, plan, or session state | Use `context-maintain` |
| The user explicitly asks to upgrade context-harness itself, migrate schema versions, or repeat a local fleet migration | Use `context-upgrade` |
| Legacy, partial, old, or custom context-harness files exist | Use `context-upgrade` |

---

## Init Mode

Run `node scripts/context-gen.js` to auto-detect project info, structure,
stack-specific Suggested Operating Constraints, Suggested Workflow, and Memory Prompts.

Fallback: scan package.json/pyproject.toml/Cargo.toml/go.mod manually.

Present `## Suggested Operating Constraints` and `## Suggested Workflow` as starting points; the user keeps only project-specific constraints a future agent would not infer from code or docs, and confirms verification commands.
Use `PLAN.md` Done Criteria for task outcomes and `CONTEXT.md` Workflow Verification for commands.

### Step 3: Generate CONTEXT.md + NOW.md + AGENTS.md

Write the context files to the project root using the templates below, then run
`node <context-harness-skill-dir>/scripts/install-project.js`. For Codex,
`AGENTS.md` is the automatic activation layer. Keep it small: after writing or
changing `CONTEXT.md`, run `node scripts/context-index.js update` so
`AGENTS.md` contains only the contract plus a generated index.

### Step 4: Optional PLAN.md
Ask: "Do you have a multi-step task to plan?" If yes, create PLAN.md.

---

## Templates

### CONTEXT.md

```markdown
# Context
<!-- context-harness:schema v3 -->

## Project
[Auto-generated: name, tech stack, description.]

## Structure
[Auto-generated: directory tree, 5-10 lines.]

## Operating Constraints
<!-- Project-specific constraints future agents would not reliably infer. Keep short. -->
- [Constraint that changes agent decisions.]

## Workflow
- Setup: [install command]
- Run: [dev command]
- Test: [test command]
- Lint: [lint command]

### Verification
- [Required command or manual check before completing relevant work.]

## Language
<!-- Durable terms and agent discoveries. Keep concise. -->
- **[Canonical term]**: [Definition]. Avoid: [ambiguous synonym].

## Relationships
- [Invariant or domain relationship worth preserving.]

## Flagged Ambiguities
- [Resolved naming or meaning conflict.]

## Learned Patterns
<!-- Lessons after corrections, loops, or failed attempts. -->
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

**NOW.md rules:** Keep it concise. Rewrite entirely on task switch (never
append). First file read on recovery, last file written before session end.

### AGENTS.md

```markdown
# Agent Instructions
<!-- context-harness:schema v3 -->

## Context Contract
- At a fresh session or true resume, read the small `NOW.md` packet first.
- If the user supplied an objective, question, or context, hydrate with it and
  read only selected durable context. Otherwise hydrate from `NOW.md` focus and
  next step.
- Reconcile user context with repository state, prefer the user's current
  objective when scope changed, and surface material conflicts.
- Reuse loaded context on ordinary follow-ups; catch up again only after a real
  context boundary, materially different objective, or external context change.
- Use `node scripts/context-index.js hydrate "<task>"` before opening `PLAN.md`,
  chunks, or bulky/task-specific context.
- Read concise `CONTEXT.md` directly while it fits the startup budget; otherwise
  use selected cards/sections. Respect `## Operating Constraints` before edits.
- Do not let non-blocking harness maintenance replace the requested work.
- Route task-local findings/decisions to `PLAN.md`; durable terms, constraints,
  corrections, and lessons to `CONTEXT.md`.
- After any update to `CONTEXT.md`, `PLAN.md`, or `NOW.md`, run
  `node scripts/context-index.js update`.
- Before ending, rewrite `NOW.md` from the observed final state after the last
  commit, push, deployment, rollback, task switch, or blocker discovery.

## Context Index
<!-- context-harness:index:start -->
Generated from context sources; read small `CONTEXT.md` directly and use hydrate before bulky detail.
<!-- context-harness:index:end -->
```

### PLAN.md (on-demand)

```markdown
# [Task Title]

## Goal
[What the user can do after this is complete. 1-2 sentences.]

## Done Criteria
- [Observable or testable completion criterion.]

## Progress
- [ ] Step 1
- [ ] Step 2

## Verification
- [Command/check to run and expected result.]

## Findings
[Task-local research, discoveries, errors, and low-confidence lessons.]

## Decisions
[Non-trivial decisions with rationale.]

## Archive
[Summarized completed phases. Used when active state becomes cluttered.]
```

### .context-harness/DREAM.md (lazy)

Created only after an automatic Dream/Compact pass changes context files.
This is a non-operational audit log for debugging context drift or human review;
agents must not read it during normal catch-up or task work.

### Progressive Context Library (generated)

`node scripts/context-index.js update` also maintains `.context-harness/index.json`,
`.context-harness/cards/`, and `.context-harness/chunks/`. `NOW.md` plus concise
`CONTEXT.md` are the always-read layer. Use `node scripts/context-index.js hydrate
"<task>"` to select cards before opening `PLAN.md`, chunks, or bulky
sections; open raw chunks only when a card says the detail is needed.

---

## Context Rules

| Rule | Detail |
|------|--------|
| **Always-read layer** | Read `NOW.md` first and concise `CONTEXT.md` with it. Use hydrate before `PLAN.md`, chunks, or bulky/task-specific context. |
| **NOW.md contract** | Update before session end. Rewrite on task switch. Keep concise. First read, last write. |
| **Capture human input** | If the user teaches a term, invariant, workflow, or constraint, write it to CONTEXT.md before it scrolls away. |
| **Reflection routing** | Task-local → PLAN.md Findings; durable process lesson → CONTEXT.md Learned Patterns; term → Language; invariant → Relationships; decision → PLAN.md Decisions unless the project already uses ADRs; skill correction → that skill's SKILL.md. |
| **Learn after struggle** | >2 attempts on a problem → distill lesson to CONTEXT.md § Learned Patterns |
| **Prune patterns** | Max 10 Learned Patterns. When full, remove the oldest entry. |
| **Dream check** | Every `context-maintain` run asks whether future catch-up would benefit from consolidation. If yes, compact bulky durable detail in source context or project docs, regenerate cards/chunks, verify with `hydrate`, and log to `.context-harness/DREAM.md`. |
| **PLAN.md pruning** | When active state is cluttered, summarize completed Progress into Archive and remove originals. |
| **No raw external content** | Don't paste raw URLs, API responses, or web content into CONTEXT.md. Summarize findings in PLAN.md § Findings. |

---

## Companion Scripts

All scripts are Node.js and share helpers in `scripts/lib.js`. Adding a script?
Import from `lib.js`; don't duplicate hook I/O, root walk, stack detection, or
markdown helpers.

| Script | Purpose | When to use |
|--------|---------|-------------|
| `scripts/lib.js` | Shared helpers | Imported by every other script |
| `scripts/install-project.js` | Copy current v3 runtime scripts into a target repo | Init mode |
| `scripts/codex-context-hook.js` | Codex lifecycle hook dispatcher for catch-up, init, and maintain nudges | Codex hooks |
| `scripts/context-gen.js` | Auto-detect project metadata + emit stack-aware rule defaults | Init mode, Update mode |
| `scripts/context-index.js` | Update/list/query/print/stats/hydrate/check context sections and cards | After CONTEXT.md changes |
| `scripts/eval-agent-problem-solving.js` | Prepare/score fresh-agent problem-solving evals comparing no-harness vs progressive-harness modes | Real-world context-harness evaluation |
| `scripts/guard.js` | Block --no-verify, detect secrets, protect linter configs | Runs automatically via PreToolUse hook |
| `scripts/format-on-edit.js` | Auto-format files after edits | Runs automatically via PostToolUse hook |
| `scripts/session-end.js` | Stamp NOW.md; best-effort prune of completed PLAN.md items when very long | Runs automatically via Stop hook |
| `scripts/task.js` | Task switcher — rewrites NOW.md; logs to PLAN.md Progress | Run on task start / done |

```bash
node scripts/task.js start "Implement auth middleware"
node scripts/task.js done
```

`start` rewrites NOW.md and logs prior focus to PLAN.md. `done` marks NOW.md
idle and logs completion to PLAN.md Progress.

## Non-Goals

No skill composition, subagent dispatch, mandatory worktrees, per-developer
journals, or heavyweight knowledge base. Keep memory durable but small.
