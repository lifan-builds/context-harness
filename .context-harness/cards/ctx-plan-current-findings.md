---
id: ctx-plan-current-findings
kind: plan
importance: 0.85
confidence: confirmed
source: PLAN.md#current-findings
chunk: null
tokens_est: 194
tags: [plan, current-findings]
---

# PLAN.md: Current Findings

## Summary
Deprecated context-launch, context-handoff, and context-grill stubs are

## Use when
- continuing the active task
- checking done criteria or decisions
- update context with task-local progress

## Key facts
- Deprecated context-launch, context-handoff, and context-grill stubs are
- removed completely; tests assert those skill files are absent.
- context-init is fresh-repo initialization only. Legacy v1, schema v2,
- partial/custom layout repair, and fleet migration route to explicit
- context-upgrade.

## Retrieval order
- Read `NOW.md` and concise `CONTEXT.md` as the always-read layer.
- Use this card before opening bulky `PLAN.md`, chunks, or raw source sections for this topic.
- Open raw detail only when this summary is insufficient for the task.

## Open next only if needed
- `PLAN.md#current-findings`
