## Current understanding

Flying Pig is focused on making the desktop/dashboard path able to connect to a user's existing Chrome session. The latest source work adds an **Auto-Connect Existing Chrome** flow through a helper-owned Chrome DevTools MCP bridge: the helper starts `chrome-devtools-mcp@latest --autoConnect`, lists real Chrome tabs after the user enables `chrome://inspect/#remote-debugging`, snapshots the selected tab, and only marks browser-use ready when it can obtain a compatible CDP handoff URL. The dashboard now has this flow alongside explicit CDP attach and Open Work Window.

The current user-facing target is not more source editing; it is rebuilding/running the updated helper/app and verifying the flow from the actual UI.

## Active blockers or uncertainty

- A supervised real Amex beta smoke still requires a tester present for login/MFA and explicit send/approval moments.
- Local macOS desktop artifacts are intentionally unsigned for the no-pay beta path.
- Update behavior must be described as manual GitHub release downloads/replacements, not automatic in-place updates. Published `v1.0.1` is not update-checking capable; `v1.0.2` is the first unsigned beta update-checking baseline.
- Any currently running packaged app will not include the new Connect Existing Chrome / Auto-Connect Existing Chrome flows until the desktop app/helper are rebuilt and relaunched.
- MCP auto-connect can inspect existing Chrome tabs, but browser-use execution still requires a CDP handoff URL unless a future MCP-native browser backend is added.
- Context-harness follow-up: the required `node scripts/context-index.js hydrate "resume current task"` command is stale/broken in this repo copy; it exits with usage for `[update|list|query|section|check]`. I used `node scripts/context-index.js query "resume current task"` afterward, which selected `CONTEXT.md#learned-patterns` and `CONTEXT.md#context-contract`, but `section CONTEXT.md#learned-patterns` also failed with `Section not found`.

## Immediate next step

Rebuild/repackage or run the source helper/app, then verify from the actual UI:

1. Open Chrome.
2. Visit `chrome://inspect/#remote-debugging` and allow remote debugging.
3. Open the updated Flying Pig dashboard.
4. Click **Auto-Connect Existing Chrome**.
5. Select a non-sensitive tab.
6. Confirm the dashboard either marks **Work Window Connected** through a CDP handoff URL or clearly reports MCP inspection-only mode.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__progressive-harness/repo/NOW.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__progressive-harness/repo/PLAN.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__progressive-harness/repo/CONTEXT.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__progressive-harness/repo/src/agent/chrome_devtools_mcp.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__progressive-harness/repo/src/daemon/server.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__progressive-harness/repo/dashboard/index.html`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__progressive-harness/repo/dashboard/dashboard.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__progressive-harness/repo/dashboard/dashboard.css`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__progressive-harness/repo/tests/unit/test_chrome_devtools_mcp.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__progressive-harness/repo/tests/unit/test_daemon_server.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__progressive-harness/repo/tests/support/dashboard_daemon.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__progressive-harness/repo/scripts/test_helper_dashboard.mjs`

## Verification command/check

Previously recorded verification for the source changes:

```sh
ruff check src tests && \
pytest tests/unit/test_chrome_devtools_mcp.py tests/unit/test_daemon_server.py -q && \
pytest tests/unit -q && \
node scripts/test_dashboard_protocol.mjs && \
npm run test:dashboard && \
node --check dashboard/dashboard.js scripts/test_helper_dashboard.mjs && \
git diff --check
```

For the immediate next step, also rebuild/run the app with the updated helper and perform the manual UI smoke described above. Relevant workflow commands are `npm run build:helper`, `npm run desktop:dev`, and, for packaged verification, `npm run desktop:package`.

## Confidence and why

High for the current focus and next step because `NOW.md` is fresh and explicit, and `PLAN.md` records the 2026-07-05 MCP auto-connect implementation plus the exact passed verification commands. Medium for deeper implementation details because this read-only catch-up did not inspect every changed source file and the context-index hydrate/section commands appear stale in this repo copy.
