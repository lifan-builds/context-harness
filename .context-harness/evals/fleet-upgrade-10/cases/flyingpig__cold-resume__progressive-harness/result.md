## Current understanding

Flying Pig is a desktop-first supervised customer-service automation app: Electron starts/supervises a Python helper, the helper serves the dashboard and owns browser-use/CDP/LLM execution, and the user prepares a visible Chrome work window/chat surface before the agent runs.

The current focus is the newly implemented Claude-Code-style **Auto-Connect Existing Chrome** path. The helper starts `npx -y chrome-devtools-mcp@latest --autoConnect`, lists existing normal Chrome tabs, lets the dashboard user choose a tab, then verifies MCP control with `select_page`/`take_snapshot`. A live smoke succeeded for listing 6 tabs and snapshotting a safe localhost tab. However, MCP did not expose a browser-use-compatible CDP handoff URL, so Flying Pig correctly reports inspection-only mode (`browser_ready:false`) rather than claiming it can run the browser-use agent in that normal Chrome tab.

There is also an explicit **Connect Existing Chrome** path for a user-provided CDP endpoint via `/browser/attach`, and the normal v1 product path remains the desktop app plus Controlled Chrome Window.

## Active blockers or uncertainty

- Full agent execution in an already-open normal Chrome tab is blocked unless MCP exposes a usable CDP endpoint or Flying Pig gets an MCP-native browser backend/adapter for the subset of browser-use actions it needs.
- The currently running packaged app does not include the new Connect Existing Chrome / Auto-Connect Existing Chrome flows until the desktop app/helper are rebuilt and relaunched.
- Supervised real Amex beta smoke still requires a tester present for login/MFA and explicit send/approval moments.
- Local macOS desktop artifacts are intentionally unsigned for the no-pay beta path.
- `v1.0.1` is not update-checking capable; `v1.0.2` is the first updater-capable unsigned beta baseline, and updates must be described as manual GitHub release downloads/replacements, not automatic in-place updates.

## Immediate next step

If the immediate goal is to verify the staged UI: rebuild/repackage or run the source helper/app, open the dashboard, click **Auto-Connect Existing Chrome**, select an authorized safe tab, and confirm the dashboard shows inspection-only unless a CDP handoff URL appears.

If the product goal is full agent execution inside a pre-existing normal Chrome tab without a CDP URL: implement an MCP-native browser backend/adapter or another explicit CDP handoff path before trying another real customer-service run through Auto-Connect.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__progressive-harness/repo/NOW.md` — freshest focus, blockers, smoke result, and touched files.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__progressive-harness/repo/PLAN.md` — detailed progress and verification history, especially the 2026-07-05 MCP section.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__progressive-harness/repo/CONTEXT.md` — product architecture, operating constraints, workflow, and learned pattern that MCP is currently inspection-only for browser-use unless a compatible CDP endpoint exists.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__progressive-harness/repo/src/agent/chrome_devtools_mcp.py` — MCP JSON-RPC client, page parsing, safe tab payloads, select/snapshot behavior, CDP handoff detection, and setup-error messages.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__progressive-harness/repo/src/daemon/server.py` — `/browser/attach`, `/browser/mcp/connect`, `/browser/mcp/pages`, and `/browser/mcp/select` endpoints.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__progressive-harness/repo/dashboard/index.html` — dashboard buttons and tab picker for Connect/Auto-Connect Existing Chrome.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__progressive-harness/repo/dashboard/dashboard.js` — dashboard MCP connect/select flow and UI behavior when CDP handoff is missing.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__progressive-harness/repo/tests/unit/test_chrome_devtools_mcp.py` and `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__progressive-harness/repo/tests/unit/test_daemon_server.py` — focused regression coverage for MCP parsing, errors, endpoint payloads, CDP handoff, and inspection-only behavior.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__progressive-harness/repo/scripts/test_helper_dashboard.mjs` and `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__progressive-harness/repo/scripts/test_dashboard_protocol.mjs` — dashboard/helper smoke checks.

## Verification command/check

From the repo copy root:

```sh
ruff check src tests && \
pytest tests/unit/test_chrome_devtools_mcp.py tests/unit/test_daemon_server.py -q && \
pytest tests/unit -q && \
node scripts/test_dashboard_protocol.mjs && \
npm run test:dashboard && \
node --check dashboard/dashboard.js scripts/test_helper_dashboard.mjs && \
git diff --check
```

For live/manual verification after rebuilding/running the source helper/app: use the dashboard **Auto-Connect Existing Chrome** flow with Chrome remote debugging permission enabled at `chrome://inspect/#remote-debugging`, select only a safe user-authorized tab, and verify that `take_snapshot` succeeds while the dashboard does not mark the Work Window Connected unless a real `cdp_url` is returned.

## Confidence and why

High. I followed the harness resume path (`NOW.md`, `AGENTS.md`, `node scripts/context-index.js hydrate "resume current task"`), then inspected the selected cards and the concrete implementation/test files. The status is consistent across `NOW.md`, `PLAN.md`, `CONTEXT.md`, daemon endpoints, dashboard code, and MCP tests. The only remaining uncertainty is product-directional: whether the next implementation should be MCP-native browser execution or another CDP handoff strategy.