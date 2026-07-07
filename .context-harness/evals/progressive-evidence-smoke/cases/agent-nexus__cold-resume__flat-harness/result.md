# Current understanding

Agent Nexus is a Python 3.10+ single-file CLI for managing AI agent environments across Claude Code, Cursor, Google Antigravity, and Codex from one manifest. The current project focus is release readiness: the local release candidate is already verified and is ready to push now that public Context Harness deployment has happened. The release work emphasizes verified Nexus behavior: asset auto-discovery, hook lifecycle/deduplication, MCP review and merge, target filtering, lockfile traceability, skill metadata overlays, and Context Harness deployment.

# Active blockers or uncertainty

No release-blocking implementation or verification blockers are recorded for the local release candidate. Remaining uncertainty/follow-up is operational rather than implementation-blocking: after pushing, restart AI IDEs or agent hosts if updated skill metadata is not visible. The Go rewrite remains a future milestone with unsettled scaffold/package/release details, but it is explicitly not required for this release.

# Immediate next step

Push the Agent Nexus release changes. After the push, restart AI IDEs or agent hosts if they do not show updated skill metadata.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__flat-harness/repo/NOW.md` — current focus, blockers, next step, touched files, and recorded verification.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__flat-harness/repo/PLAN.md` — release goal, completed release work, follow-ups, and verification details.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__flat-harness/repo/CONTEXT.md` — project identity, structure, operating constraints, workflow, relationships, and learned patterns.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__flat-harness/repo/AGENTS.md` — context contract and flat context index.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__flat-harness/repo/nexus.py` — CLI implementation referenced by context and verification.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__flat-harness/repo/tests/test_nexus.py` — regression test target referenced by verification.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__flat-harness/repo/nexus.example.yml` — public template manifest.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__flat-harness/repo/nexus.personal.yml` and `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__flat-harness/repo/nexus.personal.lock.yml` — active local manifest and resolved deployment metadata referenced by context.

# Verification command/check

Recorded release checks are:

```sh
python3 -m pytest -q -p no:cacheprovider tests/test_nexus.py
python3 -c "import py_compile; py_compile.compile('nexus.py', cfile='/tmp/agent-nexus-nexus.pyc', doraise=True)"
python3 nexus.py sync --dry-run
python3 nexus.py sync --yes
python3 nexus.py doctor
node scripts/context-index.js check
```

For a final pre-push read-only confidence check, run the non-mutating subset from the repo root:

```sh
python3 -m pytest -q -p no:cacheprovider tests/test_nexus.py && python3 -c "import py_compile; py_compile.compile('nexus.py', cfile='/tmp/agent-nexus-nexus.pyc', doraise=True)" && python3 nexus.py sync --dry-run && python3 nexus.py doctor && node scripts/context-index.js check
```

# Context Evidence

- `NOW.md` states the current focus: “Agent Nexus release changes are ready to push after public Context Harness deployment.”
- `NOW.md` states there are no release-blocking implementation or verification blockers.
- `NOW.md` states the immediate next step is to push release changes, then restart AI IDEs or agent hosts if skill metadata is not visible.
- `NOW.md` records touched files and the main verification commands.
- `PLAN.md` states the release goal: make Agent Nexus release-ready as a trustworthy deployment layer that shows what it writes, preserves local config, complements native tools, and supports verification before touching target IDE config.
- `PLAN.md` lists completed release work including README/release positioning, `nexus init`, docs, target/skill overrides, MCP merge hardening, optional MCP lockfile semantics, Codex TOML pruning, and local manifest updates.
- `PLAN.md` records that tests, compile check, dry-run sync, real sync, doctor, and context index check passed.
- `CONTEXT.md` defines the project as a centralized agent environment manager for skills, hooks, and MCP servers across Claude Code, Cursor, Google Antigravity, and Codex.
- `CONTEXT.md` operating constraints include full asset auto-discovery, MCP security review before global IDE config writes, PyYAML as the only `nexus.py` runtime dependency, hook deduplication, preserving MCP local secrets, immutable commit-SHA package cache, successful sync/doctor, and no duplicate IDE hooks.
- `AGENTS.md` confirms the flat context contract and index, with `NOW.md`, `CONTEXT.md`, and `PLAN.md` as the relevant context files.

# Confidence and why

High. The required flat context files were present and internally consistent: `NOW.md` gives the current focus/blockers/next step, `PLAN.md` corroborates completed release work and verification, `CONTEXT.md` supplies operating constraints and project structure, and `AGENTS.md` confirms the context contract. I did not use cards/chunks/hydration and did not edit repository source files.