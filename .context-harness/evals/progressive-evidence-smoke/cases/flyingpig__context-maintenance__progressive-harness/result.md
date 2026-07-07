# Current understanding

The completed task is a minimal MCP-native existing-Chrome backend for Flying Pig. The current handoff in `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/NOW.md` says Auto-Connect Existing Chrome can select an existing Chrome tab through Chrome DevTools MCP, pass `browser_backend: "mcp"` and `mcp_page` through the run protocol, route `AgentBrain` to `McpBrowserExecutor`, accept MCP-selected tabs in preflight without a CDP URL, and let the dashboard treat an MCP-selected tab as runnable.

Context maintenance should not edit repository source files. The source/test evidence only informs what belongs in context:

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/src/agent/chrome_devtools_mcp.py` owns MCP auto-connect/session/page metadata and setup errors.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/src/agent/mcp_executor.py` owns the narrow MCP-native observe/action loop and action allowlist.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/src/agent/brain.py` routes `browser_backend == "mcp"` to `McpBrowserExecutor`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/src/agent/run_orchestration.py`, `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/src/daemon/preflight.py`, and `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/src/daemon/server.py` carry the backend/protocol changes.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/dashboard/index.html` and `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/dashboard/dashboard.js` carry the Auto-Connect UI/run-payload changes.

Context files to update:

1. `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/PLAN.md` should be updated. Its embedded Now section is stale: it still says the current focus is May public-beta first-run readiness, with `Last modified: 2026-05-25`. Replace that with the MCP-native completed-task summary, files touched, verification already passed, live-smoke artifact, and current next action. This is task-local/session progress, so it belongs in PLAN.
2. `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/NOW.md` is already the best current handoff. If performing the maintenance for real, refresh only if needed to preserve the same current focus, blockers, next step, verification, and touched-files list after the PLAN update.
3. `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/CONTEXT.md` already contains the durable learned pattern: Chrome DevTools MCP can drive an existing logged-in Chrome tab through a minimal native backend; selected MCP tabs are sensitive real-browser access; the action allowlist must stay narrow. Do not add noisy task details there. Only refine CONTEXT if maintainers want a durable relationship/invariant spelling out that MCP-selected tabs are an accepted alternative to CDP work windows in the preflight/run protocol.
4. `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/AGENTS.md` should not be hand-edited. After any CONTEXT/PLAN/NOW maintenance, run the index update so generated cards/indexes reflect the final context state.

# Active blockers or uncertainty

- A supervised real Amex beta smoke still needs a tester present for login/MFA and explicit send/approval moments.
- Local macOS desktop artifacts are intentionally unsigned; beta update copy must describe manual GitHub release download/replacement, not automatic in-place update.
- `v1.0.1` is not update-checking capable; `v1.0.2` is the first update-checking unsigned baseline.
- The currently running packaged app/helper will not contain Connect Existing Chrome, Auto-Connect Existing Chrome, or MCP-native runs until rebuilt and relaunched.
- MCP-native mode is intentionally minimal and not browser-use parity; keep the action allowlist narrow and prefer mock/local verification before real authenticated customer-service actions.
- The eval repo copy is nested inside the parent `/Users/lfan/Project/context-harness` Git repository; `git -C <eval repo> status` climbs to the parent repo and is not reliable evidence for this repo copy's source state.
- Context-harness follow-up: PLAN-derived cards selected by hydrate are stale because PLAN itself is stale; update PLAN and regenerate the index/cards.

# Immediate next step

Update `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/PLAN.md` so its current focus, blockers, immediate next step, and session state match the completed MCP-native existing-Chrome work already summarized in NOW.md. Then run `node scripts/context-index.js update` from the repo copy and verify the regenerated cards no longer point to the stale May first-run-readiness session state.

# Relevant files

Context/harness files:

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/NOW.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/CONTEXT.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/PLAN.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/AGENTS.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/.context-harness/cards/ctx-plan-session-state.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/.context-harness/cards/ctx-context-learned-patterns.md`

Implementation/test files that justify the context update:

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/src/agent/chrome_devtools_mcp.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/src/agent/mcp_executor.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/src/agent/brain.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/src/agent/run_orchestration.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/src/daemon/preflight.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/src/daemon/server.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/dashboard/index.html`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/dashboard/dashboard.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/tests/unit/test_chrome_devtools_mcp.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/tests/unit/test_mcp_executor.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/tests/unit/test_run_orchestration.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/tests/unit/test_daemon_server.py`

# Verification command/check

For context maintenance itself:

```sh
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo" && node scripts/context-index.js update
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo" && node scripts/context-index.js hydrate "update context after completed task"
```

The hydrate output should no longer select a stale `PLAN.md#session-state` card with `Last modified: 2026-05-25` as the active task-local state.

For the completed MCP task, preserve/rerun the relevant verification set before release or beta handoff:

```sh
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo" && pytest tests/unit/test_chrome_devtools_mcp.py tests/unit/test_mcp_executor.py tests/unit/test_run_orchestration.py tests/unit/test_daemon_server.py -q
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo" && node --check dashboard/dashboard.js
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo" && node --check scripts/test_helper_dashboard.mjs
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo" && node scripts/test_dashboard_protocol.mjs
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo" && npm run test:dashboard
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo" && pytest tests/unit -q
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo" && ruff check src tests
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo" && git diff --check
```

Also keep the already-recorded live smoke evidence in context: Chrome DevTools MCP listed existing tabs, a safe local CLIProxy tab was selected, `take_snapshot` then `report_outcome` succeeded, and the artifact was `/tmp/flyingpig-mcp-smoke/mcp_session_20260706_041301.json`. The next manual smoke should use a local/mock page through Auto-Connect Existing Chrome before any real authenticated Amex flow.

# Context Evidence

1. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/prompt.md`.
2. Listed `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo` and its `.context-harness` directory.
3. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/NOW.md` first.
4. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/CONTEXT.md` directly because it is concise enough for the always-read layer.
5. Ran `node scripts/context-index.js hydrate "update context after completed task"` from the repo copy. Hydrate selected cards: `ctx-now-now`, `ctx-plan-findings`, `ctx-plan-active-blockers`, `ctx-plan-session-state`, `ctx-context-learned-patterns`, `ctx-context-operating-constraints`, `ctx-context-workflow`.
6. Read selected cards before raw PLAN/chunks: `ctx-plan-active-blockers`, `ctx-plan-session-state`, `ctx-context-learned-patterns`, `ctx-context-workflow`, `ctx-now-now`.
7. Located PLAN headings, then read only `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/PLAN.md` lines 385-405, confirming stale current focus/session state.
8. Checked `git -C <eval repo> status --short`; discarded as repo-state evidence because the eval repo is nested and Git climbed to parent `/Users/lfan/Project/context-harness`.
9. Confirmed the Git root with `git -C <eval repo> rev-parse --show-toplevel --show-prefix`.
10. Listed targeted MCP source/test files under `src/agent` and `tests/unit`.
11. Read targeted implementation/test files: `src/agent/chrome_devtools_mcp.py`, `src/agent/mcp_executor.py`, `src/agent/run_orchestration.py`, `tests/unit/test_mcp_executor.py`, `src/daemon/preflight.py`, `tests/unit/test_run_orchestration.py`, `src/daemon/server.py`, `tests/unit/test_daemon_server.py`, `dashboard/dashboard.js`, and `src/agent/brain.py`.
12. Grepped targeted daemon/dashboard/test paths for `browser_backend`, `mcp_page`, Auto-Connect, Existing Chrome, and MCP references.
13. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__progressive-harness/repo/AGENTS.md` to confirm the context contract and index update rule.

# Confidence and why

High. NOW.md and CONTEXT.md already describe the completed MCP-native work and durable safety lesson, while PLAN.md and its selected session-state card are plainly stale. The implementation excerpts confirm the exact backend, preflight, dashboard, and test surfaces involved. The main caveat is that I did not run verification tests because this eval requested a read-only decision and source files must not be edited; I used existing recorded verification from NOW plus read-only inspection.