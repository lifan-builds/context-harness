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
- [x] Added progressive context library support in `scripts/context-index.js`:
  generated retrieval cards/chunks under `.context-harness/`, `hydrate` selection,
  `stats`, stale manifest checks, and pruning stale generated markdown.
- [x] Added `scripts/eval-context-library.js` for shadow-testing context library
  behavior against temporary copies of real repositories under `/Users/lfan/Project/`.
- [x] Used shadow evaluation to tighten retrieval hints and duplicate-heading card IDs
  until 19 context-enabled repos passed with 0 warnings/failures and 5 repos skipped
  for missing `CONTEXT.md`.
- [x] Added `scripts/eval-agent-problem-solving.js` to prepare and score
  fresh-agent problem-solving evals comparing `no-harness` vs
  `progressive-harness` modes with isolated repo copies, expected facts,
  judge prompts, and scoring reports.
- [x] Ran 10 real-world fresh-agent evaluation pairs across `agent-nexus`,
  `context-harness`, `credit-card-tracker`, `flight-plan`, and `flyingpig`,
  then wrote `.context-harness/evals/manual-realworld-10/top-gaps.md` with the
  top five design gaps.
- [x] Focused the next fixes on the user's priorities: prevent harness-health
  drift from hijacking project tasks, tighten lexical eval scoring, and route
  stale competing project docs toward cleanup/archive rather than prioritizing
  workflow/setup salience.
- [x] Replaced the project `Rules` / `Never` / `Always` taxonomy with
  Karpathy-style `Operating Constraints`: compact project-specific constraints
  that change agent decisions, while generic behavior remains in the root skill.
- [x] Ran a second 10-pair real-world eval batch under
  `.context-harness/evals/operating-constraints-10`; progressive-harness improved
  all 10 pairs with a 9.1/10 average versus 6.9/10 for no-harness.
- [x] Pushed `ed7e2f9` to `origin/main`, deployed the release locally with Agent
  Nexus, and verified `nexus doctor` passes.
- [x] Ran the one-time local fleet upgrade across 32 applicable repos under
  `/Users/lfan/Project`: 31 legacy `Rules` sections converted to
  `Operating Constraints`, 32 repos got latest runtime scripts/index refresh, and
  follow-up verification found 0 remaining `Rules`/schema issues.
- [x] Re-ran post-migration real-world evals under
  `.context-harness/evals/fleet-upgrade-10`; progressive-harness averaged 9.1/10
  versus 7.0/10 for no-harness, improving 8/10 pairs with 2 ties and no
  regressions.
- [x] Removed obsolete legacy tooling now that the local fleet is on current v3:
  deleted `scripts/adr.js`, `scripts/eval-loop.js`, and
  `scripts/migrate-project.js`; removed the legacy install profile; tightened
  schema checks to v3-only; and updated docs/skills/tests accordingly.
- [x] Completed the 57-case progressive evidence fleet eval under
  `.context-harness/evals/progressive-evidence-fleet-progressive`; all cases are
  filled and the gate passes after separating high-scoring answer-only review
  notes from release-blocking retrieval/save/order gaps.
- [x] Closed the remaining release gaps: `eval-agent-problem-solving.js` now has
  idempotent `fill-pending` retry/resume support, eval copies exclude obvious
  private files, semantic expected-fact matching is less phrase-brittle, stale
  hydrate output avoids pointing at stale generated cards, and upgrade docs now
  spell out conservative fleet-refresh guardrails.

## Release Review Checklist

- Review source changes separately from generated `.context-harness/` artifacts.
- Confirm eval-copy exclusions prevent `.env`, `.env.*`, `cookies.txt`, and key
  material from entering case repos.
- Confirm stale generated context is reported as a follow-up unless it blocks
  correctness or safety.
- Before deployment, run targeted suites, full `tests/run-all.sh`,
  `node scripts/context-index.js check`, and the progressive fleet gate.
- For fleet refresh, inspect repo status first, skip dirty repos by default,
  record skipped/failed targets, and push only intentionally changed repos.

## Follow-Ups
- Restart AI IDEs or agent hosts so frontmatter and skill metadata are reloaded
  after the local Agent Nexus deployment.
- Later, consider optional plugin packaging and richer qualitative fresh-agent
  eval prompts, but do not block this release on those.

## Verification
- `tests/run-all.sh` exits 0 with 211 passed, 0 failed after adding minimal fresh-agent eval harness coverage.
- `node scripts/context-index.js check` exits 0 after refreshing generated cards/index.
- `node scripts/eval-context-library.js /Users/lfan/Project .context-harness/shadow-context-library-report.md` exits 0: 24 repos found, 19 passed, 0 warned, 0 failed, 5 skipped for missing `CONTEXT.md`.
- `node scripts/eval-agent-problem-solving.js prepare ...` plus `score` smoke exits 0 in a temporary eval run, confirming paired cases and pending-score reports work.
- `node scripts/eval-agent-problem-solving.js prepare /Users/lfan/Project --repos context-harness,agent-nexus,credit-card-tracker,flyingpig,flight-plan --scenarios cold-resume,next-step --output .context-harness/evals/manual-realworld-10` prepared 20 cases; fresh agents filled all results; `node scripts/eval-agent-problem-solving.js score .context-harness/evals/manual-realworld-10` initially showed progressive-harness averaging 8.2/10 vs no-harness 6.6/10, with improvement in 8/10 pairs, one tie, and one regression.
- After tightening `mustAvoid` exact phrase scoring, rescoring `.context-harness/evals/manual-realworld-10` removed DREAM false positives and changed the `flight-plan` next-step regression to a tie, while preserving the qualitative lesson that harness-health drift can distract from product work.
- `tests/run-all.sh eval-agent-problem-solving` exits 0 with 3 passed, including coverage that expected rules use semantic bullets instead of `### Never` headings and progressive prompts keep harness drift as a follow-up.
- `tests/run-all.sh skill-packaging` exits 0 with 34 passed after context-maintain doc cleanup guidance changed.
- `tests/run-all.sh` exits 0 with 212 passed, 0 failed.
- `node scripts/eval-context-library.js /Users/lfan/Project .context-harness/shadow-context-library-report.md` exits 0 after Operating Constraints changes: 24 repos found, 19 passed, 0 warned, 0 failed, 5 skipped.
- `node scripts/eval-agent-problem-solving.js prepare /Users/lfan/Project --repos context-harness,agent-nexus,credit-card-tracker,flyingpig,flight-plan --scenarios cold-resume,next-step --output .context-harness/evals/operating-constraints-10` prepared 20 cases; fresh agents filled all results; `node scripts/eval-agent-problem-solving.js score .context-harness/evals/operating-constraints-10` showed progressive-harness averaging 9.1/10 vs no-harness 6.9/10, improving all 10 pairs with no regressions.
- Agent Nexus `sync --dry-run` against the sibling local Context Harness release
  candidate discovers 6 Context Harness skills, including `set-goal`, and no
  removed stubs.
- Agent Nexus `sync --yes` deployed the sibling local Context Harness release
  candidate and pruned removed `context-launch`/`context-handoff` symlinks from
  all configured targets.
- After publishing, Agent Nexus `sync --yes` fetched
  `lifan-builds/context-harness@main` from GitHub and deployed it locally.
- Agent Nexus `doctor` exits 0 after local deployment.
- After legacy tooling cleanup, targeted suites `tests/run-all.sh install-project`,
  `context-index`, `codex-context-hook`, `skill`, and `skill-packaging` pass; full
  `tests/run-all.sh` passes with 185 passed, 0 failed; `node scripts/context-index.js check` passes.
- `node scripts/eval-agent-problem-solving.js score .context-harness/evals/progressive-evidence-fleet-progressive --gate` passes across 57 progressive-harness cases: all completed, 9.6/10 average, 100% hydrate evidence, 0 card/chunk order violations, 0 flat-overuse violations, 100% save-routing evidence, and 0 harness-drift hijacks; answer-only review notes remain non-blocking when retrieval/save/order evidence is strong.
- `node scripts/eval-agent-problem-solving.js fill-pending .context-harness/evals/progressive-evidence-fleet-progressive --modes progressive-harness --dry-run` reports 0 pending cases.
- `tests/run-all.sh eval-agent-problem-solving` passes with 12 passed after adding `fill-pending`, private-file exclusion, semantic scoring, answer-only review note, and strict `mustAvoid` coverage.
- `tests/run-all.sh context-index` passes with 23 passed after adding stale-hydrate warning coverage.
- `tests/run-all.sh release-proof` passes with 37 passed after adding stale generated context and fleet-refresh guardrail coverage.
- Full `tests/run-all.sh` passes with 217 passed, 0 failed after the remaining-gap fixes.
- `node scripts/context-index.js check` passes after the remaining-gap fixes, with the existing PLAN.md length warning.

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
