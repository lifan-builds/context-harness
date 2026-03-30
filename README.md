# context-harness

Generate and maintain six core project context documents — `NOW.md`, `AGENTS.md`, `PLANS.md`, `FINDINGS.md`, `EVALUATION.md`, and `README.md` — with persistent file-based context management, auto-recovery hooks, and proactive compaction.

## What It Generates

| Document       | Audience           | Purpose                                            |
| -------------- | ------------------ | -------------------------------------------------- |
| `NOW.md`       | AI coding agents   | Working memory: current focus, blockers, next step |
| `AGENTS.md`    | AI coding agents   | Compact project guide optimized for agent context  |
| `PLANS.md`     | Agents & humans    | Living execution plan (ExecPlan format)            |
| `FINDINGS.md`  | Agents & humans    | Research log, discoveries, and error tracker       |
| `EVALUATION.md`| AI coding agents   | Quality contracts and self-evaluation grading      |
| `README.md`    | Human contributors | Standard project README for onboarding             |

## Key Features

- **Working memory (`NOW.md`)** — A max-20-line scratchpad that captures current focus, blockers, and next step. Always read first on recovery, written last before session end
- **Self-learning (`AGENTS.md § Learned Patterns`)** — Agent automatically records project-specific gotchas and workarounds after debugging struggles, building permanent project intuition
- **Adaptive auto-recovery hooks** — `UserPromptSubmit` hook injects NOW.md (full), active tasks (filtered), and compaction warnings. No more noisy `head -40` dumps
- **Proactive compaction** — Hooks monitor file sizes and warn when PLANS.md > 200 lines or FINDINGS.md > 150 lines. Compaction protocol archives completed phases and garbage-collects stale findings
- **Content separation** — External/untrusted content goes to FINDINGS.md, keeping PLANS.md clean and safe from prompt injection
- **Generator-Evaluator loop** — Autonomous execution with self-grading against EVALUATION.md contracts
- **Init & Update modes** — Bootstrap new projects or sync docs with codebase changes

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  Context Tiers                   │
├─────────────────────────────────────────────────┤
│                                                  │
│  Tier 1: Working Memory (always injected)        │
│  ┌──────────┐                                    │
│  │  NOW.md   │ ← max 20 lines, rewritten often  │
│  └──────────┘                                    │
│                                                  │
│  Tier 2: Active Context (filtered injection)     │
│  ┌──────────┐  ┌──────────────┐                  │
│  │ AGENTS.md │  │   PLANS.md   │ ← only [ ] items│
│  └──────────┘  └──────────────┘                  │
│                                                  │
│  Tier 3: Reference (read on-demand)              │
│  ┌──────────────┐  ┌────────────────┐            │
│  │ FINDINGS.md   │  │ EVALUATION.md  │            │
│  └──────────────┘  └────────────────┘            │
│                                                  │
│  Archive: Compacted history (searchable)         │
│  ┌────────────────────────────────┐              │
│  │ PLANS.md § Archive             │              │
│  └────────────────────────────────┘              │
└─────────────────────────────────────────────────┘
```

## Usage

Once installed, trigger the skill through your AI agent:

- **Init mode** — *"Initialize project docs"* — generates all six files from scratch
- **Update mode** — *"Update project docs"* — reads existing docs, analyzes recent changes, and updates

## Context Management

| Rule | Description |
|------|-------------|
| **NOW.md Contract** | Update before session end; rewrite on task switch; max 20 lines |
| **Learn After Struggle** | >2 attempts on a problem → distill lesson to AGENTS.md § Learned Patterns |
| **2-Action Rule** | Save findings to FINDINGS.md every 2 research operations |
| **Read Before Decide** | Re-read PLANS.md + Learned Patterns before major decisions |
| **Update After Act** | Mark progress, update NOW.md, log errors, record surprises after each step |
| **Compaction Protocol** | PLANS.md > 200 lines or FINDINGS.md > 150 lines → archive + garbage-collect |
| **5-Attempt Verification** | Diagnose autonomously for 4 attempts → Escalate to user on 5th |
| **Content Separation** | External content in FINDINGS.md only, never in PLANS.md |

## Files

| File                             | Description                                          |
| -------------------------------- | ---------------------------------------------------- |
| [`SKILL.md`](SKILL.md)          | Main skill instructions (read by the agent)          |
| [`templates.md`](templates.md)  | ExecPlan skeleton, NOW.md template, compaction guide  |
