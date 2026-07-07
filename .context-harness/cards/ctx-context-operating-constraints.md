---
id: ctx-context-operating-constraints
kind: constraints
importance: 0.9
confidence: confirmed
source: CONTEXT.md#operating-constraints
chunk: null
tokens_est: 105
tags: [context, operating-constraints, constraints]
---

# CONTEXT.md: Operating Constraints

## Summary
Keep context-harness lightweight; do not turn it into a large process framework.

## Use when
- before planning or editing
- checking project constraints
- update context safely

## Key facts
- Keep context-harness lightweight; do not turn it into a large process framework.
- Split workflows into separate skills only when the agent's invocation intent is genuinely different.
- Do not require ADRs for ordinary context capture.
- Keep the user-facing skill set small and easy to choose from.
- Route durable corrections into project context before they scroll away.

## Retrieval order
- Read `NOW.md` and concise `CONTEXT.md` as the always-read layer.
- Use this card before opening bulky `PLAN.md`, chunks, or raw source sections for this topic.
- Open raw detail only when this summary is insufficient for the task.

## Open next only if needed
- `CONTEXT.md#operating-constraints`
