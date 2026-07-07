# Eval Result: Agent Nexus cold resume

## Current understanding
Agent Nexus is a Python 3.10+ single-file CLI (`nexus.py`) for deploying AI-agent environment assets across Claude Code, Cursor, Google Antigravity, and Codex from a central YAML manifest. The current release candidate is ready to push after public Context Harness deployment. The release focus is verified Nexus behavior: one manifest, full asset auto-discovery, hook lifecycle/deduplication, MCP security review and merge behavior, lockfile traceability, target filtering, skill metadata overlays, and Context Harness deployment.

## Active blockers or uncertainty
- No release-blocking implementation or verification blockers are recorded for the local release candidate.
- Non-blocking context-harness drift: `node scripts/context-index.js check` currently reports `FAIL AGENTS.md Context Index is stale; run \`node scripts/context-index.js update\``. This should be treated as a follow-up maintenance item, not a blocker for this read-only catch-up.
- One release follow-up remains: before publishing, ensure any local-only `path: ../context-harness` validation has been switched back to the public repo/ref after Context Harness is pushed.

## Immediate next step
Push the Agent Nexus release changes, then restart AI IDEs or agent hosts if updated skill metadata is not visible.

## Relevant files
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/NOW.md` — current focus, blockers, next step, touched files, and recorded verification.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/CONTEXT.md` — durable project identity, constraints, workflow, relationships, and learned patterns.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/PLAN.md` — release goal, decisions, progress, follow-ups, and verification history.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/nexus.py` — CLI implementation.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/tests/test_nexus.py` — release regression test coverage.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/nexus.example.yml` — public manifest template.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/README.md`, `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/docs/security-model.md`, and `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/docs/demo-transcript.md` — release-facing positioning and security/demo documentation.

## Verification command/check
Recommended pre-push release checks from the project context:

```bash
python3 -m pytest -q -p no:cacheprovider tests/test_nexus.py
python3 -c "import py_compile; py_compile.compile('nexus.py', cfile='/tmp/agent-nexus-nexus.pyc', doraise=True)"
python3 nexus.py sync --dry-run
python3 nexus.py doctor
```

Context maintenance check currently needs follow-up:

```bash
node scripts/context-index.js check
# currently fails: AGENTS.md Context Index is stale
```

## Context Evidence
1. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/prompt.md` for eval instructions.
2. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/NOW.md` first, as required.
3. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/AGENTS.md` for the Context Contract and generated Context Index.
4. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/CONTEXT.md` as the concise always-read context layer.
5. Ran `node scripts/context-index.js hydrate "resume current task"` once from the default session repo by mistake and discarded that output.
6. Re-ran the required hydrate command inside the eval repo: `cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo" && node scripts/context-index.js hydrate "resume current task"`. Correct selected cards: `ctx-context-context-contract`, `ctx-now-now`.
7. Read selected card `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/.context-harness/cards/ctx-context-context-contract.md`.
8. Read selected card `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/.context-harness/cards/ctx-now-now.md`.
9. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/PLAN.md` after hydrate/card review.
10. Ran `cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo" && node scripts/context-index.js check && git status --short`; the check failed before status with stale `AGENTS.md` Context Index.
11. Ran `cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo" && git status --short`; this resolved to the parent `/Users/lfan/Project/context-harness` git repo rather than an independent eval-copy repo, so the parent status was not used as evidence of source edits in the isolated copy.
12. Ran `git -C "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo" rev-parse --show-toplevel`; output was `/Users/lfan/Project/context-harness`.
13. Checked for `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__progressive-harness/repo/.git`; output confirmed `eval repo has no .git`.

## Confidence and why
High confidence in the release status and next action because `NOW.md` and the selected `ctx-now-now` card agree that the release changes are ready to push with no release-blocking blockers, and `PLAN.md` provides matching completed progress and verification history. Medium confidence in generated index freshness because the explicit context check reports stale `AGENTS.md` index data, though that does not change the project catch-up facts needed for this eval. Source-edit sanity check is qualified because the eval repo copy is not an independent git repository; only `result.md` and `trace.md` were intentionally written, outside the repo copy.
