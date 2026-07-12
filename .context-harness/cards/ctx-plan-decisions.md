---
id: ctx-plan-decisions
kind: plan
importance: 0.85
confidence: confirmed
source: PLAN.md#decisions
chunk: null
tokens_est: 141
tags: [plan, decisions]
---

# PLAN.md: Decisions

## Summary
Do not ship hidden compatibility stubs; replacement behavior lives in set-goal, context-maintain, and context-upgrade.

## Use when
- continuing task-local decisions

## Key facts
- Keep the preferred skill set small: context-init, context-catch-up, set-goal, context-maintain, and explicit-only context-upgrade.
- Keep migration and layout repair out of ordinary catch-up so upgrades happen only when the user asks for harness/schema/fleet update work.
- Keep AGENTS.md as activation contract plus generated context index; durable detail stays in CONTEXT.md and active task evidence stays here.

## Retrieval order
- Read `NOW.md` and concise `CONTEXT.md` as the always-read layer.
- Use this card before opening bulky `PLAN.md`, chunks, or raw source sections for this topic.
- Open raw detail only when this summary is insufficient for the task.

## Open next only if needed
- `PLAN.md#decisions`
