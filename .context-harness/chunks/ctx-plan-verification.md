# Verification

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
