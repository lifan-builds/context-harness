---
id: ctx-context-workflow
kind: workflow
importance: 0.9
confidence: confirmed
source: CONTEXT.md#workflow
chunk: null
tokens_est: 54
tags: [context, workflow]
---

# CONTEXT.md: Workflow

## Summary
Setup: n/a

## Use when
- running, testing, linting, deploying, or verifying changes

## Key facts
- Run: n/a
- Test: tests/run-all.sh
- Lint: n/a
- Verification: tests/run-all.sh exits 0 before completing code changes.
- Local deploy: After every repo update, use agent access to deploy it locally.

## Retrieval order
- Read `NOW.md` and concise `CONTEXT.md` as the always-read layer.
- Use this card before opening bulky `PLAN.md`, chunks, or raw source sections for this topic.
- Open raw detail only when this summary is insufficient for the task.

## Open next only if needed
- `CONTEXT.md#workflow`
