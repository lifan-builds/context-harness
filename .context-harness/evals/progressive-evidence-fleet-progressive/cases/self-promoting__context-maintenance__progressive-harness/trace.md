Trace notes for fresh-agent eval case.

Files/commands used, in order:
1. Read `prompt.md` for task and constraints.
2. Read `repo/NOW.md` first. Evidence: completed Context Harness promotion refresh; blocker is terminal screenshot/GIF; next step is review X draft and adapt to DEV/Hashnode; touched files listed.
3. Read concise `repo/CONTEXT.md` directly. Evidence: durable constraints, workflow, canonical language, relationships, and learned patterns fit in always-read layer.
4. Ran from `repo/`: `node scripts/context-index.js hydrate "update context after completed task"`.
   - Hydrate selected: `ctx-now-now`, `ctx-context-workflow`, `ctx-context-operating-constraints`, `ctx-context-language`, `ctx-context-relationships`, `ctx-context-learned-patterns`.
5. Opened selected cards before raw plan/strategy: `ctx-context-workflow`, `ctx-context-operating-constraints`, `ctx-context-relationships`, `ctx-context-language`.
6. Read `repo/PLANS.md` for active plan, decision log, proof points, and channel plan.
7. Read `repo/PROMOTION_STRATEGY.md`, `repo/README.md`, `repo/drafts/context-harness-twitter.md`, and `repo/drafts/agent-operating-layer-twitter.md` for task artifacts and stale-plan detection.
8. Read `repo/AGENTS.md` to confirm context routing: durable terms/constraints to `CONTEXT.md`, task-local findings and decisions to plan file, closeout state to `NOW.md`, and `node scripts/context-index.js update` after `CONTEXT.md` edits.

Context routing conclusion:
- Update/confirm `NOW.md` with completed refresh, blocker, next step, touched files.
- Keep/update `PLANS.md` for launch claim, proof points, channel plan, and decision log.
- Clean stale `PROMOTION_STRATEGY.md` active-queue note saying `drafts/context-harness-twitter.md` still needs refresh for old “3 files / 9 rules” copy.
- Do not update `CONTEXT.md` unless a durable term/link/constraint/relationship changed; none was found.
- Run `node scripts/context-index.js update` only if `CONTEXT.md` changes.

Verification to recommend:
- `git diff -- README.md PLANS.md PROMOTION_STRATEGY.md drafts/context-harness-twitter.md drafts/agent-operating-layer-twitter.md NOW.md`
- `rg "3 files / 9 rules|older copy still says|AwesomeMyChart|credit-card-tracker|snow-deals" README.md PLANS.md PROMOTION_STRATEGY.md drafts`
- `node scripts/context-index.js hydrate "update context after completed task"`
- If `CONTEXT.md` changes: `node scripts/context-index.js update` then hydrate again.

Follow-up noted:
- Generated workflow card referenced `scripts/reachcheck.py` / `scripts/chromereachcheck.py`, while `CONTEXT.md` and `PLANS.md` reference `scripts/reach_check.py` / `scripts/chrome_reach_check.py`; likely generated-card/index quality issue, not a blocker for this read-only task.

Forbidden files not read: `expected.json`, `score.json`, run `manifest.json`, eval reports.