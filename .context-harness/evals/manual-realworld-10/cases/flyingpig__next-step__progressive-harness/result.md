# Current understanding

The active work should continue with an implementation fix, not closeout. The packaged/desktop helper is healthy, but the Open Work Window flow is brittle around CDP endpoint ownership: normal Chrome can occupy `127.0.0.1:9222`, Flying Pig Chrome can fall back to `[::1]:9222`, and helper status collapses any requested endpoint back to `127.0.0.1:<port>`, so the dashboard reports Work Window Offline even when a debuggable work window exists.

The most important finding from code inspection is that the desktop shell has an environment override path, but it is not enough end-to-end:

- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/desktop/helper_supervisor.js` reads `FLYINGPIG_CDP_PORT` and passes `--cdp-port` to the helper.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/src/helper.py` uses `--cdp-port` only to print a dashboard endpoint and then calls `create_app()` with no configured CDP default.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/dashboard/dashboard.js` hard-codes `cdp_port: 9222` on launch and default/status URLs of `http://127.0.0.1:9222`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/src/daemon/server.py` parses only the port in `browser_status_payload()` and returns `http://127.0.0.1:<port>` regardless of the requested host.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/src/agent/browser_runtime.py` builds/debugs CDP endpoints as port-only `127.0.0.1` checks and launches Chrome without an explicit `--remote-debugging-address`.

# Active blockers or uncertainty

- The exact default alternate port needs a product choice. The observed manual workaround used `9335`; choosing an app-owned default like `9335` is the lowest-risk next step, while still honoring `FLYINGPIG_CDP_PORT` for overrides.
- Conflict owner reporting can be incremental: first detect “port occupied but not a valid Flying Pig CDP endpoint” with a clear recovery message; process-owner detail via `lsof` can be macOS-only follow-up if cross-platform support would broaden scope.
- The required `node scripts/context-index.js hydrate "plan next implementation step"` command is not supported by this repo’s script; it only supports `update|list|query|section|check`. I ran the required command, observed the failure, then used `query`/`section` to inspect the selected context sections.

# Immediate next step

Implement a narrow CDP endpoint ownership fix across helper backend, dashboard, and desktop shell:

1. Add a small CDP endpoint abstraction in `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/src/agent/browser_runtime.py` that preserves `host` and `port`, normalizes `localhost`/IPv6 bracket URLs safely, and lets `debugger_is_ready()`, `debugger_targets()`, `debugger_page_info()`, `wait_for_debugger()`, and `prepare_debugger_page()` operate on the requested endpoint instead of a port-only `127.0.0.1` assumption.
2. Extend `ChromeLaunchConfig` with `cdp_host` plus the existing port, launch Chrome with `--remote-debugging-address=<host>`, and return the normalized requested CDP URL. Prefer the app-owned default port, likely `9335`, unless `FLYINGPIG_CDP_PORT`/CLI config says otherwise.
3. Change `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/src/helper.py` and `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/src/daemon/server.py` so the helper’s configured CDP endpoint becomes the backend default for `/browser/status` and `/browser/launch`.
4. Change `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/dashboard/dashboard.js` to remove hard-coded `9222`: initialize the browser endpoint from the helper/backend default, preserve any user-entered host in the advanced endpoint field, and omit/pass the configured endpoint on launch instead of forcing `cdp_port: 9222`.
5. Add conflict handling: if the selected port is occupied but `/json/version` is unavailable or belongs to the wrong endpoint, return `connected:false` with copy that says the CDP port is already in use and suggests changing `FLYINGPIG_CDP_PORT` or closing the process using that port.
6. Add/update tests for the new default/override behavior and host preservation.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/src/agent/browser_runtime.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/src/daemon/server.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/src/helper.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/desktop/helper_supervisor.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/dashboard/dashboard.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/tests/unit/test_browser_runtime.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/tests/unit/test_daemon_server.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/desktop/helper_supervisor.test.mjs`
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__next-step__progressive-harness/repo/scripts/test_helper_dashboard.mjs`

# Verification command/check

Focused automated checks after the change:

```sh
ruff check src scripts tests
pytest tests/unit/test_browser_runtime.py tests/unit/test_daemon_server.py -q
node --check dashboard/dashboard.js
node --test desktop/helper_supervisor.test.mjs
node scripts/test_dashboard_protocol.mjs
npm run test:dashboard
npm run test:desktop
```

If practical, finish with:

```sh
pytest tests -q -m "not slow"
```

Manual/end-to-end checks:

1. Start the desktop/helper with `FLYINGPIG_CDP_PORT=9335`, click Open Work Window, and confirm the dashboard shows Work Window Connected with `http://127.0.0.1:9335`.
2. Query `/browser/status?cdp_url=http://localhost:9335` and confirm the response preserves the requested host semantics rather than rewriting to `127.0.0.1` incorrectly.
3. Reproduce a conflict by occupying `127.0.0.1:9222`, then verify the app either uses the alternate app-owned port or reports a clear port-conflict recovery message instead of silently showing generic Work Window Offline.

# Confidence and why

Confidence: high. `NOW.md`, `PLAN.md`, the CDP learned pattern, and direct code inspection all point to the same failure seam: defaults and status checks are split across desktop, helper, dashboard, and browser runtime, with several hard-coded `9222`/`127.0.0.1` assumptions. The proposed next step is narrow, testable, and aligned with the project rule that the helper/backend owns browser/CDP policy while the dashboard remains the control plane.
