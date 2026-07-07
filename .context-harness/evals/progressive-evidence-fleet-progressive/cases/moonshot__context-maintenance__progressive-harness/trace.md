# Trace notes

- Read eval prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/moonshot__context-maintenance__progressive-harness/prompt.md`.
- Read `repo/NOW.md` first. Key evidence: mission-loop slice completed; `agent:daily-moonshot` default is now `mission-loop`; no-order boundary preserved; verification commands passed; touched files and July 6 generated artifact families listed.
- Ran hydrate from the repo root:
  - Command: `cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/moonshot__context-maintenance__progressive-harness/repo && node scripts/context-index.js hydrate "update context after completed task"`
  - Output selected 7 cards, estimated raw tokens `~36173`:
    - `ctx-now-now`
    - `ctx-plan-current-planning-focus`
    - `ctx-plan-progress`
    - `ctx-plan-session-state`
    - `ctx-context-relationships`
    - `ctx-context-operating-constraints`
    - `ctx-plan-2026-07-01-repo-cleanup-and-generated-artifact-prune`
- Opened selected cards before raw bulky sections.
- Used `CONTEXT.md` selectively because it is large. Read sections/headings around Project, Structure, Operating Constraints, Workflow, Language, Relationships, Flagged Ambiguities, Learned Patterns. Noted durable stale references: Daily Moonshot Supervisor/Operator entries still say `shared-process` default while current implementation says `mission-loop`.
- Read `CONTEXT-MAP.md`; relevant task pack is `docs/context/active-stock.md` for Daily Moonshot/active Agentic context, with artifact policy pack potentially relevant for generated validation artifacts.
- Read selected `PLAN.md` sections: Current Planning Focus, Progress, Active Blockers, Immediate Next Step, Session State. Evidence: `PLAN.md` still mostly reflects July 5/June 25 and needs a July 6 mission-loop progress/session update.
- Read `AGENTS.md` context contract. Routing rule used: task-local findings and decisions to `PLAN.md`; durable lessons/invariants to `CONTEXT.md`; run `node scripts/context-index.js update` after `CONTEXT.md`; update `NOW.md` before ending.
- Read-only commands used:
  - `ls` repo root and `.context-harness/cards`.
  - `grep -n "^##" CONTEXT.md` and `PLAN.md` for section navigation.
  - `ls src/lib/agents/daily-moonshot` and `ls src/lib/research | grep '^moonshot'` to confirm mission-loop/dossier/risk/paper-trade modules exist.
  - `node -e` over `package.json` to list relevant scripts.
  - `grep` for `mission-loop`, `shared-process`, `orchestrator`, `dossier`, `risk gate`, and `paper-trade` across relevant docs/scripts/tests.
- Note: an initial hydrate command was run without changing into the case repo, which returned the parent context-harness cards. I discarded that output and reran hydrate from the case repo root; only the repo-root hydrate informed the result.

# Save/update routing I would perform

- `NOW.md`: keep as short current handoff; update again only after commit/continue decision changes focus, blockers, next step, or touched files.
- `PLAN.md`: add July 6 mission-loop completion/progress/session-state; update stale blockers/next step; record passed verification and touched files.
- `CONTEXT.md`: update durable Daily Moonshot language/invariants to mission-loop default, shared-process legacy, research-only mission artifacts, no-order boundary, `missionLoop` in `report.json`, source-before-final freshness rule, and Action Readiness mission-state fields.
- `skills/daily-moonshot-operator/SKILL.md`, `docs/process/daily-moonshot-operator.md`, `docs/context/active-stock.md`, and possibly `docs/plans/2026-06-22-agent-planning-layer.md`: sync stale `shared-process` default language and mission-loop artifact contracts.
- `.context-harness/index.json` and `.context-harness/cards/*`: regenerate with `node scripts/context-index.js update`; do not hand-edit.
- Generated July 6 `research/**` artifacts: keep as validation outputs unless promoted to durable research/decision.

# Verification to run after updates

1. `node scripts/context-index.js update`
2. `node scripts/context-index.js hydrate "update context after completed task"`
3. `npm run typecheck`
4. `npx vitest run tests/agents/daily-moonshot-supervisor.test.ts`
5. `npm run test:e2e:daily-moonshot-agentic -- --date 2026-07-06 --target-date 2026-07-06 --supervisor-orchestrator mission-loop --require-agent-review --refresh-source-artifacts`
6. `npm run validate:daily-moonshot-final -- --target-date 2026-07-06`
7. `git diff --check`
