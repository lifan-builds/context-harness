# Current understanding

The active work is a closeout/live-verification step, not a new feature implementation. Agent Guild already has a daemon-backed local dashboard (`npm run start` on `127.0.0.1:4173`), hook ingestion commands (`npm run event`, `npm run hook`), and prior Node/Python test coverage. The latest focus is confirming the fixed Codex hook configuration works from a real trusted Codex session and that lifecycle/tool events appear live in the dashboard without manual reload.

The repo-local `.codex/config.toml` uses the current structured Codex hook shape (`hooks.EventName = [{ hooks = [{ type = "command", command = "..." }] }]`). In this eval environment, `codex doctor --summary --ascii` reports config loaded and no failures, but `curl http://127.0.0.1:4173/api/state` is not reachable because the daemon is not running.

# Active blockers or uncertainty

- Start the Agent Guild daemon before live dashboard testing; it is currently not reachable on port `4173`.
- The actual proof still needs to come from a fresh trusted Codex session in the project, not from manual event seeding.
- A nested/cloud-backed Codex smoke may still hit approval or hook-trust policy limits; if so, record that as the remaining blocker rather than changing implementation.
- In this eval copy, hook commands point at `/Users/lfan/Project/agent-guild`; for real verification, confirm the active repo path matches the installed hook target or regenerate/install hooks via the documented setup flow.

# Immediate next step

Run the closeout verification loop:

1. From the real Agent Guild project root, run `npm run start`.
2. Open `http://127.0.0.1:4173` and confirm `/api/state` responds and the dashboard shows daemon-backed sync.
3. In a separate fresh trusted Codex session in the same project, perform a harmless prompt/tool action and then stop the session.
4. Confirm the dashboard receives real Codex lifecycle/hook events such as `session.started`, `prompt.submitted`, tool-derived events from `PostToolUse`, and `session.stopped` through SSE or polling, without a page reload.
5. If events do not appear, inspect hook path/config first, then hook payload normalization, then daemon/store ingestion.

# Relevant files

- `NOW.md` — current focus, blockers, and explicit next step.
- `CONTEXT.md` — durable constraints and architecture: hooks/logs feed provider adapters, normalize into the event bus, then feed server/UI state.
- `.codex/config.toml` — installed Codex hook entries and command paths.
- `package.json` — `start`, `event`, `hook`, `hooks:print`, and `test` commands.
- `docs/hooks.md` — documented manual setup, daemon-first workflow, event kinds, and dashboard live-update expectation.
- `packages/server/hookTemplates.js` — generated hook snippet source and expected command shape.
- `packages/server/server.js` — daemon endpoints, including `/api/state`, `/api/events/stream`, `/api/events`, setup install, and static dashboard serving.
- `apps/web/src/core.js` and UI files under `apps/web/` — inspect only if events arrive at the API but do not render or navigate correctly.

# Verification command/check

Minimum closeout checks:

```bash
codex doctor --summary --ascii
npm run start
curl -fsS http://127.0.0.1:4173/api/state
npm test
pytest codex-task-queue/tests
```

Browser/live check: with the dashboard open, trigger a real fresh Codex session and verify the event count/revision advances, Source Watch reflects live Codex proof, and generated dungeon/inspector/event-feed rows explain the hook events without reload.

Current read-only eval observations:

- `curl -fsS --max-time 2 http://127.0.0.1:4173/api/state` failed: daemon not running.
- `codex doctor --summary --ascii` succeeded with config loaded and `0 fail`; app-server was idle.

# Context Evidence

1. Read `prompt.md` for eval constraints and required answer shape.
2. Read `NOW.md` first: active focus is post-hook-config status check; immediate next step is `npm run start`, open dashboard, start fresh trusted Codex session, confirm real lifecycle hook events.
3. Read `AGENTS.md`: schema v3 Context Contract and Context Index.
4. Read concise `CONTEXT.md`: project purpose, operating constraints, workflow, hook/event/server relationships, learned Codex hook schema lesson.
5. Ran `node scripts/context-index.js hydrate "plan next implementation step"` before opening plan context. Selected cards: `ctx-plan-next-work`, `ctx-plan-current-slice`, `ctx-plan-decisions`, `ctx-plan-findings`, `ctx-plan-goal`, `ctx-plan-verification`, `ctx-now-now`.
6. Opened selected cards: `ctx-plan-next-work`, `ctx-plan-verification`, `ctx-plan-findings`, `ctx-plan-goal`.
7. Inspected `package.json`, `.codex/config.toml`, `docs/hooks.md`, `packages/server/hookTemplates.js`, and `packages/server/server.js`.
8. Ran read-only status checks: `curl` against `/api/state` and `codex doctor --summary --ascii`.

# Confidence and why

Medium-high. The context files, selected plan cards, hook config, scripts, and server endpoints all point to the same next closeout step. Confidence is not higher because the daemon/browser/fresh-Codex loop was not actually run in this read-only eval, so real event delivery remains unproven.