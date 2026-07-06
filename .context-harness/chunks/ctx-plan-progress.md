# Progress

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
