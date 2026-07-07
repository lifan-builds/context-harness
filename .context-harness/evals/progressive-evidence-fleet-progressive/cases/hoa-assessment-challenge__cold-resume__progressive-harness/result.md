# Fresh Agent Catch-Up

## Current understanding
The active work is HOA roofing-project coordination after Lifan's board exit. She should be treated as a former board member/homeowner, not an active director. Basecamp access appears removed, so future intake should default to Gmail/AppFolio unless Basecamp access is explicitly restored.

The near-term substance is lender/refi and sale-planning risk: VIS will provide factual Association records only and will not author an underwriting-style roofing status packet. Mark has indicated a second special assessment is likely after J2's comprehensive estimate, but no formal assessment has been adopted yet. For Lifan's current home/sale-planning questions, use Building 17, not the older Building 14 assumption. The June 26 J2/AppFolio look-ahead runs through July 11 and does not include Building 17.

## Active blockers or uncertainty
- Basecamp appears unavailable after Lifan's board access removal.
- Annual meeting outcome and current board composition remain unknown from available email.
- The June 15 budget numbers need interpretation: apparent $659,610 allowance need above original allowances, excluding J2 fees and unclear on tax/project-contingency treatment.
- Lender-facing clarity is unresolved because VIS will not provide underwriting interpretation, while lenders are struggling to reconcile funds, collections, contract/allowance exposure, future assessment risk, and project status.
- Building 17 schedule is uncertain because it is absent from the June 26 three-week look-ahead.
- Context-harness drift: `NOW.md` still has a schema v2 marker, and `node scripts/context-index.js check` reports `AGENTS.md` Context Index is stale. This does not block this read-only catch-up, but should be repaired via an explicit context upgrade/update pass.

## Immediate next step
If continuing HOA coordination, use Gmail/AppFolio rather than Basecamp. For lender/refi support, push for a Board/counsel/J2-approved, underwriter-clear factual summary and avoid any "no additional assessment expected" language unless formally confirmed. For Building 17 timing, state only that the posted schedule does not show a start by July 11; a practical estimate is no earlier than mid/late July for roof start and late July to mid-August for roof/shingle completion if sequencing continues after Building 14.

## Relevant files
- `NOW.md` — current resume packet: focus, blockers, immediate next step, touched files.
- `CONTEXT.md` — durable project facts, operating constraints, language, relationships, HOA state, construction/budget facts, communication guidance.
- `PLAN.md` — active coordination plan, completed pulls, open follow-ups, task-local findings/decisions.
- `project/archive/communication_logs.md` — summary-only communication history to update after future pulls.
- `project/archive/timeline.md` — milestone history to update when material events are confirmed.
- `project/archive/drafts/` — proper location for draft owner/lender communications, if requested.
- `.codex/skills/gmail-ingest/scripts/gws_gmail.py` — default Gmail search path after board exit.
- `.codex/skills/gmail-ingest/scripts/create_gmail_draft_reply.py` — draft creation path when user requests a reviewed Gmail reply.

## Verification command/check
For future documentation/context changes, run:

```bash
git diff --check -- AGENTS.md CONTEXT.md NOW.md PLAN.md README.md project/archive/communication_logs.md project/archive/timeline.md
node scripts/context-index.js check
```

Current read-only check result: `node scripts/context-index.js check` fails with `FAIL AGENTS.md Context Index is stale; run node scripts/context-index.js update`.

## Context Evidence
1. Read `NOW.md` first, per prompt.
2. Read `AGENTS.md` Context Contract/Index and confirmed `CONTEXT.md` is concise enough to read directly.
3. Read full `CONTEXT.md` as the always-read layer.
4. Ran `node scripts/context-index.js hydrate "resume current task"`; hydrate selected cards: `ctx-plan-goal`, `ctx-now-now`, `ctx-context-structure`.
5. Read selected cards `.context-harness/cards/ctx-plan-goal.md`, `.context-harness/cards/ctx-now-now.md`, and `.context-harness/cards/ctx-context-structure.md` before opening `PLAN.md`.
6. Ran `node scripts/context-index.js check`; it reported stale `AGENTS.md` index.
7. Read `PLAN.md` after hydrate/card review to confirm active plan progress, open follow-ups, findings, and decisions.

## Confidence and why
High for the current focus, blockers, immediate next step, and relevant files because `NOW.md`, concise `CONTEXT.md`, selected hydrate cards, and `PLAN.md` all align on the same HOA/lender/refi/Building 17 priorities. Medium on schedule and assessment details because the underlying record itself flags them as not formally confirmed and requiring Board/J2/counsel clarification.