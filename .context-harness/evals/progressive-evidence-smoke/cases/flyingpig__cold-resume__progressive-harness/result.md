# Current understanding

Flying Pig AI is currently focused on a minimal MCP-native existing-Chrome backend. The project can Auto-Connect to an existing Chrome tab through Chrome DevTools MCP and run a minimal supervised backend without a browser-use/CDP handoff URL. Run payloads carry `browser_backend` and `mcp_page`; preflight accepts MCP-selected tabs; `AgentBrain` routes MCP runs to `McpBrowserExecutor`; and the dashboard marks MCP-selected tabs runnable while skipping CDP status checks for MCP starts.

The product direction remains desktop-first: the Electron desktop app supervises the packaged Python helper, the helper serves the dashboard and owns browser automation/LLM/runtime policy, and the dashboard is the single cockpit. Existing-Chrome MCP access is sensitive real-browser access, so the action allowlist should stay narrow and local/mock verification should precede real authenticated customer-service actions.

# Active blockers or uncertainty

- A supervised real Amex beta smoke still needs a tester present for login/MFA and explicit send/approval moments.
- Local macOS desktop artifacts are intentionally unsigned for the no-pay beta path.
- Update messaging must describe manual GitHub release download/replacement, not automatic in-place updates.
- `v1.0.1` is not update-checking capable; `v1.0.2` is the first unsigned beta update-checking baseline.
- The currently running packaged app will not include Connect Existing Chrome, Auto-Connect Existing Chrome, or MCP-native run flows until the desktop app/helper are rebuilt and relaunched.
- MCP-native mode is intentionally minimal and not browser-use parity; keep action scope narrow.
- Hydrate initially returned outer context-harness cards when run from the wrong working directory; rerunning from the eval repo produced the correct Flying Pig cards and is the context used here.

# Immediate next step

If continuing implementation, run a source dashboard/manual smoke against a local mock page using **Auto-Connect Existing Chrome**, then start a harmless MCP task from the UI. If preparing for beta, rebuild/repackage the desktop app/helper so the packaged app includes the MCP-native flow.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo/NOW.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo/CONTEXT.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo/AGENTS.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo/src/agent/chrome_devtools_mcp.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo/src/agent/mcp_executor.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo/src/agent/brain.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo/src/agent/run_orchestration.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo/src/daemon/preflight.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo/src/daemon/server.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo/dashboard/index.html`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo/dashboard/dashboard.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo/dashboard/dashboard.css`
- Tests named in current state: `tests/unit/test_chrome_devtools_mcp.py`, `tests/unit/test_mcp_executor.py`, `tests/unit/test_run_orchestration.py`, `tests/unit/test_daemon_server.py`, `tests/support/dashboard_daemon.py`, and `scripts/test_helper_dashboard.mjs`.

# Verification command/check

Current `NOW.md` reports these checks already passed: `pytest tests/unit/test_mcp_executor.py tests/unit/test_run_orchestration.py tests/unit/test_daemon_server.py -q` (30 passed), `node --check dashboard/dashboard.js`, `node --check scripts/test_helper_dashboard.mjs`, `node scripts/test_dashboard_protocol.mjs`, `npm run test:dashboard`, `pytest tests/unit -q` (132 passed), `ruff check src tests`, and `git diff --check`.

Recommended next verification for the immediate step: source dashboard/manual smoke against a local mock page using **Auto-Connect Existing Chrome**, starting a harmless MCP task from the UI. The last live smoke reported Chrome DevTools MCP `list_pages`, safe local CLIProxy tab selection, `take_snapshot`, `report_outcome`, and success with artifact `/tmp/flyingpig-mcp-smoke/mcp_session_20260706_041301.json`.

# Context Evidence

1. Read eval prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/prompt.md`.
2. Listed isolated repo root: `ls -la /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo`.
3. Read required first context file: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo/NOW.md`.
4. Read context contract/index: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo/AGENTS.md`.
5. Read concise always-read context: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo/CONTEXT.md`.
6. Ran hydrate once with absolute script path from the outer working directory; this returned outer context-harness cards and was ignored for conclusions.
7. Ran corrected hydrate from the eval repo: `cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo && node scripts/context-index.js hydrate "resume current task"`.
8. Correct hydrate selected card IDs: `ctx-context-context-contract` and `ctx-now-now`.
9. Read selected card: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo/.context-harness/cards/ctx-context-context-contract.md`.
10. Read selected card: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__progressive-harness/repo/.context-harness/cards/ctx-now-now.md`.
11. Did not open `PLAN.md` or raw chunks because corrected hydrate selected concise contract/NOW cards only and the already-read always-read layer was sufficient.

# Confidence and why

High. The answer is grounded in the required `NOW.md` first, `AGENTS.md` context contract/index, direct concise `CONTEXT.md`, and corrected hydrate-selected cards. No repository source files were edited, and no bulky context was opened because hydrate did not indicate it was needed for this resume report.
