---
id: ctx-context-language
kind: language
importance: 0.82
confidence: confirmed
source: CONTEXT.md#language
chunk: null
tokens_est: 320
tags: [context, language]
---

# CONTEXT.md: Language

## Summary
context-catch-up: The startup/resume skill for a freshly started agent session or genuinely resumed session that needs to recover project state before planning or editing.

## Use when
- using canonical project terms or resolving naming ambiguity

## Key facts
- context-init: The fresh-repository initialization skill. It creates a new context-harness layout only; avoid using it for legacy, partial, or schema migration.
- context-maintain: The ongoing context skill for maintaining context after or during work: updates, lesson capture, plan state, session closeout,...
- set-goal: The skill for converting the current conversation and project context into a directly usable long-running goal for Codex goal mode, loop mode,...
- context-upgrade: Explicit-only operator skill for context-harness source upgrades, legacy v1 migration, schema migrations, partial/custom layout repair,...
- Legacy Objectives: Preserved schema v2 project outcomes. Avoid using them for new work; use PLAN.md Done Criteria and CONTEXT.md Workflow Verification.

## Retrieval order
- Read `NOW.md` and concise `CONTEXT.md` as the always-read layer.
- Use this card before opening bulky `PLAN.md`, chunks, or raw source sections for this topic.
- Open raw detail only when this summary is insufficient for the task.

## Open next only if needed
- `CONTEXT.md#language`
