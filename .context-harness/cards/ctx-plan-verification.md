---
id: ctx-plan-verification
kind: plan
importance: 0.85
confidence: confirmed
source: PLAN.md#verification
chunk: .context-harness/chunks/ctx-plan-verification.md
tokens_est: 1141
tags: [plan, verification]
---

# PLAN.md: Verification

## Summary
tests/run-all.sh exits 0 with 211 passed, 0 failed after adding minimal fresh-agent eval harness coverage.

## Use when
- continuing the active task
- checking done criteria or decisions
- update context with task-local progress

## Key facts
- tests/run-all.sh exits 0 with 211 passed, 0 failed after adding minimal fresh-agent eval harness coverage.
- node scripts/context-index.js check exits 0 after refreshing generated cards/index.
- node scripts/eval-context-library.js /Users/lfan/Project .context-harness/shadow-context-library-report.md exits 0: 24 repos found, 19 passed, 0 warned, 0 fa...
- node scripts/eval-agent-problem-solving.js prepare ... plus score smoke exits 0 in a temporary eval run, confirming paired cases and pending-score reports work.
- node scripts/eval-agent-problem-solving.js prepare /Users/lfan/Project --repos context-harness,agent-nexus,credit-card-tracker,flyingpig,flight-plan --scenar...

## Retrieval order
- Read `NOW.md` and concise `CONTEXT.md` as the always-read layer.
- Use this card before opening bulky `PLAN.md`, chunks, or raw source sections for this topic.
- Open raw detail only when this summary is insufficient for the task.

## Open next only if needed
- `PLAN.md#verification`
- `.context-harness/chunks/ctx-plan-verification.md`
