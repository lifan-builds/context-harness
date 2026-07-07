# Current understanding

Agent Nexus is a Python 3.10+ single-file CLI (`nexus.py`) for centralizing AI agent environment configuration across Claude Code, Cursor, Google Antigravity, and Codex. It deploys skills, hooks, commands/agents, and MCP servers from YAML manifests while preserving local MCP secrets and deduplicating hooks. The current focus is release readiness: local Agent Nexus release changes are ready to push after the public Context Harness deployment.

# Active blockers or uncertainty

- No release-blocking implementation or verification blockers remain for the local release candidate, according to `NOW.md` and the selected NOW card.
- Follow-up: `node scripts/context-index.js check` currently fails with `FAIL AGENTS.md Context Index is stale; run node scripts/context-index.js update`. Because this is a read-only eval, I did not run update or modify context files.
- The repo copy is nested under the surrounding `context-harness` repository, so `git status --short` from the copy reports parent/eval harness paths rather than a clean standalone source-state signal.

# Immediate next step

Push the Agent Nexus release changes, then restart AI IDEs or agent hosts if updated skill metadata is not visible.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/repo/NOW.md` — current focus, blockers, next step, touched files, recorded verification.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/repo/CONTEXT.md` — durable project constraints and architecture facts.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/repo/AGENTS.md` — context contract and generated index, currently stale per check.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/repo/nexus.py` — CLI implementation.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/repo/tests/test_nexus.py` — main release test file recorded in NOW.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/repo/README.md`, `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/repo/docs/security-model.md`, `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/repo/docs/demo-transcript.md`, and `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/repo/nexus.example.yml` — release-facing docs/template touched in the current release candidate.

# Verification command/check

Recorded release verification in `NOW.md`:

```sh
python3 -m pytest -q -p no:cacheprovider tests/test_nexus.py
python3 -c "import py_compile; py_compile.compile('nexus.py', cfile='/tmp/agent-nexus-nexus.pyc', doraise=True)"
python3 nexus.py sync --dry-run
python3 nexus.py sync --yes
python3 nexus.py doctor
node scripts/context-index.js check
```

For a final pre-push check, rerun at least:

```sh
python3 -m pytest -q -p no:cacheprovider tests/test_nexus.py && python3 nexus.py doctor
```

Context-harness check currently needs follow-up because `node scripts/context-index.js check` reports a stale `AGENTS.md` Context Index.

# Context Evidence

1. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/prompt.md` to load the eval task and constraints.
2. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/repo/NOW.md` for resume state.
3. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/repo/AGENTS.md` for context contract and index.
4. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/repo/CONTEXT.md` directly because it is concise enough for the always-read layer.
5. Ran `cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/repo && node scripts/context-index.js hydrate "resume current task"`.
   - Hydrate selected cards: `ctx-context-context-contract` and `ctx-now-now`.
6. Read selected card `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/repo/.context-harness/cards/ctx-context-context-contract.md`.
7. Read selected card `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/repo/.context-harness/cards/ctx-now-now.md`.
8. Ran `cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/repo && node scripts/context-index.js check`; it failed with stale `AGENTS.md` Context Index.
9. Ran `git -C /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__cold-resume__progressive-harness/repo status --short`; output reflected surrounding parent/eval harness paths because the repo copy is nested.

# Confidence and why

Confidence: high for the current focus, blockers, immediate next step, and release verification commands because `NOW.md`, `CONTEXT.md`, and the hydrate-selected NOW card agree. Confidence is slightly reduced for git working-tree interpretation because the eval copy is nested inside a parent repository and `AGENTS.md` index health is stale, but neither issue blocks the read-only catch-up summary.
