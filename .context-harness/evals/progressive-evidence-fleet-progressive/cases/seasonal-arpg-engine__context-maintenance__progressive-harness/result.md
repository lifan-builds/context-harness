# Eval Result: seasonal-arpg-engine / context-maintenance / progressive-harness

## Current understanding

A task just completed in a repo copy whose context is drifted. The executable/source tree and `README.md` now describe **Exalted Tools + POE2 P2 Follow**, while `CONTEXT.md` still carries a large Seasonal ARPG / imported legacy agent guide. `NOW.md` is missing entirely even though `AGENTS.md` requires reading it first.

For context maintenance, the project-specific facts that matter are:

- Website routes and public deploy boundaries are the current web surface.
- Currency arbitrage remains an informational/manual-verification workflow.
- P2 Follow has a local Windows controller/vision helper with Python compile and focused regression checks.
- Secret/cookie/public deploy safety is durable and should remain visible.

## Active blockers or uncertainty

- Missing `NOW.md` blocks clean resume state.
- `CONTEXT.md` conflicts with `README.md`; the top-level project identity and structure should be compacted to the current Exalted Tools + P2 Follow repo.
- `PLAN.md` is absent in the eval copy, so task-local completion/progress should be recreated or routed to the repository's current plan file only after confirming the canonical filename.
- Stale Seasonal ARPG workflow text such as `Torchlight TLIDB: python3 games/torchlight/scripts/tlidbverify.py fetch https://tlidb.com/cn/Hero` should be marked as archived/drift rather than used for current verification.
- The context index/hydrate still works, but it selects legacy/context-contract cards rather than current task cards because the source context is stale.
- `cookies.txt` and `.env` are present in the eval copy; maintenance should preserve the safety invariant without reading or copying their contents.

## Immediate next step

Perform explicit context maintenance, not product edits:

1. Create or restore `NOW.md` with current focus, blockers, immediate next step, verification, and touched files.
2. Compact/update `CONTEXT.md` so Project/Structure/Workflow describe Exalted Tools + POE2 P2 Follow, while preserving durable POE2 safety constraints and deploy-boundary lessons.
3. Move old Seasonal ARPG research detail out of the always-read layer or archive it only if still relevant.
4. Keep `AGENTS.md` as the small activation/index layer.
5. Run `node scripts/context-index.js update` and then `node scripts/context-index.js check`.
6. Run the README Python compile/regression checks if the completed task changed Python/API/P2/currency code.

## Relevant files

- `NOW.md` — missing; should be recreated for current session state.
- `CONTEXT.md` — stale/oversized; should be compacted around current repo identity and durable constraints.
- `AGENTS.md` — v3 contract/index; should be regenerated after context changes.
- `README.md` — current source of truth for repo identity and verification commands.
- `.vercelignore`, `vercel.json` — public deploy boundary.
- `api/*.py`, `vercel_api_shared.py`, `vercel_history_store.py`, `games/poe2/tools/currency_arbitrage/`, `games/poe2/tools/p2_follow/` — runtime surfaces whose changes determine verification.

## Verification command/check

After context maintenance:

```bash
node scripts/context-index.js update
node scripts/context-index.js check
```

If the completed task touched runtime code, also run the README checks: `python -m py_compile ...`, `python games/poe2/tools/currency_arbitrage/poe2_currency_arbitrage_guard_check.py`, and the three P2 Follow tests.

## Context Evidence

1. Read eval prompt for the context-maintenance case.
2. Attempted required `NOW.md` read; file is missing in the repo copy.
3. Read `CONTEXT.md`; it is v3 but stale/oversized and identifies the project as Seasonal ARPG Engine.
4. Ran from the case repo: `node scripts/context-index.js hydrate "update context after completed task"`.
5. Hydrate selected `ctx-context-context-contract`, `ctx-context-operating-constraints`, `ctx-context-workflow-1`, `ctx-context-language`, `ctx-context-relationships`, `ctx-context-learned-patterns`, and `ctx-context-learned-patterns-1`.
6. Read `AGENTS.md`; it requires `NOW.md`, context routing, and index regeneration after updates.
7. Read `README.md`; it describes Exalted Tools + POE2 P2 Follow and lists concrete verification commands.

## Confidence and why

Confidence is high for the maintenance routing because the drift is direct and observable: missing `NOW.md`, stale/oversized `CONTEXT.md`, and README/current tree mismatch. Confidence is medium for the exact product task that completed because no current `NOW.md` exists.