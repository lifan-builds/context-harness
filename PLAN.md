# Context Harness Release Plan

## Goal
Make Context Harness release-ready as a lightweight project-memory layer for
coding agents: small visible context files, clear skill invocation timing,
explicit upgrades, and proof that a fresh agent can resume without a long prompt
dump.

## Current Findings
- Deprecated `context-launch`, `context-handoff`, and `context-grill` stubs are
  removed completely; tests assert those skill files are absent.
- `context-init` is fresh-repo initialization only. Legacy v1, schema v2,
  partial/custom layout repair, and fleet migration route to explicit
  `context-upgrade`.
- `context-catch-up` is only for fresh-session or true-resume boundaries. It
  reports schema drift and does not repair layouts implicitly.
- `set-goal` is the long-running goal/loop workflow and includes goal, context,
  constraints, done criteria, milestones, verification, loop rules, and closeout.
- `context-upgrade` is explicit-only through skill frontmatter and Codex policy
  metadata.
- Public install URLs use `lifan-builds/context-harness` consistently.

## Decisions
- Do not ship hidden compatibility stubs; replacement behavior lives in
  `set-goal`, `context-maintain`, and `context-upgrade`.
- Keep the preferred skill set small: `context-init`, `context-catch-up`,
  `set-goal`, `context-maintain`, and explicit-only `context-upgrade`.
- Keep migration and layout repair out of ordinary catch-up so upgrades happen
  only when the user asks for harness/schema/fleet update work.
- Keep `AGENTS.md` as activation contract plus generated context index; durable
  detail stays in `CONTEXT.md` and active task evidence stays here.

## Progress
- [x] Unified the portable lifecycle contract around selective objective-driven
  catch-up, observed-state closeout, and refresh after source-context changes.
- [x] Added logical Markdown cards, source-attributed query excerpts, stable
  `hydrate --json`, structural `NOW.md` checks, and script-owned index refresh.
- [x] Made schema-2 evaluation distinguish verified structured events from prose
  claims, preserve answer gaps, compare matched pairs, and report unavailable
  evidence truthfully.
- [x] Added Git-inventoried, secret-scanned, budgeted, reusable evaluation
  fixtures plus preflight, inspection, finalization, and retention operations.
- [x] Corrected structural-shadow classifications and retrieval checks; repaired
  four fleet recovery packets so all installed harnesses evaluate cleanly.
- [x] Added exact-hash managed-runtime ownership and a non-destructive fleet
  updater that preserves dirty user work and custom package metadata.
- [x] Updated all 19 installed harness runtimes under `<project-root>`;
  post-apply planning is idempotent except three intentionally preserved custom
  `scripts/package.json` conflicts.
- [x] Deployed the sibling local candidate through Agent Nexus to Claude,
  Cursor, Antigravity, and Codex; all installed catch-up skill hashes match the
  canonical source, 82 Agent Nexus tests pass, and `nexus doctor` passes.
- [x] Restored deterministic dirty-fleet regression coverage and completed the
  final source, preflight, full-suite, index, and 19-repository shadow gates.

## Release Review Checklist

- [x] Reviewed source changes separately from generated `.context-harness/` artifacts.
- [x] Confirmed Git inventory, private-path exclusions, secret scanning, and byte
  budgets fail closed before evaluation copies are prepared.
- [x] Confirmed stale generated context is a visible follow-up unless it blocks
  correctness or safety.
- [x] Ran targeted tests, full `tests/run-all.sh`, index check, five-repository
  evaluation preflight, Agent Nexus canary, and full fleet shadow.
- [x] Updated dirty repositories only within exact managed boundaries; preserved
  unrelated work and recorded intentional conflicts without commit or push.

## Follow-Ups
- Restart AI IDEs or agent hosts so frontmatter and skill metadata are reloaded
  after the local Agent Nexus deployment.
- Later, consider optional plugin packaging and richer qualitative fresh-agent
  eval prompts, but do not block this release on those.

## Verification
- `tests/run-all.sh` passes: 222 passed, 0 failed, 0 skipped.
- `tests/run-all.sh install-project` passes its 9 focused checks, including
  sanitized fleet identifiers and preservation of custom metadata plus unrelated
  dirty work.
- `node scripts/eval-agent-problem-solving.js preflight <project-root>
  --repos context-harness,agent-nexus,wishlist,moonshot,seasonal-arpg-engine
  --scenarios cold-resume,next-step --modes
  no-harness,flat-harness,progressive-harness` passes within the run budget with
  15 shared snapshots and 30 linked read-only cases; sensitive matches are excluded.
- Final structural shadow: 27 repositories discovered, 19 installed harnesses
  evaluated, 100% coverage, 19 pass, 0 fail, 0 malformed, 0 error.
- Fleet apply: 19 installed harnesses discovered, 18 changed, 1 unchanged,
  3 intentional custom-package conflicts, 0 failures; final dry-run reports
  0 changes, 16 unchanged, and the same 3 preserved conflicts.
- Agent Nexus: 82 tests pass; local-candidate dry-run/apply and doctor pass;
  canonical catch-up skill hashes match on Claude, Cursor, Antigravity, and Codex.
- Historical behavioral evidence remains available in the private eval runs:
  57/57 progressive cases passed the prior gate, and earlier matched real-agent
  batches showed no post-fix progressive regression. The final five-repository
  check is a privacy/storage preflight, not a new claim of agent behavior.

## Archive
- June 2026 research compared Context Harness with Karpathy-style skill
  principles, Superpowers, AGENTS.md conventions, auto-memory/dream patterns,
  and lightweight agent-memory projects. The useful durable direction remains:
  keep the harness small, use progressive disclosure, prefer visible markdown,
  route current evidence to `PLAN.md`, and use model-led Dream/Compact only when
  it materially improves future catch-up.
- Earlier schema v3 work deprecated default project-wide Objectives, moved
  command verification into `CONTEXT.md#Workflow`, kept legacy eval tooling under
  an optional profile, added `context-index.js check`, and added
  `migrate-project.js` for schema v2 migration.
- Earlier local deployment and fleet migration notes are historical. Current
  release verification should rely on the commands listed above plus a fresh
  Agent Nexus dry run or sync against the local release candidate.
