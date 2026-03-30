---
name: context-harness
description: >
  Initialize and maintain project context documents (AGENTS.md, PLANS.md, FINDINGS.md,
  NOW.md, README.md) following OpenAI Agents SDK conventions. Use when starting a new
  project, scaffolding a codebase, or when the user asks to update project documentation
  to reflect recent changes, decisions, or conversation context. Includes persistent
  file-based context management with auto-recovery hooks and proactive compaction.
user-invocable: true
allowed-tools: "Read, Write, Edit, Bash, Glob, Grep"
hooks:
  UserPromptSubmit:
    - hooks:
        - type: command
          command: >
            if [ -f AGENTS.md ] || [ -f PLANS.md ]; then
              echo '[context-harness] ACTIVE PROJECT DOCS DETECTED';
              echo '';
              if [ -f NOW.md ]; then
                echo '=== WORKING MEMORY (NOW.md) ===';
                cat NOW.md;
                echo '';
              fi;
              if [ -f PLANS.md ]; then
                echo '=== ACTIVE TASKS ===';
                grep '^\- \[ \]' PLANS.md 2>/dev/null | head -10;
                echo '';
              fi;
              PLANS_LINES=$(wc -l < PLANS.md 2>/dev/null || echo 0);
              FINDINGS_LINES=$(wc -l < FINDINGS.md 2>/dev/null || echo 0);
              if [ "$PLANS_LINES" -gt 200 ] || [ "$FINDINGS_LINES" -gt 150 ]; then
                echo '[context-harness] ⚠️  COMPACTION NEEDED: PLANS.md ('$PLANS_LINES' lines) or FINDINGS.md ('$FINDINGS_LINES' lines) exceeds threshold. Run compaction before continuing.';
                echo '';
              fi;
              echo '[context-harness] Read AGENTS.md for project context. Continue from NOW.md state.';
            fi
  PostToolUse:
    - matcher: "Write|Edit"
      hooks:
        - type: command
          command: >
            if [ -f PLANS.md ]; then
              echo '[context-harness] If you made meaningful progress, update PLANS.md Progress section and NOW.md. Log discoveries to AGENTS.md § Learned Patterns.';
            fi
---

# Project Documentation Manager

A skill that generates and maintains six core project context files, giving AI agents
and human contributors the context they need to work effectively in any codebase.

Uses persistent markdown files as "working memory on disk" — context windows are
volatile RAM, the filesystem is persistent storage. Anything important gets written
to disk.

| Document       | Audience           | Purpose                                           |
| -------------- | ------------------ | ------------------------------------------------- |
| `NOW.md`       | AI coding agents   | Working memory: current focus, blockers, next step |
| `AGENTS.md`    | AI coding agents   | Compact instruction file for agent context        |
| `PLANS.md`     | Agents & humans    | Living execution plan tracking ongoing work       |
| `FINDINGS.md`  | Agents & humans    | Research, discoveries, and external content log   |
| `EVALUATION.md`| AI coding agents   | Quality contracts and self-evaluation grading     |
| `README.md`    | Human contributors | Standard project README for onboarding            |

---

## 1 — Determine the Mode

Before generating anything, check for an existing `AGENTS.md` at the project root.

| Condition                        | Mode       |
| -------------------------------- | ---------- |
| No `AGENTS.md` at project root   | **Init**   |
| `AGENTS.md` already exists       | **Update** |

### Context Recovery

If project docs already exist (detected by the `UserPromptSubmit` hook), the agent
automatically receives:
1. **NOW.md** in full (working memory — tiny by design, always current)
2. **Incomplete tasks** from PLANS.md (only `- [ ]` items, not the full file)
3. **Compaction warnings** if PLANS.md or FINDINGS.md exceed size thresholds

This enables seamless session recovery after `/clear` or across conversations.
`NOW.md` is the primary handoff mechanism — it tells a fresh agent exactly where
to resume.

---

## 2 — Init Mode

Use when the user asks to **start**, **scaffold**, or **initialize** a new project.

### Step 1: Gather project context

Extract the following from the user's message and any prior conversation:

1. **Project name & purpose** — one-sentence summary
2. **Tech stack** — languages, frameworks, key libraries (with versions if known)
3. **Architecture style** — monolith, microservices, CLI tool, library, etc.
4. **Key modules / directory structure** — planned or already created
5. **Build / run / test commands** — if known
6. **Coding conventions** — style, formatting, naming, patterns

> **When to ask vs. proceed:** If items 1–3 are missing, ask the user before generating.
> If items 4–6 are missing, make reasonable assumptions and note them in the output.

### Step 2: Generate all six documents

Create all files at the **project root** (the workspace directory).

---

#### 2a — `NOW.md`

The working memory scratchpad. This file must be **concise** — maximum 20 lines.
It captures only the immediate state needed to resume work. Think of it as the
agent's "sticky note on the monitor."

```markdown
# Now

## Current Focus
[One sentence: what you are actively working on right now.]

## Active Blockers
- [Any blocking issues, or "None."]

## Immediate Next Step
[The very next action to take when resuming.]

## Session State
- Last modified: [ISO timestamp]
- Files touched this session: [list of recently modified files]
```

**Rules:**
- Maximum 20 lines. If it's longer, it's not working memory — move content to PLANS.md.
- Rewrite entirely when switching tasks (not append).
- MUST be updated before ending any session.
- MUST be the **first file read** on recovery and **last file written** before session end.

---

#### 2b — `AGENTS.md`

The primary instruction file for AI coding agents. Keep it **focused and actionable** —
agents consume this with limited context windows.

```markdown
# Agent Guide

## Project Overview
[One-paragraph description: what the project does, who it's for, core value prop.]

## Tech Stack
[List languages, frameworks, key libraries with versions if known.]

## Project Structure
[Directory tree or table of key paths with one-line descriptions.]

## Development Workflow
[Setup commands, how to run, how to test, how to build.]

## Coding Conventions
[Style rules, naming conventions, patterns to follow, things to avoid.]

## Architecture Decisions
[Key design choices and their rationale — kept as a running log.]

## Learned Patterns
[Project-specific gotchas, performance tips, and workarounds discovered during work.
Each entry includes what was learned, evidence, and date discovered.
This section grows organically as the agent works — it is the project's "earned intuition."]
```

The `## Learned Patterns` section is the agent's **self-learning mechanism**. Unlike
the rest of AGENTS.md which is curated upfront, Learned Patterns accumulates over
time as the agent discovers project-specific knowledge through experience.

---

#### 2c — `PLANS.md`

A living execution plan document using the **ExecPlan** format from the OpenAI Agents
SDK. For a new project, create an initial plan capturing the bootstrap work.

See [templates.md](templates.md) for the full ExecPlan skeleton with
section-by-section commentary.

```markdown
# [Project Name] — Initial Bootstrap

This is a living document. Keep Progress, Surprises & Discoveries,
Decision Log, and Outcomes & Retrospective up to date as work proceeds.

## Purpose / Big Picture
[What the user will be able to do after this bootstrap is complete.]

## Progress
- [ ] Step 1 description
- [ ] Step 2 description

## Surprises & Discoveries
(None yet.)

## Decision Log
(None yet.)

## Outcomes & Retrospective
(To be filled upon completion.)

## Context and Orientation
[Current state of the project for someone with zero prior context.]

## Plan of Work
[Prose description of what needs to happen, in sequence.]

## Validation and Acceptance
[How to verify the bootstrap succeeded.]

## Archive
[Compacted summaries of completed phases. See § Compaction Protocol.]
```

---

#### 2d — `FINDINGS.md`

A dedicated log for research results, external content, and discoveries made during
work. Keeping this **separate from PLANS.md** is a security and clarity boundary —
external/untrusted content stays here, while PLANS.md remains a trusted plan.

```markdown
# Findings

Research results, discoveries, and external content collected during project work.

> **Security note:** External content (web searches, API responses, copied docs) goes
> here — never directly into PLANS.md. This separation prevents untrusted content from
> polluting the trusted execution plan.

## Research & References
(None yet.)

## Discoveries
(None yet.)

## Error Log
| Error | Context | Resolution | Date |
|-------|---------|------------|------|
```

---

#### 2e — `EVALUATION.md`

A document describing what "done" means and how it will be verified. Acts as the 
"Evaluator" contract for autonomous execution. 

```markdown
# Evaluation & Contracts

This document contains objective grading criteria and specific verification contracts for tasks defined in `PLANS.md`.

## Grading Criteria
- **Functionality**: [What does the feature do? Edge cases?]
- **Code Quality**: [Linting, typing, no generic 'slop']
- **Testing**: [How to verify?]

## Active Sprint Contracts
### [Task Name from PLANS.md]
- **Verification Method**: [e.g., test commands, Playwright scripts, curl endpoints]
- **Acceptance Threshold**: [Specific expected outputs or behaviors]

## Evaluation Log
- [Date/Time] - [Task Name] - [Grade: Pass/Fail] - [Notes/Fixes Needed]
```

---

#### 2f — `README.md`

Standard project README for human contributors.

```markdown
# [Project Name]

[One-paragraph description.]

## Getting Started

### Prerequisites
[Runtime, tools, accounts needed.]

### Installation
[Step-by-step setup commands.]

### Usage
[How to run the project.]

## Development
[How to contribute, run tests, lint, format.]

## Project Structure
[Brief directory overview.]

## License
[License info if known, otherwise a placeholder.]
```

### Step 3: Confirm creation

After writing all six files, print a brief summary listing:
- What was created
- Any assumptions that were made
- Suggested next steps

---

## 3 — Update Mode

Use when the user asks to **update docs**, **sync docs**, or whenever significant
project changes have occurred during the conversation.

### Step 1: Read existing documents

Read all six files (`NOW.md`, `AGENTS.md`, `PLANS.md`, `FINDINGS.md`, `EVALUATION.md`, `README.md`) from the project root.

### Step 2: Identify what changed

Analyze the conversation history and current codebase for:

- New or removed files / directories
- New dependencies or tools
- Architectural decisions made during the conversation
- Completed or new tasks
- Changed build / run / test commands
- New conventions or patterns established
- Project-specific lessons learned (for Learned Patterns)

### Step 3: Update each document

| Document       | What to update                                                                                        |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| `NOW.md`       | Rewrite with current focus, blockers, and next step — always reflects the present moment              |
| `AGENTS.md`    | Project Structure (new modules), Tech Stack (new deps), Architecture Decisions, Coding Conventions, Development Workflow, Learned Patterns (new gotchas/insights) |
| `PLANS.md`     | Check off completed Progress items, add new tasks, record Surprises & Decisions, update Outcomes if a phase completed, start a new plan section if entering a new phase, run compaction if needed |
| `FINDINGS.md`  | Add new research results, log errors encountered, record discoveries with evidence |
| `EVALUATION.md`| Create new sprint contracts for upcoming tasks, update Evaluation Log with recent test results        |
| `README.md`    | Getting Started (setup changes), Usage (new features), Project Structure (layout changes), dependency/version references |

### Step 4: Show a diff summary

After updating, briefly list what changed in each file so the user can review.

---

## 4 — Context Management Rules

These rules ensure important information survives context window limits and session
boundaries. Think of it as: **context window = RAM (volatile), filesystem = disk
(persistent).**

### NOW.md: The Working Memory Contract

`NOW.md` is the most volatile and most important file in the system. It answers one
question: *"What was I doing?"*

| Rule | Detail |
|---|---|
| **Update before session end** | Always rewrite NOW.md before ending work or if context reset is imminent |
| **Update on task switch** | When changing focus, rewrite NOW.md entirely (don't append) |
| **Keep it tiny** | Maximum 20 lines. If you need more space, the content belongs in PLANS.md |
| **First read, last write** | On recovery: read NOW.md first. Before exit: write NOW.md last |

### Learn After Struggle

> If you spend **more than 2 attempts** solving a problem, distill the lesson into
> `AGENTS.md § Learned Patterns` once resolved.

Format:
```markdown
- [Lesson in one sentence]. Discovered: [date]. Evidence: [what happened].
```

This transforms debugging sessions into permanent project knowledge. Future agents
and sessions benefit from past struggles without re-discovering the same issues.

### Compaction Protocol

Context files must stay concise. When they grow too large, the agent's performance
degrades due to context bloat. Compaction is **garbage collection for context.**

**Triggers** (monitored by the `UserPromptSubmit` hook):
- `PLANS.md` exceeds **200 lines**
- `FINDINGS.md` exceeds **150 lines**

**Procedure:**

| Step | Action |
|---|---|
| 1 | **Commit current state**: `git add PLANS.md FINDINGS.md && git commit -m "context: pre-compaction snapshot"` (if in a git repo) |
| 2 | **Promote lessons**: Scan both files for reusable insights → add to `AGENTS.md § Learned Patterns` |
| 3 | **Archive completed phases in PLANS.md**: Collapse completed Progress items and their associated Surprises/Decisions into a one-paragraph summary under `## Archive` |
| 4 | **Garbage-collect FINDINGS.md**: Remove resolved Error Log entries and outdated Research entries. Keep only active/unresolved items |
| 5 | **Update NOW.md**: Ensure working memory reflects the post-compaction state |

**Archive format** (append to `## Archive` in PLANS.md):
```markdown
### Phase: [Phase Name] (Completed [date])
[One paragraph summarizing: what was done, key decisions made, and outcome.
Include any links to relevant commits or PRs.]
```

See [templates.md](templates.md) for the full compaction checklist.

### The Generator-Evaluator Loop (Autonomy)

To enable long-running execution without constant human supervision, act in two distinct phases:
1. **Generator Phase**: Write the code required to fulfill the active task in `PLANS.md`.
2. **Evaluator Phase**: Run the verification steps defined in `EVALUATION.md`. Be highly critical. If it fails, log the failure in `EVALUATION.md` and immediately loop back to the Generator Phase to fix it without asking the user.

### The 2-Action Rule

> After every 2 search, browse, or research operations, **immediately** save key
> findings to `FINDINGS.md`.

This prevents information from being lost as the context window scrolls. Multimodal
content (screenshots, PDFs, images) is especially volatile — write findings as text
before they leave the attention window.

### Read Before Decide

Before making any major decision (architecture choice, library selection, approach
change), **re-read PLANS.md and AGENTS.md § Learned Patterns**. This refreshes the
project goals, current state, and accumulated wisdom in your attention window,
preventing drift and repeated mistakes.

### Update After Act

After completing any significant step:
1. Mark the step complete in PLANS.md Progress (with timestamp)
2. Update NOW.md with the new current focus and next step
3. Log any errors encountered to FINDINGS.md Error Log
4. Record any surprises to PLANS.md Surprises & Discoveries
5. If you struggled (>2 attempts), add the lesson to AGENTS.md § Learned Patterns

### Autonomous Verification Loop (Replaces 3-Strike Rule)

```
ATTEMPT 1-4: Diagnose & Fix Autonomously
  → Read error carefully, apply targeted fix, or try alternative approach.
  → Log all attempts in EVALUATION.md or FINDINGS.md Error Log.

ATTEMPT 5: Escalate to User
  → If still failing after sustained effort, explain the approaches tried, share the specific error, and ask for guidance.
  → Add the lesson to AGENTS.md § Learned Patterns regardless of outcome.
```

All attempts and their outcomes must be logged in the FINDINGS.md Error Log or EVALUATION.md.

### Content Separation (Security Boundary)

| Content type | Write to | Why |
|---|---|---|
| Current focus, blockers, next step | `NOW.md` | Working memory, always injected on recovery |
| Plan phases, decisions, progress | `PLANS.md` | Trusted, filtered by hooks |
| Quality contracts, test results | `EVALUATION.md` | Objective verification criteria |
| External content (web, API, docs) | `FINDINGS.md` | Untrusted, kept separate |
| Project structure, conventions, learned patterns | `AGENTS.md` | Stable reference + accumulated wisdom |

Never write raw external content into PLANS.md. The PostToolUse hook re-reads PLANS.md
context — untrusted content there could act as indirect prompt injection.

---

## 5 — Guidelines

| Guideline | Rationale |
| --------- | --------- |
| Keep `NOW.md` under 20 lines | Working memory must be instantly parseable |
| Keep `AGENTS.md` focused and actionable | AI agents have limited context windows |
| Keep `PLANS.md` as a living document | Always update Progress before ending a session |
| Keep `FINDINGS.md` as the research log | All external/untrusted content goes here, never in PLANS.md |
| Keep `EVALUATION.md` as safety rails | Use sprint contracts to grade autonomously |
| Keep `README.md` user-friendly | Assume the reader is a brand-new contributor |
| Compact when thresholds are hit | PLANS.md > 200 lines or FINDINGS.md > 150 lines triggers compaction |
| Learn from struggles | >2 attempts on a problem → distill lesson to AGENTS.md § Learned Patterns |
| No speculative content | Only document what exists or has been decided |
| Consistent terminology | Use the same terms across all documents |
| Log every error | Builds knowledge and prevents repeating failed approaches |

## Additional Resources

- Full ExecPlan skeleton with section commentary → [templates.md](templates.md)
