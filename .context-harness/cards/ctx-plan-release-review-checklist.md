---
id: ctx-plan-release-review-checklist
kind: plan
importance: 0.85
confidence: confirmed
source: PLAN.md#release-review-checklist
chunk: null
tokens_est: 149
tags: [plan, release-review-checklist]
---

# PLAN.md: Release Review Checklist

## Summary
Review source changes separately from generated .context-harness/ artifacts.

## Use when
- continuing the active task
- checking done criteria or decisions
- update context with task-local progress

## Key facts
- Review source changes separately from generated .context-harness/ artifacts.
- Confirm eval-copy exclusions prevent .env, .env., cookies.txt, and key
- material from entering case repos.
- Confirm stale generated context is reported as a follow-up unless it blocks
- correctness or safety.

## Retrieval order
- Read `NOW.md` and concise `CONTEXT.md` as the always-read layer.
- Use this card before opening bulky `PLAN.md`, chunks, or raw source sections for this topic.
- Open raw detail only when this summary is insufficient for the task.

## Open next only if needed
- `PLAN.md#release-review-checklist`
