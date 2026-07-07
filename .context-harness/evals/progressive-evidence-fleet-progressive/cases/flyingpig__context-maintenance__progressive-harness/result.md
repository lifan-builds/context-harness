## Current understanding

The completed task was the MCP-native existing-Chrome backend for Flying Pig: Auto-Connect Existing Chrome now uses Chrome DevTools MCP to select/snapshot a user-authorized existing Chrome tab, and runs can use `browser_backend:"mcp"` with `mcp_page` through a minimal `McpBrowserExecutor` when no browser-use/CDP handoff URL exists. The implementation was already recorded in `NOW.md` and in `PLAN.md` under `2026-07-05 Chrome DevTools MCP auto-connect`.

Context updates should be routed as follows:

- `NOW.md`: keep/update the current focus, blockers, immediate next step, verification passed, smoke artifact, and touched files for the completed MCP-native task.
- `PLAN.md`: keep the task-local completion details, verification evidence, and residual next work. The MCP findings/progress belong in the dated MCP section; the remaining unchecked work should stay focused on supervised real Amex beta smoke and rebuild/repackage for packaged app availability.
- `CONTEXT.md`: keep only durable project knowledge: the learned pattern that Chrome DevTools MCP can drive an authorized existing Chrome tab through a minimal native backend, that selected MCP tabs are sensitive real-browser access, and that the MCP action allowlist should remain narrow. Avoid putting transient test counts or artifact paths here.
- Generated context index/cards: after any edits to `NOW.md`, `PLAN.md`, or `CONTEXT.md`, refresh/check the generated cards so future fresh agents retrieve the MCP state.
- Do not update `FINDINGS.md`, `DESIGN.md`, or ADRs unless a separate durable external-research finding or hard-to-reverse architecture decision is made. Do not update `AGENTS.md` unless startup instructions change.

## Active blockers or uncertainty

- Supervised real Amex beta smoke still needs a tester present for login/MFA and explicit send/approval moments.
- Local macOS desktop artifacts are intentionally unsigned; update copy must describe manual GitHub release downloads/replacements, not automatic in-place updates.
- The currently running packaged app will not include Connect Existing Chrome, Auto-Connect Existing Chrome, or MCP-native runs until the desktop app/helper are rebuilt and relaunched.
- MCP-native mode is intentionally minimal and not browser-use parity; keep the allowlist narrow and prefer local/mock verification before real authenticated customer-service actions.
- Minor harness note: `PLAN.md` has a stale selected card for session state dated 2026-05-25 even though the raw plan contains the 2026-07-05 MCP section; refreshing generated cards after context edits should address this.

## Immediate next step

If continuing implementation: run a source dashboard/manual smoke against a local mock page using Auto-Connect Existing Chrome and start a harmless MCP task from the UI. If preparing for beta: rebuild/repackage the desktop app/helper so the packaged app includes the MCP-native flow.

## Relevant files

- `NOW.md`
- `PLAN.md`
- `CONTEXT.md`
- `.context-harness/cards/ctx-now-now.md`
- `.context-harness/cards/ctx-plan-active-blockers.md`
- `.context-harness/cards/ctx-context-learned-patterns.md`
- `src/agent/chrome_devtools_mcp.py`
- `src/agent/mcp_executor.py`
- `src/agent/brain.py`
- `src/agent/run_orchestration.py`
- `src/daemon/preflight.py`
- `src/daemon/server.py`
- `dashboard/index.html`
- `dashboard/dashboard.js`
- `tests/unit/test_mcp_executor.py`
- `tests/unit/test_run_orchestration.py`
- `tests/unit/test_daemon_server.py`
- `scripts/test_helper_dashboard.mjs`

## Verification command/check

For context maintenance after edits:

```bash
node scripts/context-index.js update
node scripts/context-index.js check
node scripts/context-index.js hydrate "update context after completed task"
```

Expected retrieval check: hydrate should surface `ctx-now-now`, a PLAN MCP/progress or active-blockers card, and `ctx-context-learned-patterns` for the MCP durable lesson.

Already-recorded implementation verification to preserve in `NOW.md`/`PLAN.md`:

```bash
pytest tests/unit/test_mcp_executor.py tests/unit/test_run_orchestration.py tests/unit/test_daemon_server.py -q
node --check dashboard/dashboard.js
node --check scripts/test_helper_dashboard.mjs
node scripts/test_dashboard_protocol.mjs
npm run test:dashboard
pytest tests/unit -q
ruff check src tests
git diff --check
```

Live smoke evidence already recorded: Chrome DevTools MCP listed 7 existing tabs, a safe local CLIProxy tab was selected, the MCP executor ran `take_snapshot` then `report_outcome`, returned success, and wrote `/tmp/flyingpig-mcp-smoke/mcp_session_20260706_041301.json`.

## Context Evidence

1. Read `NOW.md` first.
2. Read `CONTEXT.md` as the always-read context layer.
3. Ran from the case repo: `node scripts/context-index.js hydrate "update context after completed task"`.
4. Hydrate selected: `ctx-now-now`, `ctx-plan-findings`, `ctx-plan-active-blockers`, `ctx-plan-session-state`, `ctx-context-learned-patterns`, `ctx-context-operating-constraints`, `ctx-context-workflow`.
5. Opened selected cards before raw plan detail: `ctx-now-now`, `ctx-plan-active-blockers`, `ctx-plan-session-state`, `ctx-context-learned-patterns`, `ctx-context-operating-constraints`, `ctx-context-workflow`.
6. Opened raw `PLAN.md` only after selected cards, limited to the active/progress/findings sections that contain the MCP task and verification evidence.

## Confidence and why

High. `NOW.md`, `CONTEXT.md`, hydrate output, selected cards, and raw `PLAN.md` all point to the same completed MCP-native task, the same blockers, and the same next actions. The only uncertainty is generated-card freshness around `PLAN.md` session-state/progress, which is a context-index refresh follow-up rather than a blocker for deciding the update routing.