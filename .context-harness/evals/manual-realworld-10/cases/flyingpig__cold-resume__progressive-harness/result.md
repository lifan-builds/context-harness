- Current understanding
  - The active work is the Flying Pig desktop app's Open Work Window failure in the packaged/local desktop path. The helper is healthy, but the work-window CDP path is blocked by a loopback/port conflict around port 9222: normal Chrome owns `127.0.0.1:9222`, while Flying Pig Chrome can fall back to `[::1]:9222`; helper/dashboard status collapses the endpoint back to `127.0.0.1`, so the UI reports Work Window Offline.
  - Product state is desktop-first: Electron starts/supervises the Python helper sidecar and loads the helper-served dashboard; browser-use/Playwright automation remains in the Python helper.
  - I followed the required context order: read `NOW.md`, then `AGENTS.md`, then attempted `node scripts/context-index.js hydrate "resume current task"`. That command is not supported by this repo copy's script (`update|list|query|section|check` only), so I used `node scripts/context-index.js query "resume current task"` and opened the selected/required sections plus `PLAN.md` for current task details.

- Active blockers or uncertainty
  - Main blocker: CDP launch/status logic hardcodes or normalizes to `127.0.0.1`/9222 in several paths, so it cannot reliably handle IPv6 loopback fallback, `localhost`, or an alternate CDP port.
  - Manual beta blocker remains: supervised real Amex smoke still needs a tester present for login/MFA and explicit send/approval moments.
  - Release/deployment caveats remain: local macOS artifacts are intentionally unsigned for the no-pay beta path; `v1.0.1` is not update-checking capable, while `v1.0.2` is the first unsigned update-checking baseline.
  - Uncertainty: because this was a read-only eval, I did not run or alter the live desktop app; the CDP conflict diagnosis comes from the saved project context plus static inspection.

- Immediate next step
  - Fix the dashboard/helper CDP launch and status path so the app uses an app-owned non-default CDP port or honors `FLYINGPIG_CDP_PORT`, preserves the requested CDP host instead of forcing `127.0.0.1`, and reports port-ownership conflicts clearly.
  - Concretely, start with `src/agent/browser_runtime.py`, `src/daemon/server.py`, and `dashboard/dashboard.js`: thread host/port through status and launch, stop hardcoding `cdp_port: 9222` in dashboard launch, and avoid rewriting returned/status URLs to `http://127.0.0.1:<port>`.
  - Manual workaround until the fix: launch a separate Chrome CDP window on an alternate port such as 9335 and set the dashboard Browser endpoint to `http://127.0.0.1:9335`, then refresh/start.

- Relevant files
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__progressive-harness/repo/NOW.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__progressive-harness/repo/AGENTS.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__progressive-harness/repo/PLAN.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__progressive-harness/repo/CONTEXT.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__progressive-harness/repo/src/agent/browser_runtime.py` — CDP readiness, launch, `/json` target helpers currently use `127.0.0.1` and default port 9222.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__progressive-harness/repo/src/daemon/server.py` — `/browser/status` and `/browser/launch`; `browser_status_payload()` parses only the port and returns `http://127.0.0.1:<port>`.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__progressive-harness/repo/dashboard/dashboard.js` — dashboard launch hardcodes `cdp_port: 9222`; status refresh uses the Browser endpoint field but receives normalized payloads.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__progressive-harness/repo/desktop/helper_supervisor.js` — desktop supervisor already reads `FLYINGPIG_CDP_PORT`, but downstream dashboard launch still overrides with 9222.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__progressive-harness/repo/src/helper.py` — helper CLI defaults and printed Browser endpoint use `127.0.0.1:<cdp_port>`.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__progressive-harness/repo/scripts/test_helper_dashboard.mjs`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__progressive-harness/repo/desktop/helper_supervisor.test.mjs`

- Verification command/check
  - After implementing the CDP host/port fix, run focused and product-path checks from the case repo:
    `ruff check src scripts tests && pytest tests/unit/test_browser_runtime.py tests/unit/test_daemon_server.py -q && node --test desktop/*.test.mjs && npm run test:dashboard && npm run test:desktop`
  - Also perform one manual/local check for the reported failure mode: start the desktop app/helper with an alternate CDP port such as `FLYINGPIG_CDP_PORT=9335`, click Open Work Window, confirm the dashboard shows Work Window Connected, and confirm `/browser/status?cdp_url=http://127.0.0.1:9335` returns `connected:true` without rewriting to the wrong endpoint.

- Confidence and why
  - Confidence: high for the current focus and next code areas, because `NOW.md`, `PLAN.md`, selected `CONTEXT.md` sections, and static source inspection all point to the same CDP loopback/port-conflict issue.
  - Confidence is slightly reduced only because the required `hydrate` subcommand is unavailable in this repo copy and because no live app smoke was run under the read-only eval constraints.
