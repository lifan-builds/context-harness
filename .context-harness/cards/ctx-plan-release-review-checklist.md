---
id: ctx-plan-release-review-checklist
kind: plan
importance: 0.85
confidence: confirmed
source: PLAN.md#release-review-checklist
chunk: null
tokens_est: 160
tags: [plan, release-review-checklist]
---

# PLAN.md: Release Review Checklist

## Summary
[x] Reviewed source changes separately from generated .context-harness/ artifacts.

## Use when
- continuing task-local release review checklist

## Key facts
- [x] Confirmed Git inventory, private-path exclusions, secret scanning, and byte budgets fail closed before evaluation copies are prepared.
- [x] Confirmed stale generated context is a visible follow-up unless it blocks correctness or safety.
- [x] Ran targeted tests, full tests/run-all.sh, index check, five-repository evaluation preflight, Agent Nexus canary, and full fleet shadow.
- [x] Updated dirty repositories only within exact managed boundaries; preserved unrelated work and recorded intentional conflicts without commit or push.

## Retrieval order
- Read `NOW.md` and concise `CONTEXT.md` as the always-read layer.
- Use this card before opening bulky `PLAN.md`, chunks, or raw source sections for this topic.
- Open raw detail only when this summary is insufficient for the task.

## Open next only if needed
- `PLAN.md#release-review-checklist`
