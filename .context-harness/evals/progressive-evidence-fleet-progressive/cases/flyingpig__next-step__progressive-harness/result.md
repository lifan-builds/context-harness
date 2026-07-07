# Current understanding

The active implementation is a minimal MCP-native existing-Chrome backend. The source flow now lets the dashboard Auto-Connect to an existing Chrome tab via Chrome DevTools MCP, select a user-authorized tab, mark it runnable with `browser_backend: "mcp"`, skip CDP status checks, and route the run through `McpBrowserExecutor` instead of browser-use/CDP. Focused/unit/dashboard/lint checks and one safe live MCP executor smoke have already passed.

# Active blockers or uncertainty

- The main remaining closeout gap is an end-to-end source dashboard/manual smoke of the UI path: Auto-Connect Existing Chrome → select a safe local/mock tab → start a harmless MCP task from the dashboard.
- The currently running packaged app will not include this MCP-native flow until the desktop app/helper are rebuilt and relaunched.
- Real Amex beta smoke still needs a tester present for login/MFA and explicit approvals.
- MCP-native mode is intentionally narrower than browser-use parity; keep the action allowlist small and avoid real authenticated actions until local/mock UI smoke is clean.
- Context follow-up: hydrate-selected `ctx-plan-*` cards still surfaced older first-run/release-next-step summaries, while `NOW.md` and raw `PLAN.md` contain the newer MCP-native work. After closeout, regenerate/update plan cards or index state so retrieval does not steer agents to stale beta-release work.

# Immediate next step

Run a closeout source-dashboard smoke against the local mock Amex page using MCP mode, not a real customer account:

1. Start the mock page: `python tests/mock_amex/server.py` and open `http://127.0.0.1:8086/?logged_in=true` in normal Chrome.
2. Start the source app/helper: `npm run desktop:dev`.
3. In the dashboard, click **Auto-Connect Existing Chrome**, select only the mock Amex tab, and confirm the dashboard shows the tab as connected/runnable through MCP.
4. Start a harmless task such as: “Inspect this mock chat tab and report the visible chat state; do not send any message or click destructive controls.”
5. Confirm the run uses `browser_backend: "mcp"`, does not require a CDP URL, emits normal run/result state, writes an MCP artifact, and does not inspect unrelated Chrome tabs.

If that passes and beta packaging is the goal, then rebuild/repackage the helper and desktop app so testers get the MCP flow.

# Relevant files

- `NOW.md` — newest active state and next step.
- `PLAN.md` — MCP auto-connect and MCP-native implementation notes, especially lines around the 2026-07-05 sections.
- `src/agent/chrome_devtools_mcp.py` — helper-owned MCP stdio client/session, page parsing, select/snapshot behavior, and setup-error copy.
- `src/agent/mcp_executor.py` — bounded MCP planner/action loop, allowlist, artifact writing, and result shaping.
- `src/agent/brain.py` — routes `browser_backend == "mcp"` to `McpBrowserExecutor`.
- `src/agent/run_orchestration.py` — carries `browser_backend` and `mcp_page` from daemon payloads into `AgentBrain`.
- `src/daemon/preflight.py` and `src/daemon/server.py` — accept MCP-selected tabs as work-window readiness and expose `/browser/mcp/*` endpoints.
- `dashboard/index.html`, `dashboard/dashboard.js`, `dashboard/dashboard.css` — Auto-Connect UI, tab picker, start payload, readiness, and CDP-skip behavior.
- `tests/unit/test_mcp_executor.py`, `tests/unit/test_run_orchestration.py`, `tests/unit/test_daemon_server.py`, `tests/unit/test_chrome_devtools_mcp.py` — focused regression surface.
- `tests/mock_amex/server.py` — safe local page for the manual smoke.

# Verification command/check

Pre-closeout regression set:

```bash
pytest tests/unit/test_mcp_executor.py tests/unit/test_run_orchestration.py tests/unit/test_daemon_server.py -q
pytest tests/unit/test_chrome_devtools_mcp.py -q
node --check dashboard/dashboard.js
node --check scripts/test_helper_dashboard.mjs
node scripts/test_dashboard_protocol.mjs
npm run test:dashboard
ruff check src tests
git diff --check
```

Manual smoke acceptance:

- Auto-Connect lists existing tabs only after Chrome remote-debugging permission is available.
- Selecting the mock tab sets readiness without a CDP URL.
- Start sends `browser_backend: "mcp"` and the selected `mcp_page`.
- The run completes with a safe `report_outcome`, creates an `mcp_session_*.json` artifact, and does not click/type/send in the mock chat unless explicitly requested.

Packaging/beta follow-up after source smoke:

```bash
npm run build:helper
npm run desktop:package
npm run desktop:verify-update
```

Keep release copy clear that unsigned beta updates are manual GitHub release downloads/replacements, not in-place automatic updates.

# Context Evidence

1. Read `NOW.md` first: active focus is MCP-native existing-Chrome backend; immediate next step is source dashboard/manual smoke or rebuild/repackage for beta.
2. Read concise `CONTEXT.md`: product constraints, Desktop-First path, Pre-flight Safety Gate, Single Cockpit, MCP learned pattern, and no-secrets/no-PII rules.
3. Ran `node scripts/context-index.js hydrate "plan next implementation step"`: selected cards included `ctx-plan-immediate-next-step`, `ctx-plan-progress`, `ctx-plan-active-blockers`, `ctx-plan-current-focus`; these appeared partly stale versus `NOW.md`.
4. Opened selected cards before raw plan sections, then read `PLAN.md` because the card summaries were insufficient/stale for the current MCP work.
5. Inspected implementation seams in `src/agent/mcp_executor.py`, `src/agent/chrome_devtools_mcp.py`, `src/agent/brain.py`, `src/agent/run_orchestration.py`, `src/daemon/preflight.py`, `src/daemon/server.py`, `dashboard/dashboard.js`, and `tests/mock_amex/server.py`.
6. Used read-only searches/finds to locate MCP source/test files and dashboard references. A `git -C repo status/diff --stat` command reflected the outer eval harness repository rather than useful source-project status, so it was not used for conclusions.

# Confidence and why

High. `NOW.md` is newer and explicit, raw `PLAN.md` confirms the MCP-native implementation and verification history, and the inspected source files show the key route from dashboard payload to preflight, run plan, `AgentBrain`, and `McpBrowserExecutor`. The only uncertainty is UI-level behavior in a live source dashboard session, which is exactly the recommended next closeout check.