# Fresh Agent Eval Result: flyingpig / next-step / progressive-harness

## Current understanding
- Active work is past the source-implementation phase: Flying Pig now has a helper-owned Chrome DevTools MCP auto-connect path for existing Chrome tabs, alongside explicit CDP attach and Open Work Window.
- The next step should be closeout verification, not more source work, unless the real UI smoke exposes a bug. `NOW.md` says the running packaged app will not include the new Connect Existing Chrome / Auto-Connect Existing Chrome flows until the helper/app are rebuilt and relaunched.
- The runtime boundary still matters: MCP can inspect user-selected real Chrome tabs after `chrome://inspect/#remote-debugging` permission, but browser-use can only run when a usable CDP handoff URL is available. If no CDP handoff is exposed, the UI must clearly show inspection-only mode.
- Context-harness drift/follow-up: the required command `node scripts/context-index.js hydrate "plan next implementation step"` failed because this repo's `scripts/context-index.js` supports only `[update|list|query|section|check]`. `node scripts/context-index.js query "plan next implementation step"` returned no matching `CONTEXT.md` sections, so I used the `AGENTS.md` index/list output to read only relevant context sections. This does not block the read-only planning task, but context-index command docs should be repaired later.

## Active blockers or uncertainty
- A supervised real Amex beta smoke still needs a human tester present for login/MFA and explicit approval moments.
- Unsigned macOS beta artifacts are expected for the no-pay beta path; update UX must describe manual GitHub release download/replacement, not in-place auto-update.
- Published `v1.0.1` cannot be treated as update-checking capable; `v1.0.2` is the first update-checking baseline.
- Real-browser behavior is still uncertain until the rebuilt/relaunched desktop app or source helper is exercised against an actual Chrome session with remote-debugging permission enabled.
- If the MCP-selected tab is inspection-only, the implementation should not mark browser-use ready or allow users to believe the agent can control that normal tab.

## Immediate next step
Run a closeout smoke from the actual UI:
1. Rebuild/relaunch the app path that will be tested: either source mode with `npm run desktop:dev`, or rebuild helper/package first with `npm run build:helper` and `npm run desktop:package` before launching the packaged app.
2. Open normal Chrome and visit `chrome://inspect/#remote-debugging`; allow remote debugging.
3. In the Flying Pig dashboard, click **Auto-Connect Existing Chrome**.
4. Select a deliberately non-sensitive tab from the real-tab picker.
5. Confirm one of two acceptable outcomes:
   - If the MCP page metadata exposes a browser-use-compatible CDP URL, the dashboard populates the CDP endpoint, marks **Work Window Connected**, and the normal browser-use run path can start from that selected surface.
   - If no CDP URL is available, the dashboard clearly reports MCP inspection-only mode / CDP handoff unavailable and does not present the tab as runnable.
6. Only if this smoke fails, inspect/fix the narrow failing seam: MCP client parsing, daemon endpoint payload, dashboard state/rendering, or desktop helper packaging.

## Relevant files
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__progressive-harness/repo/NOW.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__progressive-harness/repo/PLAN.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__progressive-harness/repo/CONTEXT.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__progressive-harness/repo/package.json`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__progressive-harness/repo/src/agent/chrome_devtools_mcp.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__progressive-harness/repo/src/daemon/server.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__progressive-harness/repo/dashboard/index.html`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__progressive-harness/repo/dashboard/dashboard.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__progressive-harness/repo/dashboard/dashboard.css`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__progressive-harness/repo/tests/unit/test_chrome_devtools_mcp.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__progressive-harness/repo/tests/unit/test_daemon_server.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__progressive-harness/repo/scripts/test_helper_dashboard.mjs`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__progressive-harness/repo/desktop/main.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__progressive-harness/repo/desktop/electron-builder.json`

## Verification command/check
- Automated regression set to rerun before closeout if source changed or packaging is refreshed:
  - `ruff check src tests`
  - `pytest tests/unit/test_chrome_devtools_mcp.py tests/unit/test_daemon_server.py -q`
  - `pytest tests/unit -q`
  - `node scripts/test_dashboard_protocol.mjs`
  - `npm run test:dashboard`
  - `node --check dashboard/dashboard.js scripts/test_helper_dashboard.mjs`
  - `git diff --check`
- Build/relaunch check for the UI smoke:
  - Source path: `npm run desktop:dev`
  - Packaged path: `npm run build:helper && npm run desktop:package`, then launch the rebuilt app.
- Manual smoke acceptance check: with Chrome remote debugging permission enabled, **Auto-Connect Existing Chrome** lists tabs, selecting a non-sensitive tab verifies via MCP, and the dashboard either reaches **Work Window Connected** through a CDP handoff URL or shows a clear MCP-inspection-only blocked state.

## Confidence and why
Medium-high. `NOW.md` and `PLAN.md` agree that source implementation and automated unit/dashboard checks already landed, and the remaining risk is real rebuilt desktop/helper behavior with a user-authorized Chrome session. Confidence is not high because I did not run the desktop app or real Chrome smoke in this read-only eval, and the required `hydrate` context-index command is stale/broken.