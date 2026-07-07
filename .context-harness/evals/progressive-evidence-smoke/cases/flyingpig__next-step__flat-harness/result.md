## Current understanding

The active work is at the closeout/validation point for a minimal MCP-native Existing Chrome backend. Source support is already implemented: the helper can auto-connect to Chrome DevTools MCP, list/select existing tabs, accept an MCP-selected tab through preflight without a CDP URL, route `browser_backend="mcp"` runs through `McpBrowserExecutor`, and mark MCP-selected tabs runnable in the dashboard. Automated checks and a minimal live MCP smoke have passed, but the currently running packaged desktop app will not include these flows until the helper/app are rebuilt and relaunched.

## Active blockers or uncertainty

- A supervised real Amex beta smoke still requires a tester present for login/MFA and explicit send/approval moments.
- The local macOS desktop artifacts are intentionally unsigned for the no-pay beta path.
- Updates must be described as manual GitHub release downloads/replacements, not in-place auto-update.
- `v1.0.1` is not update-checking capable; `v1.0.2` is the first unsigned update-checking baseline.
- MCP-native mode is deliberately minimal and not browser-use parity; keep the action allowlist narrow and validate on a local/mock page before real authenticated customer-service actions.
- The packaged app/helper are stale relative to the new Connect Existing Chrome, Auto-Connect Existing Chrome, and MCP-native run flows until rebuilt.

## Immediate next step

Run a source dashboard/manual smoke against a harmless local mock page using **Auto-Connect Existing Chrome**, then start a harmless MCP-backed task from the UI. Confirm that the dashboard selects the existing tab, starts with `browser_backend: "mcp"`, skips CDP status checks, executes only safe MCP actions, returns a normal result, and writes a bounded MCP session artifact. If that passes and the goal is beta distribution rather than more implementation, rebuild/repackage the desktop app/helper so the packaged app includes the MCP-native flow.

## Relevant files

Context files used for planning:
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/NOW.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/CONTEXT.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/AGENTS.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/PLAN.md`

Implementation/verification files to inspect if continuing after this read-only eval:
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/src/agent/chrome_devtools_mcp.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/src/agent/mcp_executor.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/src/agent/brain.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/src/agent/run_orchestration.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/src/daemon/preflight.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/src/daemon/server.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/dashboard/index.html`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/dashboard/dashboard.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/dashboard/dashboard.css`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/tests/unit/test_mcp_executor.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/tests/unit/test_run_orchestration.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/tests/unit/test_daemon_server.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/scripts/test_helper_dashboard.mjs`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__flat-harness/repo/scripts/test_dashboard_protocol.mjs`

## Verification command/check

For the immediate source validation:
- Launch the source app/helper/dashboard path, open a safe local mock page in existing Chrome, use **Auto-Connect Existing Chrome**, select that mock tab, and start a harmless MCP task from the UI.
- Check that the run payload uses `browser_backend: "mcp"` with `mcp_page`, no CDP URL is required, the dashboard does not block on `/browser/status`, the executor performs only safe actions such as `take_snapshot` and `report_outcome`, and a bounded MCP artifact is written.

Regression commands to rerun around that smoke:
- `pytest tests/unit/test_mcp_executor.py tests/unit/test_run_orchestration.py tests/unit/test_daemon_server.py -q`
- `node --check dashboard/dashboard.js`
- `node --check scripts/test_helper_dashboard.mjs`
- `node scripts/test_dashboard_protocol.mjs`
- `npm run test:dashboard`
- `pytest tests/unit -q`
- `ruff check src tests`
- `git diff --check`

If the validation goal is beta packaging, follow with:
- `npm run build:helper`
- `npm run desktop:package`
- `npm run desktop:verify-update`

## Context Evidence

- `NOW.md` says the MCP-native existing-Chrome backend has been implemented and verified, and names the immediate next step as a source dashboard/manual smoke against a local mock page using Auto-Connect Existing Chrome, or rebuilding/repackaging for beta.
- `NOW.md` also records the active blockers: real Amex smoke needs a present tester, local macOS artifacts are unsigned, update language must be manual, `v1.0.1` is not update-capable, packaged app/helper are stale, and MCP-native mode should remain minimal.
- `PLAN.md` section `2026-07-05 Chrome DevTools MCP auto-connect` records the implemented helper-owned MCP auto-connect path, dashboard UI, MCP-native backend, allowed action set, automated verification, and minimal live smoke artifact `/tmp/flyingpig-mcp-smoke/mcp_session_20260706_041301.json`.
- `PLAN.md` section `2026-07-05 Installed work-window CDP conflict` explains why the Existing Chrome/MCP path matters: CDP host/port conflicts can make the work window appear offline, while direct Chrome debugging/MCP inspection remains viable.
- `CONTEXT.md` confirms the product architecture: Electron desktop is the normal user-facing path, while helper/dashboard own browser-use execution, browser policy, LLM calls, run state, and evidence.
- `AGENTS.md` requires using `NOW.md` first and relevant `CONTEXT.md` sections before planning; this eval followed that flat-file context path.

## Confidence and why

High. The next step is explicitly stated in `NOW.md` and is supported by the latest `PLAN.md` findings and verification evidence. The remaining uncertainty is not about what to do next, but whether the next operator is continuing source validation or preparing a beta package; the safe ordering is to run the local/mock MCP dashboard smoke first, then rebuild/package if it passes.
