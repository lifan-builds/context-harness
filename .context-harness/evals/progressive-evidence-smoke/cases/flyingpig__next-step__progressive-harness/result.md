# Current understanding

Flying Pig’s active work is the new MCP-native existing-Chrome path. The source repo has already implemented a minimal backend where Auto-Connect Existing Chrome can inspect/select an existing Chrome tab through Chrome DevTools MCP, dashboard run payloads carry `browser_backend` and `mcp_page`, preflight accepts MCP-selected tabs without a CDP URL, and `AgentBrain` routes `browser_backend="mcp"` to `McpBrowserExecutor`.

The best next implementation/closeout step is not another source refactor; it is a source-dashboard manual smoke on a harmless local mock page using the real Auto-Connect Existing Chrome flow, followed by packaging only if that source smoke passes. Existing automated coverage already exercises a mock MCP-native dashboard path in `scripts/test_helper_dashboard.mjs`, but the active note calls out a source dashboard/manual smoke as the missing confidence step before beta packaging.

# Active blockers or uncertainty

- Real Amex beta smoke is still blocked on a tester being present for login/MFA and explicit approval/send moments.
- The currently running packaged app/helper will not contain the new Connect Existing Chrome, Auto-Connect Existing Chrome, or MCP-native flow until rebuilt and relaunched.
- MCP-native mode is intentionally minimal and should stay on a narrow allowlist; it is not browser-use parity and should be tested first on local/mock pages, not authenticated customer-service pages.
- Context harness note: the hydrate-selected `ctx-plan-immediate-next-step` card appears stale versus `NOW.md` and raw `PLAN.md`; `NOW.md` and current raw PLAN findings are more specific to the MCP-native work.

# Immediate next step

Run a source-dashboard manual smoke against a local mock page:

1. Start the source helper/dashboard rather than the packaged app, so the latest MCP-native code is active.
2. Open a harmless local mock page, e.g. the mock Amex server page used by dashboard smoke tooling.
3. In the dashboard, use **Auto-Connect Existing Chrome**.
4. Select the mock/local Chrome tab, preferably one without private user data.
5. Confirm the dashboard marks the selected tab as `Work Window Connected` in MCP mode even without CDP handoff.
6. Start a harmless MCP task whose expected behavior is snapshot/report-only or otherwise non-destructive.
7. Confirm the run completes and writes a bounded MCP session artifact, with no private tab content captured beyond the selected mock/local page.
8. Only after that passes, rebuild/repackage the desktop app/helper so the packaged beta includes the MCP-native flow.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/NOW.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/PLAN.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/dashboard/index.html`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/dashboard/dashboard.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/src/agent/chrome_devtools_mcp.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/src/agent/mcp_executor.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/src/agent/brain.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/src/agent/run_orchestration.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/src/daemon/preflight.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/src/daemon/server.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/tests/support/dashboard_daemon.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/scripts/test_helper_dashboard.mjs`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/package.json`

# Verification command/check

Recommended automated checks before/around the manual source smoke:

```sh
cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo
pytest tests/unit/test_mcp_executor.py tests/unit/test_run_orchestration.py tests/unit/test_daemon_server.py -q
node --check dashboard/dashboard.js
node --check scripts/test_helper_dashboard.mjs
npm run test:dashboard
ruff check src tests
git diff --check
```

Manual smoke acceptance checks:

- Auto-Connect Existing Chrome lists existing pages and warns about real-tab access.
- Selecting the local/mock tab returns MCP readiness and sets Work Window Connected.
- Starting the task sends `browser_backend: "mcp"` and an `mcp_page` payload.
- Start/HUCA do not require `/browser/status` CDP checks while in MCP mode.
- The run performs only safe MCP actions and finishes through `report_outcome` or an equivalent harmless outcome.
- The artifact is bounded and contains only mock/local-page evidence.

If preparing beta after the source smoke passes, run:

```sh
cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo
npm run build:helper
npm run desktop:package
```

Then relaunch the packaged app and repeat a shorter Auto-Connect smoke to ensure the sidecar/app bundle includes the new MCP-native flow.

# Context Evidence

1. Read eval prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/prompt.md`.
2. Read always-read layer first: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/NOW.md`.
3. Checked concise context size with `wc -l .../repo/CONTEXT.md`; result was 220 lines, so direct read was reasonable.
4. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/CONTEXT.md`.
5. Accidentally ran `node scripts/context-index.js hydrate "plan next implementation step"` from the session default directory; discarded that output and reran correctly in the eval repo copy.
6. Correct hydrate command in repo copy: `cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo && node scripts/context-index.js hydrate "plan next implementation step"`.
7. Correct hydrate selected cards: `ctx-plan-immediate-next-step`, `ctx-plan-progress`, `ctx-plan-long-running-coding-agent-task-pine-informed-product-protocol-hardening`, `ctx-plan-session-state`, `ctx-plan-active-blockers`, `ctx-plan-archive`, `ctx-plan-current-focus`.
8. Opened selected card files: `ctx-plan-immediate-next-step.md`, `ctx-plan-current-focus.md`, `ctx-plan-active-blockers.md`, `ctx-plan-progress.md`.
9. Opened raw `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/PLAN.md` because selected PLAN cards conflicted with current `NOW.md`.
10. Grepped for MCP implementation references: `Auto-Connect Existing Chrome`, `browser_backend`, `mcp_page`, `McpBrowserExecutor`.
11. Grepped package/tests/scripts for relevant verification commands and MCP dashboard coverage.
12. Checked git root/status and found the eval copy is nested under `/Users/lfan/Project/context-harness`, so parent-repo git status is not a clean source of eval-copy state.
13. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/package.json`.
14. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/tests/support/dashboard_daemon.py` around MCP mock endpoints.
15. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/scripts/test_helper_dashboard.mjs` around dashboard smoke setup and MCP flow.
16. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__progressive-harness/repo/dashboard/dashboard.js` around Auto-Connect, MCP tab selection, and MCP browser-status behavior.

# Confidence and why

High confidence. `NOW.md` and raw `PLAN.md` agree that MCP-native support has just landed and that the next useful step is a source-dashboard/manual smoke on a safe local page. Targeted source/test inspection confirms the implementation seams and existing mock dashboard coverage, while the blockers clearly separate safe local verification from real Amex beta smoke and packaging/release work.