# Current understanding

Flying Pig AI is currently focused on the newly implemented minimal MCP-native existing-Chrome backend. The app can Auto-Connect to an existing Chrome tab through Chrome DevTools MCP, pass `browser_backend` and `mcp_page` through run payloads, accept MCP-selected tabs in preflight, route MCP runs from `AgentBrain` to `McpBrowserExecutor`, and let the dashboard start MCP-selected tabs without CDP status checks. Product direction remains desktop-first: the Electron desktop app starts/supervises the Python helper, which serves the dashboard and owns browser-use/MCP execution, browser policy, LLM calls, run state, and evidence.

# Active blockers or uncertainty

- Supervised real Amex beta smoke still requires a tester present for login/MFA and explicit send/approval moments.
- Local macOS desktop artifacts are intentionally unsigned for the no-pay beta path.
- Updates must be described as manual GitHub release downloads/replacements, not automatic in-place updates.
- Published `v1.0.1` is not update-checking capable; `v1.0.2` is the first unsigned update-checking baseline.
- The currently running packaged app will not include Connect Existing Chrome, Auto-Connect Existing Chrome, or MCP-native run flows until the desktop app/helper are rebuilt and relaunched.
- MCP-native mode is intentionally minimal and not browser-use parity; keep the MCP action allowlist narrow and prefer local/mock verification before real authenticated customer-service actions.

# Immediate next step

If continuing implementation, run a source dashboard/manual smoke against a local mock page using **Auto-Connect Existing Chrome** and start a harmless MCP task from the UI. If preparing for beta, rebuild/repackage the desktop app/helper so the packaged app includes the MCP-native flow.

# Relevant files

Context files read:
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__flat-harness/repo/NOW.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__flat-harness/repo/CONTEXT.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__flat-harness/repo/AGENTS.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__flat-harness/repo/PLAN.md`

Implementation files called out by the flat context as relevant/touched:
- `src/agent/chrome_devtools_mcp.py`
- `src/agent/mcp_executor.py`
- `src/agent/brain.py`
- `src/agent/run_orchestration.py`
- `src/daemon/preflight.py`
- `src/daemon/server.py`
- `dashboard/index.html`
- `dashboard/dashboard.js`
- `dashboard/dashboard.css`
- `tests/unit/test_chrome_devtools_mcp.py`
- `tests/unit/test_mcp_executor.py`
- `tests/unit/test_run_orchestration.py`
- `tests/unit/test_daemon_server.py`
- `tests/support/dashboard_daemon.py`
- `scripts/test_helper_dashboard.mjs`

# Verification command/check

Most relevant verification command for the current MCP-native backend:

```bash
pytest tests/unit/test_mcp_executor.py tests/unit/test_run_orchestration.py tests/unit/test_daemon_server.py -q
```

Recorded broader verification from the flat context:

```bash
node --check dashboard/dashboard.js
node --check scripts/test_helper_dashboard.mjs
node scripts/test_dashboard_protocol.mjs
npm run test:dashboard
pytest tests/unit -q
ruff check src tests
git diff --check
```

The context also records a minimal live MCP-native smoke where Chrome DevTools MCP listed 7 existing tabs, selected a safe local CLIProxy tab, ran `take_snapshot` then `report_outcome`, returned `success`, and wrote `/tmp/flyingpig-mcp-smoke/mcp_session_20260706_041301.json`.

# Context Evidence

- `NOW.md` states the current focus is the minimal MCP-native existing-Chrome backend and describes the run payload, preflight, `AgentBrain`, executor, and dashboard changes.
- `NOW.md` lists the active blockers, including the real Amex tester requirement, unsigned macOS artifacts, update-baseline caveats, packaged-app rebuild requirement, and MCP-native minimal/parity warning.
- `NOW.md` gives the immediate next step: source dashboard/manual smoke with Auto-Connect Existing Chrome against a local mock page, or rebuild/repackage for beta.
- `NOW.md` records verification passed and the live MCP smoke artifact.
- `CONTEXT.md` defines the project, repo structure, operating constraints, workflow, and durable product relationships, including the desktop-first product path and helper/runtime ownership.
- `CONTEXT.md` learned patterns include the new Chrome DevTools MCP existing-Chrome path and its caution to treat selected MCP tabs as sensitive real-browser access.
- `PLAN.md` section `2026-07-05 Chrome DevTools MCP auto-connect` records the MCP implementation details, tests, runnable backend, dashboard MCP behavior, and successful minimal live MCP-native smoke.

# Confidence and why

High. The current focus, blockers, next step, touched files, and verification commands are explicitly stated in `NOW.md`, and the MCP-specific implementation and smoke evidence are corroborated by the latest relevant `PLAN.md` section. `CONTEXT.md` supports the broader product constraints and architecture boundaries.