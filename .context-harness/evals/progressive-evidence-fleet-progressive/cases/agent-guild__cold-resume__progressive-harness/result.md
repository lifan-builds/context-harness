# Eval Result: agent-guild cold resume

## Current understanding
Agent Guild is a local-first, monitor-first coding-agent observability app with a pixel JRPG/roguelike presentation. The current focus is a status check after fixing Codex hook configuration. The repo-local `.codex/config.toml` uses the current structured root-level hook shape, `hooks.EventName = [{ hooks = [{ type = "command", command = "..." }] }]`, and `codex doctor --summary --ascii` from the eval repo reports `[ok] config loaded`, `[ok] auth`, `[ok] state`, `[ok] reachability`, and `0 fail`.

The remaining product check is not a source-editing task: start the Agent Guild daemon, open the dashboard, and confirm real Codex lifecycle hook events flow into the live UI through the normal event path.

## Active blockers or uncertainty
- No active Codex config blocker was found.
- The dashboard daemon is not currently running: `curl http://127.0.0.1:4173/api/state` failed to connect, and `codex doctor --summary --ascii` reports `app-server not running (ephemeral mode)`.
- Live dashboard verification remains undone until `npm run start` is running and a trusted Codex session emits events.
- `NOW.md` still mentions managed-shell terminal/reachability failures from an earlier 2026-06-19 status check, but the current doctor run reports terminal and reachability OK; that looks like stale context to update later, not a blocker for this read-only eval.
- A nested real `codex exec` cloud-backed smoke run may still require approval if it uses hook-trust bypass against local workspace contents/metadata.

## Immediate next step
Run `npm run start`, open `http://127.0.0.1:4173`, then start a fresh trusted Codex session in `/Users/lfan/Project/agent-guild` and confirm the dashboard receives real lifecycle hook events without manual reload.

## Relevant files
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-guild__cold-resume__progressive-harness/repo/NOW.md` — current focus, blockers, and next step.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-guild__cold-resume__progressive-harness/repo/CONTEXT.md` — durable project scope, constraints, workflow, and Agent Guild event/dashboard invariants.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-guild__cold-resume__progressive-harness/repo/AGENTS.md` — context contract and generated index instructions.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-guild__cold-resume__progressive-harness/repo/.context-harness/cards/ctx-now-now.md` — selected resume card from hydrate.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-guild__cold-resume__progressive-harness/repo/.codex/config.toml` — current Codex hook block.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-guild__cold-resume__progressive-harness/repo/package.json` — `npm run start`, `npm run event`, `npm run hook`, `npm run hooks:print`, and `npm test` scripts.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-guild__cold-resume__progressive-harness/repo/docs/hooks.md` — hook setup and live dashboard verification guide.

## Verification command/check
Primary live check:

```bash
cd /Users/lfan/Project/agent-guild && npm run start
# Open http://127.0.0.1:4173, then start a fresh trusted Codex session in /Users/lfan/Project/agent-guild.
# Confirm /api/events/stream or /api/state updates and the dashboard shows real Codex lifecycle hook events.
```

Supporting checks:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-guild__cold-resume__progressive-harness/repo && codex doctor --summary --ascii
curl -sS --max-time 2 http://127.0.0.1:4173/api/state
npm test
```

Observed during this eval: `codex doctor --summary --ascii` passed config/auth/reachability with `0 fail`; the `/api/state` curl probe was not reachable because the daemon was not running.

## Context Evidence
1. Read eval prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-guild__cold-resume__progressive-harness/prompt.md`.
2. Loaded `context-catch-up` skill for the eval repo instructions.
3. Read `NOW.md` first: current focus is post-Codex-hook-config status check; next step is daemon + live dashboard hook verification.
4. Read concise `CONTEXT.md`: schema v3; confirmed Agent Guild scope, constraints, workflow, and relationships.
5. Read `AGENTS.md`: schema v3; confirmed context contract and hydrate-before-plan/chunk instruction.
6. Ran corrected eval-repo hydrate: `cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-guild__cold-resume__progressive-harness/repo && node scripts/context-index.js hydrate "resume current task"`. Hydrate output selected card `ctx-now-now` only.
7. Read selected card `.context-harness/cards/ctx-now-now.md`: confirmed no active config blocker, daemon not reachable, and live dashboard testing pending.
8. Read `.codex/config.toml`: confirmed structured root-level hook entries for SessionStart, UserPromptSubmit, PostToolUse, PermissionRequest, SubagentStart, SubagentStop, and Stop.
9. Read `package.json`: confirmed `start`, `event`, `hook`, `hooks:print`, and `test` scripts.
10. Ran `curl -sS --max-time 2 http://127.0.0.1:4173/api/state`: failed to connect; daemon not running.
11. Ran `codex doctor --summary --ascii` from the eval repo: config loaded, auth configured, reachability OK, app-server idle, `0 fail`.
12. Read `docs/hooks.md`: confirmed daemon-first hook validation, Signal Setup, event fallback, and SSE/polling dashboard behavior.

Note: an initial hydrate command was accidentally run from `/Users/lfan/Project/context-harness` because the background shell resets cwd; that output was ignored and the exact hydrate command was rerun from the eval repo before using selected cards.

## Confidence and why
High. The current focus and next step are directly stated in `NOW.md` and the selected hydrate card, the structured Codex hook shape was verified in `.codex/config.toml`, package scripts and hook workflow were verified in `package.json` and `docs/hooks.md`, and live state was checked with read-only `curl` and `codex doctor` commands. The only uncertainty is live event delivery, which requires starting the daemon and a trusted Codex session rather than editing source files.
