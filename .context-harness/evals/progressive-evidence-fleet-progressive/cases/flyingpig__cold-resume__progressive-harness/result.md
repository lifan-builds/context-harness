# Current understanding

Flying Pig is a desktop-first supervised customer-service automation product. The Electron app starts/supervises the packaged Python helper, the helper serves the dashboard/control plane, and backend Python owns browser-use/CDP policy, LLM calls, run state, safety gates, and evidence capture.

Current focus is the newly implemented minimal MCP-native existing-Chrome path. Flying Pig can now Auto-Connect to an already-open Chrome tab through Chrome DevTools MCP, accept an MCP-selected tab in preflight without a browser-use/CDP handoff URL, send `browser_backend: "mcp"` and `mcp_page` in run payloads, route MCP runs from `AgentBrain` to `McpBrowserExecutor`, and let the dashboard start/HUCA MCP-selected tabs while skipping CDP status checks for MCP starts.

The MCP backend is intentionally narrow: it is for supervised, sensitive, real-browser access with a small allowlist of browser/tool actions, not full browser-use parity.

# Active blockers or uncertainty

- A supervised real Amex beta smoke still requires a tester present for login/MFA and explicit send/approval moments.
- Local macOS desktop artifacts are intentionally unsigned for the no-pay beta path.
- Desktop updates must be described as manual GitHub release downloads/replacements, not automatic in-place updates.
- Published `v1.0.1` is not update-checking capable; `v1.0.2` is the first unsigned beta update-checking baseline.
- The currently running packaged app will not include Connect Existing Chrome, Auto-Connect Existing Chrome, or MCP-native run flows until the desktop app/helper are rebuilt and relaunched.
- MCP-native mode should remain minimal and verified first against local/mock pages before authenticated customer-service use.
- Non-blocking harness drift: running the required hydrate/status checks from the nested eval copy surfaced generated outer context-harness artifacts as modified/untracked in `git status`; this does not change the Flying Pig source understanding but should be followed up separately if the eval harness expects a clean outer repo.

# Immediate next step

If continuing implementation, run a source dashboard/manual smoke against a safe local mock page using Auto-Connect Existing Chrome, select a harmless existing Chrome tab, and start a harmless MCP task from the UI. If preparing for beta instead, rebuild/repackage the desktop app/helper so the packaged app includes the MCP-native flow before any real Amex smoke.

# Relevant files

Repository copy: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/flyingpig__cold-resume__progressive-harness/repo`

- `NOW.md` — current focus, blockers, immediate next step, last verification.
- `CONTEXT.md` — project shape, desktop-first constraints, MCP safety lesson, workflow commands.
- `PLAN.md` — active goal/progress and detailed MCP auto-connect/native backend findings.
- `src/agent/chrome_devtools_mcp.py` — helper-owned Chrome DevTools MCP session/list/select/snapshot integration.
- `src/agent/mcp_executor.py` — minimal MCP-native executor and action allowlist.
- `src/agent/brain.py` — routes `browser_backend="mcp"` runs to the MCP executor.
- `src/agent/run_orchestration.py` — run payload/plan seam carrying backend/page metadata.
- `src/daemon/preflight.py` and `src/daemon/server.py` — preflight and API/WebSocket handling for MCP-selected tabs.
- `dashboard/index.html`, `dashboard/dashboard.js`, `dashboard/dashboard.css` — Auto-Connect Existing Chrome UI and MCP run behavior.
- `tests/unit/test_chrome_devtools_mcp.py`, `tests/unit/test_mcp_executor.py`, `tests/unit/test_run_orchestration.py`, `tests/unit/test_daemon_server.py` — focused MCP/backend coverage.
- `tests/support/dashboard_daemon.py`, `scripts/test_helper_dashboard.mjs`, `scripts/test_dashboard_protocol.mjs` — dashboard/protocol smoke support.

# Verification command/check

Last recorded verification passed:

```bash
pytest tests/unit/test_mcp_executor.py tests/unit/test_run_orchestration.py tests/unit/test_daemon_server.py -q
node --check dashboard/dashboard.js
node --check scripts/test_helper_dashboard.mjs
node scripts/test_dashboard_protocol.mjs
npm run test:dashboard
pytest tests/unit -q
ruff check src tests
git diff --check
```

Additional recorded live sanity check: Chrome DevTools MCP `list_pages` returned existing Chrome tabs, a safe local CLIProxy tab was selected, `McpBrowserExecutor` ran `take_snapshot` then `report_outcome`, returned `success`, and wrote `/tmp/flyingpig-mcp-smoke/mcp_session_20260706_041301.json`.

For the next source-dashboard smoke, use the same focused unit/dashboard commands above plus a manual harmless MCP UI run against a local/mock page. For beta packaging, add `npm run build:helper`, `npm run desktop:package`, and the desktop update verification commands appropriate for the target release.

# Context Evidence

1. Read eval prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/flyingpig__cold-resume__progressive-harness/prompt.md`.
2. Invoked `context-catch-up` skill for the required read-only catch-up procedure.
3. Read first: `repo/NOW.md`.
4. Read context contract/index: `repo/AGENTS.md`.
5. Read concise always-read context: `repo/CONTEXT.md`.
6. Ran required hydrate command from the repo copy: `node scripts/context-index.js hydrate "resume current task"`.
   - Hydrate selected cards: `ctx-context-context-contract` and `ctx-now-now`.
7. Read selected cards before raw bulky context:
   - `repo/.context-harness/cards/ctx-context-context-contract.md`
   - `repo/.context-harness/cards/ctx-now-now.md`
8. Read `repo/PLAN.md` after hydrate and selected cards.
9. Ran read-only sanity check: `git -C <repo> status --short && ls <case-dir>`; observed nested eval copy/outer harness status drift and existing output files.
10. Read existing `result.md` and `trace.md`; both were effectively empty placeholders before writing this answer.

# Confidence and why

High for project focus, blockers, next step, relevant files, and verification commands because `NOW.md`, the selected hydrate card, and the most recent `PLAN.md` entries agree on the MCP-native existing-Chrome state and list the same verification evidence. Medium on packaged-app runtime state because this read-only eval did not launch the app or rerun the smoke; it relies on the recorded context evidence rather than live execution.
