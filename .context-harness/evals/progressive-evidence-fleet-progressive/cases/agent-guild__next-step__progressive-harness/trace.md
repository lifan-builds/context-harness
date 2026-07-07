Evidence notes for fresh-agent eval:

- Read `prompt.md` first to capture eval scope: work only in case directory, use `repo/` as project root, do not edit repo source, write `result.md`/`trace.md` only.
- Read `repo/NOW.md` first as required. Key facts: no active config blocker; daemon not reachable in prior check; immediate next step is start `npm run start`, open dashboard, start fresh trusted Codex session, confirm real lifecycle hook events.
- Read `repo/AGENTS.md` and `repo/CONTEXT.md`. Both have `<!-- context-harness:schema v3 -->`; `CONTEXT.md` is concise enough for direct always-read use.
- Ran hydrate before plan/chunk access: `cd ".../repo" && node scripts/context-index.js hydrate "plan next implementation step"`.
- Hydrate selected cards: `ctx-plan-next-work`, `ctx-plan-current-slice`, `ctx-plan-decisions`, `ctx-plan-findings`, `ctx-plan-goal`, `ctx-plan-verification`, `ctx-now-now`.
- Opened selected cards before any raw plan context: `ctx-plan-next-work`, `ctx-plan-verification`, `ctx-plan-findings`, `ctx-plan-goal`. Did not need raw chunks.
- Inspected implementation/config files read-only: `package.json`, `.codex/config.toml`, `docs/hooks.md`, `packages/server/hookTemplates.js`, `packages/server/server.js`.
- Ran read-only checks:
  - `curl -fsS --max-time 2 http://127.0.0.1:4173/api/state` -> not reachable; daemon not running.
  - `codex doctor --summary --ascii` from eval repo -> config loaded, auth configured, 0 fail, app-server idle.
- Did not read `expected.json`, `score.json`, run `manifest.json`, or eval reports.

Save/update routing I would perform after real closeout verification:

- Update `NOW.md` with daemon/browser/Codex-session outcome, remaining blocker if any, and touched verification files.
- Update `PLAN.md` Verification with the live dashboard + Codex lifecycle hook result, including commands and observed event kinds/revision changes.
- Update `PLAN.md` Next Work only if verification reveals a concrete follow-up.
- Update `CONTEXT.md` only for a durable new invariant or lesson, not for ordinary task-local status.