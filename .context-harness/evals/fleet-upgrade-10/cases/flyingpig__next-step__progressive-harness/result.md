## Current understanding

The active work is the Chrome DevTools MCP-based **Auto-Connect Existing Chrome** path. The newer `NOW.md` and recent `PLAN.md` findings supersede the stale embedded 2026-05-25 `PLAN.md#Now` footer: source support has been implemented and minimally real-smoked, but the currently running packaged app will not include it until the helper/desktop app are rebuilt and relaunched.

The implemented path is staged correctly: the helper starts `npx -y chrome-devtools-mcp@latest --autoConnect`, lists existing Chrome tabs, lets the user select one, and snapshots it. In the real smoke, MCP could inspect a selected existing tab, but did **not** expose a browser-use-compatible CDP handoff URL. Therefore Flying Pig should treat this as inspect-only and block actual browser-use execution unless a CDP endpoint is present.

## Active blockers or uncertainty

- Full agent execution inside a normal already-open Chrome tab remains blocked without either a CDP handoff URL or an MCP-native browser backend/adapter for the browser-use actions Flying Pig needs.
- Public/tester smoke of the real Amex path still needs a tester present for login/MFA and explicit approval/checkpoint moments.
- The packaged desktop app/helper must be rebuilt before testers can exercise the new Auto-Connect flow.
- Auto-Connect depends on local `npx`/Node and Chrome remote-debugging permission via `chrome://inspect/#remote-debugging`; this may need release-note or setup copy if exposed to beta testers.
- Unsigned macOS beta constraints still apply: releases are manual GitHub download/replacement, not in-place auto-update; `v1.0.2` is the first update-checking baseline.
- Harness note: `NOW.md` is current, but `PLAN.md` still contains an older appended `# Now` section. Treat that as a follow-up context cleanup, not a blocker.

## Immediate next step

Close out the staged Auto-Connect UI before starting the larger MCP-native execution backend:

1. Run the source desktop/helper path and smoke **Auto-Connect Existing Chrome** from the dashboard against a safe, non-PII local tab.
2. Confirm the dashboard behavior in both cases:
   - if MCP exposes `cdp_url`, the CDP field is populated and Work Window becomes connected;
   - if MCP remains inspect-only, Start stays blocked with the explicit “needs a CDP endpoint” message.
3. Rebuild the helper sidecar and package the desktop app, then repeat the same dashboard smoke against the packaged app.
4. If packaged smoke passes, do the release-artifact scan and decide whether to publish the next unsigned beta. If the product goal is instead “run browser-use actions inside normal Chrome with no CDP URL,” open a new implementation task for an MCP-native browser backend/adapter rather than treating the current staged UI as complete execution support.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__next-step__progressive-harness/repo/NOW.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__next-step__progressive-harness/repo/PLAN.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__next-step__progressive-harness/repo/CONTEXT.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__next-step__progressive-harness/repo/src/agent/chrome_devtools_mcp.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__next-step__progressive-harness/repo/src/daemon/server.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__next-step__progressive-harness/repo/dashboard/index.html`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__next-step__progressive-harness/repo/dashboard/dashboard.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__next-step__progressive-harness/repo/tests/unit/test_chrome_devtools_mcp.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__next-step__progressive-harness/repo/tests/unit/test_daemon_server.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__next-step__progressive-harness/repo/scripts/test_helper_dashboard.mjs`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__next-step__progressive-harness/repo/package.json`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__next-step__progressive-harness/repo/desktop/electron-builder.json`

## Verification command/check

Read-only planning did not run the full suite. For the next coding/release owner, verify in this order:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__next-step__progressive-harness/repo
ruff check src tests
pytest tests/unit/test_chrome_devtools_mcp.py tests/unit/test_daemon_server.py -q
pytest tests/unit -q
node --check dashboard/dashboard.js scripts/test_helper_dashboard.mjs
node scripts/test_dashboard_protocol.mjs
npm run test:dashboard
npm run test:desktop
git diff --check
```

Source smoke:

```bash
npm run desktop:dev
```

Then, in the dashboard, grant Chrome remote debugging permission if needed, click **Auto-Connect Existing Chrome**, select only a safe local tab, and verify the status/message behavior described above.

Packaging/release-gate checks after source smoke passes:

```bash
npm run build:helper
npm run desktop:package
npm run desktop:verify-update
```

Before publishing, scan the packaged artifact for PII, API keys, credentials, tokens, cookies, logs, recordings, and user-specific account data.

## Confidence and why

Medium-high. `NOW.md`, recent `PLAN.md` findings, source files, and tests all agree on the implemented staged MCP Auto-Connect behavior and the remaining CDP/backend limitation. Confidence is not “high” only because the real MCP smoke reported no CDP handoff URL, so the next product decision depends on whether the goal is staged inspect/select UX or actual browser-use execution inside a normal existing Chrome tab.