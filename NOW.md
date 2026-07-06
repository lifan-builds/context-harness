# Now

## Current Focus
Operating Constraints replaced the project Rules/Never/Always taxonomy in the working tree, and the second 10-pair real-world eval shows progressive-harness improving all 10 pairs.

## Active Blockers
- No code or context-health blockers are known.

## Immediate Next Step
Review the Operating Constraints diff, then decide whether to run the one-time fleet migration from legacy Rules/Never/Always to Operating Constraints before commit/push and local deployment.

## Session State
- Last modified: 2026-07-06T03:40:00-0700
- Files touched: AGENTS.md, CONTEXT.md, README.md, SKILL.md, context-catch-up/SKILL.md, context-init/SKILL.md, context-maintain/SKILL.md, context-upgrade/SKILL.md, examples/cold-resume-demo.md, scripts/context-gen.js, scripts/context-index.js, scripts/eval-context-library.js, scripts/eval-agent-problem-solving.js, tests/run-all.sh, PLAN.md, NOW.md, .context-harness/index.json, .context-harness/cards/*, .context-harness/chunks/*, .context-harness/shadow-context-library-report.md, .context-harness/evals/manual-realworld-10/*, .context-harness/evals/operating-constraints-10/*
- Verification: `tests/run-all.sh context-gen`; `tests/run-all.sh context-index`; `tests/run-all.sh eval-agent-problem-solving`; `tests/run-all.sh skill`; `tests/run-all.sh skill-packaging`; `tests/run-all.sh` (212 passed, 0 failed); `node scripts/context-index.js check`; `node scripts/eval-context-library.js /Users/lfan/Project .context-harness/shadow-context-library-report.md` (24 repos, 19 pass, 0 warn, 0 fail, 5 skip); `node scripts/eval-agent-problem-solving.js score .context-harness/evals/operating-constraints-10` (progressive 9.1/10 vs no-harness 6.9/10, improved 10/10 pairs).
