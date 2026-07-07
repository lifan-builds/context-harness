# Current understanding

The completed task is the minimal MCP-native existing-Chrome backend for Flying Pig. The flat context says Flying Pig can now Auto-Connect to an existing Chrome tab via Chrome DevTools MCP, carry `browser_backend` and `mcp_page` in run payloads, accept MCP-selected tabs in preflight, route MCP runs from `AgentBrain` to `McpBrowserExecutor`, and let the dashboard treat MCP-selected tabs as runnable without CDP status checks.

Context maintenance should update only the flat markdown files:

- `NOW.md`: closeout/current-session state. It should summarize the completed MCP-native flow, current blockers, immediate next step, verification that passed, live-smoke artifact, and touched files.
- `PLAN.md`: task-local implementation findings and evidence. It should keep the detailed Chrome DevTools MCP section with the endpoints/backend behavior, dashboard behavior, executor allowlist, test commands, and live smoke result. It should also keep remaining beta/manual-smoke items visible.
- `CONTEXT.md`: durable project knowledge only. It should contain the durable MCP lesson: Chrome DevTools MCP can inspect/control user-selected existing Chrome tabs after permission, but this is sensitive real-browser access, intentionally minimal, and must keep a narrow allowlist. It should not duplicate all implementation details from `PLAN.md`.
- `AGENTS.md`: small activation/index layer only. If `CONTEXT.md` changes, refresh the context index with `node scripts/context-index.js update`; do not add detailed session notes here.

# Active blockers or uncertainty

- A supervised real Amex beta smoke still needs a tester present for login/MFA and explicit send/approval moments.
- Local macOS desktop artifacts are intentionally unsigned.
- Desktop update copy must describe manual GitHub release download/replacement, not automatic in-place updates.
- Published `v1.0.1` is not update-checking capable; `v1.0.2` is the first update-checking baseline.
- The currently running packaged app will not include Connect Existing Chrome, Auto-Connect Existing Chrome, or MCP-native run flows until the desktop app/helper are rebuilt and relaunched.
- MCP-native mode is not browser-use parity; keep the action allowlist narrow and prefer local/mock verification before real authenticated customer-service actions.
- I did not inspect source diffs because this eval asked for context-file decisions and forbids editing repository source files.

# Immediate next step

If continuing implementation, run a source dashboard/manual smoke against a local mock page using Auto-Connect Existing Chrome and start a harmless MCP task from the UI. If preparing for beta, rebuild/repackage the desktop app/helper so the packaged app includes the MCP-native flow.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__flat-harness/repo/NOW.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__flat-harness/repo/PLAN.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__flat-harness/repo/CONTEXT.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__flat-harness/repo/AGENTS.md`
- Implementation/test files named by `NOW.md`: `src/agent/chrome_devtools_mcp.py`, `src/agent/mcp_executor.py`, `src/agent/brain.py`, `src/agent/run_orchestration.py`, `src/daemon/preflight.py`, `src/daemon/server.py`, `dashboard/index.html`, `dashboard/dashboard.js`, `dashboard/dashboard.css`, `tests/unit/test_chrome_devtools_mcp.py`, `tests/unit/test_mcp_executor.py`, `tests/unit/test_run_orchestration.py`, `tests/unit/test_daemon_server.py`, `tests/support/dashboard_daemon.py`, `scripts/test_helper_dashboard.mjs`.

# Verification command/check

For the source task evidence already recorded in the flat context, preserve these verification commands as the closeout baseline:

```sh
pytest tests/unit/test_mcp_executor.py tests/unit/test_run_orchestration.py tests/unit/test_daemon_server.py -q
node --check dashboard/dashboard.js
node --check scripts/test_helper_dashboard.mjs
node scripts/test_dashboard_protocol.mjs
npm run test:dashboard
pytest tests/unit -q
ruff check src tests
git diff --check
```

For context-maintenance edits specifically, run:

```sh
node scripts/context-index.js update
git diff --check
```

The next behavioral check should be a local/mock dashboard smoke through Auto-Connect Existing Chrome, followed by rebuilding/relaunching the desktop helper/app before beta use.

# Context Evidence

- `NOW.md` says the current focus is the completed minimal MCP-native existing-Chrome backend and lists exact backend/dashboard behavior.
- `NOW.md` lists active blockers: real Amex smoke, unsigned beta artifacts, manual update wording, `v1.0.1` not update-capable, packaged app needing rebuild/relaunch, and MCP-native minimal-mode caution.
- `NOW.md` records passed verification and the live MCP smoke artifact `/tmp/flyingpig-mcp-smoke/mcp_session_20260706_041301.json`.
- `PLAN.md` section `2026-07-05 Chrome DevTools MCP auto-connect` contains the task-local implementation and verification history, including MCP endpoints, dashboard Auto-Connect behavior, executor allowlist, MCP-native run payloads, focused/full checks, and the safe local live smoke.
- `CONTEXT.md` `Learned Patterns` contains the durable MCP lesson and safety posture.
- `AGENTS.md` says task-local findings and decisions belong in `PLAN.md`, durable lessons in `CONTEXT.md`, `NOW.md` must be updated before ending, and `AGENTS.md` should remain the small activation/index layer.

# Confidence and why

High. The required flat files are present and consistent: `NOW.md` gives the current closeout state, `PLAN.md` holds the detailed task evidence, `CONTEXT.md` already captures the durable MCP lesson, and `AGENTS.md` defines the routing contract for where updates belong. The main uncertainty is operational, not contextual: the real Amex smoke and packaged-app rebuild still require later human/runtime action.