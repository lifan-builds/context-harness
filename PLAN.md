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
- [x] Updated README positioning around four visible files, progressive
  disclosure, companion skills, and proof artifacts.
- [x] Added `RELEASE_GOAL.md` for repo-local release readiness.
- [x] Added `examples/cold-resume-demo.md` showing `NOW.md` first, `AGENTS.md`
  index second, selective `CONTEXT.md` sections, `PLAN.md` task state, and the
  next verification action.
- [x] Updated root and companion skill docs for `set-goal`, explicit-only
  `context-upgrade`, fresh-session-only `context-catch-up`, and fresh-repo-only
  `context-init`.
- [x] Updated Codex hook nudges to route drift to `context-catch-up` summary plus
  explicit `context-upgrade`, not implicit repair.
- [x] Added release-proof tests for catch-up timing, maintain routing,
  Dream/Compact ownership, explicit-only upgrade metadata, set-goal headings,
  removed deprecated stubs, and the cold-resume demo artifact.

## Follow-Ups
- Restart AI IDEs or agent hosts so frontmatter and skill metadata are reloaded
  after the local Agent Nexus deployment.
- Later, consider optional plugin packaging and a small eval fixture set for
  high-risk skills, but do not block this release on those.

## Verification
- `tests/run-all.sh` exits 0 with 206 passed, 0 failed.
- `node scripts/context-index.js check` exits 0 after this compacted plan.
- Agent Nexus `sync --dry-run` against the sibling local Context Harness release
  candidate discovers 6 Context Harness skills, including `set-goal`, and no
  removed stubs.
- Agent Nexus `sync --yes` deployed the sibling local Context Harness release
  candidate and pruned removed `context-launch`/`context-handoff` symlinks from
  all configured targets.
- Agent Nexus `doctor` exits 0 after local deployment.

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
